import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '../types';

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (name: string) => void;
  onRemoveStudent: (studentId: string) => void;
  onUpdateStudent: (studentId: string, updates: Partial<Student>) => void;
  onSelectStudent: (student: Student) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onAddStudent,
  onRemoveStudent,
  onUpdateStudent,
  onSelectStudent
}) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddStudent = () => {
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddStudent();
    }
  };

  return (
    <div className="student-manager">
      <div className="manager-header">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          👥 学生管理
        </motion.h2>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          添加和管理参与抽奖的学生
        </motion.p>
      </div>

      <div className="add-student-section">
        <motion.div 
          className="add-student-form"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="form-group">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入学生姓名..."
              className="student-input"
              disabled={isAdding}
            />
            <motion.button
              onClick={handleAddStudent}
              disabled={!newStudentName.trim() || isAdding}
              className="add-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAdding ? '添加中...' : '➕ 添加学生'}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="students-section">
        <div className="section-header">
          <h3>学生列表 ({students.length}人)</h3>
          {students.length > 0 && (
            <div className="stats-summary">
              <span>总答题: {students.reduce((sum, s) => sum + s.totalAnswers, 0)}</span>
              <span>总答对: {students.reduce((sum, s) => sum + s.correctAnswers, 0)}</span>
            </div>
          )}
        </div>

        {students.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon">👥</div>
            <h3>还没有学生</h3>
            <p>添加第一个学生开始使用抽奖系统</p>
          </motion.div>
        ) : (
          <motion.div 
            className="students-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence>
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  className="student-card"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  layout
                >
                  <div className="student-avatar">
                    <img 
                      src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                      alt={student.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23667eea"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="30" font-weight="bold">${student.name.charAt(0)}</text></svg>`;
                      }}
                    />
                  </div>
                  
                  <div className="student-info">
                    <h4>{student.name}</h4>
                    <div className="student-stats">
                      <div className="stat">
                        <span className="stat-label">正确率</span>
                        <span className="stat-value">
                          {student.totalAnswers > 0 
                            ? Math.round((student.correctAnswers / student.totalAnswers) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">答题数</span>
                        <span className="stat-value">{student.totalAnswers}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">连击</span>
                        <span className="stat-value">{student.streak}</span>
                      </div>
                    </div>
                  </div>

                  <div className="student-actions">
                    <motion.button
                      onClick={() => onSelectStudent(student)}
                      className="action-btn select"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="选择此学生"
                    >
                      🎯
                    </motion.button>
                    <motion.button
                      onClick={() => onRemoveStudent(student.id)}
                      className="action-btn remove"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="删除学生"
                    >
                      🗑️
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <style>{`
        .student-manager {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .manager-header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }

        .manager-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .manager-header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .add-student-section {
          margin-bottom: 3rem;
        }

        .add-student-form {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .student-input {
          flex: 1;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          background: white;
          transition: all 0.3s ease;
        }

        .student-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .add-button {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .add-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .students-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .section-header h3 {
          font-size: 1.5rem;
          color: #374151;
        }

        .stats-summary {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .student-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          transition: all 0.3s ease;
          position: relative;
        }

        .student-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 0 auto 1rem;
          overflow: hidden;
          background: #f3f4f6;
        }

        .student-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .student-info {
          text-align: center;
          margin-bottom: 1rem;
        }

        .student-info h4 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #374151;
        }

        .student-stats {
          display: flex;
          justify-content: space-around;
          gap: 0.5rem;
        }

        .stat {
          text-align: center;
          padding: 0.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          flex: 1;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          display: block;
          font-size: 1rem;
          font-weight: bold;
          color: #667eea;
        }

        .student-actions {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn.select {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
        }

        .action-btn.remove {
          background: linear-gradient(135deg, #F44336, #d32f2f);
          color: white;
        }

        @media (max-width: 768px) {
          .student-manager {
            padding: 1rem;
          }

          .form-group {
            flex-direction: column;
          }

          .students-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};
