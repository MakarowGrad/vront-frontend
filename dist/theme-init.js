// SECURITY-FIX-CSP-002: Extracted theme initialization script to avoid dangerouslySetInnerHTML [2026-05-18]
(function() {
  var allowOverride = localStorage.getItem('allowUserThemeOverride') !== 'false';
  var theme = allowOverride
    ? (localStorage.getItem('siteTheme') || localStorage.getItem('adminTheme') || 'custom')
    : (localStorage.getItem('adminTheme') || 'custom');
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark', 'custom');
  } else if (theme === 'custom') {
    document.documentElement.classList.add('custom');
    document.documentElement.classList.remove('dark', 'light');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light', 'custom');
  }
})();
