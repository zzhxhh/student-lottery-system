import React, { useState } from 'react';
import { Student } from '../App';
import './PrizeWheel.css';

interface PrizeWheelProps {
  students: Student[];
  selectedStudent: Student | null;
}

const PrizeWheel: React.FC<PrizeWheelProps> = ({
  students,
  selectedStudent
}) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(selectedStudent);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [rotation, setRotation] = useState(0);

  // 终极奖励配置
  const ultimateReward = {
    name: '🎉 终极大奖',
    baseProbability: 0.1, // 基础10%概率
    bonusPerCorrect: 0.02  // 每答对一题增加2%
  };

  const calculateWinProbability = () => {
    // 计算全班总答对题数
    const totalCorrectAnswers = students.reduce((sum, student) => sum + student.correctAnswers, 0);

    // 计算获奖概率，最大不超过90%
    const probability = Math.min(
      ultimateReward.baseProbability + (totalCorrectAnswers * ultimateReward.bonusPerCorrect),
      0.9
    );

    return probability;
  };

  const spinWheel = () => {
    if (!currentStudent) {
      alert('请先选择一个学生！');
      return;
    }

    setIsSpinning(true);
    setResult(null);

    // 计算获奖概率
    const winProbability = calculateWinProbability();
    const random = Math.random();
    const isWin = random < winProbability;

    // 计算转盘旋转角度
    let targetAngle;
    if (isWin) {
      // 中奖区域：0-120度（绿色区域）
      targetAngle = Math.random() * 120;
    } else {
      // 未中奖区域：120-360度（红色区域）
      targetAngle = 120 + Math.random() * 240;
    }

    const spins = 8 + Math.random() * 4; // 8-12圈
    const finalRotation = spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(isWin ? 'win' : 'lose');
    }, 4000);
  };

  const resetWheel = () => {
    setResult(null);
    setRotation(0);
  };



  if (students.length === 0) {
    return (
      <div className="prize-wheel">
        <div className="card">
          <div className="empty-wheel">
            <div className="empty-icon">🎡</div>
            <h2>终极大转盘</h2>
            <p>请先添加学生才能使用大转盘</p>
          </div>
        </div>
      </div>
    );
  }

  const winProbability = calculateWinProbability();
  const totalCorrectAnswers = students.reduce((sum, student) => sum + student.correctAnswers, 0);

  return (
    <div className="prize-wheel">
      <div className="card">
        <div className="wheel-header">
          <h2>🎡 终极大转盘</h2>
          <p>选择学生，转动转盘获得终极奖励！全班答题越多，中奖概率越高！</p>
        </div>

        <div className="wheel-content">
          <div className="student-selector-wheel">
            <h3>选择学生</h3>
            <select 
              value={currentStudent?.id || ''} 
              onChange={(e) => {
                const student = students.find(s => s.id === e.target.value);
                setCurrentStudent(student || null);
              }}
              className="student-select"
            >
              <option value="">请选择学生</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (正确率: {student.totalAnswers > 0 
                    ? Math.round((student.correctAnswers / student.totalAnswers) * 100)
                    : 0}%)
                </option>
              ))}
            </select>
          </div>

          <div className="ultimate-wheel-container">
            <div className="wheel-pointer">▼</div>
            <svg
              className={`ultimate-wheel ${isSpinning ? 'spinning' : ''}`}
              style={{ transform: `rotate(${rotation}deg)` }}
              width="400"
              height="400"
              viewBox="0 0 400 400"
            >
              {/* 中奖区域 (0-120度, 绿色) */}
              <path
                d="M 200 200 L 200 20 A 180 180 0 0 1 356.41 290 Z"
                fill="#4CAF50"
                stroke="#fff"
                strokeWidth="3"
              />

              {/* 未中奖区域 (120-360度, 红色) */}
              <path
                d="M 200 200 L 356.41 290 A 180 180 0 1 1 200 20 Z"
                fill="#F44336"
                stroke="#fff"
                strokeWidth="3"
              />

              {/* 中奖区域文字 */}
              <text
                x="280"
                y="150"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill="white"
                transform="rotate(60 280 150)"
              >
                🎉 中奖
              </text>

              {/* 未中奖区域文字 */}
              <text
                x="200"
                y="320"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill="white"
              >
                😔 未中奖
              </text>

              {/* 中心圆 */}
              <circle
                cx="200"
                cy="200"
                r="40"
                fill="#FFD700"
                stroke="#FFA500"
                strokeWidth="3"
              />

              {/* 中心按钮 */}
              <text
                x="200"
                y="210"
                textAnchor="middle"
                fontSize="20"
                fill="#333"
                className="center-text"
              >
                {isSpinning ? '🎡' : '🎯'}
              </text>
            </svg>

            <button
              className={`ultimate-spin-button ${isSpinning ? 'spinning' : ''}`}
              onClick={spinWheel}
              disabled={isSpinning || !currentStudent}
            >
              {isSpinning ? '转动中...' : '开始转动'}
            </button>
          </div>

          {result && !isSpinning && (
            <div className="wheel-result">
              <div className={`result-card ${result === 'win' ? 'win' : 'lose'}`}>
                <h3>{result === 'win' ? '🎉 恭喜中奖！' : '😔 很遗憾未中奖'}</h3>
                <div className="prize-result">
                  <div className="prize-icon">
                    {result === 'win' ? '🏆' : '💔'}
                  </div>
                  <div className="prize-info">
                    <h2>{result === 'win' ? ultimateReward.name : '下次再来'}</h2>
                    <p>学生: {currentStudent?.name}</p>
                    <p>本次中奖概率: {Math.round(winProbability * 100)}%</p>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={resetWheel}>
                  🔄 再次转动
                </button>
              </div>
            </div>
          )}

          <div className="probability-display">
            <h4>中奖概率信息</h4>
            <div className="ultimate-probability">
              <div className="probability-item">
                <span className="prize-name">🎉 {ultimateReward.name}</span>
                <div className="probability-bar">
                  <div
                    className="probability-fill win"
                    style={{
                      width: `${winProbability * 100}%`
                    }}
                  />
                </div>
                <span className="probability-text">
                  {Math.round(winProbability * 100)}%
                </span>
              </div>
              <div className="probability-item">
                <span className="prize-name">😔 未中奖</span>
                <div className="probability-bar">
                  <div
                    className="probability-fill lose"
                    style={{
                      width: `${(1 - winProbability) * 100}%`
                    }}
                  />
                </div>
                <span className="probability-text">
                  {Math.round((1 - winProbability) * 100)}%
                </span>
              </div>
            </div>
            <div className="bonus-info">
              <p>💡 提示: 全班答对题目越多，中奖概率越高！</p>
              <p>📊 全班已答对 {totalCorrectAnswers} 题</p>
              <p>🎯 基础概率: {Math.round(ultimateReward.baseProbability * 100)}% + 每题奖励: {Math.round(ultimateReward.bonusPerCorrect * 100)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeWheel;
