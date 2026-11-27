# 个人中心与管理后台接口草案

本文件描述前端已经实现的调用方式，供成员 7、8、9、10 联调确认。业务依据为补充的需求分析和 API 通用规范。路径及模块字段属于前端草案，尚未代表后端已提供这些接口。

## 通用约定

- 业务前缀 `/api/v1`；受保护接口使用 Bearer Token。
- 当前用户由后端认证取得，不接受客户端用 `user_id`、`owner_id` 或 `role` 指定操作者。
- ID 为十进制字符串，时间为 UTC ISO 8601，金额为整数分。
- 成功响应为 `{ code: "OK", message: "success", data: ... }`；创建使用 `CREATED`。前端暂兼容已有框架的 `SUCCESS`。
- 错误采用实际 HTTP 状态码，响应为 `{ code, message, data }`。字段错误使用 `data.fields`。
- 列表参数为 `page`（默认 1）、`page_size`（默认 20，1–100）以及已声明的筛选参数。
- 列表 `data` 为 `{ items, total, page, page_size }`；后端必须先做身份隔离和筛选，再分页。不能通过读取某一页公共大厅数据，在前端过滤实现个人列表。
- 默认按 `created_at DESC, id DESC` 稳定排序。

## 本人资料

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/users/me` | 读取本人资料 |
| PATCH | `/users/me` | 修改昵称和手机号 |

用户对象字段：`id`、`username`、`nickname`、`phone`、`avatar_url`、`role`、`is_active`、`created_at`，可包含 `updated_at`。`is_active` 为 JSON 布尔值。响应不得包含密码或密码哈希。

PATCH 支持 `nickname`、`phone`：未传字段保持不变；显式 `null` 不允许；不接受身份或角色字段。昵称去除首尾空格后为 1–20 字，手机号沿用现有注册页的 11 位大陆手机号码规则。手机号码重复返回 `409 ACCOUNT_CONFLICT`。保存成功返回更新后的完整用户对象。

## 我的发布与接单

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/users/me/products` | 本人发布的商品 |
| GET | `/users/me/lost-found` | 本人发布的失物信息 |
| GET | `/users/me/errands` | 本人发布或接取的跑腿任务 |
| GET | `/users/me/{kind}/{id}` | 本人的内容详情或本人接取的跑腿详情 |

`kind` 仅允许 `products`、`lost-found`、`errands`。

列表支持 `keyword`（最多 100 字）和对应业务 `status`。跑腿列表另外接受 `participation=published|accepted`，默认 `published`；`accepted` 包括待确认与已完成的历史任务。本人发布列表可以返回违规下架的自有记录及原因，但不返回已逻辑删除记录。

详情接口允许资源发布者查看；跑腿任务额外允许该任务接单人查看。其他身份返回 403，已删除或不存在返回对应模块 404。

### 列表与详情字段

公共字段包括 `id`、`status`、`moderation_status`、`taken_down_reason`、`created_at`、`updated_at`、`contact_info`。发布者昵称由后端关联用户表得到，使用 `publisher_nickname`。

- 商品：`seller_id`、`title`、`price_cents`、`description`、`category_name`、`cover_url`、`off_shelf_at`。`cover_url` 可空，通常取 `sort_order=1` 的商品图片。
- 失物：`publisher_id`、`item_type`、`item_name`、`location`、`description`、`resolved_at`。
- 跑腿：`publisher_id`、`accepter_id`、`accepter_nickname`、`start_location`、`end_location`、`fee_cents`、`item_desc`、`accepted_at`、`delivered_at`、`completed_at`。未发生的时间及未接单的接单人字段为 `null`。

后端应在以下情况返回 `contact_info=null`：商品已下架、失物已完结、任务已完成，或内容处于违规下架状态。前端同时隐藏这些状态下的联系方式，不能以此代替服务端过滤。

### 本人动作

| 方法 | 路径 | 前置条件 |
| --- | --- | --- |
| POST | `/products/{id}/off-shelf` | 本人商品，`on_sale` |
| PATCH | `/lost-found/{id}/resolve` | 本人信息，`searching` 或 `unclaimed` |
| POST | `/errands/{id}/deliver` | 本人为接单人，`in_progress` |
| POST | `/errands/{id}/complete` | 本人为发布者，`pending_confirm` |

这些动作无请求体。成功返回更新后的完整记录。无所有权或参与者权限返回 403；重复操作、状态冲突、违规下架内容返回 409。更新状态时同步设置相应时间。

商品下架后不会自动重新上架；失物完结后不再允许完结；接单人确认送达后为 `pending_confirm`，只有发布者能确认完成。

## 管理后台

所有 `/admin` 接口均由后端验证有效管理员身份及账号状态。封禁账号的既有 Token 也必须被后端拒绝。当前前端不提供封禁管理员账号的操作，模拟服务同样拒绝；该保护需后端落实。

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/admin/users` | 全站用户分页 |
| POST | `/admin/users/{id}/ban` | 封禁用户 |
| POST | `/admin/users/{id}/unban` | 解封用户 |
| GET | `/admin/{kind}` | 全站内容分页 |
| GET | `/admin/{kind}/{id}` | 管理员内容详情 |
| POST | `/admin/{kind}/{id}/take-down` | 违规下架 |
| POST | `/admin/{kind}/{id}/restore` | 恢复违规下架 |
| DELETE | `/admin/{kind}/{id}` | 逻辑删除 |

用户列表支持 `keyword`（昵称、用户名、手机号）和 `is_active=true|false`；用户对象可附加 `banned_reason`、`banned_at`。

内容列表支持 `keyword`（内容或发布者）、对应业务 `status` 和 `moderation_status=normal|taken_down`，包括正常和违规下架记录，不包括已逻辑删除记录。

封禁、违规下架、删除的请求体为 `{ "reason": "操作原因" }`，去除首尾空格后为 1–255 字。解封与恢复无请求体。删除使用 DELETE 的 JSON 请求体，后端需显式声明 Schema。

### 状态与审计

- 封禁设置 `is_active=false`、`banned_at`、`banned_reason`；解封清空封禁时间和原因。
- 违规下架设置 `moderation_status=taken_down`、下架原因和时间。
- 恢复仅将治理状态改为 `normal` 并清空违规下架信息，不改商品、失物或跑腿的业务状态。例如卖家已经下架的商品，恢复治理状态后仍是 `off_shelf`。
- 删除采用用户确认的逻辑删除方案：设置 `is_deleted`、`deleted_at`、`deleted_by`，保留数据库记录和审计，页面不提供恢复删除入口。
- 管理写操作和成功审计记录必须由后端在同一事务中提交。审计动作对应 `ban_user`、`unban_user`、`take_down`、`restore`、`soft_delete`。
- 封禁、违规下架和删除需前端确认并填写原因。重复操作返回 409；已删除资源返回 404。
- 除删除外，动作成功返回更新后的完整对象。删除成功返回 HTTP 200，`data={ "id": "101", "is_deleted": true }`，不使用 204。

本地模拟数据用于验证前端交互与接口形状，不能代替真实后端的认证、数据库事务、审计、并发控制和集成测试。
