document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mermaid').forEach(chart => {
    const controls = document.createElement('div');
    controls.className = 'mermaid-controls';
    
    controls.innerHTML = `
      <button class="mermaid-btn" data-action="zoomIn">+</button>
      <button class="mermaid-btn" data-action="zoomOut">-</button>
      <button class="mermaid-btn" data-action="reset">重置</button>
      <button class="mermaid-btn" data-action="export">导出</button>
    `;
    
    // 将控制面板放在图表容器外部
    chart.parentNode.parentNode.insertBefore(controls, chart.parentNode);
    
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    // 修改为图表容器触发拖动事件
    const container = chart.parentNode;
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      startY = e.pageY - container.offsetTop;
      scrollLeft = container.scrollLeft;
      scrollTop = container.scrollTop;
      container.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      container.style.cursor = 'grab';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;
      const walkX = (x - startX) * 2;
      const walkY = (y - startY) * 2;
      container.scrollLeft = scrollLeft - walkX;
      container.scrollTop = scrollTop - walkY;
    });

    let scale = 1;
    controls.addEventListener('click', (e) => {
      if (!e.target.dataset.action) return;
      
      switch(e.target.dataset.action) {
        case 'zoomIn':
          scale += 0.2;
          chart.style.display = 'block';
          chart.style.transform = `scale(${scale})`;
          chart.style.transformOrigin = 'top left';
          chart.parentNode.style.overflow = 'hidden';
          break;
        case 'zoomOut':
          scale -= 0.2;
          chart.style.display = 'block';
          chart.style.transform = `scale(${scale})`;
          chart.style.transformOrigin = 'top left';
          chart.parentNode.style.overflow = 'hidden';
          break;
        case 'reset':
          scale = 1.0;
          chart.style.display = 'block';
          chart.style.transform = `scale(${scale})`;
          chart.style.transformOrigin = 'top left';
          chart.parentNode.style.overflow = 'hidden';
          break;
        case 'export':
          console.log('导出前图表状态:', chart.outerHTML);
          html2canvas(chart, {
            scale: 2,
            width: chart.scrollWidth * scale,
            height: chart.scrollHeight * scale,
            logging: true,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: chart.scrollWidth * scale,
            windowHeight: chart.scrollHeight * scale
          }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'diagram.png';
            link.href = canvas.toDataURL();
            link.click();
          });
          break;
      }
    });
  });
});