/** 创建临时目录，返回路径与清理函数 */
export declare function createTempDir(): {
    dir: string;
    cleanup: () => void;
};
/** 写文本文件（自动创建父目录） */
export declare function writeText(file: string, content: string): void;
