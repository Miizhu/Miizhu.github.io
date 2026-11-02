// 使用常量对象保存特殊地区的中文名称，用于覆盖 Cloudflare 可能返回的英文城市名。
const SPECIAL_REGION_NAMES = {
  HK: '香港',
  MO: '澳门',
  TW: '台湾'
};

// 使用地区优先级函数选择展示地点，用于在城市缺失时依次回退到省份、国家或“远方”。
function getVisitorPlace(visitor) {
  return SPECIAL_REGION_NAMES[visitor.countryCode] ||
    visitor.city ||
    visitor.region ||
    visitor.country ||
    '远方';
}

// 使用预设文案对象匹配访客当地时段，用于生成无需 AI 调用的稳定欢迎语。
function createGreeting(period) {
  const greetings = {
    凌晨: '夜深了，注意休息！',
    早上: '早上好，愿你拥有美好的一天！',
    上午: '上午好，欢迎来到秘烛的博客！',
    中午: '中午好，记得按时吃饭！',
    下午: '下午好，愿你在这里有所收获！',
    晚上: '晚上好，感谢你的到访！'
  };

  return greetings[period] || '欢迎来到秘烛的博客！';
}

// 使用 DOM API 创建一行文本及高亮片段，用于避免把外部位置数据直接拼接进 innerHTML。
function createInfoLine(prefix, highlightedText, suffix = '') {
  const line = document.createElement('div');
  line.className = 'visitor-line';
  line.append(prefix);

  const highlight = document.createElement('span');
  highlight.className = 'visitor-highlight';
  highlight.textContent = highlightedText;
  line.append(highlight, suffix);

  return line;
}

// 使用多个语义化 DOM 节点渲染欢迎卡，用于分别控制标题、地点、问候语、时间和结语的样式。
function renderWelcome(element, visitor) {
  const place = getVisitorPlace(visitor);
  const localTime = visitor.localTime || '疑似掉入黑洞';


  const title = document.createElement('div');
  title.className = 'visitor-title';
  title.textContent = '🎉 欢迎信息 🎉';

  const locationLine = createInfoLine('来自 ', place, ' 的朋友');

  const greetingLine = document.createElement('div');
  greetingLine.className = 'visitor-line visitor-greeting';
  greetingLine.textContent = createGreeting(visitor.period);

  const timeLine = createInfoLine(
    '当地时间：',
    localTime || '疑似掉入黑洞'
  );

  const endingLine = document.createElement('div');
  endingLine.className = 'visitor-ending';
  endingLine.textContent = '欢迎来到秘烛的博客';

  element.replaceChildren(
    title,
    locationLine,
    greetingLine,
    timeLine,
    endingLine
  );
}

// 使用异步 IIFE 在页面加载后请求 Cloudflare Worker，用于获取访客的大致地区与当地时间并立即渲染。
(async () => {
  const element = document.getElementById('visitor-welcome');

  // 使用空值检查提前结束，用于兼容没有公告卡片的页面。
  if (!element) return;

  try {
    // 使用 Fetch API 调用 Cloudflare Worker，用于读取不包含完整 IP 的国家、城市和当地时间数据。
    const response = await fetch(
      'https://miizhu-visitor-location.miizhuan.workers.dev'
    );

    // 使用 HTTP 状态检查主动抛错，用于统一进入下方的失败回退逻辑。
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // 使用 JSON 解析和渲染函数更新页面，用于显示分行且带颜色的个性化欢迎信息。
    const visitor = await response.json();
    renderWelcome(element, visitor);
  } catch (error) {
    // 使用纯文本回退内容处理网络或接口异常，用于保证公告区域始终有可读信息。
    element.textContent = '欢迎来到秘烛的博客！';
    console.error('欢迎语加载失败：', error);
  }
})();
