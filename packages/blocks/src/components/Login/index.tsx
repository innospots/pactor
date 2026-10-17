import { useI18n } from "@pactor-app/runtime";
import type { CSSProperties, ReactNode } from "react";

import { cn } from '../../lib/utils.js';
import { Button } from "@pactor-app/ui/components";
import { Card } from "@pactor-app/ui/components";
import { Field } from "@pactor-app/ui/components";
import { Form } from "@pactor-app/ui/components";
import { Input } from "@pactor-app/ui/components";
import { Link } from "@pactor-app/ui/components";

/**
 * 结构模式（对应《登录页产品结构设计》的容器关系）：
 * - `split`（默认，01–04、12）左右分栏：比例、方向、认证区容器均可配置
 * - `centered`（05/07）居中认证区
 * - `brand-card`（06）品牌区为独立卡片 + 右侧裸表单
 * - `overlap`（08）品牌卡片与登录卡片局部叠加
 * - `backdrop`（11）整页渐变品牌背景 + 悬浮认证卡片
 * （10 扫码登录不在组件范围内）
 */
export type LoginVariant =
  | "split"
  | "centered"
  | "brand-card"
  | "overlap"
  | "backdrop";

export interface LoginBrandInfo {
  /** Logo 图片地址 */
  logo?: string;
  /** 品牌/产品名称 */
  name?: string;
  /** 品牌主标题 / Slogan */
  title?: string;
  /** 品牌副标题 / 说明 */
  description?: string;
  /** 品牌展示插画地址（窄屏不展示）；缺省展示内置默认插画，传空字符串可隐藏 */
  illustration?: string;
}

export interface LoginLink {
  text: string;
  /** 配置后渲染为链接直接跳转；缺省时点击触发对应 DSL 事件 */
  href?: string;
}

export interface LoginProps {
  /** 结构模式，默认 split */
  layout?: LoginVariant;
  /**
   * 品牌区方向（split / brand-card / overlap / backdrop 生效；centered 无分栏不适用），
   * 默认 left；right 即文档 12「左表单 + 右概念展示」的镜像结构
   * （窄屏均为认证区在前，品牌区隐藏或后置）
   */
  brandSide?: "left" | "right";
  /** 品牌区分栏占比 0–1（仅 split），默认 0.5；0.6 即文档 04 的品牌大区 */
  brandRatio?: number;
  /**
   * 认证区容器（split / centered 生效）：
   * `plain` 裸表单（320–380px）；`card` 常规卡片（默认，400px）；
   * `float` 大尺寸悬浮卡片（440px + 大留白 + 强阴影，即文档 03）
   */
  authVariant?: "plain" | "card" | "float";
  /** split 品牌面板是否带渐变背景，默认 true */
  brandPanelBackground?: boolean;
  /** 是否渲染默认背景装饰（圆斑/圆环/点阵/流线），默认 true */
  decor?: boolean;
  /** 品牌区配置；居中布局下仅展示 logo+name（配置了才渲染） */
  brand?: LoginBrandInfo;
  /** 认证区标题 */
  title?: string;
  /** 认证区说明 */
  subtitle?: string;
  usernameLabel?: string;
  usernamePlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  /** 提交按钮文案 */
  submitText?: string;
  /** 注册入口（未配置不渲染） */
  registerLink?: LoginLink;
  /** 找回密码入口（未配置不渲染） */
  forgotLink?: LoginLink;
  /** 页脚文案（版权/协议行，未配置不渲染） */
  footer?: string;
  /**
   * 认证区内容插槽（DSL children 或 ReactNode）：提供时替换内置账号密码表单，
   * 标题/副标题与辅助入口（registerLink / forgotLink）保留。
   * 可内嵌 Tabs 切换多种登录方式（手机验证码 / 账号密码等）；
   * 插槽内的表单字段、校验与提交事件由使用方自行编排，Login 的 onSubmit 不再生效
   */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /**
   * 通用：根节点内联样式。
   * 最小高度默认撑满视口（100svh）；嵌入定高容器（如预览框）时经 CSS 变量
   * `--login-min-h` 覆盖（如 `100%`），变量继承到内部分栏列
   */
  style?: CSSProperties;
  /** 校验通过后触发，参数为 { username, password }；登录请求与跳转由 DSL 编排 */
  onSubmit?: (values: Record<string, unknown>) => void;
  onRegisterClick?: () => void;
  onForgotClick?: () => void;
}

/** 内置默认品牌插画：抽象几何组合，全部用语义令牌色（深浅色/换肤自适应） */
function DefaultIllustration({ className }: { className?: string }) {
  return (
    <svg
      data-slot="login-default-illustration"
      viewBox="0 0 320 180"
      role="img"
      aria-hidden="true"
      className={cn("text-primary", className)}
    >
      <rect
        x="24"
        y="96"
        width="88"
        height="60"
        rx="10"
        fill="currentColor"
        opacity="0.16"
      />
      <rect
        x="120"
        y="60"
        width="88"
        height="96"
        rx="10"
        fill="currentColor"
        opacity="0.28"
      />
      <rect
        x="216"
        y="24"
        width="80"
        height="132"
        rx="10"
        fill="currentColor"
        opacity="0.4"
      />
      <circle cx="68" cy="52" r="26" fill="currentColor" opacity="0.2" />
      <circle cx="248" cy="140" r="14" fill="currentColor" opacity="0.55" />
      <path
        d="M40 156 C 90 116, 130 150, 180 118 S 260 96, 300 128"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/** 分栏品牌面板的默认渐变（primary 染色，深浅色均可见） */
const BRAND_PANEL_BG =
  "bg-muted bg-linear-to-br from-primary/15 via-muted to-primary/5 dark:from-primary/25 dark:to-primary/10";

/**
 * 内置背景装饰：柔光圆斑 + 圆环 + 点阵 + 底部流线（对应设计稿示例图中的
 * 背景装饰元素），全部语义令牌色，深浅色/换肤自适应。绝对定位铺于容器底层，
 * 不响应交互；使用方可用 className 覆盖容器背景，装饰独立保留。
 */
function BgDecor({ className }: { className?: string }) {
  return (
    <div
      data-slot="login-bg-decor"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/8" />
      <div className="absolute -left-32 bottom-0 size-80 rounded-full bg-primary/5" />
      <div className="absolute right-10 top-1/3 size-40 rounded-full border-[12px] border-primary/10" />
      <div className="absolute left-1/4 top-16 h-40 w-64 opacity-35 [background-image:radial-gradient(var(--primary)_1.2px,transparent_1.2px)] [background-size:18px_18px]" />
      <svg
        className="absolute bottom-0 left-0 w-full text-primary"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          d="M0,224 C240,160 480,288 720,240 C960,192 1200,96 1440,160"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="2"
        />
        <path
          d="M0,256 C240,192 480,320 720,272 C960,224 1200,128 1440,192 L1440,320 L0,320 Z"
          fill="currentColor"
          fillOpacity="0.05"
        />
      </svg>
    </div>
  );
}

/**
 * Login 登录业务组件（区块组件）：
 * 品牌区 + 认证区 + 辅助入口 + 页脚的整页组合，内部复用 Form/Input/Button。
 * 结构模式（layout）与修饰配置（方向/比例/卡片样式/背景/装饰）正交组合；
 * 认证区内容支持 children 插槽替换内置表单（可内嵌 Tabs 切换多种登录方式）；
 * 样式全部走语义令牌（深浅色/换肤自适应）；文案缺省走 i18n（pactor.login.*），
 * 同名 props 优先。组件不内置登录请求。
 */
export function Login({
  layout = "split",
  brandSide = "left",
  brandRatio = 0.5,
  authVariant = "card",
  brandPanelBackground = true,
  decor = true,
  brand,
  title,
  subtitle,
  usernameLabel,
  usernamePlaceholder,
  passwordLabel,
  passwordPlaceholder,
  submitText,
  registerLink,
  forgotLink,
  footer,
  children,
  className,
  style,
  onSubmit,
  onRegisterClick,
  onForgotClick,
}: LoginProps) {
  const { t } = useI18n();

  const brandIdentity =
    brand && (brand.logo || brand.name) ? (
      <div data-slot="login-brand-identity" className="flex items-center gap-2">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name ?? ""}
            className="size-7 rounded-md"
          />
        ) : null}
        {brand.name ? (
          <span className="text-base font-semibold">{brand.name}</span>
        ) : null}
      </div>
    ) : null;

  /** 品牌视觉区主体：标题 + 说明 + 插画（缺省内置默认插画）。
   *  alignRight（overlap 品牌卡在右）时文字右对齐、说明与插画贴右缘；
   *  容器始终保持全宽，只改对齐不改尺寸（避免 shrink-to-fit 导致插画变窄、卡片变矮） */
  const brandVisual = (alignRight = false) => (
    <div
      className={cn("flex w-full flex-col gap-4", alignRight && "text-right")}
    >
      {brand?.title ? (
        <h2 className="text-3xl font-bold leading-tight tracking-tight">
          {brand.title}
        </h2>
      ) : null}
      {brand?.description ? (
        <p
          className={cn(
            "max-w-md text-sm text-muted-foreground",
            alignRight && "ml-auto",
          )}
        >
          {brand.description}
        </p>
      ) : null}
      {brand?.illustration ? (
        <img
          src={brand.illustration}
          alt=""
          className={cn(
            "mt-4 w-full max-w-lg rounded-lg object-cover",
            alignRight && "self-end",
          )}
        />
      ) : brand?.illustration === "" ? null : (
        <DefaultIllustration
          className={cn("mt-4 w-full max-w-md", alignRight && "self-end")}
        />
      )}
    </div>
  );

  const renderAuxLink = (link: LoginLink | undefined, onClick?: () => void) => {
    if (!link) return null;
    if (link.href) {
      return <Link href={link.href} text={link.text} className="text-sm" />;
    }
    return (
      <button
        type="button"
        className="text-sm text-primary underline-offset-4 hover:underline"
        onClick={onClick}
      >
        {link.text}
      </button>
    );
  };

  const authContent = (
    <>
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          {title ?? t("pactor.login.title")}
        </h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {/* 认证区内容：插槽优先（可内嵌 Tabs 多方式登录），缺省内置账号密码表单 */}
      {children ?? (
        <Form name="login" className="flex flex-col gap-2" onSubmit={onSubmit}>
          {/* 表单项必须放 Field 内（label / 必填标记归 Field，校验仍由 Input rules 承担） */}
          <Field label={usernameLabel ?? t("pactor.login.username")} required>
            <Input
              name="username"
              size="large"
              placeholder={
                usernamePlaceholder ?? t("pactor.login.usernamePlaceholder")
              }
              rules={[
                { required: true, message: t("pactor.login.usernameRequired") },
              ]}
            />
          </Field>
          <Field label={passwordLabel ?? t("pactor.login.password")} required>
            <Input
              name="password"
              type="password"
              size="large"
              placeholder={
                passwordPlaceholder ?? t("pactor.login.passwordPlaceholder")
              }
              rules={[
                { required: true, message: t("pactor.login.passwordRequired") },
              ]}
            />
          </Field>
          {/* 提交按钮同样放 Field 内（无 label 的 Field 仅作控件容器，与输入项对齐） */}
          <Field>
            <Button
              submit
              variant="primary"
              size="large"
              text={submitText ?? t("pactor.login.submit")}
              className="mt-2 w-full"
            />
          </Field>
        </Form>
      )}
      {registerLink || forgotLink ? (
        <div className="mt-4 flex items-center justify-between gap-4">
          {renderAuxLink(registerLink, onRegisterClick)}
          {renderAuxLink(forgotLink, onForgotClick)}
        </div>
      ) : null}
    </>
  );

  /** 认证区容器：plain 裸表单（320–380px）；card 常规卡片（400px）；float 大尺寸悬浮卡片（03） */
  const authBox = (variant: "plain" | "card" | "float") => {
    if (variant === "plain") {
      return <div className="w-full max-w-[360px]">{authContent}</div>;
    }
    if (variant === "float") {
      return (
        <Card className="w-full max-w-[440px] p-4 shadow-xl md:p-6">
          {authContent}
        </Card>
      );
    }
    return (
      <Card className="w-full max-w-[400px] p-2 md:p-4">{authContent}</Card>
    );
  };

  const footerBar = footer ? (
    <footer className="p-4 text-center text-xs text-muted-foreground">
      {footer}
    </footer>
  ) : null;

  /** 整幅品牌面板（分栏布局左/右侧，窄屏隐藏，由窄屏品牌行替代）；背景与装饰可配 */
  const brandPanel = (extraClass?: string, withIdentity = true) => (
    <div
      className={cn(
        "relative hidden flex-col overflow-hidden p-10 md:flex",
        brandPanelBackground && BRAND_PANEL_BG,
        extraClass,
      )}
    >
      {decor ? <BgDecor /> : null}
      <div className="relative flex h-full flex-col justify-between">
        {withIdentity ? brandIdentity : null}
        {brandVisual()}
        <div />
      </div>
    </div>
  );

  /** 认证列：窄屏品牌行 + 居中认证区 + 页脚；identityAlways 时品牌行全尺寸展示（反向分栏） */
  const authColumn = (
    variant: "plain" | "card" | "float",
    identityAlways = false,
  ) => (
    <div className="flex min-h-[var(--login-min-h,100svh)] flex-col bg-linear-to-b from-primary/5 via-background to-background dark:from-primary/10">
      {brandIdentity ? (
        <div className={cn("p-6", !identityAlways && "md:hidden")}>
          {brandIdentity}
        </div>
      ) : null}
      <div className="flex flex-1 items-center justify-center p-6">
        {authBox(variant)}
      </div>
      {footerBar}
    </div>
  );

  /** 品牌卡片（brand-card / overlap 共用）：品牌标识 + 视觉区，宽度和背景可配；
   *  alignRight（overlap 品牌卡在右时）内容右对齐——容器保持全宽，仅文字右对齐、
   *  标识行与插画贴右缘，不改变内容尺寸 */
  const brandCard = (widthClass: string, alignRight = false) => (
    <Card className={cn("w-full", widthClass, BRAND_PANEL_BG)}>
      <div
        data-slot="login-brand-card-content"
        className={cn("flex flex-col gap-6", alignRight && "text-right")}
      >
        {brandIdentity ? (
          <div className={cn(alignRight && "flex justify-end")}>
            {brandIdentity}
          </div>
        ) : null}
        {brandVisual(alignRight)}
      </div>
    </Card>
  );

  /** overlap 的登录卡片：z-10 浮于品牌卡之上，叠加方向随 brandSide 镜像 */
  const overlapAuthCard = (
    <div
      className={cn(
        "z-10 w-full max-w-[400px]",
        brandSide === "left" ? "md:-ml-24" : "md:-mr-24",
      )}
    >
      <Card className="p-2 shadow-xl md:p-4">{authContent}</Card>
    </div>
  );

  /** backdrop 的品牌列（窄屏隐藏，由认证列内的窄屏品牌行替代） */
  const backdropBrandColumn = (
    <div className="relative hidden flex-col justify-between p-10 md:flex">
      {brandIdentity}
      {brandVisual()}
      <div />
    </div>
  );

  /** backdrop 的认证列：窄屏品牌行 + 居中悬浮认证卡片 + 页脚 */
  const backdropAuthColumn = (
    <div className="relative flex min-h-[var(--login-min-h,100svh)] flex-col">
      {brandIdentity ? (
        <div className="p-6 md:hidden">{brandIdentity}</div>
      ) : null}
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-[400px] p-2 shadow-xl md:p-4">
          {authContent}
        </Card>
      </div>
      {footerBar}
    </div>
  );

  // ── centered（05 / 07）：默认页面渐变背景 + 背景装饰，品牌区仅 logo+name 紧凑标识 ──
  if (layout === "centered") {
    return (
      <div
        data-slot="login"
        data-layout={layout}
        className={cn(
          "relative flex min-h-[var(--login-min-h,100svh)] w-full flex-col overflow-hidden bg-background bg-linear-to-b from-primary/10 via-background to-background dark:from-primary/15",
          className,
        )}
        style={style}
      >
        {decor ? <BgDecor /> : null}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 p-6">
          {brandIdentity}
          {authBox(authVariant)}
        </div>
        {footerBar}
      </div>
    );
  }

  // ── 06 品牌卡片 + 纯表单：品牌区为独立 Card，表单直接落在页面底色；
  //    brandSide=right 时镜像（表单在左、品牌卡在右，窄屏表单在前） ──
  if (layout === "brand-card") {
    return (
      <div
        data-slot="login"
        data-layout={layout}
        data-brand-side={brandSide}
        className={cn(
          "relative flex min-h-[var(--login-min-h,100svh)] w-full flex-col overflow-hidden bg-background p-6 md:p-10",
          className,
        )}
        style={style}
      >
        {decor ? <BgDecor /> : null}
        <div className="relative flex flex-1 flex-col items-center gap-6 md:flex-row md:gap-10">
          {brandSide === "left" ? (
            <>
              {brandCard("md:w-[45%]")}
              <div className="flex w-full flex-1 justify-center">
                {authBox("plain")}
              </div>
            </>
          ) : (
            <>
              <div className="flex w-full flex-1 justify-center">
                {authBox("plain")}
              </div>
              {brandCard("md:w-[45%]")}
            </>
          )}
        </div>
        {footerBar}
      </div>
    );
  }

  // ── 08 品牌卡片 + 登录卡片叠加：登录卡垂直居中于品牌卡（上下露出一致），
  //    窄屏取消重叠；brandSide=right 时镜像（登录卡在左、向右叠加品牌卡，
  //    品牌卡内容整体右对齐） ──
  if (layout === "overlap") {
    return (
      <div
        data-slot="login"
        data-layout={layout}
        data-brand-side={brandSide}
        className={cn(
          "relative flex min-h-[var(--login-min-h,100svh)] w-full flex-col overflow-hidden bg-background p-6 md:p-10",
          className,
        )}
        style={style}
      >
        {decor ? <BgDecor /> : null}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 md:flex-row md:items-center md:gap-0">
          {brandSide === "left" ? (
            <>
              {brandCard("md:w-[52%]")}
              {overlapAuthCard}
            </>
          ) : (
            <>
              {overlapAuthCard}
              {brandCard("md:w-[52%]", true)}
            </>
          )}
        </div>
        {footerBar}
      </div>
    );
  }

  // ── 11 渐变品牌背景 + 悬浮认证卡片：整页品牌渐变 + 背景装饰，无分栏边界；
  //    brandSide=right 时两列镜像（认证列在左、品牌列在右，窄屏认证列在前） ──
  if (layout === "backdrop") {
    return (
      <div
        data-slot="login"
        data-layout={layout}
        data-brand-side={brandSide}
        className={cn(
          "relative grid min-h-[var(--login-min-h,100svh)] w-full overflow-hidden bg-linear-to-br from-primary/20 via-accent to-primary/10 md:grid-cols-2 dark:from-primary/25 dark:to-primary/15",
          className,
        )}
        style={style}
      >
        {decor ? <BgDecor /> : null}
        {brandSide === "left" ? (
          <>
            {backdropBrandColumn}
            {backdropAuthColumn}
          </>
        ) : (
          <>
            {backdropAuthColumn}
            {backdropBrandColumn}
          </>
        )}
      </div>
    );
  }

  // ── split（01–04、12）：方向 / 比例 / 认证区容器 / 面板背景均可配 ──
  const ratio = Math.min(Math.max(brandRatio, 0.2), 0.8);
  const rootStyle = {
    "--login-grid": `minmax(0, ${ratio}fr) minmax(0, ${1 - ratio}fr)`,
    ...style,
  } as CSSProperties;

  return (
    <div
      data-slot="login"
      data-layout={layout}
      data-brand-side={brandSide}
      className={cn(
        "grid min-h-[var(--login-min-h,100svh)] w-full bg-background md:[grid-template-columns:var(--login-grid)]",
        className,
      )}
      style={rootStyle}
    >
      {brandSide === "left" ? (
        <>
          {brandPanel()}
          {authColumn(authVariant)}
        </>
      ) : (
        <>
          {authColumn(authVariant, true)}
          {brandPanel("order-last", false)}
        </>
      )}
    </div>
  );
}
