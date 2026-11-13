/** 版本递增类型：语义化级别或显式版本号（如 2.0.0 / 2.0.0-beta.1） */
export type VersionRelease = 'major' | 'minor' | 'patch' | (string & {});
/** 计算下一版本号；release 为 major/minor/patch 时递增，否则按显式版本号原样采用 */
export declare function bumpVersion(current: string, release: VersionRelease): string;
export interface BumpPackageVersionOptions {
    /** 工程根目录 */
    dir?: string;
    /** 递增级别或显式版本号 */
    release: VersionRelease;
}
export interface BumpPackageVersionResult {
    name: string;
    from: string;
    to: string;
}
/** 递增工程 package.json 的 version 并写回（保留其余字段，2 空格缩进 + 末尾换行） */
export declare function bumpPackageVersion(options: BumpPackageVersionOptions): BumpPackageVersionResult;
