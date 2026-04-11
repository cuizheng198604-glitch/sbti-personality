/**
 * SBTI Animal Quiz Backend - In-Memory Store
 * 部署到 Render Web Service (node server.js)
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbti-admin-2026';

// ─── 内存存储（免费版够用，重启会清空）─────────────────
let results = [];

// ─── CORS（允许所有来源）─────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Password']
}));
app.use(express.json({ limit: '1mb' }));

// ─── 公开接口：提交结果 ─────────────────────────────
app.post('/api/results', (req, res) => {
  const data = req.body;
  if (!data.animalId) {
    return res.status(400).json({ error: '缺少 animalId' });
  }
  const result = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    animalId: data.animalId,
    animal: data.animal || {},
    rarity: data.rarity || 'common',
    rarityName: data.rarityName || '',
    matchPercent: data.matchPercent || 0,
    mbti: data.mbti || '',
    bfScores: data.bfScores || {},
    secondAnimal: data.secondAnimal || null,
    thirdAnimal: data.thirdAnimal || null,
    allDimensions: data.allDimensions || {},
    submitted_at: new Date().toISOString()
  };
  results.unshift(result);
  // 最多保留10000条
  if (results.length > 10000) results = results.slice(0, 10000);
  res.json({ success: true, id: result.id, total: results.length });
});

// ─── 公开接口：统计数据 ────────────────────────────
app.get('/api/stats', (req, res) => {
  const byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
  const byAnimal = {};
  results.forEach(r => {
    const rKey = (r.rarity || 'common').toLowerCase();
    if (rKey === 'legendary') byRarity.legendary++;
    else if (rKey === 'epic') byRarity.epic++;
    else if (rKey === 'rare') byRarity.rare++;
    else byRarity.common++;
    const id = r.animalId || 'unknown';
    byAnimal[id] = (byAnimal[id] || 0) + 1;
  });
  const top = Object.entries(byAnimal).sort((a, b) => b[1] - a[1]).slice(0, 10);
  res.json({
    total: results.length,
    by_rarity: byRarity,
    top_types: top.map(([type, count]) => ({ type, count }))
  });
});

// ─── 管理接口：获取全部（需密码）──────────────────
app.get('/api/admin/results', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }
  const byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
  results.forEach(r => {
    const k = (r.rarity || 'common').toLowerCase();
    if (k === 'legendary') byRarity.legendary++;
    else if (k === 'epic') byRarity.epic++;
    else if (k === 'rare') byRarity.rare++;
    else byRarity.common++;
  });
  res.json({
    results: results.slice(0, 1000), // 最多返回1000条
    stats: {
      total: results.length,
      by_rarity: byRarity,
      top_types: Object.entries(
        results.reduce((acc, r) => {
          const id = r.animalId || 'unknown';
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([type, count]) => ({ type, count }))
    }
  });
});

// ─── 管理接口：删除单条 ─────────────────────────────
app.delete('/api/admin/results/:id', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }
  const before = results.length;
  results = results.filter(r => r.id !== req.params.id);
  res.json({ success: true, deleted: before - results.length, total: results.length });
});

// ─── 管理接口：清空全部 ────────────────────────────
app.delete('/api/admin/results', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }
  const count = results.length;
  results = [];
  res.json({ success: true, deleted: count });
});

// ─── 启动 ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`SBTI Animal Quiz API running on port ${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
