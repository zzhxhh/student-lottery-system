import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, AnswerRecord, UltimatePrizeConfig, ViewType } from './types';
import { Header } from './components/Header';
import { StudentManager } from './components/StudentManager';
import { SmartLottery } from './components/SmartLottery';
import { UltimatePrize } from './components/UltimatePrize';
import { Statistics } from './components/Statistics';
import { LoadingScreen } from './components/LoadingScreen';
import { calculateDynamicProbability } from './utils/probability';
import { DEFAULT_CONFIG } from './constants/config';
import './styles/globals.css';

function App() {
  // 核心状态管理
  const [students, setStudents] = useState<Student[]>([]);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('students');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 终极大奖配置 - 使用默认配置
  const [ultimatePrize, setUltimatePrize] = useState<UltimatePrizeConfig>({
    name: '🏆 终极大奖',
    description: '基于全班答题表现的特殊奖励',
    baseProbability: DEFAULT_CONFIG.ultimatePrize.baseProbability,
    bonusPerCorrect: DEFAULT_CONFIG.ultimatePrize.bonusPerCorrect,
    maxProbability: DEFAULT_CONFIG.ultimatePrize.maxProbability,
    icon: '🏆'
  });

  // 应用初始化
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 模拟加载过程
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 从localStorage加载数据
        const savedStudents = localStorage.getItem(DEFAULT_CONFIG.storage.students);
        const savedRecords = localStorage.getItem(DEFAULT_CONFIG.storage.records);
        const savedPrize = localStorage.getItem(DEFAULT_CONFIG.storage.ultimatePrize);

        if (savedStudents) {
          const parsedStudents = JSON.parse(savedStudents);
          setStudents(parsedStudents);
        }

        if (savedRecords) {
          const parsedRecords = JSON.parse(savedRecords);
          setAnswerRecords(parsedRecords);
        }

        if (savedPrize) {
          const parsedPrize = JSON.parse(savedPrize);
          setUltimatePrize(parsedPrize);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('应用初始化失败:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // 数据持久化
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

  // 学生管理功能
  const addStudent = (name: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name: name.trim(),
      correctAnswers: 0,
      totalAnswers: 0,
      streak: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    saveToLocalStorage(DEFAULT_CONFIG.storage.students, updatedStudents);
  };

  const removeStudent = (studentId: string) => {
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    saveToLocalStorage(DEFAULT_CONFIG.storage.students, updatedStudents);

    // 同时删除相关的答题记录
    const updatedRecords = answerRecords.filter(r => r.studentId !== studentId);
    setAnswerRecords(updatedRecords);
    saveToLocalStorage(DEFAULT_CONFIG.storage.records, updatedRecords);
  };

  const updateStudent = (studentId: string, updates: Partial<Student>) => {
    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, ...updates } : s
    );
    setStudents(updatedStudents);
    saveToLocalStorage(DEFAULT_CONFIG.storage.students, updatedStudents);
  };

  // 答题记录功能
  const recordAnswer = (studentId: string, isCorrect: boolean, questionType?: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // 创建答题记录
    const newRecord: AnswerRecord = {
      id: Date.now().toString(),
      studentId,
      studentName: student.name,
      isCorrect,
      timestamp: new Date(),
      questionType
    };

    // 更新学生数据
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        const newStreak = isCorrect ? s.streak + 1 : 0;
        return {
          ...s,
          correctAnswers: s.correctAnswers + (isCorrect ? 1 : 0),
          totalAnswers: s.totalAnswers + 1,
          lastAnswerTime: new Date(),
          streak: newStreak
        };
      }
      return s;
    });

    const updatedRecords = [...answerRecords, newRecord];

    setStudents(updatedStudents);
    setAnswerRecords(updatedRecords);
    saveToLocalStorage(DEFAULT_CONFIG.storage.students, updatedStudents);
    saveToLocalStorage(DEFAULT_CONFIG.storage.records, updatedRecords);
  };

  // 计算全班总答对题目数
  const getTotalCorrectAnswers = () => {
    return students.reduce((total, student) => total + student.correctAnswers, 0);
  };

  // 计算终极大奖概率 - 使用优化的算法
  const calculateUltimateProbability = () => {
    const totalCorrect = getTotalCorrectAnswers();
    return calculateDynamicProbability(
      ultimatePrize.baseProbability,
      totalCorrect,
      ultimatePrize.bonusPerCorrect,
      ultimatePrize.maxProbability
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        totalStudents={students.length}
        totalCorrectAnswers={getTotalCorrectAnswers()}
        ultimateProbability={calculateUltimateProbability()}
      />

      <main className="app-main">
        <AnimatePresence mode="wait">
          {currentView === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StudentManager
                students={students}
                onAddStudent={addStudent}
                onRemoveStudent={removeStudent}
                onUpdateStudent={updateStudent}
                onSelectStudent={setSelectedStudent}
              />
            </motion.div>
          )}

          {currentView === 'lottery' && (
            <motion.div
              key="lottery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SmartLottery
                students={students}
                selectedStudent={selectedStudent}
                onSelectStudent={setSelectedStudent}
                onRecordAnswer={recordAnswer}
              />
            </motion.div>
          )}

          {currentView === 'ultimate' && (
            <motion.div
              key="ultimate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UltimatePrize
                students={students}
                prizeConfig={ultimatePrize}
                currentProbability={calculateUltimateProbability()}
                totalCorrectAnswers={getTotalCorrectAnswers()}
                onUpdateConfig={setUltimatePrize}
              />
            </motion.div>
          )}

          {currentView === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Statistics
                students={students}
                answerRecords={answerRecords}
                ultimatePrize={ultimatePrize}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
