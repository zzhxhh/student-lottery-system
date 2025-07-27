import React, { useState, useEffect } from 'react';
import './App.css';
import StudentManager from './components/StudentManager';
import StudentLottery from './components/StudentLottery';
import PrizeWheel from './components/PrizeWheel';
import PrizeSettings from './components/PrizeSettings';

export interface Student {
  id: string;
  name: string;
  correctAnswers: number;
  totalAnswers: number;
}

export interface Prize {
  id: string;
  name: string;
  baseProbability: number; // 基础概率 (0-1)
  bonusPerCorrect: number; // 每答对一题增加的概率
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [currentView, setCurrentView] = useState<'students' | 'lottery' | 'wheel'>('students');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPrizeSettings, setShowPrizeSettings] = useState(false);

  // 初始化默认奖项
  useEffect(() => {
    const defaultPrizes: Prize[] = [
      { id: '1', name: '一等奖', baseProbability: 0.01, bonusPerCorrect: 0.01 },
      { id: '2', name: '二等奖', baseProbability: 0.05, bonusPerCorrect: 0.02 },
      { id: '3', name: '三等奖', baseProbability: 0.1, bonusPerCorrect: 0.03 },
      { id: '4', name: '参与奖', baseProbability: 0.3, bonusPerCorrect: 0.05 },
      { id: '5', name: '谢谢参与', baseProbability: 0.54, bonusPerCorrect: 0 }
    ];
    setPrizes(defaultPrizes);
  }, []);

  const addStudent = (name: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      correctAnswers: 0,
      totalAnswers: 0
    };
    setStudents([...students, newStudent]);
  };

  const updateStudentAnswer = (studentId: string, isCorrect: boolean) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? {
            ...student,
            correctAnswers: student.correctAnswers + (isCorrect ? 1 : 0),
            totalAnswers: student.totalAnswers + 1
          }
        : student
    ));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎯 学生抽取奖励系统</h1>
        <nav className="nav-buttons">
          <button
            className={currentView === 'students' ? 'active' : ''}
            onClick={() => setCurrentView('students')}
          >
            👥 学生管理
          </button>
          <button
            className={currentView === 'lottery' ? 'active' : ''}
            onClick={() => setCurrentView('lottery')}
          >
            🎲 学生抽取
          </button>
          <button
            className={currentView === 'wheel' ? 'active' : ''}
            onClick={() => setCurrentView('wheel')}
          >
            🎡 终极大转盘
          </button>
          <button
            className="settings-btn"
            onClick={() => setShowPrizeSettings(true)}
            title="奖项设置"
          >
            ⚙️ 设置
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'students' && (
          <StudentManager
            students={students}
            onAddStudent={addStudent}
            onSelectStudent={setSelectedStudent}
          />
        )}

        {currentView === 'lottery' && (
          <StudentLottery
            students={students}
            onSelectStudent={setSelectedStudent}
            onUpdateAnswer={updateStudentAnswer}
          />
        )}

        {currentView === 'wheel' && (
          <PrizeWheel
            students={students}
            selectedStudent={selectedStudent}
          />
        )}
      </main>

      {showPrizeSettings && (
        <PrizeSettings
          prizes={prizes}
          onUpdatePrizes={setPrizes}
          onClose={() => setShowPrizeSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
