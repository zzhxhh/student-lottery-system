import React, { useState } from 'react';
import { Student } from '../App';
import './AnswerTracker.css';

interface AnswerTrackerProps {
  students: Student[];
  selectedStudent: Student | null;
  onUpdateAnswer: (studentId: string, isCorrect: boolean) => void;
}

const AnswerTracker: React.FC<AnswerTrackerProps> = ({
  students,
  selectedStudent,
  onUpdateAnswer
}) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(selectedStudent);

  const handleAnswerUpdate = (isCorrect: boolean) => {
    if (currentStudent) {
      onUpdateAnswer(currentStudent.id, isCorrect);
      // 更新本地状态以反映变化
      const updatedStudent = {
        ...currentStudent,
        correctAnswers: currentStudent.correctAnswers + (isCorrect ? 1 : 0),
        totalAnswers: currentStudent.totalAnswers + 1
      };
      setCurrentStudent(updatedStudent);
    }
  };

  const getAccuracy = (student: Student) => {
    return student.totalAnswers > 0 
      ? Math.round((student.correctAnswers / student.totalAnswers) * 100)
      : 0;
  };

  const getGradeColor = (accuracy: number) => {
    if (accuracy >= 90) return '#4CAF50';
    if (accuracy >= 80) return '#8BC34A';
    if (accuracy >= 70) return '#FFC107';
    if (accuracy >= 60) return '#FF9800';
    return '#F44336';
  };

  if (students.length === 0) {
    return (
      <div className="answer-tracker">
        <div className="card">
          <div className="empty-tracker">
            <div className="empty-icon">📊</div>
            <h2>答题记录</h2>
            <p>请先添加学生才能记录答题情况</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="answer-tracker">
      <div className="card">
        <div className="tracker-header">
          <h2>📊 答题记录</h2>
          <p>选择学生并记录其答题情况</p>
        </div>

        <div className="tracker-content">
          <div className="student-selector">
            <h3>选择学生</h3>
            <div className="students-list">
              {students.map(student => (
                <div
                  key={student.id}
                  className={`student-item ${currentStudent?.id === student.id ? 'selected' : ''}`}
                  onClick={() => setCurrentStudent(student)}
                >
                  <div className="student-avatar-small">
                    {student.name.charAt(0)}
                  </div>
                  <div className="student-details">
                    <div className="student-name">{student.name}</div>
                    <div className="student-progress">
                      <span className="accuracy" style={{ color: getGradeColor(getAccuracy(student)) }}>
                        {getAccuracy(student)}%
                      </span>
                      <span className="count">({student.correctAnswers}/{student.totalAnswers})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentStudent && (
            <div className="answer-section">
              <div className="current-student-info">
                <div className="student-avatar-large">
                  {currentStudent.name.charAt(0)}
                </div>
                <div className="student-stats">
                  <h3>{currentStudent.name}</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value correct">{currentStudent.correctAnswers}</div>
                      <div className="stat-label">正确</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value wrong">{currentStudent.totalAnswers - currentStudent.correctAnswers}</div>
                      <div className="stat-label">错误</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value total">{currentStudent.totalAnswers}</div>
                      <div className="stat-label">总计</div>
                    </div>
                    <div className="stat-item">
                      <div 
                        className="stat-value accuracy"
                        style={{ color: getGradeColor(getAccuracy(currentStudent)) }}
                      >
                        {getAccuracy(currentStudent)}%
                      </div>
                      <div className="stat-label">正确率</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="answer-buttons">
                <h4>记录答题结果</h4>
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
          )}
        </div>

        <div className="tracker-summary">
          <h3>班级统计</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <div className="summary-value">{students.length}</div>
              <div className="summary-label">总学生数</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">
                {students.reduce((sum, s) => sum + s.totalAnswers, 0)}
              </div>
              <div className="summary-label">总答题数</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">
                {students.reduce((sum, s) => sum + s.correctAnswers, 0)}
              </div>
              <div className="summary-label">总正确数</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">
                {students.length > 0 
                  ? Math.round(
                      students.reduce((acc, s) => 
                        acc + (s.totalAnswers > 0 ? s.correctAnswers / s.totalAnswers : 0), 0
                      ) / students.length * 100
                    )
                  : 0}%
              </div>
              <div className="summary-label">平均正确率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerTracker;
