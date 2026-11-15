/** 菜单徽标值格式化：0 / 空串 / 缺省不渲染；数值 > 99 截断为 99+ */
export function formatBadge(badge: string | number | undefined): string | null {
  if (badge === undefined) return null;
  if (typeof badge === 'number') {
    if (!Number.isFinite(badge) || badge <= 0) return null;
    return badge > 99 ? '99+' : String(badge);
  }
  const text = badge.trim();
  return text === '' ? null : text;
}
