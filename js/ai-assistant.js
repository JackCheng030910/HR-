/**
 * 实习能量站 - AI Assistant Module
 * Manages the AI chat assistant with SiliconFlow API integration.
 */
(function () {
  'use strict';

  // ─── API Configuration ───────────────────────────────────────────────
  const AI_CONFIG = {
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    apiKey: window.IES_AI_API_KEY || localStorage.getItem('IES_AI_API_KEY') || '',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    systemPrompt: `你是「实习能量站」的AI助手小能，专门帮助实习生、导师和HR解答关于实习成长的问题。你的回答要简洁、专业、温暖。

你可以帮助：
- 实习生：学习路径建议、技能提升方案、周报撰写辅助
- 导师：带教计划制定、学员评估建议、反馈话术指导
- HR：整体数据分析、人才盘点建议、转正评估参考

请基于当前角色和上下文给出针对性的建议。回答请使用中文，保持友好和鼓励的语气。`
  };

  // ─── Quick Actions by Role ───────────────────────────────────────────
  const QUICK_ACTIONS = {
    intern: [
      { text: '这周该学什么？', icon: '📚' },
      { text: '帮我写周报', icon: '📝' },
      { text: '我的能力短板是？', icon: '🎯' },
      { text: '如何提升编码能力？', icon: '💻' }
    ],
    mentor: [
      { text: '生成带教计划', icon: '📋' },
      { text: '如何给学员反馈？', icon: '💬' },
      { text: '学员评估建议', icon: '📊' },
      { text: '风险预警分析', icon: '⚠️' }
    ],
    hr: [
      { text: '整体适岗分析', icon: '📈' },
      { text: '转正推荐报告', icon: '📄' },
      { text: '人才盘点概览', icon: '👥' },
      { text: '异常数据预警', icon: '🚨' }
    ]
  };

  // ─── State ───────────────────────────────────────────────────────────
  let chatHistory = [];
  let isOpen = false;
  let isLoading = false;
  const MAX_HISTORY = 20;

  // ─── DOM References (set after init) ─────────────────────────────────
  let fab, panel, messagesContainer, inputField, sendBtn, closeBtn, quickActionsContainer;

  // ═══════════════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════════════
  function init() {
    createDOM();
    bindEvents();
    // Show welcome message
    const role = getCurrentRole();
    addWelcomeMessage(role);
    addQuickActions(role);
  }

  // ─── Create DOM ──────────────────────────────────────────────────────
  function createDOM() {
    // FAB button
    const fabHTML = `
      <button class="ai-fab" id="aiFab" title="AI 助手">
        <span class="ai-fab-icon">🤖</span>
        <span class="ai-fab-pulse"></span>
      </button>
    `;

    // Chat panel
    const panelHTML = `
      <div class="ai-panel" id="aiPanel">
        <div class="ai-header">
          <div class="ai-header-info">
            <span class="ai-avatar">🤖</span>
            <div>
              <div class="ai-name">小能 · AI助手</div>
              <div class="ai-status">
                <span class="ai-status-dot"></span>在线
              </div>
            </div>
          </div>
          <div class="ai-header-actions">
            <button class="ai-clear" id="aiClear" title="清空对话">🗑️</button>
            <button class="ai-close" id="aiClose" title="关闭">✕</button>
          </div>
        </div>
        <div class="ai-messages" id="aiMessages"></div>
        <div class="ai-quick-actions" id="aiQuickActions"></div>
        <div class="ai-input-area">
          <input type="text" class="ai-input" id="aiInput" placeholder="输入你的问题..." autocomplete="off">
          <button class="ai-send" id="aiSend" title="发送">➤</button>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.id = 'aiAssistantRoot';
    wrapper.innerHTML = fabHTML + panelHTML;
    document.body.appendChild(wrapper);

    // Cache DOM references
    fab = document.getElementById('aiFab');
    panel = document.getElementById('aiPanel');
    messagesContainer = document.getElementById('aiMessages');
    inputField = document.getElementById('aiInput');
    sendBtn = document.getElementById('aiSend');
    closeBtn = document.getElementById('aiClose');
    quickActionsContainer = document.getElementById('aiQuickActions');
  }

  // ─── Bind Events ────────────────────────────────────────────────────
  function bindEvents() {
    fab.addEventListener('click', toggle);
    closeBtn.addEventListener('click', close);
    sendBtn.addEventListener('click', handleSend);
    document.getElementById('aiClear').addEventListener('click', clearChat);

    inputField.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (isOpen && !panel.contains(e.target) && !fab.contains(e.target)) {
        close();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PANEL CONTROLS
  // ═══════════════════════════════════════════════════════════════════════
  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  function open() {
    isOpen = true;
    panel.classList.add('ai-panel--open');
    fab.classList.add('ai-fab--hidden');
    inputField.focus();
  }

  function close() {
    isOpen = false;
    panel.classList.remove('ai-panel--open');
    fab.classList.remove('ai-fab--hidden');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MESSAGING
  // ═══════════════════════════════════════════════════════════════════════
  function handleSend() {
    const text = inputField.value.trim();
    if (!text || isLoading) return;
    inputField.value = '';
    sendMessage(text);
  }

  async function sendMessage(text) {
    // Add user message to UI
    addMessage('user', text);

    // Build messages payload
    const contextPrompt = getContextPrompt();
    const systemMessages = [
      { role: 'system', content: AI_CONFIG.systemPrompt },
      { role: 'system', content: contextPrompt }
    ];

    // Append to history
    chatHistory.push({ role: 'user', content: text });
    trimHistory();

    const apiMessages = [...systemMessages, ...chatHistory];

    // Show typing indicator
    showTypingIndicator();
    isLoading = true;

    try {
      const reply = await callAPI(apiMessages);
      hideTypingIndicator();
      addMessage('assistant', reply);
      chatHistory.push({ role: 'assistant', content: reply });
      trimHistory();
    } catch (error) {
      hideTypingIndicator();
      const fallback = handleError(error, text);
      addMessage('assistant', fallback);
      chatHistory.push({ role: 'assistant', content: fallback });
      trimHistory();
    } finally {
      isLoading = false;
    }
  }

  function addMessage(role, content) {
    const bubble = document.createElement('div');
    bubble.className = `ai-msg ai-msg--${role}`;

    const avatar = role === 'assistant' ? '🤖' : '👤';
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    // Format content: convert markdown-style bold and line breaks
    const formattedContent = formatMarkdown(content);

    bubble.innerHTML = `
      <div class="ai-msg-avatar">${avatar}</div>
      <div class="ai-msg-body">
        <div class="ai-msg-content">${formattedContent}</div>
        <div class="ai-msg-time">${time}</div>
      </div>
    `;

    messagesContainer.appendChild(bubble);
    scrollToBottom();
  }

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  function scrollToBottom() {
    requestAnimationFrame(function () {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  // ─── Typing Indicator ───────────────────────────────────────────────
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'ai-msg ai-msg--assistant ai-typing-indicator';
    indicator.id = 'aiTyping';
    indicator.innerHTML = `
      <div class="ai-msg-avatar">🤖</div>
      <div class="ai-msg-body">
        <div class="ai-msg-content">
          <div class="ai-typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('aiTyping');
    if (indicator) indicator.remove();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // API CALL
  // ═══════════════════════════════════════════════════════════════════════
  async function callAPI(messages) {
    if (!AI_CONFIG.apiKey) {
      throw new Error('No AI API key configured; using local demo assistant.');
    }

    const response = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices.length || !data.choices[0].message) {
      throw new Error('Invalid API response structure');
    }

    return data.choices[0].message.content;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ERROR HANDLING & FALLBACK
  // ═══════════════════════════════════════════════════════════════════════
  function handleError(error, userMessage) {
    console.warn('[AI Assistant] API Error:', error.message || error);
    return generateFallbackResponse(userMessage || '');
  }

  function generateFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    const role = getCurrentRole();

    // Rule-based fallback responses
    if (msg.includes('周报') || msg.includes('周报')) {
      return '📝 **周报撰写小贴士**\n\n建议按照以下结构撰写：\n1. **本周完成**：列出完成的任务和成果\n2. **遇到问题**：遇到的难点及解决方式\n3. **下周计划**：下周的学习和工作目标\n4. **心得体会**：成长感悟和需要的支持\n\n记得用数据说话，突出关键成果！';
    }

    if (msg.includes('学什么') || msg.includes('学习') || msg.includes('路径')) {
      return '📚 **学习建议**\n\n根据当前阶段，推荐以下学习路径：\n1. **基础夯实期**（第1-2周）：熟悉项目代码和开发流程\n2. **技能提升期**（第3-6周）：深入技术栈，完成独立模块\n3. **综合应用期**（第7-10周）：参与核心功能开发\n4. **总结输出期**（第11-12周）：项目总结和答辩准备\n\n建议每天安排30分钟学习新知识 💪';
    }

    if (msg.includes('短板') || msg.includes('能力') || msg.includes('提升')) {
      return '🎯 **能力提升建议**\n\n可以从以下几个维度自我评估：\n- **技术能力**：代码质量、技术深度\n- **业务理解**：需求分析、产品思维\n- **沟通协作**：跨团队配合、汇报表达\n- **创新思维**：方案优化、主动思考\n- **执行力**：任务完成质量和效率\n\n找到最薄弱的一项，制定针对性提升计划！';
    }

    if (msg.includes('反馈') || msg.includes('评估')) {
      return '💬 **反馈建议**\n\n有效反馈的SBI模型：\n- **S（Situation）**：描述具体场景\n- **B（Behavior）**：描述观察到的行为\n- **I（Impact）**：说明产生的影响\n\n例如："在上周的需求评审中（S），你主动提出了边界条件的考虑（B），这帮助团队避免了潜在的线上问题（I）。"\n\n记得多肯定，有建设性地提改进建议 😊';
    }

    if (msg.includes('带教') || msg.includes('计划')) {
      return '📋 **带教计划模板**\n\n建议按阶段制定：\n1. **融入期**（1-2周）：环境搭建、团队介绍、入门任务\n2. **成长期**（3-8周）：分配渐进式任务，每周1v1\n3. **独立期**（9-10周）：独立负责模块，适度放手\n4. **总结期**（11-12周）：项目收尾、述职辅导\n\n每个阶段设置明确的milestone和check-in节点 ✅';
    }

    if (msg.includes('转正') || msg.includes('推荐')) {
      return '📄 **转正评估参考维度**\n\n综合评估建议从以下方面考虑：\n1. **岗位匹配度**：技能与岗位要求的契合度\n2. **成长速度**：学习曲线和进步幅度\n3. **团队融入**：协作意识和文化认同\n4. **潜力评估**：自驱力、抗压力、发展空间\n5. **绩效产出**：任务完成质量和贡献度\n\n建议结合导师评价、360反馈和量化数据综合判断。';
    }

    if (msg.includes('预警') || msg.includes('风险') || msg.includes('异常')) {
      return '⚠️ **风险预警关注点**\n\n需要重点关注以下信号：\n- 📉 连续两周成长分数下降\n- 📋 任务完成率低于70%\n- 💬 周报提交不及时或内容空洞\n- 😞 1v1中表现出消极情绪\n- 🚫 缺少与团队的互动\n\n发现以上信号，建议及时沟通，了解背后原因并提供支持。';
    }

    // Generic fallback
    if (role === 'intern') {
      return '😊 你好！我是AI助手小能。暂时网络不太稳定，但我可以帮你解答实习中的常见问题。\n\n试试问我：\n- "帮我写周报"\n- "这周该学什么？"\n- "如何提升编码能力？"';
    } else if (role === 'mentor') {
      return '👋 你好导师！网络暂时波动，但我仍能提供基础建议。\n\n试试问我：\n- "生成带教计划"\n- "如何给学员反馈？"\n- "学员评估建议"';
    } else {
      return '👋 你好！网络暂时波动，但我仍能提供基础建议。\n\n试试问我：\n- "整体适岗分析"\n- "转正推荐报告"\n- "人才盘点概览"';
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONTEXT BUILDING
  // ═══════════════════════════════════════════════════════════════════════
  function getContextPrompt() {
    const role = getCurrentRole();
    let context = `当前用户角色：${getRoleName(role)}。\n`;

    // Try to get intern data from AppData
    const appData = window.AppData;
    if (appData) {
      if (role === 'intern' || role === 'mentor') {
        const selectedIntern = getSelectedIntern();
        if (selectedIntern) {
          context += `\n当前查看的实习生信息：\n`;
          context += `- 姓名：${selectedIntern.name || '未知'}\n`;
          context += `- 部门：${selectedIntern.department || '未知'}\n`;
          const mentor = appData.mentors && appData.mentors.find(function (m) {
            return m.id === selectedIntern.mentorId;
          });
          context += `- 导师：${mentor ? mentor.name : (selectedIntern.mentor || '未知')}\n`;
          const progress = selectedIntern.overallProgress ?? selectedIntern.progress;
          if (progress !== undefined) {
            context += `- 整体进度：${progress}%\n`;
          }
          if (selectedIntern.weeklyScores && selectedIntern.weeklyScores.length) {
            context += `- 周度评分趋势：${selectedIntern.weeklyScores.join(', ')}\n`;
            const latest = selectedIntern.weeklyScores[selectedIntern.weeklyScores.length - 1];
            const prev = selectedIntern.weeklyScores.length > 1
              ? selectedIntern.weeklyScores[selectedIntern.weeklyScores.length - 2]
              : latest;
            const trend = latest > prev ? '上升' : latest < prev ? '下降' : '持平';
            context += `- 最新评分：${latest}（趋势：${trend}）\n`;
          }
          if (selectedIntern.skills) {
            const skillMap = {
              technical: '技术能力',
              business: '业务理解',
              communication: '沟通协作',
              innovation: '创新思维',
              execution: '执行力'
            };
            context += `- 能力画像：`;
            if (Array.isArray(selectedIntern.skills)) {
              const skillNames = ['技术能力', '业务理解', '沟通协作', '创新思维', '执行力'];
              selectedIntern.skills.forEach(function (val, i) {
                context += `${skillNames[i] || '维度' + (i + 1)}: ${val}/100  `;
              });
            } else {
              Object.keys(skillMap).forEach(function (key) {
                if (selectedIntern.skills[key] !== undefined) {
                  context += `${skillMap[key]}: ${selectedIntern.skills[key]}/100  `;
                }
              });
            }
            context += '\n';
          }
          if (selectedIntern.tasks && selectedIntern.tasks.length) {
            const completed = selectedIntern.tasks.filter(function (t) { return t.status === 'completed'; }).length;
            const total = selectedIntern.tasks.length;
            context += `- 任务完成情况：${completed}/${total}\n`;
          }
          const risks = selectedIntern.riskFlags || selectedIntern.risks;
          if (risks && risks.length) {
            context += `- 风险标签：${risks.join(', ')}\n`;
          }
        }
      }

      if (role === 'hr') {
        const interns = appData.interns;
        if (interns && interns.length) {
          context += `\n当前管理数据概览：\n`;
          context += `- 实习生总数：${interns.length}\n`;

          // Department distribution
          const deptMap = {};
          interns.forEach(function (intern) {
            const dept = intern.department || '未知';
            deptMap[dept] = (deptMap[dept] || 0) + 1;
          });
          context += `- 部门分布：`;
          Object.keys(deptMap).forEach(function (dept) {
            context += `${dept}(${deptMap[dept]}人) `;
          });
          context += '\n';

          // Average score
          const scores = interns
            .map(function (i) { return i.weeklyScores && i.weeklyScores.length ? i.weeklyScores[i.weeklyScores.length - 1] : null; })
            .filter(function (s) { return s !== null; });
          if (scores.length) {
            const avg = (scores.reduce(function (a, b) { return a + b; }, 0) / scores.length).toFixed(1);
            context += `- 最新平均评分：${avg}\n`;
          }

          // Risk count
          const riskCount = interns.filter(function (i) {
            const risks = i.riskFlags || i.risks;
            return risks && risks.length > 0;
          }).length;
          if (riskCount > 0) {
            context += `- 存在风险标签的实习生：${riskCount}人\n`;
          }
        }
      }
    }

    return context;
  }

  function getCurrentRole() {
    // Try to read from AppData or DOM
    if (window.AppData && window.AppData.currentRole) {
      return window.AppData.currentRole;
    }
    // Fallback: check body class or active tab
    var body = document.body;
    if (body.classList.contains('role-intern')) return 'intern';
    if (body.classList.contains('role-mentor')) return 'mentor';
    if (body.classList.contains('role-hr')) return 'hr';
    // Check active nav
    var activeNav = document.querySelector('.nav-role.active, [data-role].active');
    if (activeNav) {
      var r = activeNav.getAttribute('data-role') || activeNav.textContent.trim();
      if (r.includes('实习') || r === 'intern') return 'intern';
      if (r.includes('导师') || r === 'mentor') return 'mentor';
      if (r.includes('HR') || r === 'hr') return 'hr';
    }
    return 'intern'; // default
  }

  function getRoleName(role) {
    var map = { intern: '实习生', mentor: '导师', hr: 'HR管理员' };
    return map[role] || '用户';
  }

  function getSelectedIntern() {
    if (window.App && typeof window.App.getSelectedIntern === 'function') {
      return window.App.getSelectedIntern();
    }
    if (window.AppData && window.AppData.selectedIntern) {
      return window.AppData.selectedIntern;
    }
    if (window.AppData && window.AppData.currentIntern) {
      return window.AppData.currentIntern;
    }
    // Try first intern as fallback
    if (window.AppData && window.AppData.interns && window.AppData.interns.length) {
      return window.AppData.interns[0];
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // QUICK ACTIONS
  // ═══════════════════════════════════════════════════════════════════════
  function addQuickActions(role) {
    if (!quickActionsContainer) return;
    quickActionsContainer.innerHTML = '';

    var actions = QUICK_ACTIONS[role] || QUICK_ACTIONS.intern;
    actions.forEach(function (action) {
      var btn = document.createElement('button');
      btn.className = 'ai-quick-btn';
      btn.innerHTML = `<span class="ai-quick-icon">${action.icon}</span>${action.text}`;
      btn.addEventListener('click', function () {
        sendMessage(action.text);
      });
      quickActionsContainer.appendChild(btn);
    });
  }

  // ─── Welcome Message ────────────────────────────────────────────────
  function addWelcomeMessage(role) {
    const user = (window.AppData && window.AppData.currentUser) || '同学';
    const namePrefix = user === '游客' ? '游客同学' : user.split('@')[0];

    var roleGreeting = {
      intern: `你好呀，${namePrefix}！我是小能 🤖，你的实习成长助手。有任何问题都可以问我，比如学习路径、周报撰写、能力提升等～`,
      mentor: `你好，${namePrefix}导师！我是小能 🤖。我可以帮你制定带教计划、撰写学员评估、分析风险预警。有什么需要帮忙的吗？`,
      hr: `你好，${namePrefix}！我是小能 🤖，你的HR智能助手。我可以帮你进行数据分析、人才盘点、转正评估等工作。请随时提问！`
    };

    addMessage('assistant', roleGreeting[role] || roleGreeting.intern);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CLEAR CHAT
  // ═══════════════════════════════════════════════════════════════════════
  function clearChat() {
    chatHistory = [];
    if (messagesContainer) messagesContainer.innerHTML = '';
    var role = getCurrentRole();
    addWelcomeMessage(role);
    addQuickActions(role);
  }

  // ─── Trim History ───────────────────────────────────────────────────
  function trimHistory() {
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory = chatHistory.slice(chatHistory.length - MAX_HISTORY);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Refresh quick actions when role changes
  // ═══════════════════════════════════════════════════════════════════════
  function onRoleChange(newRole) {
    addQuickActions(newRole);
  }

  async function callAPIRaw(prompt) {
    const messages = [
      { role: 'system', content: AI_CONFIG.systemPrompt },
      { role: 'user', content: prompt }
    ];
    try {
      return await callAPI(messages);
    } catch (e) {
      console.warn('[AI Assistant] callAPIRaw Error:', e);
      return generateFallbackResponse(prompt);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════
  window.AIAssistant = {
    init: init,
    toggle: toggle,
    open: open,
    close: close,
    sendMessage: sendMessage,
    addMessage: addMessage,
    showTypingIndicator: showTypingIndicator,
    hideTypingIndicator: hideTypingIndicator,
    callAPI: callAPI,
    callAPIRaw: callAPIRaw,
    handleError: handleError,
    getContextPrompt: getContextPrompt,
    generateFallbackResponse: generateFallbackResponse,
    clearChat: clearChat,
    addQuickActions: addQuickActions,
    onRoleChange: onRoleChange,
    updateRole: onRoleChange
  };

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
