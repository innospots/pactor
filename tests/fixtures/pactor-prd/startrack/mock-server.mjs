#!/usr/bin/env node
import { createServer } from 'node:http';

const HOST = '127.0.0.1';
const PORT = 19011;
const MODES = new Set(['normal', 'list-error', 'detail-error', 'save-error']);
const STATUS_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'ACTIVE' },
  { label: '已完成', value: 'COMPLETED' },
];
const INITIAL_PROJECTS = [
  {
    id: 'prj-aurora',
    name: '极光移动端',
    code: 'AURORA',
    status: 'ACTIVE',
    owner: '林澈',
    progress: 68,
    dueDate: '2026-11-15',
    description: '完成星轨项目台移动端的核心协作流程。',
    updatedAt: '2026-10-18 09:30',
  },
  {
    id: 'prj-atlas',
    name: '星图数据迁移',
    code: 'ATLAS',
    status: 'COMPLETED',
    owner: '周遥',
    progress: 100,
    dueDate: '2026-10-10',
    description: '将历史项目数据迁移到统一星图模型。',
    updatedAt: '2026-10-10 18:00',
  },
];

let projects;
let mode;
let nextProjectNumber;
let saveSequence;

function resetState() {
  projects = INITIAL_PROJECTS.map((project) => ({ ...project }));
  mode = 'normal';
  nextProjectNumber = 3;
  saveSequence = 0;
}

function sendJson(response, status, body) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
  });
  response.end(payload);
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      const error = new Error('请求体过大');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  const text = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(text);
  } catch {
    const error = new Error('请求体必须是 JSON');
    error.status = 400;
    throw error;
  }
}

function saveTimestamp() {
  saveSequence += 1;
  const timestamp = new Date(Date.UTC(2026, 9, 18, 10, 0) + saveSequence * 60_000);
  return timestamp.toISOString().slice(0, 16).replace('T', ' ');
}

function dashboard() {
  const recentProjects = [...projects]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 5);
  return {
    stats: {
      total: projects.length,
      active: projects.filter((project) => project.status === 'ACTIVE').length,
      completed: projects.filter((project) => project.status === 'COMPLETED').length,
    },
    recentProjects,
  };
}

function projectList(searchParams) {
  const keyword = (searchParams.get('keyword') ?? '').trim().toLocaleLowerCase();
  const status = searchParams.get('status') ?? '';
  const items = projects.filter((project) => {
    const keywordMatches =
      keyword === '' ||
      project.name.toLocaleLowerCase().includes(keyword) ||
      project.code.toLocaleLowerCase().includes(keyword);
    const statusMatches = status === '' || status === 'all' || project.status === status;
    return keywordMatches && statusMatches;
  });
  return { items, total: items.length, filters: { status: STATUS_OPTIONS } };
}

function validateSave(body, existing) {
  const requiredText = ['name', 'owner', 'dueDate'];
  for (const field of requiredText) {
    if (typeof body[field] !== 'string' || body[field].trim() === '') {
      return `${field} 不能为空`;
    }
  }
  if (!existing && (typeof body.code !== 'string' || body.code.trim() === '')) {
    return 'code 不能为空';
  }
  if (!['ACTIVE', 'COMPLETED'].includes(body.status)) return 'status 不合法';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate)) return 'dueDate 必须为 YYYY-MM-DD';
  const progress = Number(body.progress);
  if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
    return 'progress 必须位于 0–100';
  }
  return null;
}

function saveProject(body) {
  const id = typeof body.id === 'string' ? body.id : '';
  const existingIndex = id === '' ? -1 : projects.findIndex((project) => project.id === id);
  if (id !== '' && existingIndex === -1) {
    return { status: 404, body: { error: '项目不存在' } };
  }
  const existing = existingIndex === -1 ? null : projects[existingIndex];
  const validationError = validateSave(body, existing);
  if (validationError) return { status: 400, body: { error: validationError } };

  const saved = {
    id: existing?.id ?? `prj-${nextProjectNumber}`,
    name: body.name.trim(),
    code: existing?.code ?? body.code.trim(),
    status: body.status,
    owner: body.owner.trim(),
    progress: Number(body.progress),
    dueDate: body.dueDate,
    description: typeof body.description === 'string' ? body.description : '',
    updatedAt: saveTimestamp(),
  };
  if (existingIndex === -1) {
    nextProjectNumber += 1;
    projects.push(saved);
  } else {
    projects[existingIndex] = saved;
  }
  return { status: 200, body: { code: 0, data: { ok: true }, message: 'ok' } };
}

async function handle(request, response) {
  const url = new URL(request.url ?? '/', `http://${HOST}:${PORT}`);
  const { pathname } = url;

  if (pathname === '/__mock/mode') {
    if (request.method === 'GET') {
      sendJson(response, 200, { mode });
      return;
    }
    if (request.method === 'POST') {
      const body = await readJson(request);
      if (!MODES.has(body.mode)) {
        sendJson(response, 400, {
          error: `mode 必须为 ${Array.from(MODES).join(', ')}`,
        });
        return;
      }
      mode = body.mode;
      sendJson(response, 200, { mode });
      return;
    }
    sendJson(response, 405, { error: 'Method Not Allowed' });
    return;
  }

  if (pathname === '/__mock/reset') {
    if (request.method !== 'POST') {
      sendJson(response, 405, { error: 'Method Not Allowed' });
      return;
    }
    resetState();
    sendJson(response, 200, { ok: true, mode, projects: projects.length });
    return;
  }

  if (pathname === '/api/d/dashboard' && request.method === 'GET') {
    sendJson(response, 200, dashboard());
    return;
  }

  if (pathname === '/api/d/projects' && request.method === 'GET') {
    if (mode === 'list-error') {
      sendJson(response, 500, { error: '模拟项目列表失败' });
      return;
    }
    sendJson(response, 200, projectList(url.searchParams));
    return;
  }

  const detailMatch = pathname.match(/^\/api\/d\/projects\/([^/]+)$/);
  if (detailMatch && request.method === 'GET') {
    if (mode === 'detail-error') {
      sendJson(response, 500, { error: '模拟项目详情失败' });
      return;
    }
    const id = decodeURIComponent(detailMatch[1]);
    const project = projects.find((item) => item.id === id);
    if (!project) {
      sendJson(response, 404, { error: '项目不存在' });
      return;
    }
    sendJson(response, 200, project);
    return;
  }

  if (pathname === '/api/d/ops/project-save' && request.method === 'POST') {
    if (mode === 'save-error') {
      sendJson(response, 500, { error: '模拟保存失败' });
      return;
    }
    const result = saveProject(await readJson(request));
    sendJson(response, result.status, result.body);
    return;
  }

  sendJson(response, 404, { error: 'Not Found', path: pathname });
}

resetState();
const server = createServer((request, response) => {
  handle(request, response).catch((error) => {
    if (!response.headersSent) {
      sendJson(response, error.status ?? 500, { error: error.message ?? 'Mock Server Error' });
    } else {
      response.end();
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Startrack mock listening on http://${HOST}:${PORT} (mode: ${mode})`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
