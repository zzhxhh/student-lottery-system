import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, UltimatePrizeConfig } from '../types';
import {
  generateProbabilityResult,
  calculateTargetAngle,
  calculateTotalRotation,
  validateResult,
  formatProbability
} from '../utils/probability';
import { ANIMATION_CONFIG } from '../constants/config';

interface UltimatePrizeProps {
  students: Student[];
  prizeConfig: UltimatePrizeConfig;
  currentProbability: number;
  totalCorrectAnswers: number;
  onUpdateConfig: (config: UltimatePrizeConfig) => void;
}

type DrawPhase = 'idle' | 'spinning' | 'result';

export const UltimatePrize: React.FC<UltimatePrizeProps> = ({
  students,
  prizeConfig,
  currentProbability,
  totalCorrectAnswers
}) => {
  const [phase, setPhase] = useState<DrawPhase>('idle');
  const [isWinner, setIsWinner] = useState(false);
  const [rotation, setRotation] = useState(0);

  // 开始抽奖 - 使用优化的概率算法
  const startDraw = () => {
    if (students.length === 0) {
      alert('请先添加学生！');
      return;
    }

    setPhase('spinning');

    try {
      // 1. 根据概率决定结果
      const isWin = generateProbabilityResult(currentProbability);

      // 2. 计算目标停止角度
      const targetAngle = calculateTargetAngle(currentProbability, isWin);

      // 3. 计算总旋转角度
      const totalRotation = calculateTotalRotation(
        targetAngle,
        ANIMATION_CONFIG.wheel.minSpins,
        ANIMATION_CONFIG.wheel.maxSpins
      );

      setRotation(totalRotation);

      // 4. 显示结果
      setTimeout(() => {
        // 验证结果准确性
        const validation = validateResult(totalRotation, isWin, currentProbability);

        if (!validation.isValid) {
          console.warn('抽奖结果验证失败！', {
            expected: isWin,
            pointerAngle: validation.pointerAngle,
            winZone: `0°-${validation.winZoneEnd.toFixed(1)}°`
          });
        }

        console.log(`概率: ${formatProbability(currentProbability)}, 结果: ${isWin ? '中奖' : '未中奖'}, 指针: ${validation.pointerAngle.toFixed(1)}°`);

        setIsWinner(isWin);
        setPhase('result');
      }, ANIMATION_CONFIG.wheel.duration);

    } catch (error) {
      console.error('抽奖过程出错:', error);
      setPhase('idle');
      alert('抽奖出现错误，请重试！');
    }
  };

  // 重置抽奖
  const resetDraw = () => {
    setPhase('idle');
    setIsWinner(false);
    setRotation(0);
  };

  if (students.length === 0) {
    return (
      <div className="ultimate-prize">
        <motion.div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h2>终极大奖</h2>
          <p>请先添加学生并进行答题</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="ultimate-prize">
      <motion.div 
        className="prize-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2
          animate={{
            textShadow: phase === 'spinning' 
              ? ['0 0 10px #FFD700', '0 0 20px #FFD700', '0 0 10px #FFD700']
              : '0 0 5px rgba(255, 215, 0, 0.3)'
          }}
          transition={{ duration: 1, repeat: phase === 'spinning' ? Infinity : 0 }}
        >
          🏆 终极大奖
        </motion.h2>
        
        {/* 自定义转盘 */}
        <div className="wheel-section">
          <div className="wheel-container">
            <motion.div
              className="spin-wheel"
              style={{
                background: `conic-gradient(from 0deg, #4CAF50 0deg, #4CAF50 ${currentProbability * 360}deg, #FF5722 ${currentProbability * 360}deg, #FF5722 360deg)`
              }}
              animate={{ rotate: rotation }}
              transition={{
                duration: phase === 'spinning' ? 3 : 0,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* 中心点 */}
              <div className="wheel-center">
                <div className="probability-display">
                  {Math.round(currentProbability * 100)}%
                </div>
              </div>

              {/* 标签 */}
              <div className="wheel-labels">
                <div className="win-label">中奖</div>
                <div className="lose-label">再试试</div>
              </div>
            </motion.div>
            
            {/* 指针 */}
            <div className="wheel-pointer">▼</div>
          </div>
          
          {/* 抽奖按钮 */}
          {phase === 'idle' && (
            <motion.button
              className="spin-button"
              onClick={startDraw}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎯 开始抽奖
            </motion.button>
          )}
          
          {/* 状态提示 */}
          {phase === 'spinning' && (
            <motion.p 
              className="status-text"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🎲 抽奖进行中...
            </motion.p>
          )}
          
          {/* 统计信息 */}
          <div className="stats-row">
            <div className="stat">
              <span className="stat-value">{totalCorrectAnswers}</span>
              <span className="stat-label">答对题数</span>
            </div>
            <div className="stat">
              <span className="stat-value">{Math.round(currentProbability * 100)}%</span>
              <span className="stat-label">中奖概率</span>
            </div>
          </div>
        </div>

        {/* 结果显示 */}
        <AnimatePresence>
          {phase === 'result' && (
            <motion.div 
              className={`result-display ${isWinner ? 'winner' : 'loser'}`}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div 
                className="result-icon"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  rotate: isWinner ? [0, 360] : 0
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.2,
                  rotate: { duration: 1, delay: 0.5 }
                }}
              >
                {isWinner ? '🎉' : '😔'}
              </motion.div>
              
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isWinner ? '🎊 恭喜中奖！' : '😢 很遗憾'}
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {isWinner ? '获得终极大奖！' : '继续努力答题提高概率吧！'}
              </motion.p>
              
              <motion.button 
                className="retry-btn"
                onClick={resetDraw}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 再次抽奖
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .ultimate-prize {
          max-width: 700px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
          text-align: center;
          background: radial-gradient(circle at center, rgba(102, 126, 234, 0.1), transparent);
        }

        .empty-state {
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 2rem;
          opacity: 0.7;
        }

        .empty-state h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: white;
        }

        .prize-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          color: #374151;
          position: relative;
          overflow: hidden;
        }

        .prize-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          animation: rotate 10s linear infinite;
          z-index: -1;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .prize-container h2 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #374151;
          font-weight: bold;
        }

        .wheel-section {
          margin: 2rem 0;
        }

        .wheel-container {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 0 auto 2rem;
        }

        .spin-wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          border: 4px solid #FFD700;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
          overflow: hidden;
        }

        .wheel-labels {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .win-label, .lose-label {
          position: absolute;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
        }

        .win-label {
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
        }

        .lose-label {
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
        }

        .wheel-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
          z-index: 10;
        }

        .probability-display {
          font-size: 1.2rem;
          font-weight: bold;
          color: #374151;
        }

        .wheel-pointer {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 2.5rem;
          color: #FF0000;
          z-index: 15;
          text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .spin-button {
          padding: 1.2rem 2.5rem;
          font-size: 1.2rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          margin: 1rem 0;
        }

        .spin-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
        }

        .status-text {
          font-size: 1.2rem;
          font-weight: 600;
          color: #667eea;
          margin: 1rem 0;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 2rem 0;
        }

        .stat {
          text-align: center;
          padding: 1rem;
          border-radius: 1rem;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 500;
        }

        .result-display {
          margin-top: 2rem;
          padding: 3rem;
          border-radius: 2rem;
          text-align: center;
        }

        .result-display.winner {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.1));
          border: 2px solid rgba(76, 175, 80, 0.5);
          box-shadow: 0 0 30px rgba(76, 175, 80, 0.3);
        }

        .result-display.loser {
          background: linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(107, 114, 128, 0.1));
          border: 2px solid rgba(107, 114, 128, 0.3);
          box-shadow: 0 0 20px rgba(107, 114, 128, 0.2);
        }

        .result-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
        }

        .result-display h3 {
          font-size: 2.2rem;
          margin-bottom: 1rem;
          color: #374151;
          font-weight: bold;
        }

        .result-display p {
          font-size: 1.3rem;
          color: #6b7280;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .retry-btn {
          padding: 1.2rem 2.5rem;
          font-size: 1.2rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .ultimate-prize {
            padding: 1rem;
          }

          .prize-container {
            padding: 2rem;
          }

          .wheel-container {
            width: 250px;
            height: 250px;
          }

          .stats-row {
            gap: 2rem;
            flex-direction: column;
            align-items: center;
          }

          .stat {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
};
