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
export { DatePicker } from './components/DatePicker/index.js';
export type {
  DatePickerPreset,
  DatePickerPresetKey,
  DatePickerProps,
  DatePickerRangeProps,
  DatePickerSingleProps,
  DateRangeValue,
} from './components/DatePicker/index.js';
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
  HeaderTheme,
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
export { NumberInput } from './components/NumberInput/index.js';
export type { NumberInputProps } from './components/NumberInput/index.js';
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

// 业务刚需类扩展组件（第五批：数据录入）
export { Rate } from './components/Rate/index.js';
export type { RateProps } from './components/Rate/index.js';
export { TimePicker } from './components/TimePicker/index.js';
export type { TimePickerProps } from './components/TimePicker/index.js';
export { ColorPicker } from './components/ColorPicker/index.js';
export type { ColorPickerProps } from './components/ColorPicker/index.js';
export { Upload } from './components/Upload/index.js';
export type { UploadFileMeta, UploadProps } from './components/Upload/index.js';
export { TreeSelect } from './components/TreeSelect/index.js';
export type { TreeSelectOption, TreeSelectProps } from './components/TreeSelect/index.js';
export { Cascader } from './components/Cascader/index.js';
export type { CascaderOption, CascaderProps } from './components/Cascader/index.js';
export { Transfer } from './components/Transfer/index.js';
export type { TransferOption, TransferProps } from './components/Transfer/index.js';
export { Mentions } from './components/Mentions/index.js';
export type { MentionOption, MentionsProps } from './components/Mentions/index.js';

// 业务刚需类扩展组件（第五批：数据展示）
export { List } from './components/List/index.js';
export type { ListItemData, ListProps } from './components/List/index.js';
export { Tree } from './components/Tree/index.js';
export type { TreeNodeData, TreeProps } from './components/Tree/index.js';
export { Descriptions } from './components/Descriptions/index.js';
export type { DescriptionsItemData, DescriptionsProps } from './components/Descriptions/index.js';
export { Timeline } from './components/Timeline/index.js';
export type { TimelineItemData, TimelineProps } from './components/Timeline/index.js';
export { Image } from './components/Image/index.js';
export type { ImageProps } from './components/Image/index.js';
export { QRCode } from './components/QRCode/index.js';
export type { QRCodeProps } from './components/QRCode/index.js';
export { Segmented } from './components/Segmented/index.js';
export type { SegmentedOption, SegmentedProps } from './components/Segmented/index.js';

// 业务刚需类扩展组件（第五批：反馈）
export { Message } from './components/Message/index.js';
export type { MessageProps } from './components/Message/index.js';
export { Notification } from './components/Notification/index.js';
export type { NotificationProps } from './components/Notification/index.js';
export { Popconfirm } from './components/Popconfirm/index.js';
export type { PopconfirmProps } from './components/Popconfirm/index.js';
export { Result } from './components/Result/index.js';
export type { ResultProps, ResultStatus } from './components/Result/index.js';
export { LoadingOverlay } from './components/LoadingOverlay/index.js';
export type { LoadingOverlayProps } from './components/LoadingOverlay/index.js';
export { Watermark } from './components/Watermark/index.js';
export type { WatermarkProps } from './components/Watermark/index.js';
export { Tour } from './components/Tour/index.js';
export type { TourProps, TourStep } from './components/Tour/index.js';

// 基础补齐类扩展组件（第六批：通用 / 布局 / 导航）
export { Tag } from './components/Tag/index.js';
export type { TagColor, TagProps } from './components/Tag/index.js';
export { Status } from './components/Status/index.js';
export type { StatusProps, StatusType } from './components/Status/index.js';
export { Space } from './components/Space/index.js';
export type { SpaceProps } from './components/Space/index.js';
export { Container } from './components/Container/index.js';
export type { ContainerProps, ContainerSize } from './components/Container/index.js';
export { Steps } from './components/Steps/index.js';
export type { StepItemData, StepsProps, StepStatus } from './components/Steps/index.js';
export { Anchor } from './components/Anchor/index.js';
export type { AnchorItemData, AnchorProps } from './components/Anchor/index.js';
export { BackTop } from './components/BackTop/index.js';
export type { BackTopProps } from './components/BackTop/index.js';
export { Affix } from './components/Affix/index.js';
export type { AffixProps } from './components/Affix/index.js';

// 媒体与内容类扩展组件（第七批）
export { ImageViewer, ImageLightbox } from './components/ImageViewer/index.js';
export type { ImageLightboxProps, ImageViewerProps } from './components/ImageViewer/index.js';
export { Gallery } from './components/Gallery/index.js';
export type { GalleryItemData, GalleryProps } from './components/Gallery/index.js';
export { Video } from './components/Video/index.js';
export type { VideoProps } from './components/Video/index.js';
export { Audio } from './components/Audio/index.js';
export type { AudioProps } from './components/Audio/index.js';
export { FilePreview, inferKind } from './components/FilePreview/index.js';
export type { FilePreviewKind, FilePreviewProps } from './components/FilePreview/index.js';
export { DocumentPreview } from './components/DocumentPreview/index.js';
export type { DocumentPageData, DocumentPreviewProps } from './components/DocumentPreview/index.js';
export { RichText } from './components/RichText/index.js';
export type { RichTextProps } from './components/RichText/index.js';
export { Markdown } from './components/Markdown/index.js';
export type { MarkdownProps } from './components/Markdown/index.js';
export { CodeBlock } from './components/CodeBlock/index.js';
export type { CodeBlockProps } from './components/CodeBlock/index.js';
export { DiffViewer, diffLines } from './components/DiffViewer/index.js';
export type { DiffViewerProps } from './components/DiffViewer/index.js';
export { JSONViewer } from './components/JSONViewer/index.js';
export type { JSONViewerProps } from './components/JSONViewer/index.js';

// AI 与会话类扩展组件（第八批：chat 子目录）
export { Bubble } from './chat/Bubble/index.js';
export type { BubbleProps, BubbleVariant } from './chat/Bubble/index.js';
export { Sender } from './chat/Sender/index.js';
export type { SenderProps } from './chat/Sender/index.js';
export { Thinking } from './chat/Thinking/index.js';
export type { ThinkingProps, ThinkingStatus } from './chat/Thinking/index.js';
export { AgentStatus } from './chat/AgentStatus/index.js';
export type { AgentStatusProps, AgentStatusType } from './chat/AgentStatus/index.js';
export { StreamingText } from './chat/StreamingText/index.js';
export type { StreamingTextProps } from './chat/StreamingText/index.js';
export { Suggestion } from './chat/Suggestion/index.js';
export type { SuggestionItem, SuggestionProps } from './chat/Suggestion/index.js';
export { Prompt } from './chat/Prompt/index.js';
export type { PromptProps } from './chat/Prompt/index.js';
export { Welcome } from './chat/Welcome/index.js';
export type { WelcomePromptItem, WelcomeProps } from './chat/Welcome/index.js';
export { Citation } from './chat/Citation/index.js';
export type { CitationItem, CitationProps } from './chat/Citation/index.js';
export { Attachment } from './chat/Attachment/index.js';
export type { AttachmentItemData, AttachmentProps } from './chat/Attachment/index.js';
export { ToolCall } from './chat/ToolCall/index.js';
export type { ToolCallProps, ToolCallStatus } from './chat/ToolCall/index.js';
export { ChatMessage } from './chat/ChatMessage/index.js';
export type {
  ChatMessageActionItem,
  ChatMessageAgent,
  ChatMessagePart,
  ChatMessageProps,
  ChatMessageStatus,
} from './chat/ChatMessage/index.js';
export { MessageList } from './chat/MessageList/index.js';
export type { MessageListItem, MessageListProps } from './chat/MessageList/index.js';
export { Composer } from './chat/Composer/index.js';
export type {
  ComposerContextItem,
  ComposerContextSource,
  ComposerModelOption,
  ComposerProps,
} from './chat/Composer/index.js';
export { ConversationList } from './chat/ConversationList/index.js';
export type { ConversationItemData, ConversationListProps } from './chat/ConversationList/index.js';
export { ArtifactPanel } from './chat/ArtifactPanel/index.js';
export type {
  ArtifactPanelProps,
  ArtifactViewer,
  ArtifactViewers,
} from './chat/ArtifactPanel/index.js';
export { buildArtifactTree } from './chat/ArtifactPanel/artifact.js';
export type {
  ArtifactTreeNode,
  ChatPageArtifact,
} from './chat/ArtifactPanel/artifact.js';
export { ChatPage } from './chat/ChatPage/index.js';
export type {
  ChatPageBrand,
  ChatPageMenuItem,
  ChatPageProps,
} from './chat/ChatPage/index.js';

// 图表组件集（第九批：src/components/chart 目录，echarts 渲染）
export { MetricCard } from './chart/MetricCard/index.js';
export type { MetricCardProps } from './chart/MetricCard/index.js';
export { LineChart } from './chart/LineChart/index.js';
export type { LineChartProps } from './chart/LineChart/index.js';
export { ColumnChart } from './chart/ColumnChart/index.js';
export type { ColumnChartProps } from './chart/ColumnChart/index.js';
export { BarChart } from './chart/BarChart/index.js';
export type { BarChartProps } from './chart/BarChart/index.js';
export { AreaChart } from './chart/AreaChart/index.js';
export type { AreaChartProps } from './chart/AreaChart/index.js';
export { PieChart } from './chart/PieChart/index.js';
export type { PieChartProps } from './chart/PieChart/index.js';
export { DonutChart } from './chart/DonutChart/index.js';
export type { DonutChartProps } from './chart/DonutChart/index.js';
export { ScatterChart } from './chart/ScatterChart/index.js';
export type { ScatterChartProps } from './chart/ScatterChart/index.js';
export { BubbleChart } from './chart/BubbleChart/index.js';
export type { BubbleChartProps } from './chart/BubbleChart/index.js';
export { RadarChart } from './chart/RadarChart/index.js';
export type { RadarChartProps } from './chart/RadarChart/index.js';
export { FunnelChart } from './chart/FunnelChart/index.js';
export type { FunnelChartProps } from './chart/FunnelChart/index.js';
export { GaugeChart } from './chart/GaugeChart/index.js';
export type { GaugeChartProps } from './chart/GaugeChart/index.js';
export { Heatmap } from './chart/Heatmap/index.js';
export type { HeatmapProps } from './chart/Heatmap/index.js';
export { TreeChart } from './chart/TreeChart/index.js';
export type { TreeChartProps } from './chart/TreeChart/index.js';
export { SankeyChart } from './chart/SankeyChart/index.js';
export type { SankeyChartProps } from './chart/SankeyChart/index.js';
export { MapChart } from './chart/MapChart/index.js';
export type { MapChartProps } from './chart/MapChart/index.js';
export { ComposedChart } from './chart/ComposedChart/index.js';
export type { ComposedChartProps, ComposedSeriesItem } from './chart/ComposedChart/index.js';
export { EChartBase } from './chart/EChartBase/index.js';
export type { ChartSelectPayload, EChartBaseProps } from './chart/EChartBase/index.js';
