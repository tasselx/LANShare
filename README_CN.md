# LANShare

LANShare 是一个简单易用的局域网文件共享应用。它允许您在同一网络上的设备之间快速共享文件，无需外部服务或复杂设置。

## 功能特点

- **即时文件共享**：上传文件后立即获取可共享链接
- **二维码生成**：每个共享文件都会生成二维码，方便移动设备访问
- **局域网访问**：可从局域网内的任何设备访问应用
- **拖放界面**：简单直观的用户界面
- **无文件大小限制**：共享任意大小的文件（仅受网络速度限制）
- **自动 URL 编码**：正确处理带有空格或非拉丁字符的文件名
- **清理工具**：一键清理所有共享文件


## 安装

### 前提条件

- [Node.js](https://nodejs.org/) (v14 或更高版本)
- npm (随 Node.js 一起安装)

### 设置

1. 克隆此仓库：
   ```bash
   git clone https://github.com/yourusername/lanshare.git
   cd lanshare
   ```

2. 安装依赖：
   ```bash
   npm install
   cd lanshare
   npm install
   ```

## 使用方法

### 启动应用

您可以使用以下方法之一启动应用：

#### 使用一键启动脚本

**Windows 系统：**
只需双击根目录中的 `start.bat` 文件。

**macOS/Linux 系统：**
1. 使脚本可执行（一次性设置）：
   ```bash
   chmod +x start.sh
   ```
2. 双击 `start.sh` 文件或从终端运行：
   ```bash
   ./start.sh
   ```

这些脚本将：
1. 构建 Web 应用
2. 启动后端服务器和前端应用
3. 在默认浏览器中打开应用

#### 手动启动

1. 启动服务器：
   ```bash
   node server.js
   ```

2. 在另一个终端中，启动前端开发服务器：
   ```bash
   cd lanshare
   npm run dev
   ```

### 访问应用

启动后，应用将在以下地址可用：

- **本地访问**：[http://localhost:3001](http://localhost:3001)
- **局域网访问**：应用启动时会显示局域网访问 URL

### 共享文件

1. 将文件拖放到上传区域，或点击选择文件
2. 文件将自动上传并生成可共享链接
3. 与局域网内的任何人共享链接或二维码
4. 他们可以通过在浏览器中打开链接来访问文件

### 清理

点击页面底部的"清理上传目录"按钮，删除所有共享文件。

## 使用的技术

- **后端**：Node.js 与 Koa.js
- **前端**：React 与 TypeScript 和 Vite
- **文件处理**：express-fileupload
- **二维码生成**：qrcode

## 许可证

[MIT 许可证](LICENSE)

## 贡献

欢迎贡献！请随时提交 Pull Request。
