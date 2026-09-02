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
            { label: '数据流', slug: 'guides/data-flow' },
            { label: '事件与表单联动', slug: 'guides/events' },
            { label: '自定义组件', slug: 'guides/custom-components' },
            { label: '主题与换肤', slug: 'guides/theming' },
            { label: '国际化', slug: 'guides/i18n' },
          ],
        },
        {
          label: '参考',
          items: [{ label: 'DSL 参考', slug: 'reference/dsl' }],
        },
        {
          label: '模块',
          items: [
            { label: 'pactor（meta）', slug: 'packages/pactor' },
            { label: '@pactor/core', slug: 'packages/core' },
            { label: '@pactor/schema', slug: 'packages/schema' },
            { label: '@pactor/expression', slug: 'packages/expression' },
            { label: '@pactor/runtime', slug: 'packages/runtime' },
            { label: '@pactor/permission', slug: 'packages/permission' },
            { label: '@pactor/resource', slug: 'packages/resource' },
            { label: '@pactor/router', slug: 'packages/router' },
            { label: '@pactor/ui（shadcn）', slug: 'packages/ui' },
            { label: '@pactor/markdown', slug: 'packages/markdown' },
            { label: '@pactor/chat', slug: 'packages/chat' },
            { label: '@pactor/app', slug: 'packages/app' },
            { label: '@pactor/vite-plugin', slug: 'packages/vite-plugin' },
            { label: '@pactor/cli', slug: 'packages/cli' },
            { label: '@pactor/skill', slug: 'pactor-skill' },
          ],
        },
      ],
    }),
  ],
});
