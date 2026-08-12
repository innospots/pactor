import { DEMO_ACCOUNT, clearSession, writeSession } from './auth';

/**
 * 与 pactor-runtime 的 ServiceHandler 结构一致
 *（示例不直接依赖 pactor-runtime，经 pactor-app options.services 注入）
 */
type ServiceHandler = (
  params: Record<string, unknown>,
) => unknown | Promise<unknown>;

/**
 * 内存 customer 服务 mock（无后端演示）：
 * customer.list / customer.detail / customer.update，约 300ms 延迟模拟网络。
 */

interface Customer {
  id: number;
  name: string;
  phone: string;
  level: string;
  owner: string;
  createdAt: string;
}

const customers: Customer[] = [
  { id: 1, name: '云栖科技', phone: '13800000001', level: 'A', owner: '张三', createdAt: '2025-01-12' },
  { id: 2, name: '临平贸易', phone: '13800000002', level: 'B', owner: '李四', createdAt: '2025-02-03' },
  { id: 3, name: '西湖文创', phone: '13800000003', level: 'A', owner: '张三', createdAt: '2025-03-18' },
  { id: 4, name: '滨江软件园', phone: '13800000004', level: 'C', owner: '王五', createdAt: '2025-04-25' },
  { id: 5, name: '未来科技城', phone: '13800000005', level: 'B', owner: '李四', createdAt: '2025-05-30' },
  { id: 6, name: '钱塘物流', phone: '13800000006', level: 'C', owner: '赵六', createdAt: '2025-06-11' },
  { id: 7, name: '之江实验室', phone: '13800000007', level: 'A', owner: '王五', createdAt: '2025-07-08' },
  { id: 8, name: '富春智造', phone: '13800000008', level: 'B', owner: '赵六', createdAt: '2025-08-19' },
];

const DELAY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), DELAY_MS);
  });
}

const list: ServiceHandler = (params) => {
  const keyword = typeof params['keyword'] === 'string' ? params['keyword'].trim() : '';
  const result =
    keyword === ''
      ? [...customers]
      : customers.filter(
          (c) => c.name.includes(keyword) || c.owner.includes(keyword),
        );
  return delay(result);
};

const detail: ServiceHandler = (params) => {
  const id = Number(params['id']);
  const found = customers.find((c) => c.id === id);
  if (!found) {
    throw new Error(`客户不存在: id=${String(params['id'])}`);
  }
  return delay({ ...found });
};

const update: ServiceHandler = (params) => {
  const id = Number(params['id']);
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`客户不存在: id=${String(params['id'])}`);
  }
  const current = customers[index]!;
  const next: Customer = {
    ...current,
    name: typeof params['name'] === 'string' && params['name'] !== '' ? params['name'] : current.name,
    phone: typeof params['phone'] === 'string' && params['phone'] !== '' ? params['phone'] : current.phone,
    level: typeof params['level'] === 'string' && params['level'] !== '' ? params['level'] : current.level,
  };
  customers[index] = next;
  return delay({ ...next });
};

/**
 * 认证 mock：auth.login 校验演示账号（admin / pactor123），
 * 成功写入 localStorage 会话并返回 { token, user }；
 * auth.logout 清除会话。约 500ms 延迟模拟网络。
 */
const login: ServiceHandler = (params) => {
  const username = typeof params['username'] === 'string' ? params['username'].trim() : '';
  const password = typeof params['password'] === 'string' ? params['password'] : '';
  if (username !== DEMO_ACCOUNT.username || password !== DEMO_ACCOUNT.password) {
    return new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`用户名或密码错误（演示账号 ${DEMO_ACCOUNT.username} / ${DEMO_ACCOUNT.password}）`)),
        500,
      );
    });
  }
  const session = {
    token: `demo-token-${Date.now()}`,
    user: { id: 'u-1', name: '演示管理员', roles: ['operator'] },
  };
  writeSession(session);
  return new Promise((resolve) => {
    setTimeout(() => resolve(session), 500);
  });
};

const logout: ServiceHandler = () => {
  clearSession();
  return delay({ success: true });
};

/** 示例服务的注册表（main.tsx 经 options.services 注入） */
export const demoServices: Record<string, ServiceHandler> = {
  'auth.login': login,
  'auth.logout': logout,
  'customer.list': list,
  'customer.detail': detail,
  'customer.update': update,
};
