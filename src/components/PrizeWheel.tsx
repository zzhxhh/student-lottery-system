import React, { useState } from 'react';
import { Student, Prize } from '../App';
import './PrizeWheel.css';

interface PrizeWheelProps {
  students: Student[];
  prizes: Prize[];
  selectedStudent: Student | null;
}

const PrizeWheel: React.FC<PrizeWheelProps> = ({
  students,
  prizes,
  selectedStudent
}) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(selectedStudent);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [rotation, setRotation] = useState(0);

  const calculateProbabilities = (student: Student | null) => {
    if (!student) return prizes.map(p => p.baseProbability);
    
    return prizes.map(prize => {
      const bonus = student.correctAnswers * prize.bonusPerCorrect;
      return Math.min(prize.baseProbability + bonus, 1); // 最大概率不超过100%
    });
  };

  const normalizeProbabilities = (probabilities: number[]) => {
    const sum = probabilities.reduce((acc, p) => acc + p, 0);
    return probabilities.map(p => p / sum);
  };

  const spinWheel = () => {
    if (!currentStudent) {
      alert('请先选择一个学生！');
      return;
    }

    setIsSpinning(true);
    setResult(null);

    // 计算概率
    const rawProbabilities = calculateProbabilities(currentStudent);
    const normalizedProbabilities = normalizeProbabilities(rawProbabilities);

    // 根据概率选择奖项
    const random = Math.random();
    let cumulative = 0;
    let selectedPrizeIndex = 0;

    for (let i = 0; i < normalizedProbabilities.length; i++) {
      cumulative += normalizedProbabilities[i];
      if (random <= cumulative) {
        selectedPrizeIndex = i;
        break;
      }
    }

    // 计算转盘应该停止的角度
    const sectionAngle = 360 / prizes.length;
    const targetAngle = selectedPrizeIndex * sectionAngle + (sectionAngle / 2);
    const spins = 5 + Math.random() * 5; // 5-10圈
    const finalRotation = spins * 360 + targetAngle;

    setRotation(finalRotation);

    // 动画结束后显示结果
    setTimeout(() => {
      setIsSpinning(false);
      setResult(prizes[selectedPrizeIndex]);
    }, 3000);
  };

  const resetWheel = () => {
    setResult(null);
    setRotation(0);
  };

  const getWheelColors = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors.slice(0, prizes.length);
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

  const colors = getWheelColors();
  const sectionAngle = 360 / prizes.length;

  return (
    <div className="prize-wheel">
      <div className="card">
        <div className="wheel-header">
          <h2>🎡 终极大转盘</h2>
          <p>选择学生，转动转盘获得奖励！答题越多，中奖概率越高！</p>
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

          <div className="wheel-container">
            <div className="wheel-wrapper">
              <div 
                className={`wheel ${isSpinning ? 'spinning' : ''}`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {prizes.map((prize, index) => (
                  <div
                    key={prize.id}
                    className="wheel-section"
                    style={{
                      transform: `rotate(${index * sectionAngle}deg)`,
                      backgroundColor: colors[index],
                    }}
                  >
                    <div 
                      className="section-content"
                      style={{
                        transform: `rotate(${sectionAngle / 2}deg)`,
                      }}
                    >
                      <span className="prize-name">{prize.name}</span>
                      <span className="prize-probability">
                        {currentStudent 
                          ? Math.round(calculateProbabilities(currentStudent)[index] * 100)
                          : Math.round(prize.baseProbability * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="wheel-pointer">▼</div>
              <div className="wheel-center">
                <button
                  className={`spin-button ${isSpinning ? 'spinning' : ''}`}
                  onClick={spinWheel}
                  disabled={isSpinning || !currentStudent}
                >
                  {isSpinning ? '🎡' : '🎯'}
                </button>
              </div>
            </div>
          </div>

          {result && !isSpinning && (
            <div className="wheel-result">
              <div className="result-card">
                <h3>🎉 恭喜获得</h3>
                <div className="prize-result">
                  <div className="prize-icon">🏆</div>
                  <div className="prize-info">
                    <h2>{result.name}</h2>
                    <p>学生: {currentStudent?.name}</p>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={resetWheel}>
                  🔄 再次转动
                </button>
              </div>
            </div>
          )}

          {currentStudent && (
            <div className="probability-display">
              <h4>当前概率分布</h4>
              <div className="probability-list">
                {prizes.map((prize, index) => {
                  const probability = calculateProbabilities(currentStudent)[index];
                  return (
                    <div key={prize.id} className="probability-item">
                      <span className="prize-name">{prize.name}</span>
                      <div className="probability-bar">
                        <div 
                          className="probability-fill"
                          style={{ 
                            width: `${probability * 100}%`,
                            backgroundColor: colors[index]
                          }}
                        />
                      </div>
                      <span className="probability-text">
                        {Math.round(probability * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="bonus-info">
                <p>💡 提示: 每答对一题，各奖项概率会相应增加！</p>
                <p>📊 {currentStudent.name} 已答对 {currentStudent.correctAnswers} 题</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizeWheel;
