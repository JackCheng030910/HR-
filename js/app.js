/**
 * 实习能量站 - 主控制器
 * 负责角色切换、视图路由、页面渲染
 */
;(function () {
  'use strict';

  const App = {
    currentRole: 'intern',
    currentView: '',
    selectedInternId: null,
    selectedMentorId: null,

    /* ========== 菜单配置 ========== */
    menus: {
      intern: [
        { id: 'growth-map', icon: '🗺️', label: '我的成长地图' },
        { id: 'task-list', icon: '📋', label: '学习任务清单' },
        { id: 'skill-radar', icon: '📊', label: '能力雷达图' },
        { id: 'weekly-report', icon: '📝', label: '成长周报' }
      ],
      mentor: [
        { id: 'mentor-board', icon: '📌', label: '带教看板' },
        { id: 'teach-plan', icon: '📅', label: '标准化带教计划' },
        { id: 'evaluation', icon: '⭐', label: '周评估表' },
        { id: 'risk-alert', icon: '⚠️', label: '风险预警' }
      ],
      hr: [
        { id: 'hr-dashboard', icon: '📈', label: '全局数据看板' },
        { id: 'talent-matrix', icon: '🧩', label: '人才矩阵' },
        { id: 'batch-report', icon: '📊', label: '批量对比报告' },
        { id: 'conversion', icon: '🚀', label: '转正预测' }
      ]
    },

    /* ========== 初始化 ========== */
    init() {
      this.initUsers();
      this.bindLoginEvents();
      this.bindRoleSwitcher();
      this.bindSidebar();
      this.bindGlobalEvents();

      const savedUser = localStorage.getItem('loggedInUser');
      const savedNick = localStorage.getItem('loggedInUserNick');
      if (savedUser && savedNick) {
        this.loginSuccess(savedUser, savedNick, true);
      } else {
        const overlay = document.getElementById('loginOverlay');
        if (overlay) overlay.classList.remove('hidden');
      }

      this.switchRole('intern');
    },

    /* ========== 初始化注册用户列表 ========== */
    initUsers() {
      const usersKey = 'IES_RegisteredUsers';
      let users = localStorage.getItem(usersKey);
      if (!users) {
        users = [
          { email: 'hr@tencent.com', password: '123456', name: '腾讯管理员' }
        ];
        localStorage.setItem(usersKey, JSON.stringify(users));
      }
    },

    /* ========== 登录系统逻辑 ========== */
    bindLoginEvents() {
      const tabEmail = document.getElementById('tabEmail');
      const tabGuest = document.getElementById('tabGuest');
      const emailLoginForm = document.getElementById('emailLoginForm');
      const emailRegisterForm = document.getElementById('emailRegisterForm');
      const guestLoginForm = document.getElementById('guestLoginForm');
      
      const loginEmail = document.getElementById('loginEmail');
      const loginPassword = document.getElementById('loginPassword');
      const loginError = document.getElementById('loginError');
      const btnEmailLogin = document.getElementById('btnEmailLogin');
      
      const registerName = document.getElementById('registerName');
      const registerEmail = document.getElementById('registerEmail');
      const registerCode = document.getElementById('registerCode');
      const btnSendCode = document.getElementById('btnSendCode');
      const registerPassword = document.getElementById('registerPassword');
      const registerError = document.getElementById('registerError');
      const btnEmailRegister = document.getElementById('btnEmailRegister');
      
      const btnGuestLogin = document.getElementById('btnGuestLogin');
      
      const linkToRegister = document.getElementById('linkToRegister');
      const linkToLogin = document.getElementById('linkToLogin');
      const loginTabs = document.getElementById('loginTabs');
      const loginSubtitle = document.getElementById('loginSubtitle');

      const self = this;

      function showError(el, msg) {
        if (el) {
          el.textContent = msg;
          el.style.opacity = 1;
        }
      }

      function clearError(el) {
        if (el) {
          el.textContent = '';
        }
      }

      // 切换 Tab (邮箱登录/游客体验)
      if (tabEmail && tabGuest && emailLoginForm && guestLoginForm && emailRegisterForm) {
        tabEmail.addEventListener('click', () => {
          tabEmail.classList.add('active');
          tabGuest.classList.remove('active');
          emailLoginForm.classList.remove('hidden');
          guestLoginForm.classList.add('hidden');
          emailRegisterForm.classList.add('hidden');
          if (loginSubtitle) loginSubtitle.textContent = '请选择您的登录体验方式';
          clearError(loginError);
          clearError(registerError);
        });

        tabGuest.addEventListener('click', () => {
          tabGuest.classList.add('active');
          tabEmail.classList.remove('active');
          guestLoginForm.classList.remove('hidden');
          emailLoginForm.classList.add('hidden');
          emailRegisterForm.classList.add('hidden');
          if (loginSubtitle) loginSubtitle.textContent = '请选择您的登录体验方式';
          clearError(loginError);
          clearError(registerError);
        });
      }

      // 跳转去注册
      if (linkToRegister && emailRegisterForm && emailLoginForm && loginTabs && loginSubtitle) {
        linkToRegister.addEventListener('click', () => {
          emailLoginForm.classList.add('hidden');
          emailRegisterForm.classList.remove('hidden');
          loginTabs.classList.add('hidden');
          loginSubtitle.textContent = '注册您的能量站账号';
          clearError(loginError);
        });
      }

      // 返回登录
      if (linkToLogin && emailRegisterForm && emailLoginForm && loginTabs && loginSubtitle) {
        linkToLogin.addEventListener('click', () => {
          emailRegisterForm.classList.add('hidden');
          emailLoginForm.classList.remove('hidden');
          loginTabs.classList.remove('hidden');
          loginSubtitle.textContent = '请选择您的登录体验方式';
          clearError(registerError);
        });
      }

      // 发送验证码
      if (btnSendCode && registerEmail) {
        btnSendCode.addEventListener('click', () => {
          const email = registerEmail.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!email) {
            showError(registerError, '请先输入邮箱地址');
            return;
          }
          if (!emailRegex.test(email)) {
            showError(registerError, '邮箱格式不正确');
            return;
          }
          clearError(registerError);

          // 生成随机验证码
          const code = Math.floor(100000 + Math.random() * 900000).toString();
          self.currentVerificationCode = code;
          self.verificationEmail = email;

          // 倒计时限制
          let seconds = 60;
          btnSendCode.disabled = true;
          btnSendCode.textContent = `${seconds}s后重试`;
          const timer = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
              clearInterval(timer);
              btnSendCode.disabled = false;
              btnSendCode.textContent = '获取验证码';
            } else {
              btnSendCode.textContent = `${seconds}s后重试`;
            }
          }, 1000);

          // 弹出高保真模拟通知框
          self.showToast('✉️ 验证码已发送', `[模拟邮件服务] 您的验证码为：<strong>${code}</strong>，请于5分钟内输入以完成验证。`, 'success');
        });
      }

      // 注册提交
      if (btnEmailRegister && registerName && registerEmail && registerCode && registerPassword) {
        btnEmailRegister.addEventListener('click', () => {
          const name = registerName.value.trim();
          const email = registerEmail.value.trim();
          const code = registerCode.value.trim();
          const pwd = registerPassword.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!name) { showError(registerError, '请输入个性昵称'); return; }
          if (!email) { showError(registerError, '请输入邮箱地址'); return; }
          if (!emailRegex.test(email)) { showError(registerError, '邮箱格式不正确'); return; }
          if (!code) { showError(registerError, '请输入验证码'); return; }
          if (code !== self.currentVerificationCode || email !== self.verificationEmail) {
            showError(registerError, '验证码不正确或邮箱已变更');
            return;
          }
          if (!pwd || pwd.length < 6) { showError(registerError, '密码长度不能少于6位'); return; }

          clearError(registerError);

          const usersKey = 'IES_RegisteredUsers';
          let users = JSON.parse(localStorage.getItem(usersKey) || '[]');
          
          const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (exists) {
            showError(registerError, '该邮箱已被注册');
            return;
          }

          // 保存新用户
          users.push({ email: email, password: pwd, name: name });
          localStorage.setItem(usersKey, JSON.stringify(users));

          self.showToast('🎉 注册成功', '您的账号已成功建立，请进行登录。', 'success');

          // 自动跳转并填入
          if (linkToLogin) linkToLogin.click();
          if (loginEmail) loginEmail.value = email;
          if (loginPassword) {
            loginPassword.value = '';
            loginPassword.focus();
          }

          // 重置状态
          self.currentVerificationCode = null;
          self.verificationEmail = null;
          registerName.value = '';
          registerEmail.value = '';
          registerCode.value = '';
          registerPassword.value = '';
        });
      }

      // 登录提交
      if (btnEmailLogin && loginEmail && loginPassword) {
        btnEmailLogin.addEventListener('click', () => {
          const email = loginEmail.value.trim();
          const pwd = loginPassword.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!email) { showError(loginError, '请输入邮箱地址'); return; }
          if (!emailRegex.test(email)) { showError(loginError, '邮箱格式不正确'); return; }
          if (!pwd) { showError(loginError, '请输入登录密码'); return; }

          const usersKey = 'IES_RegisteredUsers';
          const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

          if (!user || user.password !== pwd) {
            showError(loginError, '邮箱或密码错误，请重试');
            return;
          }

          clearError(loginError);
          self.loginSuccess(user.email, user.name);
        });

        loginEmail.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') loginPassword.focus();
        });

        loginPassword.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') btnEmailLogin.click();
        });
      }

      // 游客登录
      if (btnGuestLogin) {
        btnGuestLogin.addEventListener('click', () => {
          self.loginSuccess('游客', '游客体验');
        });
      }
    },

    loginSuccess(email, nickname, silent = false) {
      localStorage.setItem('loggedInUser', email);
      localStorage.setItem('loggedInUserNick', nickname);
      if (window.AppData) {
        window.AppData.currentUser = email;
        window.AppData.currentUserNick = nickname;
      }

      // 更新顶部显示名称
      const nameEl = document.getElementById('currentUserName');
      if (nameEl) {
        nameEl.textContent = nickname;
      }

      // 隐藏登录遮罩
      const overlay = document.getElementById('loginOverlay');
      if (overlay) {
        overlay.classList.add('hidden');
      }

      // 清空登录输入
      const loginEmail = document.getElementById('loginEmail');
      const loginPassword = document.getElementById('loginPassword');
      if (loginEmail) loginEmail.value = '';
      if (loginPassword) loginPassword.value = '';

      // 触发 AI 聊天欢迎信息更新
      if (window.AIAssistant && !silent) {
        window.AIAssistant.clearChat();
      }
    },

    logout() {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('loggedInUserNick');
      if (window.AppData) {
        window.AppData.currentUser = null;
        window.AppData.currentUserNick = null;
      }

      // 重置顶部用户名
      const nameEl = document.getElementById('currentUserName');
      if (nameEl) nameEl.textContent = 'Demo 用户';

      // 弹出登录遮罩
      const overlay = document.getElementById('loginOverlay');
      if (overlay) {
        overlay.classList.remove('hidden');
      }

      // 重置表单状态
      const tabEmail = document.getElementById('tabEmail');
      if (tabEmail) tabEmail.click();

      // 重置 AI 助手
      if (window.AIAssistant) {
        window.AIAssistant.clearChat();
      }
    },

    /* ========== 全局通知助手 (Toast) ========== */
    showToast(title, message, type = 'info') {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icons = {
        success: '✅',
        warning: '⚠️',
        danger: '🚨',
        info: 'ℹ️'
      };

      toast.innerHTML = `
        <div class="toast-icon">${icons[type] || '🔔'}</div>
        <div class="toast-body">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">✕</button>
      `;

      const self = this;
      const closeBtn = toast.querySelector('.toast-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => self.dismissToast(toast));
      }

      container.appendChild(toast);

      // 8秒后自动关闭
      setTimeout(() => {
        if (toast.parentNode) self.dismissToast(toast);
      }, 8000);
    },

    dismissToast(toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 300);
    },

    /* ========== 角色切换 ========== */
    bindRoleSwitcher() {
      document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const role = btn.dataset.role;
          this.switchRole(role);
        });
      });
    },

    switchRole(role) {
      this.currentRole = role;
      document.body.setAttribute('data-theme', role);
      if (window.AppData) {
        window.AppData.currentRole = role;
      }

      // Update active button
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`.role-btn[data-role="${role}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      // Update sidebar title
      const titles = { intern: '实习生工作台', mentor: '导师工作台', hr: 'HR 管理台' };
      const titleEl = document.getElementById('sidebarTitle');
      if (titleEl) titleEl.textContent = titles[role];

      // Set default selected entities
      if (role === 'intern') {
        this.selectedInternId = window.AppData?.INTERNS?.[0]?.id || 'intern-01';
      } else if (role === 'mentor') {
        this.selectedMentorId = window.AppData?.MENTORS?.[0]?.id || 'mentor-01';
      }

      // Render sidebar
      this.renderSidebar(role);

      // Switch to first view
      const firstView = this.menus[role][0].id;
      this.switchView(firstView);

      // Update AI assistant quick actions
      if (window.AIAssistant) {
        window.AIAssistant.updateRole(role);
      }
    },

    /* ========== 侧边栏 ========== */
    renderSidebar(role) {
      const menu = this.menus[role];
      const container = document.getElementById('sidebarMenu');
      if (!container) return;

      container.innerHTML = menu.map((item, i) => `
        <li class="menu-item ${i === 0 ? 'active' : ''}" data-view="${item.id}" style="--delay: ${i * 0.05}s">
          <span class="menu-icon">${item.icon}</span>
          <span class="menu-label">${item.label}</span>
        </li>
      `).join('');
    },

    bindSidebar() {
      document.getElementById('sidebarMenu')?.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (!item) return;
        const view = item.dataset.view;
        this.switchView(view);

        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        item.classList.add('active');
      });
    },

    /* ========== 视图路由 ========== */
    switchView(viewId) {
      this.currentView = viewId;
      const main = document.getElementById('mainContent');
      if (!main) return;

      // Destroy old charts
      if (window.Dashboard) window.Dashboard.destroyAll();

      // Animate out
      main.style.opacity = '0';
      main.style.transform = 'translateY(12px)';

      setTimeout(() => {
        const renderer = this.viewRenderers[viewId];
        if (renderer) {
          main.innerHTML = renderer.call(this);
          this.postRender(viewId);
        } else {
          main.innerHTML = `<div class="card"><h2>功能开发中...</h2></div>`;
        }
        // Animate in
        requestAnimationFrame(() => {
          main.style.opacity = '1';
          main.style.transform = 'translateY(0)';
        });
      }, 200);
    },

    /* ========== 视图渲染器集合 ========== */
    viewRenderers: {

      /* ---------- 实习生：成长地图 ---------- */
      'growth-map'() {
        const intern = this.getSelectedIntern();
        if (!intern) return '<div class="card">暂无数据</div>';
        const phaseLabels = ['认知融入期', '技能成长期', '独立产出期'];
        const phaseColors = ['#00D9A3', '#FFB800', '#FF4D6A'];
        const phaseDays = ['1-30天', '31-60天', '61-90天'];

        // AI Insight: auto-analyze strengths and weaknesses
        const skills = intern.skills;
        const skillNames = { technical: '技术能力', business: '业务理解', communication: '沟通协作', innovation: '创新思维', execution: '执行力' };
        const sorted = Object.entries(skills).sort((a, b) => b[1] - a[1]);
        const strongest = sorted[0];
        const weakest = sorted[sorted.length - 1];
        const trend = intern.weeklyScores;
        const recentTrend = trend.length >= 2 ? trend[trend.length - 1] - trend[trend.length - 2] : 0;
        const trendText = recentTrend > 0 ? `📈 近期评分上升 +${recentTrend} 分，成长势头良好` : recentTrend < 0 ? `📉 近期评分下降 ${recentTrend} 分，需关注` : '➡️ 近期评分持平';

        return `
          <div class="page-header">
            <h1 class="page-title">🗺️ 我的成长地图</h1>
            ${this.renderInternSelector(intern)}
          </div>

          <div class="ai-insight-card animate-in" style="--delay:0s">
            <div class="insight-header">🧠 AI 成长洞察</div>
            <div class="insight-body">
              <strong>${intern.name}</strong> 的核心优势在 <strong>${skillNames[strongest[0]]}（${strongest[1]}分）</strong>，
              建议下一步重点提升 <strong>${skillNames[weakest[0]]}（${weakest[1]}分）</strong>。
              ${trendText}。
              当前处于 <strong>Phase ${intern.currentPhase}（${phaseLabels[intern.currentPhase - 1]}）</strong>，总体进度 <strong>${intern.overallProgress}%</strong>。
            </div>
          </div>

          <div class="grid-4">
            <div class="stat-card animate-in" style="--delay:0.05s">
              <div class="stat-icon">📅</div>
              <div class="stat-value" data-countup="${window.Utils?.getDaysSince(intern.startDate) || 0}">${window.Utils?.getDaysSince(intern.startDate) || 0}</div>
              <div class="stat-label">实习天数</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.1s">
              <div class="stat-icon">🎯</div>
              <div class="stat-value" data-countup="${intern.overallProgress}">${intern.overallProgress}%</div>
              <div class="stat-label">总体进度</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.15s">
              <div class="stat-icon">⭐</div>
              <div class="stat-value" data-countup="${intern.weeklyScores[intern.weeklyScores.length - 1]}">${intern.weeklyScores[intern.weeklyScores.length - 1]}</div>
              <div class="stat-label">最新评分</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.2s">
              <div class="stat-icon">🏅</div>
              <div class="stat-value">${intern.conversionRating}</div>
              <div class="stat-label">转正预测</div>
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.25s">
            <div class="card-header"><h2>30-60-90 天里程碑</h2></div>
            <div class="timeline">
              ${intern.milestones.map((ms, i) => `
                <div class="timeline-item ${ms.status}" data-phase="${i + 1}">
                  <div class="timeline-dot" style="--phase-color: ${phaseColors[i]}">
                    ${ms.status === 'completed' ? '✓' : ms.status === 'in-progress' ? '◉' : '○'}
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-phase" style="color:${phaseColors[i]}">
                      Phase ${i + 1} · ${phaseLabels[i]}
                      <span class="timeline-days">${phaseDays[i]}</span>
                    </div>
                    <div class="timeline-items">
                      ${ms.items.map(item => `
                        <div class="timeline-check ${ms.status === 'completed' ? 'done' : ''}">
                          <span class="check-icon">${ms.status === 'completed' ? '✅' : ms.status === 'in-progress' && i === intern.currentPhase - 1 ? '🔄' : '⬜'}</span>
                          <span>${item}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.35s">
            <div class="card-header"><h2>成长趋势</h2></div>
            <div class="chart-container">
              <canvas id="internProgressChart"></canvas>
            </div>
          </div>
        `;
      },

      /* ---------- 实习生：任务清单 ---------- */
      'task-list'() {
        const intern = this.getSelectedIntern();
        if (!intern) return '<div class="card">暂无数据</div>';

        const priorityMap = { high: { label: '高', class: 'danger' }, medium: { label: '中', class: 'warning' }, low: { label: '低', class: 'info' } };
        const statusIcons = { completed: '✅', 'in-progress': '🔄', pending: '⬜' };
        const statusLabels = { completed: '已完成', 'in-progress': '进行中', pending: '待开始' };

        return `
          <div class="page-header">
            <h1 class="page-title">📋 学习任务清单</h1>
            ${this.renderInternSelector(intern)}
          </div>

          <div class="grid-3">
            <div class="stat-card animate-in" style="--delay:0s">
              <div class="stat-icon">✅</div>
              <div class="stat-value" data-countup="${intern.tasks.filter(t => t.status === 'completed').length}">${intern.tasks.filter(t => t.status === 'completed').length}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.05s">
              <div class="stat-icon">🔄</div>
              <div class="stat-value" data-countup="${intern.tasks.filter(t => t.status === 'in-progress').length}">${intern.tasks.filter(t => t.status === 'in-progress').length}</div>
              <div class="stat-label">进行中</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.1s">
              <div class="stat-icon">⬜</div>
              <div class="stat-value" data-countup="${intern.tasks.filter(t => t.status === 'pending').length}">${intern.tasks.filter(t => t.status === 'pending').length}</div>
              <div class="stat-label">待开始</div>
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.15s">
            <div class="card-header">
              <h2>任务列表</h2>
              <span class="badge badge-info">${intern.tasks.length} 项任务</span>
            </div>
            <div class="task-list" id="taskListContainer">
              ${intern.tasks.map((task, i) => `
                <div class="task-item ${task.status}" data-task-idx="${i}" style="--delay: ${i * 0.05}s">
                  <div class="task-toggle" data-idx="${i}">${statusIcons[task.status]}</div>
                  <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                      <span class="badge badge-${priorityMap[task.priority].class}">${priorityMap[task.priority].label}优先</span>
                      <span class="task-due">截止: ${task.dueDate}</span>
                      <span class="badge badge-${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : 'info'}" style="margin-left:4px">${statusLabels[task.status]}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 12px; opacity: 0.6;">💡 点击左侧图标可切换任务状态</p>
          </div>
        `;
      },

      /* ---------- 实习生：能力雷达 ---------- */
      'skill-radar'() {
        const intern = this.getSelectedIntern();
        if (!intern) return '<div class="card">暂无数据</div>';

        const dims = window.AppData?.SKILL_DIMENSIONS || ['技术能力', '业务理解', '沟通协作', '创新思维', '执行力'];
        const values = intern.skills;
        const avg = Math.round(Object.values(values).reduce((a, b) => a + b, 0) / Object.values(values).length);

        return `
          <div class="page-header">
            <h1 class="page-title">📊 能力雷达图</h1>
            ${this.renderInternSelector(intern)}
          </div>

          <div class="grid-2">
            <div class="card animate-in" style="--delay:0s">
              <div class="card-header"><h2>五维能力画像</h2></div>
              <div class="chart-container radar-chart-container">
                <canvas id="skillRadarChart"></canvas>
              </div>
            </div>
            <div class="card animate-in" style="--delay:0.1s">
              <div class="card-header"><h2>能力详情</h2></div>
              <div class="skill-detail-list">
                ${dims.map((dim, i) => {
                  const val = Object.values(values)[i];
                  const color = val >= 80 ? '#00D9A3' : val >= 60 ? '#FFB800' : '#FF4D6A';
                  return `
                    <div class="skill-detail-item">
                      <div class="skill-detail-header">
                        <span class="skill-name">${dim}</span>
                        <span class="skill-score" style="color:${color}">${val}</span>
                      </div>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width:${val}%; background:${color}; --target-width:${val}%"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
                <div class="skill-detail-item" style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08)">
                  <div class="skill-detail-header">
                    <span class="skill-name" style="font-weight:600">综合评分</span>
                    <span class="skill-score" style="color:#00C4FF; font-size:1.5rem">${avg}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      },

      /* ---------- 实习生：成长周报 ---------- */
      'weekly-report'() {
        const intern = this.getSelectedIntern();
        if (!intern) return '<div class="card">暂无数据</div>';
        const report = intern.weeklyReports?.[0];

        return `
          <div class="page-header">
            <h1 class="page-title">📝 成长周报</h1>
            ${this.renderInternSelector(intern)}
          </div>

          <div class="card animate-in" style="--delay:0s">
            <div class="card-header">
              <h2>第 ${report?.week || '--'} 周总结</h2>
              <span class="badge badge-success">评分: ${report?.score || '--'}</span>
            </div>
            <div class="weekly-report-content">
              <p>${report?.summary || '暂无周报数据'}</p>
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.1s">
            <div class="card-header">
              <h2>AI 周报生成</h2>
              <button class="btn btn-primary btn-sm" id="generateReport">✨ AI 生成周报</button>
            </div>
            <div id="aiReportArea" class="ai-report-area">
              <p class="hint-text">点击上方按钮，AI 将基于你的本周任务和评分自动生成周报草稿</p>
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.2s">
            <div class="card-header"><h2>历史评分趋势</h2></div>
            <div class="chart-container">
              <canvas id="weeklyScoreChart"></canvas>
            </div>
          </div>
        `;
      },

      /* ---------- 导师：带教看板 ---------- */
      'mentor-board'() {
        const mentor = this.getSelectedMentor();
        if (!mentor) return '<div class="card">暂无数据</div>';
        const interns = this.getMentorInterns(mentor.id);

        return `
          <div class="page-header">
            <h1 class="page-title">📌 带教看板</h1>
            <div class="intern-profile-mini">
              <span class="avatar-lg">${mentor.avatar}</span>
              <div>
                <div class="intern-name">${mentor.name}</div>
                <div class="intern-dept">${mentor.title} · 带教 ${interns.length} 人</div>
              </div>
            </div>
          </div>

          <div class="grid-3">
            <div class="stat-card animate-in" style="--delay:0s">
              <div class="stat-icon">👥</div>
              <div class="stat-value">${interns.length}</div>
              <div class="stat-label">在带学员</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.05s">
              <div class="stat-icon">📈</div>
              <div class="stat-value">${Math.round(interns.reduce((s, i) => s + i.overallProgress, 0) / interns.length)}%</div>
              <div class="stat-label">平均进度</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.1s">
              <div class="stat-icon">⚠️</div>
              <div class="stat-value">${interns.filter(i => i.riskFlags && i.riskFlags.length > 0).length}</div>
              <div class="stat-label">风险预警</div>
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.15s">
            <div class="card-header"><h2>学员概览</h2></div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>学员</th>
                  <th>岗位</th>
                  <th>阶段</th>
                  <th>进度</th>
                  <th>最新评分</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                ${interns.map((intern, i) => {
                  const latestScore = intern.weeklyScores[intern.weeklyScores.length - 1];
                  const hasRisk = intern.riskFlags && intern.riskFlags.length > 0;
                  const phaseLabel = ['融入期', '成长期', '产出期'][intern.currentPhase - 1];
                  return `
                    <tr class="animate-in" style="--delay:${i * 0.05}s" data-intern-id="${intern.id}">
                      <td><span class="avatar-sm">${intern.avatar}</span> ${intern.name}</td>
                      <td>${intern.position}</td>
                      <td><span class="badge badge-info">Phase ${intern.currentPhase} · ${phaseLabel}</span></td>
                      <td>
                        <div class="progress-bar progress-bar-sm">
                          <div class="progress-fill" style="width:${intern.overallProgress}%; --target-width:${intern.overallProgress}%"></div>
                        </div>
                        <span class="progress-text">${intern.overallProgress}%</span>
                      </td>
                      <td><span class="score-text">${latestScore}</span></td>
                      <td>${hasRisk ? `<span class="badge badge-danger">⚠ ${intern.riskFlags[0]}</span>` : '<span class="badge badge-success">正常</span>'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="card animate-in" style="--delay:0.25s">
            <div class="card-header"><h2>学员能力对比</h2></div>
            <div class="chart-container">
              <canvas id="mentorComparisonChart"></canvas>
            </div>
          </div>
        `;
      },

      /* ---------- 导师：标准化带教计划 ---------- */
      'teach-plan'() {
        const phases = window.AppData?.PHASE_CONFIG || [];
        return `
          <div class="page-header">
            <h1 class="page-title">📅 标准化带教计划</h1>
            <button class="btn btn-primary" id="aiGeneratePlan">🤖 AI 生成个性化带教计划</button>
          </div>

          <div class="timeline-horizontal">
            ${phases.map((phase, i) => `
              <div class="card animate-in phase-card" style="--delay:${i * 0.1}s; --phase-color:${phase.color}">
                <div class="phase-header" style="border-left: 4px solid ${phase.color}">
                  <div class="phase-badge" style="background:${phase.color}">Phase ${phase.phase}</div>
                  <h3>${phase.name}</h3>
                  <span class="phase-days">${phase.days}</span>
                </div>
                <div class="phase-goals">
                  <h4>🎯 阶段目标</h4>
                  <ul>${phase.goals.map(g => `<li>${g}</li>`).join('')}</ul>
                </div>
                <div class="phase-activities">
                  <h4>📋 关键活动</h4>
                  <ul>${phase.keyActivities.map(a => `<li>${a}</li>`).join('')}</ul>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="card animate-in" style="--delay:0.3s" id="aiPlanResult">
            <div class="card-header"><h2>AI 个性化带教建议</h2></div>
            <p class="hint-text">点击上方按钮，AI 将根据学员特点生成个性化带教方案</p>
          </div>
        `;
      },

      /* ---------- 导师：周评估 ---------- */
      'evaluation'() {
        const mentor = this.getSelectedMentor();
        if (!mentor) return '<div class="card">暂无数据</div>';
        const interns = this.getMentorInterns(mentor.id);

        return `
          <div class="page-header">
            <h1 class="page-title">⭐ 周评估表</h1>
          </div>

          <div class="card animate-in" style="--delay:0s">
            <div class="card-header">
              <h2>选择评估学员</h2>
            </div>
            <div class="intern-selector">
              ${interns.map((intern, i) => `
                <button class="intern-select-btn ${i === 0 ? 'active' : ''}" data-id="${intern.id}">
                  <span class="avatar-sm">${intern.avatar}</span>
                  <span>${intern.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.1s">
            <div class="card-header"><h2>评估表单</h2></div>
            <form class="eval-form" id="evalForm">
              <div class="eval-grid">
                ${['技术能力', '业务理解', '沟通协作', '创新思维', '执行力'].map(dim => `
                  <div class="form-group">
                    <label class="form-label">${dim}</label>
                    <div class="rating-input">
                      <input type="range" min="0" max="100" value="75" class="form-range" name="${dim}">
                      <span class="range-value">75</span>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="form-group">
                <label class="form-label">导师评语</label>
                <textarea class="form-textarea" rows="4" placeholder="请输入对学员本周表现的评价与建议..."></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-primary" id="submitEval">提交评估</button>
                <button type="button" class="btn btn-ghost" id="aiEvalSuggest">🤖 AI 评语建议</button>
              </div>
            </form>
          </div>
        `;
      },

      /* ---------- 导师：风险预警 ---------- */
      'risk-alert'() {
        const allInterns = window.AppData?.INTERNS || [];
        const riskInterns = allInterns.filter(i => i.riskFlags && i.riskFlags.length > 0);

        return `
          <div class="page-header">
            <h1 class="page-title">⚠️ 风险预警</h1>
            <span class="badge badge-danger">${riskInterns.length} 名学员需关注</span>
          </div>

          ${riskInterns.length === 0 ? '<div class="card"><p class="hint-text">🎉 当前无风险预警，所有学员状态良好！</p></div>' :
            riskInterns.map((intern, i) => `
              <div class="card risk-card animate-in" style="--delay:${i * 0.08}s">
                <div class="risk-header">
                  <div class="risk-intern">
                    <span class="avatar-sm">${intern.avatar}</span>
                    <div>
                      <div class="intern-name">${intern.name}</div>
                      <div class="intern-dept">${intern.department} · ${intern.position}</div>
                    </div>
                  </div>
                  <div class="risk-flags">
                    ${intern.riskFlags.map(f => `<span class="badge badge-danger">⚠ ${f}</span>`).join('')}
                  </div>
                </div>
                <div class="risk-body">
                  <div class="risk-metrics">
                    <div>进度: <strong>${intern.overallProgress}%</strong></div>
                    <div>最新评分: <strong>${intern.weeklyScores[intern.weeklyScores.length - 1]}</strong></div>
                    <div>转正预测: <strong class="${intern.conversionRating === 'D' ? 'text-danger' : ''}">${intern.conversionRating}</strong></div>
                  </div>
                  <div class="risk-action-bar">
                    <button class="btn btn-primary btn-sm ai-intervene-btn" data-intern-id="${intern.id}">🤖 AI 干预建议</button>
                  </div>
                  <div class="ai-intervention-result" id="intervention-${intern.id}" style="display:none"></div>
                </div>
              </div>
            `).join('')
          }
        `;
      },

      /* ---------- HR：全局数据看板 ---------- */
      'hr-dashboard'() {
        const interns = window.AppData?.INTERNS || [];
        const avgProgress = Math.round(interns.reduce((s, i) => s + i.overallProgress, 0) / interns.length);
        const avgScore = Math.round(interns.reduce((s, i) => s + i.weeklyScores[i.weeklyScores.length - 1], 0) / interns.length);
        const riskCount = interns.filter(i => i.riskFlags && i.riskFlags.length > 0).length;
        const aCount = interns.filter(i => i.conversionRating === 'A').length;

        return `
          <div class="page-header">
            <h1 class="page-title">📈 全局数据看板</h1>
            <span class="badge badge-info">实时更新</span>
          </div>

          <div class="grid-4">
            <div class="stat-card animate-in" style="--delay:0s">
              <div class="stat-icon">👥</div>
              <div class="stat-value" data-countup="${interns.length}">${interns.length}</div>
              <div class="stat-label">在岗实习生</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.05s">
              <div class="stat-icon">📈</div>
              <div class="stat-value" data-countup="${avgProgress}">${avgProgress}%</div>
              <div class="stat-label">平均进度</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.1s">
              <div class="stat-icon">⭐</div>
              <div class="stat-value" data-countup="${avgScore}">${avgScore}</div>
              <div class="stat-label">平均评分</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.15s">
              <div class="stat-icon">🏆</div>
              <div class="stat-value" data-countup="${aCount}">${aCount}</div>
              <div class="stat-label">A级人才</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="card animate-in" style="--delay:0.2s">
              <div class="card-header"><h2>部门分布</h2></div>
              <div class="chart-container">
                <canvas id="hrDeptChart"></canvas>
              </div>
            </div>
            <div class="card animate-in" style="--delay:0.25s">
              <div class="card-header"><h2>评分分布</h2></div>
              <div class="chart-container">
                <canvas id="hrScoreChart"></canvas>
              </div>
            </div>
          </div>

          <div class="grid-2">
            <div class="card animate-in" style="--delay:0.3s">
              <div class="card-header"><h2>批次进度趋势</h2></div>
              <div class="chart-container">
                <canvas id="hrTrendChart"></canvas>
              </div>
            </div>
            <div class="card animate-in" style="--delay:0.35s">
              <div class="card-header"><h2>转正评级分布</h2></div>
              <div class="chart-container">
                <canvas id="hrConversionChart"></canvas>
              </div>
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.4s">
            <div class="card-header">
              <h2>全员数据明细</h2>
              <div class="table-controls">
                <select class="form-select form-select-sm" id="deptFilter">
                  <option value="">全部部门</option>
                  <option value="研发">研发</option>
                  <option value="产品">产品</option>
                  <option value="销售">销售</option>
                  <option value="设计">设计</option>
                  <option value="运营">运营</option>
                </select>
              </div>
            </div>
            <table class="data-table" id="hrDataTable">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>部门</th>
                  <th>岗位</th>
                  <th>导师</th>
                  <th>阶段</th>
                  <th>进度</th>
                  <th>评分</th>
                  <th>评级</th>
                </tr>
              </thead>
              <tbody>
                ${interns.map((intern, i) => {
                  const mentor = (window.AppData?.MENTORS || []).find(m => m.id === intern.mentorId);
                  const ratingColors = { A: '#00D9A3', B: '#00C4FF', C: '#FFB800', D: '#FF4D6A' };
                  return `
                    <tr class="animate-in" style="--delay:${i * 0.02}s">
                      <td><span class="avatar-sm">${intern.avatar}</span> ${intern.name}</td>
                      <td>${intern.department}</td>
                      <td>${intern.position}</td>
                      <td>${mentor?.name || '-'}</td>
                      <td>P${intern.currentPhase}</td>
                      <td>
                        <div class="progress-bar progress-bar-sm">
                          <div class="progress-fill" style="width:${intern.overallProgress}%; --target-width:${intern.overallProgress}%"></div>
                        </div>
                      </td>
                      <td>${intern.weeklyScores[intern.weeklyScores.length - 1]}</td>
                      <td><span class="badge" style="background:${ratingColors[intern.conversionRating]}20; color:${ratingColors[intern.conversionRating]}">${intern.conversionRating}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;
      },

      /* ---------- HR：人才矩阵 ---------- */
      'talent-matrix'() {
        return `
          <div class="page-header">
            <h1 class="page-title">🧩 人才矩阵 (九宫格)</h1>
            <p class="page-subtitle">基于绩效与潜力的二维评估</p>
          </div>
          <div class="card animate-in" style="--delay:0s">
            <div id="talentMatrixContainer" class="talent-matrix-wrapper"></div>
          </div>
          <div class="card animate-in" style="--delay:0.1s">
            <div class="card-header"><h2>矩阵解读</h2></div>
            <div class="matrix-legend">
              <div class="legend-item"><span class="legend-dot" style="background:#00D9A3"></span><strong>明星 (高绩效·高潜力)</strong> — 重点培养，优先转正</div>
              <div class="legend-item"><span class="legend-dot" style="background:#00C4FF"></span><strong>骨干 (高绩效·中潜力)</strong> — 稳定发展，适当拓展</div>
              <div class="legend-item"><span class="legend-dot" style="background:#FFB800"></span><strong>潜力股 (中绩效·高潜力)</strong> — 加速培养，关注成长</div>
              <div class="legend-item"><span class="legend-dot" style="background:#FF8C42"></span><strong>稳定者 (中绩效·中潜力)</strong> — 持续跟进，保持节奏</div>
              <div class="legend-item"><span class="legend-dot" style="background:#FF4D6A"></span><strong>待提升 (低绩效)</strong> — 重点辅导，评估去留</div>
            </div>
          </div>
        `;
      },

      /* ---------- HR：批量对比 ---------- */
      'batch-report'() {
        const interns = window.AppData?.INTERNS || [];
        const depts = {};
        interns.forEach(i => {
          if (!depts[i.department]) depts[i.department] = [];
          depts[i.department].push(i);
        });

        return `
          <div class="page-header">
            <h1 class="page-title">📊 批量对比报告</h1>
          </div>

          <div class="card animate-in" style="--delay:0s">
            <div class="card-header"><h2>跨部门对比</h2></div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>部门</th>
                  <th>人数</th>
                  <th>平均进度</th>
                  <th>平均评分</th>
                  <th>A级占比</th>
                  <th>风险人数</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(depts).map(([dept, list], i) => {
                  const avgProg = Math.round(list.reduce((s, x) => s + x.overallProgress, 0) / list.length);
                  const avgScore = Math.round(list.reduce((s, x) => s + x.weeklyScores[x.weeklyScores.length - 1], 0) / list.length);
                  const aRate = Math.round(list.filter(x => x.conversionRating === 'A').length / list.length * 100);
                  const riskNum = list.filter(x => x.riskFlags && x.riskFlags.length > 0).length;
                  const deptInfo = window.AppData?.DEPARTMENTS?.[dept] || {};
                  return `
                    <tr class="animate-in" style="--delay:${i * 0.05}s">
                      <td><span style="margin-right:8px">${deptInfo.icon || '📁'}</span>${dept}</td>
                      <td>${list.length}</td>
                      <td>
                        <div class="progress-bar progress-bar-sm">
                          <div class="progress-fill" style="width:${avgProg}%; --target-width:${avgProg}%"></div>
                        </div>
                        <span>${avgProg}%</span>
                      </td>
                      <td>${avgScore}</td>
                      <td>${aRate}%</td>
                      <td>${riskNum > 0 ? `<span class="badge badge-danger">${riskNum}</span>` : '<span class="badge badge-success">0</span>'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="card animate-in" style="--delay:0.15s">
            <div class="card-header"><h2>部门能力均值对比</h2></div>
            <div class="chart-container">
              <canvas id="batchCompareChart"></canvas>
            </div>
          </div>
        `;
      },

      /* ---------- HR：转正预测 ---------- */
      'conversion'() {
        const interns = window.AppData?.INTERNS || [];
        const sorted = [...interns].sort((a, b) => b.conversionScore - a.conversionScore);
        const ratingColors = { A: '#00D9A3', B: '#00C4FF', C: '#FFB800', D: '#FF4D6A' };

        return `
          <div class="page-header">
            <h1 class="page-title">🚀 转正预测</h1>
            <p class="page-subtitle">基于 AI 综合分析的转正推荐评估</p>
          </div>

          <div class="grid-4">
            <div class="stat-card animate-in" style="--delay:0s">
              <div class="stat-icon" style="color:#00D9A3">A</div>
              <div class="stat-value" data-countup="${interns.filter(i => i.conversionRating === 'A').length}">${interns.filter(i => i.conversionRating === 'A').length}</div>
              <div class="stat-label">强烈推荐转正</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.05s">
              <div class="stat-icon" style="color:#00C4FF">B</div>
              <div class="stat-value" data-countup="${interns.filter(i => i.conversionRating === 'B').length}">${interns.filter(i => i.conversionRating === 'B').length}</div>
              <div class="stat-label">推荐转正</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.1s">
              <div class="stat-icon" style="color:#FFB800">C</div>
              <div class="stat-value" data-countup="${interns.filter(i => i.conversionRating === 'C').length}">${interns.filter(i => i.conversionRating === 'C').length}</div>
              <div class="stat-label">待观察</div>
            </div>
            <div class="stat-card animate-in" style="--delay:0.15s">
              <div class="stat-icon" style="color:#FF4D6A">D</div>
              <div class="stat-value" data-countup="${interns.filter(i => i.conversionRating === 'D').length}">${interns.filter(i => i.conversionRating === 'D').length}</div>
              <div class="stat-label">不建议转正</div>
            </div>
          </div>

          <div class="card animate-in conversion-ai-section" style="--delay:0.2s">
            <div class="card-header">
              <h2>🧠 AI 全员去留分析报告</h2>
              <button class="btn btn-primary btn-sm" id="aiConversionReport">🤖 一键生成报告</button>
            </div>
            <div class="ai-report-output" id="conversionAiOutput">
              <p class="hint-text">点击上方按钮，AI 将综合分析 ${interns.length} 名实习生的全维度数据，生成去留决策方案</p>
            </div>
          </div>

          <div class="card animate-in" style="--delay:0.3s">
            <div class="card-header"><h2>转正推荐排名</h2></div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>姓名</th>
                  <th>部门</th>
                  <th>综合评分</th>
                  <th>评级</th>
                  <th>建议</th>
                </tr>
              </thead>
              <tbody>
                ${sorted.map((intern, i) => {
                  const suggestions = { A: '优先转正，重点培养', B: '推荐转正，持续关注', C: '延期观察，加强辅导', D: '暂不转正，评估去留' };
                  return `
                    <tr class="animate-in" style="--delay:${i * 0.02}s">
                      <td><span class="rank-badge rank-${i < 3 ? 'top' : 'normal'}">${i + 1}</span></td>
                      <td><span class="avatar-sm">${intern.avatar}</span> ${intern.name}</td>
                      <td>${intern.department} · ${intern.position}</td>
                      <td>
                        <div class="score-ring-mini" style="--score:${intern.conversionScore}; --color:${ratingColors[intern.conversionRating]}">
                          <span>${intern.conversionScore}</span>
                        </div>
                      </td>
                      <td><span class="badge" style="background:${ratingColors[intern.conversionRating]}20; color:${ratingColors[intern.conversionRating]}; font-weight:600">${intern.conversionRating}</span></td>
                      <td class="suggestion-text">${suggestions[intern.conversionRating]}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    },

    /* ========== 后渲染钩子（绑定事件 + 初始化图表） ========== */
    postRender(viewId) {
      const D = window.Dashboard;
      const intern = this.getSelectedIntern();
      const mentor = this.getSelectedMentor();

      switch (viewId) {
        case 'growth-map':
          if (D && intern) {
            D.renderInternProgress('internProgressChart', intern.weeklyScores);
          }
          this.bindInternSelector();
          break;

        case 'skill-radar':
          if (D && intern) {
            D.renderInternRadar('skillRadarChart', intern.skills);
          }
          this.bindInternSelector();
          break;

        case 'weekly-report':
          if (D && intern) {
            D.renderInternProgress('weeklyScoreChart', intern.weeklyScores);
          }
          this.bindReportGenerator();
          this.bindInternSelector();
          break;

        case 'mentor-board':
          if (D && mentor) {
            const mentorInterns = this.getMentorInterns(mentor.id);
            D.renderMentorComparison('mentorComparisonChart', mentorInterns);
          }
          break;

        case 'teach-plan':
          this.bindPlanGenerator();
          break;

        case 'evaluation':
          this.bindEvaluation();
          break;

        case 'hr-dashboard':
          if (D) {
            setTimeout(() => {
              D.renderHROverview('hrDeptChart');
              D.renderHRScoreDistribution('hrScoreChart');
              D.renderHRProgressTrend('hrTrendChart');
              D.renderHRConversionPie('hrConversionChart');
            }, 100);
          }
          this.bindDeptFilter();
          break;

        case 'talent-matrix':
          if (D) {
            setTimeout(() => D.renderTalentMatrix('talentMatrixContainer'), 100);
          }
          break;

        case 'batch-report':
          if (D) {
            setTimeout(() => D.renderBatchComparison('batchCompareChart'), 100);
          }
          break;

        case 'risk-alert':
          this.bindRiskIntervention();
          break;

        case 'conversion':
          this.bindConversionReport();
          break;
      }

      // Animate progress bars
      requestAnimationFrame(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
          const w = bar.style.getPropertyValue('--target-width');
          if (w) {
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = w; }, 50);
          }
        });
      });

      // Bind range inputs
      document.querySelectorAll('.form-range').forEach(range => {
        const display = range.parentElement.querySelector('.range-value');
        if (display) {
          range.addEventListener('input', () => { display.textContent = range.value; });
        }
      });

      // Bind task toggle (interactive task status switching)
      this.bindTaskToggle();

      // Animate countUp for stat values
      this.animateCountUp();
    },

    /* ========== 功能绑定 ========== */
    bindReportGenerator() {
      const btn = document.getElementById('generateReport');
      const area = document.getElementById('aiReportArea');
      if (!btn || !area) return;

      btn.addEventListener('click', async () => {
        const intern = this.getSelectedIntern();
        if (!intern) return;

        btn.disabled = true;
        btn.textContent = '⏳ 生成中...';
        area.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

        const prompt = `请为实习生${intern.name}(${intern.department}·${intern.position})生成本周成长周报。
他的本周评分是${intern.weeklyScores[intern.weeklyScores.length - 1]}分，
主要任务进度：${intern.tasks.map(t => t.title + '(' + t.status + ')').join('、')}。
五维能力评分：技术${intern.skills.technical}、业务${intern.skills.business}、沟通${intern.skills.communication}、创新${intern.skills.innovation}、执行${intern.skills.execution}。
请生成一份结构化的周报，包含本周回顾、成长亮点、待提升项、下周计划。使用 markdown 格式。`;

        try {
          if (window.AIAssistant && window.AIAssistant.callAPIRaw) {
            const response = await window.AIAssistant.callAPIRaw(prompt);
            area.innerHTML = `<div class="ai-generated-report">${this.renderMarkdown(response)}</div>`;
          } else {
            area.innerHTML = `<div class="ai-generated-report"><p>AI 功能加载中，请稍后再试</p></div>`;
          }
        } catch (e) {
          area.innerHTML = `<div class="ai-generated-report"><p>生成失败，请重试: ${e.message}</p></div>`;
        }
        btn.disabled = false;
        btn.textContent = '✨ AI 生成周报';
      });
    },

    bindPlanGenerator() {
      const btn = document.getElementById('aiGeneratePlan');
      const result = document.getElementById('aiPlanResult');
      if (!btn || !result) return;

      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = '⏳ 生成中...';
        result.innerHTML = '<div class="card-header"><h2>AI 个性化带教建议</h2></div><div class="typing-indicator"><span></span><span></span><span></span></div>';

        const mentor = this.getSelectedMentor();
        const interns = this.getMentorInterns(mentor?.id);
        const prompt = `作为导师${mentor?.name || ''}，你需要为以下学员制定个性化带教计划：
${interns.map(i => `- ${i.name}(${i.position}), 当前阶段Phase${i.currentPhase}, 进度${i.overallProgress}%, 最新评分${i.weeklyScores[i.weeklyScores.length-1]}${i.riskFlags?.length ? ', 风险:'+i.riskFlags.join('/') : ''}`).join('\n')}
请为每位学员提供具体的本周带教重点和建议。`;

        try {
          if (window.AIAssistant && window.AIAssistant.callAPIRaw) {
            const response = await window.AIAssistant.callAPIRaw(prompt);
            result.innerHTML = `<div class="card-header"><h2>AI 个性化带教建议</h2></div><div class="ai-generated-report">${this.renderMarkdown(response)}</div>`;
          }
        } catch (e) {
          result.innerHTML = `<div class="card-header"><h2>AI 个性化带教建议</h2></div><p>生成失败: ${e.message}</p>`;
        }
        btn.disabled = false;
        btn.textContent = '🤖 AI 生成个性化带教计划';
      });
    },

    bindEvaluation() {
      // Intern selector buttons
      document.querySelectorAll('.intern-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.intern-select-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });

      // Submit evaluation
      const submitBtn = document.getElementById('submitEval');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          submitBtn.textContent = '✅ 已提交';
          submitBtn.classList.add('btn-success');
          setTimeout(() => {
            submitBtn.textContent = '提交评估';
            submitBtn.classList.remove('btn-success');
          }, 2000);
        });
      }

      // AI evaluation suggestion
      const aiBtn = document.getElementById('aiEvalSuggest');
      if (aiBtn) {
        aiBtn.addEventListener('click', async () => {
          const textarea = document.querySelector('.form-textarea');
          if (!textarea) return;
          aiBtn.disabled = true;
          aiBtn.textContent = '⏳ 生成中...';

          try {
            if (window.AIAssistant && window.AIAssistant.callAPIRaw) {
              const response = await window.AIAssistant.callAPIRaw(
                '请为一名表现良好的实习生撰写简短的周评估评语（100字以内），要求客观、鼓励、有建设性，指出亮点和改进方向。'
              );
              textarea.value = response;
            }
          } catch (e) {
            textarea.value = '本周表现稳定，在技术学习和团队协作方面有所提升，建议下周重点关注业务理解能力的培养。';
          }
          aiBtn.disabled = false;
          aiBtn.textContent = '🤖 AI 评语建议';
        });
      }
    },

    bindDeptFilter() {
      const filter = document.getElementById('deptFilter');
      const table = document.getElementById('hrDataTable');
      if (!filter || !table) return;

      filter.addEventListener('change', () => {
        const dept = filter.value;
        table.querySelectorAll('tbody tr').forEach(row => {
          if (!dept || row.children[1]?.textContent === dept) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    },

    bindGlobalEvents() {
      // Keyboard shortcut: Ctrl+K to toggle AI
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          if (window.AIAssistant) window.AIAssistant.toggle();
        }
      });

      // User profile dropdown trigger
      const trigger = document.getElementById('userProfileTrigger');
      const dropdown = document.getElementById('userProfileDropdown');
      const logoutBtn = document.getElementById('btnLogout');

      if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('open');
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.logout();
        });
      }

      document.addEventListener('click', () => {
        if (dropdown) dropdown.classList.remove('open');
      });
    },

    /* ========== 数据访问辅助 ========== */
    getSelectedIntern() {
      const intern = (window.AppData?.INTERNS || []).find(i => i.id === this.selectedInternId) || window.AppData?.INTERNS?.[0];
      if (window.AppData) {
        window.AppData.selectedIntern = intern;
        window.AppData.currentIntern = intern;
      }
      return intern;
    },

    getSelectedMentor() {
      const mentor = (window.AppData?.MENTORS || []).find(m => m.id === this.selectedMentorId) || window.AppData?.MENTORS?.[0];
      if (window.AppData) {
        window.AppData.selectedMentor = mentor;
      }
      return mentor;
    },

    getMentorInterns(mentorId) {
      return (window.AppData?.INTERNS || []).filter(i => i.mentorId === mentorId);
    },

    /* ========== 实习生选择器 ========== */
    renderInternSelector(currentIntern) {
      const interns = window.AppData?.INTERNS || [];
      return `
        <div class="intern-selector-wrapper">
          <div class="intern-selector-trigger" id="internSelectorTrigger">
            <span class="avatar-sm">${currentIntern.avatar}</span>
            <span>${currentIntern.name}</span>
            <span class="caret">▼</span>
          </div>
          <div class="intern-selector-dropdown" id="internSelectorDropdown">
            ${interns.map(i => `
              <div class="intern-option ${i.id === currentIntern.id ? 'active' : ''}" data-intern-id="${i.id}">
                <span class="avatar-sm">${i.avatar}</span>
                <div class="option-info">
                  <div class="option-name">${i.name}</div>
                  <div class="option-dept">${i.department} · ${i.position}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindInternSelector() {
      const trigger = document.getElementById('internSelectorTrigger');
      const dropdown = document.getElementById('internSelectorDropdown');
      if (!trigger || !dropdown) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        trigger.classList.toggle('open');
        dropdown.classList.toggle('open');
      });

      dropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.intern-option');
        if (!option) return;
        const internId = option.dataset.internId;
        this.selectedInternId = internId;
        this.switchView(this.currentView); // Re-render current view with new intern
      });

      document.addEventListener('click', () => {
        trigger.classList.remove('open');
        dropdown.classList.remove('open');
      }, { once: true });
    },

    /* ========== 任务状态切换 ========== */
    bindTaskToggle() {
      const container = document.getElementById('taskListContainer');
      if (!container) return;

      container.addEventListener('click', (e) => {
        const toggle = e.target.closest('.task-toggle');
        if (!toggle) return;

        const idx = parseInt(toggle.dataset.idx);
        const intern = this.getSelectedIntern();
        if (!intern || !intern.tasks[idx]) return;

        const task = intern.tasks[idx];
        const cycle = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
        const statusIcons = { completed: '✅', 'in-progress': '🔄', pending: '⬜' };
        task.status = cycle[task.status];

        // Update DOM visually without full re-render
        const item = toggle.closest('.task-item');
        item.className = `task-item ${task.status}`;
        toggle.textContent = statusIcons[task.status];

        // Update the status badge
        const statusLabels = { completed: '已完成', 'in-progress': '进行中', pending: '待开始' };
        const badges = item.querySelectorAll('.badge');
        const statusBadge = badges[badges.length - 1];
        if (statusBadge) {
          statusBadge.textContent = statusLabels[task.status];
          statusBadge.className = `badge badge-${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : 'info'}`;
        }

        this.showToast('任务更新', `「${task.title}」状态已更新为：${statusLabels[task.status]}`, 'success');
      });
    },

    /* ========== 风险预警 AI 干预 ========== */
    bindRiskIntervention() {
      document.querySelectorAll('.ai-intervene-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const internId = btn.dataset.internId;
          const intern = (window.AppData?.INTERNS || []).find(i => i.id === internId);
          if (!intern) return;

          const resultEl = document.getElementById(`intervention-${internId}`);
          if (!resultEl) return;

          btn.disabled = true;
          btn.textContent = '⏳ 分析中...';
          resultEl.style.display = 'block';
          resultEl.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

          const prompt = `作为HR顾问，请分析实习生${intern.name}（${intern.department}·${intern.position}）的风险情况并给出具体干预建议。
当前风险标签：${intern.riskFlags.join('、')}
进度：${intern.overallProgress}%，最新评分：${intern.weeklyScores[intern.weeklyScores.length - 1]}
五维能力：技术${intern.skills.technical}、业务${intern.skills.business}、沟通${intern.skills.communication}、创新${intern.skills.innovation}、执行${intern.skills.execution}
请给出：1) 风险根因分析 2) 针对性干预措施（3条以内）3) 预期改善时间线。简洁回答，200字以内。`;

          try {
            if (window.AIAssistant && window.AIAssistant.callAPIRaw) {
              const response = await window.AIAssistant.callAPIRaw(prompt);
              resultEl.innerHTML = this.renderMarkdown(response);
            } else {
              resultEl.innerHTML = '<p>AI 功能加载中，请稍后再试</p>';
            }
          } catch (e) {
            resultEl.innerHTML = `<p>分析失败: ${e.message}</p>`;
          }
          btn.disabled = false;
          btn.textContent = '🤖 AI 干预建议';
        });
      });
    },

    /* ========== 转正预测 AI 报告 ========== */
    bindConversionReport() {
      const btn = document.getElementById('aiConversionReport');
      const output = document.getElementById('conversionAiOutput');
      if (!btn || !output) return;

      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = '⏳ 生成中...';
        output.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

        const interns = window.AppData?.INTERNS || [];
        const summary = interns.map(i =>
          `${i.name}(${i.department}·${i.position}): 评级${i.conversionRating}, 综合分${i.conversionScore}, 进度${i.overallProgress}%, 最新评分${i.weeklyScores[i.weeklyScores.length-1]}${i.riskFlags?.length ? ', 风险:'+i.riskFlags.join('/') : ''}`
        ).join('\n');

        const prompt = `作为HR总监，请综合以下${interns.length}名实习生的数据，生成一份去留分析报告（300字以内）。
${summary}
请包含：1) 总体评估概述 2) 推荐优先转正名单 3) 建议延期观察名单 4) 整体批次质量评价。`;

        try {
          if (window.AIAssistant && window.AIAssistant.callAPIRaw) {
            const response = await window.AIAssistant.callAPIRaw(prompt);
            output.innerHTML = `<div class="ai-generated-report">${this.renderMarkdown(response)}</div>`;
          }
        } catch (e) {
          output.innerHTML = `<p>报告生成失败: ${e.message}</p>`;
        }
        btn.disabled = false;
        btn.textContent = '🤖 一键生成报告';
      });
    },

    /* ========== 数字跳动动画 ========== */
    animateCountUp() {
      document.querySelectorAll('[data-countup]').forEach(el => {
        const target = parseInt(el.dataset.countup);
        if (isNaN(target) || target === 0) return;

        const suffix = el.textContent.includes('%') ? '%' : '';
        const duration = 600;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        el.textContent = '0' + suffix;
        requestAnimationFrame(update);
      });
    },

    /* ========== 简易 Markdown 渲染 ========== */
    renderMarkdown(text) {
      if (!text) return '';
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>').replace(/$/, '</p>');
    }
  };

  /* ========== 入口 ========== */
  window.App = App;
  document.addEventListener('DOMContentLoaded', () => App.init());
})();
