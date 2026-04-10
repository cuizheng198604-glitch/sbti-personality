const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'results.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbti-admin-2026';

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function load() {
  try {
    ensureDir();
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {}
  return [];
}

function save(results) {
  ensureDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2), 'utf-8');
}

module.exports = (req, res) => {
  const { method, url } = req;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  if (method === 'OPTIONS') { res.status(200).end(); return; }

  // Vercel mounts at /api, so strip it for routing
  const path = url.startsWith('/api') ? url.slice(4) : url;

  // ── POST /api/results ────────────────────────────────
  if (method === 'POST' && path === '/results') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const d = JSON.parse(body);
        if (!d.sbti_type || !d.rarity) { res.status(400).json({ error: '缺少必要字段' }); return; }
        const result = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          sbti_type: d.sbti_type, rarity: d.rarity, role: d.role || '',
          element: d.element || '', keywords: d.keywords || [],
          stats: d.stats || {}, skills: d.skills || [],
          sbti_scores: d.sbti_scores || {}, bf_scores: d.bf_scores || {},
          bigfive_total: d.bigfive_total || 0, description: d.description || '',
          submitted_at: new Date().toISOString(),
        };
        const all = load();
        all.unshift(result);
        save(all);
        res.json({ success: true, id: result.id, total: all.length });
      } catch (e) { res.status(500).json({ error: '服务器错误' }); }
    });
    return;
  }

  // ── GET /api/stats ───────────────────────────────
  if (method === 'GET' && path === '/stats') {
    const all = load();
    const stats = {
      total: all.length,
      by_rarity: { Common: 0, Rare: 0, Special: 0, Legendary: 0 },
      top_types: [],
    };
    all.forEach(r => { stats.by_rarity[r.rarity] = (stats.by_rarity[r.rarity] || 0) + 1; });
    const tm = {};
    all.forEach(r => { tm[r.sbti_type] = (tm[r.sbti_type] || 0) + 1; });
    stats.top_types = Object.entries(tm).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t, c]) => ({ type: t, count: c }));
    res.json(stats);
    return;
  }

  // ── GET /api/admin/results ────────────────────────
  if (method === 'GET' && path === '/admin/results') {
    if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) { res.status(401).json({ error: '未授权' }); return; }
    const all = load();
    const stats = { total: all.length, by_type: {}, by_rarity: { Common: 0, Rare: 0, Special: 0, Legendary: 0 }, top_types: [], avg_bf_total: 0 };
    let bfSum = 0;
    all.forEach(r => {
      stats.by_rarity[r.rarity] = (stats.by_rarity[r.rarity] || 0) + 1;
      stats.by_type[r.sbti_type] = (stats.by_type[r.sbti_type] || 0) + 1;
      bfSum += r.bigfive_total || 0;
    });
    if (all.length) stats.avg_bf_total = Math.round(bfSum / all.length);
    stats.top_types = Object.entries(stats.by_type).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t, c]) => ({ type: t, count: c }));
    res.json({ results: all, stats });
    return;
  }

  // ── DELETE /api/admin/results/:id ─────────────
  if (method === 'DELETE' && path.startsWith('/admin/results/')) {
    if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) { res.status(401).json({ error: '未授权' }); return; }
    const id = path.split('/').pop();
    save(load().filter(r => r.id !== id));
    res.json({ success: true });
    return;
  }

  // ── DELETE /api/admin/results ────────────────
  if (method === 'DELETE' && path === '/admin/results') {
    if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) { res.status(401).json({ error: '未授权' }); return; }
    save([]);
    res.json({ success: true });
    return;
  }

  // 404
  res.status(404).json({ error: 'Not Found' });
};
