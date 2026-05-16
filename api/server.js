const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbti-admin-2026';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const STATIC_DIR = process.env.STATIC_DIR || path.join(process.cwd(), 'public');
const DATA_DIR = process.env.RENDER_DISK_PATH || '/tmp';
const DATA_FILE = path.join(DATA_DIR, 'animal_results.json');

console.log('STATIC_DIR:', STATIC_DIR);
console.log('DATA_FILE:', DATA_FILE);

var results = [];

async function loadResultsFromSupabase() {
  if (!SUPABASE_SERVICE_KEY || !SUPABASE_URL) return [];
  try {
    var sbHeaders = { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY };
    var allResults = [];
    var page = 0;
    var pageSize = 1000;
    while (true) {
      var offset = page * pageSize;
      var url = SUPABASE_URL + '/rest/v1/animal_results?select=*&order=submitted_at.desc&limit=' + pageSize + '&offset=' + offset;
      var res = await fetch(url, { headers: sbHeaders });
      if (!res.ok) break;
      var data = await res.json();
      if (!data || data.length === 0) break;
      allResults = allResults.concat(data);
      if (data.length < pageSize) break;
      page++;
      if (page > 50) break;
    }
    console.log('Supabase loaded: ' + allResults.length + ' records');
    return allResults.map(normalizeRecord);
  } catch(e) {
    console.log('Supabase load error: ' + e.message);
    return [];
  }
}

async function loadResults() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      results = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      console.log('File loaded: ' + results.length + ' records');
    }
  } catch (e) {
    console.log('File load error: ' + e.message);
  }
  var sbResults = await loadResultsFromSupabase();
  if (sbResults.length > 0) {
    var existingIds = {};
    for (var i = 0; i < results.length; i++) existingIds[results[i].id] = true;
    var newRecords = sbResults.filter(function(r) { return !existingIds[r.id]; });
    console.log('Merging ' + newRecords.length + ' new records from Supabase');
    results = sbResults.concat(newRecords);
    results.sort(function(a, b) {
      var ta = new Date(a.submitted_at || 0).getTime();
      var tb = new Date(b.submitted_at || 0).getTime();
      return tb - ta;
    });
    saveResults();
  }
  if (results.length === 0) {
    results = sbResults;
  }
  console.log('Total results: ' + results.length);
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
// Trust proxy for correct IP detection behind Render load balancer
app.set('trust proxy', 1);
app.use(express.json({ limit: '5mb' }));
app.use(express.static(STATIC_DIR));

// 提取rarity字符串
function getCallerIP(req) {
  return req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.headers['x-real-ip'] ? req.headers['x-real-ip']
    : req.socket ? (req.socket.remoteAddress || '').replace('::ffff:', '')
    : '';
}

function getRarityKey(r) {
  var rar = r.rarity;
  if (typeof rar === 'string') return rar.toLowerCase();
  if (typeof rar === 'object' && rar !== null) return (rar.name || 'common').toLowerCase();
  return 'common';
}

// ANIMALS lookup for normalizing animal data (matches public/admin.html ANIMALS map)
var ANIMALS_MAP = {
  fox:    { name: '\u72d0\u72f8',     emoji: '\ud83e\udd8a' },
  wolf:   { name: '\u72fc',           emoji: '\ud83e\udda1' },
  owl:    { name: '\u732b\u5934\u9e70', emoji: '\ud83e\udd89' },
  dolphin:{ name: '\u6d77\u8102',    emoji: '\ud83d\udc2c' },
  rabbit: { name: '\u5154\u5b50',    emoji: '\ud83d\udc30' },
  tiger:  { name: '\u8001\u864e',    emoji: '\ud83d\udc2f' },
  panda:  { name: '\u718a\u732b',    emoji: '\ud83d\udc3c' },
  eagle:  { name: '\u8001\u9e70',    emoji: '\ud83e\udd85' },
  bear:   { name: '\u718a',           emoji: '\ud83d\udc3b' },
  lion:   { name: '\u72ee\u5b50',    emoji: '\ud83e\udd81' },
  phoenix:{ name: '\u51e4\u51f0',    emoji: '\ud83e\udd76' },
  dragon: { name: '\u9f99',          emoji: '\ud83d\udc09' },
  peacock:{ name: '\u5b54\u96c0',    emoji: '\ud83e\udd82' },
  cat:    { name: '\u732b',           emoji: '\ud83d\udc31' },
  dog:    { name: '\u72d7',           emoji: '\ud83d\udc36' },
  elephant:{ name: '\u5927\u8c61',  emoji: '\ud83d\udc18' },
  horse:  { name: '\u9a6c',           emoji: '\ud83d\udc34' },
  monkey: { name: '\u7334\u5b50',   emoji: '\ud83d\udc35' },
  deer:   { name: '\u9e7f',           emoji: '\ud83e\udd84' },
  foxhq:  { name: '\u72d0\u72f8(\u597d\u5947\u578b)', emoji: '\ud83e\udd8a' }
};

// Normalize a record from Supabase (snake_case) or memory (camelCase) to a consistent format
function normalizeRecord(r) {
  if (!r) return r;
  var nr = {
    id: r.id || r.id,
    resultType: r.resultType || r.result_type || 'animal',
    ip: r.ip || '',
    submitted_at: r.submitted_at || r.submittedAt || ''
  };
  // animalId: prefer camelCase, fallback to snake_case
  nr.animalId = r.animalId || r.animal_id || '';
  // animal: derived lookup from ANIMALS_MAP
  var animalKey = (nr.animalId || '').toLowerCase();
  if (animalKey && ANIMALS_MAP[animalKey]) {
    nr.animal = { id: animalKey, name: ANIMALS_MAP[animalKey].name, emoji: ANIMALS_MAP[animalKey].emoji };
  } else {
    nr.animal = { id: animalKey, name: animalKey, emoji: '' };
  }
  // rarity
  if (typeof r.rarity === 'object' && r.rarity !== null) {
    nr.rarity = r.rarity.name || 'common';
    nr.rarityName = r.rarity.label || r.rarity.name || '';
  } else {
    nr.rarity = r.rarity || r.rarity_name || 'common';
    nr.rarityName = r.rarityName || r.rarity_name || '';
  }
  // matchPercent
  nr.matchPercent = r.matchPercent || r.match_percent || 0;
  // mbti
  nr.mbti = r.mbti || '';
  // bfScores
  nr.bfScores = r.bfScores || r.bf_scores || {};
  // secondAnimal / thirdAnimal (deep copy + normalize)
  if (r.second_animal || r.secondAnimal) {
    var sa = r.second_animal || r.secondAnimal;
    nr.secondAnimal = {
      id: sa.id || '',
      name: sa.name || '',
      emoji: sa.emoji || '',
      rarity: sa.rarity || '',
      traits: sa.traits || [],
      keyword: sa.keyword || '',
      profile: sa.profile || {},
      description: sa.description || '',
      strength: sa.strength || '',
      weakness: sa.weakness || '',
      bestMatch: sa.bestMatch || sa.best_match || [],
      worstMatch: sa.worstMatch || sa.worst_match || []
    };
  } else {
    nr.secondAnimal = null;
  }
  if (r.third_animal || r.thirdAnimal) {
    var ta = r.third_animal || r.thirdAnimal;
    nr.thirdAnimal = {
      id: ta.id || '',
      name: ta.name || '',
      emoji: ta.emoji || '',
      rarity: ta.rarity || '',
      traits: ta.traits || [],
      keyword: ta.keyword || '',
      profile: ta.profile || {},
      description: ta.description || '',
      strength: ta.strength || '',
      weakness: ta.weakness || '',
      bestMatch: ta.bestMatch || ta.best_match || [],
      worstMatch: ta.worstMatch || ta.worst_match || []
    };
  } else {
    nr.thirdAnimal = null;
  }
  // allDimensions
  nr.allDimensions = r.allDimensions || r.all_dimensions || {};
  // personality-specific fields
  if (nr.resultType === 'personality') {
    nr.sbti_type = r.sbti_type || r.sbtiType || '';
    nr.role = r.role || '';
    nr.element = r.element || '';
    nr.keywords = r.keywords || [];
    nr.stats = r.stats || {};
    nr.bigfive_total = r.bigfive_total || 0;
    nr.description = r.description || '';
    nr.sbti_scores = r.sbti_scores || {};
  }
  return nr;
}

app.post('/api/results', function(req, res) {
  var data = req.body || {};
  var resultType = data.resultType || 'animal';

  if (resultType === 'personality') {
    // 人格测试结果
    var sbti_scores = data.sbti_scores || {};
    var bf_scores = data.bf_scores || {};
    var result = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      resultType: 'personality',
      sbti_type: data.sbti_type || '',
      rarity: data.rarity || 'common',
      role: data.role || '',
      element: data.element || '',
      keywords: data.keywords || [],
      stats: data.stats || {},
      sbti_scores: sbti_scores,
      bf_scores: bf_scores,
      bigfive_total: data.bigfive_total || 0,
      description: data.description || '',
      submitted_at: new Date().toISOString()
    };
    results.unshift(result);
    if (results.length > 50000) results = results.slice(0, 50000);
    saveResults();
    console.log('New: ' + result.sbti_type + ' | Total: ' + results.length);
    return res.json({ success: true, id: result.id, total: results.length });
  }

  // 动物测试结果
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
  saveResults();
  console.log('New: ' + result.animalId + ' | Total: ' + results.length);
  res.json({ success: true, id: result.id, total: results.length });
});

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
      } catch(e1) { console.log('Record error: ' + e1.message); }
    }
    var entries = Object.keys(byAnimal).map(function(key) { return { type: key, count: byAnimal[key] }; });
    entries.sort(function(a, b) { return b.count - a.count; });
    var top = entries.slice(0, 20);
    res.json({ total: results.length, by_rarity: byRarity, top_types: top });
  } catch (e) {
    console.log('Stats error: ' + e.message + ' | ' + (e.stack || '').split('\n')[1]);
    res.json({ total: results.length, by_rarity: { legendary: 0, epic: 0, rare: 0, common: 0 }, top_types: [], error: e.message });
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
      results: results.slice(0, 2000).map(normalizeRecord),
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

app.get('/health', async function(req, res) {
  var sbUsers = 0, sbComments = 0, sbAnimals = 0, dbStatus = 'disconnected';
  if (SUPABASE_SERVICE_KEY && SUPABASE_URL) {
    try {
      var sbHeaders = { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY };
      var uRes = await fetch(SUPABASE_URL + '/rest/v1/users?select=id', { headers: sbHeaders });
      if (uRes.ok) { var ud = await uRes.json(); sbUsers = ud.length || 0; }
      var cRes = await fetch(SUPABASE_URL + '/rest/v1/comments?select=id', { headers: sbHeaders });
      if (cRes.ok) { var cd = await cRes.json(); sbComments = cd.length || 0; }
      var aRes = await fetch(SUPABASE_URL + '/rest/v1/animal_results?select=id', { headers: sbHeaders });
      if (aRes.ok) { var ad = await aRes.json(); sbAnimals = ad.length || 0; }
      dbStatus = 'connected';
    } catch(e) { dbStatus = 'error: ' + e.message; }
  }
  res.json({
    status: 'ok',
    database: dbStatus,
    total_results: results.length,
    total_users: sbUsers,
    total_comments: sbComments,
    total_animal_results: sbAnimals,
    supabase_key_set: !!(SUPABASE_SERVICE_KEY && SUPABASE_URL),
    uptime: Math.floor(process.uptime())
  });
});

app.get('/', function(req, res) {
  res.redirect('/animal_quiz.html');
});


// ── Auth & Comments ──────────────────────────────────────────────
function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'fbti_salt_2024').digest('hex');
}
function getCallerIP(req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
}

// POST /api/auth/register
app.post('/api/auth/register', async function(req, res) {
  try {
    var body = req.body || {};
    var username = (body.username || '').trim();
    var password = body.password || '';
    if (!username || !password) return res.json({ success: false, error: '用户名和密码不能为空' });
    if (password.length < 6) return res.json({ success: false, error: '密码至少6位' });
    var name = body.name || '';
    var city = body.city || '';
    var gender = body.gender || '';
    var phone = body.phone || '';
    var qq = body.qq || '';
    var wechat = body.wechat || '';
    var passwordHash = hashPassword(password);
    var token = makeToken();
    // Check if username exists
    var checkUrl = SUPABASE_URL + '/rest/v1/users?username=eq.' + encodeURIComponent(username) + '&select=id';
    var checkRes = await fetch(checkUrl, { headers: sbHeaders });
    if (checkRes.ok) {
      var existing = await checkRes.json();
      if (existing && existing.length > 0) return res.json({ success: false, error: '用户名已存在' });
    }
    var insertData = {
      username: username,
      password_hash: passwordHash,
      name: name,
      city: city,
      gender: gender,
      phone: phone,
      qq: qq,
      wechat: wechat,
      token: token,
      created_at: new Date().toISOString()
    };
    var insRes = await fetch(SUPABASE_URL + '/rest/v1/users', {
      method: 'POST',
      headers: Object.assign({}, sbHeaders, { 'Prefer': 'return=representation' }),
      body: JSON.stringify(insertData)
    });
    if (!insRes.ok) {
      var errText = await insRes.text();
      console.log('Register error:', errText);
      return res.json({ success: false, error: '注册失败，请稍后重试' });
    }
    var newUser = await insRes.json();
    var user = Array.isArray(newUser) ? newUser[0] : newUser;
    delete user.password_hash;
    res.json({ success: true, user: user, token: token });
  } catch(e) {
    console.log('Register error:', e.message);
    res.json({ success: false, error: '服务器错误' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async function(req, res) {
  try {
    var body = req.body || {};
    var username = (body.username || '').trim();
    var password = body.password || '';
    if (!username || !password) return res.json({ success: false, error: '用户名和密码不能为空' });
    var passwordHash = hashPassword(password);
    var url = SUPABASE_URL + '/rest/v1/users?username=eq.' + encodeURIComponent(username) + '&select=*';
    var r = await fetch(url, { headers: sbHeaders });
    if (!r.ok) return res.json({ success: false, error: '登录失败' });
    var users = await r.json();
    if (!users || users.length === 0) return res.json({ success: false, error: '用户名或密码错误' });
    var user = users[0];
    if (user.password_hash !== passwordHash) return res.json({ success: false, error: '用户名或密码错误' });
    var newToken = makeToken();
    await fetch(SUPABASE_URL + '/rest/v1/users?id=eq.' + user.id, {
      method: 'PATCH',
      headers: Object.assign({}, sbHeaders, { 'Prefer': 'return=representation' }),
      body: JSON.stringify({ token: newToken })
    });
    delete user.password_hash;
    res.json({ success: true, user: user, token: newToken });
  } catch(e) {
    console.log('Login error:', e.message);
    res.json({ success: false, error: '服务器错误' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', async function(req, res) {
  try {
    var token = req.headers['x-user-token'] || '';
    if (!token) return res.json({ user: null });
    var url = SUPABASE_URL + '/rest/v1/users?token=eq.' + encodeURIComponent(token) + '&select=*';
    var r = await fetch(url, { headers: sbHeaders });
    if (!r.ok) return res.json({ user: null });
    var users = await r.json();
    if (!users || users.length === 0) return res.json({ user: null });
    var user = users[0];
    delete user.password_hash;
    res.json({ user: user });
  } catch(e) {
    res.json({ user: null });
  }
});

// GET /api/comments
app.get('/api/comments', async function(req, res) {
  try {
    var url = SUPABASE_URL + '/rest/v1/comments?select=*&order=created_at.desc&limit=100';
    var r = await fetch(url, { headers: sbHeaders });
    if (!r.ok) return res.json({ comments: [] });
    var comments = await r.json();
    // Enrich with username from users table
    var enriched = await Promise.all((comments || []).map(async function(c) {
      if (c.user_id) {
        try {
          var uRes = await fetch(SUPABASE_URL + '/rest/v1/users?id=eq.' + c.user_id + '&select=username,name', { headers: sbHeaders });
          if (uRes.ok) {
            var u = await uRes.json();
            if (u && u.length > 0) {
              c.username = u[0].username;
              c.name = u[0].name || u[0].username;
            }
          }
        } catch(e) {}
      }
      c.name = c.name || c.username || '匿名用户';
      return c;
    }));
    res.json({ comments: enriched });
  } catch(e) {
    console.log('Comments error:', e.message);
    res.json({ comments: [] });
  }
});

// POST /api/comments
app.post('/api/comments', async function(req, res) {
  try {
    var token = req.headers['x-user-token'] || '';
    var body = req.body || {};
    var text = (body.text || '').trim();
    if (!text || text.length < 2) return res.json({ success: false, error: '留言内容至少2个字' });
    if (!token) return res.json({ success: false, error: '请先登录' });
    // Find user by token
    var url = SUPABASE_URL + '/rest/v1/users?token=eq.' + encodeURIComponent(token) + '&select=id';
    var r = await fetch(url, { headers: sbHeaders });
    if (!r.ok) return res.json({ success: false, error: '验证失败' });
    var users = await r.json();
    if (!users || users.length === 0) return res.json({ success: false, error: '无效的登录状态' });
    var userId = users[0].id;
    var insRes = await fetch(SUPABASE_URL + '/rest/v1/comments', {
      method: 'POST',
      headers: Object.assign({}, sbHeaders, { 'Prefer': 'return=representation' }),
      body: JSON.stringify({
        user_id: userId,
        text: text,
        created_at: new Date().toISOString()
      })
    });
    if (!insRes.ok) {
      var errText = await insRes.text();
      return res.json({ success: false, error: '留言失败: ' + errText });
    }
    res.json({ success: true });
  } catch(e) {
    console.log('Comment post error:', e.message);
    res.json({ success: false, error: '服务器错误' });
  }
});

loadResults().then(function() {
  app.listen(PORT, '0.0.0.0', function() {
    console.log('Server running on port: ' + PORT);
    console.log('Admin password: ' + ADMIN_PASSWORD);
    console.log('Data file: ' + DATA_FILE);
    console.log('Total results loaded: ' + results.length);
  });
}).catch(function(e) {
  console.log('Startup error: ' + e.message);
  app.listen(PORT, '0.0.0.0', function() {
    console.log('Server running (load error) on port: ' + PORT);
  });
});
