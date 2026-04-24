/**
 * 语言检测与翻译系统
 * 使用方式：
 *   1. 在页面 <head> 中引入 <script src="lang.js"></script>
 *   2. 在 <body> 底部加 <script>applyLang();</script>
 *   3. 所有需要翻译的元素加 data-i18n="key" 属性
 */
(function () {
  'use strict';

  // ── 语言数据 ──────────────────────────────────────────────
  const I18N = {
    // ── 首页 ──
    'home_title': { zh: 'SBTI × Big Five', en: 'SBTI × Big Five' },
    'home_subtitle': { zh: '人格测试系统', en: 'Personality Test System' },
    'home_card1_title': { zh: '人格测试', en: 'Personality Test' },
    'home_card1_desc': { zh: '36题情境问卷', en: '36 Scenario Questions' },
    'home_card1_link': { zh: '开始测试 →', en: 'Start Test →' },
    'home_card2_title': { zh: '手动评估', en: 'Manual Evaluation' },
    'home_card2_desc': { zh: '滑块输入 + 报告', en: 'Slider Input + Report' },
    'home_card2_link': { zh: '立即体验 →', en: 'Try Now →' },
    'home_card3_title': { zh: '抽卡模拟', en: 'Gacha Simulator' },
    'home_card3_desc': { zh: 'Gacha 风格', en: 'Gacha Style' },
    'home_card3_link': { zh: '开始抽卡 →', en: 'Start Gacha →' },

    // ── 动物测试封面 ──
    'quiz_emoji': { zh: '🐾', en: '🐾' },
    'quiz_title': { zh: '动物性格测试', en: 'Animal Personality Test' },
    'quiz_subtitle': { zh: 'MBTI已过时，动物人格才是新潮流', en: 'MBTI is outdated — Animal personalities are the new trend' },
    'quiz_desc': {
      zh: '基于 <strong>MBTI</strong> + <strong>Big Five</strong> 双维度人格理论，结合东方动物哲学全新设计。<br><br>不同动物有不同性格——<strong>龙的威严、狐狸的机智、考拉的淡定</strong>。<br>38道题，揭开你内心最真实的动物面孔。',
      en: 'Based on <strong>MBTI</strong> + <strong>Big Five</strong> dual-dimension personality theory, combined with Eastern animal philosophy.<br><br>Different animals have different personalities — <strong>dragon\'s majesty, fox\'s cleverness, koala\'s calm</strong>.<br>38 questions to reveal your truest animal self.'
    },
    'quiz_q_count': { zh: '题目数', en: 'Questions' },
    'quiz_duration': { zh: '预计用时', en: 'Duration' },
    'quiz_result_types': { zh: '结果类型', en: 'Result Types' },
    'quiz_rarity': { zh: '稀有度', en: 'Rarity' },
    'quiz_start': { zh: '🐾 开始测试', en: '🐾 Start Test' },
    'quiz_try': { zh: '好奇试试', en: 'Just Curious' },

    // ── 问卷页 ──
    'quiz_progress': { zh: '%d / %d', en: '%d / %d' },
    'quiz_next': { zh: '下一题 →', en: 'Next →' },
    'quiz_submit': { zh: '🔮 查看结果', en: '🔮 View Result' },
    'quiz_prev': { zh: '上一题', en: 'Previous' },
    'quiz_exit': { zh: '退出', en: 'Exit' },
    'quiz_loading': { zh: '正在分析你的动物人格...', en: 'Analyzing your animal personality...' },
    'quiz_section_ei': { zh: 'MBTI · 能量倾向', en: 'MBTI · Energy' },
    'quiz_section_ns': { zh: 'MBTI · 信息感知', en: 'MBTI · Awareness' },
    'quiz_section_ft': { zh: 'MBTI · 决策方式', en: 'MBTI · Decision' },
    'quiz_section_jp': { zh: 'MBTI · 执行方式', en: 'MBTI · Execution' },
    'quiz_section_o': { zh: 'BigFive · 开放性', en: 'BigFive · Openness' },
    'quiz_section_c': { zh: 'BigFive · 尽责性', en: 'BigFive · Conscientiousness' },
    'quiz_section_e': { zh: 'BigFive · 外向性', en: 'BigFive · Extraversion' },
    'quiz_section_a': { zh: 'BigFive · 宜人性', en: 'BigFive · Agreeableness' },
    'quiz_section_n': { zh: 'BigFive · 神经质', en: 'BigFive · Neuroticism' },

    // ── 人格测试封面 ──
    'pt_title': { zh: 'SBTI x Big Five 人格测试', en: 'SBTI x Big Five Personality Test' },
    'pt_subtitle': { zh: '36道题  测出你的稀有人格', en: '36 Questions · Discover Your Rare Personality' },
    'pt_desc': { zh: '本测试融合 <strong>SBTI 四维</strong>与<strong>Big Five 大五人格</strong>两大体系，<br>通过36道情境选择题，评估你在四大核心维度和五大人格特质上的倾向。<br><br>测试结束后，将根据你的性格组合计算<strong>稀有度评级</strong>，<br>并用<strong>游戏角色风格</strong>为你生成一份完整的人格档案。', en: 'This test combines <strong>SBTI four dimensions</strong> with <strong>Big Five</strong> personality theory.<br>36 scenario-based questions assess your tendencies across 4 core dimensions and 5 personality traits.<br><br>Upon completion, you\'ll receive a <strong>rarity rating</strong> based on your unique personality combination,<br>along with a complete personality profile in <strong>gaming character style</strong>.' },
    'pt_q_count': { zh: '题目数量', en: 'Questions' },
    'pt_duration': { zh: '测试用时', en: 'Duration' },
    'pt_dims': { zh: '涵盖维度', en: 'Dimensions' },
    'pt_output': { zh: '输出内容', en: 'Output' },
    'pt_output_val': { zh: '稀有度 + 角色描述', en: 'Rarity + Character Profile' },
    'pt_start': { zh: '开始测试', en: 'Start Test' },

    // ── 结果页 ──
    'result_match': { zh: '与该动物匹配度', en: 'Match with this animal' },
    'result_mbti': { zh: 'MBTI 人格维度', en: 'MBTI Profile' },
    'result_bf': { zh: 'Big Five 人格维度', en: 'Big Five Dimensions' },
    'result_core': { zh: '核心优势', en: 'Core Strengths' },
    'result_weakness': { zh: '潜在短板', en: 'Potential Weakness' },
    'result_life': { zh: '人生关键词', en: 'Life Keywords' },
    'result_relationship': { zh: '关系配对', en: 'Relationship Match' },
    'result_share': { zh: '分享你的动物人格', en: 'Share Your Animal Personality' },
    'result_retry': { zh: '重新测试', en: 'Retake Test' },
    'result_save_img': { zh: '保存图片', en: 'Save Image' },
    'result_share_wechat': { zh: '分享微信', en: 'Share to WeChat' },
    'result_qr': { zh: '二维码', en: 'QR Code' },
    'result_gacha': { zh: '每日抽卡', en: 'Daily Gacha' },
    'result_unlock': { zh: '解锁完整版动物分析', en: 'Unlock Full Animal Analysis' },
    'result_unlock_desc': { zh: '关注公众号 回复【动物】获取完整性格报告', en: 'Follow the official account and reply【Animal】for the full report' },
    'result_unlock_1': { zh: '✓ 完整版动物人格分析', en: '✓ Full Animal Personality Analysis' },
    'result_unlock_2': { zh: '✓ MBTI + BigFive 详细报告', en: '✓ MBTI + BigFive Detailed Report' },
    'result_unlock_3': { zh: '✓ 17种动物性格详解', en: '✓ 17 Animal Types Explained' },
    'result_unlock_4': { zh: '✓ 动物配对指数查询', en: '✓ Animal Match Index Query' },
    'result_disclaimer': { zh: '本测试仅供娱乐，请勿当真。', en: 'This test is for entertainment only.' },
    'result_ad_text': { zh: '10道题测出你的动物人格，朋友都在玩', en: '10 questions reveal your animal personality!' },
    'result_ad_btn': { zh: '开始测试', en: 'Start Test' },
    'result_traffic_title': { zh: '解锁完整版动物分析', en: 'Unlock Full Animal Analysis' },
    'result_traffic_1_title': { zh: '完整版动物人格分析', en: 'Full Animal Personality Analysis' },
    'result_traffic_1_desc': { zh: '17种动物性格详解', en: '17 animal types explained' },
    'result_traffic_2_title': { zh: 'MBTI + BigFive 详细报告', en: 'MBTI + BigFive Detailed Report' },
    'result_traffic_2_desc': { zh: '深度解读你的性格', en: 'Deep dive into your personality' },
    'result_share_card_title': { zh: '我的动物人格', en: 'My Animal Personality' },
    'result_url_label': { zh: '长按识别二维码 → 测测你的动物人格', en: 'Scan the QR code → Test your animal personality' },

    // ── BigFive 维度名 ──
    'bf_Openness': { zh: '开放性', en: 'Openness' },
    'bf_Conscientiousness': { zh: '尽责性', en: 'Conscientiousness' },
    'bf_Extraversion': { zh: '外向性', en: 'Extraversion' },
    'bf_Agreeableness': { zh: '宜人性', en: 'Agreeableness' },
    'bf_Neuroticism': { zh: '神经质', en: 'Neuroticism' },

    // ── 稀有度 ──
    'rarity_legendary': { zh: '🌟 传说', en: '🌟 Legendary' },
    'rarity_epic': { zh: '💜 史诗', en: '💜 Epic' },
    'rarity_rare': { zh: '💎 稀有', en: '💎 Rare' },
    'rarity_common': { zh: '✨ 普通', en: '✨ Common' },

    // ── 人格测试结果页 UI ──
    'pt_result_prob': { zh: '出现概率', en: 'Appearance Rate' },
    'pt_sbti_dims': { zh: 'SBTI 四维倾向', en: 'SBTI Four Dimensions' },
    'pt_battle_attrs': { zh: '战斗属性', en: 'Battle Attributes' },
    'pt_skills': { zh: '天赋技能', en: 'Talent Skills' },
    'pt_bf_detail': { zh: 'Big Five 人格明细', en: 'Big Five Details' },
    'pt_rarity_desc': { zh: '稀有度说明', en: 'Rarity Description' },
    'pt_style_kw': { zh: '立绘风格关键词', en: 'Portrait Style Keywords' },
    'pt_retest': { zh: '重新测试', en: 'Retake Test' },
    'pt_core': { zh: '核心优势', en: 'Core Strengths' },
    'pt_growth_blind': { zh: '成长盲区', en: 'Growth Blindspots' },
    'pt_attr_atk': { zh: '攻击', en: 'ATK' },
    'pt_attr_def': { zh: '防御', en: 'DEF' },
    'pt_attr_hp': { zh: '生命', en: 'HP' },
    'pt_attr_spd': { zh: '速度', en: 'SPD' },
    'pt_attr_crit': { zh: '暴击', en: 'Crit' },
    'pt_attr_dodge': { zh: '闪避', en: 'Dodge' },
    'pt_energy': { zh: '能量倾向', en: 'Energy' },
    'pt_awareness': { zh: '信息感知', en: 'Awareness' },
    'pt_decision': { zh: '决策方式', en: 'Decision' },
    'pt_execution': { zh: '执行方式', en: 'Execution' },
  };

  // ── 英语问卷题目（38题，与 cfg.questions 一一对应）──────────
  const EN_QUESTIONS = [
    { section:"MBTI · Energy", type:"mbti", dim:"E", text:"What do you usually prefer on weekends?", opts:[{l:"A",t:"Large gatherings with lots of friends, socializing charges me up",s:5},{l:"B",t:"Small gatherings with a few close friends",s:4},{l:"C",t:"Quiet time alone, reading or daydreaming",s:2},{l:"D",t:"Avoid talking as much as possible",s:1}]},
    { section:"MBTI · Energy", type:"mbti", dim:"E", text:"In social situations, you tend to:", opts:[{l:"A",t:"Initiate topics and become the center of attention",s:5},{l:"B",t:"Participate naturally in conversations",s:4},{l:"C",t:"Listen quietly and respond when appropriate",s:2},{l:"D",t:"Prefer to be an observer",s:1}]},
    { section:"MBTI · Energy", type:"mbti", dim:"E", text:"You tend to:", opts:[{l:"A",t:"Get energy and motivation from the external world",s:5},{l:"B",t:"Balance between solitude and socializing",s:3},{l:"C",t:"Find inner peace from being alone",s:2},{l:"D",t:"Not need external interaction at all",s:1}]},
    { section:"MBTI · Energy", type:"mbti", dim:"E", text:"For vacations, you prefer:", opts:[{l:"A",t:"Trending destinations, lively activities",s:5},{l:"B",t:"Short trips nearby, mix of socializing and rest",s:3},{l:"C",t:"Quiet cafes or bookstores",s:2},{l:"D",t:"Staying home watching shows or reading",s:1}]},
    { section:"MBTI · Energy", type:"mbti", dim:"E", text:"What is others' first impression of you?", opts:[{l:"A",t:"Strong aura, clearly not an ordinary person",s:5},{l:"B",t:"Warm and approachable",s:4},{l:"C",t:"Mysterious, makes people curious",s:2},{l:"D",t:"Cute and harmless",s:1}]},
    { section:"MBTI · Awareness", type:"mbti", dim:"N", text:"When reading a novel, what attracts you most?", opts:[{l:"A",t:"Hidden metaphors, symbols, and deeper meanings",s:5},{l:"B",t:"Interesting plots and unexpected twists",s:4},{l:"C",t:"Realistic character development",s:2},{l:"D",t:"Accurate facts and historical details",s:1}]},
    { section:"MBTI · Awareness", type:"mbti", dim:"N", text:"When solving a problem, you rely more on?", opts:[{l:"A",t:"Intuition and inspiration, sudden solutions",s:5},{l:"B",t:"Observing patterns, inferring from past experience",s:3},{l:"C",t:"Concrete evidence and real data",s:1},{l:"D",t:"Step-by-step logical reasoning",s:2}]},
    { section:"MBTI · Awareness", type:"mbti", dim:"N", text:"When facing a new project, you focus more on?", opts:[{l:"A",t:"Possibilities and long-term vision",s:5},{l:"B",t:"Specific execution steps and resources",s:2},{l:"C",t:"Realistic conditions and constraints",s:1},{l:"D",t:"Stakeholder reactions",s:3}]},
    { section:"MBTI · Awareness", type:"mbti", dim:"N", text:"You tend to trust more?", opts:[{l:"A",t:"Abstract theories and development patterns",s:5},{l:"B",t:"Current reality and concrete experience",s:1},{l:"C",t:"A combination, practice makes perfect",s:3},{l:"D",t:"What my intuition tells me",s:4}]},
    { section:"MBTI · Awareness", type:"mbti", dim:"N", text:"At an exhibition, what matters most to you?", opts:[{l:"A",t:"Creativity and meaning behind the works",s:5},{l:"B",t:"Technique and aesthetic quality",s:3},{l:"C",t:"Historical value and provenance",s:1},{l:"D",t:"Likes and comments from friends",s:2}]},
    { section:"MBTI · Decision", type:"mbti", dim:"F", text:"When making major decisions, what matters most?", opts:[{l:"A",t:"Alignment with my values and inner feelings",s:5},{l:"B",t:"Whether it positively affects related people",s:4},{l:"C",t:"Objective pros/cons analysis and optimal solution",s:1},{l:"D",t:"Logical consistency",s:2}]},
    { section:"MBTI · Decision", type:"mbti", dim:"F", text:"When you strongly disagree with a friend's decision, you will:", opts:[{l:"A",t:"Express my concerns and feelings directly",s:5},{l:"B",t:"Express gently, hoping they understand",s:4},{l:"C",t:"Analyze pros and cons objectively",s:2},{l:"D",t:"Respect their choice, not getting involved",s:1}]},
    { section:"MBTI · Decision", type:"mbti", dim:"F", text:"You consider yourself more:", opts:[{l:"A",t:"Feeling-oriented, always considering others' feelings",s:5},{l:"B",t:"Balanced between feeling and logic",s:3},{l:"C",t:"Logic-first, reasoning takes priority",s:2},{l:"D",t:"Extremely rational, everything based on facts",s:1}]},
    { section:"MBTI · Decision", type:"mbti", dim:"F", text:"What do you think of an efficient but cold manager?", opts:[{l:"A",t:"Hard to accept, lacking warmth",s:5},{l:"B",t:"Understandable, but not admirable",s:4},{l:"C",t:"Admire their efficiency and fairness",s:2},{l:"D",t:"As long as results are good, method doesn't matter",s:1}]},
    { section:"MBTI · Decision", type:"mbti", dim:"F", text:"When a friend comes to you with troubles, your first reaction is?", opts:[{l:"A",t:"Empathize first, then give advice",s:5},{l:"B",t:"Listen carefully and help analyze the problem",s:3},{l:"C",t:"Give them practical solutions",s:2},{l:"D",t:"Let them handle it themselves, don't interfere",s:1}]},
    { section:"MBTI · Execution", type:"mbti", dim:"J", text:"How do you prefer to complete work?", opts:[{l:"A",t:"Step by step according to plan, organized",s:5},{l:"B",t:"General direction, adjust as you go",s:3},{l:"C",t:"Stay flexible, adapt on the fly",s:1},{l:"D",t:"Think through the big picture first, then decide",s:4}]},
    { section:"MBTI · Execution", type:"mbti", dim:"J", text:"When traveling far, your habit is?", opts:[{l:"A",t:"Full itinerary, hotel and transport all booked",s:5},{l:"B",t:"Book the main framework, details flexible",s:3},{l:"C",t:"Book flights, figure out rest when there",s:2},{l:"D",t:"Just go, no planning at all",s:1}]},
    { section:"MBTI · Execution", type:"mbti", dim:"J", text:"When facing a deadline, you tend to:", opts:[{l:"A",t:"Plan ahead and complete in phases",s:5},{l:"B",t:"Focus under pressure, more efficient",s:2},{l:"C",t:"Steady pace, finish just on time",s:3},{l:"D",t:"Last few days intense rush",s:1}]},
    { section:"MBTI · Execution", type:"mbti", dim:"J", text:"Your attitude toward \"planning life\" is?", opts:[{l:"A",t:"Must have clear goals and plans, I control my life",s:5},{l:"B",t:"General direction, but open to surprises",s:3},{l:"C",t:"Don't want limits, take it as it comes",s:2},{l:"D",t:"No planning at all, enjoy the present",s:1}]},
    { section:"MBTI · Execution", type:"mbti", dim:"J", text:"What is the usual state of your room/desk?", opts:[{l:"A",t:"Tidy and organized, everything in its place",s:5},{l:"B",t:"Mostly tidy, occasionally messy",s:4},{l:"C",t:"Casual, can find things when needed",s:2},{l:"D",t:"Messy but more efficient",s:1}]},
    { section:"BigFive · Openness", type:"bf", dim:"Openness", text:"Your usual attitude toward new things and ideas?", opts:[{l:"A",t:"Very interested, proactively try them",s:5},{l:"B",t:"Interested, but may not act",s:4},{l:"C",t:"Depends, cautiously observe",s:3},{l:"D",t:"Not very interested, prefer the familiar",s:1}]},
    { section:"BigFive · Openness", type:"bf", dim:"Openness", text:"Can you be moved by abstract concepts or artworks?", opts:[{l:"A",t:"Often deeply touched and inspired",s:5},{l:"B",t:"Sometimes, some works move me",s:4},{l:"C",t:"Rarely, focus more on practicality",s:2},{l:"D",t:"Almost never",s:1}]},
    { section:"BigFive · Openness", type:"bf", dim:"Openness", text:"What work content do you prefer?", opts:[{l:"A",t:"Creative, exploratory tasks",s:5},{l:"B",t:"Execution work with some creative space",s:4},{l:"C",t:"Routine tasks following a process",s:2},{l:"D",t:"Completely non-creative repetitive work",s:1}]},
    { section:"BigFive · Openness", type:"bf", dim:"Openness", text:"When going somewhere unfamiliar, you prefer?", opts:[{l:"A",t:"Explore off-the-beaten-path destinations, experience local culture",s:5},{l:"B",t:"Classic spots but also try new routes",s:3},{l:"C",t:"Standard routes, safe and controllable",s:2},{l:"D",t:"Clear goals, no wasted detours",s:1}]},
    { section:"BigFive · Openness", type:"bf", dim:"Openness", text:"What lifestyle do you aspire to?", opts:[{l:"A",t:"Grand achievements and influence",s:5},{l:"B",t:"Free and unconstrained, follow my heart",s:4},{l:"C",t:"Peaceful life with loved ones",s:2},{l:"D",t:"Constantly exploring, experiencing all interesting things",s:5}]},
    { section:"BigFive · Conscientiousness", type:"bf", dim:"Conscientiousness", text:"How do you usually handle promises and deadlines?", opts:[{l:"A",t:"Always finish on time or early",s:5},{l:"B",t:"Try to be on time, occasionally procrastinate",s:3},{l:"C",t:"Often rush at the last minute",s:2},{l:"D",t:"Often overdue, there's still time",s:1}]},
    { section:"BigFive · Conscientiousness", type:"bf", dim:"Conscientiousness", text:"Are you a person with plans?", opts:[{l:"A",t:"Very self-disciplined, everything goes according to plan",s:5},{l:"B",t:"General plans, but adapt flexibly",s:3},{l:"C",t:"Rarely make plans, take it step by step",s:2},{l:"D",t:"Plans are meaningless to me",s:1}]},
    { section:"BigFive · Conscientiousness", type:"bf", dim:"Conscientiousness", text:"When facing a difficult task, you will?", opts:[{l:"A",t:"Persist to the end, never give up halfway",s:5},{l:"B",t:"Work hard to complete, adjust goals when needed",s:3},{l:"C",t:"Give up easily when encountering difficulties",s:1},{l:"D",t:"Judge feasibility first, then decide whether to start",s:2}]},
    { section:"BigFive · Conscientiousness", type:"bf", dim:"Conscientiousness", text:"Your self-evaluation is closer to?", opts:[{l:"A",t:"Often self-doubting, easily feel down",s:1},{l:"B",t:"Occasionally insecure, but generally good",s:3},{l:"C",t:"Confident most of the time",s:4},{l:"D",t:"Very confident, rarely shaken",s:5}]},
    { section:"BigFive · Extraversion", type:"bf", dim:"Extraversion", text:"At a party, you usually?", opts:[{l:"A",t:"Proactively socialize, full of energy",s:5},{l:"B",t:"Can naturally participate in chat",s:4},{l:"C",t:"Have deep conversations with one or two people",s:2},{l:"D",t:"Stay in a corner, leave early",s:1}]},
    { section:"BigFive · Extraversion", type:"bf", dim:"Extraversion", text:"Your social energy mainly comes from?", opts:[{l:"A",t:"Gaining energy from being with people",s:5},{l:"B",t:"Both give me energy, balance is key",s:3},{l:"C",t:"Recharge more from being alone",s:2},{l:"D",t:"Socializing only drains my energy",s:1}]},
    { section:"BigFive · Extraversion", type:"bf", dim:"Extraversion", text:"What role do you like to play in a team?", opts:[{l:"A",t:"Leader or coordinator, proactively drive things forward",s:5},{l:"B",t:"Core participant, actively contribute ideas",s:4},{l:"C",t:"Quietly finish my own tasks",s:2},{l:"D",t:"Observer, silently analyze from the side",s:1}]},
    { section:"BigFive · Agreeableness", type:"bf", dim:"Agreeableness", text:"When conflict arises in a team, you usually:", opts:[{l:"A",t:"Proactively mediate, seek reconciliation",s:5},{l:"B",t:"Participate in discussion, help find compromise",s:4},{l:"C",t:"Stay neutral, let parties resolve it themselves",s:2},{l:"D",t:"Avoid conflict, don't get directly involved",s:1}]},
    { section:"BigFive · Agreeableness", type:"bf", dim:"Agreeableness", text:"Your attitude toward \"trusting strangers\"?", opts:[{l:"A",t:"Inclined to trust, people are basically good",s:5},{l:"B",t:"Initial trust, adjust if problems arise",s:4},{l:"C",t:"Stay cautious, need time to verify",s:2},{l:"D",t:"Basically distrustful, stay highly vigilant",s:1}]},
    { section:"BigFive · Agreeableness", type:"bf", dim:"Agreeableness", text:"What do you find it easier to empathize with in others?", opts:[{l:"A",t:"Others' emotions, situations and feelings",s:5},{l:"B",t:"Logic and facts",s:1},{l:"C",t:"Both depending on the situation",s:3},{l:"D",t:"Not very sensitive to either",s:2}]},
    { section:"BigFive · Agreeableness", type:"bf", dim:"Agreeableness", text:"When a friend needs help, you usually?", opts:[{l:"A",t:"Help without hesitation, immediately",s:5},{l:"B",t:"Willing to help, but consider my own situation",s:3},{l:"C",t:"Help, but set boundaries",s:2},{l:"D",t:"Don't want to help, find excuses to refuse",s:1}]},
    { section:"BigFive · Neuroticism", type:"bf", dim:"Neuroticism", text:"When facing pressure, you usually:", opts:[{l:"A",t:"Feel anxious and uneasy, hard to stay calm",s:5},{l:"B",t:"Some worry, but can cope normally",s:3},{l:"C",t:"Stay calm, analyze problems rationally",s:2},{l:"D",t:"Completely unaffected, calm as water",s:1}]},
    { section:"BigFive · Neuroticism", type:"bf", dim:"Neuroticism", text:"Your emotional volatility is?", opts:[{l:"A",t:"Fluctuates greatly, often ruled by emotions",s:5},{l:"B",t:"Some fluctuation, but controllable",s:3},{l:"C",t:"Relatively stable, rarely up and down",s:2},{l:"D",t:"Very stable, calm as still water",s:1}]},
  ];

  // ── 语言检测 ──────────────────────────────────────────────
  var currentLang = 'zh';

  function detectLang() {
    // 1. URL 参数优先
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'zh') return urlLang;

    // 2. localStorage 其次
    try {
      var stored = localStorage.getItem('sbti_lang');
      if (stored === 'en' || stored === 'zh') return stored;
    } catch (e) {}

    // 3. 浏览器语言
    var nav = (navigator.language || '').toLowerCase();
    if (nav.startsWith('en')) return 'en';
    if (nav.startsWith('zh')) return 'zh';

    // 4. 备用：用 ip-api.com 异步检测（不阻塞）
    fetch('https://ip-api.com/json/?fields=countryCode')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var cc = (d.countryCode || '').toUpperCase();
        var isChinese = ['CN', 'TW', 'HK', 'MO', 'SG', 'MY'].indexOf(cc) !== -1;
        var detected = isChinese ? 'zh' : 'en';
        try { localStorage.setItem('sbti_lang', detected); } catch (e) {}
        if (detected !== currentLang) {
          currentLang = detected;
          applyLang();
        }
      })
      .catch(function () {});

    return 'zh';
  }

  currentLang = detectLang();
  try { localStorage.setItem('sbti_lang', currentLang); } catch (e) {}

  // ── 翻译函数 ──────────────────────────────────────────────
  function t(key) {
    var dict = I18N[key];
    if (!dict) return key;
    return dict[currentLang] || dict.zh || key;
  }

  function tpl(key) {
    var args = Array.prototype.slice.call(arguments, 1);
    return t(key).replace(/%[sd]/g, function () {
      return String(args.shift() || '');
    });
  }

  // ── 应用翻译到页面 ─────────────────────────────────────────
  function applyLang() {
    // 应用 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var args = key.split('|');
      if (args.length > 1) {
        el.textContent = tpl.apply(null, args);
      } else {
        el.textContent = t(key);
      }
    });

    // 应用 data-i18n-html 属性的元素（支持 HTML）
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      el.innerHTML = t(key);
    });

    // 更新 html lang 属性
    document.documentElement.lang = currentLang;

    // 更新结果页 BigFive 维度名
    if (window.updateBFLabels) window.updateBFLabels(currentLang);
  }

  // ── 获取英语问卷（用于替换 cfg.questions）──────────────────
  function getEnglishQuestions() {
    return EN_QUESTIONS;
  }
  // ── 英语精选10题 ──────────────────────────────────────
  const EN_SHORT_QUESTIONS = [
    { section:"MBTI · Energy", type:"mbti", dim:"E", text:"What do you usually prefer on weekends?", opts:[{l:"A",t:"Partying with a big group of friends, recharging socially",s:5},{l:"B",t:"Hanging out with a few close friends",s:4},{l:"C",t:"Quiet time alone, reading or daydreaming",s:2},{l:"D",t:"Avoid talking unless necessary",s:1}]},
    { section:"MBTI · Energy", type:"mbti", dim:"E", text:"In social situations, you tend to:", opts:[{l:"A",t:"Initiate topics, become the center of attention",s:5},{l:"B",t:"Participate naturally in conversation",s:4},{l:"C",t:"Listen quietly, respond when appropriate",s:2},{l:"D",t:"Prefer to be an observer",s:1}]},
    { section:"MBTI · Awareness", type:"mbti", dim:"N", text:"When solving a problem, you rely more on?", opts:[{l:"A",t:"Intuition and inspiration, suddenly seeing the solution",s:5},{l:"B",t:"Observing patterns, inferring from past experience",s:3},{l:"C",t:"Concrete evidence and real data",s:1},{l:"D",t:"Step-by-step logical reasoning",s:2}]},
    { section:"MBTI · Awareness", type:"mbti", dim:"N", text:"When facing a new project, you focus more on?", opts:[{l:"A",t:"Possibilities and long-term vision",s:5},{l:"B",t:"Specific execution steps and resources",s:2},{l:"C",t:"Realistic conditions and constraints",s:1},{l:"D",t:"Stakeholders' reactions",s:3}]},
    { section:"MBTI · Decision", type:"mbti", dim:"F", text:"When making major decisions, what matters most to you?", opts:[{l:"A",t:"Whether it aligns with my values and inner feelings",s:5},{l:"B",t:"Whether it positively affects the people involved",s:4},{l:"C",t:"Objective pros/cons analysis and optimal solution",s:1},{l:"D",t:"Whether the logic is consistent",s:2}]},
    { section:"MBTI · Decision", type:"mbti", dim:"F", text:"When a friend shares their troubles with you, your first reaction is?", opts:[{l:"A",t:"Empathize first, then offer advice",s:5},{l:"B",t:"Listen carefully and help them analyze the problem",s:3},{l:"C",t:"Give them practical solutions",s:2},{l:"D",t:"Let them handle it alone, no need for my input",s:1}]},
    { section:"MBTI · Execution", type:"mbti", dim:"J", text:"When traveling far, your habit is?", opts:[{l:"A",t:"Plan everything ahead, book hotels and transport",s:5},{l:"B",t:"Plan the framework, adapt details as you go",s:3},{l:"C",t:"Book flights, figure out the rest when you arrive",s:2},{l:"D",t:"Just go, no planning at all",s:1}]},
    { section:"MBTI · Execution", type:"mbti", dim:"J", text:"Your attitude toward planning your life is?", opts:[{l:"A",t:"Must have clear goals and plans, I control my life",s:5},{l:"B",t:"Have a general direction, but embrace surprises",s:3},{l:"C",t:"Don't want limits, take it step by step",s:2},{l:"D",t:"No planning at all, enjoy the present",s:1}]},
    { section:"BigFive · Openness", type:"bigfive", dim:"O", text:"Your usual attitude toward new things and ideas is?", opts:[{l:"A",t:"Very interested, actively explore and try",s:5},{l:"B",t:"Interested, but may not try",s:4},{l:"C",t:"Average, familiar things make me more comfortable",s:2},{l:"D",t:"Not very interested, see no need",s:1}]},
    { section:"BigFive · Neuroticism", type:"bigfive", dim:"N", text:"When facing pressure and setbacks, you usually:", opts:[{l:"A",t:"Get anxious and worried, sleep affected",s:5},{l:"B",t:"Some anxiety, but can self-regulate",s:3},{l:"C",t:"Stay calm, handle things rationally",s:2},{l:"D",t:"Completely unaffected, great mindset",s:1}]},
  ];


  function getEnglishShortQuestions() {
    return EN_SHORT_QUESTIONS;
  }

  // ── 人格测试数据（英语版本）──────────────────────────────
  function getPersonalityData(lang) {
    if (lang !== 'en') return null;
    return {
      TYPES: {
        ENTP:{r:'Inventor',   e:'Wind', kw:['Gear','Starry Sky','Floating Elements'],     cl:'#60a5fa'},
        ENTJ:{r:'Commander',   e:'Fire', kw:['Chess Piece','Sword','Precision Machinery'], cl:'#f97316'},
        ENFP:{r:'Adventurer',  e:'Light',kw:['Feather','Paintbrush','Rainbow'],           cl:'#f472b6'},
        ENFJ:{r:'Mentor',      e:'Light',kw:['Halo','Wings','Warm Light'],                 cl:'#fbbf24'},
        ESFP:{r:'Performer',   e:'Fire', kw:['Spotlight','Dancer','Petals'],              cl:'#fb923c'},
        ESFJ:{r:'Consul',      e:'Earth',kw:['Badge','Shield','Order Light'],             cl:'#a3a3a3'},
        ESTP:{r:'Entrepreneur', e:'Fire', kw:['Gold Coin','Map','Stallion'],               cl:'#fbbf24'},
        ESTJ:{r:'Executive',    e:'Earth',kw:['Scale','Codex','Stone Pillar'],             cl:'#737373'},
        INTP:{r:'Architect',    e:'Water',kw:['Blueprint','Crystal','Rational Light'],      cl:'#38bdf8'},
        INTJ:{r:'Strategist',   e:'Water',kw:['Architecture','Moon','Cool Light FX'],       cl:'#818cf8'},
        INFP:{r:'Mediator',     e:'Wind', kw:['Wings','Light','Dreamy Particles'],        cl:'#c084fc'},
        INFJ:{r:'Advocate',     e:'Water',kw:['Moon','Tome','Starry Robe'],               cl:'#a78bfa'},
        ISFP:{r:'Artist',       e:'Wind', kw:['Easel','Journey','Exotic Elements'],        cl:'#f0abfc'},
        ISFJ:{r:'Defender',     e:'Earth',kw:['Flower Vine','Heart','Gentle Light'],      cl:'#86efac'},
        ISTP:{r:'Virtuoso',     e:'Fire', kw:['Hammer','Toolbox','Furnace'],              cl:'#f87171'},
        ISTJ:{r:'Logistician',  e:'Earth',kw:['Scale','Ledger','Sense of Order'],          cl:'#94a3b8'},
      },
      RC: {
        Common:   {cls:'rt-common',   sc:'hs0', st:'★★☆☆☆', prob:'50%', fill:'#8a8a8a',
          desc:'Your personality combination is quite common in the population, belonging to the largest base type. These people are solid and reliable, the stable force of society.'},
        Rare:     {cls:'rt-rare',     sc:'hs1', st:'★★★☆☆', prob:'25%', fill:'#3b82f6',
          desc:'Your personality combination is relatively rare, belonging to the less common types. This trait combination appears in only about a quarter of the population.'},
        Special:  {cls:'rt-special',  sc:'hs2', st:'★★★★☆', prob:'15%', fill:'#9333ea',
          desc:'Your personality combination is quite rare, a one-in-a-hundred type. This trait combination is fully expressed in only a small number of people.'},
        Legendary:{cls:'rt-legendary',sc:'hs3', st:'★★★★★', prob:'10%', fill:'#f59e0b',
          desc:'Your personality combination is Legendary level! Extremely rare, only one in ten people possesses this rare trait combination.'},
      },
      BFN: {Openness:'Openness', Conscientiousness:'Conscientiousness', Extraversion:'Extraversion', Agreeableness:'Agreeableness', Neuroticism:'Neuroticism'},
      BFT: {
        Openness:['Highly imaginative','Prefers art & new things','Sensitive to aesthetics'],
        Conscientiousness:['Highly self-disciplined','Organized','Strong sense of responsibility'],
        Extraversion:['Socially active','Gains energy from external world','Seeks stimulation'],
        Agreeableness:['Trusts others','Helpful','Values cooperation'],
        Neuroticism:['High emotional fluctuation','Sensitive to stress','Prone to anxiety'],
      },
      BSK: {
        Openness:{h:['Infinite Possibility','CRIT DMG +30%, but CRIT Rate -5%'],m:['Inspiration','When speed < enemy, 25% chance to chase']},
        Conscientiousness:{h:['Precision Strike','CRIT Rate +10%, once per battle'],m:['Steady Progress','CRIT Rate +5%, CRIT DMG -10%']},
        Extraversion:{h:['Aura Suppression','20% chance to reduce enemy speed by 10%'],m:['Glory Moment','30% chance to boost next attack 50% DMG']},
        Agreeableness:{h:['Guardian Heart','Absorbs one fatal hit for ally (once per battle)'],m:['Emotional Resonance','Healing +20%, share 5% of ally DMG taken']},
        Neuroticism:{h:['Emotional Outburst','ATK +40% for 3 turns when HP <30%'],m:['Calm Analysis','15% chance to reduce 30% DMG taken']},
      },
      SSK: {
        E:['Glory Moment','30% chance to boost next attack 50% DMG'],
        I:['Deep Focus','DEF +5% per 10% HP lost'],
        S:['Steady Progress','CRIT Rate +5%, CRIT DMG -10%'],
        N:['Inspiration','When speed < enemy, 25% chance to chase'],
        T:['Calm Analysis','15% chance to reduce 30% DMG taken'],
        F:['Emotional Resonance','Healing +20%, share 5% ally DMG'],
        J:['Plan Execution','ATK +15% at turn start if undamaged this turn'],
        P:['Adaptive','Dodge Rate +8%, 20% chance to double attack'],
      },
      ROLE_DESC: {
        INTJ:'Like an off-stage architect, constructing precise models of how the world operates — silent yet profound.',
        INTP:'Like an explorer in a logic maze, chasing the truth of every paradox.',
        INFJ:'Like a visionary, perceiving the unspoken emotional undercurrents behind words.',
        INFP:'Like an idealistic bard, with a faint fire burning to change the world.',
        ISTJ:'Like precisely meshing gears, every tooth fitting perfectly together.',
        ISFJ:'Like a light left on for lost travelers at night, quiet and steadfast.',
        ISTP:'Like a lone craftsman in the wilderness, solving any problem with tools.',
        ISFP:'Like a wandering painter, weaving meaning into existence with color and moments.',
        ENTJ:'Like a commander in wartime, born to win, deploying resources effortlessly.',
        ENTP:'Like a mad alchemist, breaking any rule into new possibilities.',
        ENFJ:'Like a soul mentor on stage, burning to illuminate others\' path.',
        ENFP:'Like an unending flame, every breath seeking a new passion.',
        ESTJ:'Like the cornerstone of an orderly society, building a kingdom with iron laws.',
        ESFJ:'Like a festival organizer, connecting everyone through you.',
        ESTP:'Like a warrior in the arena, fighting for victory every second.',
        ESFP:'Like a star center stage, where enjoying the moment IS the meaning of life.',
      },
      genDesc_hi: ['Very high openness, unlimited creativity','Superb self-discipline and execution','Outstanding social skills','Strong empathy','Emotionally stable, peaceful mindset'],
      genDesc_lo: ['Pragmatic and conservative','Casual in action','Draws energy from solitude','Struggles to say no to others','Emotionally sensitive, volatile'],
      genDesc_str: '\nCore Strengths: ',
      genDesc_wkl: '\nGrowth Blindspots: ',
    };
  }

  // ── 导出 ──────────────────────────────────────────────────
  window.I18N = {
    t: t,
    tpl: tpl,
    applyLang: applyLang,
    getLang: function () { return currentLang; },
    setLang: function (lang) {
      currentLang = lang;
      try { localStorage.setItem('sbti_lang', lang); } catch (e) {}
      applyLang();
    },
    getEnglishQuestions: getEnglishQuestions,
    getEnglishShortQuestions: getEnglishShortQuestions,
    detectLang: detectLang,
    getPersonalityData: getPersonalityData,
  };

})();
