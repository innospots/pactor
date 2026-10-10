/**
 * 三轨状态徽章（React 岛，pactor Badge 渲染；design D4）：
 * 成熟度 / 变更标识 / 接入状态 / 外链可用性。
 * 纯展示组件：仅资产卡片与详情页调用，分类菜单 MUST NOT 使用。
 * 四类状态相互独立，按需输出对应徽章。
 * 语义色沿用站点 badge 类（success / warning / danger / info），
 * 与站点既有配色一致（pactor Badge variant 无对应语义色档位）。
 */
import { Badge } from '@pactor-app/ui/components';
import type {
  ChangeFlag,
  Integration,
  LinkAvailability,
  Maturity,
} from '../assets-data/types';

interface Props {
  maturity?: Maturity;
  change?: ChangeFlag;
  integration?: Integration;
  availability?: LinkAvailability;
  className?: string;
}

const MATURITY_BADGE: Record<Maturity, { text: string; cls: string }> = {
  stable: { text: '稳定', cls: 'success' },
  experimental: { text: '实验', cls: 'warning' },
  deprecated: { text: '废弃', cls: 'danger' },
};
const CHANGE_BADGE: Record<ChangeFlag, { text: string; cls: string }> = {
  new: { text: '本期新增', cls: 'info' },
  updated: { text: '本期更新', cls: 'info' },
};
const INTEGRATION_BADGE: Record<Integration, { text: string; cls: string }> = {
  integrated: { text: '已接入', cls: 'success' },
  pending: { text: '待资产接入', cls: 'warning' },
};
const AVAILABILITY_BADGE: Record<LinkAvailability, { text: string; cls: string }> = {
  available: { text: '可用', cls: 'success' },
  'needs-review': { text: '需复核', cls: 'warning' },
  restricted: { text: '受限', cls: 'info' },
  broken: { text: '失效', cls: 'danger' },
};

export default function StatusBadges({
  maturity,
  change,
  integration,
  availability,
  className,
}: Props) {
  const badges = [
    ...(maturity ? [MATURITY_BADGE[maturity]] : []),
    ...(change ? [CHANGE_BADGE[change]] : []),
    ...(integration ? [INTEGRATION_BADGE[integration]] : []),
    ...(availability ? [AVAILABILITY_BADGE[availability]] : []),
  ];
  if (badges.length === 0) return null;
  return (
    <div className={className ? `badges ${className}` : 'badges'}>
      {badges.map((b) => (
        <Badge key={b.text} text={b.text} className={`badge ${b.cls}`} />
      ))}
    </div>
  );
}
