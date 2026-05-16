/**
 * 动物性格测试 - MBTI+BigFive双维度版
 * 题目 = MBTI四维(20题) + BigFive五维(18题) 共38题
 * 结果 = 动物人格（由双维度计算得出，17种动物）
 */

window.ANIMAL_CONFIG = {
  // ==================== 主题配置 ====================
  theme: {
    title: "动物性格测试",
    subtitle: "MBTI已过时，动物人格才是新潮流",
    description: "38道题，测出你的动物人格",
    colors: {
      bg: "#0a0f1a", panel: "#0d1525", card: "#111d32", border: "#1e3050",
      text: "#e8edf5", muted: "#5a7a9a", primary: "#f59e0b", accent: "#3b82f6"
    }
  },

  // ==================== 稀有度配置 ====================
  rarities: {
    legendary: { name: "传说", prob: 5, color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", stars: 5, emoji: "🌟" },
    epic:      { name: "史诗", prob: 10, color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)", stars: 4, emoji: "💜" },
    rare:      { name: "稀有", prob: 25, color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)", stars: 3, emoji: "💎" },
    common:    { name: "普通", prob: 60, color: "#64748b", gradient: "linear-gradient(135deg, #64748b, #94a3b8)", stars: 2, emoji: "✨" }
  },

  // ==================== 动物定义（17种）====================
  animals: [
    // ── 传说 5% ──
    { id:"dragon",   name:"龙",      emoji:"🐉", rarity:"legendary",
      traits:["威严","掌控","领袖"],
      description:"你是人群中的绝对领袖，天生具有吸引他人追随的气场。充满野心与决断力，敢于冒险，渴望站在最高点。你的意志如钢铁，行动如疾风，是天生的改变者。",
      strength:"战略思维极强，决策果断，敢想敢做",
      weakness:"有时过于强势，容易忽略他人感受",
      bestMatch:["凤凰","白虎"], worstMatch:["猫","考拉"], keyword:"王者归来",
      profile:{ Extraversion:80, Agreeableness:60, Conscientiousness:85, Openness:75, Neuroticism:25 }},
    { id:"phoenix",  name:"凤凰",    emoji:"🔥", rarity:"legendary",
      traits:["重生","激情","魅力"],
      description:"你拥有在逆境中重生的惊人力量。无论遭遇多大挫折，都能浴火重生。你的热情具有强大的感染力，是朋友圈中的精神领袖，总能激励他人。",
      strength:"抗压能力极强，热情洋溢，感染力惊人",
      weakness:"有时过度付出，燃烧自己照亮他人",
      bestMatch:["龙","狼"], worstMatch:["乌龟","考拉"], keyword:"浴火重生",
      profile:{ Extraversion:75, Agreeableness:80, Conscientiousness:50, Openness:80, Neuroticism:60 }},
    { id:"unicorn",  name:"独角兽",  emoji:"🦄", rarity:"legendary",
      traits:["梦幻","纯真","独特"],
      description:"你是独一无二的存在，拥有童话般的纯净心灵。充满创意与想象力，在人群中总是那个最特别的存在。你的出现让周围的一切都变得美好。",
      strength:"创意无限，思维独特，审美出众",
      weakness:"活在理想世界，现实感稍弱",
      bestMatch:["白狐","猫"], worstMatch:["狼","熊"], keyword:"梦幻纯粹",
      profile:{ Openness:95, Agreeableness:75, Conscientiousness:40, Extraversion:35, Neuroticism:50 }},
    // ── 史诗 10% ──
    { id:"tiger",     name:"白虎",    emoji:"🐯", rarity:"epic",
      traits:["勇猛","正义","守护"],
      description:"你是正义的化身，身上流淌着战士的血液。勇敢无畏，面对不公会毫不犹豫地站出来。你的保护欲极强，是朋友眼中最可靠的后盾。",
      strength:"勇敢无畏，正义感强，守护心重",
      weakness:"有时过于冲动，缺乏耐心",
      bestMatch:["狼","凤凰"], worstMatch:["蛇","狐狸"], keyword:"正义守护",
      profile:{ Extraversion:70, Conscientiousness:80, Agreeableness:65, Openness:60, Neuroticism:30 }},
    { id:"kirin",     name:"麒麟",    emoji:"🦒", rarity:"epic",
      traits:["祥瑞","智慧","仁慈"],
      description:"你是吉祥与福气的象征，待人温和，心地善良到极致。智慧与同理心并存，是朋友倾诉时的最佳听众。你的存在本身就能给人带来平静与安心。",
      strength:"情商极高，同理心强，温和而有原则",
      weakness:"过度包容，缺乏边界感",
      bestMatch:["猫","考拉"], worstMatch:["狼","豹"], keyword:"祥瑞仁心",
      profile:{ Agreeableness:95, Conscientiousness:60, Openness:70, Extraversion:40, Neuroticism:20 }},
    { id:"whale",     name:"鲸鱼",    emoji:"🐋", rarity:"epic",
      traits:["深邃","包容","沉稳"],
      description:"你是深沉与包容的化身，内心有着丰富的情感世界。安静却充满力量，不张扬却让人无法忽视。你的情绪稳定，是朋友们的定心丸。",
      strength:"情绪稳定，胸襟宽广，沉着冷静",
      weakness:"不善于表达情感，有时显得疏离",
      bestMatch:["海豚","猫头鹰"], worstMatch:["猴子","兔子"], keyword:"深沉如海",
      profile:{ Neuroticism:20, Agreeableness:80, Conscientiousness:70, Openness:65, Extraversion:30 }},
    // ── 稀有 25% ──
    { id:"wolf",     name:"狼",      emoji:"🐺", rarity:"rare",
      traits:["忠诚","团队","敏锐"],
      description:"你是天生的团队协作大师，忠诚是你最闪耀的品质。对家人和朋友绝对忠诚，在群体中总是默默承担，却从不计较回报。直觉敏锐，能第一时间察觉危险。",
      strength:"忠诚度高，团队意识强，直觉敏锐",
      weakness:"过度依赖群体，社交圈固定",
      bestMatch:["狼","凤凰"], worstMatch:["猫","独角兽"], keyword:"狼性忠诚",
      profile:{ Extraversion:65, Agreeableness:55, Conscientiousness:80, Openness:55, Neuroticism:35 }},
    { id:"eagle",    name:"鹰",      emoji:"🦅", rarity:"rare",
      traits:["视野","自由","洞察"],
      description:"你拥有超越常人的视野与洞察力，能看到别人看不到的机会与危险。追求自由，不愿被束缚，一旦确定目标便如离弦之箭。你是天生的战略家。",
      strength:"战略眼光极高，执行力强，看透本质",
      weakness:"有时过于挑剔，缺乏耐心",
      bestMatch:["龙","白虎"], worstMatch:["考拉","乌龟"], keyword:"鹰击长空",
      profile:{ Openness:85, Conscientiousness:80, Extraversion:55, Agreeableness:45, Neuroticism:25 }},
    { id:"leopard",  name:"豹",      emoji:"🐆", rarity:"rare",
      traits:["敏捷","优雅","独立"],
      description:"你是速度与优雅的完美结合，做事干净利落，从不拖泥带水。独立自主，不依赖他人，同时保持着优雅的气质和生活品味。是个优雅的现实主义者。",
      strength:"行动效率高，独立自信，品味出众",
      weakness:"有时冷漠，不善于求助他人",
      bestMatch:["豹","猫"], worstMatch:["考拉","猪"], keyword:"优雅猎手",
      profile:{ Conscientiousness:75, Extraversion:50, Openness:65, Agreeableness:40, Neuroticism:30 }},
    { id:"dolphin",  name:"海豚",    emoji:"🐬", rarity:"rare",
      traits:["智慧","友善","快乐"],
      description:"你是快乐与智慧的结合体，总能在社交中找到平衡点。善于沟通，是朋友圈中的开心果和氛围制造者。同时拥有高情商和高智商。",
      strength:"社交能力强，情商高，适应力强",
      weakness:"有时为了讨好他人而失去自我",
      bestMatch:["鲸鱼","猴子"], worstMatch:["狼","蛇"], keyword:"快乐使者",
      profile:{ Extraversion:90, Agreeableness:85, Openness:70, Conscientiousness:55, Neuroticism:30 }},
    { id:"owl",      name:"猫头鹰",  emoji:"🦉", rarity:"rare",
      traits:["智慧","冷静","洞察"],
      description:"你是深沉的思考者，追求知识与智慧。冷静理性，善于分析问题，能在混乱中保持清醒的头脑。话不多但每一句都有分量。",
      strength:"逻辑清晰，洞察力强，冷静沉着",
      weakness:"过于理性，有时缺乏行动力",
      bestMatch:["狐狸","猫头鹰"], worstMatch:["猴子","兔子"], keyword:"智慧之光",
      profile:{ Openness:80, Conscientiousness:75, Neuroticism:25, Extraversion:30, Agreeableness:60 }},
    // ── 普通 60% ──
    { id:"cat",      name:"猫",      emoji:"🐱", rarity:"common",
      traits:["独立","傲娇","好奇"],
      description:"你是独立自主的化身，喜欢按自己的节奏生活。表面高冷，内心温暖，只对真正在乎的人展现柔软的一面。充满好奇心，总是对世界保持探索欲。",
      strength:"独立自主，适应力强，温柔而有趣",
      weakness:"有时显得冷漠，不善表达感情",
      bestMatch:["猫","兔子"], worstMatch:["狼","狗"], keyword:"傲娇独立",
      profile:{ Openness:70, Extraversion:35, Conscientiousness:50, Agreeableness:55, Neuroticism:45 }},
    { id:"dog",      name:"狗",      emoji:"🐶", rarity:"common",
      traits:["忠诚","热情","开朗"],
      description:"你是忠诚与热情的代名词，对在乎的人毫无保留。开朗乐观，总能在朋友需要时带来温暖。直觉敏锐，能第一时间感知你的情绪变化。",
      strength:"忠诚度极高，热情开朗，感知力强",
      weakness:"过度依赖认可，有时过于讨好",
      bestMatch:["狗","兔子"], worstMatch:["猫","蛇"], keyword:"忠诚伙伴",
      profile:{ Extraversion:80, Agreeableness:90, Conscientiousness:60, Openness:50, Neuroticism:40 }},
    { id:"rabbit",   name:"兔子",    emoji:"🐰", rarity:"common",
      traits:["温柔","敏捷","警觉"],
      description:"你是温柔与敏感的结合体，心思细腻，能敏锐地察觉周围人的情绪变化。外表柔弱，内心敏捷，适应力极强。是你朋友圈里的情绪调节师。",
      strength:"感知力强，善解人意，适应力好",
      weakness:"敏感多疑，容易焦虑",
      bestMatch:["兔子","考拉"], worstMatch:["狼","老虎"], keyword:"温柔敏锐",
      profile:{ Agreeableness:85, Neuroticism:65, Extraversion:45, Openness:55, Conscientiousness:40 }},
    { id:"panda",    name:"熊猫",    emoji:"🐼", rarity:"common",
      traits:["治愈","淡定","萌趣"],
      description:"你是天生的治愈系存在，和你在一起会感到莫名的安心。外表呆萌，内心淡定从容，无论外界多喧嚣，你总能保持自己的节奏。",
      strength:"情绪稳定，治愈力强，心态平和",
      weakness:"缺乏危机意识，竞争意识弱",
      bestMatch:["熊猫","考拉"], worstMatch:["豹","狼"], keyword:"治愈萌物",
      profile:{ Neuroticism:20, Agreeableness:80, Conscientiousness:40, Extraversion:35, Openness:55 }},
    { id:"koala",    name:"考拉",    emoji:"🐨", rarity:"common",
      traits:["慢活","淡定","陪伴"],
      description:"你是慢生活的代言人，看似慵懒实则有大智慧。懂得在快节奏中保持自我，不争不抢却让人无法忽视你的存在。是个可靠的陪伴者。",
      strength:"心态平和，相处轻松，压力低",
      weakness:"缺乏紧迫感，适应变化较慢",
      bestMatch:["考拉","熊猫"], worstMatch:["豹","鹰"], keyword:"慢享生活",
      profile:{ Neuroticism:15, Agreeableness:75, Conscientiousness:30, Extraversion:25, Openness:45 }},
    { id:"fox",      name:"狐狸",    emoji:"🦊", rarity:"common",
      traits:["机智","灵活","魅力"],
      description:"你是机智与魅力的结合体，反应快，社交能力强。善于察言观色，总能在复杂局面中找到最优解。外表与内在同样精彩，让人捉摸不透。",
      strength:"机智灵活，社交能力强，魅力十足",
      weakness:"有时过于算计，缺乏真诚",
      bestMatch:["猫头鹰","狐狸"], worstMatch:["狼","老虎"], keyword:"机敏狡黠",
      profile:{ Openness:75, Extraversion:60, Conscientiousness:55, Agreeableness:50, Neuroticism:40 }}
  ],

  // ==================== 题目配置（MBTI + BigFive，共38题）====================
  questions: [
    // ── MBTI · E/I 能量倾向 (5题) ──
    { section:"MBTI · 能量倾向", type:"mbti", dim:"E", text:"周末你通常更喜欢？", opts:[{l:"A",t:"和一大群朋友聚会，社交充电",s:5},{l:"B",t:"和几个亲密的朋友小聚",s:4},{l:"C",t:"一个人安静地待着，阅读或发呆",s:2},{l:"D",t:"能不说话就不说话",s:1}]},
    { section:"MBTI · 能量倾向", type:"mbti", dim:"E", text:"在社交场合中，你往往？", opts:[{l:"A",t:"主动发起话题，成为全场焦点",s:5},{l:"B",t:"自然地参与交谈",s:4},{l:"C",t:"安静倾听，适时回应",s:2},{l:"D",t:"倾向于做个旁观者",s:1}]},
    { section:"MBTI · 能量倾向", type:"mbti", dim:"E", text:"你更倾向于？", opts:[{l:"A",t:"从外部世界获取能量和动力",s:5},{l:"B",t:"在独处和社交之间找到平衡",s:3},{l:"C",t:"从独处中获得内心的平静",s:2},{l:"D",t:"完全不需要外界互动",s:1}]},
    { section:"MBTI · 能量倾向", type:"mbti", dim:"E", text:"假期你更喜欢？", opts:[{l:"A",t:"去热门目的地打卡，参加热闹活动",s:5},{l:"B",t:"周边短途，有社交也有休息",s:3},{l:"C",t:"在安静的咖啡馆或书店度过",s:2},{l:"D",t:"在家追剧、看书，深度宅",s:1}]},
    { section:"MBTI · 能量倾向", type:"mbti", dim:"E", text:"你希望别人对你的第一印象是？", opts:[{l:"A",t:"气场很强，一看就不是普通人",s:5},{l:"B",t:"温暖亲切，让人想亲近",s:4},{l:"C",t:"高冷神秘，想进一步了解",s:2},{l:"D",t:"呆萌可爱，没有攻击性",s:1}]},

    // ── MBTI · N/S 信息感知 (5题) ──
    { section:"MBTI · 信息感知", type:"mbti", dim:"N", text:"当你阅读小说时，更被什么吸引？", opts:[{l:"A",t:"背后的隐喻、象征和深层含义",s:5},{l:"B",t:"有趣的情节和出乎意料的转折",s:4},{l:"C",t:"真实细腻的人物刻画",s:2},{l:"D",t:"准确的事实和真实的历史细节",s:1}]},
    { section:"MBTI · 信息感知", type:"mbti", dim:"N", text:"解决一个问题时，你更依赖？", opts:[{l:"A",t:"直觉和灵感，突然想到解决方案",s:5},{l:"B",t:"观察规律，从过往经验中推断",s:3},{l:"C",t:"具体的证据和实际的数据",s:1},{l:"D",t:"一步步逻辑推理",s:2}]},
    { section:"MBTI · 信息感知", type:"mbti", dim:"N", text:"面对一个新项目，你更关注？", opts:[{l:"A",t:"可能性和长远愿景",s:5},{l:"B",t:"具体的执行步骤和资源",s:2},{l:"C",t:"现实条件和限制因素",s:1},{l:"D",t:"各方利益相关者的反应",s:3}]},
    { section:"MBTI · 信息感知", type:"mbti", dim:"N", text:"你更相信？", opts:[{l:"A",t:"抽象的理论和发展规律",s:5},{l:"B",t:"眼前的现实和具体经验",s:1},{l:"C",t:"两者结合，实践出真知",s:3},{l:"D",t:"直觉告诉我的答案",s:4}]},
    { section:"MBTI · 信息感知", type:"mbti", dim:"N", text:"你看一场展览，更在意的是？", opts:[{l:"A",t:"背后的创意和思想表达",s:5},{l:"B",t:"作品本身的技巧和美感",s:3},{l:"C",t:"作品的历史价值和出处",s:1},{l:"D",t:"朋友圈的点赞和评价",s:2}]},

    // ── MBTI · F/T 决策方式 (5题) ──
    { section:"MBTI · 决策方式", type:"mbti", dim:"F", text:"在做重大决定时，你最看重？", opts:[{l:"A",t:"是否符合我的价值观和内心感受",s:5},{l:"B",t:"对相关人的影响是否正向",s:4},{l:"C",t:"客观的利弊分析和最优解",s:1},{l:"D",t:"逻辑是否自洽，前后一致",s:2}]},
    { section:"MBTI · 决策方式", type:"mbti", dim:"F", text:"当你强烈不同意朋友的某个决定时，你会？", opts:[{l:"A",t:"直接说出我的顾虑和感受",s:5},{l:"B",t:"温和地表达，希望对方理解",s:4},{l:"C",t:"理性分析利弊，客观陈述",s:2},{l:"D",t:"尊重对方的选择，不过多干涉",s:1}]},
    { section:"MBTI · 决策方式", type:"mbti", dim:"F", text:"你认为自己更偏向？", opts:[{l:"A",t:"情感型，总会考虑人的感受",s:5},{l:"B",t:"在情感和理性之间平衡",s:3},{l:"C",t:"理性型，逻辑优先",s:2},{l:"D",t:"极度理性，一切以事实为依据",s:1}]},
    { section:"MBTI · 决策方式", type:"mbti", dim:"F", text:"一个高效但缺乏人情味的管理者，你怎么看？", opts:[{l:"A",t:"难以接受，缺乏温度和人情味",s:5},{l:"B",t:"可以理解，但不太欣赏",s:4},{l:"C",t:"欣赏其效率和公正",s:2},{l:"D",t:"只要结果好，方式无所谓",s:1}]},
    { section:"MBTI · 决策方式", type:"mbti", dim:"F", text:"朋友找你倾诉烦恼，你的第一反应是？", opts:[{l:"A",t:"先共情，再给建议",s:5},{l:"B",t:"认真倾听，帮他分析问题",s:3},{l:"C",t:"给他一些实用的解决方案",s:2},{l:"D",t:"让他自己消化，不需要我介入",s:1}]},

    // ── MBTI · J/P 执行方式 (5题) ──
    { section:"MBTI · 执行方式", type:"mbti", dim:"J", text:"你更喜欢以什么方式完成工作？", opts:[{l:"A",t:"按计划一步步推进，有条不紊",s:5},{l:"B",t:"有大致方向，边做边调整",s:3},{l:"C",t:"保持灵活，随机应变",s:1},{l:"D",t:"先思考全局，再决定怎么干",s:4}]},
    { section:"MBTI · 执行方式", type:"mbti", dim:"J", text:"出远门旅行，你的习惯是？", opts:[{l:"A",t:"提前做好攻略，酒店交通全订好",s:5},{l:"B",t:"订好大框架，细节随机应变",s:3},{l:"C",t:"订好机票，其他到了再说",s:2},{l:"D",t:"说走就走，完全不规划",s:1}]},
    { section:"MBTI · 执行方式", type:"mbti", dim:"J", text:"面对一个 deadline，你会？", opts:[{l:"A",t:"提前规划，分阶段完成",s:5},{l:"B",t:"在压力下集中完成，效率更高",s:2},{l:"C",t:"按部就班，刚好按时完成",s:3},{l:"D",t:"最后几天疯狂冲刺",s:1}]},
    { section:"MBTI · 执行方式", type:"mbti", dim:"J", text:"你对「规划人生」这件事的态度是？", opts:[{l:"A",t:"必须有清晰的目标和规划，我掌控自己的人生",s:5},{l:"B",t:"有大方向，但接受随遇而安的惊喜",s:3},{l:"C",t:"不想给自己设限，走一步看一步",s:2},{l:"D",t:"完全不做规划，享受当下最重要",s:1}]},
    { section:"MBTI · 执行方式", type:"mbti", dim:"J", text:"你的房间/桌面通常的状态是？", opts:[{l:"A",t:"整洁有序，所有物品各归其位",s:5},{l:"B",t:"大致整洁，偶尔乱一点",s:4},{l:"C",t:"比较随意，关键时候能找到",s:2},{l:"D",t:"乱一点反而更有效率",s:1}]},

    // ── BigFive · 开放性 Openness (5题) ──
    { section:"BigFive · 开放性", type:"bf", dim:"Openness", text:"你通常对新事物、新观念的態度是？", opts:[{l:"A",t:"非常感兴趣，主动尝试",s:5},{l:"B",t:"有兴趣，但不一定行动",s:4},{l:"C",t:"视情况而定，谨慎观望",s:3},{l:"D",t:"不太感兴趣，保持熟悉更舒服",s:1}]},
    { section:"BigFive · 开放性", type:"bf", dim:"Openness", text:"你容易被抽象概念或艺术作品打动吗？", opts:[{l:"A",t:"经常被深深触动和启发",s:5},{l:"B",t:"偶尔，有些作品能打动我",s:4},{l:"C",t:"很少，更关注实用性",s:2},{l:"D",t:"几乎不会",s:1}]},
    { section:"BigFive · 开放性", type:"bf", dim:"Openness", text:"你更喜欢的工作内容是？", opts:[{l:"A",t:"需要创意、探索未知的任务",s:5},{l:"B",t:"有一定创意空间的执行工作",s:4},{l:"C",t:"按流程执行的常规任务",s:2},{l:"D",t:"完全不需要创意的重复性工作",s:1}]},
    { section:"BigFive · 开放性", type:"bf", dim:"Openness", text:"你去一个陌生地方，更希望？", opts:[{l:"A",t:"探索小众目的地，感受当地独特文化",s:5},{l:"B",t:"经典打卡，但也愿意尝试新路线",s:3},{l:"C",t:"走常规路线，安全可控",s:2},{l:"D",t:"有明确目标，不跑冤枉路",s:1}]},
    { section:"BigFive · 开放性", type:"bf", dim:"Openness", text:"你更向往什么样的生活方式？", opts:[{l:"A",t:"轰轰烈烈，创造不凡的影响力和成就",s:5},{l:"B",t:"自由洒脱，不被束缚，追随内心",s:4},{l:"C",t:"安稳温暖，和爱的人一起平淡生活",s:2},{l:"D",t:"不断探索，体验世界上所有有趣的事物",s:5}]},

    // ── BigFive · 尽责性 Conscientiousness (4题) ──
    { section:"BigFive · 尽责性", type:"bf", dim:"Conscientiousness", text:"你通常如何对待承诺和截止日期？", opts:[{l:"A",t:"一定会按时甚至提前完成",s:5},{l:"B",t:"尽量按时，偶尔拖延",s:3},{l:"C",t:"经常在最后一刻赶完",s:2},{l:"D",t:"经常逾期，觉得还有时间",s:1}]},
    { section:"BigFive · 尽责性", type:"bf", dim:"Conscientiousness", text:"你是一个有计划的人吗？", opts:[{l:"A",t:"非常自律，一切按计划进行",s:5},{l:"B",t:"有大致计划，但会随机应变",s:3},{l:"C",t:"很少做计划，走一步看一步",s:2},{l:"D",t:"计划对我来说没有意义",s:1}]},
    { section:"BigFive · 尽责性", type:"bf", dim:"Conscientiousness", text:"面对一个困难任务，你会？", opts:[{l:"A",t:"坚持到底，绝不半途而废",s:5},{l:"B",t:"努力完成，但也会适时调整目标",s:3},{l:"C",t:"遇到困难容易放弃",s:1},{l:"D",t:"先判断可行性，再决定是否开始",s:2}]},
    { section:"BigFive · 尽责性", type:"bf", dim:"Conscientiousness", text:"你对自己的评价更接近？", opts:[{l:"A",t:"经常自我怀疑，容易感到沮丧",s:1},{l:"B",t:"偶尔不自信，但总体良好",s:3},{l:"C",t:"大多数时候对自己有信心",s:4},{l:"D",t:"非常自信，很少动摇",s:5}]},

    // ── BigFive · 外向性 Extraversion (3题) ──
    { section:"BigFive · 外向性", type:"bf", dim:"Extraversion", text:"在一场聚会中，你通常？", opts:[{l:"A",t:"主动社交，精力充沛",s:5},{l:"B",t:"能自然地参与聊天",s:4},{l:"C",t:"和一两个人深度交流",s:2},{l:"D",t:"尽量待在角落，早走早好",s:1}]},
    { section:"BigFive · 外向性", type:"bf", dim:"Extraversion", text:"你的社交能量主要来源是？", opts:[{l:"A",t:"和人群在一起时获得能量",s:5},{l:"B",t:"都能给我能量，平衡就好",s:3},{l:"C",t:"独处时更能充电",s:2},{l:"D",t:"社交只会消耗我的能量",s:1}]},
    { section:"BigFive · 外向性", type:"bf", dim:"Extraversion", text:"你喜欢在团队中扮演什么角色？", opts:[{l:"A",t:"领导者或协调者，主动推动事情",s:5},{l:"B",t:"核心参与者，积极贡献想法",s:4},{l:"C",t:"默默完成自己的任务就好",s:2},{l:"D",t:"观察者，在一旁默默分析",s:1}]},

    // ── BigFive · 宜人性 Agreeableness (3题) ──
    { section:"BigFive · 宜人性", type:"bf", dim:"Agreeableness", text:"当团队中出现冲突时，你通常会？", opts:[{l:"A",t:"主动调解，寻求双方和解",s:5},{l:"B",t:"参与讨论，帮助找到折中方案",s:4},{l:"C",t:"保持中立，让当事人自己解决",s:2},{l:"D",t:"回避冲突，不直接介入",s:1}]},
    { section:"BigFive · 宜人性", type:"bf", dim:"Agreeableness", text:"你对「信任陌生人」这件事的态度是？", opts:[{l:"A",t:"倾向于信任，人心本善",s:5},{l:"B",t:"初步信任，出了问题再调整",s:4},{l:"C",t:"保持谨慎，需要时间验证",s:2},{l:"D",t:"基本不信任，保持高度警惕",s:1}]},
    { section:"BigFive · 宜人性", type:"bf", dim:"Agreeableness", text:"当朋友需要帮助时，你通常？", opts:[{l:"A",t:"毫不犹豫，第一时间伸出援手",s:5},{l:"B",t:"愿意帮忙，但会考虑自己的情况",s:3},{l:"C",t:"需要帮，但会设定边界",s:2},{l:"D",t:"不太想帮，找借口拒绝",s:1}]},

    // ── BigFive · 神经质性 Neuroticism (3题) ──
    { section:"BigFive · 神经质性", type:"bf", dim:"Neuroticism", text:"面对压力时，你通常会？", opts:[{l:"A",t:"感到焦虑和不安，难以平静",s:5},{l:"B",t:"有些担心，但能正常应对",s:3},{l:"C",t:"保持冷静，理性分析问题",s:2},{l:"D",t:"完全不受影响，冷静如水",s:1}]},
    { section:"BigFive · 神经质性", type:"bf", dim:"Neuroticism", text:"你的情绪波动程度是？", opts:[{l:"A",t:"起伏较大，经常被情绪左右",s:5},{l:"B",t:"有些波动，但能控制",s:3},{l:"C",t:"相对稳定，很少大起大落",s:2},{l:"D",t:"非常稳定，平静如水",s:1}]},
    { section:"BigFive · 神经质性", type:"bf", dim:"Neuroticism", text:"面对批评，你的反应通常是？", opts:[{l:"A",t:"容易受伤，需要很长时间消化",s:5},{l:"B",t:"会难过，但能较快调整",s:3},{l:"C",t:"会反思，但不会太往心里去",s:2},{l:"D",t:"完全不在意，批评是成长的养分",s:1}]}
  ],

  // ==================== 广告配置 ====================
  ads: {
    enabled: false,
    placeholder: { title:"扫码看更多动物性格", desc:"回复【动物】获取完整分析", qrCode:"" }
  },

  // ==================== 私域引流 ====================
  traffic: {
    enabled: true,
    showMode: "resultOnly",
    entries: [{ name:"公众号", icon:"📮", title:"关注公众号", desc:"回复【动物】获取完整性格报告", qrCode:"", url:"" }]
  },

  // ==================== 分享配置 ====================
  share: {
    enabled: true,
    // 答题链接（显示在分享卡片上，用户可复制）
    quizUrl: "https://www.fbti.net/animal_quiz.html",
    card: {
      background:"", fallbackGradient:"linear-gradient(135deg, #0d1525 0%, #0a0f1a 100%)",
      title:"我的动物人格是【{name}】{emoji}，你也来测！",
      desc:"38道题，揭秘你的动物人格", showScores:false, showRarity:true
    }
  },

  // ==================== 提交配置 ====================
  submit: { endpoint:"/api/results", required:false }
};
