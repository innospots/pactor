// Meta 包入口：转发 @pactor/app 的一站式 API；全部 @pactor/* 模块经 dependencies 一并安装，
// 需要更细粒度 API 时可直接从对应模块导入（如 @pactor/core、@pactor/ui）。
export * from '@pactor/app';
