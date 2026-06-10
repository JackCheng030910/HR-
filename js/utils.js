/**
 * 实习能量站 - 工具函数模块
 * Intern Energy Station - Utility Functions
 * 
 * 所有工具函数通过 window.Utils 全局暴露
 */

window.Utils = (function () {
  'use strict';

  // ============================================================
  // 日期与时间
  // ============================================================

  /**
   * 格式化日期字符串为 YYYY-MM-DD，若距今 ≤7 天则返回相对时间
   * @param {string} dateStr - ISO 格式日期字符串
   * @returns {string}
   */
  function formatDate(dateStr) {
    if (!dateStr) return '--';
    var date = new Date(dateStr);
    if (isNaN(date.getTime())) return '--';

    var now = new Date();
    var diffMs = now - date;
    var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 7) {
      return formatRelativeTime(dateStr);
    }

    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  /**
   * 返回相对时间描述，如 "刚刚"、"3天前"、"2周前"、"1个月前"
   * @param {string} dateStr - ISO 格式日期字符串
   * @returns {string}
   */
  function formatRelativeTime(dateStr) {
    if (!dateStr) return '--';
    var date = new Date(dateStr);
    if (isNaN(date.getTime())) return '--';

    var now = new Date();
    var diffMs = now - date;

    // 未来日期
    if (diffMs < 0) {
      var futureDays = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
      if (futureDays === 0) return '今天';
      if (futureDays === 1) return '明天';
      if (futureDays <= 7) return futureDays + '天后';
      if (futureDays <= 30) return Math.ceil(futureDays / 7) + '周后';
      return Math.ceil(futureDays / 30) + '个月后';
    }

    var diffSeconds = Math.floor(diffMs / 1000);
    var diffMinutes = Math.floor(diffSeconds / 60);
    var diffHours = Math.floor(diffMinutes / 60);
    var diffDays = Math.floor(diffHours / 24);
    var diffWeeks = Math.floor(diffDays / 7);
    var diffMonths = Math.floor(diffDays / 30);

    if (diffSeconds < 60) return '刚刚';
    if (diffMinutes < 60) return diffMinutes + '分钟前';
    if (diffHours < 24) return diffHours + '小时前';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return diffDays + '天前';
    if (diffWeeks < 5) return diffWeeks + '周前';
    if (diffMonths < 12) return diffMonths + '个月前';
    return Math.floor(diffDays / 365) + '年前';
  }

  /**
   * 计算从指定日期到今天的天数
   * @param {string} dateStr - ISO 格式日期字符串
   * @returns {number}
   */
  function getDaysSince(dateStr) {
    if (!dateStr) return 0;
    var date = new Date(dateStr);
    if (isNaN(date.getTime())) return 0;
    var now = new Date();
    var diffMs = now - date;
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  /**
   * 根据天数判断所处阶段 (1/2/3)
   * @param {number} days - 入职天数
   * @returns {number} 1 | 2 | 3
   */
  function getPhaseFromDays(days) {
    if (days <= 30) return 1;
    if (days <= 60) return 2;
    return 3;
  }

  // ============================================================
  // 颜色与样式
  // ============================================================

  /**
   * 根据进度百分比返回对应颜色
   * @param {number} percent - 0-100
   * @returns {string} 颜色代码
   */
  function getProgressColor(percent) {
    if (typeof percent !== 'number' || isNaN(percent)) return '#6B7280';
    if (percent >= 80) return '#00D9A3'; // 绿色 - 优秀
    if (percent >= 60) return '#FFB800'; // 黄色 - 良好
    if (percent >= 40) return '#FF8C00'; // 橙色 - 一般
    return '#FF4D6A';                    // 红色 - 需关注
  }

  /**
   * 根据转正评级返回 badge 配置
   * @param {string} rating - 'A' | 'B' | 'C' | 'D'
   * @returns {{ text: string, class: string, color: string }}
   */
  function getConversionBadge(rating) {
    var config = {
      A: { text: '优秀 · 强烈推荐', class: 'badge-excellent', color: '#00D9A3' },
      B: { text: '良好 · 推荐转正', class: 'badge-good', color: '#00C4FF' },
      C: { text: '一般 · 有条件转正', class: 'badge-average', color: '#FFB800' },
      D: { text: '待提升 · 暂不推荐', class: 'badge-poor', color: '#FF4D6A' }
    };
    return config[rating] || { text: '未评估', class: 'badge-unknown', color: '#6B7280' };
  }

  /**
   * 根据分数获取等级标签
   * @param {number} score - 0-100
   * @returns {{ label: string, color: string }}
   */
  function getScoreLabel(score) {
    if (score >= 90) return { label: '卓越', color: '#00D9A3' };
    if (score >= 80) return { label: '优秀', color: '#22C55E' };
    if (score >= 70) return { label: '良好', color: '#00C4FF' };
    if (score >= 60) return { label: '合格', color: '#FFB800' };
    return { label: '需提升', color: '#FF4D6A' };
  }

  // ============================================================
  // 函数工具
  // ============================================================

  /**
   * 防抖函数
   * @param {Function} fn - 目标函数
   * @param {number} delay - 延迟毫秒数
   * @returns {Function}
   */
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
        timer = null;
      }, delay || 300);
    };
  }

  /**
   * 节流函数
   * @param {Function} fn - 目标函数
   * @param {number} interval - 间隔毫秒数
   * @returns {Function}
   */
  function throttle(fn, interval) {
    var lastTime = 0;
    return function () {
      var now = Date.now();
      if (now - lastTime >= (interval || 300)) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

  /**
   * Promise 形式的延迟
   * @param {number} ms - 毫秒数
   * @returns {Promise<void>}
   */
  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms || 0);
    });
  }

  // ============================================================
  // DOM 与动画
  // ============================================================

  /**
   * 为元素添加动画 class，动画结束后自动移除
   * @param {HTMLElement} element - DOM 元素
   * @param {string} animationClass - CSS 动画类名
   * @returns {Promise<void>}
   */
  function animate(element, animationClass) {
    return new Promise(function (resolve) {
      if (!element) {
        resolve();
        return;
      }
      element.classList.add(animationClass);

      function handleEnd() {
        element.classList.remove(animationClass);
        element.removeEventListener('animationend', handleEnd);
        resolve();
      }

      element.addEventListener('animationend', handleEnd);

      // 安全兜底：3秒后自动移除，防止动画不触发 animationend
      setTimeout(function () {
        if (element.classList.contains(animationClass)) {
          element.classList.remove(animationClass);
          element.removeEventListener('animationend', handleEnd);
          resolve();
        }
      }, 3000);
    });
  }

  // ============================================================
  // ID 与随机
  // ============================================================

  /**
   * 生成随机 ID
   * @param {string} [prefix='id'] - 可选前缀
   * @returns {string}
   */
  function generateId(prefix) {
    var p = prefix || 'id';
    var ts = Date.now().toString(36);
    var rand = Math.random().toString(36).substring(2, 8);
    return p + '-' + ts + '-' + rand;
  }

  /**
   * 生成 [min, max] 范围内的随机整数
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function randomInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ============================================================
  // 数组与对象工具
  // ============================================================

  /**
   * 计算数字数组的平均值
   * @param {number[]} arr
   * @returns {number}
   */
  function calculateAverage(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      sum += (typeof arr[i] === 'number' ? arr[i] : 0);
    }
    return Math.round((sum / arr.length) * 100) / 100;
  }

  /**
   * 按指定 key 分组
   * @param {Object[]} arr - 对象数组
   * @param {string} key - 分组依据的键名
   * @returns {Object} 分组结果 { [keyValue]: Object[] }
   */
  function groupBy(arr, key) {
    if (!Array.isArray(arr)) return {};
    var result = {};
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var groupKey = item[key];
      if (groupKey === undefined || groupKey === null) groupKey = '__undefined__';
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
    }
    return result;
  }

  // ============================================================
  // 数值工具
  // ============================================================

  /**
   * 将值限制在 [min, max] 范围内
   * @param {number} val
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clamp(val, min, max) {
    if (typeof val !== 'number') return min;
    return Math.min(Math.max(val, min), max);
  }

  // ============================================================
  // 字符串工具
  // ============================================================

  /**
   * 转义 HTML 特殊字符，防止 XSS
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return str.replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }

  /**
   * 截断字符串并添加省略号
   * @param {string} str - 原字符串
   * @param {number} maxLen - 最大长度（含省略号）
   * @returns {string}
   */
  function truncate(str, maxLen) {
    if (typeof str !== 'string') return '';
    maxLen = maxLen || 50;
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen - 1) + '…';
  }

  // ============================================================
  // 业务辅助函数
  // ============================================================

  /**
   * 获取任务状态配置
   * @param {string} status - 'completed' | 'in-progress' | 'pending'
   * @returns {{ label: string, color: string, icon: string }}
   */
  function getTaskStatusConfig(status) {
    var map = {
      'completed': { label: '已完成', color: '#00D9A3', icon: '✅' },
      'in-progress': { label: '进行中', color: '#FFB800', icon: '🔄' },
      'pending': { label: '待开始', color: '#6B7280', icon: '⏳' }
    };
    return map[status] || { label: '未知', color: '#6B7280', icon: '❓' };
  }

  /**
   * 获取优先级配置
   * @param {string} priority - 'high' | 'medium' | 'low'
   * @returns {{ label: string, color: string }}
   */
  function getPriorityConfig(priority) {
    var map = {
      'high': { label: '高', color: '#FF4D6A' },
      'medium': { label: '中', color: '#FFB800' },
      'low': { label: '低', color: '#6B7280' }
    };
    return map[priority] || { label: '未知', color: '#6B7280' };
  }

  /**
   * 计算实习生任务完成率
   * @param {Object[]} tasks - 任务列表
   * @returns {number} 0-100 的百分比
   */
  function calculateTaskCompletionRate(tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) return 0;
    var completed = 0;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].status === 'completed') completed++;
    }
    return Math.round((completed / tasks.length) * 100);
  }

  /**
   * 分析周评分趋势
   * @param {number[]} scores - 周评分数组
   * @returns {{ trend: string, label: string, change: number }}
   */
  function analyzeScoreTrend(scores) {
    if (!Array.isArray(scores) || scores.length < 2) {
      return { trend: 'stable', label: '数据不足', change: 0 };
    }

    // 取最近4周对比前4周
    var recentLen = Math.min(4, scores.length);
    var recent = scores.slice(-recentLen);
    var earlier = scores.slice(0, scores.length - recentLen);
    if (earlier.length === 0) earlier = scores.slice(0, 1);

    var recentAvg = calculateAverage(recent);
    var earlierAvg = calculateAverage(earlier);
    var change = Math.round((recentAvg - earlierAvg) * 100) / 100;

    if (change > 3) return { trend: 'up', label: '上升趋势 📈', change: change };
    if (change < -3) return { trend: 'down', label: '下降趋势 📉', change: change };
    return { trend: 'stable', label: '保持稳定 ➡️', change: change };
  }

  /**
   * 根据 internId 查找实习生
   * @param {string} id
   * @returns {Object|null}
   */
  function findInternById(id) {
    if (!window.AppData || !window.AppData.INTERNS) return null;
    var interns = window.AppData.INTERNS;
    for (var i = 0; i < interns.length; i++) {
      if (interns[i].id === id) return interns[i];
    }
    return null;
  }

  /**
   * 根据 mentorId 查找导师
   * @param {string} id
   * @returns {Object|null}
   */
  function findMentorById(id) {
    if (!window.AppData || !window.AppData.MENTORS) return null;
    var mentors = window.AppData.MENTORS;
    for (var i = 0; i < mentors.length; i++) {
      if (mentors[i].id === id) return mentors[i];
    }
    return null;
  }

  /**
   * 获取指定导师的所有实习生
   * @param {string} mentorId
   * @returns {Object[]}
   */
  function getInternsByMentor(mentorId) {
    if (!window.AppData || !window.AppData.INTERNS) return [];
    return window.AppData.INTERNS.filter(function (intern) {
      return intern.mentorId === mentorId;
    });
  }

  /**
   * 获取指定部门的所有实习生
   * @param {string} department
   * @returns {Object[]}
   */
  function getInternsByDepartment(department) {
    if (!window.AppData || !window.AppData.INTERNS) return [];
    return window.AppData.INTERNS.filter(function (intern) {
      return intern.department === department;
    });
  }

  /**
   * 获取有风险的实习生列表
   * @returns {Object[]}
   */
  function getAtRiskInterns() {
    if (!window.AppData || !window.AppData.INTERNS) return [];
    return window.AppData.INTERNS.filter(function (intern) {
      return intern.riskFlags && intern.riskFlags.length > 0;
    });
  }

  /**
   * 计算全局统计数据
   * @returns {Object}
   */
  function calculateGlobalStats() {
    if (!window.AppData || !window.AppData.INTERNS) {
      return { total: 0, avgProgress: 0, avgConversion: 0, atRisk: 0, ratingDistribution: {} };
    }

    var interns = window.AppData.INTERNS;
    var total = interns.length;
    var progressSum = 0;
    var conversionSum = 0;
    var atRisk = 0;
    var ratingDist = { A: 0, B: 0, C: 0, D: 0 };

    for (var i = 0; i < total; i++) {
      progressSum += interns[i].overallProgress;
      conversionSum += interns[i].conversionScore;
      if (interns[i].riskFlags && interns[i].riskFlags.length > 0) atRisk++;
      if (ratingDist[interns[i].conversionRating] !== undefined) {
        ratingDist[interns[i].conversionRating]++;
      }
    }

    return {
      total: total,
      avgProgress: Math.round(progressSum / total),
      avgConversion: Math.round(conversionSum / total),
      atRisk: atRisk,
      ratingDistribution: ratingDist
    };
  }

  // ============================================================
  // 公开接口
  // ============================================================
  return {
    // 日期与时间
    formatDate: formatDate,
    formatRelativeTime: formatRelativeTime,
    getDaysSince: getDaysSince,
    getPhaseFromDays: getPhaseFromDays,

    // 颜色与样式
    getProgressColor: getProgressColor,
    getConversionBadge: getConversionBadge,
    getScoreLabel: getScoreLabel,

    // 函数工具
    debounce: debounce,
    throttle: throttle,
    sleep: sleep,

    // DOM 与动画
    animate: animate,

    // ID 与随机
    generateId: generateId,
    randomInRange: randomInRange,

    // 数组与对象
    calculateAverage: calculateAverage,
    groupBy: groupBy,

    // 数值
    clamp: clamp,

    // 字符串
    escapeHtml: escapeHtml,
    truncate: truncate,

    // 业务辅助
    getTaskStatusConfig: getTaskStatusConfig,
    getPriorityConfig: getPriorityConfig,
    calculateTaskCompletionRate: calculateTaskCompletionRate,
    analyzeScoreTrend: analyzeScoreTrend,
    findInternById: findInternById,
    findMentorById: findMentorById,
    getInternsByMentor: getInternsByMentor,
    getInternsByDepartment: getInternsByDepartment,
    getAtRiskInterns: getAtRiskInterns,
    calculateGlobalStats: calculateGlobalStats
  };

})();
