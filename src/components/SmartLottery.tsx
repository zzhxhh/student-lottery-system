import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, LotteryState } from '../types';

interface SmartLotteryProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onRecordAnswer: (studentId: string, isCorrect: boolean, questionType?: string) => void;
}

export const SmartLottery: React.FC<SmartLotteryProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onRecordAnswer
}) => {
  const [lotteryState, setLotteryState] = useState<LotteryState>({
    isSpinning: false,
    currentIndex: 0,
    finalStudent: null,
    showResult: false,
    spinSpeed: 100,
    spinCount: 0
  });

  const [questionType, setQuestionType] = useState<string>('课堂问题');

  // 重置抽奖状态
  const resetLottery = useCallback(() => {
    setLotteryState({
      isSpinning: false,
      currentIndex: 0,
      finalStudent: null,
      showResult: false,
      spinSpeed: 100,
      spinCount: 0
    });
  }, []);

  // 开始智能抽取
  const startLottery = useCallback(() => {
    if (students.length === 0) {
      alert('请先添加学生！');
      return;
    }

    if (lotteryState.isSpinning) return;

    resetLottery();
    
    // 随机选择最终学生
    const finalIndex = Math.floor(Math.random() * students.length);
    const finalStudent = students[finalIndex];

    setLotteryState(prev => ({
      ...prev,
      isSpinning: true,
      finalStudent
    }));

    // 开始滚动动画
    let currentIdx = 0;
    let speed = 50;
    let totalSpins = 0;
    const maxSpins = 30 + Math.floor(Math.random() * 20);

    const spinInterval = setInterval(() => {
      currentIdx = (currentIdx + 1) % students.length;
      totalSpins++;

      setLotteryState(prev => ({
        ...prev,
        currentIndex: currentIdx,
        spinSpeed: speed,
        spinCount: totalSpins
      }));

      if (totalSpins > maxSpins * 0.7) {
        speed += 20;
      }

      if (totalSpins >= maxSpins && currentIdx === finalIndex) {
        clearInterval(spinInterval);
        
        setTimeout(() => {
          setLotteryState(prev => ({
            ...prev,
            isSpinning: false,
            showResult: true,
            currentIndex: finalIndex
          }));
          onSelectStudent(finalStudent);
        }, 500);
      }
    }, speed);

  }, [students, lotteryState.isSpinning, resetLottery, onSelectStudent]);

  // 记录答题结果
  const handleAnswerRecord = (isCorrect: boolean) => {
    if (lotteryState.finalStudent) {
      onRecordAnswer(lotteryState.finalStudent.id, isCorrect, questionType);
      resetLottery();
    }
  };

  // 空状态
  if (students.length === 0) {
    return (
      <div className="smart-lottery">
        <div className="empty-state">
          <motion.div 
            className="empty-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎯
          </motion.div>
          <h2>智能学生抽取</h2>
          <p>请先在"学生管理"中添加学生，然后回来进行智能抽取</p>
        </div>
      </div>
    );
  }

  const currentStudent = students[lotteryState.currentIndex];

  return (
    <div className="smart-lottery">
      <div className="lottery-header">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          🎯 智能学生抽取
        </motion.h2>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          使用先进算法确保公平随机抽取
        </motion.p>
      </div>

      <div className="lottery-main">
        {/* 学生展示区 */}
        <motion.div 
          className="student-display"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`student-showcase ${lotteryState.isSpinning ? 'spinning' : ''}`}>
            <motion.div 
              className="student-avatar-large"
              animate={lotteryState.isSpinning ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 0.5, repeat: lotteryState.isSpinning ? Infinity : 0 }}
            >
              <img 
                src={currentStudent?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStudent?.name}`}
                alt={currentStudent?.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="%23667eea"/><text x="100" y="110" text-anchor="middle" fill="white" font-size="60" font-weight="bold">${currentStudent?.name?.charAt(0) || '?'}</text></svg>`;
                }}
              />
            </motion.div>
            
            <div className="student-info">
              <h3>{currentStudent?.name || '准备中...'}</h3>
              <div className="student-stats">
                <div className="stat">
                  <span className="stat-label">正确率</span>
                  <span className="stat-value">
                    {currentStudent?.totalAnswers > 0 
                      ? Math.round((currentStudent.correctAnswers / currentStudent.totalAnswers) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">答题数</span>
                  <span className="stat-value">{currentStudent?.totalAnswers || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">连击</span>
                  <span className="stat-value">{currentStudent?.streak || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 滚动指示器 */}
          {lotteryState.isSpinning && (
            <motion.div 
              className="spin-indicator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="spin-text">正在抽取中...</div>
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min((lotteryState.spinCount / 40) * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="spin-count">第 {lotteryState.spinCount} 次</div>
            </motion.div>
          )}
        </motion.div>

        {/* 控制按钮 */}
        <div className="lottery-controls">
          <motion.button
            className={`lottery-btn primary ${lotteryState.isSpinning ? 'spinning' : ''}`}
            onClick={startLottery}
            disabled={lotteryState.isSpinning}
            whileHover={{ scale: lotteryState.isSpinning ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-icon">
              {lotteryState.isSpinning ? '🎲' : '🎯'}
            </span>
            <span className="btn-text">
              {lotteryState.isSpinning ? '抽取中...' : '开始抽取'}
            </span>
          </motion.button>

          {lotteryState.showResult && (
            <motion.button
              className="lottery-btn secondary"
              onClick={resetLottery}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">🔄</span>
              <span className="btn-text">重新抽取</span>
            </motion.button>
          )}
        </div>

        {/* 结果显示和答题记录 */}
        <AnimatePresence>
          {lotteryState.showResult && lotteryState.finalStudent && (
            <motion.div 
              className="result-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="result-header">
                <motion.div 
                  className="result-icon"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎉
                </motion.div>
                <h3>抽取完成！</h3>
                <p>请记录 <strong>{lotteryState.finalStudent.name}</strong> 的答题结果</p>
              </div>

              <div className="question-type-selector">
                <label htmlFor="questionType">题目类型：</label>
                <select 
                  id="questionType"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="课堂问题">课堂问题</option>
                  <option value="基础知识">基础知识</option>
                  <option value="应用题">应用题</option>
                  <option value="思考题">思考题</option>
                  <option value="复习题">复习题</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div className="answer-buttons">
                <motion.button
                  className="answer-btn correct"
                  onClick={() => handleAnswerRecord(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">✅</span>
                  <span className="btn-text">回答正确</span>
                </motion.button>
                <motion.button
                  className="answer-btn incorrect"
                  onClick={() => handleAnswerRecord(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">❌</span>
                  <span className="btn-text">回答错误</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .smart-lottery {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 2rem;
        }

        .empty-state h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .lottery-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .lottery-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .lottery-main {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          color: #374151;
        }

        .student-display {
          text-align: center;
          margin-bottom: 2rem;
        }

        .student-showcase {
          margin-bottom: 2rem;
        }

        .student-avatar-large {
          width: 200px;
          height: 200px;
          margin: 0 auto 2rem;
          border-radius: 50%;
          overflow: hidden;
          background: #f3f4f6;
          border: 4px solid #667eea;
        }

        .student-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .student-info h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #374151;
        }

        .student-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .stat {
          text-align: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 1rem;
          min-width: 80px;
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #667eea;
        }

        .spin-indicator {
          background: rgba(102, 126, 234, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .spin-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(102, 126, 234, 0.2);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 3px;
        }

        .spin-count {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .lottery-controls {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .lottery-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
          justify-content: center;
        }

        .lottery-btn.primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .lottery-btn.secondary {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: 2px solid rgba(102, 126, 234, 0.2);
        }

        .lottery-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 1.3rem;
        }

        .result-section {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(69, 160, 73, 0.1));
          border-radius: 1.5rem;
          padding: 2rem;
          margin-top: 2rem;
          border: 1px solid rgba(76, 175, 80, 0.2);
        }

        .result-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .result-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .result-header h3 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .question-type-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
        }

        .question-type-selector select {
          padding: 0.5rem 1rem;
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 0.5rem;
          background: white;
          font-size: 1rem;
        }

        .answer-buttons {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .answer-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
          justify-content: center;
        }

        .answer-btn.correct {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
        }

        .answer-btn.incorrect {
          background: linear-gradient(135deg, #F44336, #d32f2f);
          color: white;
          box-shadow: 0 8px 25px rgba(244, 67, 54, 0.4);
        }

        @media (max-width: 768px) {
          .smart-lottery {
            padding: 1rem;
          }

          .lottery-main {
            padding: 2rem;
          }

          .student-avatar-large {
            width: 150px;
            height: 150px;
          }

          .student-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .lottery-controls {
            flex-direction: column;
            align-items: center;
          }

          .answer-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};
