import ip from 'ip';

// 获取本地 IP 地址
export const getLocalIP = () => {
  return ip.address();
};

// 生成下载 URL
export const generateDownloadUrl = (fileName: string) => {
  const localIP = getLocalIP();
  const PORT = process.env.PORT || '3001';
  
  // 对文件名进行 URL 编码
  const encodedFileName = encodeURIComponent(fileName);
  
  return {
    downloadUrl: `http://${localIP}:${PORT}/uploads/${encodedFileName}`,
    encodedFileName
  };
};
