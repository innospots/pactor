/**
 * vendored shadcn 原语组件汇总出口（子路径 `@pactor/ui/ui`）：
 * 供宿主构建自定义槽位 UI 与业务组件，视觉随语义令牌皮肤。
 * DSL 编排仍走 `/components` 适配器；此处为裸 React 原语。
 *
 * 与主入口刻意隔离：主入口 = 三层公开 API + 预设；原语层符号
 * （如 Button）与 DSL 适配层同名组件互不污染导入路径。
 */
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js';
export { Alert, AlertDescription, AlertTitle } from './alert.js';
export { Badge, badgeVariants } from './badge.js';
export { Button, buttonVariants } from './button.js';
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card.js';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog.js';
export { Input } from './input.js';
export { Label } from './label.js';
export { Popover, PopoverContent, PopoverTrigger } from './popover.js';
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select.js';
export { Separator } from './separator.js';
export { Skeleton } from './skeleton.js';
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table.js';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js';
export { Textarea } from './textarea.js';
