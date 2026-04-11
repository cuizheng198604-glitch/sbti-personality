# SBTI Quiz Framework - 爆款测试站通用框架

> 换题库 = 改1个JSON = 5分钟上线  
> 下次热点来了，直接复制框架，改题库，马上上线吃流量

---

## 📁 文件结构

```
framework/
├── config.js          ← SBTI人格测试配置（主题/广告/引流）
├── animal_config.js   ← 动物性格测试配置（17种动物/4级稀有度）
├── quiz.html          ← SBTI答题页
├── result.html        ← SBTI结果页（含裂变+引流）
├── animal_quiz.html   ← 动物测试答题页
├── animal_result.html ← 动物测试结果页（含分享卡片）
├── animal_admin.html  ← 动物测试管理后台
├── engine.js          ← 多维度计分引擎
├── share.js           ← 裂变分享组件
├── ads.js             ← 广告位管理器
├── traffic.js         ← 私域引流组件
└── README.md          ← 本文件
```

---

## 🐾 动物性格测试（本次新增）

### 动物类型（17种 + 4级稀有度）

| 稀有度 | 掉落率 | 动物 |
|--------|--------|------|
| 🌟 传说 | 5% | 龙 🐉、凤凰 🔥、独角兽 🦄 |
| 💜 史诗 | 10% | 白虎 🐯、麒麟 🦒、鲸鱼 🐋 |
| 💎 稀有 | 25% | 狼 🐺、鹰 🦅、豹 🐆、海豚 🐬、猫头鹰 🦉 |
| ✨ 普通 | 60% | 猫 🐱、狗 🐶、兔子 🐰、熊猫 🐼、考拉 🐨、狐狸 🦊 |

### 每种动物包含
- 性格特质（3个关键词）
- 详细人格描述
- 核心优势 / 潜在短板
- 最佳搭档 / 最不合搭档
- 人生关键词

---

## 🚀 快速部署

### Vercel（推荐，免费CDN）
```bash
# 1. 创建新项目，上传 framework/ 目录
# 2. 不需要后端，纯静态
# 3. 自定义域名，马上能用
```

### 现有后端
```bash
# 复制 framework/ 内容到 public/
cp -r framework/* ../public/
```

---

## ⚡ 换题库（核心操作）

### 动物测试：编辑 `animal_config.js`

```javascript
// 改主题
theme: {
  title: "你的新测试名字",
  subtitle: "副标题"
}

// 改题目：在 questions 数组中替换
{
  section: '题目分类',
  type: 'animal',
  dim: 'social',  // 维度标签
  text: '题目文字',
  opts: [
    { l: "A", t: '选项文字', s: 5, animals: ["cat", "dog"] },  // s=分数, animals=关联动物
    ...
  ]
}

// 改动物：在 animals 数组中替换
{
  id: 'cat',
  name: '猫',
  emoji: '🐱',
  rarity: 'common',  // legendary/epic/rare/common
  traits: ['独立', '傲娇', '好奇'],
  description: '描述文字...',
  strength: '优势',
  weakness: '短板',
  bestMatch: ['猫', '兔子'],
  worstMatch: ['狼', '狗']
}
```

### SBTI测试：编辑 `config.js` + `quiz.html` 底部 `QUESTIONS`

---

## 💰 变现配置

```javascript
// animal_config.js 中的 ads 对象
ads: {
  enabled: true,
  // Google AdSense
  adsense: { clientId: "ca-pub-XXX", slotIds: {...} },
  // 国内联盟
  domestic: { pangolin: { appId: "", slotId: "" } },
  // 无广告时显示私域引流
  placeholder: { title: "扫码领取资料", qrCode: "/images/qr.png" }
}
```

---

## 🔗 私域引流配置

```javascript
traffic: {
  enabled: true,
  showMode: "resultOnly",  // "always" = 全程, "resultOnly" = 仅结果页
  entries: [
    { name: "公众号", icon: "📮", title: "关注公众号", desc: "...", qrCode: "/images/gzh.png" },
    { name: "微信", icon: "💬", title: "加我微信", desc: "...", qrCode: "/images/wx.png" }
  ]
}
```

---

## 🌟 裂变传播机制

结果页自带分享卡片，用户可以：
1. **保存图片** → 发朋友圈/微博
2. **分享微信** → 直接拉新
3. **生成二维码** → 线下传播

分享卡片自动带入用户结果，形成**自动传播链**：
```
用户A测出「龙」 → 分享结果图 → 朋友刷到 → 扫码测出「凤凰」 → 再分享 → CAC=0
```

---

## 🎯 下次热点来了，这样操作

1. **分析热点** → 什么话题会火？
2. **设计题库** → 围绕热点设计选择题
3. **换配置** → 改 `animal_config.js` 或 `config.js`
4. **部署** → `vercel --prod`，2分钟上线
5. **投流** → 抖音/小红书/公众号植入链接
6. **收割** → 广告 + 私域两头赚

---

## 📊 计分引擎

- **SBTI四维**: Energy / Awareness / Decision / Execution
- **BigFive五维**: Openness / Conscientiousness / Extraversion / Agreeableness / Neuroticism
- **动物维度**: social / relationship / stress / self / life

---

## 🔐 管理后台

- **SBTI后台**: `/admin.html` 或 `/public/admin.html`
- **动物后台**: `/framework/animal_admin.html`

功能：
- 📊 数据概览（稀有度分布 + 动物分布）
- 📋 提交记录（筛选 + 搜索 + 分页 + 删除）
- ⚙️ 配置管理（动物配置/题目配置/稀有度配置）
- 📤 导出数据（JSON / CSV）
- 🗑 清空全部

密码：默认 `sbti-admin-2026`（环境变量 ADMIN_PASSWORD 可修改）
