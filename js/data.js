/**
 * 实习能量站 - 数据模块
 * Intern Energy Station - Data Module
 * 
 * 所有模拟数据集中管理，通过 window.AppData 全局暴露
 */

window.AppData = (function () {
  'use strict';

  // ============================================================
  // 1. INTERNS - 20位实习生完整数据
  // ============================================================
  const INTERNS = [
    // ── 研发部门 (8人) ──────────────────────────────────
    {
      id: 'intern-01',
      name: '张明轩',
      avatar: '👨‍💻',
      gender: 'male',
      university: '清华大学',
      major: '计算机科学与技术',
      department: '研发',
      position: 'React前端开发',
      mentorId: 'mentor-01',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 68,
      skills: {
        technical: 82,
        business: 65,
        communication: 78,
        innovation: 71,
        execution: 85
      },
      weeklyScores: [72, 75, 78, 80, 82, 85, 83, 88],
      tasks: [
        { id: 't1-01', title: '完成部门技术栈学习', status: 'completed', priority: 'high', dueDate: '2026-03-15' },
        { id: 't2-01', title: '参与需求评审会议', status: 'completed', priority: 'medium', dueDate: '2026-03-20' },
        { id: 't3-01', title: '独立完成用户管理模块前端开发', status: 'in-progress', priority: 'high', dueDate: '2026-04-10' },
        { id: 't4-01', title: '编写组件技术文档', status: 'pending', priority: 'low', dueDate: '2026-04-20' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解团队与业务', '熟悉React+TypeScript技术栈', '完成入职培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['参与实际项目迭代', '独立完成前端模块开发', '参与Code Review'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责需求从设计到上线', '进行一次技术分享', '撰写实习总结报告'] }
      ],
      weeklyReports: [
        { week: 8, summary: '本周完成了用户列表组件的重构，将Class组件迁移到Hooks，性能提升约30%。学习了useMemo和useCallback的最佳实践。', score: 88 },
        { week: 7, summary: '参与了登录模块的联调，修复了3个表单校验Bug，学习了Ant Design Pro的表单方案。', score: 83 }
      ],
      riskFlags: [],
      conversionScore: 85,
      conversionRating: 'A'
    },
    {
      id: 'intern-02',
      name: '李思远',
      avatar: '👨‍🔬',
      gender: 'male',
      university: '北京大学',
      major: '人工智能',
      department: '研发',
      position: 'AI算法工程师',
      mentorId: 'mentor-01',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 75,
      skills: {
        technical: 90,
        business: 58,
        communication: 65,
        innovation: 88,
        execution: 78
      },
      weeklyScores: [68, 72, 74, 79, 82, 85, 87, 90],
      tasks: [
        { id: 't1-02', title: '阅读推荐算法相关论文', status: 'completed', priority: 'high', dueDate: '2026-03-10' },
        { id: 't2-02', title: '搭建模型训练Pipeline', status: 'completed', priority: 'high', dueDate: '2026-03-25' },
        { id: 't3-02', title: '优化推荐模型CTR指标', status: 'in-progress', priority: 'high', dueDate: '2026-04-15' },
        { id: 't4-02', title: '撰写算法评估报告', status: 'pending', priority: 'medium', dueDate: '2026-04-25' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['熟悉推荐业务场景', '了解数据处理流程', '完成GPU集群使用培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['复现Baseline模型', '参与特征工程优化', '完成A/B实验设计'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['提出并验证创新算法', '模型上线部署', '技术分享与论文撰写'] }
      ],
      weeklyReports: [
        { week: 8, summary: '完成了多任务学习框架的初步搭建，在离线评估中CTR提升2.1%。下周准备进行在线A/B测试。', score: 90 },
        { week: 7, summary: '深入研究了DIN和DIEN模型结构，完成了特征交叉模块的代码实现。', score: 87 }
      ],
      riskFlags: [],
      conversionScore: 92,
      conversionRating: 'A'
    },
    {
      id: 'intern-03',
      name: '王雨萱',
      avatar: '👩‍💻',
      gender: 'female',
      university: '浙江大学',
      major: '软件工程',
      department: '研发',
      position: 'Java后端开发',
      mentorId: 'mentor-01',
      startDate: '2026-03-15',
      currentPhase: 2,
      overallProgress: 62,
      skills: {
        technical: 75,
        business: 70,
        communication: 82,
        innovation: 65,
        execution: 72
      },
      weeklyScores: [65, 68, 70, 72, 74, 73, 76, 78],
      tasks: [
        { id: 't1-03', title: '学习Spring Cloud微服务架构', status: 'completed', priority: 'high', dueDate: '2026-03-28' },
        { id: 't2-03', title: '完成用户服务接口开发', status: 'completed', priority: 'high', dueDate: '2026-04-05' },
        { id: 't3-03', title: '参与订单模块重构', status: 'in-progress', priority: 'medium', dueDate: '2026-04-20' },
        { id: 't4-03', title: '编写单元测试用例', status: 'pending', priority: 'medium', dueDate: '2026-04-30' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解微服务架构设计', '熟悉CI/CD流程', '完成编码规范培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立开发REST API', '掌握分布式事务处理', '参与线上问题排查'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责服务模块', '性能优化实践', '实习总结与技术沉淀'] }
      ],
      weeklyReports: [
        { week: 7, summary: '完成了订单查询接口的开发，引入了Redis缓存方案，QPS提升了4倍。学习了分布式锁的使用场景。', score: 78 },
        { week: 6, summary: '修复了用户服务的并发Bug，学习了线程安全和锁机制。', score: 76 }
      ],
      riskFlags: [],
      conversionScore: 78,
      conversionRating: 'B'
    },
    {
      id: 'intern-04',
      name: '陈浩宇',
      avatar: '🧑‍💻',
      gender: 'male',
      university: '上海交通大学',
      major: '信息安全',
      department: '研发',
      position: '安全测试工程师',
      mentorId: 'mentor-01',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 55,
      skills: {
        technical: 70,
        business: 55,
        communication: 60,
        innovation: 62,
        execution: 68
      },
      weeklyScores: [60, 62, 63, 65, 64, 66, 68, 70],
      tasks: [
        { id: 't1-04', title: '学习安全测试工具链', status: 'completed', priority: 'high', dueDate: '2026-03-15' },
        { id: 't2-04', title: '完成Web漏洞扫描实践', status: 'completed', priority: 'high', dueDate: '2026-03-28' },
        { id: 't3-04', title: '编写渗透测试报告', status: 'in-progress', priority: 'medium', dueDate: '2026-04-12' },
        { id: 't4-04', title: '参与安全评审流程', status: 'pending', priority: 'low', dueDate: '2026-04-25' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解安全测试体系', '熟悉Burp Suite等工具', '完成安全意识培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立执行安全扫描', '学习代码审计方法', '参与安全事件响应'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立完成安全评估', '安全最佳实践分享', '实习成果汇报'] }
      ],
      weeklyReports: [
        { week: 8, summary: '本周完成了支付模块的安全扫描，发现了2个中危漏洞并提交修复建议。学习了OWASP Top 10。', score: 70 },
        { week: 7, summary: '学习了SQL注入和XSS攻击的原理与防御方法，完成了实验环境搭建。', score: 68 }
      ],
      riskFlags: ['进度滞后', '缺少主动反馈'],
      conversionScore: 65,
      conversionRating: 'C'
    },
    {
      id: 'intern-05',
      name: '刘诗琪',
      avatar: '👩‍🔧',
      gender: 'female',
      university: '中国科学技术大学',
      major: '数据科学',
      department: '研发',
      position: '数据开发工程师',
      mentorId: 'mentor-01',
      startDate: '2026-03-10',
      currentPhase: 2,
      overallProgress: 72,
      skills: {
        technical: 85,
        business: 72,
        communication: 75,
        innovation: 78,
        execution: 80
      },
      weeklyScores: [70, 73, 75, 77, 80, 82, 84, 85],
      tasks: [
        { id: 't1-05', title: '学习Spark和Flink数据处理框架', status: 'completed', priority: 'high', dueDate: '2026-03-22' },
        { id: 't2-05', title: '搭建实时数据看板', status: 'completed', priority: 'high', dueDate: '2026-04-01' },
        { id: 't3-05', title: '优化ETL数据管道性能', status: 'in-progress', priority: 'high', dueDate: '2026-04-18' },
        { id: 't4-05', title: '完成数据质量监控方案', status: 'pending', priority: 'medium', dueDate: '2026-04-28' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解数据仓库架构', '熟悉Hive/Spark工具', '完成数据安全培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立开发数据管道', '参与数据建模', '学习数据治理规范'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责数据需求', '数据质量提升项目', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 8, summary: '完成了用户行为数据的实时处理管道，使用Flink窗口聚合，延迟从5min降低到30s。', score: 85 },
        { week: 7, summary: '学习了数据仓库分层设计（ODS/DWD/DWS/ADS），完成了用户画像标签表的开发。', score: 84 }
      ],
      riskFlags: [],
      conversionScore: 83,
      conversionRating: 'A'
    },
    {
      id: 'intern-06',
      name: '赵子轩',
      avatar: '👨‍🎓',
      gender: 'male',
      university: '南京大学',
      major: '计算机科学',
      department: '研发',
      position: 'Go后端开发',
      mentorId: 'mentor-01',
      startDate: '2026-03-01',
      currentPhase: 3,
      overallProgress: 88,
      skills: {
        technical: 91,
        business: 78,
        communication: 85,
        innovation: 82,
        execution: 93
      },
      weeklyScores: [78, 80, 83, 85, 87, 89, 91, 93],
      tasks: [
        { id: 't1-06', title: '掌握Go语言与微服务框架', status: 'completed', priority: 'high', dueDate: '2026-03-12' },
        { id: 't2-06', title: '开发消息推送服务', status: 'completed', priority: 'high', dueDate: '2026-03-30' },
        { id: 't3-06', title: '完成高并发网关设计', status: 'completed', priority: 'high', dueDate: '2026-04-15' },
        { id: 't4-06', title: '主导技术方案评审', status: 'in-progress', priority: 'high', dueDate: '2026-05-10' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解服务架构全景', '熟悉Go开发规范', '完成容器化部署培训'] },
        { phase: 2, title: '技能成长期', status: 'completed', items: ['独立开发核心服务', '完成性能压测', '参与架构设计讨论'] },
        { phase: 3, title: '独立产出期', status: 'in-progress', items: ['负责核心模块设计', '技术分享：高并发实践', '实习总结与转正答辩'] }
      ],
      weeklyReports: [
        { week: 8, summary: '完成了API网关的限流熔断方案，使用令牌桶+滑动窗口算法，成功通过10万QPS压测。准备下周的技术分享。', score: 93 },
        { week: 7, summary: '设计并实现了基于gRPC的服务间通信框架，支持链路追踪和自动重试。', score: 91 }
      ],
      riskFlags: [],
      conversionScore: 95,
      conversionRating: 'A'
    },
    {
      id: 'intern-07',
      name: '孙佳怡',
      avatar: '👩‍🔬',
      gender: 'female',
      university: '哈尔滨工业大学',
      major: '自然语言处理',
      department: '研发',
      position: 'NLP算法实习生',
      mentorId: 'mentor-01',
      startDate: '2026-03-15',
      currentPhase: 2,
      overallProgress: 58,
      skills: {
        technical: 78,
        business: 52,
        communication: 58,
        innovation: 75,
        execution: 62
      },
      weeklyScores: [55, 58, 60, 62, 64, 63, 65, 67],
      tasks: [
        { id: 't1-07', title: '调研大模型微调方案', status: 'completed', priority: 'high', dueDate: '2026-03-28' },
        { id: 't2-07', title: '构建意图识别训练数据集', status: 'in-progress', priority: 'high', dueDate: '2026-04-10' },
        { id: 't3-07', title: '完成对话系统Demo开发', status: 'pending', priority: 'high', dueDate: '2026-04-25' },
        { id: 't4-07', title: '模型效果评估与迭代', status: 'pending', priority: 'medium', dueDate: '2026-05-05' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解NLP业务场景', '熟悉训练平台', '完成数据标注规范学习'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['完成数据处理流程', '模型微调实验', '参与效果评估'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['交付对话系统原型', 'LLM应用技术分享', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 7, summary: '本周在数据标注进度上有所延迟，标注一致性需要提升。正在调整标注指南并与外包团队沟通。', score: 67 },
        { week: 6, summary: '完成了LoRA微调方案的可行性验证，在小规模数据上F1达到0.82。', score: 65 }
      ],
      riskFlags: ['进度滞后'],
      conversionScore: 68,
      conversionRating: 'B'
    },
    {
      id: 'intern-08',
      name: '周逸飞',
      avatar: '🧑‍🔧',
      gender: 'male',
      university: '西安交通大学',
      major: '软件工程',
      department: '研发',
      position: 'iOS移动端开发',
      mentorId: 'mentor-01',
      startDate: '2026-03-10',
      currentPhase: 2,
      overallProgress: 64,
      skills: {
        technical: 76,
        business: 68,
        communication: 72,
        innovation: 70,
        execution: 74
      },
      weeklyScores: [62, 65, 67, 69, 71, 73, 74, 76],
      tasks: [
        { id: 't1-08', title: '学习SwiftUI与项目架构', status: 'completed', priority: 'high', dueDate: '2026-03-22' },
        { id: 't2-08', title: '开发个人中心页面', status: 'completed', priority: 'medium', dueDate: '2026-04-02' },
        { id: 't3-08', title: '实现消息推送功能', status: 'in-progress', priority: 'high', dueDate: '2026-04-18' },
        { id: 't4-08', title: '性能优化与内存泄漏排查', status: 'pending', priority: 'medium', dueDate: '2026-04-28' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解App业务架构', '熟悉Swift/SwiftUI', '完成开发环境搭建'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立开发页面模块', '学习性能调优', '参与Bug修复'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责功能迭代', 'iOS开发经验分享', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 8, summary: '完成了APNs推送集成和本地通知管理，调试了后台刷新机制。下周开始做列表页的性能优化。', score: 76 },
        { week: 7, summary: '重构了个人中心页面，采用MVVM架构，代码可读性和可维护性显著提升。', score: 74 }
      ],
      riskFlags: [],
      conversionScore: 75,
      conversionRating: 'B'
    },

    // ── 产品部门 (4人) ──────────────────────────────────
    {
      id: 'intern-09',
      name: '林晓彤',
      avatar: '👩‍💼',
      gender: 'female',
      university: '复旦大学',
      major: '工商管理',
      department: '产品',
      position: '产品策划实习生',
      mentorId: 'mentor-02',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 70,
      skills: {
        technical: 55,
        business: 85,
        communication: 90,
        innovation: 80,
        execution: 75
      },
      weeklyScores: [68, 70, 72, 75, 77, 79, 80, 82],
      tasks: [
        { id: 't1-09', title: '完成竞品分析报告', status: 'completed', priority: 'high', dueDate: '2026-03-15' },
        { id: 't2-09', title: '撰写PRD需求文档', status: 'completed', priority: 'high', dueDate: '2026-03-28' },
        { id: 't3-09', title: '主导用户调研访谈', status: 'in-progress', priority: 'high', dueDate: '2026-04-12' },
        { id: 't4-09', title: '完成功能迭代规划', status: 'pending', priority: 'medium', dueDate: '2026-04-25' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解产品全流程', '学习PRD撰写规范', '完成竞品调研'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立撰写需求文档', '主导用户调研', '参与需求评审'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责功能模块', '数据驱动决策实践', '实习总结'] }
      ],
      weeklyReports: [
        { week: 8, summary: '本周完成了5场用户深度访谈，提炼出3个核心痛点，正在整理用户旅程地图和需求优先级矩阵。', score: 82 },
        { week: 7, summary: '提交了V2.0版本的PRD文档，获得了产品总监的认可，部分建议被采纳到正式路线图中。', score: 80 }
      ],
      riskFlags: [],
      conversionScore: 82,
      conversionRating: 'A'
    },
    {
      id: 'intern-10',
      name: '黄俊杰',
      avatar: '👨‍📊',
      gender: 'male',
      university: '武汉大学',
      major: '统计学',
      department: '产品',
      position: '数据分析实习生',
      mentorId: 'mentor-02',
      startDate: '2026-03-10',
      currentPhase: 2,
      overallProgress: 66,
      skills: {
        technical: 78,
        business: 72,
        communication: 65,
        innovation: 68,
        execution: 76
      },
      weeklyScores: [60, 63, 66, 68, 70, 72, 74, 76],
      tasks: [
        { id: 't1-10', title: '搭建数据分析看板', status: 'completed', priority: 'high', dueDate: '2026-03-22' },
        { id: 't2-10', title: '完成用户留存分析', status: 'completed', priority: 'high', dueDate: '2026-04-01' },
        { id: 't3-10', title: '搭建A/B测试分析框架', status: 'in-progress', priority: 'medium', dueDate: '2026-04-15' },
        { id: 't4-10', title: '输出月度数据洞察报告', status: 'pending', priority: 'medium', dueDate: '2026-04-30' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['熟悉数据分析工具', '了解核心业务指标', '完成SQL进阶培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立完成分析专题', '学习因果推断方法', '参与数据需求评审'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责分析项目', '数据洞察驱动增长', '实习成果汇报'] }
      ],
      weeklyReports: [
        { week: 8, summary: '完成了新用户7日留存的漏斗分析，发现注册流程第3步流失率达42%，提出了简化方案。', score: 76 },
        { week: 7, summary: '搭建了Tableau数据看板，实现了DAU/MAU、留存率等核心指标的自动化监控。', score: 74 }
      ],
      riskFlags: [],
      conversionScore: 76,
      conversionRating: 'B'
    },
    {
      id: 'intern-11',
      name: '吴思颖',
      avatar: '👩‍🎓',
      gender: 'female',
      university: '中山大学',
      major: '心理学',
      department: '产品',
      position: '用户研究实习生',
      mentorId: 'mentor-02',
      startDate: '2026-03-15',
      currentPhase: 2,
      overallProgress: 60,
      skills: {
        technical: 50,
        business: 75,
        communication: 88,
        innovation: 72,
        execution: 70
      },
      weeklyScores: [58, 60, 62, 65, 67, 68, 70, 72],
      tasks: [
        { id: 't1-11', title: '学习用户研究方法论', status: 'completed', priority: 'high', dueDate: '2026-03-28' },
        { id: 't2-11', title: '设计用户满意度问卷', status: 'completed', priority: 'medium', dueDate: '2026-04-05' },
        { id: 't3-11', title: '执行可用性测试', status: 'in-progress', priority: 'high', dueDate: '2026-04-18' },
        { id: 't4-11', title: '输出用户画像报告', status: 'pending', priority: 'medium', dueDate: '2026-04-28' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解用研体系', '学习访谈与问卷设计', '完成研究伦理培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立设计研究方案', '执行可用性测试', '数据分析与洞察提炼'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责用研项目', '建立用户反馈机制', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 7, summary: '完成了问卷数据的统计分析，NPS得分从32提升到41。正在准备下周的可用性测试脚本。', score: 72 },
        { week: 6, summary: '设计了用户满意度CSAT问卷，共收集了1200份有效回复。', score: 70 }
      ],
      riskFlags: [],
      conversionScore: 72,
      conversionRating: 'B'
    },
    {
      id: 'intern-12',
      name: '郑浩然',
      avatar: '🧑‍💼',
      gender: 'male',
      university: '同济大学',
      major: '信息管理',
      department: '产品',
      position: '产品运营实习生',
      mentorId: 'mentor-02',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 45,
      skills: {
        technical: 45,
        business: 60,
        communication: 55,
        innovation: 50,
        execution: 52
      },
      weeklyScores: [50, 52, 48, 50, 53, 51, 54, 55],
      tasks: [
        { id: 't1-12', title: '学习产品运营SOP', status: 'completed', priority: 'high', dueDate: '2026-03-15' },
        { id: 't2-12', title: '完成活动策划方案', status: 'in-progress', priority: 'high', dueDate: '2026-04-01' },
        { id: 't3-12', title: '搭建用户增长漏斗', status: 'pending', priority: 'medium', dueDate: '2026-04-15' },
        { id: 't4-12', title: '输出运营周报', status: 'pending', priority: 'low', dueDate: '2026-04-20' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解运营体系', '学习数据分析基础', '完成工具使用培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立策划运营活动', '学习增长黑客方法', '参与用户分层运营'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责运营专题', '增长实验总结', '实习成果汇报'] }
      ],
      weeklyReports: [
        { week: 8, summary: '活动策划方案仍在修改中，第三版被打回。需要加强对目标用户的理解和数据分析能力。', score: 55 },
        { week: 7, summary: '本周进度较慢，对运营指标的理解不够深入，需要加强与导师的沟通。', score: 54 }
      ],
      riskFlags: ['进度滞后', '技能不足', '缺少主动反馈'],
      conversionScore: 55,
      conversionRating: 'D'
    },

    // ── 销售部门 (3人) ──────────────────────────────────
    {
      id: 'intern-13',
      name: '马天宇',
      avatar: '👨‍💼',
      gender: 'male',
      university: '北京航空航天大学',
      major: '市场营销',
      department: '销售',
      position: '客户经理实习生',
      mentorId: 'mentor-03',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 73,
      skills: {
        technical: 52,
        business: 82,
        communication: 92,
        innovation: 70,
        execution: 85
      },
      weeklyScores: [65, 68, 72, 75, 78, 80, 82, 84],
      tasks: [
        { id: 't1-13', title: '学习CRM系统操作', status: 'completed', priority: 'high', dueDate: '2026-03-12' },
        { id: 't2-13', title: '完成客户拜访10家', status: 'completed', priority: 'high', dueDate: '2026-03-30' },
        { id: 't3-13', title: '独立跟进3个潜在客户', status: 'in-progress', priority: 'high', dueDate: '2026-04-15' },
        { id: 't4-13', title: '完成客户需求方案撰写', status: 'pending', priority: 'medium', dueDate: '2026-04-25' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解销售流程', '学习产品知识', '完成CRM培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立客户拜访', '学习需求挖掘技巧', '参与方案编写'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责客户跟进', '达成销售目标', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 8, summary: '本周成功转化了1个潜在客户进入商务谈判阶段，预计合同金额30万。另外2个客户下周安排二次拜访。', score: 84 },
        { week: 7, summary: '完成了3家新客户的首次拜访，反馈良好。学习了SPIN销售法并在实践中运用。', score: 82 }
      ],
      riskFlags: [],
      conversionScore: 80,
      conversionRating: 'A'
    },
    {
      id: 'intern-14',
      name: '杨雅琪',
      avatar: '👩‍💼',
      gender: 'female',
      university: '厦门大学',
      major: '国际贸易',
      department: '销售',
      position: '渠道拓展实习生',
      mentorId: 'mentor-03',
      startDate: '2026-03-10',
      currentPhase: 2,
      overallProgress: 61,
      skills: {
        technical: 48,
        business: 75,
        communication: 80,
        innovation: 65,
        execution: 72
      },
      weeklyScores: [55, 58, 60, 63, 66, 68, 70, 72],
      tasks: [
        { id: 't1-14', title: '梳理渠道合作伙伴名单', status: 'completed', priority: 'high', dueDate: '2026-03-22' },
        { id: 't2-14', title: '完成渠道政策调研', status: 'completed', priority: 'medium', dueDate: '2026-04-01' },
        { id: 't3-14', title: '拜访5家潜在渠道伙伴', status: 'in-progress', priority: 'high', dueDate: '2026-04-18' },
        { id: 't4-14', title: '制定渠道合作方案', status: 'pending', priority: 'medium', dueDate: '2026-04-28' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解渠道体系', '学习合作伙伴管理', '完成行业知识培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立拓展新渠道', '学习谈判技巧', '参与合作方案设计'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['签约新渠道伙伴', '渠道运营优化', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 7, summary: '本周拜访了2家教育行业渠道伙伴，其中1家表达了强烈合作意向。正在准备合作框架协议。', score: 72 },
        { week: 6, summary: '完成了华东地区渠道调研报告，识别了15家高潜力合作伙伴。', score: 70 }
      ],
      riskFlags: [],
      conversionScore: 70,
      conversionRating: 'B'
    },
    {
      id: 'intern-15',
      name: '徐鹏飞',
      avatar: '🧑‍💼',
      gender: 'male',
      university: '华中科技大学',
      major: '电子商务',
      department: '销售',
      position: '商务拓展实习生',
      mentorId: 'mentor-03',
      startDate: '2026-03-15',
      currentPhase: 1,
      overallProgress: 35,
      skills: {
        technical: 42,
        business: 55,
        communication: 62,
        innovation: 48,
        execution: 50
      },
      weeklyScores: [40, 42, 45, 43, 48, 46, 50, 52],
      tasks: [
        { id: 't1-15', title: '学习商务礼仪与谈判基础', status: 'completed', priority: 'high', dueDate: '2026-03-28' },
        { id: 't2-15', title: '协助准备商务提案', status: 'in-progress', priority: 'medium', dueDate: '2026-04-10' },
        { id: 't3-15', title: '独立完成客户调研', status: 'pending', priority: 'high', dueDate: '2026-04-22' },
        { id: 't4-15', title: '参与商务谈判', status: 'pending', priority: 'medium', dueDate: '2026-05-05' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'in-progress', items: ['了解商务流程', '学习提案撰写', '完成行业知识培训'] },
        { phase: 2, title: '技能成长期', status: 'pending', items: ['独立准备商务材料', '参与客户谈判', '学习合同管理'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责商务项目', '达成BD目标', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 7, summary: '本周在商务提案的撰写上遇到困难，对行业术语和商业模式理解不够。需要更多辅导。', score: 52 },
        { week: 6, summary: '学习了基本的商务礼仪和邮件沟通规范，完成了2份客户背景调研。', score: 50 }
      ],
      riskFlags: ['进度滞后', '技能不足'],
      conversionScore: 58,
      conversionRating: 'D'
    },

    // ── 设计部门 (3人) ──────────────────────────────────
    {
      id: 'intern-16',
      name: '何雨桐',
      avatar: '👩‍🎨',
      gender: 'female',
      university: '中国美术学院',
      major: '视觉传达设计',
      department: '设计',
      position: 'UI设计实习生',
      mentorId: 'mentor-04',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 76,
      skills: {
        technical: 72,
        business: 65,
        communication: 78,
        innovation: 90,
        execution: 82
      },
      weeklyScores: [70, 72, 74, 76, 78, 80, 82, 84],
      tasks: [
        { id: 't1-16', title: '学习设计规范与组件库', status: 'completed', priority: 'high', dueDate: '2026-03-12' },
        { id: 't2-16', title: '完成活动页面视觉设计', status: 'completed', priority: 'high', dueDate: '2026-03-28' },
        { id: 't3-16', title: '重设计个人中心页面', status: 'in-progress', priority: 'high', dueDate: '2026-04-15' },
        { id: 't4-16', title: '参与设计系统建设', status: 'pending', priority: 'medium', dueDate: '2026-04-28' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解设计流程', '熟悉Figma工具', '学习品牌设计规范'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立完成页面设计', '学习动效设计', '参与设计评审'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责设计需求', '设计系统贡献', '实习作品集整理'] }
      ],
      weeklyReports: [
        { week: 8, summary: '完成了个人中心页面的3套设计方案，其中方案B获得团队一致好评。开始制作交互原型。', score: 84 },
        { week: 7, summary: '学习了Lottie动效设计，完成了页面加载动画的设计与导出。', score: 82 }
      ],
      riskFlags: [],
      conversionScore: 81,
      conversionRating: 'A'
    },
    {
      id: 'intern-17',
      name: '许文博',
      avatar: '👨‍🎨',
      gender: 'male',
      university: '江南大学',
      major: '工业设计',
      department: '设计',
      position: '交互设计实习生',
      mentorId: 'mentor-04',
      startDate: '2026-03-10',
      currentPhase: 2,
      overallProgress: 63,
      skills: {
        technical: 65,
        business: 70,
        communication: 75,
        innovation: 82,
        execution: 68
      },
      weeklyScores: [58, 61, 63, 65, 67, 69, 71, 73],
      tasks: [
        { id: 't1-17', title: '学习交互设计原则与方法', status: 'completed', priority: 'high', dueDate: '2026-03-22' },
        { id: 't2-17', title: '完成搜索流程交互优化', status: 'completed', priority: 'high', dueDate: '2026-04-05' },
        { id: 't3-17', title: '设计新版导航方案', status: 'in-progress', priority: 'high', dueDate: '2026-04-20' },
        { id: 't4-17', title: '可用性测试与迭代', status: 'pending', priority: 'medium', dueDate: '2026-04-30' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解交互设计流程', '学习原型工具', '完成设计规范学习'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立完成交互方案', '学习用户测试方法', '参与设计评审'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责交互项目', '设计方法论分享', '实习总结与作品集'] }
      ],
      weeklyReports: [
        { week: 7, summary: '完成了搜索流程的交互优化方案，新流程减少了2步操作，预计可提升搜索转化率15%。', score: 73 },
        { week: 6, summary: '进行了竞品的交互分析，整理了10款同类产品的导航设计模式。', score: 71 }
      ],
      riskFlags: [],
      conversionScore: 74,
      conversionRating: 'B'
    },
    {
      id: 'intern-18',
      name: '沈梦瑶',
      avatar: '👩‍🎨',
      gender: 'female',
      university: '清华大学',
      major: '视觉传达',
      department: '设计',
      position: '视觉设计实习生',
      mentorId: 'mentor-04',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 69,
      skills: {
        technical: 68,
        business: 60,
        communication: 72,
        innovation: 88,
        execution: 78
      },
      weeklyScores: [62, 65, 68, 70, 72, 74, 76, 79],
      tasks: [
        { id: 't1-18', title: '学习品牌视觉规范', status: 'completed', priority: 'high', dueDate: '2026-03-15' },
        { id: 't2-18', title: '完成运营活动海报设计', status: 'completed', priority: 'medium', dueDate: '2026-03-28' },
        { id: 't3-18', title: '设计品牌IP形象延展', status: 'in-progress', priority: 'high', dueDate: '2026-04-18' },
        { id: 't4-18', title: '制作品牌视频动画', status: 'pending', priority: 'medium', dueDate: '2026-04-30' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解品牌视觉体系', '学习设计工具', '完成品牌指南学习'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立完成视觉方案', '学习动态视觉设计', '参与品牌升级项目'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责视觉项目', '品牌设计分享', '实习作品集'] }
      ],
      weeklyReports: [
        { week: 8, summary: '完成了IP形象的3套延展方案，包括表情包、头像生成器等。方案C的3D风格获得好评。', score: 79 },
        { week: 7, summary: '设计了5张运营活动海报，其中2张用于线上投放，点击率高于团队平均水平20%。', score: 76 }
      ],
      riskFlags: [],
      conversionScore: 77,
      conversionRating: 'B'
    },

    // ── 运营部门 (2人) ──────────────────────────────────
    {
      id: 'intern-19',
      name: '韩雪莹',
      avatar: '👩‍📝',
      gender: 'female',
      university: '北京师范大学',
      major: '新闻传播学',
      department: '运营',
      position: '内容运营实习生',
      mentorId: 'mentor-05',
      startDate: '2026-03-01',
      currentPhase: 2,
      overallProgress: 71,
      skills: {
        technical: 55,
        business: 78,
        communication: 85,
        innovation: 82,
        execution: 80
      },
      weeklyScores: [65, 68, 70, 73, 75, 78, 80, 82],
      tasks: [
        { id: 't1-19', title: '学习内容运营方法论', status: 'completed', priority: 'high', dueDate: '2026-03-12' },
        { id: 't2-19', title: '产出10篇原创内容', status: 'completed', priority: 'high', dueDate: '2026-03-30' },
        { id: 't3-19', title: '搭建内容分发矩阵', status: 'in-progress', priority: 'high', dueDate: '2026-04-15' },
        { id: 't4-19', title: '策划系列专题内容', status: 'pending', priority: 'medium', dueDate: '2026-04-28' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解内容运营体系', '学习SEO与内容策略', '完成写作规范培训'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立产出优质内容', '搭建分发渠道', '学习数据分析'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责内容板块', '内容增长策略', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 8, summary: '本周发布了3篇深度技术文章，总阅读量突破5万。搭建了微信+知乎+掘金的分发矩阵。', score: 82 },
        { week: 7, summary: '完成了"技术成长"系列文章的第一期，获得了社区热门推荐。', score: 80 }
      ],
      riskFlags: [],
      conversionScore: 79,
      conversionRating: 'B'
    },
    {
      id: 'intern-20',
      name: '冯子涵',
      avatar: '🧑‍🎤',
      gender: 'male',
      university: '华东师范大学',
      major: '广告学',
      department: '运营',
      position: '活动运营实习生',
      mentorId: 'mentor-05',
      startDate: '2026-03-10',
      currentPhase: 2,
      overallProgress: 56,
      skills: {
        technical: 48,
        business: 68,
        communication: 75,
        innovation: 72,
        execution: 60
      },
      weeklyScores: [50, 53, 55, 58, 60, 62, 63, 65],
      tasks: [
        { id: 't1-20', title: '学习活动运营流程', status: 'completed', priority: 'high', dueDate: '2026-03-22' },
        { id: 't2-20', title: '协助策划线上直播活动', status: 'completed', priority: 'high', dueDate: '2026-04-01' },
        { id: 't3-20', title: '独立策划社群运营活动', status: 'in-progress', priority: 'high', dueDate: '2026-04-18' },
        { id: 't4-20', title: '活动效果复盘报告', status: 'pending', priority: 'medium', dueDate: '2026-04-28' }
      ],
      milestones: [
        { phase: 1, title: '认知融入期', status: 'completed', items: ['了解活动运营体系', '学习项目管理工具', '完成品牌活动复盘'] },
        { phase: 2, title: '技能成长期', status: 'in-progress', items: ['独立策划小型活动', '学习数据复盘方法', '参与跨部门协作'] },
        { phase: 3, title: '独立产出期', status: 'pending', items: ['独立负责活动策划', '活动SOP沉淀', '实习总结报告'] }
      ],
      weeklyReports: [
        { week: 8, summary: '社群活动方案进入第二版迭代，用户参与度目标从500人调整为300人，更加务实。需要加强预算管理能力。', score: 65 },
        { week: 7, summary: '协助完成了一场线上直播活动，参与人数达到800人，但互动率偏低，正在总结经验。', score: 63 }
      ],
      riskFlags: ['执行力待提升'],
      conversionScore: 62,
      conversionRating: 'C'
    }
  ];

  // ============================================================
  // 2. MENTORS - 5位导师数据
  // ============================================================
  const MENTORS = [
    {
      id: 'mentor-01',
      name: '陈建国',
      avatar: '👨‍💼',
      title: '研发技术总监',
      department: '研发',
      internIds: ['intern-01', 'intern-02', 'intern-03', 'intern-04', 'intern-05', 'intern-06', 'intern-07', 'intern-08'],
      yearsExp: 12
    },
    {
      id: 'mentor-02',
      name: '张丽华',
      avatar: '👩‍💼',
      title: '产品高级总监',
      department: '产品',
      internIds: ['intern-09', 'intern-10', 'intern-11', 'intern-12'],
      yearsExp: 9
    },
    {
      id: 'mentor-03',
      name: '王志强',
      avatar: '👨‍💼',
      title: '销售总监',
      department: '销售',
      internIds: ['intern-13', 'intern-14', 'intern-15'],
      yearsExp: 10
    },
    {
      id: 'mentor-04',
      name: '刘美琳',
      avatar: '👩‍🎨',
      title: '设计中心负责人',
      department: '设计',
      internIds: ['intern-16', 'intern-17', 'intern-18'],
      yearsExp: 8
    },
    {
      id: 'mentor-05',
      name: '杨建明',
      avatar: '👨‍💼',
      title: '运营总监',
      department: '运营',
      internIds: ['intern-19', 'intern-20'],
      yearsExp: 7
    }
  ];

  // ============================================================
  // 3. DEPARTMENTS - 部门配置
  // ============================================================
  const DEPARTMENTS = {
    '研发': { color: '#00C4FF', icon: '💻', label: '研发部', headcount: 8 },
    '产品': { color: '#A855F7', icon: '📋', label: '产品部', headcount: 4 },
    '销售': { color: '#FFB800', icon: '💰', label: '销售部', headcount: 3 },
    '设计': { color: '#FF4D6A', icon: '🎨', label: '设计部', headcount: 3 },
    '运营': { color: '#00D9A3', icon: '📢', label: '运营部', headcount: 2 }
  };

  // ============================================================
  // 4. SKILL_DIMENSIONS - 能力维度
  // ============================================================
  const SKILL_DIMENSIONS = ['技术能力', '业务理解', '沟通协作', '创新思维', '执行力'];

  // skill key 与中文 label 的映射
  const SKILL_KEY_MAP = {
    technical: '技术能力',
    business: '业务理解',
    communication: '沟通协作',
    innovation: '创新思维',
    execution: '执行力'
  };

  // ============================================================
  // 5. PHASE_CONFIG - 30/60/90天阶段配置
  // ============================================================
  const PHASE_CONFIG = [
    {
      phase: 1,
      name: '认知融入期',
      days: '1-30天',
      color: '#00D9A3',
      icon: '🌱',
      goals: [
        '快速了解公司文化与团队',
        '熟悉工作流程和工具链',
        '明确岗位职责与学习目标',
        '建立与导师的沟通节奏'
      ],
      keyActivities: [
        '入职培训与团建活动',
        '业务知识与技术栈学习',
        '导师一对一目标设定',
        '每周总结与反思',
        '完成至少1个学习型任务'
      ],
      expectedOutput: '提交学习总结报告，明确后续成长方向',
      assessmentCriteria: ['学习态度', '融入程度', '基础技能掌握', '沟通主动性']
    },
    {
      phase: 2,
      name: '技能成长期',
      days: '31-60天',
      color: '#FFB800',
      icon: '🚀',
      goals: [
        '深入参与实际项目',
        '独立完成中等难度任务',
        '建立跨团队协作能力',
        '形成自己的工作方法论'
      ],
      keyActivities: [
        '参与项目迭代开发/执行',
        '独立承担模块级任务',
        '参与团队评审和复盘',
        '接受中期评估与反馈',
        '至少完成3个实践型任务'
      ],
      expectedOutput: '完成至少2个独立交付的工作成果',
      assessmentCriteria: ['专业技能', '独立解决问题能力', '协作效率', '交付质量']
    },
    {
      phase: 3,
      name: '独立产出期',
      days: '61-90天',
      color: '#FF4D6A',
      icon: '🏆',
      goals: [
        '独立负责完整需求/项目',
        '展示个人专业价值',
        '进行知识分享与沉淀',
        '完成实习总结与转正评估'
      ],
      keyActivities: [
        '独立负责端到端交付',
        '进行至少1次知识/技术分享',
        '撰写实习总结报告',
        '参与转正答辩',
        '完成最终评估'
      ],
      expectedOutput: '完整的实习成果展示与转正答辩材料',
      assessmentCriteria: ['独立性', '交付成果质量', '成长幅度', '团队贡献', '转正潜力']
    }
  ];

  // ============================================================
  // 6. TEACHING_PLAN_TEMPLATE - 标准带教计划模板
  // ============================================================
  const TEACHING_PLAN_TEMPLATE = {
    title: '实习生标准带教计划（90天）',
    version: '2.0',
    lastUpdated: '2026-03-01',
    weeks: [
      {
        week: 1,
        phase: 1,
        theme: '破冰与环境熟悉',
        mentorTasks: ['安排入职引导', '介绍团队成员', '设定沟通频率', '分配学习资源'],
        internTasks: ['完成入职手续', '了解团队架构', '搭建开发/工作环境', '阅读新人指南'],
        checkpoints: ['环境搭建完成', '团队成员认识', '学习计划确认']
      },
      {
        week: 2,
        phase: 1,
        theme: '业务与技术学习',
        mentorTasks: ['讲解业务全景', '推荐学习资料', '安排小型练习任务', '首次1v1沟通'],
        internTasks: ['学习业务知识', '完成技术/工具培训', '输出学习笔记', '提出疑问清单'],
        checkpoints: ['业务理解测试', '工具操作验证', '学习笔记提交']
      },
      {
        week: 3,
        phase: 1,
        theme: '参与式学习',
        mentorTasks: ['分配观摩任务', '安排影子跟学', '提供反馈指导', '解答疑惑'],
        internTasks: ['观摩项目会议', '尝试简单任务', '记录学习心得', '请教前辈经验'],
        checkpoints: ['任务完成情况', '主动性评估', '融入度反馈']
      },
      {
        week: 4,
        phase: 1,
        theme: '第一阶段总结',
        mentorTasks: ['进行阶段评估', '反馈优劣势', '调整培养计划', '设定下阶段目标'],
        internTasks: ['撰写月度总结', '自我评估', '制定改进计划', '与导师讨论目标'],
        checkpoints: ['月度总结提交', '评估面谈完成', '下阶段目标确认']
      },
      {
        week: 5,
        phase: 2,
        theme: '独立任务启动',
        mentorTasks: ['分配独立任务', '明确交付标准', '提供技术支持', '定期检查进度'],
        internTasks: ['理解任务需求', '制定执行计划', '开始独立开发/执行', '及时反馈进度'],
        checkpoints: ['任务计划确认', '中期进度检查', '问题记录更新']
      },
      {
        week: 6,
        phase: 2,
        theme: '深度参与项目',
        mentorTasks: ['引入更复杂任务', '组织代码/方案评审', '鼓励创新尝试', '提供成长建议'],
        internTasks: ['深入项目开发', '参与评审活动', '学习最佳实践', '解决复杂问题'],
        checkpoints: ['任务交付质量', '评审参与度', '问题解决能力']
      },
      {
        week: 7,
        phase: 2,
        theme: '能力突破期',
        mentorTasks: ['提供挑战性任务', '鼓励跨团队协作', '中期评估准备', '识别潜力方向'],
        internTasks: ['攻克难点任务', '主动寻求协作', '总结方法论', '准备中期汇报'],
        checkpoints: ['难点任务完成', '协作反馈收集', '中期汇报准备']
      },
      {
        week: 8,
        phase: 2,
        theme: '第二阶段总结',
        mentorTasks: ['中期评估面谈', '能力雷达图更新', '调整后续重点', '转正可能性预判'],
        internTasks: ['完成中期总结', '技能自评更新', '确认最后阶段目标', '查漏补缺'],
        checkpoints: ['中期评估完成', '能力雷达更新', '最终阶段计划确认']
      },
      {
        week: 9,
        phase: 3,
        theme: '独立负责项目',
        mentorTasks: ['分配独立负责的需求', '减少干预频率', '关注交付质量', '提供战略性指导'],
        internTasks: ['端到端负责需求', '自主决策执行', '协调资源推进', '确保交付质量'],
        checkpoints: ['需求理解准确', '执行计划合理', '里程碑按时完成']
      },
      {
        week: 10,
        phase: 3,
        theme: '知识分享与沉淀',
        mentorTasks: ['安排分享机会', '指导分享准备', '提供展示平台', '收集同事反馈'],
        internTasks: ['准备技术/经验分享', '完成知识文档', '进行团队分享', '接受反馈改进'],
        checkpoints: ['分享材料质量', '现场表现评估', '文档沉淀完成']
      },
      {
        week: 11,
        phase: 3,
        theme: '成果收尾',
        mentorTasks: ['督促成果整理', '提供总结指导', '准备推荐评语', '安排答辩事宜'],
        internTasks: ['整理实习成果', '撰写总结报告', '准备答辩材料', '完成工作交接文档'],
        checkpoints: ['总结报告初稿', '答辩材料准备', '交接文档完成']
      },
      {
        week: 12,
        phase: 3,
        theme: '转正答辩与评估',
        mentorTasks: ['组织最终评估', '提交转正建议', '颁发实习证明', '职业发展建议'],
        internTasks: ['完成转正答辩', '提交最终报告', '完成离职/转正手续', '感谢与告别'],
        checkpoints: ['答辩完成', '最终评估提交', '手续办理完成']
      }
    ]
  };

  // ============================================================
  // 7. AI_RESPONSE_TEMPLATES - AI助手回复模板
  // ============================================================
  const AI_RESPONSE_TEMPLATES = {
    // 学习建议类
    learningSuggestions: {
      technical: [
        '基于{name}当前的技术能力评分({score}分)，建议重点加强以下方面：\n1. 深入学习{skill}核心原理，推荐阅读官方文档和源码\n2. 通过实战项目巩固知识，每周至少完成1个小型练习\n3. 参与团队Code Review，学习前辈的编码规范和设计思路',
        '观察到{name}在技术方面进步迅速，建议尝试更有挑战性的任务：\n1. 可以尝试独立设计一个小型技术方案\n2. 学习性能优化和架构设计的基本方法\n3. 关注行业前沿技术动态，拓展技术视野'
      ],
      business: [
        '建议{name}通过以下方式提升业务理解能力：\n1. 主动参加产品需求评审会，了解需求背后的业务逻辑\n2. 阅读行业分析报告，建立市场认知\n3. 与产品、运营同事多交流，了解用户反馈',
        '{name}的业务理解能力需要加强，推荐：\n1. 每周花30分钟研究竞品的功能设计\n2. 关注团队OKR和业务数据指标\n3. 尝试用业务视角思考技术方案的价值'
      ],
      communication: [
        '提升{name}沟通协作能力的建议：\n1. 每日站会主动汇报进度和blockers\n2. 遇到问题先独立思考15分钟，再向同事请教\n3. 学习结构化表达，使用"背景-问题-方案-收益"的框架',
        '建议{name}在沟通方面注意：\n1. 邮件和消息保持简洁清晰\n2. 跨团队沟通前做好充分准备\n3. 主动给予同事反馈和支持'
      ]
    },

    // 进度查询类
    progressQueries: {
      onTrack: '✅ {name}当前总体进度{progress}%，处于{phase}，整体表现良好。\n\n📊 关键指标：\n- 周评分趋势：{trend}\n- 任务完成率：{taskRate}\n- 能力均衡度：{balance}\n\n💡 建议继续保持当前节奏，可以适当挑战更高难度的任务。',
      atRisk: '⚠️ {name}当前总体进度{progress}%，存在以下风险信号：\n{riskFlags}\n\n📊 关键指标：\n- 周评分趋势：{trend}\n- 任务完成率：{taskRate}\n\n🔧 建议措施：\n1. 增加导师1v1沟通频率至每周2次\n2. 适当降低任务难度，确保完成度\n3. 关注心态变化，提供鼓励和支持',
      excellent: '🌟 {name}表现优异！当前进度{progress}%，多项指标领先。\n\n📊 亮点：\n- 周评分持续上升\n- 技术能力突出（{topSkill}分）\n- 任务交付质量高\n\n🚀 建议：可以考虑让{name}承担更多挑战性工作，为转正做准备。'
    },

    // 转正预测类
    conversionPredictions: {
      high: '📈 {name}转正概率预测：{score}%（{rating}级）\n\n✅ 优势因素：\n{strengths}\n\n📋 转正建议：\n- 保持当前良好势头\n- 完成剩余里程碑任务\n- 准备好实习总结和答辩材料',
      medium: '📊 {name}转正概率预测：{score}%（{rating}级）\n\n✅ 优势：{strengths}\n⚠️ 待提升：{weaknesses}\n\n📋 提升建议：\n- 重点弥补短板领域\n- 增加高质量产出\n- 加强与导师的沟通反馈',
      low: '📉 {name}转正概率预测：{score}%（{rating}级）\n\n⚠️ 主要问题：\n{issues}\n\n🔧 紧急改进计划：\n1. 立即与导师进行深度面谈\n2. 制定2周短期冲刺计划\n3. 每日反馈进度，寻求及时帮助'
    },

    // 通用回复
    general: {
      greeting: '你好！我是实习管理AI助手。我可以帮你：\n📊 查看实习生进度和数据\n📝 提供学习和成长建议\n🔮 分析转正概率预测\n📅 制定培养计划\n\n请问有什么需要帮助的？',
      notFound: '抱歉，未找到相关信息。请确认实习生姓名或编号是否正确，或尝试换一种方式描述你的问题。',
      error: '抱歉，处理你的请求时遇到了问题。请稍后再试，或联系管理员获取帮助。'
    },

    // 周报分析
    weeklyAnalysis: {
      improving: '📈 {name}近期表现呈上升趋势（最近4周得分：{scores}）。\n\n亮点：\n- 学习能力强，进步明显\n- {highlight}\n\n建议关注：\n- 保持学习热情\n- 尝试更复杂的挑战',
      declining: '📉 {name}近期表现有所下滑（最近4周得分：{scores}）。\n\n可能原因：\n- 任务难度骤增\n- 工作方法需要调整\n- 可能存在心态波动\n\n建议：\n- 及时安排导师面谈\n- 调整任务节奏\n- 提供更多支持和鼓励',
      stable: '➡️ {name}近期表现稳定（最近4周得分：{scores}）。\n\n分析：\n- 基础扎实，输出稳定\n- 可能进入能力平台期\n\n建议：\n- 引入新的挑战和学习目标\n- 鼓励跨领域探索\n- 安排成长突破性任务'
    }
  };

  // ============================================================
  // 8. NOTIFICATION_TYPES - 通知类型配置
  // ============================================================
  const NOTIFICATION_TYPES = {
    taskDue: { icon: '⏰', color: '#FFB800', label: '任务到期提醒' },
    weeklyReport: { icon: '📝', color: '#00C4FF', label: '周报提交' },
    milestoneComplete: { icon: '🎉', color: '#00D9A3', label: '里程碑达成' },
    riskAlert: { icon: '⚠️', color: '#FF4D6A', label: '风险预警' },
    mentorFeedback: { icon: '💬', color: '#A855F7', label: '导师反馈' },
    systemUpdate: { icon: '🔔', color: '#6B7280', label: '系统通知' }
  };

  // ============================================================
  // 9. CONVERSION_RATING_CONFIG - 转正评级配置
  // ============================================================
  const CONVERSION_RATING_CONFIG = {
    A: { label: '优秀', color: '#00D9A3', minScore: 80, description: '强烈推荐转正' },
    B: { label: '良好', color: '#00C4FF', minScore: 70, description: '推荐转正' },
    C: { label: '一般', color: '#FFB800', minScore: 60, description: '有条件转正' },
    D: { label: '待提升', color: '#FF4D6A', minScore: 0, description: '暂不推荐转正' }
  };

  // ============================================================
  // 公开接口
  // ============================================================
  return {
    INTERNS: INTERNS,
    interns: INTERNS,
    MENTORS: MENTORS,
    mentors: MENTORS,
    DEPARTMENTS: DEPARTMENTS,
    departments: DEPARTMENTS,
    SKILL_DIMENSIONS: SKILL_DIMENSIONS,
    skill_dimensions: SKILL_DIMENSIONS,
    SKILL_KEY_MAP: SKILL_KEY_MAP,
    PHASE_CONFIG: PHASE_CONFIG,
    phase_config: PHASE_CONFIG,
    TEACHING_PLAN_TEMPLATE: TEACHING_PLAN_TEMPLATE,
    AI_RESPONSE_TEMPLATES: AI_RESPONSE_TEMPLATES,
    NOTIFICATION_TYPES: NOTIFICATION_TYPES,
    CONVERSION_RATING_CONFIG: CONVERSION_RATING_CONFIG
  };

})();
