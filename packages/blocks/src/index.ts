/**
 * @pactor-app/blocks：由 @pactor-app/ui 原语组合的复合区块组件集
 *（自 ui 包业务组件集迁出独立成包）。
 * 不进 ui 主注册表；接入方用 registerBlockComponents 合并进既有
 * ComponentRegistry，或用 createBlockComponentRegistry 创建纯区块注册表。
 */
import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import { Login } from './components/Login/index.js';
import { EntityCard } from './components/EntityCard/index.js';
import { CardList } from './components/CardList/index.js';
import { RecordingPage } from './components/RecordingPage/index.js';
import { SiteFooter } from './components/SiteFooter/index.js';
import { FieldCondition } from './components/FieldCondition/index.js';
import { ExpressionEditor } from './components/ExpressionEditor/index.js';
import { RuleConfig } from './components/RuleConfig/index.js';
import { RuleExpression } from './components/RuleExpression/index.js';
import { ScriptEditor } from './components/ScriptEditor/index.js';

export { Login } from './components/Login/index.js';
export type { LoginBrandInfo, LoginLink, LoginProps, LoginVariant } from './components/Login/index.js';
export { EntityCard } from './components/EntityCard/index.js';
export type {
  EntityCardAction,
  EntityCardExpandingAction,
  EntityCardProps,
  EntityCardTag,
} from './components/EntityCard/index.js';
export { CardList } from './components/CardList/index.js';
export type { CardListItem, CardListProps } from './components/CardList/index.js';
export { RecordingPage } from './components/RecordingPage/index.js';
export type {
  RecordingFilterItem,
  RecordingGroup,
  RecordingInsight,
  RecordingInsightChapter,
  RecordingInsightViewpoint,
  RecordingItem,
  RecordingLanguageChange,
  RecordingLanguageOption,
  RecordingMemory,
  RecordingMemoryGroup,
  RecordingMemoryItem,
  RecordingPageProps,
  RecordingPlayer,
  RecordingShareOption,
  RecordingStatusType,
  RecordingSummary,
  RecordingSummaryAction,
  RecordingSummaryConclusion,
  RecordingSummaryMaterial,
  RecordingSummaryMindmap,
  RecordingSummaryTodo,
  RecordingSummaryTopic,
  RecordingSpeaker,
  RecordingSpeakerChange,
  RecordingTabItem,
  RecordingTranscriptSegment,
  RecordingTranslation,
  RecordingTranslationSegment,
} from './components/RecordingPage/index.js';
export { SiteFooter } from './components/SiteFooter/index.js';
export type {
  SiteFooterBrand,
  SiteFooterLink,
  SiteFooterLinkGroup,
  SiteFooterProps,
} from './components/SiteFooter/index.js';
export { FieldCondition } from './components/FieldCondition/index.js';
export type {
  ConditionFieldOption,
  FieldConditionItem,
  FieldConditionGroup,
  FieldConditionProps,
  FieldConditionValue,
} from './components/FieldCondition/index.js';
export { ExpressionEditor } from './components/ExpressionEditor/index.js';
export type {
  ExpressionEditorProps,
  ExpressionMappingItem,
} from './components/ExpressionEditor/index.js';
export { RuleConfig } from './components/RuleConfig/index.js';
export type {
  Condition,
  ConditionOpt,
  RuleConfigProps,
  RuleConfigValue,
} from './components/RuleConfig/index.js';
export { RuleExpression } from './components/RuleExpression/index.js';
export type {
  RuleExpressionOption,
  RuleExpressionProps,
  RuleExpressionValue,
} from './components/RuleExpression/index.js';
export { ScriptEditor } from './components/ScriptEditor/index.js';
export type {
  ScriptEditorProps,
  ScriptFunctionDef,
  ScriptFunctionParameter,
  ScriptVariableDef,
} from './components/ScriptEditor/index.js';

/**
 * DSL 类型名 → 区块组件映射。
 * 表单类组件（FieldCondition / ExpressionEditor / RuleConfig / RuleExpression /
 * ScriptEditor）为 value/onChange 受控：DSL 用 props.value + events.onChange
 * 读写 ${event}。
 */
export const blockComponents = {
  Login,
  EntityCard,
  CardList,
  RecordingPage,
  SiteFooter,
  FieldCondition,
  ExpressionEditor,
  RuleConfig,
  RuleExpression,
  ScriptEditor,
} as const;

/** 把区块组件集按 DSL 类型名注册到给定 ComponentRegistry（可与 ui 主注册表合并） */
export function registerBlockComponents(registry: ComponentRegistry): void {
  for (const [type, component] of Object.entries(blockComponents)) {
    registry.register(type, component);
  }
}

/** 创建只注册了区块组件集的新 ComponentRegistry */
export function createBlockComponentRegistry(): ComponentRegistry {
  const registry = new Registry<unknown>('ComponentRegistry');
  registerBlockComponents(registry);
  return registry;
}
