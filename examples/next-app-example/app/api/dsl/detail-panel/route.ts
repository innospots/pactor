/**
 * 详情面板 DSL 下发端点：dashboard 页的 detailPanel 命名组件经
 * http 引用（{ type: 'http', request: { url: '/api/dsl/detail-panel' } }）从这里加载。
 * 返回的结构中 ${data.detail.x} 表达式由页面 dataSource 数据驱动渲染。
 */
export async function GET() {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Response.json({
    type: "Card",
    props: { title: "客户详情", style: { flex: 1 } },
    children: [
      {
        type: "Statistic",
        props: { title: "联系人", value: "${data.detail.contact}" },
      },
      {
        type: "Statistic",
        props: { title: "等级", value: "${data.detail.level}" },
      },
      {
        type: "Statistic",
        props: { title: "电话", value: "${data.detail.phone}" },
      },
    ],
  });
}
