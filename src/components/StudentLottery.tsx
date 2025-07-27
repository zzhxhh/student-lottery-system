import React, { useState } from 'react';
import { Student } from '../App';
import './StudentLottery.css';

interface StudentLotteryProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onUpdateAnswer: (studentId: string, isCorrect: boolean) => void;
}

const StudentLottery: React.FC<StudentLotteryProps> = ({
  students,
  onSelectStudent,
  onUpdateAnswer
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  const startLottery = () => {
    if (students.length === 0) {
      alert('请先添加学生！');
      return;
    }

    setIsSpinning(true);
    setSelectedStudent(null);

    // 随机选择最终结果
    const finalIndex = Math.floor(Math.random() * students.length);

    // 计算转盘应该停止的角度
    const sectionAngle = 360 / students.length;
    const targetAngle = finalIndex * sectionAngle + (sectionAngle / 2);
    const spins = 8 + Math.random() * 6; // 8-14圈
    const finalRotation = wheelRotation + spins * 360 + targetAngle;

    setWheelRotation(finalRotation);

    // 动画结束后显示结果
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedStudent(students[finalIndex]);
      onSelectStudent(students[finalIndex]);
    }, 4000);
  };

  const resetLottery = () => {
    setSelectedStudent(null);
    setIsSpinning(false);
  };

  const handleAnswerUpdate = (isCorrect: boolean) => {
    if (selectedStudent) {
      onUpdateAnswer(selectedStudent.id, isCorrect);
      setSelectedStudent(null); // 重置选中状态
    }
  };

  if (students.length === 0) {
    return (
      <div className="student-lottery">
        <div className="card">
          <div className="empty-lottery">
            <div className="empty-icon">🎲</div>
            <h2>学生抽取</h2>
            <p>请先在"学生管理"中添加学生，然后回来进行抽取</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-lottery">
      <div className="card">
        <div className="lottery-header">
          <h2>🎲 学生抽取</h2>
          <p>点击开始按钮进行随机抽取</p>
        </div>

        <div className="lottery-display">
          <div className="wheel-container">
            <div className="wheel-pointer">▼</div>
            <svg
              className={`wheel-svg ${isSpinning ? 'spinning' : ''}`}
              style={{ transform: `rotate(${wheelRotation}deg)` }}
              width="400"
              height="400"
              viewBox="0 0 400 400"
            >
              {students.map((student, index) => {
                const sectionAngle = 360 / students.length;
                const startAngle = index * sectionAngle;
                const endAngle = (index + 1) * sectionAngle;

                // 计算扇形路径
                const centerX = 200;
                const centerY = 200;
                const radius = 180;

                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = (endAngle * Math.PI) / 180;

                const x1 = centerX + radius * Math.cos(startAngleRad);
                const y1 = centerY + radius * Math.sin(startAngleRad);
                const x2 = centerX + radius * Math.cos(endAngleRad);
                const y2 = centerY + radius * Math.sin(endAngleRad);

                const largeArcFlag = sectionAngle > 180 ? 1 : 0;

                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');

                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];

                // 计算文字位置
                const textAngle = startAngle + sectionAngle / 2;
                const textAngleRad = (textAngle * Math.PI) / 180;
                const textRadius = radius * 0.7;
                const textX = centerX + textRadius * Math.cos(textAngleRad);
                const textY = centerY + textRadius * Math.sin(textAngleRad);

                return (
                  <g key={student.id}>
                    <path
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="#fff"
                      strokeWidth="2"
                      className="wheel-section-svg"
                    />
                    <circle
                      cx={textX}
                      cy={textY}
                      r="25"
                      fill="rgba(255,255,255,0.9)"
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="1"
                    />
                    <text
                      x={textX}
                      y={textY + 6}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill="#333"
                    >
                      {student.name.charAt(0)}
                    </text>
                    <text
                      x={textX}
                      y={textY + 35}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#666"
                      className="student-name-svg"
                    >
                      {student.name.length > 6 ? student.name.substring(0, 6) + '...' : student.name}
                    </text>
                  </g>
                );
              })}

              {/* 中心圆 */}
              <circle
                cx="200"
                cy="200"
                r="30"
                fill="#FFD700"
                stroke="#FFA500"
                strokeWidth="3"
                className="wheel-center-svg"
              />
            </svg>
          </div>
        </div>

        {selectedStudent && !isSpinning && (
          <div className="lottery-result">
            <div className="result-animation">
              <h3>🎉 抽中学生</h3>
              <div className="winner-card">
                <div className="winner-avatar">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="winner-info">
                  <h2>{selectedStudent.name}</h2>
                  <div className="winner-stats">
                    <span>正确率: {selectedStudent.totalAnswers > 0
                      ? Math.round((selectedStudent.correctAnswers / selectedStudent.totalAnswers) * 100)
                      : 0}%</span>
                    <span>答题数: {selectedStudent.totalAnswers}</span>
                  </div>
                </div>
              </div>

              <div className="answer-buttons">
                <h4>📝 记录答题结果</h4>
                <div className="button-group">
                  <button
                    className="btn btn-success answer-btn"
                    onClick={() => handleAnswerUpdate(true)}
                  >
                    ✅ 回答正确
                  </button>
                  <button
                    className="btn btn-danger answer-btn"
                    onClick={() => handleAnswerUpdate(false)}
                  >
                    ❌ 回答错误
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="lottery-controls">
          <button
            className={`btn btn-primary lottery-btn ${isSpinning ? 'spinning' : ''}`}
            onClick={startLottery}
            disabled={isSpinning}
          >
            {isSpinning ? '🎲 抽取中...' : '🎲 开始抽取'}
          </button>
          
          {selectedStudent && !isSpinning && (
            <button
              className="btn btn-warning"
              onClick={resetLottery}
            >
              🔄 重新抽取
            </button>
          )}
        </div>

        <div className="lottery-info">
          <div className="info-item">
            <span className="info-label">参与学生:</span>
            <span className="info-value">{students.length} 人</span>
          </div>
          <div className="info-item">
            <span className="info-label">抽取概率:</span>
            <span className="info-value">每人 {(100 / students.length).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLottery;
