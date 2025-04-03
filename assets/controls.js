document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mermaid').forEach(chart => {
    // 创建模态窗口
    const modal = document.createElement('div');
    modal.className = 'mermaid-modal';
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // 创建模态内容
    const modalContent = document.createElement('div');
    modalContent.className = 'mermaid-modal-content';
    
    // 创建控制面板
    const controls = document.createElement('div');
    controls.className = 'mermaid-controls';
    
    controls.innerHTML = `
      <button class="mermaid-btn" data-action="zoomIn">+</button>
      <button class="mermaid-btn" data-action="zoomOut">-</button>
      <button class="mermaid-btn" data-action="reset">🔄</button>
      <button class="mermaid-btn" data-action="export">⤓</button>
      <button class="mermaid-btn" data-action="close">✕</button>
    `;
    
    // 获取原始Mermaid代码
    const originalContent = chart.textContent;
    
    // 创建新的Mermaid图表容器
    const clonedChart = document.createElement('div');
    clonedChart.className = 'mermaid';
    clonedChart.textContent = originalContent;
    console.log('克隆图表创建完成，内容:', originalContent);
    
    // 重置克隆图表样式
    clonedChart.removeAttribute('style');
    
    // 设置克隆图表基础样式
    clonedChart.style.width = '100%';
    clonedChart.style.height = 'auto';
    clonedChart.style.overflow = 'visible';
    clonedChart.style.position = 'relative';
    clonedChart.style.maxWidth = 'none';
    clonedChart.style.maxHeight = 'none';
    clonedChart.style.transform = 'scale(1)';
    clonedChart.style.transformOrigin = 'top left';
    clonedChart.style.background = 'white';
    clonedChart.style.padding = '20px';
    clonedChart.style.boxSizing = 'border-box';
    clonedChart.style.zIndex = '10001';
    clonedChart.style.display = 'block';
    
    // 确保克隆图表继承原始图表的类名
    clonedChart.className = chart.className;
    console.log('克隆图表类名设置完成:', clonedChart.className);
    
    // 组装模态窗口
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = 'calc(100% - 40px)';
    chartContainer.style.overflow = 'scroll';
    chartContainer.style.position = 'relative';
    chartContainer.style.background = 'white';
    chartContainer.style.minWidth = '100%';
    chartContainer.style.minHeight = '100%';
    chartContainer.appendChild(clonedChart);
    
    modalContent.appendChild(chartContainer);
    modalContent.appendChild(controls);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 双击打开模态窗口
    chart.addEventListener('dblclick', (e) => {
      console.log('双击事件触发');
      e.stopPropagation();
      
      // 先准备模态窗口样式
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      document.body.style.overflow = 'hidden';
      
      // 确保克隆图表在显示时重新渲染
      clonedChart.style.display = 'block';
      clonedChart.style.transform = 'scale(1)';
      clonedChart.style.transformOrigin = 'top left';
      
      // 强制重绘并重新初始化Mermaid
      clonedChart.offsetHeight;
      console.log('克隆图表DOM结构:', clonedChart.outerHTML);
      console.log('克隆图表计算样式:', window.getComputedStyle(clonedChart));
      try {
        // 先移除所有子元素
        while (clonedChart.firstChild) {
          clonedChart.removeChild(clonedChart.firstChild);
        }
        // 创建新的div容器用于Mermaid渲染
        const mermaidContainer = document.createElement('div');
        mermaidContainer.className = 'mermaid';
        mermaidContainer.textContent = originalContent;
        clonedChart.appendChild(mermaidContainer);
        
        // 强制重绘并重新初始化Mermaid
        clonedChart.offsetHeight;
        window.mermaid.init(undefined, mermaidContainer);
        console.log('Mermaid初始化成功，模态窗口显示状态:', modal.style.display);
      } catch (e) {
        console.error('Mermaid初始化失败:', e);
      }
    });
    
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    // 修改为模态窗口内容区域触发拖动事件
    const container = chartContainer;
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
          clonedChart.style.display = 'block';
          clonedChart.style.transform = `scale(${scale})`;
          clonedChart.style.transformOrigin = 'top left';
          modalContent.style.overflow = 'hidden';
          break;
        case 'zoomOut':
          scale -= 0.2;
          clonedChart.style.display = 'block';
          clonedChart.style.transform = `scale(${scale})`;
          clonedChart.style.transformOrigin = 'top left';
          modalContent.style.overflow = 'hidden';
          break;
        case 'reset':
          scale = 1.0;
          clonedChart.style.display = 'block';
          clonedChart.style.transform = `scale(${scale})`;
          clonedChart.style.transformOrigin = 'top left';
          modalContent.style.overflow = 'hidden';
          break;
        case 'close':
          modal.style.display = 'none';
    document.body.style.overflow = '';
          break;
        case 'export':
          console.log('导出前图表状态:', clonedChart.outerHTML);
          console.log('导出前图表计算样式:', window.getComputedStyle(clonedChart));
          html2canvas(clonedChart, {
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