/**
 * 广告位管理器
 * 支持：Google AdSense / 穿山甲 / 百青藤 / 自定义占位
 */

class AdManager {
  constructor(config) {
    this.config = config;
    this.adQueue = [];
    this.currentAdIndex = 0;
  }

  /**
   * 初始化广告系统
   */
  init() {
    if (!this.config.enabled) return;

    const { adsense, domestic } = this.config.ads;

    if (adsense.enabled) {
      // 加载 Google AdSense SDK
      this.loadAdSenseScript(adsense.clientId);
    }

    if (domestic.enabled) {
      // 加载穿山甲 SDK
      this.loadPangolinScript(domestic.pangolin);
    }
  }

  loadAdSenseScript(clientId) {
    if (document.querySelector('script[src*="adsense"]')) return;
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }

  loadPangolinScript(config) {
    // 穿山甲 SDK 加载
    if (!config.appId || !config.slotId) return;
    // ...
  }

  /**
   * 在指定元素后插入广告
   * @param {HTMLElement} afterElement - 在这个元素后插入
   * @param {string} position - 广告位置标识
   */
  showAd(afterElement, position = 'inQuiz') {
    if (!this.config.enabled) return;
    if (!afterElement) return;

    const { adsense, domestic, placeholder } = this.config.ads;

    const adDiv = document.createElement('div');
    adDiv.className = `ad-container ad-${position}`;
    adDiv.style.cssText = 'margin: 1.5rem auto; max-width: 700px; min-height: 100px;';

    if (adsense.enabled) {
      // Google AdSense
      adDiv.innerHTML = `
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="${adsense.clientId}"
          data-ad-slot="${adsense.slotIds[position] || adsense.slotIds.inQuiz}"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      `;
      // 触发广告加载
      if (window.adsbygoogle) {
        try { adsbygoogle.push({}); } catch(e) {}
      }
    } else if (domestic.enabled) {
      // 国内联盟广告占位
      adDiv.innerHTML = this.renderPlaceholder(placeholder);
    } else {
      // 显示占位广告（私域引流）
      adDiv.innerHTML = this.renderPlaceholder(placeholder);
    }

    afterElement.parentNode.insertBefore(adDiv, afterElement.nextSibling);
  }

  renderPlaceholder(placeholder) {
    if (!placeholder) return '';
    return `
      <div class="ad-placeholder" style="background:#1a1a2e;border:1px dashed #2d2d4a;border-radius:12px;padding:1.2rem;text-align:center;max-width:360px;margin:0 auto;">
        ${placeholder.qrCode ? `<img src="${placeholder.qrCode}" style="width:120px;margin-bottom:0.8rem;" />` : ''}
        <div style="font-size:0.85rem;font-weight:700;color:#e2e8f0;margin-bottom:0.3rem;">${placeholder.title}</div>
        <div style="font-size:0.75rem;color:#64748b;">${placeholder.desc}</div>
      </div>
    `;
  }

  /**
   * 在题目间插入广告（自动）
   * @param {HTMLElement} questionElement - 题目元素
   * @param {number} questionIndex - 当前题目索引
   * @param {number} interval - 每隔几题插广告
   */
  maybeShowAd(questionElement, questionIndex, interval = 5) {
    if ((questionIndex + 1) % interval === 0 && questionIndex < this.config.ads.adsense?.slotIds ? Object.keys(this.config.ads.adsense.slotIds).length : 0) {
      this.showAd(questionElement, 'inQuiz');
    }
  }

  /**
   * 结果页广告
   */
  showResultAds() {
    const resultSection = document.querySelector('.result-section');
    if (!resultSection) return;

    // 结果页顶部广告
    const { resultTop, resultBottom } = this.config.ads.adsense?.slotIds || {};

    if (resultTop) {
      this.showAd(resultSection, 'resultTop');
    }
  }
}

// 全局实例
const adManager = new AdManager(CONFIG);
