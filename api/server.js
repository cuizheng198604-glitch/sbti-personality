const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbti-admin-2026';
const STATIC_DIR = process.env.STATIC_DIR || path.join(process.cwd(), 'public');
const TOKEN_EXPIRY_HOURS = 24 * 30;

// Supabase config via env (no native drivers needed!)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fcivevgxynpbsomosxmc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

// In-memory cache
let results = [];
let users = [];
let comments = [];
let tokenMap = {};
let dbReady = false;

// ─── Supabase REST API helpers (pure HTTPS, no pg module needed) ───────────────
function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + path);
    const opts = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    };
    if (body) {
      const b = JSON.stringify(body);
      opts.headers['Content-Length'] = Buffer.byteLength(b);
    }
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function initDB() {
  if (!SUPABASE_KEY) {
    console.log('SUPABASE_ANON_KEY not set — running without persistent storage');
    return;
  }
  try {
    // Try to create table via SQL (PostgREST will execute it)
    // Actually Supabase REST API doesn't support DDL — we need the table pre-created.
    // Test if we can at least read
    const r = await supabaseRequest('GET', '/rest/v1/animal_results?select=id&limit=1');
    console.log('Supabase connection test:', r.status, Array.isArray(r.data) ? 'OK' : r.data.message || r.data);
    dbReady = r.status === 200 || r.status === 406; // 406 = table exists but no rows
  } catch(e) {
    console.log('Supabase init error:', e.message);
  }
}

async function loadResultsFromDB() {
  if (!SUPABASE_KEY) return;
  try {
    const r = await supabaseRequest('GET', '/rest/v1/animal_results?select=*&result_type=eq.animal&order=submitted_at.desc&limit=50000');
    if (Array.isArray(r.data)) {
      results = r.data.map(rec => ({
        id: rec.id, ip: rec.ip, animalId: rec.animal_id,
        animal: { id: rec.animal_id },
        rarity: rec.rarity, rarityName: rec.rarity_name,
        matchPercent: rec.match_percent, mbti: rec.mbti,
        bfScores: rec.bf_scores, secondAnimal: rec.second_animal,
        thirdAnimal: rec.third_animal, allDimensions: rec.all_dimensions,
        submitted_at: rec.submitted_at
      }));
      console.log('Loaded results from Supabase: ' + results.length);
    }
  } catch(e) { console.log('loadResultsFromDB error:', e.message); }
}

async function insertResult(result) {
  if (!dbReady) return;
  try {
    await supabaseRequest('POST', '/rest/v1/animal_results', {
      id: result.id,
      ip: result.ip,
      animal_id: result.animalId,
      rarity: result.rarity,
      rarity_name: result.rarityName,
      match_percent: result.matchPercent,
      mbti: result.mbti,
      bf_scores: result.bfScores,
      second_animal: result.secondAnimal,
      third_animal: result.thirdAnimal,
      all_dimensions: result.allDimensions,
      result_type: 'animal',
      submitted_at: result.submitted_at
    });
  } catch(e) { console.log('insertResult error:', e.message); }
}

async function deleteResultFromDB(id) {
  if (!dbReady) return;
  try {
    await supabaseRequest('DELETE', '/rest/v1/animal_results?id=eq.' + id);
  } catch(e) { console.log('deleteResult error:', e.message); }
}

async function deleteAllResultsFromDB() {
  if (!dbReady) return;
  try {
    await supabaseRequest('DELETE', '/rest/v1/animal_results');
  } catch(e) { console.log('deleteAll error:', e.message); }
}

// ─── In-memory fallback ───────────────────────────────────────────────────────
const RESULTS_FILE = path.join('/tmp', 'animal_results.json');
const USERS_FILE = path.join('/tmp', 'users.json');

function loadResults() {
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
      console.log('Loaded results from disk: ' + results.length);
    }
  } catch(e) { results = []; }
}

function saveResults() {
  try { fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2)); } catch(e) {}
}

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      tokenMap = {};
      users.forEach(u => {
        if (u.token && u.tokenExpiry > Date.now()) tokenMap[u.token] = u.username;
      });
    }
  } catch(e) { users = []; tokenMap = {}; }
}

function saveUsers() {
  try { fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); } catch(e) {}
}

// ─── Boot ────────────────────────────────────────────────────────────────────
loadResults();
loadUsers();
initDB().then(() => loadResultsFromDB());

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'X-Admin-Password', 'X-User-Token'] }));
app.set('trust proxy', 1);
app.use(express.json({ limit: '5mb' }));
app.use(express.static(STATIC_DIR));

function getCallerIP(req) {
  return req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.headers['x-real-ip'] ? req.headers['x-real-ip']
    : req.socket ? (req.socket.remoteAddress || '').replace('::ffff:', '') : '';
}

function getRarityKey(r) {
  var rar = r.rarity;
  if (typeof rar === 'string') return rar.toLowerCase();
  if (typeof rar === 'object' && rar !== null) return (rar.name || 'common').toLowerCase();
  return 'common';
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'fbti_salt_2024').digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// POST /api/results
app.post('/api/results', async function(req, res) {
  var data = req.body || {};
  var resultType = data.resultType || 'animal';

  if (resultType === 'personality') {
    var result = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      resultType: 'personality',
      sbti_type: data.sbti_type || '',
      rarity: data.rarity || 'common',
      role: data.role || '', element: data.element || '',
      keywords: data.keywords || [], stats: data.stats || {},
      sbti_scores: data.sbti_scores || {},
      bf_scores: data.bf_scores || {},
      bigfive_total: data.bigfive_total || 0,
      description: data.description || '',
      submitted_at: new Date().toISOString()
    };
    results.unshift(result);
    if (results.length > 50000) results = results.slice(0, 50000);
    console.log('New personality: ' + result.sbti_type + ' | Total: ' + results.length);
    return res.json({ success: true, id: result.id, total: results.length });
  }

  if (!data.animalId) return res.status(400).json({ error: 'Missing animalId' });
  var rarity = data.rarity;
  if (typeof rarity === 'object' && rarity !== null) rarity = rarity.name || 'common';
  if (typeof rarity !== 'string') rarity = 'common';

  var result = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    resultType: 'animal',
    ip: getCallerIP(req),
    animalId: String(data.animalId),
    animal: data.animal || {},
    rarity: rarity,
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

  // Async Supabase insert (non-blocking)
  insertResult(result).catch(() => {});
  // Local save as fallback
  saveResults();

  console.log('New animal: ' + result.animalId + ' | Total: ' + results.length);
  res.json({ success: true, id: result.id, total: results.length });
});

// GET /api/stats
app.get('/api/stats', function(req, res) {
  try {
    var byRarity = { legendary: 0, epic: 0, rare: 0, common: 0 };
    var byAnimal = {};
    for (var i = 0; i < results.length; i++) {
      try {
        var r = results[i];
        var k = 'common';
        try { k = getRarityKey(r); } catch(e2) {}
        if (k === 'legendary') byRarity.legendary++;
        else if (k === 'epic') byRarity.epic++;
        else if (k === 'rare') byRarity.rare++;
        else byRarity.common++;
        var id = r.animalId ? String(r.animalId) : 'unknown';
        byAnimal[id] = (byAnimal[id] || 0) + 1;
      } catch(e1) {}
    }
    var entries = Object.keys(byAnimal).map(function(key) { return { type: key, count: byAnimal[key] }; });
    entries.sort(function(a, b) { return b.count - a.count; });
    res.json({ total: results.length, by_rarity: byRarity, top_types: entries.slice(0, 20) });
  } catch (e) {
    res.json({ total: results.length, by_rarity: { legendary: 0, epic: 0, rare: 0, common: 0 }, top_types: [] });
  }
});

// GET /api/admin/results
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
        total: results.length, by_rarity: byRarity,
        top_types: entries2.slice(0, 20).map(function(e) { return { type: e[0], count: e[1] }; })
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/admin/results/:id
app.delete('/api/admin/results/:id', function(req, res) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  var before = results.length;
  results = results.filter(function(r) { return r.id !== req.params.id; });
  saveResults();
  deleteResultFromDB(req.params.id).catch(() => {});
  res.json({ success: true, deleted: before - results.length, total: results.length });
});

// DELETE /api/admin/results
app.delete('/api/admin/results', function(req, res) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  var count = results.length;
  results = [];
  saveResults();
  deleteAllResultsFromDB().catch(() => {});
  res.json({ success: true, deleted: count });
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', function(req, res) {
  var body = req.body || {};
  var username = (body.username || '').trim();
  var password = body.password || '';
  var name = (body.name || '').trim();
  var city = (body.city || '').trim();
  var gender = body.gender || '';
  var phone = (body.phone || '').trim();
  var qq = (body.qq || '').trim();
  var wechat = (body.wechat || '').trim();

  if (!username || username.length < 2) return res.json({ success: false, error: '账号至少2个字符' });
  if (!password || password.length < 6) return res.json({ success: false, error: '密码至少6位' });
  if (users.some(function(u) { return u.username === username; })) return res.json({ success: false, error: '账号已存在' });

  var user = {
    username: username,
    passwordHash: hashPassword(password),
    name: name || username,
    city: city,
    gender: gender,
    phone: phone,
    qq: qq,
    wechat: wechat,
    token: generateToken(),
    tokenExpiry: Date.now() + (TOKEN_EXPIRY_HOURS * 3600000),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  tokenMap[user.token] = username;
  saveUsers();

  var returnUser = { username: user.username, name: user.name, city: user.city, gender: user.gender, createdAt: user.createdAt };
  res.json({ success: true, user: returnUser, token: user.token });
});

app.post('/api/auth/login', function(req, res) {
  var body = req.body || {};
  var username = (body.username || '').trim();
  var password = body.password || '';
  if (!username || !password) return res.json({ success: false, error: '请填写账号和密码' });

  var user = users.find(function(u) { return u.username === username; });
  if (!user || user.passwordHash !== hashPassword(password)) return res.json({ success: false, error: '账号或密码错误' });

  user.token = generateToken();
  user.tokenExpiry = Date.now() + (TOKEN_EXPIRY_HOURS * 3600000);
  tokenMap[user.token] = username;
  saveUsers();

  var returnUser = { username: user.username, name: user.name, city: user.city, gender: user.gender, createdAt: user.createdAt };
  res.json({ success: true, user: returnUser, token: user.token });
});

app.get('/api/auth/me', function(req, res) {
  var token = req.headers['x-user-token'] || '';
  var username = tokenMap[token];
  if (!username) return res.json({ user: null });
  var user = users.find(function(u) { return u.username === username; });
  if (!user || user.tokenExpiry < Date.now()) {
    delete tokenMap[token];
    return res.json({ user: null });
  }
  res.json({ user: { username: user.username, name: user.name, city: user.city, gender: user.gender, createdAt: user.createdAt } });
});

// ─── Comment Routes ─────────────────────────────────────────────────────────
async function insertComment(comment) {
  if (!SUPABASE_KEY) return;
  try {
    await supabaseRequest('POST', '/rest/v1/comments', comment);
  } catch(e) { console.log('insertComment error:', e.message); }
}

app.get('/api/comments', function(req, res) {
  var inMemory = comments.slice().reverse().map(function(c) {
    return { id: c.id, username: c.username, name: c.name || c.username, text: c.text, createdAt: c.created_at };
  });
  if (!SUPABASE_KEY) return res.json({ comments: inMemory });
  supabaseRequest('GET', '/rest/v1/comments?select=*&order=created_at.desc&limit=100')
    .then(function(r) {
      if (Array.isArray(r.data) && r.data.length > 0) {
        var dbComments = r.data.map(function(c) {
          return { id: c.id, username: c.username, name: c.name || c.username, text: c.text, createdAt: c.created_at };
        });
        // Merge: db + in-memory, dedupe by id
        var merged = dbComments.concat(inMemory.filter(function(ic) {
          return !dbComments.some(function(dc) { return dc.id === ic.id; });
        }));
        res.json({ comments: merged });
      } else {
        res.json({ comments: inMemory });
      }
    })
    .catch(function() { res.json({ comments: inMemory }); });
});

app.post('/api/comments', function(req, res) {
  var token = req.headers['x-user-token'] || '';
  var username = tokenMap[token];
  if (!username) return res.status(401).json({ success: false, error: '请先登录' });

  var body = req.body || {};
  var text = (body.text || '').trim();
  if (!text || text.length < 2) return res.json({ success: false, error: '留言内容至少2个字' });
  if (text.length > 500) text = text.substring(0, 500);

  var user = users.find(function(u) { return u.username === username; });
  var comment = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    username: username,
    name: user ? (user.name || username) : username,
    text: text,
    created_at: new Date().toISOString()
  };

  comments.push(comment);
  insertComment(comment).catch(function() {});
  res.json({ success: true, comment: { id: comment.id, username: comment.username, name: comment.name, text: comment.text, createdAt: comment.created_at } });
});

// GET /health
app.get('/health', function(req, res) {
  res.json({ status: 'ok', db_ready: dbReady, supabase_key_set: !!SUPABASE_KEY, total: results.length, users: users.length, uptime: Math.floor(process.uptime()) });
});

// GET /
app.get('/', function(req, res) { res.redirect('/animal_quiz.html'); });

app.listen(PORT, '0.0.0.0', function() {
  console.log('Server running on port: ' + PORT);
  console.log('Admin password: ' + ADMIN_PASSWORD);
  console.log('Supabase:', SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY set:', SUPABASE_KEY ? 'yes (' + SUPABASE_KEY.substring(0, 8) + '...)' : 'NO');
});

// force-rebuild: 2026-04-23 13:05:00
