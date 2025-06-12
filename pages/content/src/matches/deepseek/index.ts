console.log(chrome.runtime.getURL('deepseek.iife.js'));

const injectScript = () => {
  // 获取插件的绝对资源路径
  const scriptUrl = chrome.runtime.getURL('content/injected.iife.js');

  // 创建 script 标签
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.type = 'text/javascript';

  // 注入到页面主体
  (document.head || document.documentElement).appendChild(script);

  // 可选：注入后清理
  script.onload = () => script.remove();
};

// 确保在页面准备完成后注入
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  injectScript();
} else {
  document.addEventListener('DOMContentLoaded', injectScript);
}
