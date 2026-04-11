/**
 * SBTI Animal Quiz Backend
 * 部署到 Render Web Service
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbti-admin-2026';
const DATA_DIR = process.env.RENDER_DISK_PATH || '/tmp';
const DATA_FILE = path.join(DATA_DIR, 'animal_results.json');

// ─── 持久化存储 ─────────────────────────────────
let results = [];

function loadResults() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      results = JSON.parse(raw);
      console.log('Loaded ' + results.length + ' records');
    }
  } catch (e) {
    console.error('Load failed:', e.message);
  }
}

function saveResults() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2), 'utf-8');
  } catch (e) {
    console.error('Save failed:', e.message);
  }
}

loadResults();

// ─── Middleware ─────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'X-Admin-Password'] }));
app.use(express.json({ limit: '5mb' }));

// ─── 静态文件（前端页面）─────────────────────────
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR));

// ─── API 接口 ───────────────────────────────────
app.post('/api/results', (req, res) => {
  const data = req.body;
  if (!data.animalId) return res.status(400).json({ error: 'Missing animalId' });
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
  if (results.length > 50000) results = results.slice(0, 50000);
  saveResults();
  console.log('New: ' + result.animalId + ' | Total: ' + results.length);
  res.json({ success: true, id: result.id, total: results.length });
});

app.get('/api/stats', (req, res) => {
  const byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
  const byAnimal = {};
  results.forEach(r => {
    const k = (r.rarity || 'common').toLowerCase();
    if (k === 'legendary') byRarity.legendary++;
    else if (k === 'epic') byRarity.epic++;
    else if (k === 'rare') byRarity.rare++;
    else byRarity.common++;
    const id = r.animalId || 'unknown';
    byAnimal[id] = (byAnimal[id] || 0) + 1;
  });
  const top = Object.entries(byAnimal).sort((a, b) => b[1] - a[1]).slice(0, 20);
  res.json({ total: results.length, by_rarity: byRarity, top_types: top.map(([type, count]) => ({ type, count })) });
});

app.get('/api/admin/results', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  const byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
  results.forEach(r => {
    const k = (r.rarity || 'common').toLowerCase();
    if (k === 'legendary') byRarity.legendary++;
    else if (k === 'epic') byRarity.epic++;
    else if (k === 'rare') byRarity.rare++;
    else byRarity.common++;
  });
  res.json({
    results: results.slice(0, 2000),
    stats: { total: results.length, by_rarity: byRarity, top_types: Object.entries(results.reduce((acc, r) => { const id = r.animalId || 'unknown'; acc[id] = (acc[id] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([type, count]) => ({ type, count })) }
  });
});

app.delete('/api/admin/results/:id', (req, res) => {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  const before = results.length;
  results = results.filter(r => r.id !== req.params.id);
  saveResults();
  res.json({ success: true, deleted: before - results.length, total: results.length });
});

app.delete('/api/admin/results', (req, res) => {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  const count = results.length;
  results = [];
  saveResults();
  res.json({ success: true, deleted: count });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', total: results.length, uptime: Math.floor(process.uptime()) });
});

// ─── 启动 ──────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('SBTI API running on port ' + PORT);
  console.log('Admin password: ' + ADMIN_PASSWORD);
  console.log('Data file: ' + DATA_FILE);
  console.log('Public dir: ' + PUBLIC_DIR);
});
