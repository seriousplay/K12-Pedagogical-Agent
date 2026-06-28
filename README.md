# K12 教研智能体

基于 CodeBuddy Agent SDK 构建的 K12 教育教研智能体 Web 应用。

## 特性

- 📚 **备课工作流** - "备这节课"触发五步自动化：信息确认→知识库检索→教案生成→质量自审→输出成品
- 📝 **分层出题** - 基础(50%)/发展(30%)/挑战(20%)三层题目自动生成，支持错题驱动和薄弱点加权
- ✅ **教案审核** - 六维度系统审核（目标/内容/方法/过程/评价/差异化），输出评级和改进建议
- 📖 **知识库检索** - 接入 ima 校本知识库，自动检索并标注来源，无内容时诚实告知
- 💬 **流式对话** - 实时显示 AI 回复
- 🔧 **工具调用** - 可视化展示 Agent 工具使用
- 🔒 **权限控制** - 支持多种权限模式
- 📝 **会话管理** - 多会话切换和持久化
- 🎨 **主题切换** - 支持深色/浅色主题

## 技术栈

- **后端**: Node.js + Express + TypeScript
- **前端**: React 18 + TypeScript + Vite
- **UI**: TDesign React 组件库
- **AI**: CodeBuddy Agent SDK
- **数据库**: SQLite (better-sqlite3)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置认证

方式一：使用 CodeBuddy API Key

创建 `.env` 文件：
```bash
CODEBUDDY_API_KEY=your_api_key
```

方式二：使用 CodeBuddy CLI 登录

```bash
# 登录 CodeBuddy
codebuddy login

# 启动应用（会自动使用 CLI 的登录信息）
npm run dev
```

方式三：Web UI 配置

在应用的设置页面中配置环境变量（仅在当前服务器进程有效）。

### 3. 启动开发服务器

```bash
npm run dev
```

这会同时启动前端（端口 5173）和后端（端口 3000）

### 4. 访问应用

打开浏览器访问 http://localhost:5173

## 使用指南

### 备课工作流

在输入框中输入：
```
备这节课 — 分数的初步认识
```

智能体将自动执行：
1. 确认学科年级和课时
2. 检索知识库中的相关资源
3. 生成完整教案
4. 进行六维度质量审核
5. 输出成品教案

### 分层出题

在输入框中输入：
```
帮我出题 — 数学 五年级 分数加减法
```

智能体将生成三层题目：
- 基础层（50%）：巩固核心概念
- 发展层（30%）：应用和迁移
- 挑战层（20%）：拓展和创新

### 教案审核

粘贴教案内容，然后输入：
```
帮我审核这个教案
```

智能体将从六个维度进行系统审核并给出改进建议。

### 知识库检索

直接提问教学相关问题，智能体将：
- 自动检索知识库中的相关资源
- 在回答中标注资料来源
- 如无相关内容，明确说明"资料库中暂无"

## 项目结构

```
teaching-research-web/
├── server/                    # 后端服务
│   ├── index.ts              # Express 服务器
│   └── db.ts                 # 数据库操作
├── src/                      # 前端源码
│   ├── components/           # React 组件
│   │   ├── ChatInput.tsx     # 聊天输入框
│   │   ├── ChatMessages.tsx  # 聊天消息展示
│   │   ├── NewChatView.tsx   # 新建聊天视图（含快捷功能入口）
│   │   └── ...
│   ├── hooks/                # 自定义 Hooks
│   ├── pages/                # 页面组件
│   ├── types.ts              # 类型定义
│   ├── config.ts             # 应用配置（含教研智能体系统提示词）
│   └── App.tsx               # 应用入口
├── data/                     # 数据存储
│   └── chat.db               # SQLite 数据库
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md                 # 项目说明
```

## 核心功能

### Agent SDK 集成

- 使用 `query()` API 发送消息并接收流式响应
- 使用 `unstable_v2_createSession()` 创建和管理 Agent 会话
- 使用 `unstable_v2_authenticate()` 处理身份认证
- 支持会话恢复（使用 `resume` 参数）

### 权限控制

支持四种权限模式：
- `default` - 每次工具调用需要确认
- `acceptEdits` - 自动接受编辑类操作
- `plan` - 计划模式（只读）
- `bypassPermissions` - 跳过所有权限检查

### 流式响应

使用 Server-Sent Events (SSE) 实现实时流式响应：
- 文本内容流式输出
- 工具调用实时展示
- 权限请求实时弹窗

### 数据持久化

使用 SQLite 存储：
- 会话信息和配置
- 消息历史记录
- Agent SDK 的 session_id（用于恢复对话）

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/check-login` | GET | 检查 CodeBuddy 登录状态 |
| `/api/models` | GET | 获取可用模型列表 |
| `/api/sessions` | GET | 获取所有会话 |
| `/api/sessions` | POST | 创建新会话 |
| `/api/sessions/:id` | GET | 获取单个会话 |
| `/api/sessions/:id` | PATCH | 更新会话 |
| `/api/sessions/:id` | DELETE | 删除会话 |
| `/api/chat` | POST | 发送消息（SSE 流式响应） |
| `/api/permission-response` | POST | 响应权限请求 |

## 环境要求

- Node.js 18+
- npm 或 yarn
- CodeBuddy API Key 或 CLI 登录

## 开发

```bash
# 开发模式（同时启动前后端）
npm run dev

# 单独启动后端
npm run dev:server

# 单独启动前端
npm run dev:client

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

##  License

MIT
