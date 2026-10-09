import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import { Accordion } from './components/Accordion/index.js';
import { Affix } from './components/Affix/index.js';
import { Alert } from './components/Alert/index.js';
import { AlertDialog } from './components/AlertDialog/index.js';
import { Anchor } from './components/Anchor/index.js';
import { AspectRatio } from './components/AspectRatio/index.js';
import { Audio } from './components/Audio/index.js';
import { Avatar } from './components/Avatar/index.js';
import { BackTop } from './components/BackTop/index.js';
import { Badge } from './components/Badge/index.js';
import { Breadcrumb } from './components/Breadcrumb/index.js';
import { Button } from './components/Button/index.js';
import { ButtonGroup } from './components/ButtonGroup/index.js';
import { Calendar } from './components/Calendar/index.js';
import { Card } from './components/Card/index.js';
import { Carousel } from './components/Carousel/index.js';
import { Cascader } from './components/Cascader/index.js';
import { Checkbox } from './components/Checkbox/index.js';
import { ChipFilter } from './components/ChipFilter/index.js';
import { ChipNode } from './components/ChipNode/index.js';
import { CodeBlock } from './components/CodeBlock/index.js';
import { Collapsible } from './components/Collapsible/index.js';
import { ColorPicker } from './components/ColorPicker/index.js';
import { Combobox } from './components/Combobox/index.js';
import { Command } from './components/Command/index.js';
import { ChatInput } from './components/ChatInput/index.js';
import { Container } from './components/Container/index.js';
import { Content } from './components/Content/index.js';
import { ContextMenu } from './components/ContextMenu/index.js';
import { DataTable } from './components/DataTable/index.js';
import { DatePicker } from './components/DatePicker/index.js';
import { Descriptions } from './components/Descriptions/index.js';
import { Dialog } from './components/Dialog/index.js';
import { DiffViewer } from './components/DiffViewer/index.js';
import { DocumentPreview } from './components/DocumentPreview/index.js';
import { Drawer } from './components/Drawer/index.js';
import { DropdownMenu } from './components/DropdownMenu/index.js';
import { Empty } from './components/Empty/index.js';
import { Field } from './components/Field/index.js';
import { FilePreview } from './components/FilePreview/index.js';
import { Flex } from './components/Flex/index.js';
import { Footer } from './components/Footer/index.js';
import { Gallery } from './components/Gallery/index.js';
import { Form } from './components/Form/index.js';
import { For } from './components/For/index.js';
import { Grid } from './components/Grid/index.js';
import { Row } from './components/Row/index.js';
import { Col } from './components/Col/index.js';
import { Header } from './components/Header/index.js';
import { HoverCard } from './components/HoverCard/index.js';
import { Icon } from './components/Icon/index.js';
import { Image } from './components/Image/index.js';
import { ImageViewer } from './components/ImageViewer/index.js';
import { Input } from './components/Input/index.js';
import { InputGroup } from './components/InputGroup/index.js';
import { InputOTP } from './components/InputOTP/index.js';
import { Item } from './components/Item/index.js';
import { JSONViewer } from './components/JSONViewer/index.js';
import { Kbd } from './components/Kbd/index.js';
import { Label } from './components/Label/index.js';
import { Layout } from './components/Layout/index.js';
import { Link } from './components/Link/index.js';
import { List } from './components/List/index.js';
import { LoadingOverlay } from './components/LoadingOverlay/index.js';
import { Markdown } from './components/Markdown/index.js';
import { Mentions } from './components/Mentions/index.js';
import { Menu } from './components/Menu/index.js';
import { Menubar } from './components/Menubar/index.js';
import { Message } from './components/Message/index.js';
import { NavigationMenu } from './components/NavigationMenu/index.js';
import { Notification } from './components/Notification/index.js';
import { NumberInput } from './components/NumberInput/index.js';
import { Page } from './components/Page/index.js';
import { Pagination } from './components/Pagination/index.js';
import { Popconfirm } from './components/Popconfirm/index.js';
import { Popover } from './components/Popover/index.js';
import { Progress } from './components/Progress/index.js';
import { QRCode } from './components/QRCode/index.js';
import { RadioGroup } from './components/RadioGroup/index.js';
import { Rate } from './components/Rate/index.js';
import { Resizable } from './components/Resizable/index.js';
import { Result } from './components/Result/index.js';
import { RichText } from './components/RichText/index.js';
import { ScrollArea } from './components/ScrollArea/index.js';
import { Segmented } from './components/Segmented/index.js';
import { Select } from './components/Select/index.js';
import { Separator } from './components/Separator/index.js';
import { Sheet } from './components/Sheet/index.js';
import { Sidebar } from './components/Sidebar/index.js';
import { Sider } from './components/Sider/index.js';
import { Skeleton } from './components/Skeleton/index.js';
import { Slider } from './components/Slider/index.js';
import { Sonner } from './components/Sonner/index.js';
import { Space } from './components/Space/index.js';
import { Spinner } from './components/Spinner/index.js';
import { Statistic } from './components/Statistic/index.js';
import { Status } from './components/Status/index.js';
import { Steps } from './components/Steps/index.js';
import { Switch } from './components/Switch/index.js';
import { Table } from './components/Table/index.js';
import { Tabs } from './components/Tabs/index.js';
import { Tag } from './components/Tag/index.js';
import { Text } from './components/Text/index.js';
import { Textarea } from './components/Textarea/index.js';
import { TimePicker } from './components/TimePicker/index.js';
import { Timeline } from './components/Timeline/index.js';
import { Toggle } from './components/Toggle/index.js';
import { ToggleGroup } from './components/ToggleGroup/index.js';
import { Tooltip } from './components/Tooltip/index.js';
import { Tour } from './components/Tour/index.js';
import { Transfer } from './components/Transfer/index.js';
import { Tree } from './components/Tree/index.js';
import { TreeSelect } from './components/TreeSelect/index.js';
import { Typography } from './components/Typography/index.js';
import { Upload } from './components/Upload/index.js';
import { Video } from './components/Video/index.js';
import { Watermark } from './components/Watermark/index.js';

// AI 与会话类扩展组件（chat 子目录）
import { AgentStatus } from './chat/AgentStatus/index.js';
import { ArtifactPanel } from './chat/ArtifactPanel/index.js';
import { Attachment } from './chat/Attachment/index.js';
import { Bubble } from './chat/Bubble/index.js';
import { ChatMessage } from './chat/ChatMessage/index.js';
import { ChatPage } from './chat/ChatPage/index.js';
import { Citation } from './chat/Citation/index.js';
import { Composer } from './chat/Composer/index.js';
import { ConversationList } from './chat/ConversationList/index.js';
import { MessageList } from './chat/MessageList/index.js';
import { Prompt } from './chat/Prompt/index.js';
import { Sender } from './chat/Sender/index.js';
import { StepsPanel } from './chat/StepsPanel/index.js';
import { StreamingText } from './chat/StreamingText/index.js';
import { Suggestion } from './chat/Suggestion/index.js';
import { Thinking } from './chat/Thinking/index.js';
import { ToolCall } from './chat/ToolCall/index.js';
import { Welcome } from './chat/Welcome/index.js';

// 图表组件集（src/components/chart 目录，echarts 渲染）
import { AreaChart } from './chart/AreaChart/index.js';
import { BarChart } from './chart/BarChart/index.js';
import { BubbleChart } from './chart/BubbleChart/index.js';
import { ColumnChart } from './chart/ColumnChart/index.js';
import { ComposedChart } from './chart/ComposedChart/index.js';
import { DonutChart } from './chart/DonutChart/index.js';
import { FunnelChart } from './chart/FunnelChart/index.js';
import { GaugeChart } from './chart/GaugeChart/index.js';
import { Heatmap } from './chart/Heatmap/index.js';
import { LineChart } from './chart/LineChart/index.js';
import { MapChart } from './chart/MapChart/index.js';
import { MetricCard } from './chart/MetricCard/index.js';
import { PieChart } from './chart/PieChart/index.js';
import { RadarChart } from './chart/RadarChart/index.js';
import { SankeyChart } from './chart/SankeyChart/index.js';
import { ScatterChart } from './chart/ScatterChart/index.js';
import { TreeChart } from './chart/TreeChart/index.js';

// 业务组件（business 子目录）
import { CardList } from './business/CardList/index.js';
import { EntityCard } from './business/EntityCard/index.js';
import { Login } from './business/Login/index.js';

/**
 * 内置组件表：DSL 类型名 → 组件适配器。
 * 类型名集合即 spec: builtin-components 的内置组件清单；
 * 容器组件（Tabs / Table）经 `useRenderer().renderChildren` 渲染 DSL 子树。
 */
export const builtinComponents = {
  Page,
  Grid,
  Row,
  Col,
  // 循环渲染：行模板（原始 DSL children）由 For 逐项渲染并注入 { row, rowIndex } 作用域
  For: { component: For, withScope: true },
  Flex,
  Card,
  Button,
  Alert,
  Statistic,
  Tabs,
  Table,
  Form,
  Input,
  NumberInput,
  Select,
  // Layout 需要原始 DSL 子树做方向推导（含 Sider 判定），以 withScope 注册
  Layout: { component: Layout, withScope: true },
  Header,
  Sider,
  Content,
  Footer,
  Menu,
  Link,
  Text,
  // 展示类扩展组件
  Badge,
  Avatar,
  Skeleton,
  Separator,
  Kbd,
  Spinner,
  Empty,
  AspectRatio,
  Progress,
  // 表单类扩展组件
  Textarea,
  Checkbox,
  ChipFilter,
  ChipNode,
  RadioGroup,
  Switch,
  Slider,
  Label,
  Field,
  ChatInput,
  // 导航类扩展组件
  Breadcrumb,
  Pagination,
  Menubar,
  NavigationMenu,
  DropdownMenu,
  ContextMenu,
  // 反馈与弹层类扩展组件
  Dialog,
  AlertDialog,
  Drawer,
  Sheet,
  Popover,
  Sonner,
  Accordion,
  Collapsible,
  Tooltip,
  HoverCard,
  // 复合类扩展组件（第三批）
  Calendar,
  DatePicker,
  InputOTP,
  Combobox,
  Carousel,
  Command,
  Resizable,
  ScrollArea,
  Toggle,
  ToggleGroup,
  ButtonGroup,
  InputGroup,
  Item,
  Typography,
  // 页面级组合类扩展组件（第四批）
  Sidebar,
  DataTable,
  // 图标（lucide 白名单）
  Icon,
  // 业务刚需类扩展组件（第五批：数据录入 / 数据展示 / 反馈）
  Rate,
  TimePicker,
  ColorPicker,
  Upload,
  TreeSelect,
  Cascader,
  Transfer,
  Mentions,
  List,
  Tree,
  Descriptions,
  Timeline,
  Image,
  QRCode,
  Segmented,
  Message,
  Notification,
  Popconfirm,
  Result,
  LoadingOverlay,
  Watermark,
  Tour,
  // 基础补齐类扩展组件（第六批：通用 / 布局 / 导航）
  Tag,
  Status,
  Space,
  Container,
  Steps,
  Anchor,
  BackTop,
  Affix,
  // 媒体与内容类扩展组件（第七批）
  ImageViewer,
  Gallery,
  Video,
  Audio,
  FilePreview,
  DocumentPreview,
  RichText,
  Markdown,
  CodeBlock,
  DiffViewer,
  JSONViewer,
  // AI 与会话类扩展组件（第八批：chat 子目录）
  Bubble,
  Sender,
  Thinking,
  AgentStatus,
  StreamingText,
  Suggestion,
  Prompt,
  Welcome,
  Citation,
  Attachment,
  ToolCall,
  ChatMessage,
  ChatPage,
  ArtifactPanel,
  MessageList,
  Composer,
  ConversationList,
  StepsPanel,
  // 图表组件集（src/components/chart 目录，echarts 渲染；
  // 交互事件经 echarts click → onSelect，DSL 用 events.onSelect + ${event}）
  MetricCard,
  LineChart,
  ColumnChart,
  BarChart,
  AreaChart,
  PieChart,
  DonutChart,
  ScatterChart,
  BubbleChart,
  RadarChart,
  FunnelChart,
  GaugeChart,
  Heatmap,
  TreeChart,
  SankeyChart,
  MapChart,
  ComposedChart,
  // 业务组件（business 子目录）
  Login,
  EntityCard,
  CardList,
} as const;

/** 把全部 V1 内置组件按 DSL 类型名注册到给定 ComponentRegistry */
export function registerBuiltinComponents(registry: ComponentRegistry): void {
  for (const [type, component] of Object.entries(builtinComponents)) {
    registry.register(type, component);
  }
}

/** 创建并返回注册了全部 V1 内置组件的新 ComponentRegistry */
export function createComponentRegistry(): ComponentRegistry {
  const registry = new Registry<unknown>('ComponentRegistry');
  registerBuiltinComponents(registry);
  return registry;
}
