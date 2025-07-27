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
            <div
              className={`real-wheel ${isSpinning ? 'spinning' : ''}`}
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              {students.map((student, index) => {
                const sectionAngle = 360 / students.length;
                const rotation = index * sectionAngle;
                const colors = ['#667eea', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9'];
                return (
                  <div
                    key={student.id}
                    className="wheel-section"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      background: `conic-gradient(from 0deg, ${colors[index % colors.length]} 0deg, ${colors[index % colors.length]} ${sectionAngle}deg, transparent ${sectionAngle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((sectionAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((sectionAngle * Math.PI) / 180)}%)`
                    }}
                  >
                    <div
                      className="section-content"
                      style={{
                        transform: `rotate(${sectionAngle / 2}deg) translateY(-80px)`,
                      }}
                    >
                      <div className="student-avatar">{student.name.charAt(0)}</div>
                      <div className="student-name">{student.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="wheel-center-dot"></div>
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
