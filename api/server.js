const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbti-admin-2026';
const STATIC_DIR = process.env.STATIC_DIR || path.join(process.cwd(), 'public');
const DATA_DIR = process.env.RENDER_DISK_PATH || '/tmp';
const DATA_FILE = path.join(DATA_DIR, 'animal_results.json');

console.log('STATIC_DIR:', STATIC_DIR);
console.log('DATA_FILE:', DATA_FILE);

var results = [];

function loadResults() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      results = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      console.log('Loaded: ' + results.length + ' records');
    }
  } catch (e) {
    console.log('Load error: ' + e.message);
    results = [];
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
app.use(express.static(STATIC_DIR));

// 提取rarity字符串
function getRarityKey(r) {
  var rar = r.rarity;
  if (typeof rar === 'string') return rar.toLowerCase();
  if (typeof rar === 'object' && rar !== null) return (rar.name || 'common').toLowerCase();
  return 'common';
}

app.post('/api/results', function(req, res) {
  var data = req.body || {};
  if (!data.animalId) return res.status(400).json({ error: 'Missing animalId' });
  var result = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    animalId: String(data.animalId),
    animal: data.animal || {},
    rarity: typeof data.rarity === 'string' ? data.rarity : 'common',
    rarityName: data.rarityName || '',
    matchPercent: Number(data.matchPercent) || 0,
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
  try {
    var byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
    var byAnimal = {};
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var k = getRarityKey(r);
      if (k === 'legendary') byRarity.legendary++;
      else if (k === 'epic') byRarity.epic++;
      else if (k === 'rare') byRarity.rare++;
      else byRarity.common++;
      var id = String(r.animalId || 'unknown');
      byAnimal[id] = (byAnimal[id] || 0) + 1;
    }
    var entries = Object.keys(byAnimal).map(function(k) { return [k, byAnimal[k]]; });
    entries.sort(function(a, b) { return b[1] - a[1]; });
    var top = entries.slice(0, 20).map(function(e) { return { type: e[0], count: e[1] }; });
    res.json({ total: results.length, by_rarity: byRarity, top_types: top });
  } catch (e) {
    console.log('Stats error: ' + e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/results', function(req, res) {
  try {
    var password = req.headers['x-admin-password'];
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    var byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
    for (var i = 0; i < results.length; i++) {
      var k = getRarityKey(results[i]);
      if (k === 'legendary') byRarity.legendary++;
      else if (k === 'epic') byRarity.epic++;
      else if (k === 'rare') byRarity.rare++;
      else byRarity.common++;
    }
    var byAnimalMap = {};
    for (var j = 0; j < results.length; j++) {
      var id = String(results[j].animalId || 'unknown');
      byAnimalMap[id] = (byAnimalMap[id] || 0) + 1;
    }
    var entries2 = Object.keys(byAnimalMap).map(function(k) { return [k, byAnimalMap[k]]; });
    entries2.sort(function(a, b) { return b[1] - a[1]; });
    res.json({
      results: results.slice(0, 2000),
      stats: {
        total: results.length,
        by_rarity: byRarity,
        top_types: entries2.slice(0, 20).map(function(e) { return { type: e[0], count: e[1] }; })
      }
    });
  } catch (e) {
    console.log('Admin error: ' + e.message);
    res.status(500).json({ error: e.message });
  }
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
  res.json({ status: 'ok', total: results.length, uptime: Math.floor(process.uptime()) });
});

app.get('/', function(req, res) {
  res.redirect('/animal_quiz.html');
});

app.listen(PORT, '0.0.0.0', function() {
  console.log('Server running on port: ' + PORT);
  console.log('Admin password: ' + ADMIN_PASSWORD);
  console.log('Data file: ' + DATA_FILE);
});
