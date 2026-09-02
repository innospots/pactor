/**
 * 内存 mock service（真实应用里换成 fetch 你的后端）。
 * 服务名经 createPactorApplication({ services }) 注入，
 * DSL 数据源以 type: service + service: todo.list 引用。
 *
 * 与 @pactor-app/runtime 的 ServiceHandler 结构一致（示例不直接依赖 runtime）。
 */
type ServiceHandler = (
  params: Record<string, unknown>,
) => unknown | Promise<unknown>;

interface Todo {
  id: number;
  title: string;
  owner: string;
  status: string;
}

const TODOS: Todo[] = [
  { id: 1, title: '阅读 pactor 设计文档', owner: '张三', status: '已完成' },
  { id: 2, title: '用 vite-plugin 写第一个页面', owner: '李四', status: '已完成' },
  { id: 3, title: '把列表接到真实接口', owner: '张三', status: '进行中' },
  { id: 4, title: '给表单加校验规则', owner: '王五', status: '进行中' },
  { id: 5, title: '试试修改 yaml 触发热更新', owner: '李四', status: '进行中' },
];

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const demoServices: Record<string, ServiceHandler> = {
  // 待办列表：按关键词过滤（title / owner），模拟 200ms 网络延迟
  'todo.list': async (params) => {
    await sleep(200);
    const keyword = String(params['keyword'] ?? '').trim();
    if (!keyword) {
      return TODOS;
    }
    return TODOS.filter(
      (todo) => todo.title.includes(keyword) || todo.owner.includes(keyword),
    );
  },
};
