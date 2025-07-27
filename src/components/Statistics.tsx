import React from 'react';
import { motion } from 'framer-motion';
import { Student, AnswerRecord, UltimatePrizeConfig } from '../types';

interface StatisticsProps {
  students: Student[];
  answerRecords: AnswerRecord[];
  ultimatePrize: UltimatePrizeConfig;
}

export const Statistics: React.FC<StatisticsProps> = ({
  students,
  answerRecords,
  ultimatePrize
}) => {
  const totalAnswers = students.reduce((sum, s) => sum + s.totalAnswers, 0);
  const totalCorrect = students.reduce((sum, s) => sum + s.correctAnswers, 0);
  const averageAccuracy = totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0;

  const topPerformers = [...students]
    .filter(s => s.totalAnswers > 0)
    .sort((a, b) => {
      const aAccuracy = a.correctAnswers / a.totalAnswers;
      const bAccuracy = b.correctAnswers / b.totalAnswers;
      return bAccuracy - aAccuracy;
    })
    .slice(0, 5);

  const recentActivity = [...answerRecords]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="statistics">
      <div className="stats-header">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          📊 数据统计
        </motion.h2>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          查看详细的学习数据和表现分析
        </motion.p>
      </div>

      <div className="stats-content">
        {/* 总体统计 */}
        <motion.div 
          className="overview-stats"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>📈 总体概况</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">参与学生</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-value">{totalAnswers}</div>
              <div className="stat-label">总答题数</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{totalCorrect}</div>
              <div className="stat-label">总答对数</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{averageAccuracy.toFixed(1)}%</div>
              <div className="stat-label">平均正确率</div>
            </div>
          </div>
        </motion.div>

        {/* 排行榜 */}
        <motion.div 
          className="leaderboard"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3>🏆 学习排行榜</h3>
          {topPerformers.length > 0 ? (
            <div className="leaderboard-list">
              {topPerformers.map((student, index) => (
                <div key={student.id} className="leaderboard-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="student-info">
                    <img 
                      src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                      alt={student.name}
                      className="student-avatar"
                    />
                    <div className="student-details">
                      <div className="student-name">{student.name}</div>
                      <div className="student-stats">
                        正确率: {Math.round((student.correctAnswers / student.totalAnswers) * 100)}% 
                        | 答题: {student.totalAnswers}
                      </div>
                    </div>
                  </div>
                  <div className="accuracy-badge">
                    {Math.round((student.correctAnswers / student.totalAnswers) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>暂无答题数据</p>
            </div>
          )}
        </motion.div>

        {/* 最近活动 */}
        <motion.div 
          className="recent-activity"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3>⏰ 最近活动</h3>
          {recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map((record) => (
                <div key={record.id} className="activity-item">
                  <div className={`result-icon ${record.isCorrect ? 'correct' : 'incorrect'}`}>
                    {record.isCorrect ? '✅' : '❌'}
                  </div>
                  <div className="activity-details">
                    <div className="activity-text">
                      <strong>{record.studentName}</strong> 
                      {record.isCorrect ? ' 答对了' : ' 答错了'}
                      {record.questionType && ` "${record.questionType}"`}
                    </div>
                    <div className="activity-time">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">⏰</div>
              <p>暂无活动记录</p>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .statistics {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
        }

        .stats-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .stats-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .stats-content {
          display: grid;
          gap: 2rem;
        }

        .overview-stats,
        .leaderboard,
        .recent-activity {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          color: #374151;
        }

        .overview-stats h3,
        .leaderboard h3,
        .recent-activity h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #374151;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: #f9fafb;
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .leaderboard-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .rank {
          font-size: 1.5rem;
          font-weight: bold;
          color: #667eea;
          min-width: 40px;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .student-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .student-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
        }

        .student-stats {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .accuracy-badge {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
        }

        .result-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-icon.correct {
          background: rgba(76, 175, 80, 0.1);
        }

        .result-icon.incorrect {
          background: rgba(244, 67, 54, 0.1);
        }

        .activity-details {
          flex: 1;
        }

        .activity-text {
          font-size: 1rem;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .statistics {
            padding: 1rem;
          }

          .overview-stats,
          .leaderboard,
          .recent-activity {
            padding: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .leaderboard-item {
            flex-direction: column;
            text-align: center;
          }

          .student-info {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};
