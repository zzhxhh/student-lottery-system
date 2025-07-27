/**
 * 概率计算工具函数
 * 确保抽奖概率的准确性和一致性
 */

/**
 * 生成符合指定概率的随机结果
 * @param probability 概率值 (0-1)
 * @returns 是否成功
 */
export function generateProbabilityResult(probability: number): boolean {
  if (probability < 0 || probability > 1) {
    throw new Error('概率值必须在 0-1 之间');
  }
  
  const randomValue = Math.random();
  return randomValue < probability;
}

/**
 * 根据概率计算转盘停止角度
 * @param probability 中奖概率 (0-1)
 * @param isWin 是否中奖
 * @returns 目标角度 (0-360度)
 */
export function calculateTargetAngle(probability: number, isWin: boolean): number {
  const winZoneEnd = probability * 360;
  
  if (isWin) {
    // 中奖：指针停在绿色区域内 (0° 到 winZoneEnd°)
    return Math.random() * winZoneEnd;
  } else {
    // 未中奖：指针停在红色区域内 (winZoneEnd° 到 360°)
    if (winZoneEnd >= 360) {
      // 如果概率是100%，强制未中奖时返回一个小角度
      return 359.9;
    }
    return winZoneEnd + Math.random() * (360 - winZoneEnd);
  }
}

/**
 * 计算转盘总旋转角度
 * @param targetAngle 目标停止角度
 * @param minSpins 最小旋转圈数
 * @param maxSpins 最大旋转圈数
 * @returns 总旋转角度
 */
export function calculateTotalRotation(
  targetAngle: number, 
  minSpins: number = 5, 
  maxSpins: number = 8
): number {
  const spins = minSpins + Math.random() * (maxSpins - minSpins);
  const baseRotation = spins * 360;
  // 转盘逆时针转动，指针固定在顶部
  return baseRotation - targetAngle;
}

/**
 * 验证最终指针位置是否正确
 * @param totalRotation 总旋转角度
 * @param expectedWin 预期是否中奖
 * @param probability 中奖概率
 * @returns 验证结果
 */
export function validateResult(
  totalRotation: number, 
  expectedWin: boolean, 
  probability: number
): { isValid: boolean; pointerAngle: number; winZoneEnd: number } {
  const finalAngle = totalRotation % 360;
  const pointerAngle = (360 - finalAngle) % 360;
  const winZoneEnd = probability * 360;
  const actualWin = pointerAngle >= 0 && pointerAngle <= winZoneEnd;
  
  return {
    isValid: actualWin === expectedWin,
    pointerAngle,
    winZoneEnd
  };
}

/**
 * 格式化概率显示
 * @param probability 概率值 (0-1)
 * @param decimals 小数位数
 * @returns 格式化的百分比字符串
 */
export function formatProbability(probability: number, decimals: number = 1): string {
  return `${(probability * 100).toFixed(decimals)}%`;
}

/**
 * 计算基于答题表现的动态概率
 * @param baseProbability 基础概率
 * @param correctAnswers 正确答题数
 * @param bonusPerCorrect 每个正确答案的奖励概率
 * @param maxProbability 最大概率
 * @returns 计算后的概率
 */
export function calculateDynamicProbability(
  baseProbability: number,
  correctAnswers: number,
  bonusPerCorrect: number,
  maxProbability: number
): number {
  const calculatedProbability = baseProbability + (correctAnswers * bonusPerCorrect);
  return Math.min(calculatedProbability, maxProbability);
}
