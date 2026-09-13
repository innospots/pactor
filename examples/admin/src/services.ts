import { DEMO_ACCOUNT, clearSession, writeSession } from './auth';

/**
 * 与 @pactor-app/runtime 的 ServiceHandler 结构一致
 *（示例不直接依赖 @pactor-app/runtime，经 @pactor-app/app options.services 注入）
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
  region: string;
  city: string;
  owner: string;
  createdAt: string;
}

/** 相对今天生成 ISO 日期（yyyy-MM-dd），让日期预设（今天/最近7天/最近30天）始终能筛出演示数据 */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const customers: Customer[] = [
  { id: 1, name: '云栖科技', phone: '13800000001', level: 'A', region: '浙江', city: '杭州', owner: '张三', createdAt: daysAgo(1) },
  { id: 2, name: '临平贸易', phone: '13800000002', level: 'B', region: '浙江', city: '杭州', owner: '李四', createdAt: daysAgo(5) },
  { id: 3, name: '西湖文创', phone: '13800000003', level: 'A', region: '浙江', city: '宁波', owner: '张三', createdAt: daysAgo(12) },
  { id: 4, name: '滨江软件园', phone: '13800000004', level: 'C', region: '浙江', city: '杭州', owner: '王五', createdAt: daysAgo(20) },
  { id: 5, name: '未来科技城', phone: '13800000005', level: 'B', region: '江苏', city: '南京', owner: '李四', createdAt: daysAgo(35) },
  { id: 6, name: '钱塘物流', phone: '13800000006', level: 'C', region: '江苏', city: '苏州', owner: '赵六', createdAt: daysAgo(60) },
  { id: 7, name: '之江实验室', phone: '13800000007', level: 'A', region: '广东', city: '深圳', owner: '王五', createdAt: daysAgo(75) },
  { id: 8, name: '富春智造', phone: '13800000008', level: 'B', region: '广东', city: '广州', owner: '赵六', createdAt: daysAgo(100) },
];

const DELAY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), DELAY_MS);
  });
}

const list: ServiceHandler = (params) => {
  const keyword = typeof params['keyword'] === 'string' ? params['keyword'].trim() : '';
  // 创建时间范围筛选（DatePicker range 值 { start, end } 经 state 传入，ISO 字符串可直接字典序比较）
  const createdStart = typeof params['createdStart'] === 'string' ? params['createdStart'] : '';
  const createdEnd = typeof params['createdEnd'] === 'string' ? params['createdEnd'] : '';
  const result = customers.filter(
    (c) =>
      (keyword === '' || c.name.includes(keyword) || c.owner.includes(keyword)) &&
      (createdStart === '' || c.createdAt >= createdStart) &&
      (createdEnd === '' || c.createdAt <= createdEnd),
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
    region: typeof params['region'] === 'string' && params['region'] !== '' ? params['region'] : current.region,
    city: typeof params['city'] === 'string' && params['city'] !== '' ? params['city'] : current.city,
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
