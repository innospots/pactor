/**
 * 演示用 DSL 下发端点：remote-demo 页的 remoteBadge 命名组件经
 * http 引用（{ type: 'http', request: { url: '/api/dsl/badge' } }）从这里加载。
 * 真实项目中这类端点由后端/低代码平台提供。
 */
export async function GET() {
  // 模拟网络延迟，便于观察 placeholder → 远端子树的切换
  await new Promise((resolve) => setTimeout(resolve, 900));
  return Response.json({
    type: "Alert",
    props: {
      message: "本 Alert 由 /api/dsl/badge 端点下发的命名组件渲染",
      variant: "warning",
    },
  });
}
