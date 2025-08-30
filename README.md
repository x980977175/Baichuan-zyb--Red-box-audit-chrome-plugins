# 多边形通用插件优化版 (Polygon Universal Plugin)

一个功能强大的Chrome浏览器插件，专为红框类审核设计，可在坐标旁永久显示相关内容（含置灰框），提供丰富的自定义选项和智能布局功能。
![这是图片](https://github.com/x980977175/Baichuan-zyb--Red-box-audit-chrome-plugins/blob/main/%E6%8F%92%E4%BB%B6%E5%9B%BE%E7%89%87/6.png "效果")

## ✨ 主要功能

- **智能内容显示**：在坐标框旁显示关联内容
- **防重叠布局**：智能算法避免标签重叠，支持多种布局策略        //现在的防重叠算法仍然处于不太可用的状态，有兴趣的话可以自己改改
- **丰富的自定义选项**：字体、颜色、透明度等全方位样式设置
- **关键词过滤**：支持多关键词过滤显示内容
- **特殊内容高亮**：自动识别并高亮特殊内容
- **拖拽功能**：可自由调整标签位置
- **连接线显示**：显示标签与坐标框的连接线
- **行级高亮**：基于关键词的行级别高亮
- **字体颜色规则**：根据关键词应用特定字体颜色
- **响应式设计**：自动适应窗口大小变化

## 🚀 安装方法

### 手动安装（开发者模式）

1. 下载或克隆此项目
2. 打开Chrome浏览器，进入扩展程序页面（`chrome://extensions/`）
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"，选择项目文件夹
5. 扩展程序将加载并激活

## 🛠 使用方法

1. 安装插件后，在OCR XD页面右下角会出现"显示设置"按钮
2. 点击按钮打开设置面板，调整各项参数
3. 内容将自动显示在坐标框旁边
4. 使用关键词过滤框可以快速筛选特定内容
5. 拖动标签可以调整位置，右键点击可重置位置

## ⚙️ 配置选项

### 基本样式设置
- 字体家族、大小和粗细
- 背景颜色和透明度
- 文字颜色和透明度
- 特殊字符显示  
![这是图片](https://github.com/x980977175/Baichuan-zyb--Red-box-audit-chrome-plugins/blob/main/%E6%8F%92%E4%BB%B6%E5%9B%BE%E7%89%87/2.png "效果")

### 高级设置
- 防重叠布局算法强度
- 警告阈值设置
- 连接线优化
- 最大扩展距离
- 悬停高亮效果  
![这是图片](https://github.com/x980977175/Baichuan-zyb--Red-box-audit-chrome-plugins/blob/main/%E6%8F%92%E4%BB%B6%E5%9B%BE%E7%89%87/3.png "效果")

### 规则设置
- 自定义高亮规则（关键词+颜色）
- 行高亮规则
- 字体颜色规则  
![这是图片](https://github.com/x980977175/Baichuan-zyb--Red-box-audit-chrome-plugins/blob/main/%E6%8F%92%E4%BB%B6%E5%9B%BE%E7%89%87/4.png "效果")
![这是图片](https://github.com/x980977175/Baichuan-zyb--Red-box-audit-chrome-plugins/blob/main/%E6%8F%92%E4%BB%B6%E5%9B%BE%E7%89%87/1.png "效果")
![这是图片](https://github.com/x980977175/Baichuan-zyb--Red-box-audit-chrome-plugins/blob/main/%E6%8F%92%E4%BB%B6%E5%9B%BE%E7%89%87/5.png "效果")
![这是图片](https://github.com/x980977175/Baichuan-zyb--Red-box-audit-chrome-plugins/blob/main/%E6%8F%92%E4%BB%B6%E5%9B%BE%E7%89%87/7.png "效果")
![这是图片](https://github.com/x980977175/Baichuan-zyb--Red-box-audit-chrome-plugins/blob/main/%E6%8F%92%E4%BB%B6%E5%9B%BE%E7%89%87/8.png "效果")
## 🔧 技术细节

- 使用MutationObserver监听DOM变化，实时更新标签
- 智能防重叠算法，支持多种布局策略
- 本地存储用户设置，重启浏览器后保持配置
- 高性能渲染优化，支持大量标签显示
- 响应式设计，适应不同屏幕尺寸

## 🐛 常见问题

### 性能问题
- 减少同时显示的标签数量
- 调整防重叠算法强度
- 关闭不必要的视觉效果

### 设置不保存
- 检查浏览器是否允许本地存储
- 尝试重新应用设置

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目。

## 📄 许可证

本项目采用GPL-3.0许可证 - 查看 [GPL-3.0](LICENSE) 文件了解详情

## 🙏 致谢

感谢所有为此项目做出贡献的开发者。

---

如有问题或建议，请通过GitHub Issues提交反馈。
