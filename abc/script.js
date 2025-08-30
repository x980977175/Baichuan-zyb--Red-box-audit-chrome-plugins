// ==多边形通用插件优化版==
// 功能：在坐标旁永久显示内容
// FOR OCR XD

(function() {
    'use strict';
    
    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        .polygon-label {
            position: absolute;
            z-index: 9999;
            padding: 4px 8px;
            border-radius: 4px;
            pointer-events: auto;
            max-width: 300px;
            overflow: visible;
            transition: opacity 0.3s ease, transform 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: move;
            resize: both;
            overflow: auto;
            min-width: 100px;
            min-height: 20px;
        }
        
        .polygon-connection-line {
            transition: all 0.3s ease;
            background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(200,200,255,0.6)) !important;
            box-shadow: 0 0 2px rgba(0,0,0,0.2);
            height: 2px !important;
        }
    
        .polygon-label.collapsed {
            max-height: 25px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .polygon-label:hover {
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        
        .polygon-filter-highlight {
            background-color: #ffff00 !important;
            color: #000000 !important;
            box-shadow: 0 0 10px #ffff00;
        }
        
        .special-char {
            background-color: rgba(255, 200, 200, 0.3);
            border-radius: 2px;
            padding: 0 2px;
            border: 1px dotted #ff0000;
        }
        
        #polygon-settings-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-weight: bold;
        }
        
        #polygon-settings-button:hover {
            background-color: #45a049;
        }
        
        #polygon-large-count-warning {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ffcc00;
            color: #8b0000;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-align: center;
            animation: polygon-pulse 1.5s infinite;
        }
        
        .opacity-display {
            min-width: 40px;
            text-align: center;
            font-weight: bold;
        }
        
        .polygon-control-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10020;
            min-width: 400px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .panel-section {
            background: #f9f9f9;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 15px;
            border-left: 4px solid #4CAF50;
        }
        
        .panel-section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 5px;
        }
        
        .control-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            padding: 4px 0;
        }
        
        .control-label {
            min-width: 120px;
            margin-right: 10px;
            font-size: 14px;
            color: #555;
        }
        
        .control-input {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .control-checkbox {
            width: 16px;
            height: 16px;
            margin: 0;
        }
        
        .control-range {
            flex: 1;
            padding: 0;
            margin: 0;
        }
        
        .value-display {
            min-width: 40px;
            text-align: center;
            font-weight: bold;
            margin-left: 10px;
        }
        
        .button-group {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 15px;
            gap: 10px;
        }
        
        .panel-button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            flex: 1;
        }
        
        .panel-action-button {
            padding: 10px 15px !important;
            min-width: 120px !important;
            margin: 5px !important;
            flex: none !important;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .button-primary {
            background: #4CAF50;
            color: white;
        }
        
        .button-secondary {
            background: #2196F3;
            color: white;
        }
        
        .button-warning {
            background: #ff9800;
            color: white;
        }
        
        .button-danger {
            background: #ff6b6b;
            color: white;
        }
        
        .button-success {
            background: #66bb6a;
            color: white;
        }
        
        .highlight-rule-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 8px;
        }
        
        .rule-keyword {
            flex: 1;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .rule-color {
            width: 60px;
            padding: 3px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .segment-rule-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 8px;
        }
        
        .line-highlight {
            display: block;
            padding: 2px 4px;
            margin: 1px 0;
            border-radius: 3px;
        }
        
        .font-color-rule-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 8px;
        }
        
        @keyframes polygon-pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(255, 204, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0); }
        }
        
        .keyword-highlight {
            font-weight: bold;
        }
        
        .settings-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        @media (max-width: 768px) {
            .settings-group {
                grid-template-columns: 1fr;
            }
            
            .polygon-control-panel {
                min-width: 300px;
                max-width: 95vw;
            }
        }
    `;
    document.head.appendChild(style);
    
    /*================== 内容显示功能 ==================*/
    
    let contentItems = []; 
    let coordinateItems = []; 
    let contentLabels = []; 
    let isInitialized = false; 
    let controlPanelCreated = false; 
    let largeCountWarning = null;
    let labelPositions = new Map();
    let isUpdatingPositions = false;
    
    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 用户设置
    let userSettings = {
        fontFamily: 'Arial',
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
        fontSize: 14,
        textColor: '#66ccff',
        boldText: true,
        highlightSpecial: true,
        positionColor: '#ff0000',
        specialColor: '#00ff00',
        customHighlights: [
            { keyword: '重要', color: '#ffcc00' },
            { keyword: '注意', color: '#ff9900' }
        ],
        lineHighlights: [
            { keyword: '错误', color: '#ff0000' },
            { keyword: '警告', color: '#ff9900' },
            { keyword: '成功', color: '#00cc00' }
        ],
        fontColorRules: [
            { keyword: '紧急', color: '#ff0000' },
            { keyword: '高优先级', color: '#ff6600' }
        ],
        warnThreshold: 30,
        antiOverlap: true,
        allowDragging: true,
        enableFilter: true,
        globalCollapse: false,
        textOpacity: 100,
        bgOpacity: 70,
        showSpecialChars: true,
        dragEnabled: true,
        enableLineHighlight: true,
        enableFontColorRules: true,
        showConnectionLine: false,
        highlightOnHover: true,
        // 新增设置：防重叠算法强度
        overlapAlgorithmStrength: 5,
        // 新增设置：连接线优化
        connectionLineOptimization: true,
        // 新增设置：最大扩展距离
        maxExtensionDistance: 300
    };
    
    // 从localStorage加载设置
    function loadSavedSettings() {
        try {
            const saved = localStorage.getItem('polygonPluginSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(userSettings, parsed);
            }
        } catch (e) {
            console.warn('无法加载保存的设置:', e);
        }
    }
    
    // 保存设置到localStorage
    function saveSettings() {
        try {
            localStorage.setItem('polygonPluginSettings', JSON.stringify(userSettings));
        } catch (e) {
            console.warn('无法保存设置:', e);
        }
    }
    
    // 从样式字符串中提取数值
    function extractStyleValue(styleString, property) {
        const regex = new RegExp(`${property}:\\s*([\\d.]+)px`);
        const match = styleString.match(regex);
        return match ? parseFloat(match[1]) : null;
    }
    
    // 获取单个框的坐标信息
    function getCoordinates(coordinateElement) {
        const imgWrap = coordinateElement.closest('.img-wrap');
        let imgWrapRect = null;
        let imgWrapOffsetX = 0;
        let imgWrapOffsetY = 0;
        
        if (imgWrap) {
            imgWrapRect = imgWrap.getBoundingClientRect();
            imgWrapOffsetX = imgWrapRect.left;
            imgWrapOffsetY = imgWrapRect.top;
        }
        
        let zoomFactor = 1;
        if (imgWrap) {
            const zoomStyle = getComputedStyle(imgWrap).zoom;
            zoomFactor = parseFloat(zoomStyle) || 1;
        }
        
        const styleString = coordinateElement.getAttribute('style') || "";
        const width = extractStyleValue(styleString, 'width');
        const height = extractStyleValue(styleString, 'height');
        const top = extractStyleValue(styleString, 'top');
        const left = extractStyleValue(styleString, 'left');
        
        if (width !== null && height !== null && top !== null && left !== null) {
            const elementAbsX = imgWrapOffsetX + (left * zoomFactor);
            const elementAbsY = imgWrapOffsetY + (top * zoomFactor);
            
            const bottom = elementAbsY + (height * zoomFactor);
            const right = elementAbsX + (width * zoomFactor);
            
            return `${right.toFixed(2)},${bottom.toFixed(2)}`;
        }
        
        return "无有效坐标信息";
    }
    
    // 检测特殊字符
    function hasSpecialChars(text) {
        return /[\n\t\r]/.test(text);
    }
    
    // 可视化特殊字符
    function visualizeSpecialChars(text) {
        if (!userSettings.showSpecialChars) return text;
        
        return text
            .replace(/\n/g, '<span class="special-char" title="换行符">↵</span>')
            .replace(/\t/g, '<span class="special-char" title="制表符">→</span>')
            .replace(/\r/g, '<span class="special-char" title="回车符">⏎</span>');
    }
    
    // 应用行高亮
    function applyLineHighlight(text) {
        if (!userSettings.enableLineHighlight || !userSettings.lineHighlights.length) {
            return text;
        }
        
        // 先转义HTML特殊字符，防止XSS
        let escapedText = text.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[m];
        });
        
        // 按行分割文本
        const lines = escapedText.split(/(?:\r\n|\r|\n)/);
        
        // 对每一行应用高亮规则
        const highlightedLines = lines.map(line => {
            let highlightedLine = line;
            let lineColor = null;
            
            // 检查每一行是否匹配任何高亮规则
            for (const rule of userSettings.lineHighlights) {
                if (rule.keyword && line.includes(rule.keyword)) {
                    lineColor = rule.color;
                    break;
                }
            }
            
            // 如果找到匹配的规则，应用高亮
            if (lineColor) {
                highlightedLine = `<span class="line-highlight" style="color: ${lineColor}; font-weight: bold; display: block; background-color: rgba(0,0,0,0.1);">${highlightedLine}</span>`;
            } else {
                highlightedLine = `<span style="display: block;">${highlightedLine}</span>`;
            }
            
            return highlightedLine;
        });
        
        return highlightedLines.join('');
    }
    
    // 应用字体颜色规则到HTML内容
    function applyFontColorRulesToHTML(html) {
        if (!userSettings.enableFontColorRules || !userSettings.fontColorRules.length) {
            return html;
        }
        
        // 创建一个临时div来解析HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 递归处理所有文本节点
        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                // 处理文本节点
                let text = node.textContent;
                userSettings.fontColorRules.forEach(rule => {
                    if (rule.keyword && text.includes(rule.keyword)) {
                        // 使用正则表达式全局替换关键字
                        const regex = new RegExp(escapeRegExp(rule.keyword), 'g');
                        text = text.replace(regex, `<span class="keyword-highlight" style="color: ${rule.color};">$&</span>`);
                    }
                });
                
                // 创建新的节点替换当前文本节点
                const newSpan = document.createElement('span');
                newSpan.innerHTML = text;
                node.parentNode.replaceChild(newSpan, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && 
                      !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName)) {
                // 处理元素节点（排除script、style和textarea）
                Array.from(node.childNodes).forEach(processNode);
            }
        }
        
        // 处理所有子节点
        Array.from(tempDiv.childNodes).forEach(processNode);
        
        return tempDiv.innerHTML;
    }
    
    // 转义正则表达式特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 获取内容信息
    function getContentData(contentElement) {
        let content = "";
        const contentElementWrapper = contentElement.querySelector('.text-editor-wrapper') || 
                                    contentElement.querySelector('.text-content') || 
                                    contentElement.querySelector('.text');
        
        if (contentElementWrapper) {
            content = contentElementWrapper.innerHTML || contentElementWrapper.textContent || "";
        } else {
            content = contentElement.innerHTML || contentElement.textContent || "";
        }
        
        // 修复special内容检测
        const trimmedContent = content.trim().toLowerCase();
        if (trimmedContent === "special") {
            content = "special (录入正确)";
        }
        
        return content.trim();
    }
    
    // 检查矩形是否重叠
    function isOverlapping(rect1, rect2) {
        return !(
            rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom
        );
    }
    
    // 计算两个矩形的重叠面积
    function calculateOverlapArea(rect1, rect2) {
        const xOverlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
        const yOverlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
        return xOverlap * yOverlap;
    }
    
    // 检查是否在视口内
    function isInViewport(rect) {
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // 获取矩形边缘最近的点
    function getClosestEdgePoint(rect1, rect2) {
        // 计算两个矩形中心点
        const center1 = {
            x: rect1.left + rect1.width / 2,
            y: rect1.top + rect1.height / 2
        };
        
        const center2 = {
            x: rect2.left + rect2.width / 2,
            y: rect2.top + rect2.height / 2
        };
        
        // 确定方向
        const dx = center2.x - center1.x;
        const dy = center2.y - center1.y;
        
        // 计算斜率
        const angle = Math.atan2(dy, dx);
        
        // 根据角度确定rect1的出口点
        let exitPoint1 = {x: center1.x, y: center1.y};
        
        if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
            // 水平方向主导
            exitPoint1.x = dx > 0 ? rect1.right : rect1.left;
            exitPoint1.y = center1.y + Math.tan(angle) * (exitPoint1.x - center1.x);
        } else {
            // 垂直方向主导
            exitPoint1.y = dy > 0 ? rect1.bottom : rect1.top;
            exitPoint1.x = center1.x + (exitPoint1.y - center1.y) / Math.tan(angle);
        }
        
        // 确保点在矩形边界上
        exitPoint1.x = Math.max(rect1.left, Math.min(rect1.right, exitPoint1.x));
        exitPoint1.y = Math.max(rect1.top, Math.min(rect1.bottom, exitPoint1.y));
        
        // 根据角度确定rect2的入口点
        let entryPoint2 = {x: center2.x, y: center2.y};
        
        if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
            // 水平方向主导
            entryPoint2.x = dx > 0 ? rect2.left : rect2.right;
            entryPoint2.y = center2.y + Math.tan(angle) * (entryPoint2.x - center2.x);
        } else {
            // 垂直方向主导
            entryPoint2.y = dy > 0 ? rect2.top : rect2.bottom;
            entryPoint2.x = center2.x + (entryPoint2.y - center2.y) / Math.tan(angle);
        }
        
        // 确保点在矩形边界上
        entryPoint2.x = Math.max(rect2.left, Math.min(rect2.right, entryPoint2.x));
        entryPoint2.y = Math.max(rect2.top, Math.min(rect2.bottom, entryPoint2.y));
        
        return {
            start: exitPoint1,
            end: entryPoint2
        };
    }
    
    // 检查是否与网页中原有的框重叠
    function isOverlappingWithOriginalBoxes(testRect) {
        // 获取页面中所有的坐标框
        const originalBoxes = document.querySelectorAll(`
            .oper-wrap.normalCursor,
            .oper-wrap.normalCursor.activeWrap,
            .oper-wrap.normalCursor.lock,
            .oper-wrap.normalCursor.activeWrap.lock
        `);
        
        for (let i = 0; i < originalBoxes.length; i++) {
            const boxRect = originalBoxes[i].getBoundingClientRect();
            if (isOverlapping(testRect, boxRect)) {
                return true;
            }
        }
        
        return false;
    }
    
    // 智能布局算法，避免重叠（完全防覆盖算法）- 已优化
    function adjustLabelPosition(label, index, coordinateElement) {
        // 检查标签是否已被拖动
        const posInfo = labelPositions.get(label);
        if (posInfo && posInfo.dragged) {
            // 如果已被拖动，保持当前位置不变
            label.style.left = `${posInfo.currentX}px`;
            label.style.top = `${posInfo.currentY}px`;
            
            // 更新连接线
            if (userSettings.showConnectionLine) {
                createConnectionLine(label, coordinateElement);
            }
            return;
        }
        
        const coordRect = coordinateElement.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        
        // 位置选项，按顺序尝试
        const positions = [
            { name: '右下角', x: coordRect.right + 5, y: coordRect.bottom + 5 },
            { name: '右上角', x: coordRect.right + 5, y: coordRect.top - labelRect.height - 5 },
            { name: '左下角', x: coordRect.left - labelRect.width - 5, y: coordRect.bottom + 5 },
            { name: '左上角', x: coordRect.left - labelRect.width - 5, y: coordRect.top - labelRect.height - 5 },
            { name: '右侧中间', x: coordRect.right + 5, y: coordRect.top + coordRect.height / 2 - labelRect.height / 2 },
            { name: '左侧中间', x: coordRect.left - labelRect.width - 5, y: coordRect.top + coordRect.height / 2 - labelRect.height / 2 },
            { name: '上方中间', x: coordRect.left + coordRect.width / 2 - labelRect.width / 2, y: coordRect.top - labelRect.height - 5 },
            { name: '下方中间', x: coordRect.left + coordRect.width / 2 - labelRect.width / 2, y: coordRect.bottom + 5 }
        ];

        let bestPosition;
        let minOverlapArea = Infinity;
        let minDistance = Infinity;

        if (userSettings.antiOverlap) {
            // 计算重叠惩罚系数（基于算法强度设置）
            const overlapPenalty = 1 + (userSettings.overlapAlgorithmStrength / 10);
            const maxExtensionDistance = userSettings.maxExtensionDistance || 300;
            
            for (let i = 0; i < positions.length; i++) {
                const pos = positions[i];
                
                // 计算方向向量（从坐标框指向标签位置）
                const coordCenter = {
                    x: coordRect.left + coordRect.width / 2,
                    y: coordRect.top + coordRect.height / 2
                };
                
                const posCenter = {
                    x: pos.x + labelRect.width / 2,
                    y: pos.y + labelRect.height / 2
                };
                
                const direction = {
                    x: posCenter.x - coordCenter.x,
                    y: posCenter.y - coordCenter.y
                };
                
                // 标准化方向向量
                const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
                if (length > 0) {
                    direction.x /= length;
                    direction.y /= length;
                }
                
                // 尝试沿着方向向量扩展位置
                for (let extension = 0; extension <= maxExtensionDistance; extension += 10) {
                    const extendedX = pos.x + direction.x * extension;
                    const extendedY = pos.y + direction.y * extension;
                    
                    const testRect = {
                        left: extendedX,
                        top: extendedY,
                        right: extendedX + labelRect.width,
                        bottom: extendedY + labelRect.height,
                        width: labelRect.width,
                        height: labelRect.height
                    };

                    // 检查是否在视口内
                    if (!isInViewport(testRect)) continue;

                    let totalOverlapArea = 0;
                    let visibleLabelCount = 0;
                    let distanceToOrigin = Math.sqrt(Math.pow(extendedX - coordRect.right, 2) + Math.pow(extendedY - coordRect.bottom, 2));

                    // 检查与现有标签的重叠
                    for (let j = 0; j < contentLabels.length; j++) {
                        if (j !== index && contentLabels[j].style.display !== 'none') {
                            const otherRect = contentLabels[j].getBoundingClientRect();
                            if (isOverlapping(testRect, otherRect)) {
                                totalOverlapArea += calculateOverlapArea(testRect, otherRect) * overlapPenalty;
                                visibleLabelCount++;
                            }
                        }
                    }

                    // 检查与坐标元素的重叠（更高的惩罚系数）
                    if (isOverlapping(testRect, coordRect)) {
                        totalOverlapArea += calculateOverlapArea(testRect, coordRect) * (overlapPenalty * 2);
                    }
                    
                    // 检查与网页中原有框的重叠（最高惩罚系数）
                    if (isOverlappingWithOriginalBoxes(testRect)) {
                        totalOverlapArea += calculateOverlapArea(testRect, coordRect) * (overlapPenalty * 3);
                    }
                    
                    // 优化1: 优先选择距离原始位置近的位置
                    if (totalOverlapArea === 0) {
                        if (distanceToOrigin < minDistance) {
                            minDistance = distanceToOrigin;
                            bestPosition = { x: extendedX, y: extendedY, name: pos.name };
                        }
                        break; // 找到不重叠的位置，跳出扩展循环
                    } 
                    // 优化2: 当必须重叠时，选择重叠面积最小的位置
                    else if (totalOverlapArea < minOverlapArea) {
                        minOverlapArea = totalOverlapArea;
                        minDistance = distanceToOrigin;
                        bestPosition = { x: extendedX, y: extendedY, name: pos.name };
                    }
                }

                // 如果找到不重叠的位置，优先使用
                if (minOverlapArea === 0 && bestPosition) {
                    break;
                }
            }

            // 如果没有找到合适的位置，使用右下角
            if (!bestPosition) {
                bestPosition = positions[0];
            }
        } else {
            bestPosition = positions[0];
        }

        // 应用位置
        label.style.left = `${bestPosition.x}px`;
        label.style.top = `${bestPosition.y}px`;

        // 存储位置信息
        labelPositions.set(label, {
            coordinateId: index,
            originalX: bestPosition.x,
            originalY: bestPosition.y,
            currentX: bestPosition.x,
            currentY: bestPosition.y,
            dragged: false,
            positionType: bestPosition.name
        });
        
        // 添加视觉连接线
        createConnectionLine(label, coordinateElement);
    }

    // 创建连接线（从边缘连接而非中心）
    function createConnectionLine(label, coordinateElement) {
        // 移除旧的连接线
        if (label.connectionLine && document.body.contains(label.connectionLine)) {
            document.body.removeChild(label.connectionLine);
        }
        
        if (!userSettings.showConnectionLine) return;
        
        const labelRect = label.getBoundingClientRect();
        const coordRect = coordinateElement.getBoundingClientRect();
        
        // 获取两个矩形边缘最近的点
        const points = getClosestEdgePoint(coordRect, labelRect);
        
        // 计算线条长度和角度
        const dx = points.end.x - points.start.x;
        const dy = points.end.y - points.start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // 创建线条元素
        const line = document.createElement('div');
        line.className = 'polygon-connection-line';
        line.style.position = 'fixed';
        line.style.left = `${points.start.x}px`;
        line.style.top = `${points.start.y}px`;
        line.style.width = `${length}px`;
        line.style.height = '2px';
        line.style.transformOrigin = '0 0';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.zIndex = '9998';
        line.style.pointerEvents = 'none';
        
        // 连接线优化：避免闪烁
        if (userSettings.connectionLineOptimization) {
            line.style.transition = 'none';
            // 使用requestAnimationFrame确保连接线在正确的位置绘制
            requestAnimationFrame(() => {
                if (document.body.contains(line)) {
                    line.style.transition = 'all 0.3s ease';
                }
            });
        }
        
        document.body.appendChild(line);
        label.connectionLine = line;
    }
    
    // 应用用户设置到所有标签
    function applyUserSettings() {
        if (isUpdatingPositions) return;
        isUpdatingPositions = true;
        
        contentLabels.forEach((label, index) => {
            // 应用基础样式
            label.style.fontFamily = userSettings.fontFamily;
            label.style.fontSize = `${userSettings.fontSize}px`;
            label.style.fontWeight = userSettings.boldText ? 'bold' : 'normal';
            
            // 应用连接线设置
            if (index < coordinateItems.length) {
                if (userSettings.showConnectionLine) {
                    createConnectionLine(label, coordinateItems[index]);
                } else if (label.connectionLine) {
                    document.body.removeChild(label.connectionLine);
                    label.connectionLine = null;
                }
            }
        
            // 应用透明度设置
            const textOpacity = userSettings.textOpacity / 100;
            const bgOpacity = userSettings.bgOpacity / 100;
            
            // 处理文本颜色透明度
            let textColor = userSettings.textColor;
            if (textColor.startsWith('rgba')) {
                textColor = textColor.replace(/rgba?\(([^)]+)\)/, (match, p1) => {
                    const parts = p1.split(',');
                    return `rgba(${parts[0]},${parts[1]},${parts[2]},${textOpacity})`;
                });
            } else if (textColor.startsWith('#')) {
                const hex = textColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                textColor = `rgba(${r},${g},${b},${textOpacity})`;
            }
            label.style.color = textColor;
            
            // 处理背景颜色透明度
            let bgColor = userSettings.backgroundColor;
            if (bgColor.startsWith('rgba')) {
                bgColor = bgColor.replace(/rgba?\(([^)]+)\)/, (match, p1) => {
                    const parts = p1.split(',');
                    return `rgba(${parts[0]},${parts[1]},${parts[2]},${bgOpacity})`;
                });
            } else if (bgColor.startsWith('#')) {
                const hex = bgColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                bgColor = `rgba(${r},${g},${b},${bgOpacity})`;
            }
            label.style.backgroundColor = bgColor;
            
            // 处理特殊内容
            if (userSettings.highlightSpecial) {
                const content = label.textContent.trim();
                let appliedCustomStyle = false;
                
                // 检查自定义特殊内容
                for (const rule of userSettings.customHighlights) {
                    if (content.includes(rule.keyword)) {
                        let ruleColor = rule.color;
                        if (ruleColor.startsWith('rgba')) {
                            ruleColor = ruleColor.replace(/rgba?\(([^)]+)\)/, (match, p1) => {
                                const parts = p1.split(',');
                                return `rgba(${parts[0]},${parts[1]},${parts[2]},${textOpacity})`;
                            });
                        } else if (ruleColor.startsWith('#')) {
                            const hex = ruleColor.replace('#', '');
                            const r = parseInt(hex.substring(0, 2), 16);
                            const g = parseInt(hex.substring(2, 4), 16);
                            const b = parseInt(hex.substring(4, 6), 16);
                            ruleColor = `rgba(${r},${g},${b},${textOpacity})`;
                        }
                        label.style.color = ruleColor;
                        label.style.border = '1px dashed ' + rule.color;
                        label.style.backgroundColor = `rgba(255, 255, 255, ${bgOpacity * 0.2})`;
                        appliedCustomStyle = true;
                        break;
                    }
                }
                
                // 如果未应用自定义样式，检查内置规则
                if (!appliedCustomStyle) {
                    if (content.includes("位置：") || 
                        hasSpecialChars(content)) {
                        let positionColor = userSettings.positionColor;
                        if (positionColor.startsWith('rgba')) {
                            positionColor = positionColor.replace(/rgba?\(([^)]+)\)/, (match, p1) => {
                                const parts = p1.split(',');
                                return `rgba(${parts[0]},${parts[1]},${parts[2]},${textOpacity})`;
                            });
                        } else if (positionColor.startsWith('#')) {
                            const hex = positionColor.replace('#', '');
                            const r = parseInt(hex.substring(0, 2), 16);
                            const g = parseInt(hex.substring(2, 4), 16);
                            const b = parseInt(hex.substring(4, 6), 16);
                            positionColor = `rgba(${r},${g},${b},${textOpacity})`;
                        }
                        label.style.color = positionColor;
                        label.style.border = '1px dashed ' + userSettings.positionColor;
                        label.style.backgroundColor = `rgba(255, 200, 200, ${bgOpacity * 0.2})`;
                    } else if (content.toLowerCase().includes("special")) {
                        let specialColor = userSettings.specialColor;
                        if (specialColor.startsWith('rgba')) {
                            specialColor = specialColor.replace(/rgba?\(([^)]+)\)/, (match, p1) => {
                                const parts = p1.split(',');
                                return `rgba(${parts[0]},${parts[1]},${parts[2]},${textOpacity})`;
                            });
                        } else if (specialColor.startsWith('#')) {
                            const hex = specialColor.replace('#', '');
                            const r = parseInt(hex.substring(0, 2), 16);
                            const g = parseInt(hex.substring(2, 4), 16);
                            const b = parseInt(hex.substring(4, 6), 16);
                            specialColor = `rgba(${r},${g},${b},${textOpacity})`;
                        }
                        label.style.color = specialColor;
                        label.style.border = '1px dashed ' + userSettings.specialColor;
                        label.style.backgroundColor = `rgba(200, 255, 200, ${bgOpacity * 0.2})`;
                    }
                }
            }
            
            // 重新调整位置（防止重叠）
            if (index < coordinateItems.length) {
                adjustLabelPosition(label, index, coordinateItems[index]);
            }
            
            // 应用拖动设置
            if (userSettings.dragEnabled) {
                enableDragging(label);
                label.style.pointerEvents = 'auto';
            } else {
                disableDragging(label);
                label.style.pointerEvents = 'none'; // 允许点击穿透
            }
        });
        
        // 应用过滤
        if (userSettings.enableFilter && window.polygonFilterText) {
            applyFilter(window.polygonFilterText);
        }
        
        isUpdatingPositions = false;
        saveSettings();
    }
    
    // 在坐标旁创建内容标签
    function createContentLabels() {
        // 先移除旧标签
        removeContentLabels();
        
        const minLength = Math.min(contentItems.length, coordinateItems.length);
        if (minLength === 0) return;
        
        for (let i = 0; i < minLength; i++) {
            let content = getContentData(contentItems[i]);
            const coordinateElement = coordinateItems[i];
            
            // 创建标签
            const label = document.createElement('div');
            label.className = 'polygon-label';
            label.dataset.index = i;
            label.dataset.content = content;
            
            // 使用闭包捕获正确的索引值
            (function(index) {
                // 添加悬停效果
                if (userSettings.highlightOnHover) {
                    label.addEventListener('mouseenter', function() {
                        if (index < coordinateItems.length) {
                            const coordinateElement = coordinateItems[index];
                            coordinateElement.style.outline = '2px solid #ff0000';
                            coordinateElement.style.outlineOffset = '2px';
                            
                            if (label.connectionLine) {
                                label.connectionLine.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
                                label.connectionLine.style.height = '2px';
                            }
                        }
                    });
                    
                    label.addEventListener('mouseleave', function() {
                        if (index < coordinateItems.length) {
                            const coordinateElement = coordinateItems[index];
                            coordinateElement.style.outline = '';
                            
                            if (label.connectionLine) {
                                label.connectionLine.style.backgroundColor = '';
                                label.connectionLine.style.height = '2px';
                            }
                        }
                    });
                }
            })(i);
            
            // 添加文字阴影增强可读性
            label.style.textShadow = 
                '0 0 2px #fff, ' +
                '0 0 3px #fff, ' +
                '0 0 4px #fff';
            
            label.style.padding = '4px 8px';
            label.style.borderRadius = '4px';
            label.style.fontWeight = userSettings.boldText ? 'bold' : 'normal';
            label.style.fontFamily = userSettings.fontFamily;
            label.style.fontSize = `${userSettings.fontSize}px`;
            label.style.whiteSpace = 'normal';
            label.style.wordBreak = 'break-word';
            label.style.boxShadow = 'none';
            label.style.maxWidth = '300px';
            label.style.overflow = 'visible';
            label.style.transition = 'opacity 0.3s ease';
            
            // 处理特殊字符显示和行高亮
            let processedContent = content;
            
            // 先应用行高亮
            if (userSettings.enableLineHighlight) {
                processedContent = applyLineHighlight(processedContent);
            }
            
            // 然后应用字体颜色规则
            if (userSettings.enableFontColorRules) {
                processedContent = applyFontColorRulesToHTML(processedContent);
            }
            
            // 然后处理特殊字符显示
            if (userSettings.showSpecialChars) {
                processedContent = visualizeSpecialChars(processedContent);
            }
            
            label.innerHTML = processedContent;
            
            // 处理特殊内容
            if (userSettings.highlightSpecial) {
                let appliedCustomStyle = false;
                
                // 检查自定义特殊内容
                for (const rule of userSettings.customHighlights) {
                    if (content.includes(rule.keyword)) {
                        label.style.color = rule.color;
                        label.style.border = '1px dashed ' + rule.color;
                        label.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        appliedCustomStyle = true;
                        break;
                    }
                }
                
                // 如果未应用自定义样式，检查内置规则
                if (!appliedCustomStyle) {
                    if (content.includes("位置：") || 
                        hasSpecialChars(content)) {
                        label.style.color = userSettings.positionColor;
                        label.style.border = '1px dashed ' + userSettings.positionColor;
                        label.style.backgroundColor = 'rgba(255, 200, 200, 0.2)';
                    } else if (content.toLowerCase().includes("special")) {
                        label.style.color = userSettings.specialColor;
                        label.style.border = '1px dashed ' + userSettings.specialColor;
                        label.style.backgroundColor = 'rgba(200, 255, 200, 0.2)';
                    } else {
                        label.style.color = userSettings.textColor;
                        label.style.backgroundColor = userSettings.backgroundColor;
                    }
                }
            } else {
                label.style.color = userSettings.textColor;
                label.style.backgroundColor = userSettings.backgroundColor;
            }
            
            // 添加到body
            document.body.appendChild(label);
            contentLabels.push(label);
            
            // 调整位置（防重叠）
            adjustLabelPosition(label, i, coordinateElement);
            
            // 添加拖拽功能
            if (userSettings.dragEnabled) {
                enableDragging(label);
                label.style.pointerEvents = 'auto';
            } else {
                label.style.pointerEvents = 'none'; // 允许点击穿透
            }
            
            // 永久显示标签
            label.style.display = 'block';
        }
        
        // 应用用户设置（包括透明度）
        applyUserSettings();
        
        // 检查元素数量并显示警告
        checkElementCount();
    }
    
    // 启用拖拽功能（优化版）
    function enableDragging(element) {
        // 先移除可能存在的旧事件监听器
        disableDragging(element);
        
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        const onMouseDown = function(e) {
            // 只响应左键点击
            if (e.button !== 0) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            element.style.cursor = 'grabbing';
            element.style.zIndex = '10000';
            e.preventDefault();
        };
        
        const onMouseMove = function(e) {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            element.style.left = `${initialX + dx}px`;
            element.style.top = `${initialY + dy}px`;
            
            // 更新位置信息
            const posInfo = labelPositions.get(element);
            if (posInfo) {
                posInfo.dragged = true;
                posInfo.currentX = initialX + dx;
                posInfo.currentY = initialY + dy;
            }
            
            // 更新连接线
            if (userSettings.showConnectionLine && element.connectionLine) {
                document.body.removeChild(element.connectionLine);
                element.connectionLine = null;
                const index = parseInt(element.dataset.index);
                if (index < coordinateItems.length) {
                    createConnectionLine(element, coordinateItems[index]);
                }
            }
        };
        
        const onMouseUp = function() {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';
            }
        };
        
        // 添加事件监听器
        element.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        // 存储事件监听器以便后续移除
        element._dragListeners = {
            mousedown: onMouseDown,
            mousemove: onMouseMove,
            mouseup: onMouseUp
        };
        
        element.style.cursor = 'move';
    }
    
    // 禁用拖拽功能
    function disableDragging(element) {
        if (element._dragListeners) {
            element.removeEventListener('mousedown', element._dragListeners.mousedown);
            document.removeEventListener('mousemove', element._dragListeners.mousemove);
            document.removeEventListener('mouseup', element._dragListeners.mouseup);
            element._dragListeners = null;
        }
        element.style.cursor = 'default';
    }
    
    // 显示元素数量过多的警告
    function checkElementCount() {
        // 移除旧的警告
        if (largeCountWarning && document.body.contains(largeCountWarning)) {
            document.body.removeChild(largeCountWarning);
            largeCountWarning = null;
        }
        
        // 检查是否超过阈值
        const count = contentItems.length;
        if (count > userSettings.warnThreshold) {
            largeCountWarning = document.createElement('div');
            largeCountWarning.id = 'polygon-large-count-warning';
            largeCountWarning.textContent = `⚠️ 位置框超过 (${count}个)`;
            
            // 添加关闭按钮
            const closeBtn = document.createElement('span');
            closeBtn.textContent = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '5px';
            closeBtn.style.right = '10px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '24px';
            closeBtn.addEventListener('click', () => {
                if (document.body.contains(largeCountWarning)) {
                    document.body.removeChild(largeCountWarning);
                }
            });
            
            largeCountWarning.appendChild(closeBtn);
            document.body.appendChild(largeCountWarning);
            
            // 10秒后自动关闭
            setTimeout(() => {
                if (largeCountWarning && document.body.contains(largeCountWarning)) {
                    document.body.removeChild(largeCountWarning);
                    largeCountWarning = null;
                }
            }, 10000);
        }
    }
    
    // 移除所有内容标签
    function removeContentLabels() {
        contentLabels.forEach(label => {
            if (document.body.contains(label)) {
                // 移除连接线
                if (label.connectionLine && document.body.contains(label.connectionLine)) {
                    document.body.removeChild(label.connectionLine);
                }
                
                // 添加淡出效果
                label.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(label)) {
                        document.body.removeChild(label);
                    }
                }, 300);
            }
        });
        contentLabels = [];
        labelPositions.clear();
    }
    
    // 应用过滤
    function applyFilter(filterText) {
        if (!filterText) {
            // 显示所有标签
            contentLabels.forEach(label => {
                label.style.display = 'block';
                label.classList.remove('polygon-filter-highlight');
            });
            return;
        }
        
        const keywords = filterText.split(',').map(k => k.trim().toLowerCase());
        
        contentLabels.forEach(label => {
            const content = label.dataset.content.toLowerCase();
            const hasMatch = keywords.some(keyword => 
                keyword && content.includes(keyword)
            );
            
            if (hasMatch) {
                label.style.display = 'block';
                label.classList.add('polygon-filter-highlight');
            } else {
                label.style.display = 'none';
                label.classList.remove('polygon-filter-highlight');
            }
        });
    }
    
    // 隐藏所有标签
    function hideAllLabels() {
        contentLabels.forEach(label => {
            label.style.display = 'none';
        });
    }
    
    // 显示所有标签
    function showAllLabels() {
        contentLabels.forEach(label => {
            label.style.display = 'block';
        });
    }
    
    // 重置标签位置
    function resetLabelPositions() {
        contentLabels.forEach(label => {
            const posInfo = labelPositions.get(label);
            if (posInfo) {
                posInfo.dragged = false;
                posInfo.currentX = posInfo.originalX;
                posInfo.currentY = posInfo.originalY;
            }
        });
        applyUserSettings();
    }
    
    // 创建设置按钮
    function createSettingsButton() {
        // 如果按钮已存在，先移除
        const existingButton = document.getElementById('polygon-settings-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        const button = document.createElement('button');
        button.id = 'polygon-settings-button';
        button.textContent = '显示设置';
        
        // 添加悬停效果
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#45a049';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#4CAF50';
        });
        
        // 点击按钮显示设置面板
        button.addEventListener('click', () => {
            createControlPanel();
        });
        
        document.body.appendChild(button);
    }
    
    // 控制面板创建函数
    function createControlPanel() {
        if (controlPanelCreated) return;
        
        const panel = document.createElement('div');
        panel.className = 'polygon-control-panel';
        panel.id = 'polygon-control-panel';
        
        // 标题和关闭按钮
        const header = document.createElement('div');
        header.className = 'panel-header';
        
        const title = document.createElement('h3');
        title.textContent = '显示设置';
        title.style.margin = '0';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 5px 10px;
        `;
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(panel);
            controlPanelCreated = false;
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);
        
        // 过滤控制
        const filterSection = document.createElement('div');
        filterSection.className = 'panel-section';
        
        const filterTitle = document.createElement('div');
        filterTitle.className = 'panel-section-title';
        filterTitle.textContent = '内容过滤';
        filterSection.appendChild(filterTitle);
        
        const filterRow = document.createElement('div');
        filterRow.className = 'control-row';
        
        const filterLabel = document.createElement('label');
        filterLabel.className = 'control-label';
        filterLabel.textContent = '关键词过滤:';
        filterLabel.htmlFor = 'polygon-filter-input';
        
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.id = 'polygon-filter-input';
        filterInput.className = 'control-input';
        filterInput.placeholder = '输入关键词(逗号分隔)';
        filterInput.value = window.polygonFilterText || '';
        filterInput.addEventListener('input', () => {
            window.polygonFilterText = filterInput.value.toLowerCase();
            applyFilter(window.polygonFilterText);
        });
        
        filterRow.appendChild(filterLabel);
        filterRow.appendChild(filterInput);
        filterSection.appendChild(filterRow);
        
        panel.appendChild(filterSection);
        
        // 基本样式设置
        const styleSection = document.createElement('div');
        styleSection.className = 'panel-section';
        
        const styleTitle = document.createElement('div');
        styleTitle.className = 'panel-section-title';
        styleTitle.textContent = '基本样式设置';
        styleSection.appendChild(styleTitle);
        
        // 创建设置选项
        const styleSettings = [
            {
                type: 'text',
                id: 'fontFamily',
                label: '字体',
                value: userSettings.fontFamily
            },
            {
                type: 'color',
                id: 'backgroundColor',
                label: '背景颜色',
                value: userSettings.backgroundColor
            },
            {
                type: 'number',
                id: 'fontSize',
                label: '字体大小',
                value: userSettings.fontSize,
                min: 8,
                max: 24
            },
            {
                type: 'color',
                id: 'textColor',
                label: '文字颜色',
                value: userSettings.textColor
            },
            {
                type: 'checkbox',
                id: 'boldText',
                label: '粗体文字',
                checked: userSettings.boldText
            },
            {
                type: 'range',
                id: 'textOpacity',
                label: '文字透明度',
                value: userSettings.textOpacity,
                min: 0,
                max: 100
            },
            {
                type: 'range',
                id: 'bgOpacity',
                label: '背景透明度',
                value: userSettings.bgOpacity,
                min: 0,
                max: 100
            }
        ];
        
        styleSettings.forEach(setting => {
            createSettingControl(setting, styleSection);
        });
        
        panel.appendChild(styleSection);
        
        // 高级设置
        const advancedSection = document.createElement('div');
        advancedSection.className = 'panel-section';
        
        const advancedTitle = document.createElement('div');
        advancedTitle.className = 'panel-section-title';
        advancedTitle.textContent = '高级设置';
        advancedSection.appendChild(advancedTitle);
        
        const advancedSettings = [
            {
                type: 'checkbox',
                id: 'highlightSpecial',
                label: '高亮特殊内容',
                checked: userSettings.highlightSpecial
            },
            {
                type: 'color',
                id: 'positionColor',
                label: '位置内容颜色',
                value: userSettings.positionColor
            },
            {
                type: 'color',
                id: 'specialColor',
                label: '特殊内容颜色',
                value: userSettings.specialColor
            },
            {
                type: 'checkbox',
                id: 'showSpecialChars',
                label: '显示特殊字符',
                checked: userSettings.showSpecialChars
            },
            {
                type: 'checkbox',
                id: 'antiOverlap',
                label: '防重叠布局',
                checked: userSettings.antiOverlap
            },
            {
                type: 'checkbox',
                id: 'dragEnabled',
                label: '启用标签拖动',
                checked: userSettings.dragEnabled
            },
            {
                type: 'checkbox',
                id: 'enableFilter',
                label: '启用关键词过滤',
                checked: userSettings.enableFilter
            },
            {
                type: 'number',
                id: 'warnThreshold',
                label: '警告阈值',
                value: userSettings.warnThreshold,
                min: 5,
                max: 100
            },
            {
                type: 'checkbox',
                id: 'enableLineHighlight',
                label: '启用行高亮',
                checked: userSettings.enableLineHighlight
            },
            {
                type: 'checkbox',
                id: 'enableFontColorRules',
                label: '启用字体颜色规则',
                checked: userSettings.enableFontColorRules
            },
            {
                type: 'checkbox',
                id: 'showConnectionLine',
                label: '显示连接线',
                checked: userSettings.showConnectionLine
            },
            {
                type: 'checkbox',
                id: 'highlightOnHover',
                label: '悬停高亮对应框',
                checked: userSettings.highlightOnHover
            },
            // 新增设置：防重叠算法强度
            {
                type: 'range',
                id: 'overlapAlgorithmStrength',
                label: '防重叠算法强度',
                value: userSettings.overlapAlgorithmStrength,
                min: 1,
                max: 10
            },
            // 新增设置：连接线优化
            {
                type: 'checkbox',
                id: 'connectionLineOptimization',
                label: '连接线优化',
                checked: userSettings.connectionLineOptimization
            },
            // 新增设置：最大扩展距离
            {
                type: 'number',
                id: 'maxExtensionDistance',
                label: '最大扩展距离(px)',
                value: userSettings.maxExtensionDistance,
                min: 100,
                max: 1000
            }
        ];
        
        advancedSettings.forEach(setting => {
            createSettingControl(setting, advancedSection);
        });
        
        panel.appendChild(advancedSection);
        
        // 自定义高亮规则
        const rulesSection = document.createElement('div');
        rulesSection.className = 'panel-section';
        
        const rulesTitle = document.createElement('div');
        rulesTitle.className = 'panel-section-title';
        rulesTitle.textContent = '自定义高亮规则';
        rulesSection.appendChild(rulesTitle);
        
        userSettings.customHighlights.forEach((rule, index) => {
            const ruleRow = document.createElement('div');
            ruleRow.className = 'highlight-rule-row';
            
            const keywordInput = document.createElement('input');
            keywordInput.type = 'text';
            keywordInput.className = 'rule-keyword';
            keywordInput.value = rule.keyword;
            keywordInput.placeholder = '关键词';
            keywordInput.addEventListener('change', () => {
                userSettings.customHighlights[index].keyword = keywordInput.value;
                applyUserSettings();
            });
            
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'rule-color';
            colorInput.value = rule.color;
            colorInput.addEventListener('change', () => {
                userSettings.customHighlights[index].color = colorInput.value;
                applyUserSettings();
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.className = 'panel-button button-danger';
            deleteBtn.addEventListener('click', () => {
                userSettings.customHighlights.splice(index, 1);
                document.body.removeChild(panel);
                controlPanelCreated = false;
                createControlPanel();
            });
            
            ruleRow.appendChild(keywordInput);
            ruleRow.appendChild(colorInput);
            ruleRow.appendChild(deleteBtn);
            rulesSection.appendChild(ruleRow);
        });
        
        // 添加新规则按钮
        const addRuleBtn = document.createElement('button');
        addRuleBtn.textContent = '+ 添加规则';
        addRuleBtn.className = 'panel-button button-secondary';
        addRuleBtn.addEventListener('click', () => {
            userSettings.customHighlights.push({ keyword: '', color: '#ffcc00' });
            document.body.removeChild(panel);
            controlPanelCreated = false;
            createControlPanel();
        });
        rulesSection.appendChild(addRuleBtn);
        
        panel.appendChild(rulesSection);
        
        // 字体颜色规则
        const fontColorSection = document.createElement('div');
        fontColorSection.className = 'panel-section';
        
        const fontColorTitle = document.createElement('div');
        fontColorTitle.className = 'panel-section-title';
        fontColorTitle.textContent = '字体颜色规则';
        fontColorSection.appendChild(fontColorTitle);
        
        userSettings.fontColorRules.forEach((rule, index) => {
            const ruleRow = document.createElement('div');
            ruleRow.className = 'font-color-rule-row';
            
            const keywordInput = document.createElement('input');
            keywordInput.type = 'text';
            keywordInput.className = 'rule-keyword';
            keywordInput.value = rule.keyword;
            keywordInput.placeholder = '关键词';
            keywordInput.addEventListener('change', () => {
                userSettings.fontColorRules[index].keyword = keywordInput.value;
                applyUserSettings();
            });
            
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'rule-color';
            colorInput.value = rule.color;
            colorInput.addEventListener('change', () => {
                userSettings.fontColorRules[index].color = colorInput.value;
                applyUserSettings();
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.className = 'panel-button button-danger';
            deleteBtn.addEventListener('click', () => {
                userSettings.fontColorRules.splice(index, 1);
                document.body.removeChild(panel);
                controlPanelCreated = false;
                createControlPanel();
            });
            
            ruleRow.appendChild(keywordInput);
            ruleRow.appendChild(colorInput);
            ruleRow.appendChild(deleteBtn);
            fontColorSection.appendChild(ruleRow);
        });
        
        // 添加新规则按钮
        const addFontColorRuleBtn = document.createElement('button');
        addFontColorRuleBtn.textContent = '+ 添加字体颜色规则';
        addFontColorRuleBtn.className = 'panel-button button-secondary';
        addFontColorRuleBtn.addEventListener('click', () => {
            userSettings.fontColorRules.push({ keyword: '', color: '#ff0000' });
            document.body.removeChild(panel);
            controlPanelCreated = false;
            createControlPanel();
        });
        fontColorSection.appendChild(addFontColorRuleBtn);
        
        panel.appendChild(fontColorSection);
        
        // 行高亮规则
        const lineSection = document.createElement('div');
        lineSection.className = 'panel-section';
        
        const lineTitle = document.createElement('div');
        lineTitle.className = 'panel-section-title';
        lineTitle.textContent = '行高亮规则';
        lineSection.appendChild(lineTitle);
        
        userSettings.lineHighlights.forEach((rule, index) => {
            const ruleRow = document.createElement('div');
            ruleRow.className = 'segment-rule-row';
            
            const keywordInput = document.createElement('input');
            keywordInput.type = 'text';
            keywordInput.className = 'rule-keyword';
            keywordInput.value = rule.keyword;
            keywordInput.placeholder = '关键词';
            keywordInput.addEventListener('change', () => {
                userSettings.lineHighlights[index].keyword = keywordInput.value;
                applyUserSettings();
            });
            
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'rule-color';
            colorInput.value = rule.color;
            colorInput.addEventListener('change', () => {
                userSettings.lineHighlights[index].color = colorInput.value;
                applyUserSettings();
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.className = 'panel-button button-danger';
            deleteBtn.addEventListener('click', () => {
                userSettings.lineHighlights.splice(index, 1);
                document.body.removeChild(panel);
                controlPanelCreated = false;
                createControlPanel();
            });
            
            ruleRow.appendChild(keywordInput);
            ruleRow.appendChild(colorInput);
            ruleRow.appendChild(deleteBtn);
            lineSection.appendChild(ruleRow);
        });
        
        // 添加新规则按钮
        const addLineRuleBtn = document.createElement('button');
        addLineRuleBtn.textContent = '+ 添加行规则';
        addLineRuleBtn.className = 'panel-button button-secondary';
        addLineRuleBtn.addEventListener('click', () => {
            userSettings.lineHighlights.push({ keyword: '', color: '#ff0000' });
            document.body.removeChild(panel);
            controlPanelCreated = false;
            createControlPanel();
        });
        lineSection.appendChild(addLineRuleBtn);
        
        panel.appendChild(lineSection);
        
        // 操作按钮
        const actionSection = document.createElement('div');
        actionSection.className = 'panel-section';
        
        const actionTitle = document.createElement('div');
        actionTitle.className = 'panel-section-title';
        actionTitle.textContent = '标签操作';
        actionSection.appendChild(actionTitle);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.gap = '8px';
        
        // 创建操作按钮
        const actions = [
            { text: '全部隐藏', className: 'button-warning', action: hideAllLabels },
            { text: '全部显示', className: 'button-success', action: showAllLabels },
            { text: '刷新标签', className: 'button-secondary', action: () => createContentLabels() },
            { text: '重置位置', className: 'button-warning', action: resetLabelPositions }
        ];
        
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.textContent = action.text;
            btn.className = `panel-action-button ${action.className}`;
            btn.addEventListener('click', action.action);
            buttonContainer.appendChild(btn);
        });
        
        actionSection.appendChild(buttonContainer);
        panel.appendChild(actionSection);
        
        // 应用和重置按钮
        const buttonRow = document.createElement('div');
        buttonRow.className = 'button-group';
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '恢复默认';
        resetBtn.className = 'panel-button button-warning';
        resetBtn.addEventListener('click', () => {
            userSettings = {
                fontFamily: 'Arial',
                backgroundColor: 'rgba(30, 30, 30, 0.7)',
                fontSize: 14,
                textColor: '#66ccff',
                boldText: true,
                highlightSpecial: true,
                positionColor: '#ff0000',
                specialColor: '#00ff00',
                customHighlights: [
                    { keyword: '重要', color: '#ffcc00' },
                    { keyword: '注意', color: '#ff9900' }
                ],
                lineHighlights: [
                    { keyword: '错误', color: '#ff0000' },
                    { keyword: '警告', color: '#ff9900' },
                    { keyword: '成功', color: '#00cc00' }
                ],
                fontColorRules: [
                    { keyword: '紧急', color: '#ff0000' },
                    { keyword: '高优先级', color: '#ff6600' }
                ],
                warnThreshold: 30,
                antiOverlap: true,
                allowDragging: true,
                enableFilter: true,
                globalCollapse: false,
                textOpacity: 100,
                bgOpacity: 70,
                showSpecialChars: true,
                dragEnabled: true,
                enableLineHighlight: true,
                enableFontColorRules: true,
                showConnectionLine: false,
                highlightOnHover: true,
                overlapAlgorithmStrength: 5,
                connectionLineOptimization: true,
                maxExtensionDistance: 300
            };
            saveSettings();
            document.body.removeChild(panel);
            controlPanelCreated = false;
            applyUserSettings();
        });
        
        const applyBtn = document.createElement('button');
        applyBtn.textContent = '应用设置';
        applyBtn.className = 'panel-button button-primary';
        applyBtn.addEventListener('click', () => {
            applyUserSettings();
        });
        
        buttonRow.appendChild(resetBtn);
        buttonRow.appendChild(applyBtn);
        panel.appendChild(buttonRow);
        
        document.body.appendChild(panel);
        controlPanelCreated = true;
    }
    
    // 创建设置控件辅助函数
    function createSettingControl(setting, container) {
        const row = document.createElement('div');
        row.className = 'control-row';
        
        const label = document.createElement('label');
        label.className = 'control-label';
        label.textContent = setting.label;
        label.htmlFor = setting.id;
        
        let input;
        if (setting.type === 'checkbox') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'control-checkbox';
            input.checked = setting.checked;
            input.id = setting.id;
            input.addEventListener('change', () => {
                userSettings[setting.id] = input.checked;
                applyUserSettings();
            });
        } else if (setting.type === 'color') {
            input = document.createElement('input');
            input.type = 'color';
            input.className = 'control-input';
            input.value = setting.value;
            input.id = setting.id;
            input.addEventListener('change', () => {
                userSettings[setting.id] = input.value;
                applyUserSettings();
            });
        } else if (setting.type === 'number') {
            input = document.createElement('input');
            input.type = 'number';
            input.className = 'control-input';
            input.value = setting.value;
            input.min = setting.min;
            input.max = setting.max;
            input.id = setting.id;
            input.addEventListener('change', () => {
                userSettings[setting.id] = parseFloat(input.value);
                applyUserSettings();
            });
        } else if (setting.type === 'range') {
            input = document.createElement('input');
            input.type = 'range';
            input.className = 'control-range';
            input.value = setting.value;
            input.min = setting.min;
            input.max = setting.max;
            input.id = setting.id;
            input.addEventListener('input', () => {
                userSettings[setting.id] = parseFloat(input.value);
                // 更新值显示
                const valueDisplay = input.parentNode.querySelector('.value-display');
                if (valueDisplay) {
                    if (setting.id === 'overlapAlgorithmStrength') {
                        valueDisplay.textContent = input.value;
                    } else {
                        valueDisplay.textContent = input.value + '%';
                    }
                }
                applyUserSettings();
            });
            
            // 创建值显示
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'value-display';
            if (setting.id === 'overlapAlgorithmStrength') {
                valueDisplay.textContent = input.value;
            } else {
                valueDisplay.textContent = input.value + '%';
            }
            
            row.appendChild(label);
            row.appendChild(input);
            row.appendChild(valueDisplay);
            container.appendChild(row);
            return; // 跳过后续的appendChild
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.className = 'control-input';
            input.value = setting.value;
            input.id = setting.id;
            input.addEventListener('change', () => {
                userSettings[setting.id] = input.value;
                applyUserSettings();
            });
        }
        
        row.appendChild(label);
        row.appendChild(input);
        container.appendChild(row);
    }
    
    // 主初始化函数
    function initializePlugin() {
        if (isInitialized) return;
        isInitialized = true;
        
        // 获取内容元素列表
        contentItems = document.querySelectorAll('.el-collapse-item');
        
        // 获取坐标元素列表
        coordinateItems = document.querySelectorAll(`
            .oper-wrap.normalCursor,
            .oper-wrap.normalCursor.activeWrap,
            .oper-wrap.normalCursor.lock,
            .oper-wrap.normalCursor.activeWrap.lock
        `);
        
        console.log(`找到 ${contentItems.length} 个内容元素`);
        console.log(`找到 ${coordinateItems.length} 个坐标元素`);
        
        // 加载保存的设置
        loadSavedSettings();
        
        // 创建设置按钮
        createSettingsButton();
        
        // 创建内容标签
        createContentLabels();
        
        // 确保两个列表长度一致
        const minLength = Math.min(contentItems.length, coordinateItems.length);
        if (contentItems.length !== coordinateItems.length) {
            console.warn(`⚠️ 内容元素和坐标元素数量不一致，取最小值: ${minLength}`);
        }
    }
    
    // 更新标签位置函数
    function updateLabelPositions() {
        contentLabels.forEach((label, index) => {
            if (index < coordinateItems.length) {
                adjustLabelPosition(label, index, coordinateItems[index]);
            }
        });
    }
    
    // 防抖的位置更新函数
    const debouncedUpdateLabelPositions = debounce(updateLabelPositions, 20);
        
    // 元素变化监听器
    function observeItems() {
        const observer = new MutationObserver(() => {
            // 重新获取元素
            const newContentItems = document.querySelectorAll('.el-collapse-item');
            const newCoordinateItems = document.querySelectorAll(`
                .oper-wrap.normalCursor,
                .oper-wrap.normalCursor.activeWrap,
                .oper-wrap.normalCursor.lock,
                .oper-wrap.normalCursor.activeWrap.lock
            `);
            
            // 检查是否有变化
            if (newContentItems.length !== contentItems.length || 
                newCoordinateItems.length !== coordinateItems.length) {
                
                contentItems = newContentItems;
                coordinateItems = newCoordinateItems;
                
                console.log(`元素已更新，内容元素: ${contentItems.length}，坐标元素: ${coordinateItems.length}`);
                
                // 更新内容标签
                createContentLabels();
            } else {
                // 更新标签位置（元素位置可能变化）
                debouncedUpdateLabelPositions();
            }
        });
        
        // 监听整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 添加窗口滚动和缩放监听（使用防抖）
        window.addEventListener('scroll', debouncedUpdateLabelPositions);
        
        window.addEventListener('resize', debouncedUpdateLabelPositions);
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializePlugin();
            observeItems();
            console.log('✅ 插件已启用: 优化内容显示');
        });
    } else {
        initializePlugin();
        observeItems();
        console.log('✅ 插件已启用: 优化内容显示');
    }
    
    // 添加重试机制
    setTimeout(() => {
        if (!isInitialized) {
            console.log('⏱ 页面加载超时，尝试重新初始化插件');
            initializePlugin();
        }
    }, 5000);
})();