(() => {
  // 网站正式开始运行的时间，+08:00 表示北京时间
  const startTime = new Date('2026-08-02T03:05:00+08:00').getTime();

  function updateRuntime() {
    const element = document.getElementById('site-runtime');

    if (!element) return;

    const difference = Math.max(0, Date.now() - startTime);
    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    element.textContent =
      `${days} 天 ${String(hours).padStart(2, '0')} 小时 ` +
      `${String(minutes).padStart(2, '0')} 分 ${String(seconds).padStart(2, '0')} 秒`;
  }

  updateRuntime();
  setInterval(updateRuntime, 1000);

  // 从后台标签页切回时立即校正时间
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateRuntime();
  });
})();