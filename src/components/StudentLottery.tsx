import React, { useState } from 'react';
import { Student } from '../App';
import './StudentLottery.css';

interface StudentLotteryProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

const StudentLottery: React.FC<StudentLotteryProps> = ({
  students,
  onSelectStudent
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startLottery = () => {
    if (students.length === 0) {
      alert('请先添加学生！');
      return;
    }

    setIsSpinning(true);
    setSelectedStudent(null);

    // 随机选择最终结果
    const finalIndex = Math.floor(Math.random() * students.length);
    
    // 动画效果：快速滚动然后逐渐减速
    let currentSpeed = 50;
    let currentIdx = 0;
    let totalSpins = 0;
    const maxSpins = 30 + Math.floor(Math.random() * 20); // 30-50次旋转

    const spinInterval = setInterval(() => {
      currentIdx = (currentIdx + 1) % students.length;
      setCurrentIndex(currentIdx);
      totalSpins++;

      // 逐渐减速
      if (totalSpins > maxSpins * 0.7) {
        currentSpeed += 20;
      }

      // 停止条件：达到最大旋转次数且当前索引是目标索引
      if (totalSpins >= maxSpins && currentIdx === finalIndex) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setSelectedStudent(students[finalIndex]);
        onSelectStudent(students[finalIndex]);
      }
    }, currentSpeed);

    // 清理定时器
    setTimeout(() => {
      clearInterval(spinInterval);
    }, (maxSpins + 10) * currentSpeed);
  };

  const resetLottery = () => {
    setSelectedStudent(null);
    setCurrentIndex(0);
    setIsSpinning(false);
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
          <div className={`student-wheel ${isSpinning ? 'spinning' : ''}`}>
            <div className="wheel-center">
              <div className="current-student">
                {students[currentIndex] && (
                  <>
                    <div className="student-avatar-large">
                      {students[currentIndex].name.charAt(0)}
                    </div>
                    <div className="student-name-large">
                      {students[currentIndex].name}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="wheel-students">
              {students.map((student, index) => (
                <div
                  key={student.id}
                  className={`wheel-student ${index === currentIndex ? 'active' : ''}`}
                  style={{
                    transform: `rotate(${(360 / students.length) * index}deg) translateY(-120px)`,
                  }}
                >
                  <div 
                    className="wheel-student-content"
                    style={{
                      transform: `rotate(${-(360 / students.length) * index}deg)`,
                    }}
                  >
                    {student.name.charAt(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedStudent && !isSpinning && (
          <div className="lottery-result">
            <div className="result-animation">
              <h3>🎉 抽取结果</h3>
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
