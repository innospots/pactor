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
          items: [{ label: '快速开始', slug: 'guides/getting-started' }],
        },
        {
          label: '模块',
          items: [
            { label: 'pactor-core', slug: 'packages/core' },
            { label: 'pactor-schema', slug: 'packages/schema' },
            { label: 'pactor-expression', slug: 'packages/expression' },
            { label: 'pactor-runtime', slug: 'packages/runtime' },
            { label: 'pactor-permission', slug: 'packages/permission' },
            { label: 'pactor-components', slug: 'packages/components' },
          ],
        },
        {
          label: '设计',
          items: [{ label: '框架设计规范', slug: 'framework-design' }],
        },
      ],
    }),
  ],
});
