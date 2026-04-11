/**
 * 裂变分享组件 - 生成可传播的结果卡片
 * 用户截图分享 = 免费拉新，CAC=0
 */

class ShareManager {
  constructor(config) {
    this.config = config;
    this.cardCanvas = null;
  }

  /**
   * 生成分享卡片
   * @param {Object} result - 测试结果 { type, scores, dimensionScores, ... }
   * @param {HTMLElement} container - 渲染到的容器
   */
  renderShareCard(result, container) {
    const { share, theme } = this.config;
    const card = share.card;

    container.innerHTML = `
      <div class="share-card-wrap">
        <div class="share-card" id="shareCard">
          <div class="sc-bg" style="background: ${card.fallbackGradient}; ${card.background ? `background-image: url('${card.background}')` : ''}">
            <div class="sc-overlay">
              <div class="sc-header">
                <span class="sc-badge">SBTI 人格测试</span>
              </div>
              <div class="sc-result">
                <div class="sc-type">${result.type}</div>
                <div class="sc-match">匹配度 ${result.matchPercent || 0}%</div>
              </div>
              <div class="sc-dimensions" id="scDimensions"></div>
              <div class="sc-footer">
                <span>长按识别二维码 → 测测你的人格</span>
              </div>
            </div>
          </div>
        </div>
        <div class="share-actions">
          <button class="share-btn save" onclick="shareManager.downloadCard()">📥 保存图片</button>
          <button class="share-btn wechat" onclick="shareManager.shareToWechat()">💬 分享微信</button>
          <button class="share-btn qr" onclick="shareManager.showQR()">📱 生成二维码</button>
        </div>
        <div class="share-qr-modal" id="shareQRModal">
          <div class="qr-box">
            <canvas id="qrCanvas"></canvas>
            <p>截图保存，发给朋友</p>
            <button onclick="shareManager.hideQR()">关闭</button>
          </div>
        </div>
      </div>
    `;

    // 渲染维度条
    this.renderDimensions(result.dimensionScores || {});

    // 添加样式
    this.injectStyles();
  }

  renderDimensions(scores) {
    const dimsEl = document.getElementById('scDimensions');
    if (!dimsEl) return;

    const dims = Object.entries(scores).slice(0, 5);
    dimsEl.innerHTML = dims.map(([name, value]) => `
      <div class="sc-dim-row">
        <span class="sc-dim-name">${name}</span>
        <div class="sc-dim-bar">
          <div class="sc-dim-fill" style="width: ${value}%"></div>
        </div>
      </div>
    `).join('');
  }

  injectStyles() {
    if (document.getElementById('share-styles')) return;
    const style = document.createElement('style');
    style.id = 'share-styles';
    style.textContent = `
      .share-card-wrap { text-align: center; padding: 1rem 0; }
      .share-card { border-radius: 16px; overflow: hidden; max-width: 360px; margin: 0 auto 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
      .sc-bg { min-height: 480px; background-size: cover; background-position: center; position: relative; }
      .sc-overlay { background: rgba(15,15,26,0.85); min-height: 480px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; }
      .sc-badge { background: linear-gradient(135deg,#3b82f6,#9333ea); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
      .sc-result { text-align: center; padding: 2rem 0; }
      .sc-type { font-size: 2.5rem; font-weight: 900; background: linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
      .sc-match { font-size: 0.9rem; color: #94a3b8; }
      .sc-dimensions { padding: 0.5rem 0; }
      .sc-dim-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
      .sc-dim-name { font-size: 0.7rem; color: #94a3b8; width: 60px; text-align: left; }
      .sc-dim-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; }
      .sc-dim-fill { height: 100%; background: linear-gradient(90deg,#3b82f6,#9333ea); border-radius: 2px; transition: width 1s; }
      .sc-footer { text-align: center; font-size: 0.7rem; color: rgba(255,255,255,0.5); }
      .share-actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      .share-btn { padding: 0.6rem 1.2rem; border-radius: 10px; border: none; font-size: 0.85rem; cursor: pointer; font-weight: 600; transition: opacity 0.2s; }
      .share-btn:hover { opacity: 0.85; }
      .share-btn.save { background: linear-gradient(135deg,#3b82f6,#6366f1); color: #fff; }
      .share-btn.wechat { background: #07c160; color: #fff; }
      .share-btn.qr { background: #1a1a2e; border: 1px solid #2d2d4a; color: #94a3b8; }
      .share-qr-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 1000; }
      .share-qr-modal.show { display: flex; }
      .qr-box { background: #13132a; border-radius: 16px; padding: 2rem; text-align: center; }
      .qr-box canvas { border-radius: 8px; }
      .qr-box p { margin: 1rem 0; color: #94a3b8; font-size: 0.85rem; }
      .qr-box button { padding: 0.5rem 1.5rem; background: #3b82f6; border: none; border-radius: 8px; color: #fff; cursor: pointer; }
    `;
    document.head.appendChild(style);
  }

  /**
   * 下载分享卡片为图片
   */
  async downloadCard() {
    const card = document.getElementById('shareCard');
    if (!card) return;

    try {
      // 使用 html2canvas（需在HTML中引入）
      if (typeof html2canvas !== 'undefined') {
        const canvas = await html2canvas(card, { scale: 2, backgroundColor: null });
        const link = document.createElement('a');
        link.download = `SBTI_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        alert('截图功能需要引入 html2canvas');
      }
    } catch (e) {
      console.error('生成卡片失败', e);
      alert('生成失败，请重试');
    }
  }

  /**
   * 微信分享（调用微信JS-SDK）
   */
  shareToWechat() {
    // 微信分享需要后端提供签名，先跳转到公众号
    const traffic = this.config.traffic;
    if (traffic.enabled && traffic.entries.length > 0) {
      const gzh = traffic.entries.find(e => e.name === '公众号');
      if (gzh && gzh.url) {
        window.open(gzh.url, '_blank');
      }
    }
    alert('截图分享给朋友，效果更好！');
  }

  /**
   * 生成二维码
   */
  async showQR() {
    const modal = document.getElementById('shareQRModal');
    if (!modal) return;
    modal.classList.add('show');

    // 生成二维码（需要 qrcode.js）
    const canvas = document.getElementById('qrCanvas');
    if (typeof QRCode !== 'undefined' && canvas) {
      const url = window.location.href;
      new QRCode(canvas, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#ffffff",
        colorLight: "#13132a"
      });
    }
  }

  hideQR() {
    const modal = document.getElementById('shareQRModal');
    if (modal) modal.classList.remove('show');
  }
}
