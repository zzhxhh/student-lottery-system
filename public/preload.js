const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 示例：如果需要与主进程通信
  // sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  // onMessage: (callback) => ipcRenderer.on('message', callback)
  
  // 获取应用版本
  getVersion: () => process.env.npm_package_version || '1.0.0',
  
  // 获取平台信息
  getPlatform: () => process.platform,
  
  // 检查是否为开发模式
  isDev: () => process.env.NODE_ENV === 'development'
});

// 防止在渲染进程中访问Node.js API
window.addEventListener('DOMContentLoaded', () => {
  console.log('我想要放假😭 - 学生抽奖系统已加载');
});
