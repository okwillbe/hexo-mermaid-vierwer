# Hexo Mermaid插件使用指南

## 配置参数
```yml
mermaid:
  theme: dark # 可选 dark/default 两种主题模式
```

## 使用示例
```markdown
{% mermaid %}
graph TD
  A[开始] --> B(处理)
  B --> C{判断}
  C -->|是| D[结束]
  C -->|否| B
{% endmermaid %}
```

## 功能特性
- 自动注入Mermaid主题适配的CSS样式
- 支持错误边界处理及可视化提示
- 兼容Hexo 6.x版本