import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Pactor',
      description:
        '基于 YAML/JSON DSL 的企业级 Server-Driven UI 与 AI-Native 前端运行时框架',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      sidebar: [
        {
          label: '指南',
          items: [
            { label: '快速开始', slug: 'guides/getting-started' },
            { label: '手动安装', slug: 'guides/manual-setup' },
            { label: '数据流', slug: 'guides/data-flow' },
            { label: '事件与表单联动', slug: 'guides/events' },
            { label: '自定义组件', slug: 'guides/custom-components' },
            { label: '主题与换肤', slug: 'guides/theming' },
            { label: '国际化', slug: 'guides/i18n' },
          ],
        },
        {
          label: '组件',
          items: [
            { label: '组件参考', slug: 'components' },
            { label: '布局与页面', slug: 'components/layout' },
            { label: '展示', slug: 'components/display' },
            { label: '表单', slug: 'components/form' },
            { label: '数据', slug: 'components/data' },
            { label: '导航', slug: 'components/navigation' },
            { label: '反馈与弹层', slug: 'components/feedback' },
            { label: '复合与其他', slug: 'components/composite' },
          ],
        },
        {
          label: '样式',
          items: [
            { label: '样式总览', slug: 'style' },
            { label: '色彩', slug: 'style/colors' },
            { label: '字体', slug: 'style/fonts' },
            { label: '排版', slug: 'style/typography' },
            { label: '布局', slug: 'style/layout' },
            { label: '形态', slug: 'style/shape' },
            { label: '动效', slug: 'style/motion' },
          ],
        },
        {
          label: '参考',
          items: [{ label: 'DSL 参考', slug: 'reference/dsl' }],
        },
        {
          label: '模块',
          items: [
            { label: 'pactor-app（meta）', slug: 'packages/pactor' },
            { label: '@pactor-app/core', slug: 'packages/core' },
            { label: '@pactor-app/schema', slug: 'packages/schema' },
            { label: '@pactor-app/expression', slug: 'packages/expression' },
            { label: '@pactor-app/runtime', slug: 'packages/runtime' },
            { label: '@pactor-app/permission', slug: 'packages/permission' },
            { label: '@pactor-app/resource', slug: 'packages/resource' },
            { label: '@pactor-app/router', slug: 'packages/router' },
            { label: '@pactor-app/ui（shadcn）', slug: 'packages/ui' },
            { label: '@pactor-app/markdown', slug: 'packages/markdown' },
            { label: '@pactor-app/chat', slug: 'packages/chat' },
            { label: '@pactor-app/app', slug: 'packages/app' },
            { label: '@pactor-app/vite-plugin', slug: 'packages/vite-plugin' },
            { label: '@pactor-app/cli', slug: 'packages/cli' },
            { label: 'create-pactor-app', slug: 'packages/create-app' },
            { label: '@pactor-app/skill', slug: 'pactor-skill' },
          ],
        },
      ],
    }),
  ],
});
