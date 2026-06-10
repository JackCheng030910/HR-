/**
 * 实习能量站 - Dashboard Charts Module
 * Handles all Chart.js chart rendering for the dashboard.
 */
(function () {
  'use strict';

  // ─── Chart Registry (for cleanup) ───────────────────────────────────
  var charts = {};

  // ─── Color Palette ──────────────────────────────────────────────────
  var CHART_COLORS = {
    primary: '#0052D9',
    primaryLight: '#00C4FF',
    intern: '#00D9A3',
    mentor: '#FF8C42',
    hr: '#6C63FF',
    success: '#00D9A3',
    warning: '#FFB800',
    danger: '#FF4D6A',
    info: '#00C4FF',

    // Extended palette for multi-series
    palette: ['#0052D9', '#00D9A3', '#FF8C42', '#6C63FF', '#00C4FF', '#FFB800', '#FF4D6A', '#A855F7'],

    /**
     * Create a vertical linear gradient.
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} color1 - Top color
     * @param {string} [color2='transparent'] - Bottom color
     * @returns {CanvasGradient}
     */
    createGradient: function (ctx, color1, color2) {
      var gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2 || 'transparent');
      return gradient;
    }
  };

  // ─── Chart.js Global Defaults ───────────────────────────────────────
  function setDefaults() {
    if (typeof Chart === 'undefined') {
      console.warn('[Dashboard] Chart.js not loaded. Charts will not render.');
      return false;
    }
    Chart.defaults.color = '#a0a4b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
    Chart.defaults.font.family = "'Outfit', 'Noto Sans SC', sans-serif";
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.animation = {
      duration: 800,
      easing: 'easeInOutQuart'
    };
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    return true;
  }

  // ─── Helpers ────────────────────────────────────────────────────────
  function getCanvas(canvasId) {
    var el = document.getElementById(canvasId);
    if (!el) {
      console.warn('[Dashboard] Canvas element not found: ' + canvasId);
      return null;
    }
    return el;
  }

  function destroyChart(id) {
    if (charts[id]) {
      charts[id].destroy();
      delete charts[id];
    }
  }

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  // ═══════════════════════════════════════════════════════════════════════
  // DESTROY ALL
  // ═══════════════════════════════════════════════════════════════════════
  function destroyAll() {
    Object.keys(charts).forEach(function (id) {
      if (charts[id] && typeof charts[id].destroy === 'function') {
        charts[id].destroy();
      }
    });
    charts = {};
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 1. INTERN RADAR CHART
  // ═══════════════════════════════════════════════════════════════════════
  function renderInternRadar(canvasId, skills) {
    if (!setDefaults()) return null;
    var canvas = getCanvas(canvasId);
    if (!canvas) return null;
    destroyChart(canvasId);

    var ctx = canvas.getContext('2d');
    var labels = ['技术能力', '业务理解', '沟通协作', '创新思维', '执行力'];
    var data = skills || [0, 0, 0, 0, 0];

    charts[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: '能力画像',
          data: data,
          backgroundColor: hexToRgba(CHART_COLORS.intern, 0.2),
          borderColor: CHART_COLORS.intern,
          borderWidth: 2,
          pointBackgroundColor: CHART_COLORS.intern,
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 20,
              backdropColor: 'transparent',
              color: '#a0a4b8',
              font: { size: 10 }
            },
            grid: {
              color: 'rgba(255,255,255,0.08)'
            },
            angleLines: {
              color: 'rgba(255,255,255,0.08)'
            },
            pointLabels: {
              color: '#d0d4e8',
              font: { size: 12, weight: '500' }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(20,22,36,0.95)',
            titleColor: '#fff',
            bodyColor: '#d0d4e8',
            borderColor: CHART_COLORS.intern,
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                return context.label + '：' + context.raw + ' 分';
              }
            }
          }
        }
      }
    });

    return charts[canvasId];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. INTERN PROGRESS LINE CHART
  // ═══════════════════════════════════════════════════════════════════════
  function renderInternProgress(canvasId, weeklyScores) {
    if (!setDefaults()) return null;
    var canvas = getCanvas(canvasId);
    if (!canvas) return null;
    destroyChart(canvasId);

    var ctx = canvas.getContext('2d');
    var scores = weeklyScores || [];
    var labels = scores.map(function (_, i) { return '第' + (i + 1) + '周'; });

    var gradient = CHART_COLORS.createGradient(ctx, hexToRgba(CHART_COLORS.primaryLight, 0.35), hexToRgba(CHART_COLORS.primaryLight, 0.0));

    charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: '周度评分',
          data: scores,
          borderColor: CHART_COLORS.primaryLight,
          backgroundColor: gradient,
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: CHART_COLORS.primaryLight,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: CHART_COLORS.primaryLight,
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#a0a4b8', font: { size: 11 } }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#a0a4b8', stepSize: 20, font: { size: 11 } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(20,22,36,0.95)',
            titleColor: '#fff',
            bodyColor: '#d0d4e8',
            borderColor: CHART_COLORS.primaryLight,
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                return '评分：' + context.raw + ' 分';
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    return charts[canvasId];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. HR OVERVIEW DOUGHNUT CHART
  // ═══════════════════════════════════════════════════════════════════════
  function renderHROverview(canvasId) {
    if (!setDefaults()) return null;
    var canvas = getCanvas(canvasId);
    if (!canvas) return null;
    destroyChart(canvasId);

    var ctx = canvas.getContext('2d');

    // Get data from AppData
    var interns = (window.AppData && window.AppData.interns) || [];
    var deptMap = {};
    interns.forEach(function (intern) {
      var dept = intern.department || '未分配';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    var departments = Object.keys(deptMap);
    var counts = departments.map(function (d) { return deptMap[d]; });
    var total = counts.reduce(function (a, b) { return a + b; }, 0);

    // Fallback sample data if no AppData
    if (departments.length === 0) {
      departments = ['技术部', '产品部', '设计部', '市场部', '运营部'];
      counts = [12, 8, 5, 4, 3];
      total = 32;
    }

    var colors = [
      CHART_COLORS.primary,
      CHART_COLORS.intern,
      CHART_COLORS.mentor,
      CHART_COLORS.hr,
      CHART_COLORS.info,
      CHART_COLORS.warning,
      CHART_COLORS.danger,
      '#A855F7'
    ];

    // Center text plugin
    var centerTextPlugin = {
      id: 'centerText_' + canvasId,
      beforeDraw: function (chart) {
        var ctx2 = chart.ctx;
        var width = chart.width;
        var height = chart.height;
        ctx2.save();
        // Total number
        ctx2.font = "bold 28px 'Outfit', sans-serif";
        ctx2.fillStyle = '#ffffff';
        ctx2.textAlign = 'center';
        ctx2.textBaseline = 'middle';
        ctx2.fillText(total, width / 2, height / 2 - 10);
        // Label
        ctx2.font = "12px 'Noto Sans SC', sans-serif";
        ctx2.fillStyle = '#a0a4b8';
        ctx2.fillText('实习生总数', width / 2, height / 2 + 16);
        ctx2.restore();
      }
    };

    charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: departments,
        datasets: [{
          data: counts,
          backgroundColor: colors.slice(0, departments.length),
          borderColor: 'rgba(20,22,36,0.8)',
          borderWidth: 3,
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#d0d4e8',
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20,22,36,0.95)',
            titleColor: '#fff',
            bodyColor: '#d0d4e8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                var pct = ((context.raw / total) * 100).toFixed(1);
                return context.label + '：' + context.raw + '人（' + pct + '%）';
              }
            }
          }
        }
      },
      plugins: [centerTextPlugin]
    });

    return charts[canvasId];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 4. HR SCORE DISTRIBUTION BAR CHART
  // ═══════════════════════════════════════════════════════════════════════
  function renderHRScoreDistribution(canvasId) {
    if (!setDefaults()) return null;
    var canvas = getCanvas(canvasId);
    if (!canvas) return null;
    destroyChart(canvasId);

    var ctx = canvas.getContext('2d');

    // Build score distribution
    var interns = (window.AppData && window.AppData.interns) || [];
    var ranges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
    var distribution = [0, 0, 0, 0, 0];

    interns.forEach(function (intern) {
      var score = intern.weeklyScores && intern.weeklyScores.length
        ? intern.weeklyScores[intern.weeklyScores.length - 1]
        : null;
      if (score === null) return;
      if (score <= 20) distribution[0]++;
      else if (score <= 40) distribution[1]++;
      else if (score <= 60) distribution[2]++;
      else if (score <= 80) distribution[3]++;
      else distribution[4]++;
    });

    // Fallback
    if (distribution.every(function (d) { return d === 0; })) {
      distribution = [1, 3, 8, 14, 6];
    }

    var barColors = [
      CHART_COLORS.danger,
      CHART_COLORS.warning,
      CHART_COLORS.info,
      CHART_COLORS.primary,
      CHART_COLORS.success
    ];

    // Create individual gradients for each bar
    var backgroundColors = barColors.map(function (color) {
      return CHART_COLORS.createGradient(ctx, color, hexToRgba(color, 0.3));
    });

    charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ranges,
        datasets: [{
          label: '人数',
          data: distribution,
          backgroundColor: backgroundColors,
          borderColor: barColors,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.7
        }]
      },
      options: {
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#a0a4b8',
              font: { size: 11 }
            },
            title: {
              display: true,
              text: '分数区间',
              color: '#a0a4b8',
              font: { size: 12 }
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: {
              color: '#a0a4b8',
              stepSize: 2,
              font: { size: 11 },
              precision: 0
            },
            title: {
              display: true,
              text: '人数',
              color: '#a0a4b8',
              font: { size: 12 }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(20,22,36,0.95)',
            titleColor: '#fff',
            bodyColor: '#d0d4e8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                return '人数：' + context.raw + ' 人';
              }
            }
          }
        }
      }
    });

    return charts[canvasId];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 5. HR PROGRESS TREND LINE CHART
  // ═══════════════════════════════════════════════════════════════════════
  function renderHRProgressTrend(canvasId) {
    if (!setDefaults()) return null;
    var canvas = getCanvas(canvasId);
    if (!canvas) return null;
    destroyChart(canvasId);

    var ctx = canvas.getContext('2d');

    // Build department-level weekly averages
    var interns = (window.AppData && window.AppData.interns) || [];
    var deptData = {};
    var maxWeeks = 0;

    interns.forEach(function (intern) {
      var dept = intern.department || '未分配';
      if (!deptData[dept]) deptData[dept] = [];
      if (intern.weeklyScores && intern.weeklyScores.length) {
        maxWeeks = Math.max(maxWeeks, intern.weeklyScores.length);
        intern.weeklyScores.forEach(function (score, wi) {
          if (!deptData[dept][wi]) deptData[dept][wi] = { sum: 0, count: 0 };
          deptData[dept][wi].sum += score;
          deptData[dept][wi].count++;
        });
      }
    });

    var departments = Object.keys(deptData);

    // Fallback
    if (departments.length === 0) {
      departments = ['技术部', '产品部', '设计部'];
      maxWeeks = 8;
      deptData = {
        '技术部': [
          { sum: 65, count: 1 }, { sum: 68, count: 1 }, { sum: 72, count: 1 }, { sum: 75, count: 1 },
          { sum: 78, count: 1 }, { sum: 80, count: 1 }, { sum: 83, count: 1 }, { sum: 85, count: 1 }
        ],
        '产品部': [
          { sum: 60, count: 1 }, { sum: 63, count: 1 }, { sum: 67, count: 1 }, { sum: 70, count: 1 },
          { sum: 73, count: 1 }, { sum: 76, count: 1 }, { sum: 79, count: 1 }, { sum: 82, count: 1 }
        ],
        '设计部': [
          { sum: 58, count: 1 }, { sum: 62, count: 1 }, { sum: 65, count: 1 }, { sum: 69, count: 1 },
          { sum: 72, count: 1 }, { sum: 74, count: 1 }, { sum: 77, count: 1 }, { sum: 80, count: 1 }
        ]
      };
    }

    var labels = [];
    for (var w = 0; w < maxWeeks; w++) {
      labels.push('第' + (w + 1) + '周');
    }

    var datasets = departments.map(function (dept, idx) {
      var color = CHART_COLORS.palette[idx % CHART_COLORS.palette.length];
      var deptWeeks = deptData[dept];
      var avgData = [];
      for (var wi = 0; wi < maxWeeks; wi++) {
        if (deptWeeks[wi] && deptWeeks[wi].count > 0) {
          avgData.push(Math.round(deptWeeks[wi].sum / deptWeeks[wi].count));
        } else {
          avgData.push(null);
        }
      }

      var areaGradient = CHART_COLORS.createGradient(ctx, hexToRgba(color, 0.18), hexToRgba(color, 0.0));

      return {
        label: dept,
        data: avgData,
        borderColor: color,
        backgroundColor: areaGradient,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 6
      };
    });

    charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#a0a4b8', font: { size: 11 } }
          },
          y: {
            beginAtZero: false,
            min: 40,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#a0a4b8', stepSize: 10, font: { size: 11 } }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#d0d4e8',
              padding: 16,
              usePointStyle: true,
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20,22,36,0.95)',
            titleColor: '#fff',
            bodyColor: '#d0d4e8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            mode: 'index',
            intersect: false
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    return charts[canvasId];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 6. HR CONVERSION PIE CHART
  // ═══════════════════════════════════════════════════════════════════════
  function renderHRConversionPie(canvasId) {
    if (!setDefaults()) return null;
    var canvas = getCanvas(canvasId);
    if (!canvas) return null;
    destroyChart(canvasId);

    var ctx = canvas.getContext('2d');

    // Build conversion rating distribution
    var interns = (window.AppData && window.AppData.interns) || [];
    var ratings = { A: 0, B: 0, C: 0, D: 0 };

    interns.forEach(function (intern) {
      var rating = intern.conversionRating || intern.rating;
      if (rating && ratings.hasOwnProperty(rating)) {
        ratings[rating]++;
      }
    });

    var hasData = Object.values(ratings).some(function (v) { return v > 0; });
    if (!hasData) {
      ratings = { A: 8, B: 14, C: 7, D: 3 };
    }

    var labels = ['A - 优秀', 'B - 良好', 'C - 合格', 'D - 待提升'];
    var data = [ratings.A, ratings.B, ratings.C, ratings.D];
    var colors = [CHART_COLORS.success, CHART_COLORS.primary, CHART_COLORS.warning, CHART_COLORS.danger];

    charts[canvasId] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: 'rgba(20,22,36,0.8)',
          borderWidth: 3,
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#d0d4e8',
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20,22,36,0.95)',
            titleColor: '#fff',
            bodyColor: '#d0d4e8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                var total = context.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                var pct = ((context.raw / total) * 100).toFixed(1);
                return context.label + '：' + context.raw + '人（' + pct + '%）';
              }
            }
          }
        }
      }
    });

    return charts[canvasId];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 7. MENTOR COMPARISON GROUPED BAR CHART
  // ═══════════════════════════════════════════════════════════════════════
  function renderMentorComparison(canvasId, internIds) {
    if (!setDefaults()) return null;
    var canvas = getCanvas(canvasId);
    if (!canvas) return null;
    destroyChart(canvasId);

    var ctx = canvas.getContext('2d');
    var skillLabels = ['技术能力', '业务理解', '沟通协作', '创新思维', '执行力'];

    // Resolve intern data
    var interns = (window.AppData && window.AppData.interns) || [];
    var selectedInterns = [];

    if (internIds && internIds.length) {
      internIds.forEach(function (id) {
        var found = interns.find(function (i) {
          return i.id === id || i.name === id;
        });
        if (found) selectedInterns.push(found);
      });
    }

    // Fallback
    if (selectedInterns.length === 0) {
      selectedInterns = [
        { name: '张三', skills: [82, 70, 85, 68, 90] },
        { name: '李四', skills: [75, 80, 72, 85, 78] },
        { name: '王五', skills: [88, 65, 78, 72, 85] }
      ];
    }

    var datasets = selectedInterns.map(function (intern, idx) {
      var color = CHART_COLORS.palette[idx % CHART_COLORS.palette.length];
      var skills = intern.skills || [0, 0, 0, 0, 0];
      return {
        label: intern.name,
        data: skills,
        backgroundColor: hexToRgba(color, 0.75),
        borderColor: color,
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      };
    });

    charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: skillLabels,
        datasets: datasets
      },
      options: {
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#a0a4b8', font: { size: 11 } }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#a0a4b8', stepSize: 20, font: { size: 11 } }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#d0d4e8',
              padding: 16,
              usePointStyle: true,
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20,22,36,0.95)',
            titleColor: '#fff',
            bodyColor: '#d0d4e8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12
          }
        }
      }
    });

    return charts[canvasId];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 7.5. BATCH COMPARISON CHART (DEPARTMENTS AVERAGE SKILLS)
  // ═══════════════════════════════════════════════════════════════════════
  function renderBatchComparison(canvasId) {
    if (!setDefaults()) return null;
    var canvas = getCanvas(canvasId);
    if (!canvas) return null;
    destroyChart(canvasId);

    var ctx = canvas.getContext('2d');
    var skillLabels = ['技术能力', '业务理解', '沟通协作', '创新思维', '执行力'];

    // Group interns by department and calculate averages
    var interns = (window.AppData && window.AppData.INTERNS) || (window.AppData && window.AppData.interns) || [];
    var deptData = {};
    
    interns.forEach(function (intern) {
      var dept = intern.department || '其他';
      if (!deptData[dept]) {
        deptData[dept] = {
          technical: [],
          business: [],
          communication: [],
          innovation: [],
          execution: []
        };
      }
      if (intern.skills) {
        deptData[dept].technical.push(intern.skills.technical || 0);
        deptData[dept].business.push(intern.skills.business || 0);
        deptData[dept].communication.push(intern.skills.communication || 0);
        deptData[dept].innovation.push(intern.skills.innovation || 0);
        deptData[dept].execution.push(intern.skills.execution || 0);
      }
    });

    var depts = Object.keys(deptData);
    
    // Fallback sample data if empty
    if (depts.length === 0) {
      depts = ['研发', '产品', '设计', '销售', '运营'];
      deptData = {
        '研发': { technical: [85], business: [65], communication: [70], innovation: [80], execution: [85] },
        '产品': { technical: [60], business: [85], communication: [88], innovation: [82], execution: [78] },
        '设计': { technical: [70], business: [68], communication: [78], innovation: [88], execution: [80] },
        '销售': { technical: [50], business: [80], communication: [90], innovation: [75], execution: [85] },
        '运营': { technical: [55], business: [75], communication: [85], innovation: [80], execution: [80] }
      };
    }

    var datasets = depts.map(function (dept, idx) {
      var color = CHART_COLORS.palette[idx % CHART_COLORS.palette.length];
      var data = deptData[dept];
      
      var averages = [
        window.Utils && typeof window.Utils.calculateAverage === 'function' ? window.Utils.calculateAverage(data.technical) : 75,
        window.Utils && typeof window.Utils.calculateAverage === 'function' ? window.Utils.calculateAverage(data.business) : 75,
        window.Utils && typeof window.Utils.calculateAverage === 'function' ? window.Utils.calculateAverage(data.communication) : 75,
        window.Utils && typeof window.Utils.calculateAverage === 'function' ? window.Utils.calculateAverage(data.innovation) : 75,
        window.Utils && typeof window.Utils.calculateAverage === 'function' ? window.Utils.calculateAverage(data.execution) : 75
      ];

      return {
        label: dept,
        data: averages,
        backgroundColor: hexToRgba(color, 0.75),
        borderColor: color,
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.8
      };
    });

    charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: skillLabels,
        datasets: datasets
      },
      options: {
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#a0a4b8', font: { size: 11 } }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#a0a4b8', stepSize: 20, font: { size: 11 } }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#d0d4e8',
              padding: 16,
              usePointStyle: true,
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20,22,36,0.95)',
            titleColor: '#fff',
            bodyColor: '#d0d4e8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12
          }
        }
      }
    });

    return charts[canvasId];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 8. TALENT MATRIX (9-Grid) — DOM-based
  // ═══════════════════════════════════════════════════════════════════════
  function renderTalentMatrix(containerId) {
    var container = document.getElementById(containerId);
    if (!container) {
      console.warn('[Dashboard] Container not found: ' + containerId);
      return;
    }
    container.innerHTML = '';

    var interns = (window.AppData && window.AppData.interns) || [];

    // Classify interns into 3x3 grid
    // X axis: Performance (低/中/高) — based on latest score
    // Y axis: Potential (低/中/高) — based on growth trend
    function getPerformanceLevel(intern) {
      var score = intern.weeklyScores && intern.weeklyScores.length
        ? intern.weeklyScores[intern.weeklyScores.length - 1]
        : (intern.score || 50);
      if (score >= 80) return 2; // 高
      if (score >= 60) return 1; // 中
      return 0; // 低
    }

    function getPotentialLevel(intern) {
      if (intern.weeklyScores && intern.weeklyScores.length >= 3) {
        var scores = intern.weeklyScores;
        var firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        var secondHalf = scores.slice(Math.floor(scores.length / 2));
        var avgFirst = firstHalf.reduce(function (a, b) { return a + b; }, 0) / firstHalf.length;
        var avgSecond = secondHalf.reduce(function (a, b) { return a + b; }, 0) / secondHalf.length;
        var growth = avgSecond - avgFirst;
        if (growth >= 10) return 2; // 高
        if (growth >= 3) return 1;  // 中
        return 0; // 低
      }
      if (intern.potential !== undefined) {
        if (intern.potential >= 80) return 2;
        if (intern.potential >= 60) return 1;
        return 0;
      }
      return 1; // default: 中
    }

    // Build grid data [row][col] — row 0 = 高潜力 (top), col 0 = 低绩效 (left)
    var grid = [[[], [], []], [[], [], []], [[], [], []]];

    // Use fallback interns if none
    var matrixInterns = interns.length > 0 ? interns : [
      { name: '张三', avatar: '👨‍💻', weeklyScores: [60, 65, 68, 72, 78, 82, 85, 88] },
      { name: '李四', avatar: '👩‍💻', weeklyScores: [70, 72, 74, 75, 76, 77, 78, 79] },
      { name: '王五', avatar: '👨‍🎓', weeklyScores: [55, 58, 60, 62, 63, 64, 65, 66] },
      { name: '赵六', avatar: '👩‍🎓', weeklyScores: [80, 82, 84, 86, 88, 90, 92, 94] },
      { name: '孙七', avatar: '👨‍💼', weeklyScores: [45, 47, 48, 49, 50, 51, 52, 53] },
      { name: '周八', avatar: '👩‍💼', weeklyScores: [72, 70, 68, 75, 80, 83, 87, 90] }
    ];

    matrixInterns.forEach(function (intern) {
      var perf = getPerformanceLevel(intern);
      var pot = getPotentialLevel(intern);
      // row: 2 - pot (so high potential is at top)
      grid[2 - pot][perf].push(intern);
    });

    // Cell colors and labels
    var cellConfig = [
      // Row 0 (高潜力)
      [
        { bg: 'rgba(255,184,0,0.12)', border: 'rgba(255,184,0,0.3)', label: '待培养', icon: '🌱' },
        { bg: 'rgba(0,196,255,0.12)', border: 'rgba(0,196,255,0.3)', label: '高潜力', icon: '🚀' },
        { bg: 'rgba(0,217,163,0.15)', border: 'rgba(0,217,163,0.4)', label: '⭐ 明星', icon: '⭐' }
      ],
      // Row 1 (中潜力)
      [
        { bg: 'rgba(255,77,106,0.1)', border: 'rgba(255,77,106,0.25)', label: '需关注', icon: '👀' },
        { bg: 'rgba(100,100,180,0.1)', border: 'rgba(100,100,180,0.25)', label: '中坚力量', icon: '💪' },
        { bg: 'rgba(0,82,217,0.12)', border: 'rgba(0,82,217,0.3)', label: '绩效之星', icon: '🏆' }
      ],
      // Row 2 (低潜力)
      [
        { bg: 'rgba(255,77,106,0.15)', border: 'rgba(255,77,106,0.4)', label: '⚠️ 需改进', icon: '⚠️' },
        { bg: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.25)', label: '稳定贡献', icon: '🔧' },
        { bg: 'rgba(0,196,255,0.1)', border: 'rgba(0,196,255,0.25)', label: '经验丰富', icon: '📚' }
      ]
    ];

    var potentialLabels = ['高', '中', '低'];
    var performanceLabels = ['低', '中', '高'];

    // Build the matrix DOM
    var wrapper = document.createElement('div');
    wrapper.className = 'talent-matrix';
    wrapper.style.cssText = 'display:grid; grid-template-columns:40px repeat(3,1fr); grid-template-rows:auto repeat(3,1fr) 30px; gap:6px; height:100%; min-height:320px; padding:8px;';

    // Title area (top-left corner)
    var corner = document.createElement('div');
    corner.style.cssText = 'display:flex; align-items:center; justify-content:center; font-size:10px; color:#a0a4b8;';
    wrapper.appendChild(corner);

    // Performance headers (top row)
    performanceLabels.forEach(function (label) {
      var header = document.createElement('div');
      header.style.cssText = 'display:flex; align-items:center; justify-content:center; font-size:11px; color:#d0d4e8; font-weight:600; padding:4px 0;';
      header.textContent = label + '绩效';
      wrapper.appendChild(header);
    });

    // Grid rows
    for (var row = 0; row < 3; row++) {
      // Y-axis label
      var yLabel = document.createElement('div');
      yLabel.style.cssText = 'display:flex; align-items:center; justify-content:center; writing-mode:vertical-lr; font-size:11px; color:#d0d4e8; font-weight:600; letter-spacing:2px;';
      yLabel.textContent = potentialLabels[row] + '潜力';
      wrapper.appendChild(yLabel);

      for (var col = 0; col < 3; col++) {
        var cfg = cellConfig[row][col];
        var cell = document.createElement('div');
        cell.className = 'talent-matrix-cell';
        cell.style.cssText = 'background:' + cfg.bg + '; border:1px solid ' + cfg.border + '; border-radius:10px; padding:8px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:4px; transition:all 0.3s ease; cursor:pointer; overflow:hidden;';

        // Cell label
        var cellLabel = document.createElement('div');
        cellLabel.style.cssText = 'font-size:10px; color:#a0a4b8; margin-bottom:2px; white-space:nowrap;';
        cellLabel.textContent = cfg.label;
        cell.appendChild(cellLabel);

        // Intern avatars in this cell
        var cellInterns = grid[row][col];
        if (cellInterns.length > 0) {
          var avatarContainer = document.createElement('div');
          avatarContainer.style.cssText = 'display:flex; flex-wrap:wrap; gap:4px; justify-content:center; align-items:center;';

          cellInterns.forEach(function (intern) {
            var avatarEl = document.createElement('div');
            avatarEl.className = 'talent-matrix-avatar';
            avatarEl.title = intern.name;
            avatarEl.style.cssText = 'width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:14px; cursor:pointer; transition:transform 0.2s; border:2px solid ' + cfg.border + ';';
            avatarEl.textContent = intern.avatar || intern.name.charAt(0);

            avatarEl.addEventListener('mouseenter', function () {
              this.style.transform = 'scale(1.2)';
            });
            avatarEl.addEventListener('mouseleave', function () {
              this.style.transform = 'scale(1)';
            });

            avatarContainer.appendChild(avatarEl);
          });
          cell.appendChild(avatarContainer);
        } else {
          var empty = document.createElement('div');
          empty.style.cssText = 'font-size:10px; color:rgba(160,164,184,0.4); margin-top:8px;';
          empty.textContent = '—';
          cell.appendChild(empty);
        }

        // Count badge
        if (cellInterns.length > 0) {
          var badge = document.createElement('div');
          badge.style.cssText = 'font-size:10px; color:rgba(160,164,184,0.7); margin-top:auto; padding-top:2px;';
          badge.textContent = cellInterns.length + '人';
          cell.appendChild(badge);
        }

        // Hover effect
        (function (c, bg) {
          c.addEventListener('mouseenter', function () {
            c.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            c.style.transform = 'translateY(-2px)';
          });
          c.addEventListener('mouseleave', function () {
            c.style.boxShadow = 'none';
            c.style.transform = 'translateY(0)';
          });
        })(cell, cfg.bg);

        wrapper.appendChild(cell);
      }
    }

    // Bottom row: empty + performance axis label
    var bottomEmpty = document.createElement('div');
    wrapper.appendChild(bottomEmpty);
    var axisLabel = document.createElement('div');
    axisLabel.style.cssText = 'grid-column:2/5; display:flex; align-items:center; justify-content:center; font-size:11px; color:#a0a4b8;';
    axisLabel.textContent = '绩效 →';
    wrapper.appendChild(axisLabel);

    container.appendChild(wrapper);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════
  window.Dashboard = {
    charts: charts,
    CHART_COLORS: CHART_COLORS,
    destroyAll: destroyAll,
    renderInternRadar: renderInternRadar,
    renderInternProgress: renderInternProgress,
    renderHROverview: renderHROverview,
    renderHRScoreDistribution: renderHRScoreDistribution,
    renderHRProgressTrend: renderHRProgressTrend,
    renderHRConversionPie: renderHRConversionPie,
    renderMentorComparison: renderMentorComparison,
    renderBatchComparison: renderBatchComparison,
    renderTalentMatrix: renderTalentMatrix
  };

  // Initialize defaults on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setDefaults);
  } else {
    setDefaults();
  }

})();
