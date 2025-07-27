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

    // 改进的动画效果：使用递归setTimeout实现平滑减速
    let currentIdx = 0;
    let spinCount = 0;
    const totalSpins = 40 + Math.floor(Math.random() * 30); // 40-70次旋转
    const baseSpeed = 50; // 基础速度

    const animateStep = () => {
      currentIdx = (currentIdx + 1) % students.length;
      setCurrentIndex(currentIdx);
      spinCount++;

      // 计算当前速度（逐渐减速）
      const progress = spinCount / totalSpins;
      const speedMultiplier = progress > 0.7 ? Math.pow((1 - progress) / 0.3, 0.5) : 1;
      const currentSpeed = baseSpeed + (200 * (1 - speedMultiplier));

      // 检查是否应该停止
      if (spinCount >= totalSpins && currentIdx === finalIndex) {
        // 最终停止
        setTimeout(() => {
          setIsSpinning(false);
          setSelectedStudent(students[finalIndex]);
          onSelectStudent(students[finalIndex]);
        }, 500); // 短暂延迟显示结果
      } else if (spinCount < totalSpins + students.length) {
        // 继续动画
        setTimeout(animateStep, currentSpeed);
      } else {
        // 强制停止（防止无限循环）
        setIsSpinning(false);
        setSelectedStudent(students[finalIndex]);
        onSelectStudent(students[finalIndex]);
      }
    };

    // 开始动画
    animateStep();
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
