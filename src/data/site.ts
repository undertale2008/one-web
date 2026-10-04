export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export const site = {
  /** 个人资料为占位内容，可随后续对话替换。 */
  author: "沈知白",
  nickname: "知白",
  handle: "zhibai",
  title: "知白的手账",
  tagline: "放学后的生活手账",
  bio: "把日子过成可以反复翻阅的手账",
  description: "通过系列、分类与标签浏览所有文章",
  /** 部署前改成自己的域名：RSS 与 sitemap 里的绝对链接用它拼接。 */
  siteUrl: "https://example.com",
  heroKicker: "放学后的生活手账",
  heroTitlePrefix: "Hi everyone, I'm",
  heroQuote: "日落尤其温暖，人间皆是热爱",
  heroTags: ["认真生活", "快乐追番", "慢慢成长"],
  avatar: "/images/avatar.jpg",
  avatarBubble: "うんたん♪",
  avatarCaption: "今日份开心",
  location: "杭州",
  socials: [
    { label: "GitHub", href: "https://github.com/zhibai-notes", kind: "github" },
    { label: "X", href: "https://x.com/zhibai_notes", kind: "x" },
    { label: "Instagram", href: "https://www.instagram.com/zhibai.notes/", kind: "instagram" },
    { label: "QQ", href: "https://qm.qq.com/q/2jKJhKcCjm", kind: "qq" },
    { label: "Bilibili", href: "https://space.bilibili.com/321153856", kind: "bilibili" },
  ],
};

export const navItems: NavItem[] = [
  { label: "主页", href: "/", icon: "home" },
  { label: "时光轴", href: "/archive/", icon: "archive" },
  { label: "文章地图", href: "/series/", icon: "map" },
  { label: "追番小窝", href: "/bangumi/", icon: "bangumi" },
];

export const exploreItems: NavItem[] = [
  { label: "网站统计", href: "/stats/", icon: "stats" },
  { label: "旅行足迹", href: "/travel/", icon: "travel" },
  { label: "开发手账", href: "/dev/", icon: "dev" },
  { label: "小小收藏馆", href: "/collection/", icon: "collection" },
  { label: "动画会社", href: "/studios/", icon: "studios" },
];

export const aboutItem: NavItem = { label: "关于", href: "/about/", icon: "about" };

export const footerLinks = [
  { label: "RSS", href: "/rss.xml", icon: "rss" },
  { label: "Sitemap", href: "/sitemap-index.xml", icon: "sitemap" },
  { label: "GitHub", href: "https://github.com/zhibai-notes", icon: "github" },
];

/*
 * 文章数据不在这里：文章现在写在 src/content/posts/*.md，
 * 由 src/content/posts.ts 在构建期读取，分类 / 标签 / 系列的数量都从文章现算。
 */

export const hitokoto = [
  { text: "把今天过好，就已经是一件很了不起的事。", author: "知白" },
  { text: "慢慢来，比较快。", author: "知白" },
  { text: "喜欢的东西要认真喜欢。", author: "知白" },
  { text: "风从窗口进来的时候，记得抬头看一眼。", author: "知白" },
  { text: "不必把每件事都做得漂亮，先做完再说。", author: "知白" },
];

export type Interest = {
  kind: string;
  icon: string;
  /** 卡片标题上方的英文小标签，参考站是 FOOTBALL / GAME TIME 这种写法。 */
  kicker: string;
  title: string;
  body: string;
  tail: string;
  href?: string;
  hrefLabel?: string;
};

export const interests: Interest[] = [
  {
    kind: "anime",
    icon: "bangumi",
    kicker: "ANIME DAYS",
    title: "番剧 · 纯爱万岁",
    body: "看得最多的是恋爱番和日常番，最喜欢那种看完之后想给朋友发消息的故事。",
    tail: "✧(≖◡≖✿)",
    href: "/bangumi/",
    hrefLabel: "去看追番记录",
  },
  {
    kind: "code",
    icon: "dev",
    kicker: "SIDE PROJECTS",
    title: "折腾 · 从零搭东西",
    body: "这个站点就是折腾出来的：静态生成、玻璃拟态、一堆小动效，边学边加。",
    tail: "(๑•̀ㅂ•́)و✧",
    href: "/dev/",
    hrefLabel: "看看开发手账",
  },
  {
    kind: "photo",
    icon: "camera",
    kicker: "PHOTO WALK",
    title: "拍照 · 随手记录",
    body: "拍得最多的是天空、路牌和吃的东西。技术一般，但按快门这件事本身很治愈。",
    tail: "♪(´▽｀)",
  },
  {
    kind: "coffee",
    icon: "coffee",
    kicker: "SLOW COFFEE",
    title: "手冲 · 慢慢来",
    body: "周末早上的固定项目：烧水、磨豆、等它一滴一滴落下来，比喝本身更让人放松。",
    tail: "☕",
  },
];

export const aboutCopy = {
  eyebrow: "ABOUT ZHIBAI",
  lead: "都看到这里啦，那就不许再装作不认识我咯！",
  leadSecond: "这里有生活、热爱，还有一点点可爱 ₍ᐢ.ˬ.ᐢ₎♡",
  badges: ["常驻杭州", "写前端", "追番选手", "咖啡依赖"],
  diaryKicker: "MY FAVORITES",
  diaryTitle: "我的兴趣小手账",
  diaryNote: "喜欢的事情，要认真记下来呀 (˶ᵔ ᵕ ᵔ˶)",
  diaryDoodle: "⌁ 记录完毕！",
  dream: {
    kicker: "DREAM WISHLIST",
    title: "想把生活过得闪闪发光 ✦",
    body: ["最大的愿望是把手上的小事一件一件做完 🌤", "还有……把想去的地方慢慢走完 (｡•̀ᴗ-)✧"],
  },
  hello: {
    kicker: "SAY HELLO",
    title: "欢迎来找我玩呀！",
    body: [
      "想聊天或者交流问题，都可以在 GitHub 上找我。",
      "尊重彼此，我们就能愉快地成为朋友 (｡•̀ᴗ-)✧",
    ],
    linkLabel: "来 GitHub 找我",
    href: "https://github.com/zhibai-notes",
  },
  english: {
    summaryTitle: "English profile",
    summary: "英文自我介绍，点一下打开",
    title: "Hi, I'm Zhibai!",
    intro: [
      "Since you opened this little drawer, I guess you want to know me a bit better. Hehe (●ˇ∀ˇ●)",
      "Welcome to my little notebook! I'm Zhibai, based in Hangzhou, and I work as a front-end developer. ٩(๑^o^๑)۶",
      "My hobbies are watching anime, tinkering with side projects, taking photos, and brewing coffee.",
    ],
    hobbies: [
      {
        label: "Anime:",
        text: "I'm a big fan of pure romance and slice-of-life. K-On! and Natsume are the two I keep re-watching. You can also visit my Anime Nest to see what I've been watching.",
      },
      {
        label: "Side projects:",
        text: "I build small tools for myself, and this site is one of them. React, TypeScript, and a lot of CSS.",
      },
      {
        label: "Photos:",
        text: "Mostly skies, street signs, and whatever I ate that day. I'm not good at it, but pressing the shutter is relaxing.",
      },
      {
        label: "Coffee:",
        text: "Pour-over every weekend morning. The brewing is more calming than the drinking, honestly.",
      },
    ],
    dream:
      "My biggest dream is to keep making small things that still feel worth it a year later ✦ and, if possible, to see a lot more of the sky before I settle down.",
    closing:
      "I still have a fair amount of free time these days. If you'd like to chat or ask me something, feel free to say hi on GitHub. I enjoy meeting all kinds of interesting people, as long as we always respect one another! (｡•̀ᴗ-)✧",
  },
};

export type WatchStatus = 1 | 2 | 3 | 4 | 5;

export type BangumiEntry = {
  title: string;
  year: number;
  episodes: number;
  status: WatchStatus;
  score: number | null;
  tags: string[];
};

export const statusLabels: Record<WatchStatus, { label: string; glyph: string; tab: string }> = {
  1: { label: "想看", glyph: "✧", tab: "想看" },
  2: { label: "完结撒花", glyph: "✦", tab: "看过" },
  3: { label: "正在心动", glyph: "♡", tab: "在看" },
  4: { label: "暂时搁置", glyph: "◌", tab: "搁置" },
  5: { label: "先弃了", glyph: "×", tab: "抛弃" },
};

/** 追番记录（占位数据，可替换成自己的收藏）。 */
export const bangumiList: BangumiEntry[] = [
  { title: "轻音少女", year: 2009, episodes: 13, status: 2, score: 9.2, tags: ["日常", "音乐", "京都动画"] },
  { title: "夏目友人帐", year: 2008, episodes: 13, status: 2, score: 9.0, tags: ["治愈", "妖怪", "温情"] },
  { title: "夏日大作战", year: 2009, episodes: 1, status: 2, score: 8.6, tags: ["剧场版", "家族", "细田守"] },
  { title: "天气之子", year: 2019, episodes: 1, status: 2, score: 7.8, tags: ["剧场版", "新海诚", "奇幻"] },
  { title: "你的名字。", year: 2016, episodes: 1, status: 2, score: 8.8, tags: ["剧场版", "新海诚", "恋爱"] },
  { title: "擅长捉弄的高木同学", year: 2018, episodes: 12, status: 2, score: 8.9, tags: ["恋爱", "校园", "日常"] },
  { title: "辉夜大小姐想让我告白", year: 2019, episodes: 12, status: 2, score: 8.5, tags: ["恋爱", "喜剧", "校园"] },
  { title: "孤独摇滚！", year: 2022, episodes: 12, status: 2, score: 9.1, tags: ["音乐", "日常", "青春"] },
  { title: "白箱", year: 2014, episodes: 24, status: 1, score: null, tags: ["职场", "动画制作", "群像"] },
  { title: "虫师", year: 2005, episodes: 26, status: 1, score: null, tags: ["奇幻", "单元剧", "治愈"] },
  { title: "四月是你的谎言", year: 2014, episodes: 22, status: 4, score: 8.2, tags: ["音乐", "青春", "催泪"] },
  { title: "紫罗兰永恒花园", year: 2018, episodes: 13, status: 3, score: 8.7, tags: ["京都动画", "书信", "成长"] },
  { title: "排球少年！！", year: 2014, episodes: 25, status: 3, score: 9.0, tags: ["运动", "热血", "群像"] },
  { title: "蓝色时期", year: 2021, episodes: 12, status: 5, score: 6.9, tags: ["美术", "成长", "青春"] },
];

/** 首屏先显示这句，随后随机换成下面列表里的一条。 */
export const heroQuotePlaceholder = "正在寻找灵魂深处的共鸣...";

/** 参考站的台词表：只取恋爱关系本身就是叙事主线的作品。 */
export const heroQuotes = [
  { text: "我所知道的关于你的事情，希望能再多一点。", from: "月色真美" },
  { text: "和我交往吧。", from: "月色真美" },
  { text: "我深信着，我喜欢的人也能喜欢上自己，我认为这就是奇迹。", from: "月色真美" },
  { text: "我想告诉你，我喜欢你，这份心情，直到永远。", from: "玉子爱情故事" },
  { text: "我一直都很喜欢你。", from: "玉子爱情故事" },
  { text: "我的心，因为你而跳动。", from: "玉子爱情故事" },
  { text: "只要能看着你，我就觉得很幸福了。", from: "好想告诉你" },
  { text: "我想把自己的心意，好好地传达给你。", from: "好想告诉你" },
  { text: "我喜欢你，是恋爱的那种喜欢。", from: "好想告诉你" },
  { text: "不管你变成什么样，我都会一直喜欢你。", from: "擅长捉弄的高木同学" },
  { text: "西片，我喜欢你。", from: "擅长捉弄的高木同学" },
  { text: "与你相遇之后，每一天都变得很有趣。", from: "擅长捉弄的高木同学" },
  { text: "我只想，每一天都能看到你的笑容。", from: "堀与宫村" },
  { text: "我喜欢的，是只有我知道的那个你。", from: "堀与宫村" },
  { text: "以后也请一直待在我身边。", from: "堀与宫村" },
  { text: "喜欢一个人，是藏不住的。", from: "月色真美" },
  { text: "只要和你在一起，平凡的日子也会发光。", from: "玉子爱情故事" },
  { text: "我想和你一起，看很多很多次日落。", from: "玉子爱情故事" },
  { text: "今天也要一起回家吗？", from: "擅长捉弄的高木同学" },
  { text: "因为是你，所以什么都变得有趣。", from: "擅长捉弄的高木同学" },
  { text: "我不是因为寂寞才喜欢你。", from: "堀与宫村" },
  { text: "能遇见你，真的是一件很幸运的事。", from: "堀与宫村" },
  { text: "我想一直和你这样走下去。", from: "好想告诉你" },
  { text: "只要你愿意，我就会一直在这里。", from: "好想告诉你" },
  { text: "我想成为你心里特别的那个人。", from: "好想告诉你" },
  { text: "你笑起来的时候，真的很好看。", from: "月色真美" },
  { text: "我想把今天的心情也告诉你。", from: "月色真美" },
  { text: "无论晴天还是雨天，我都想见到你。", from: "天气之子" },
  { text: "比起世界，我更想要你。", from: "天气之子" },
  { text: "我会把这份喜欢，好好珍藏起来。", from: "四月是你的谎言" },
  { text: "因为遇见了你，我才看见了新的风景。", from: "四月是你的谎言" },
  { text: "我一直在寻找着某个人。", from: "你的名字。" },
  { text: "无论你在世界的哪个地方，我都会去见你。", from: "你的名字。" },
  { text: "重要的人，不能忘记的人，绝对不能忘记的人。", from: "你的名字。" },
  { text: "我好像做了一个很长的梦，一个不会醒来的梦。", from: "你的名字。" },
];

/** 头像气泡台词，点一下换一句。 */
export const avatarMessages = ["うんたん♪", "吉太～", "今天也要开心 ୨୧", "放学后见吧 ♫"];

/** 五个配色主题，默认「雾蓝」即 #66ccff。 */
export const palettes = [
  { id: "mist", label: "雾蓝 · 默认", description: "雾白 · 66ccff · 深海灰", hue: 200, colors: ["#f2f9ff", "#66ccff", "#3d5464"], primary: "#66ccff" },
  { id: "deep", label: "深海 · 静谧", description: "冷白 · 深海蓝 · 墨黑", hue: 214, colors: ["#f1f7fb", "#3f8fc4", "#2f4655"], primary: "#3f8fc4" },
  { id: "mint", label: "薄荷 · 气泡", description: "冰白 · 薄荷青 · 灰蓝", hue: 178, colors: ["#f0faf8", "#4fb8ad", "#3a5b5f"], primary: "#4fb8ad" },
  { id: "dusk", label: "晚霞 · 紫调", description: "雾紫白 · 蓝紫 · 夜灰", hue: 258, colors: ["#f6f4fc", "#8a7fd0", "#4a4460"], primary: "#8a7fd0" },
  { id: "star", label: "星尘 · 柔粉", description: "奶白 · 星尘粉 · 咖灰", hue: 340, colors: ["#fff7f8", "#d98aa4", "#5c4650"], primary: "#d98aa4" },
];
