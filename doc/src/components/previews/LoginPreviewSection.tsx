/**
 * Login 详情页「预览与 DSL」整节岛（替代通用 PreviewDslTabs）：
 * 主 tabs（预览 / DSL 结构 / YAML 结构）；组件状态胶囊页签经 createPortal
 * 注入章节标题行右端的挂载位（.section-title-extra，见 AssetDetail），
 * 与本岛同一 React 树，切换状态时预览框与 DSL / YAML 代码块同步更新
 * （DSL 剔除预览专用的 --login-min-h 覆盖、补齐事件编排）。
 * 结构模式（split / centered / …）由左侧菜单 ?layout= 决定，见 SideNav 的 Login 组。
 * 主 tabs 行右端为展开图标按钮：预览移入整页弹层（PreviewOverlay，预览框 fill 撑满）。
 */
import { useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import YAML from 'yaml';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@pactor-app/ui/ui';
import { CodeBlock, Icon } from '@pactor-app/ui/components';
import PreviewOverlay from './PreviewOverlay';
import {
  buildLoginDisplayDsl,
  currentLoginMode,
  LoginPreviewFrame,
  loginStateTabs,
} from './blocks-a';

export default function LoginPreviewSection(): ReactElement {
  const [mode] = useState(currentLoginMode);
  const stateTabs = loginStateTabs(mode);
  const [stateTab, setStateTab] = useState(stateTabs[0].key);
  const [tab, setTab] = useState('preview');
  const [expanded, setExpanded] = useState(false);
  // 标题行挂载位在 Astro HTML 中已直出，client:only 岛渲染时即可取到
  const [titleExtra] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined'
      ? null
      : document.querySelector('.section-title-extra'),
  );

  const dslNode = buildLoginDisplayDsl(mode, stateTab);
  const dslJson = JSON.stringify(dslNode, null, 2);
  const dslYaml = YAML.stringify(dslNode);

  const stateTabsBar = (
    <Tabs value={stateTab} onValueChange={setStateTab}>
      <TabsList size="sm">
        {stateTabs.map((t) => (
          <TabsTrigger key={t.key} value={t.key}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );

  return (
    <>
      {titleExtra ? (
        createPortal(stateTabsBar, titleExtra)
      ) : (
        <div className="mb-3 flex justify-end">{stateTabsBar}</div>
      )}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="preview-tabs-row">
          <TabsList variant="line">
            <TabsTrigger value="preview">
              <Icon name="eye" size={14} />
              预览
            </TabsTrigger>
            <TabsTrigger value="dsl">
              <Icon name="code" size={14} />
              DSL 结构
            </TabsTrigger>
            <TabsTrigger value="yaml">
              <Icon name="file-text" size={14} />
              YAML 结构
            </TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpanded(true)}
            aria-label="展开预览"
            className="preview-expand-btn"
          >
            <Icon name="maximize-2" size={16} />
          </Button>
        </div>
        <TabsContent value="preview" className="pt-4">
          {expanded ? null : <LoginPreviewFrame mode={mode} stateKey={stateTab} />}
        </TabsContent>
        <TabsContent value="dsl" className="pt-4">
          <CodeBlock code={dslJson} language="json" copyable className="dsl-code-fill" />
        </TabsContent>
        <TabsContent value="yaml" className="pt-4">
          <CodeBlock code={dslYaml} language="yaml" copyable className="dsl-code-fill" />
        </TabsContent>
        {expanded ? (
          <PreviewOverlay onClose={() => setExpanded(false)}>
            <LoginPreviewFrame mode={mode} stateKey={stateTab} fill />
          </PreviewOverlay>
        ) : null}
      </Tabs>
    </>
  );
}
