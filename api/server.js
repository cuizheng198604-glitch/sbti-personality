const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'results.json');
const COMMENTS_FILE = path.join(__dirname, 'comments.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbti-admin-2026';

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── 结果存储 ───────────────────────────────────────
function loadResults() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {}
  return [];
}

function saveResults(results) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2), 'utf-8');
}

// ─── 留言存储 ───────────────────────────────────────
function loadComments() {
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function saveComments(comments) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
}

// ─── 提交结果 ───────────────────────────────────────
app.post('/api/results', (req, res) => {
  const { sbti_type, rarity, role, element, keywords, stats, skills, sbti_scores, bf_scores, bigfive_total, description } = req.body;

  if (!sbti_type || !rarity) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  const result = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    sbti_type,
    rarity,
    role: role || '',
    element: element || '',
    keywords: keywords || [],
    stats: stats || {},
    skills: skills || [],
    sbti_scores: sbti_scores || {},
    bf_scores: bf_scores || {},
    bigfive_total: bigfive_total || 0,
    description: description || '',
    submitted_at: new Date().toISOString(),
    ip_hash: '', // 不记录完整IP，只留哈希用于统计
  };

  const results = loadResults();
  results.unshift(result); // 最新在前
  saveResults(results);

  res.json({ success: true, id: result.id, total: results.length });
});

// ─── 获取全部结果（需密码）────────────────────────────
app.get('/api/admin/results', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }

  const results = loadResults();
  const stats = {
    total: results.length,
    by_type: {},
    by_rarity: { Common: 0, Rare: 0, Special: 0, Legendary: 0 },
    top_types: [],
    avg_bf_total: 0,
  };

  let bf_sum = 0;
  results.forEach(r => {
    stats.by_rarity[r.rarity] = (stats.by_rarity[r.rarity] || 0) + 1;
    stats.by_type[r.sbti_type] = (stats.by_type[r.sbti_type] || 0) + 1;
    bf_sum += r.bigfive_total || 0;
  });

  if (results.length > 0) {
    stats.avg_bf_total = Math.round(bf_sum / results.length);
  }

  // 按次数排序
  stats.top_types = Object.entries(stats.by_type)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type, count]) => ({ type, count }));

  res.json({ results, stats });
});

// ─── 统计数据（公开）───────────────────────────────
app.get('/api/stats', (req, res) => {
  const results = loadResults();
  const stats = {
    total: results.length,
    by_rarity: { Common: 0, Rare: 0, Special: 0, Legendary: 0 },
    top_types: [],
  };
  results.forEach(r => {
    stats.by_rarity[r.rarity] = (stats.by_rarity[r.rarity] || 0) + 1;
  });
  stats.top_types = Object.entries(
    results.reduce((acc, r) => {
      acc[r.sbti_type] = (acc[r.sbti_type] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t, c]) => ({ type: t, count: c }));

  res.json(stats);
});

// ─── 删除单条结果 ─────────────────────────────────
app.delete('/api/admin/results/:id', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }
  const results = loadResults().filter(r => r.id !== req.params.id);
  saveResults(results);
  res.json({ success: true, total: results.length });
});

// ─── 清空全部结果 ────────────────────────────────
app.delete('/api/admin/results', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }
  saveResults([]);
  res.json({ success: true });
});

// ─── 提交留言 ───────────────────────────────────────
app.post('/api/comments', (req, res) => {
  const { name, location, phone, content, animal_result, animal_rarity } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: '请填写姓名' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '请填写留言内容' });
  }

  const comment = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name.trim(),
    location: location ? location.trim() : '',
    phone: phone ? phone.trim() : '',
    content: content.trim(),
    animal_result: animal_result || '',
    animal_rarity: animal_rarity || '',
    submitted_at: new Date().toISOString(),
  };

  const comments = loadComments();
  comments.unshift(comment);
  saveComments(comments);

  res.json({ success: true, id: comment.id, total: comments.length });
});

// ─── 获取全部留言（需密码）────────────────────────────
app.get('/api/admin/comments', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }

  const comments = loadComments();
  const stats = {
    total: comments.length,
    by_location: {},
    has_phone: 0,
  };

  comments.forEach(c => {
    if (c.location) {
      stats.by_location[c.location] = (stats.by_location[c.location] || 0) + 1;
    }
    if (c.phone) stats.has_phone++;
  });

  res.json({ comments, stats });
});

// ─── 删除单条留言 ─────────────────────────────────
app.delete('/api/admin/comments/:id', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }
  const comments = loadComments().filter(c => c.id !== req.params.id);
  saveComments(comments);
  res.json({ success: true, total: comments.length });
});

// ─── 清空全部留言 ────────────────────────────────
app.delete('/api/admin/comments', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '未授权' });
  }
  saveComments([]);
  res.json({ success: true });
});

// ─── 提交结果时从问卷页调用 ──────────────────────────
app.get('/submit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});

app.listen(PORT, () => {
  console.log(`SBTI Backend running on port ${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
