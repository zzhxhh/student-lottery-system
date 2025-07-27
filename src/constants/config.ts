/**
 * 应用配置常量
 */

// 应用信息
export const APP_CONFIG = {
  name: '我想要放假😭',
  description: '学生抽奖系统',
  version: '1.0.0',
  author: 'Your Name'
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  // 转盘动画
  wheel: {
    minSpins: 5,
    maxSpins: 8,
    duration: 3000, // 3秒
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  
  // 学生列表滚动动画
  lottery: {
    minSpins: 30,
    maxSpins: 50,
    baseSpeed: 50,
    speedIncrease: 20,
    slowdownThreshold: 0.7
  },
  
  // 页面切换动画
  page: {
    duration: 0.3,
    stiffness: 300,
    damping: 30
  }
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  // 终极大奖默认配置
  ultimatePrize: {
    baseProbability: 0.1, // 10%
    bonusPerCorrect: 0.02, // 每答对一题增加2%
    maxProbability: 0.5, // 最大50%
    requiredAnswers: 5 // 至少需要5个正确答案
  },
  
  // 学生管理
  student: {
    maxNameLength: 20,
    avatarSeed: 'avataaars'
  },
  
  // 本地存储键名
  storage: {
    students: 'lottery-students',
    records: 'lottery-records',
    ultimatePrize: 'lottery-ultimate-prize'
  }
} as const;

// 问题类型选项
export const QUESTION_TYPES = [
  '课堂问题',
  '作业检查',
  '知识点复习',
  '随机提问',
  '小测验',
  '讨论发言'
] as const;

// 主题颜色
export const THEME_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
} as const;

// 响应式断点
export const BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
} as const;
