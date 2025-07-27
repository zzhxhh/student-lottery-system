import React from 'react';
import { motion } from 'framer-motion';
import './LoadingScreen.css';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <motion.div 
          className="loading-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="logo-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🎯
          </motion.div>
          <h1>智能学生抽奖系统</h1>
          <p>现代化教学工具</p>
        </motion.div>
        
        <motion.div 
          className="loading-spinner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </motion.div>
        
        <motion.div 
          className="loading-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="loading-title">正在加载现代化教学工具...</div>
          <div className="loading-subtitle">
            🎲 智能抽取 • 📊 数据统计 • 🏆 终极大奖
          </div>
        </motion.div>
        
        <motion.div 
          className="loading-progress"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
            />
          </div>
          <div className="progress-text">初始化系统中...</div>
        </motion.div>
      </div>
      
      <div className="loading-background">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-particle"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-100px", opacity: [0, 1, 0] }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
            style={{ left: `${20 + i * 15}%` }}
          />
        ))}
      </div>
      

    </div>
  );
};
