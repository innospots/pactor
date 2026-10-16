import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** shadcn 标准 cn()：clsx 合并 + tailwind-merge 去重冲突工具类（与 @pactor-app/ui 内部同款） */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
