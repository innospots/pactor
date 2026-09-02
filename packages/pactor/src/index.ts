// Meta 包入口：转发 @pactor-app/app 的一站式 API；全部 @pactor-app/* 模块经 dependencies 一并安装，
// 需要更细粒度 API 时可直接从对应模块导入（如 @pactor-app/core、@pactor-app/ui）。
export * from '@pactor-app/app';
