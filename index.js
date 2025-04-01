const { readFileSync } = require('fs');
const { join } = require('path');

hexo.extend.tag.register('mermaid', (args, content) => {
  const config = hexo.config.mermaid || {};
  return `<div class="mermaid" data-theme="${config.theme || 'default'}">${content}</div>`;
}, {ends: true});

hexo.extend.filter.register('after_render:html', function(str, data) {
  const cssPath = join(__dirname, 'assets/controls.css');
  const jsPath = join(__dirname, 'assets/controls.js');
  
  // 注入CSS样式
  const styleTag = `\n<style>\n${readFileSync(cssPath)}\n</style>`;
  str = str.replace('</head>', styleTag + '</head>');

  // 注入控制脚本和html2canvas
  const scriptTag = `\n<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script>\n${readFileSync(jsPath)}\n</script>`;
  str = str.replace('</body>', scriptTag + '</body>');

  return str;
});