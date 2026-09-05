# 开发指南

## 前置条件

- 使用与 Angular 21 兼容的 Node.js LTS 版本和 npm。
- 一个本地或测试环境的 Turbo AI Server；不要连接生产数据库或使用生产供应商密钥进行日常开发。

## 安装与运行

```bash
npm ci
npm start
```

开发服务器会使用 Angular CLI 的默认地址。开发模式下，后端地址来自 `src/assets/config.json` 的 `apiUrl` 字段：

```json
{
  "apiUrl": "http://localhost:6000/"
}
```

地址必须包含协议和结尾的 `/`。该前端来源还必须加入后端 `Cors:AllowedOrigins`。此文件只用于开发模式；生产构建使用同源地址 `/`，应由反向代理或同一 ASP.NET Core 服务转发 API 请求。

## 常用命令

```bash
# 生产构建（部署在 /ai/）
npm run build -- --base-href /ai/

# 单元测试
npm test
```

构建产物位于 `dist/`。将其中浏览器产物部署到 Turbo AI Server 的 `src/Turbo.Auth/wwwroot/ai`，或部署到等价的静态站点目录，并确保 `/ai/*` 回退到应用入口。服务端部署、数据库初始化和管理员配置请参阅服务端仓库的文档。

## 项目结构

```text
src/
├── app/                 应用引导与顶层路由
├── auth_module/         登录、注册与令牌刷新
├── pages/               聊天、图像、媒体与设置页面
├── admin/               管理员页面和管理 API 调用
├── services/            API、IndexedDB 与应用级服务
├── systems/store/       NgRx 状态、effects 与 actions
└── assets/              国际化文件、图标与运行时开发配置
```

## 联调清单

1. 后端启动后，在 Swagger 确认认证、模型列表和聊天接口可用。
2. 将本地前端地址加入后端 CORS 白名单，并在 `src/assets/config.json` 配置对应 API 地址。
3. 验证注册、登录、刷新令牌、模型列表、流式聊天、文件提取和至少一项媒体或图像能力。
4. 更改模型或供应商密钥后，在管理端刷新服务端密钥池，再重新验证前端。

## 代码约定

- 新增用户可见文本时，同步维护 `src/assets/i18n/` 中的语言文件。
- 所有 API 地址应通过 `ServiceProvider` 读取，避免在组件中写死后端地址。
- 不要将令牌、供应商 API 密钥、真实账户或生产配置提交到仓库。
- 修改依赖、路由、构建配置或资源后，至少运行一次生产构建；修改行为时补充或更新测试。

