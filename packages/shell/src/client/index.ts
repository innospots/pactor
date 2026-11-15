export { mergeModuleActions, mergeModuleComponents } from './register-extensions.js';
export type { ModuleExtensionBundle } from './register-extensions.js';
export * from './skin.js';
export { SkinHeadScript } from '../skin/SkinHeadScript.js';
export type { SkinHeadScriptProps } from '../skin/SkinHeadScript.js';
export { SkinSwitcher } from './SkinSwitcher.js';
export type { SkinSwitcherProps } from './SkinSwitcher.js';
export { NavigationShell, createNavigationRegistry, findNavigationMenu } from './NavigationShell.js';
export type {
  NavigationMenuItem,
  NavigationShellLabels,
  NavigationShellProps,
} from './NavigationShell.js';
export { SkinGallery, SkinCardGrid } from './SkinGallery.js';
export type { SkinCardGridProps, SkinGalleryProps } from './SkinGallery.js';
export { PactorShellHost } from './PactorShellHost.js';
export type { PactorShellHostProps } from './PactorShellHost.js';
export { AppShell } from './AppShell.js';
export type { AppShellProps, ShellMenuItem, SubAppContext } from './AppShell.js';
export { ShellUserMenu, ShellUserMenuConfigContext } from './ShellUserMenu.js';
export type { ShellUserMenuConfig } from './ShellUserMenu.js';
