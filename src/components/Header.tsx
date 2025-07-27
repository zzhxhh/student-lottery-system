import React from 'react';
import { motion } from 'framer-motion';
import { ViewType } from '../types';
import './Header.css';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  totalStudents: number;
  totalCorrectAnswers: number;
  ultimateProbability: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  totalStudents,
  totalCorrectAnswers,
  ultimateProbability
}) => {
  const navItems = [
    {
      id: 'students' as ViewType,
      icon: '👥',
      label: '学生管理',
      description: '添加和管理学生信息'
    },
    {
      id: 'lottery' as ViewType,
      icon: '🎯',
      label: '智能抽取',
      description: '随机抽取学生回答问题'
    },
    {
      id: 'ultimate' as ViewType,
      icon: '🏆',
      label: '终极大奖',
      description: '基于答题表现的大奖抽取'
    },
    {
      id: 'stats' as ViewType,
      icon: '📊',
      label: '数据统计',
      description: '查看详细的答题统计'
    }
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo和标题 */}
        <motion.div 
          className="header-brand"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="brand-logo">
            <motion.span
              className="logo-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              😭
            </motion.span>
            <div className="logo-text">
              <h1>我想要放假</h1>
              <p>学生抽奖系统</p>
            </div>
          </div>
        </motion.div>

        {/* 导航菜单 */}
        <nav className="header-nav">
          <div className="nav-items">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
                title={item.description}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {currentView === item.id && (
                  <motion.div 
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* 统计信息 */}
        <motion.div 
          className="header-stats"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <motion.div 
                className="stat-value"
                key={totalStudents}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {totalStudents}
              </motion.div>
              <div className="stat-label">学生</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <motion.div 
                className="stat-value"
                key={totalCorrectAnswers}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {totalCorrectAnswers}
              </motion.div>
              <div className="stat-label">答对</div>
            </div>
          </div>
          
          <div className="stat-item ultimate-stat">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <motion.div 
                className="stat-value"
                key={Math.round(ultimateProbability * 100)}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {Math.round(ultimateProbability * 100)}%
              </motion.div>
              <div className="stat-label">大奖概率</div>
            </div>
            <div className="probability-bar">
              <motion.div 
                className="probability-fill"
                initial={{ width: 0 }}
                animate={{ width: `${ultimateProbability * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

    </header>
  );
};
