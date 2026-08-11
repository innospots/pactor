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
            { label: 'pactor-resource', slug: 'packages/resource' },
            { label: 'pactor-router', slug: 'packages/router' },
            { label: 'pactor-ui-antd', slug: 'packages/ui-antd' },
            { label: 'pactor-ui-radix', slug: 'packages/ui-radix' },
            { label: 'pactor-markdown', slug: 'packages/markdown' },
            { label: 'pactor-chat', slug: 'packages/chat' },
            { label: 'pactor-app', slug: 'packages/app' },
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
