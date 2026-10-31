/**
 * @pactor-app/blocks：由 @pactor-app/ui 原语组合的复合区块组件集
 *（自 ui 包业务组件集迁出独立成包）。
 * 不进 ui 主注册表；接入方用 registerBlockComponents 合并进既有
 * ComponentRegistry，或用 createBlockComponentRegistry 创建纯区块注册表。
 */
import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import { HeroSection } from './components/HeroSection/index.js';
import { Login } from './components/Login/index.js';
import { EntityCard } from './components/EntityCard/index.js';
import { EntityCardList } from './components/EntityCardList/index.js';
import { RecordingPage } from './components/RecordingPage/index.js';
import { SiteFooter } from './components/SiteFooter/index.js';
import { FieldCondition } from './components/FieldCondition/index.js';
import { FormCardList } from './components/FormCardList/index.js';
import { FormModal } from './components/FormModal/index.js';
import { ExpressionEditor } from './components/ExpressionEditor/index.js';
import { RuleConfig } from './components/RuleConfig/index.js';
import { RuleExpression } from './components/RuleExpression/index.js';
import { ScriptEditor } from './components/ScriptEditor/index.js';

export { HeroSection } from './components/HeroSection/index.js';
export type {
  HeroSectionAction,
  HeroSectionAnnouncement,
  HeroSectionLogo,
  HeroSectionProps,
  HeroSectionVariant,
} from './components/HeroSection/index.js';
export { Login } from './components/Login/index.js';
export type { LoginBrandInfo, LoginLink, LoginProps, LoginVariant } from './components/Login/index.js';
export { EntityCard } from './components/EntityCard/index.js';
export type {
  EntityCardAction,
  EntityCardExpandingAction,
  EntityCardProps,
  EntityCardTag,
} from './components/EntityCard/index.js';
export { EntityCardList } from './components/EntityCardList/index.js';
export type {
  EntityCardListItem,
  EntityCardListProps,
} from './components/EntityCardList/index.js';
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
export { FormCardList } from './components/FormCardList/index.js';
export type {
  FormCardListField,
  FormCardListFieldType,
  FormCardListItem,
  FormCardListItemScope,
  FormCardListProps,
} from './components/FormCardList/index.js';
export { FormModal } from './components/FormModal/index.js';
export type { FormModalProps } from './components/FormModal/index.js';
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
  HeroSection,
  Login,
  EntityCard,
  EntityCardList,
  RecordingPage,
  SiteFooter,
  FieldCondition,
  // 列表项模板（原始 DSL children）由 FormCardList 逐项渲染并注入
  // { row, rowIndex, updateItem } 作用域（与 For 的 withScope 约定一致）
  FormCardList: { component: FormCardList, withScope: true },
  FormModal,
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
