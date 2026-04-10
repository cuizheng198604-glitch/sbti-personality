import os

base = r'C:\Users\Administrator\AppData\Roaming\LobsterAI\openclaw\state\workspace-ai'
js_path = os.path.join(base, 'personality_test.js')

with open(js_path, encoding='utf-8') as f:
    js_code = f.read()

html_body = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SBTI x Big Five 人格测试</title>
<style>
:root{--bg:#0f0f1a;--panel:#13132a;--card:#1a1a2e;--border:#2d2d4a;--text:#e2e8f0;--muted:#64748b;--dim:#94a3b8;--c:#8a8a8a;--r:#3b82f6;--s:#9333ea;--l:#f59e0b;}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Segoe UI,PingFang SC,Microsoft YaHei,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.btn-primary{background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;border-radius:10px;color:#fff;font-size:0.95rem;font-weight:700;cursor:pointer;padding:0.7rem 2rem;letter-spacing:0.05em;transition:opacity 0.2s,transform 0.1s}
.btn-primary:hover{opacity:0.88}
.btn-primary:active{transform:scale(0.97)}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
#startScreen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem}
.start-card{background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:2.5rem 2rem;max-width:560px;width:100%;text-align:center}
.start-card h1{font-size:1.7rem;font-weight:900;background:linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:0.4rem}
.subtitle{color:var(--muted);font-size:0.85rem;margin-bottom:1.5rem}
.start-desc{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem;text-align:left;color:var(--dim);font-size:0.82rem;line-height:1.9;margin-bottom:1.5rem}
.start-desc strong{color:var(--text)}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:1.5rem;text-align:left}
.info-item{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:0.6rem 0.8rem}
.info-n{font-size:0.7rem;color:var(--muted);margin-bottom:0.15rem}
.info-v{font-size:0.88rem;font-weight:700;color:#60a5fa}
#testScreen{display:none;min-height:100vh}
.test-header{background:linear-gradient(135deg,#1a1a2e,#16213e);border-bottom:1px solid var(--border);padding:0.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;position:sticky;top:0;z-index:10}
.th-title{font-size:0.82rem;font-weight:700;color:var(--muted);letter-spacing:0.08em}
.progress-wrap{flex:1;max-width:400px}
.progress-bar{height:5px;background:var(--border);border-radius:3px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,#3b82f6,#6366f1);border-radius:3px;transition:width 0.4s}
.progress-text{font-size:0.68rem;color:var(--muted);text-align:right;margin-top:0.18rem}
.th-btn{background:#1e293b;border:1px solid var(--border);color:var(--muted);border-radius:7px;padding:0.38rem 0.8rem;font-size:0.75rem;cursor:pointer;transition:all 0.15s}
.th-btn:hover{background:#2d3a4f;color:var(--text)}
.test-body{padding:1.8rem 1.5rem;max-width:700px;margin:0 auto}
.q-section-title{font-size:0.7rem;font-weight:700;color:var(--muted);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.7rem;padding-bottom:0.4rem;border-bottom:1px solid var(--border)}
.q-block{background:var(--panel);border:1px solid var(--border);border-radius:13px;padding:1.3rem;margin-bottom:1rem;animation:fadeIn 0.3s ease-out}
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.q-meta{font-size:0.66rem;color:var(--muted);margin-bottom:0.5rem}
.q-text{font-size:0.9rem;color:var(--text);line-height:1.75;margin-bottom:0.9rem}
.q-opts{display:flex;gap:0.35rem;flex-wrap:wrap}
.q-opt{flex:1;min-width:58px;text-align:center;padding:0.48rem 0.2rem;border:1px solid var(--border);background:var(--card);border-radius:8px;color:var(--muted);font-size:0.72rem;cursor:pointer;transition:all 0.15s;user-select:none}
.q-opt:hover{border-color:#3b82f6;color:var(--text)}
.q-opt.selected{border-color:#3b82f6;background:rgba(59,130,246,0.12);color:#60a5fa;font-weight:600}
.q-opt .ol{display:block;font-size:1rem;font-weight:700;margin-bottom:0.08rem}
.nav-row{display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.2rem;padding-top:1rem;border-top:1px solid var(--border)}
.btn-next{padding:0.55rem 1.8rem;background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;border-radius:9px;color:#fff;font-size:0.86rem;font-weight:700;cursor:pointer;transition:all 0.2s}
.btn-next:hover{opacity:0.88}
.btn-next:disabled{opacity:0.4;cursor:not-allowed}
.btn-back{padding:0.55rem 1.1rem;background:#1e293b;border:1px solid var(--border);border-radius:9px;color:var(--muted);font-size:0.86rem;cursor:pointer;transition:all 0.15s}
.btn-back:hover{background:#2d3a4f;color:var(--text)}
#resultScreen{display:none;min-height:100vh;padding:1.5rem 1rem}
.result-inner{max-width:760px;margin:0 auto}
.result-hero{background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:2rem 1.8rem;text-align:center;margin-bottom:1rem;animation:fadeIn 0.5s ease-out}
.hero-type{font-size:2.8rem;font-weight:900;letter-spacing:0.08em;line-height:1}
.hero-role{font-size:0.88rem;color:var(--muted);margin-top:0.35rem}
.hero-rarity{margin:0.7rem 0}
.r-tag{display:inline-block;padding:0.18rem 0.85rem;border-radius:20px;font-size:0.78rem;font-weight:700;letter-spacing:0.08em}
.rt-common{background:rgba(138,138,138,0.12);color:var(--c);border:1px solid var(--c)}
.rt-rare{background:rgba(59,130,246,0.12);color:var(--r);border:1px solid var(--r)}
.rt-special{background:rgba(147,51,234,0.12);color:var(--s);border:1px solid var(--s)}
.rt-legendary{background:rgba(245,158,11,0.12);color:var(--l);border:1px solid var(--l)}
.hero-stars{font-size:1rem;letter-spacing:0.1em;margin-top:0.25rem}
.hs0{color:var(--c)}.hs1{color:var(--r)}.hs2{color:var(--s)}.hs3{color:var(--l)}
.hero-prob{font-size:0.73rem;color:var(--muted);margin-top:0.15rem}
.hero-desc{font-size:0.85rem;color:var(--dim);line-height:1.9;max-width:500px;margin:0.8rem auto 0;padding:0.8rem 1rem;background:var(--card);border-radius:10px;border-left:3px solid var(--border);text-align:left;white-space:pre-line}
.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
@media(max-width:600px){.result-grid{grid-template-columns:1fr}}
.rcard{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:1.2rem;animation:fadeIn 0.5s ease-out}
.rcard-title{font-size:0.68rem;font-weight:700;color:var(--muted);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.75rem;padding-bottom:0.4rem;border-bottom:1px solid var(--border)}
.dim-row{margin-bottom:0.55rem}
.dim-lbl{display:flex;justify-content:space-between;font-size:0.7rem;color:var(--muted);margin-bottom:0.18rem}
.dim-track{height:5px;background:var(--border);border-radius:3px;overflow:hidden}
.dim-fill{height:100%;border-radius:3px;transition:width 0.6s}
.attr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.35rem}
.ac{background:rgba(0,0,0,0.18);border:1px solid var(--border);border-radius:8px;padding:0.45rem 0.2rem;text-align:center}
.an{font-size:0.62rem;color:var(--muted)}
.av{font-size:0.92rem;font-weight:700;margin:0.08rem 0 0.18rem}
.ab{height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.af{height:100%;border-radius:2px}
.sk-item{display:flex;gap:0.45rem;align-items:flex-start;background:rgba(147,51,234,0.06);border:1px solid rgba(147,51,234,0.18);border-radius:8px;padding:0.45rem 0.6rem;margin-bottom:0.3rem}
.sk-name{font-size:0.76rem;font-weight:700;color:#a78bfa;flex-shrink:0;min-width:58px}
.sk-desc{font-size:0.71rem;color:#64748b;line-height:1.5}
.bf-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.35rem}
.bf-item{background:rgba(0,0,0,0.12);border:1px solid var(--border);border-radius:8px;padding:0.42rem 0.55rem}
.bf-n{font-size:0.62rem;color:var(--muted)}
.bf-v{font-size:0.88rem;font-weight:700;color:#60a5fa;margin:0.1rem 0}
.bf-tr{font-size:0.6rem;color:#334155;line-height:1.5}
.rn-box{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:1rem 1.2rem;margin-bottom:1rem;font-size:0.82rem;line-height:1.85;color:var(--dim);animation:fadeIn 0.5s ease-out}
.retest-row{text-align:center;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border)}
.retest-btn{background:#1e293b;border:1px solid var(--border);color:var(--muted);border-radius:9px;padding:0.5rem 1.4rem;font-size:0.82rem;cursor:pointer;transition:all 0.15s}
.retest-btn:hover{background:#2d3a4f;color:var(--text)}
.kw-tag{display:inline-block;background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);color:#60a5fa;padding:0.3rem 0.7rem;border-radius:20px;font-size:0.78rem}
</style>
</head>
<body>
<div id="startScreen">
  <div class="start-card">
    <h1>SBTI x Big Five 人格测试</h1>
    <p class="subtitle">36道题  测出你的稀有人格</p>
    <div class="start-desc">
      本测试融合 <strong>SBTI 四维</strong>与<strong>Big Five 大五人格</strong>两大体系，<br>
      通过36道情境选择题，评估你在四大核心维度和五大人格特质上的倾向。<br><br>
      测试结束后，将根据你的性格组合计算<strong>稀有度评级</strong>，<br>
      并用<strong>游戏角色风格</strong>为你生成一份完整的人格档案。
    </div>
    <div class="info-grid">
      <div class="info-item"><div class="info-n">题目数量</div><div class="info-v">36 题</div></div>
      <div class="info-item"><div class="info-n">测试用时</div><div class="info-v">约 5-8 分钟</div></div>
      <div class="info-item"><div class="info-n">涵盖维度</div><div class="info-v">SBTI + Big Five</div></div>
      <div class="info-item"><div class="info-n">输出内容</div><div class="info-v">稀有度 + 角色描述</div></div>
    </div>
    <button class="btn-primary" id="btnStart">开始测试</button>
  </div>
</div>
<div id="testScreen">
  <div class="test-header">
    <span class="th-title">SBTI x Big Five 人格测试</span>
    <div class="progress-wrap">
      <div class="progress-bar"><div class="progress-fill" id="progFill" style="width:0%"></div></div>
      <div class="progress-text" id="progText">0 / 36</div>
    </div>
    <button class="th-btn" id="btnShowResult">查看结果</button>
  </div>
  <div class="test-body" id="qContainer"></div>
</div>
<div id="resultScreen">
  <div class="result-inner" id="resultContent"></div>
</div>
<script>
'''

end_script = '''
var currentQ = 0;
var answers = new Array(QUESTIONS.length).fill(null);
var BATCH = 4;

document.getElementById("btnStart").addEventListener("click", function() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("testScreen").style.display = "block";
  renderBatch();
});

document.getElementById("btnShowResult").addEventListener("click", function() {
  var unanswered = answers.filter(function(a){return a===null}).length;
  if (unanswered > 0) {
    if (!confirm("还有 " + unanswered + " 道题未作答，确定要直接查看结果吗？")) return;
  }
  showResult();
});

function renderBatch() {
  var container = document.getElementById("qContainer");
  var end = Math.min(currentQ + BATCH, QUESTIONS.length);
  var html = "";
  var currentSection = "";
  for (var i = currentQ; i < end; i++) {
    var q = QUESTIONS[i];
    if (q.section !== currentSection) {
      currentSection = q.section;
      html += '<div class="q-section-title">' + currentSection + '</div>';
    }
    var optsHtml = "";
    for (var j = 0; j < q.opts.length; j++) {
      var sel = answers[i] === j ? "selected" : "";
      optsHtml += '<div class="q-opt ' + sel + '" onclick="selectOpt(' + i + ',' + j + ')">' +
        '<span class="ol">' + q.opts[j].l + '</span>' + q.opts[j].t + '</div>';
    }
    html += '<div class="q-block">' +
      '<div class="q-meta">第 ' + (i+1) + ' / ' + QUESTIONS.length + ' 题</div>' +
      '<div class="q-text">' + q.text + '</div>' +
      '<div class="q-opts">' + optsHtml + '</div>' +
      '</div>';
  }
  var prevDisabled = currentQ === 0 ? "disabled" : "";
  var nextLabel = end >= QUESTIONS.length ? "完成测试" : "下一组";
  html += '<div class="nav-row">' +
    '<button class="btn-back" onclick="prevBatch()" ' + prevDisabled + '>上一页</button>' +
    '<button class="btn-next" onclick="nextBatch()">' + nextLabel + '</button></div>';
  container.innerHTML = html;
  updateProgress();
}

function selectOpt(qIdx, oIdx) {
  answers[qIdx] = oIdx;
  var blocks = document.querySelectorAll(".q-block");
  var localIdx = qIdx - currentQ;
  if (blocks[localIdx]) {
    var opts = blocks[localIdx].querySelectorAll(".q-opt");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle("selected", i === oIdx);
    }
  }
}

function nextBatch() {
  var end = Math.min(currentQ + BATCH, QUESTIONS.length);
  if (end < QUESTIONS.length) {
    currentQ = end;
    renderBatch();
  } else {
    var unanswered = answers.filter(function(a){return a===null}).length;
    if (unanswered > 0) {
      if (!confirm("还有 " + unanswered + " 道题未作答，确定完成吗？")) return;
    }
    showResult();
  }
}

function prevBatch() {
  if (currentQ > 0) {
    currentQ -= BATCH;
    renderBatch();
  }
}

function updateProgress() {
  var done = answers.filter(function(a){return a!==null}).length;
  var pct = Math.round((done / QUESTIONS.length) * 100);
  document.getElementById("progFill").style.width = pct + "%";
  document.getElementById("progText").textContent = done + " / " + QUESTIONS.length;
}

function showResult() {
  document.getElementById("testScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
  renderResult(answers);
  window.scrollTo({top: 0, behavior: "smooth"});
}
</script>
</body>
</html>
'''

full_html = html_body + js_code + end_script
out_path = os.path.join(base, 'personality_test.html')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(full_html)
print('Written', len(full_html), 'bytes to', out_path)
