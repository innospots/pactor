import type { CSSProperties } from 'react';

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AudioLines,
  Bell,
  Bookmark,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  ChartColumn,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  Clock,
  Cloud,
  Code,
  Copy,
  CreditCard,
  Database,
  Download,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  File,
  FileText,
  Flag,
  Folder,
  Funnel,
  Globe,
  GripVertical,
  Heart,
  History,
  House,
  Image,
  Inbox,
  Info,
  Key,
  Languages,
  LayoutGrid,
  LayoutTemplate,
  Link,
  List,
  ListFilter,
  LoaderCircle,
  Lock,
  LockOpen,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Minimize2,
  Minus,
  Moon,
  Package,
  Paintbrush,
  Palette,
  PanelLeft,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  Pencil,
  Phone,
  Play,
  Plus,
  Quote,
  RefreshCcw,
  RotateCcw,
  RotateCw,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShoppingCart,
  Square,
  SquarePen,
  Star,
  Sun,
  Table,
  Tag,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TriangleAlert,
  Music,
  Upload,
  Video,
  User,
  Users,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '../../../lib/utils.js';

/**
 * 常用图标白名单（lucide-react 静态导入，可 tree-shake）：
 * key 为 kebab-case 名（DSL 侧同时接受 PascalCase，见 normalizeIconName）。
 * 未列出的图标按需在此补充一行导入 + 一行映射。
 */
export const ICONS: Record<string, LucideIcon> = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-up-right': ArrowUpRight,
  'arrow-down': ArrowDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  check: Check,
  x: X,
  plus: Plus,
  minus: Minus,
  search: Search,
  settings: Settings,
  user: User,
  users: Users,
  home: House,
  menu: Menu,
  bell: Bell,
  calendar: Calendar,
  clock: Clock,
  download: Download,
  upload: Upload,
  pencil: Pencil,
  edit: SquarePen,
  trash: Trash2,
  eye: Eye,
  info: Info,
  warning: TriangleAlert,
  error: CircleAlert,
  'check-circle': CircleCheck,
  'x-circle': CircleX,
  'help-circle': CircleQuestionMark,
  loading: LoaderCircle,
  spinner: LoaderCircle,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  share: Share2,
  copy: Copy,
  'external-link': ExternalLink,
  link: Link,
  mail: Mail,
  phone: Phone,
  lock: Lock,
  unlock: LockOpen,
  'log-in': LogIn,
  'log-out': LogOut,
  sun: Sun,
  moon: Moon,
  globe: Globe,
  'grip-vertical': GripVertical,
  filter: Funnel,
  'list-filter': ListFilter,
  'more-horizontal': Ellipsis,
  'more-vertical': EllipsisVertical,
  refresh: RefreshCcw,
  save: Save,
  file: File,
  folder: Folder,
  image: Image,
  camera: Camera,
  chart: ChartColumn,
  table: Table,
  list: List,
  grid: LayoutGrid,
  tag: Tag,
  'shopping-cart': ShoppingCart,
  'credit-card': CreditCard,
  package: Package,
  'map-pin': MapPin,
  building: Building2,
  briefcase: Briefcase,
  send: Send,
  message: MessageCircle,
  'message-square': MessageSquare,
  paperclip: Paperclip,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  zap: Zap,
  flag: Flag,
  key: Key,
  shield: Shield,
  terminal: Terminal,
  code: Code,
  database: Database,
  inbox: Inbox,
  cloud: Cloud,
  languages: Languages,
  // @pactor-app/chat 收敛（spec: chat-icon-convergence）：chat 既有图标与
  // 契约图标名（menu.icon / messageActions[].icon 的既有取值）直通
  'chevrons-up-down': ChevronsUpDown,
  'file-text': FileText,
  'panel-left': PanelLeft,
  'panel-right-open': PanelRightOpen,
  'panel-right-close': PanelRightClose,
  square: Square,
  history: History,
  'rotate-ccw': RotateCcw,
  quote: Quote,
  chat: MessageSquare,
  brain: Brain,
  // lucide 规范名别名（kebab-case 原名直通；上方短别名保留兼容）——
  // 白名单文档承诺 kebab-case 键，缺别名时规范名（如 trash-2）会落入未知占位
  'trash-2': Trash2,
  'share-2': Share2,
  'building-2': Building2,
  house: House,
  'triangle-alert': TriangleAlert,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  'circle-x': CircleX,
  'circle-question-mark': CircleQuestionMark,
  'square-pen': SquarePen,
  'refresh-ccw': RefreshCcw,
  'chart-column': ChartColumn,
  'layout-grid': LayoutGrid,
  'layout-template': LayoutTemplate,
  'maximize-2': Maximize2,
  'minimize-2': Minimize2,
  palette: Palette,
  paintbrush: Paintbrush,
  funnel: Funnel,
  'loader-circle': LoaderCircle,
  ellipsis: Ellipsis,
  'ellipsis-vertical': EllipsisVertical,
  'message-circle': MessageCircle,
  'lock-open': LockOpen,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
  video: Video,
  music: Music,
  // 录音 / 音频场景（spec: chat-page 录音模板）：波形、麦克风、播放控制
  'audio-lines': AudioLines,
  mic: Mic,
  play: Play,
  'rotate-cw': RotateCw,
};

/** DSL Icon 尺寸（数字直接作 px） */
export type IconSize = 'sm' | 'default' | 'lg' | number;

export interface IconProps {
  /** 图标名：kebab-case（如 'arrow-right'）或 PascalCase（如 'ArrowRight'），见 ICONS 白名单 */
  name?: string;
  /** 尺寸：'sm' 16 / 'default' 20 / 'lg' 24，或数字 px（缺省 default） */
  size?: IconSize;
  /** 颜色（CSS 颜色值，缺省 currentColor 跟随文本色） */
  color?: string;
  /** 描边宽度（lucide 缺省 2） */
  strokeWidth?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** kebab-case / camelCase / PascalCase 统一归一为 kebab-case 白名单键 */
export function normalizeIconName(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

const sizePx: Record<Exclude<IconSize, number>, number> = {
  sm: 16,
  default: 20,
  lg: 24,
};

/**
 * Icon 适配器（shadcn kit）：按 name 从 lucide 白名单渲染图标。
 * 未知名渲染占位图标（help-circle）并标 `data-unknown`，不抛错
 * （与 chat messageActions 图标白名单同约定）；占位图标跟随上下文
 * 文本色（currentColor），避免在 danger 等有色按钮上撞色。
 */
export function Icon({
  name,
  size = 'default',
  color,
  strokeWidth,
  className,
  style,
}: IconProps) {
  const key = name ? normalizeIconName(name) : '';
  const Lucide = ICONS[key];
  const px = typeof size === 'number' ? size : sizePx[size];

  if (!Lucide) {
    return (
      <CircleQuestionMark
        data-slot="icon"
        data-unknown={name}
        size={px}
        color={color}
        strokeWidth={strokeWidth}
        className={cn('shrink-0', className)}
        style={style}
        aria-hidden="true"
      />
    );
  }

  return (
    <Lucide
      data-slot="icon"
      size={px}
      color={color}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', className)}
      style={style}
      aria-hidden="true"
    />
  );
}
