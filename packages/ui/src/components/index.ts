// 注册入口
export {
  createComponentRegistry,
  registerBuiltinComponents,
  builtinComponents,
} from './register.js';

// 展示与布局组件
export { Page } from './components/Page/index.js';
export type { PageProps } from './components/Page/index.js';
export { Grid } from './components/Grid/index.js';
export type { GridProps } from './components/Grid/index.js';
export { Flex } from './components/Flex/index.js';
export type { FlexProps } from './components/Flex/index.js';
export { Card } from './components/Card/index.js';
export type { CardProps } from './components/Card/index.js';
export { Button } from './components/Button/index.js';
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from './components/Button/index.js';
export { Alert } from './components/Alert/index.js';
export type { AlertProps, AlertVariant } from './components/Alert/index.js';
export { Statistic } from './components/Statistic/index.js';
export type { StatisticProps } from './components/Statistic/index.js';
export { Text } from './components/Text/index.js';
export type { TextProps, TextType } from './components/Text/index.js';
export { Tabs } from './components/Tabs/index.js';
export type { TabItem, TabsProps } from './components/Tabs/index.js';

// 展示类扩展组件
export { Badge } from './components/Badge/index.js';
export type { BadgeProps, BadgeVariant } from './components/Badge/index.js';
export { Avatar } from './components/Avatar/index.js';
export type { AvatarProps } from './components/Avatar/index.js';
export { Skeleton } from './components/Skeleton/index.js';
export type { SkeletonProps, SkeletonShape } from './components/Skeleton/index.js';
export { Separator } from './components/Separator/index.js';
export type { SeparatorProps } from './components/Separator/index.js';
export { Kbd } from './components/Kbd/index.js';
export type { KbdProps } from './components/Kbd/index.js';
export { Spinner } from './components/Spinner/index.js';
export type { SpinnerProps, SpinnerSize } from './components/Spinner/index.js';
export { Empty } from './components/Empty/index.js';
export type { EmptyProps } from './components/Empty/index.js';
export { AspectRatio } from './components/AspectRatio/index.js';
export type { AspectRatioProps } from './components/AspectRatio/index.js';
export { Progress } from './components/Progress/index.js';
export type { ProgressProps } from './components/Progress/index.js';

// 导航类扩展组件
export { Breadcrumb } from './components/Breadcrumb/index.js';
export type {
  BreadcrumbItemData,
  BreadcrumbProps,
} from './components/Breadcrumb/index.js';
export { Pagination } from './components/Pagination/index.js';
export type { PaginationProps } from './components/Pagination/index.js';
export { Menubar } from './components/Menubar/index.js';
export type {
  MenubarLeafItem,
  MenubarMenuData,
  MenubarProps,
} from './components/Menubar/index.js';
export { NavigationMenu } from './components/NavigationMenu/index.js';
export type {
  NavigationMenuChildItem,
  NavigationMenuItemData,
  NavigationMenuProps,
} from './components/NavigationMenu/index.js';
export { DropdownMenu } from './components/DropdownMenu/index.js';
export type {
  DropdownMenuItemData,
  DropdownMenuProps,
} from './components/DropdownMenu/index.js';
export { ContextMenu } from './components/ContextMenu/index.js';
export type {
  ContextMenuItemData,
  ContextMenuProps,
} from './components/ContextMenu/index.js';

// 反馈与弹层类扩展组件
export { Dialog } from './components/Dialog/index.js';
export type { DialogProps } from './components/Dialog/index.js';
export { AlertDialog } from './components/AlertDialog/index.js';
export type { AlertDialogProps } from './components/AlertDialog/index.js';
export { Drawer } from './components/Drawer/index.js';
export type { DrawerPlacement, DrawerProps } from './components/Drawer/index.js';
export { Sheet } from './components/Sheet/index.js';
export type { SheetProps, SheetSide } from './components/Sheet/index.js';
export { Popover } from './components/Popover/index.js';
export type { PopoverProps } from './components/Popover/index.js';
export { Sonner } from './components/Sonner/index.js';
export type { SonnerProps } from './components/Sonner/index.js';
export { Accordion } from './components/Accordion/index.js';
export type {
  AccordionItemData,
  AccordionProps,
} from './components/Accordion/index.js';
export { Collapsible } from './components/Collapsible/index.js';
export type { CollapsibleProps } from './components/Collapsible/index.js';
export { Tooltip } from './components/Tooltip/index.js';
export type { TooltipProps } from './components/Tooltip/index.js';
export { HoverCard } from './components/HoverCard/index.js';
export type { HoverCardProps } from './components/HoverCard/index.js';
export { Icon, ICONS, normalizeIconName } from './components/Icon/index.js';
export type { IconProps, IconSize } from './components/Icon/index.js';

// 复合类扩展组件（第三批）
export { Calendar } from './components/Calendar/index.js';
export type { CalendarProps } from './components/Calendar/index.js';
export { InputOTP } from './components/InputOTP/index.js';
export type { InputOTPProps } from './components/InputOTP/index.js';
export { Combobox } from './components/Combobox/index.js';
export type {
  ComboboxOption,
  ComboboxProps,
} from './components/Combobox/index.js';
export { Carousel } from './components/Carousel/index.js';
export type {
  CarouselImage,
  CarouselItemData,
  CarouselProps,
} from './components/Carousel/index.js';
export { Command } from './components/Command/index.js';
export type {
  CommandGroupData,
  CommandItemData,
  CommandProps,
} from './components/Command/index.js';
export { Resizable } from './components/Resizable/index.js';
export type {
  ResizablePanelData,
  ResizableProps,
} from './components/Resizable/index.js';
export { ScrollArea } from './components/ScrollArea/index.js';
export type { ScrollAreaProps } from './components/ScrollArea/index.js';
export { Toggle } from './components/Toggle/index.js';
export type { ToggleProps } from './components/Toggle/index.js';
export { ToggleGroup } from './components/ToggleGroup/index.js';
export type {
  ToggleGroupOption,
  ToggleGroupProps,
} from './components/ToggleGroup/index.js';
export { ButtonGroup } from './components/ButtonGroup/index.js';
export type { ButtonGroupProps } from './components/ButtonGroup/index.js';
export { InputGroup } from './components/InputGroup/index.js';
export type { InputGroupProps } from './components/InputGroup/index.js';
export { Item } from './components/Item/index.js';
export type { ItemProps } from './components/Item/index.js';
export { Typography } from './components/Typography/index.js';
export type {
  TypographyProps,
  TypographyVariant,
} from './components/Typography/index.js';

// 页面级组合类扩展组件（第四批）
export { Sidebar, useSidebarDrawer } from './components/Sidebar/index.js';
export { RailTooltip } from './components/Sidebar/rail-tooltip.js';
export type {
  SidebarBrand,
  SidebarNavItem,
  SidebarProps,
} from './components/Sidebar/index.js';
export { DataTable } from './components/DataTable/index.js';
export type {
  DataTableColumn,
  DataTablePagination,
  DataTableProps,
  DataTableSort,
  DataTableSortOrder,
} from './components/DataTable/index.js';
export { Chart } from './components/Chart/index.js';
export type { ChartProps, ChartType } from './components/Chart/index.js';

// 布局组件（页面级自由组合，见 spec: layout-components）
export { Layout } from './components/Layout/index.js';
export type { LayoutProps } from './components/Layout/index.js';
export { Header } from './components/Header/index.js';
export type {
  HeaderBrandPosition,
  HeaderDropdown,
  HeaderDropdownItem,
  HeaderLocale,
  HeaderMenuItem,
  HeaderProps,
  HeaderUser,
  HeaderUserItem,
} from './components/Header/index.js';
export { Sider } from './components/Sider/index.js';
export type { SiderProps } from './components/Sider/index.js';
export { Content } from './components/Content/index.js';
export type { ContentProps } from './components/Content/index.js';
export { Footer } from './components/Footer/index.js';
export type { FooterProps } from './components/Footer/index.js';
export { Menu } from './components/Menu/index.js';
export type { MenuItem, MenuProps } from './components/Menu/index.js';
export { Link } from './components/Link/index.js';
export type { LinkProps } from './components/Link/index.js';

// 表单组件
export { Form } from './components/Form/index.js';
export type { FormProps } from './components/Form/index.js';
export { useFormContext } from './components/Form/context.js';
export type { FormContextValue } from './components/Form/context.js';
export { Input } from './components/Input/index.js';
export type { FieldRule, InputProps } from './components/Input/index.js';
export { Select } from './components/Select/index.js';
export type { SelectOption, SelectProps } from './components/Select/index.js';
export { Textarea } from './components/Textarea/index.js';
export type { TextareaProps } from './components/Textarea/index.js';
export { Checkbox } from './components/Checkbox/index.js';
export type { CheckboxProps } from './components/Checkbox/index.js';
export { RadioGroup } from './components/RadioGroup/index.js';
export type { RadioGroupOption, RadioGroupProps } from './components/RadioGroup/index.js';
export { Switch } from './components/Switch/index.js';
export type { SwitchProps } from './components/Switch/index.js';
export { Slider } from './components/Slider/index.js';
export type { SliderProps } from './components/Slider/index.js';
export { Label } from './components/Label/index.js';
export type { LabelProps } from './components/Label/index.js';
export { Field } from './components/Field/index.js';
export type { FieldProps } from './components/Field/index.js';
export { ChatInput } from './components/ChatInput/index.js';
export type { ChatInputProps } from './components/ChatInput/index.js';

// 数据组件
export { Table } from './components/Table/index.js';
export type {
  TableColumn,
  TablePagination,
  TablePaginationInfo,
  TableProps,
} from './components/Table/index.js';
