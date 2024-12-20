## 基于[oula](http://oula.sit.saas.htsc/) 的普通 pc 模版

本项目由 ht-cli 工具自动生成，本项目已默认接入 Doorkeeper 门禁。

**提示**：本项目默认启用 Bigbox v2 版本依赖，可兼容 v1 版本，请放心使用。

## 环境准备

安装 `node_modules`:

```bash
yarn
```

## 基础脚本

### 本地开发环境启动项目

```bash
yarn start
```

### 构建项目

```bash
yarn build
```

### Lint

```bash
yarn run lint
```

如果需要自动批量修复 lint 错误，可以使用：


```bash
yarn run lint:fix
```
