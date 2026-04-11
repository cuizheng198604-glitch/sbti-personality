/**
 * 私域引流组件
 * 在关键节点展示私域入口，用户扫码进入你的流量池
 */

class TrafficManager {
  constructor(config) {
    this.config = config;
  }

  /**
   * 渲染私域引流入口
   * @param {HTMLElement} container - 渲染到的容器
   * @param {Object} result - 测试结果（用于个性化）
   */
  render(container, result = null) {
    if (!this.config.enabled) return;
    if (!container) return;

    const { traffic } = this.config;

    container.innerHTML = `
      <div class="traffic-section">
        <div class="traffic-header">
          <span class="traffic-icon">🔑</span>
          <div class="traffic-title">解锁完整版报告</div>
        </div>
        <div class="traffic-entries">
          ${traffic.entries.map((entry, i) => this.renderEntry(entry, i)).join('')}
        </div>
        <div class="traffic-benefit">
          <div class="benefit-item">✓ 完整版人格分析</div>
          <div class="benefit-item">✓ 专属人格提升建议</div>
          <div class="benefit-item">✓ 20+趣味测试免费测</div>
        </div>
      </div>
    `;

    this.injectStyles();
  }

  renderEntry(entry, index) {
    const delay = index * 100;
    return `
      <div class="traffic-entry" style="animation-delay: ${delay}ms">
        <div class="entry-icon">${entry.icon}</div>
        <div class="entry-info">
          <div class="entry-title">${entry.title}</div>
          <div class="entry-desc">${entry.desc}</div>
        </div>
        <div class="entry-qr">
          ${entry.qrCode ? `<img src="${entry.qrCode}" alt="${entry.name}" />` : `
            <div class="qr-placeholder">
              <svg viewBox="0 0 100 100" width="80" height="80">
                <rect x="10" y="10" width="25" height="25" fill="#3b82f6"/>
                <rect x="65" y="10" width="25" height="25" fill="#3b82f6"/>
                <rect x="10" y="65" width="25" height="25" fill="#3b82f6"/>
                <rect x="40" y="40" width="20" height="20" fill="#3b82f6"/>
              </svg>
            </div>
          `}
        </div>
      </div>
    `;
  }

  /**
   * 轻量级引流入口（不占太多位置）
   */
  renderCompact(container) {
    if (!this.config.enabled) return;
    if (!container) return;

    const { traffic } = this.config;
    if (traffic.entries.length === 0) return;

    const first = traffic.entries[0];

    container.innerHTML = `
      <div class="traffic-compact">
        <div class="tc-icon">${first.icon}</div>
        <div class="tc-text">
          <div class="tc-title">${first.title}</div>
          <div class="tc-desc">${first.desc}</div>
        </div>
        ${first.qrCode ? `<img class="tc-qr" src="${first.qrCode}" />` : ''}
      </div>
    `;
  }

  injectStyles() {
    if (document.getElementById('traffic-styles')) return;
    const style = document.createElement('style');
    style.id = 'traffic-styles';
    style.textContent = `
      .traffic-section {
        background: linear-gradient(135deg, #1a1a2e 0%, #13132a 100%);
        border: 1px solid #2d2d4a;
        border-radius: 16px;
        padding: 1.5rem;
        margin: 1.5rem auto;
        max-width: 500px;
        text-align: center;
      }
      .traffic-header { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.2rem; }
      .traffic-icon { font-size: 1.4rem; }
      .traffic-title { font-size: 1rem; font-weight: 800; color: #e2e8f0; }
      .traffic-entries { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.2rem; }
      .traffic-entry { display: flex; align-items: center; gap: 0.8rem; background: #0f0f1a; border: 1px solid #2d2d4a; border-radius: 12px; padding: 0.8rem; text-align: left; animation: slideUp 0.4s ease-out both; }
      @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      .entry-icon { font-size: 1.8rem; flex-shrink: 0; }
      .entry-info { flex: 1; }
      .entry-title { font-size: 0.88rem; font-weight: 700; color: #e2e8f0; margin-bottom: 0.15rem; }
      .entry-desc { font-size: 0.72rem; color: #64748b; }
      .entry-qr img { width: 56px; height: 56px; border-radius: 6px; }
      .traffic-benefit { border-top: 1px solid #2d2d4a; padding-top: 1rem; }
      .benefit-item { font-size: 0.78rem; color: #94a3b8; margin-bottom: 0.3rem; text-align: left; }
      .traffic-compact { display: flex; align-items: center; gap: 0.8rem; background: #1a1a2e; border: 1px solid #2d2d4a; border-radius: 12px; padding: 0.8rem 1rem; margin: 1rem auto; max-width: 500px; }
      .tc-icon { font-size: 1.5rem; }
      .tc-text { flex: 1; }
      .tc-title { font-size: 0.85rem; font-weight: 700; color: #e2e8f0; }
      .tc-desc { font-size: 0.72rem; color: #64748b; }
      .tc-qr { width: 48px; height: 48px; border-radius: 6px; }
    `;
    document.head.appendChild(style);
  }
}
