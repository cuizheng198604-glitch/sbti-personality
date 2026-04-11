const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbti-admin-2026';

// 静态文件目录（优先环境变量，fallback到项目根目录）
const STATIC_DIR = process.env.STATIC_DIR || path.join(process.cwd(), 'public');
const DATA_DIR = process.env.RENDER_DISK_PATH || '/tmp';
const DATA_FILE = path.join(DATA_DIR, 'animal_results.json');

console.log('STATIC_DIR:', STATIC_DIR);
console.log('DATA_FILE:', DATA_FILE);

let results = [];

function loadResults() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      results = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      console.log('Loaded: ' + results.length + ' records');
    }
  } catch (e) {
    console.log('Load error: ' + e.message);
  }
}

function saveResults() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2), 'utf8');
  } catch (e) {
    console.log('Save error: ' + e.message);
  }
}

loadResults();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'X-Admin-Password'] }));
app.use(express.json({ limit: '5mb' }));

// 静态文件
app.use(express.static(STATIC_DIR));

// API
app.post('/api/results', function(req, res) {
  var data = req.body || {};
  if (!data.animalId) return res.status(400).json({ error: 'Missing animalId' });
  var result = {
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

app.get('/api/stats', function(req, res) {
  var byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
  var byAnimal = {};
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    var k = (r.rarity || 'common').toLowerCase();
    if (k === 'legendary') byRarity.legendary++;
    else if (k === 'epic') byRarity.epic++;
    else if (k === 'rare') byRarity.rare++;
    else byRarity.common++;
    var id = r.animalId || 'unknown';
    byAnimal[id] = (byAnimal[id] || 0) + 1;
  }
  var top = Object.entries(byAnimal).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 20);
  res.json({ total: results.length, by_rarity: byRarity, top_types: top.map(function(e) { return { type: e[0], count: e[1] }; }) });
});

app.get('/api/admin/results', function(req, res) {
  var password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  var byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
  for (var i = 0; i < results.length; i++) {
    var k = (results[i].rarity || 'common').toLowerCase();
    if (k === 'legendary') byRarity.legendary++;
    else if (k === 'epic') byRarity.epic++;
    else if (k === 'rare') byRarity.rare++;
    else byRarity.common++;
  }
  res.json({
    results: results.slice(0, 2000),
    stats: {
      total: results.length,
      by_rarity: byRarity,
      top_types: Object.entries(results.reduce(function(acc, r) {
        var id = r.animalId || 'unknown';
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {})).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 20).map(function(e) { return { type: e[0], count: e[1] }; })
    }
  });
});

app.delete('/api/admin/results/:id', function(req, res) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  var before = results.length;
  results = results.filter(function(r) { return r.id !== req.params.id; });
  saveResults();
  res.json({ success: true, deleted: before - results.length, total: results.length });
});

app.delete('/api/admin/results', function(req, res) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  var count = results.length;
  results = [];
  saveResults();
  res.json({ success: true, deleted: count });
});

app.get('/health', function(req, res) {
  res.json({ status: 'ok', total: results.length, uptime: Math.floor(process.uptime()), static_dir: STATIC_DIR });
});

app.get('/', function(req, res) {
  res.redirect('/animal_quiz.html');
});

app.listen(PORT, '0.0.0.0', function() {
  console.log('Server running on port: ' + PORT);
  console.log('Admin password: ' + ADMIN_PASSWORD);
});
