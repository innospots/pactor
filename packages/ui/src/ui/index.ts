/**
 * vendored shadcn 原语组件汇总出口（子路径 `@pactor-app/ui/ui`）：
 * 供宿主构建自定义槽位 UI 与业务组件，视觉随语义令牌皮肤。
 * DSL 编排仍走 `/components` 适配器；此处为裸 React 原语。
 *
 * 与主入口刻意隔离：主入口 = 三层公开 API + 预设；原语层符号
 * （如 Button）与 DSL 适配层同名组件互不污染导入路径。
 */
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js';
export { ActionButton } from './action-button.js';
export type { ActionButtonProps } from './action-button.js';
export { Alert, AlertDescription, AlertTitle } from './alert.js';
export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from './attachment.js';
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog.js';
export { AspectRatio } from './aspect-ratio.js';
export { Avatar, AvatarFallback, AvatarImage } from './avatar.js';
export { Badge, badgeVariants } from './badge.js';
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js';
export { Button, buttonVariants } from './button.js';
export { ButtonGroup } from './button-group.js';
export {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from './bubble.js';
export { Calendar } from './calendar.js';
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from './carousel.js';
export type { CarouselApi } from './carousel.js';
export { Checkbox } from './checkbox.js';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js';
export { Combobox, ComboboxContent, ComboboxTrigger } from './combobox.js';
export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command.js';
export { ConfirmMorph } from './confirm-morph.js';
export type { ConfirmMorphProps, ConfirmMorphState } from './confirm-morph.js';
export {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './context-menu.js';
export { CopyButton } from './copy-button.js';
export type { CopyButtonProps } from './copy-button.js';
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from './drawer.js';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu.js';
export { ExpandingButtonGroup } from './expanding-button-group.js';
export type {
  ExpandingButtonGroupOption,
  ExpandingButtonGroupProps,
} from './expanding-button-group.js';
export { FloatingButtonGroup } from './floating-button-group.js';
export type {
  FloatingButtonGroupOption,
  FloatingButtonGroupProps,
} from './floating-button-group.js';
export { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js';
export {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from './menubar.js';
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './navigation-menu.js';
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination.js';
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from './sheet.js';
export { toast, toastManager, Toaster } from './toast.js';
export type { ToastOptions, ToastVariant } from './toast.js';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js';
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
export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from './empty.js';
export { Field, FieldDescription, FieldError, FieldLabel } from './field.js';
export { Input } from './input.js';
export { InputGroup, InputGroupAddon, InputGroupInput } from './input-group.js';
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp.js';
export { IconMorph, MORPH_PAIRS } from './icon-morph.js';
export type { IconMorphPreset, IconMorphProps } from './icon-morph.js';
export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from './item.js';
export { Kbd } from './kbd.js';
export { Label } from './label.js';
export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from './message.js';
export { Popover, PopoverContent, PopoverTrigger } from './popover.js';
export { Progress, ProgressIndicator, ProgressTrack } from './progress.js';
export { RadioGroup, RadioGroupItem } from './radio-group.js';
export { Panel, PanelGroup, ResizableHandle } from './resizable.js';
export { ScrollArea, ScrollBar } from './scroll-area.js';
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
export {
  Sidebar as SidebarRoot,
  SidebarContent as SidebarContentArea,
  SidebarFooter as SidebarFooterArea,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader as SidebarHeaderArea,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar.js';
export { Skeleton } from './skeleton.js';
export { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from './slider.js';
export { Spinner } from './spinner.js';
export { SplitButton } from './split-button.js';
export type { SplitButtonOption, SplitButtonProps } from './split-button.js';
export { Switch } from './switch.js';
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
export { Toggle, toggleVariants } from './toggle.js';
export { ToggleGroup, ToggleGroupItem } from './toggle-group.js';
export { Typography, typographyVariants } from './typography.js';
export {
  defaultLanguages,
  languages,
  PresenceDot,
  UserMenu,
  userStatuses,
} from './user-menu/index.js';
export type {
  LanguageOption,
  LanguagePreference,
  ThemePreference,
  UserMenuItem,
  UserMenuProps,
  UserMenuUser,
  UserStatus,
} from './user-menu/index.js';
