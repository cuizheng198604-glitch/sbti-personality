# 部署指南 - 动物性格测试 → Render

---

## 方式一：GitHub（推荐，自动部署）

### 1. 上传代码到 GitHub
把整个项目文件夹上传到 GitHub 私有仓库。

### 2. Render 连接 GitHub
1. 访问 https://render.com → 登录/注册
2. 点击 **New +** → **Static Site**
3. 连接你的 GitHub 仓库
4. 配置：

| 字段 | 值 |
|------|-----|
| Name | `animal-quiz`（任意） |
| Branch | `main` |
| Build Command | （留空） |
| Publish Directory | `public` |

5. 点击 **Create Static Site**

### 3. 设置环境变量（可选）
- 点击 Static Site → **Environment** → **Secret**：
  - `ADMIN_PASSWORD` = `sbti-admin-2026`（管理后台密码）

### 4. 部署完成
Render 会自动构建并给一个 `.onrender.com` 域名。

---

## 方式二：手动拖拽（最快）

1. 访问 https://render.com → 登录
2. 点击 **New +** → **Static Site**
3. 选择 **Upload Files**
4. 直接把 `public/` 文件夹里的**所有文件**拖进去
5. 等待部署完成

---

## 方式三：Render CLI

```bash
# 安装 Render CLI
npm install -g @renderinc/render-cli

# 登录
render login

# 部署静态站
render deploy --public-dir public
```

---

## 访问地址

部署后：
- 答题页: `https://你的域名/animal_quiz.html`
- 结果页: `https://你的域名/animal_result.html`
- 管理后台: `https://你的域名/animal_admin.html`

---

## 配置广告（可选）

编辑 `public/animal_config.js`，找到 ads 部分：

```javascript
ads: {
  enabled: true,
  adsense: {
    clientId: "ca-pub-你的ID",
    slotIds: {
      inQuiz: "广告位ID",
      resultTop: "广告位ID",
      resultBottom: "广告位ID"
    }
  }
}
```

---

## 配置私域引流

编辑 `public/animal_config.js`：

```javascript
traffic: {
  enabled: true,
  entries: [
    {
      name: "公众号",
      icon: "📮",
      title: "关注公众号",
      desc: "回复【动物】获取完整分析",
      qrCode: "https://你的图床/gzh-qr.png",
      url: "https://mp.weixin.qq.com/..."
    }
  ]
}
```

---

## 下次换题库

在 `public/animal_config.js` 中：

1. **改动物定义** — 搜索 `animals` 数组，替换17种动物
2. **改题目** — 搜索 `questions` 数组，替换38道题
3. **改稀有度** — 搜索 `rarities` 对象，调整概率

提交 GitHub → Render 自动重新部署（GitHub方式）  
或重新拖拽文件（手动方式）

---

## 管理后台

访问: `https://你的域名/animal_admin.html`

默认密码: `sbti-admin-2026`
