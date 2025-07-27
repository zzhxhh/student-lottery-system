// 核心数据类型定义

export interface Student {
  id: string;
  name: string;
  correctAnswers: number;
  totalAnswers: number;
  streak: number; // 连续答对次数
  lastAnswerTime?: Date;
  avatar?: string;
}

export interface AnswerRecord {
  id: string;
  studentId: string;
  studentName: string;
  isCorrect: boolean;
  timestamp: Date;
  questionType?: string;
}

export interface UltimatePrizeConfig {
  name: string;
  description: string;
  baseProbability: number; // 基础概率 (0-1)
  bonusPerCorrect: number; // 每答对一题增加的概率
  maxProbability: number; // 最大概率限制
  icon: string;
}

export interface LotteryResult {
  student: Student;
  timestamp: Date;
  isUltimateWin?: boolean;
}

export type ViewType = 'students' | 'lottery' | 'ultimate' | 'stats';

export interface AppState {
  students: Student[];
  answerRecords: AnswerRecord[];
  ultimatePrize: UltimatePrizeConfig;
  currentView: ViewType;
  selectedStudent: Student | null;
}

// 抽奖状态
export interface LotteryState {
  isSpinning: boolean;
  currentIndex: number;
  finalStudent: Student | null;
  showResult: boolean;
  spinSpeed: number;
  spinCount: number;
}

// 统计数据
export interface Statistics {
  totalStudents: number;
  totalAnswers: number;
  totalCorrectAnswers: number;
  averageAccuracy: number;
  topPerformers: Student[];
  recentActivity: AnswerRecord[];
}
