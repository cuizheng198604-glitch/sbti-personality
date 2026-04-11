/**
 * SBTI Quiz Framework - 全局配置
 * 换主题 = 改这里，不用动代码
 */

const CONFIG = {
  // ==================== 主题配置 ====================
  theme: {
    title: "SBTI人格测试",
    subtitle: "MBTI已经过时，SBTI新的来了",
    description: "31道题，测出你的真实人格类型",
    // 封面按钮
    startButtons: [
      { text: "开始", action: "start" },
      { text: "慎点", action: "caution" },
      { text: "都不信", action: "skeptic" }
    ],
    // 背景色
    colors: {
      bg: "#0f0f1a",
      panel: "#13132a",
      card: "#1a1a2e",
      border: "#2d2d4a",
      text: "#e2e8f0",
      muted: "#64748b",
      primary: "#3b82f6",
      accent: "#9333ea"
    }
  },

  // ==================== 广告位配置 ====================
  // 题目之间插广告，第N题后
  // 设置 adBreakAfter: 5 表示每5题后插一个广告位
  ads: {
    enabled: true,
    // Google AdSense（海外）
    adsense: {
      enabled: false,
      clientId: "ca-pub-XXXXXXXX",  // 替换为你的AdSense pub ID
      slotIds: {
        inQuiz: "123456789",      // 题目间广告位
        resultTop: "987654321",   // 结果页顶部
        resultBottom: "111222333" // 结果页底部
      }
    },
    // 国内联盟（穿山甲/百青藤等）
    domestic: {
      enabled: false,
      // 穿山甲配置
      pangolin: {
        appId: "",
        slotId: ""
      }
    },
    // 自定义广告内容（不放广告时展示）
    placeholder: {
      title: "扫码领取独家资料",
      desc: "回复【666】获取免费人格报告",
      qrCode: ""  // 替换为你的二维码URL
    }
  },

  // ==================== 私域引流配置 ====================
  traffic: {
    enabled: true,
    // 私域引流展示时机: "always" | "resultOnly"
    showMode: "resultOnly",
    entries: [
      {
        name: "公众号",
        icon: "📮",
        title: "关注公众号",
        desc: "获取完整版人格分析报告",
        qrCode: "/images/gzh-qr.png",  // 放到 public/images/
        url: ""
      },
      {
        name: "微信",
        icon: "💬",
        title: "加我微信",
        desc: "备注【SBTI】拉你进群",
        qrCode: "/images/wx-qr.png",
        url: ""
      },
      {
        name: "小程序",
        icon: "🔮",
        title: "更多测试",
        desc: "20+趣味测试等你探索",
        url: "weixin://"
      }
    ]
  },

  // ==================== 分享配置 ====================
  share: {
    enabled: true,
    // 分享卡片样式
    card: {
      // 背景图，可放 public/images/
      background: "/images/share-bg.png",
      // 没背景图时用的渐变色
      fallbackGradient: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)",
      // 标题
      title: "我的SBTI人格是【{type}】，你也来测！",
      // 描述
      desc: "32道题，测出你的真实人格",
      // 分享图标（用户结果头像）
      showAvatar: true,
      // 显示维度分数
      showScores: true,
      // 维度雷达图
      showRadar: true
    },
    // 分享到不同平台
    platforms: {
      wechat: true,    // 微信
      weibo: true,     // 微博
      qq: true,        // QQ
      qr: true         // 生成二维码（可扫码后分享）
    }
  },

  // ==================== 分析配置 ====================
  analytics: {
    // 百度统计（国内）
    baidu: {
      enabled: false,
      siteId: ""
    },
    // Google Analytics（海外）
    ga: {
      enabled: false,
      measurementId: ""
    }
  },

  // ==================== 提交配置 ====================
  submit: {
    // 提交到后端
    endpoint: "/api/results",
    // 是否强制提交才能看结果
    required: false,
    // 提交后显示完整结果（vs 立即显示）
    showResultAfterSubmit: false
  }
};
