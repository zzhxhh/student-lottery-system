import React, { useState } from 'react';
import { Student } from '../App';
import './StudentManager.css';

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (name: string) => void;
  onSelectStudent: (student: Student) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onAddStudent,
  onSelectStudent
}) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
      setIsAdding(false);
    }
  };

  const handleBatchAdd = () => {
    const names = prompt('请输入学生姓名，用逗号分隔：');
    if (names) {
      const nameList = names.split(',').map(name => name.trim()).filter(name => name);
      nameList.forEach(name => onAddStudent(name));
    }
  };

  return (
    <div className="student-manager">
      <div className="card">
        <div className="manager-header">
          <h2>👥 学生管理</h2>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setIsAdding(true)}
            >
              ➕ 添加学生
            </button>
            <button 
              className="btn btn-warning"
              onClick={handleBatchAdd}
            >
              📝 批量添加
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="add-student-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="input"
                  placeholder="请输入学生姓名"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  ✅ 确认添加
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    setIsAdding(false);
                    setNewStudentName('');
                  }}
                >
                  ❌ 取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="students-grid">
          {students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>还没有学生</h3>
              <p>点击"添加学生"开始添加学生信息</p>
            </div>
          ) : (
            students.map(student => (
              <div 
                key={student.id} 
                className="student-card"
                onClick={() => onSelectStudent(student)}
              >
                <div className="student-avatar">
                  {student.name.charAt(0)}
                </div>
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <div className="student-stats">
                    <span className="stat">
                      ✅ {student.correctAnswers}
                    </span>
                    <span className="stat">
                      📝 {student.totalAnswers}
                    </span>
                    <span className="stat accuracy">
                      📊 {student.totalAnswers > 0 
                        ? Math.round((student.correctAnswers / student.totalAnswers) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {students.length > 0 && (
          <div className="manager-footer">
            <div className="stats-summary">
              <span>总学生数: <strong>{students.length}</strong></span>
              <span>平均正确率: <strong>
                {students.length > 0 
                  ? Math.round(
                      students.reduce((acc, s) => 
                        acc + (s.totalAnswers > 0 ? s.correctAnswers / s.totalAnswers : 0), 0
                      ) / students.length * 100
                    )
                  : 0}%
              </strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManager;
