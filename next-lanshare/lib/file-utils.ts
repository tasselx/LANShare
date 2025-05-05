import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

// 获取上传目录的路径
export const getUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  
  // 如果目录不存在，创建它
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  return uploadsDir;
};

// 安全地读取目录内容
export const safeReadDir = (dir: string) => {
  try {
    return fs.readdirSync(dir);
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
};

// 清理上传目录
export const cleanUploads = () => {
  try {
    const uploadsDir = getUploadsDir();
    const files = safeReadDir(uploadsDir);
    let deletedCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${file}`);
        deletedCount++;
      } catch (err) {
        console.error(`Error deleting file ${file}:`, err);
      }
    }

    console.log(`Cleaned up uploads directory. Deleted ${deletedCount} files.`);
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning uploads directory:', error);
    return 0;
  }
};

// 从 FormData 中保存文件
export const saveFileFromFormData = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadsDir = getUploadsDir();
    const filePath = path.join(uploadsDir, file.name);
    
    fs.writeFileSync(filePath, buffer);
    
    return {
      fileName: file.name,
      fileSize: file.size,
      filePath
    };
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};
