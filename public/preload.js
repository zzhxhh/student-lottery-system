const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 学生数据相关 API
  saveStudents: (students) => ipcRenderer.invoke('save-students', students),
  loadStudents: () => ipcRenderer.invoke('load-students'),
  
  // 奖项配置相关 API
  savePrizes: (prizes) => ipcRenderer.invoke('save-prizes', prizes),
  loadPrizes: () => ipcRenderer.invoke('load-prizes'),
  
  // 答题记录相关 API
  saveAnswerRecords: (records) => ipcRenderer.invoke('save-answer-records', records),
  loadAnswerRecords: () => ipcRenderer.invoke('load-answer-records')
});
