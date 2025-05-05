import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { join } from 'path';
import { existsSync, statSync, createReadStream } from 'fs';

// 处理上传文件的访问
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 只处理 /uploads/ 路径下的请求
  if (pathname.startsWith('/uploads/')) {
    const filePath = join(process.cwd(), pathname);
    
    // 检查文件是否存在
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      // 获取文件名
      const fileName = pathname.split('/').pop() || '';
      
      // 设置适当的内容类型
      const contentType = getContentType(fileName);
      
      // 创建响应
      const response = new NextResponse(createReadStream(filePath));
      
      // 设置响应头
      response.headers.set('Content-Type', contentType);
      response.headers.set('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
      
      return response;
    }
  }
  
  // 对于其他请求，继续正常处理
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: '/uploads/:path*',
};

// 根据文件扩展名获取内容类型
function getContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypes: Record<string, string> = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'wav': 'audio/wav',
    'txt': 'text/plain',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}
