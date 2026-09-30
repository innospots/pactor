"use client";

import { Icon } from "@pactor-app/ui/components";

import "./steps-panel.css";

export interface StepItemData {
  title: string;
  description?: string;
  /** done 已完成 / running 进行中 / pending 待执行（缺省 pending） */
  status?: "done" | "running" | "pending";
  duration?: string;
}

export interface StepsPanelProps {
  /** 面板标题（缺省「执行步骤」） */
  title?: string;
  /** 步骤列表（DSL 绑定 ${data.steps}） */
  steps?: StepItemData[];
}

/**
 * 执行步骤面板（chat 页对话图标栏 popover 自定义组件）：
 * 纵向时间线展示当前会话的任务执行步骤，状态图标区分
 * 已完成 / 进行中 / 待执行；样式在 steps-panel.css（.steps-panel-*），
 * 颜色走 @pactor-app/ui 语义令牌（深浅色自适应）。
 */
export function StepsPanel({ title = "执行步骤", steps = [] }: StepsPanelProps) {
  return (
    <div className="steps-panel">
      <div className="steps-panel-title">{title}</div>
      {steps.length === 0 ? (
        <div className="steps-panel-empty">当前会话暂无执行步骤</div>
      ) : (
        <ol className="steps-panel-list">
          {steps.map((step, index) => {
            const status = step.status ?? "pending";
            return (
              <li
                key={`${step.title}-${index}`}
                className={`steps-panel-item steps-panel-item-${status}`}
              >
                <span className="steps-panel-icon">
                  {status === "done" ? (
                    <Icon name="check-circle" size={16} />
                  ) : status === "running" ? (
                    <Icon name="loading" size={16} className="steps-panel-spin" />
                  ) : (
                    <span className="steps-panel-dot" />
                  )}
                </span>
                <div className="steps-panel-body">
                  <div className="steps-panel-step-title">{step.title}</div>
                  {step.description ? (
                    <div className="steps-panel-desc">{step.description}</div>
                  ) : null}
                </div>
                {step.duration ? (
                  <span className="steps-panel-duration">{step.duration}</span>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
