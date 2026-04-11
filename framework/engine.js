/**
 * 多维度计分引擎
 * 支持：SBTI四维 + BigFive五维 + 自定义维度
 */

class ScoringEngine {
  constructor() {
    // 计分规则
    this.rules = {
      // 选项分数 = 原始分 → 标准化百分比
      normalize: (raw) => Math.round((raw / 5) * 100),
      // SBTI维度计分
      sbti: {
        Energy:      { E: [4,5], I: [1,2] },   // 外向/内向
        Awareness:   { N: [4,5], S: [1,2] },   // 直觉/感觉
        Decision:    { F: [4,5], T: [1,2] },   // 情感/思考
        Execution:   { J: [1,2], P: [4,5] }   // 判断/知觉
      }
    };
  }

  /**
   * 计算SBTI四字母类型
   * @param {Object} answers - { questionId: selectedOptionScore }
   * @param {Array} questions - 题目数组
   */
  calcSBTI(answers, questions) {
    const dims = { Energy: 0, Awareness: 0, Decision: 0, Execution: 0 };
    const counts = { Energy: 0, Awareness: 0, Decision: 0, Execution: 0 };

    questions.forEach(q => {
      if (q.type !== 'sbti') return;
      const score = answers[q.id];
      if (score === undefined) return;

      dims[q.dim] += score;
      counts[q.dim]++;
    });

    // 计算百分比
    const dimScores = {};
    let type = '';

    const mapping = {
      Energy: { E: 3.5, I: 1.5 },       // >3.5 = E
      Awareness: { N: 3.5, S: 1.5 },   // >3.5 = N
      Decision: { F: 3.5, T: 1.5 },    // >3.5 = F
      Execution: { J: 1.5, P: 3.5 }   // >3.5 = P
    };

    Object.keys(dims).forEach(dim => {
      const avg = counts[dim] > 0 ? dims[dim] / counts[dim] : 3;
      const percent = Math.round((avg / 5) * 100);
      dimScores[dim] = percent;

      // 确定字母
      const threshold = dim === 'Execution' ? 2.5 : 3;
      if (avg >= threshold) {
        type += dim === 'Execution' ? 'P' : (dim === 'Energy' ? 'E' : dim === 'Awareness' ? 'N' : 'F');
      } else {
        type += dim === 'Execution' ? 'J' : (dim === 'Energy' ? 'I' : dim === 'Awareness' ? 'S' : 'T');
      }
    });

    return { type, dimScores };
  }

  /**
   * 计算BigFive五维度
   * @param {Object} answers
   * @param {Array} questions
   */
  calcBigFive(answers, questions) {
    const dims = { Openness: 0, Conscientiousness: 0, Extraversion: 0, Agreeableness: 0, Neuroticism: 0 };
    const counts = { Openness: 0, Conscientiousness: 0, Extraversion: 0, Agreeableness: 0, Neuroticism: 0 };

    questions.forEach(q => {
      if (q.type !== 'bf') return;
      const score = answers[q.id];
      if (score === undefined) return;

      dims[q.dim] += score;
      counts[q.dim]++;
    });

    const dimScores = {};
    Object.keys(dims).forEach(dim => {
      const avg = counts[dim] > 0 ? dims[dim] / counts[dim] : 3;
      dimScores[dim] = Math.round((avg / 5) * 100);
    });

    const total = Object.values(dimScores).reduce((a, b) => a + b, 0) / 5;

    return { dimScores, total: Math.round(total) };
  }

  /**
   * 综合计算（主类型 + 匹配度 + 全维度）
   * @param {Object} answers
   * @param {Array} questions
   * @param {Array} resultDefs - 结果定义数组
   */
  calc(answers, questions, resultDefs = []) {
    const sbti = this.calcSBTI(answers, questions);
    const bigfive = this.calcBigFive(answers, questions);

    // 计算匹配度
    let matchPercent = 0;
    let matchedType = sbti.type;

    if (resultDefs.length > 0) {
      // 找出最匹配的结果类型
      let bestMatch = 0;
      resultDefs.forEach(def => {
        const similarity = this.calcSimilarity(sbti.dimScores, def.dimensions);
        if (similarity > bestMatch) {
          bestMatch = similarity;
          matchedType = def.type;
        }
      });
      matchPercent = Math.round(bestMatch * 100);
    } else {
      // 无结果定义时，用总分估算
      matchPercent = Math.round((bigfive.total + Object.values(sbti.dimScores).reduce((a,b)=>a+b,0)/4) / 2);
    }

    return {
      type: matchedType,
      sbtiScores: sbti.dimScores,
      bfScores: bigfive.dimScores,
      bigfiveTotal: bigfive.total,
      matchPercent,
      allDimensions: {
        ...sbti.dimScores,
        ...bigfive.dimScores
      }
    };
  }

  /**
   * 计算两个维度向量的相似度 (0-1)
   */
  calcSimilarity(a, b) {
    const keys = Object.keys(a);
    let sum = 0;
    keys.forEach(k => {
      if (b[k] !== undefined) {
        sum += 1 - Math.abs(a[k] - b[k]) / 100;
      }
    });
    return sum / keys.length;
  }
}

const scoringEngine = new ScoringEngine();
