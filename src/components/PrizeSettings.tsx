import React, { useState } from 'react';
import { Prize } from '../App';
import './PrizeSettings.css';

interface PrizeSettingsProps {
  prizes: Prize[];
  onUpdatePrizes: (prizes: Prize[]) => void;
  onClose: () => void;
}

const PrizeSettings: React.FC<PrizeSettingsProps> = ({
  prizes,
  onUpdatePrizes,
  onClose
}) => {
  const [editingPrizes, setEditingPrizes] = useState<Prize[]>([...prizes]);
  const [newPrize, setNewPrize] = useState({
    name: '',
    baseProbability: 0.1,
    bonusPerCorrect: 0.01
  });

  const handlePrizeUpdate = (index: number, field: keyof Prize, value: string | number) => {
    const updated = [...editingPrizes];
    if (field === 'baseProbability' || field === 'bonusPerCorrect') {
      updated[index] = { ...updated[index], [field]: Number(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEditingPrizes(updated);
  };

  const handleAddPrize = () => {
    if (newPrize.name.trim()) {
      const prize: Prize = {
        id: Date.now().toString(),
        name: newPrize.name.trim(),
        baseProbability: newPrize.baseProbability,
        bonusPerCorrect: newPrize.bonusPerCorrect
      };
      setEditingPrizes([...editingPrizes, prize]);
      setNewPrize({ name: '', baseProbability: 0.1, bonusPerCorrect: 0.01 });
    }
  };

  const handleRemovePrize = (index: number) => {
    if (editingPrizes.length > 1) {
      const updated = editingPrizes.filter((_, i) => i !== index);
      setEditingPrizes(updated);
    } else {
      alert('至少需要保留一个奖项！');
    }
  };

  const handleSave = () => {
    // 验证概率总和
    const totalBaseProbability = editingPrizes.reduce((sum, prize) => sum + prize.baseProbability, 0);
    
    if (Math.abs(totalBaseProbability - 1) > 0.01) {
      alert(`基础概率总和应该等于100%，当前为${Math.round(totalBaseProbability * 100)}%`);
      return;
    }

    // 验证奖项名称不为空
    if (editingPrizes.some(prize => !prize.name.trim())) {
      alert('所有奖项都必须有名称！');
      return;
    }

    onUpdatePrizes(editingPrizes);
    onClose();
  };

  const handleReset = () => {
    const defaultPrizes: Prize[] = [
      { id: '1', name: '一等奖', baseProbability: 0.01, bonusPerCorrect: 0.01 },
      { id: '2', name: '二等奖', baseProbability: 0.05, bonusPerCorrect: 0.02 },
      { id: '3', name: '三等奖', baseProbability: 0.1, bonusPerCorrect: 0.03 },
      { id: '4', name: '参与奖', baseProbability: 0.3, bonusPerCorrect: 0.05 },
      { id: '5', name: '谢谢参与', baseProbability: 0.54, bonusPerCorrect: 0 }
    ];
    setEditingPrizes(defaultPrizes);
  };

  const totalBaseProbability = editingPrizes.reduce((sum, prize) => sum + prize.baseProbability, 0);

  return (
    <div className="prize-settings-overlay">
      <div className="prize-settings-modal">
        <div className="modal-header">
          <h2>🎁 奖项设置</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="settings-info">
            <p>💡 提示：基础概率总和必须等于100%，奖励概率会根据学生答题情况动态增加</p>
            <div className="probability-summary">
              <span>当前基础概率总和: </span>
              <span className={`total-probability ${Math.abs(totalBaseProbability - 1) < 0.01 ? 'valid' : 'invalid'}`}>
                {Math.round(totalBaseProbability * 100)}%
              </span>
            </div>
          </div>

          <div className="prizes-list">
            {editingPrizes.map((prize, index) => (
              <div key={prize.id} className="prize-item">
                <div className="prize-number">{index + 1}</div>
                <div className="prize-fields">
                  <div className="field-group">
                    <label>奖项名称</label>
                    <input
                      type="text"
                      value={prize.name}
                      onChange={(e) => handlePrizeUpdate(index, 'name', e.target.value)}
                      placeholder="输入奖项名称"
                      className="prize-input"
                    />
                  </div>
                  <div className="field-group">
                    <label>基础概率 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={Math.round(prize.baseProbability * 100 * 10) / 10}
                      onChange={(e) => handlePrizeUpdate(index, 'baseProbability', Number(e.target.value) / 100)}
                      className="prize-input"
                    />
                  </div>
                  <div className="field-group">
                    <label>答题奖励 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={Math.round(prize.bonusPerCorrect * 100 * 10) / 10}
                      onChange={(e) => handlePrizeUpdate(index, 'bonusPerCorrect', Number(e.target.value) / 100)}
                      className="prize-input"
                    />
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemovePrize(index)}
                  disabled={editingPrizes.length <= 1}
                  title="删除奖项"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="add-prize-section">
            <h3>添加新奖项</h3>
            <div className="add-prize-form">
              <input
                type="text"
                placeholder="奖项名称"
                value={newPrize.name}
                onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
                className="prize-input"
              />
              <input
                type="number"
                placeholder="基础概率(%)"
                min="0"
                max="100"
                step="0.1"
                value={Math.round(newPrize.baseProbability * 100 * 10) / 10}
                onChange={(e) => setNewPrize({ ...newPrize, baseProbability: Number(e.target.value) / 100 })}
                className="prize-input"
              />
              <input
                type="number"
                placeholder="答题奖励(%)"
                min="0"
                max="10"
                step="0.1"
                value={Math.round(newPrize.bonusPerCorrect * 100 * 10) / 10}
                onChange={(e) => setNewPrize({ ...newPrize, bonusPerCorrect: Number(e.target.value) / 100 })}
                className="prize-input"
              />
              <button className="btn btn-primary" onClick={handleAddPrize}>
                ➕ 添加
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-warning" onClick={handleReset}>
            🔄 恢复默认
          </button>
          <button className="btn btn-danger" onClick={onClose}>
            ❌ 取消
          </button>
          <button 
            className="btn btn-success" 
            onClick={handleSave}
            disabled={Math.abs(totalBaseProbability - 1) > 0.01}
          >
            ✅ 保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrizeSettings;
