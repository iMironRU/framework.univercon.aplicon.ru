// Улучшенные подсказки для терминов глоссария
document.addEventListener('DOMContentLoaded', function() {
    let activeTooltip = null;
    let hideTimeout = null;
    
    const terms = document.querySelectorAll('.glossary-term');
    
    terms.forEach(term => {
        const termKey = term.getAttribute('data-term');
        const termData = window.glossaryTerms[termKey];
        
        if (termData) {
            // Создаем подсказку
            const tooltip = document.createElement('div');
            tooltip.className = 'glossary-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-content">
                    <strong>${termData.term}</strong>
                    <p>${termData.definition}</p>
                    <a href="${termData.link}" class="tooltip-link" target="_blank">Подробнее в глоссарии →</a>
                </div>
            `;
            
            document.body.appendChild(tooltip);
            
            // Показ подсказки
            term.addEventListener('mouseenter', function(e) {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                
                if (activeTooltip && activeTooltip !== tooltip) {
                    activeTooltip.classList.remove('visible');
                }
                
                activeTooltip = tooltip;
                positionTooltip(term, tooltip);
                tooltip.classList.add('visible');
            });
            
            // Скрытие подсказки с задержкой
            term.addEventListener('mouseleave', function() {
                hideTimeout = setTimeout(() => {
                    if (activeTooltip === tooltip) {
                        tooltip.classList.remove('visible');
                        activeTooltip = null;
                    }
                }, 300); // Задержка перед скрытием
            });
            
            // Отмена скрытия при наведении на саму подсказку
            tooltip.addEventListener('mouseenter', function() {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
            });
            
            // Скрытие подсказки при уходе с нее
            tooltip.addEventListener('mouseleave', function() {
                hideTimeout = setTimeout(() => {
                    tooltip.classList.remove('visible');
                    activeTooltip = null;
                }, 300);
            });
        }
    });
    
    // Функция позиционирования подсказки с учетом границ экрана
    function positionTooltip(term, tooltip) {
        const rect = term.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        let left = rect.left;
        let top = rect.bottom + 8;
        
        // Корректировка по горизонтали (чтобы не выходила за правый край)
        if (left + tooltipRect.width > viewport.width - 20) {
            left = viewport.width - tooltipRect.width - 20;
        }
        
        // Корректировка по вертикали (если подсказка не помещается снизу, показываем сверху)
        if (top + tooltipRect.height > viewport.height - 20) {
            top = rect.top - tooltipRect.height - 8;
        }
        
        // Минимальный отступ от краев
        left = Math.max(20, left);
        top = Math.max(20, top);
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
    
    // Репозиционирование при изменении размера окна
    window.addEventListener('resize', function() {
        if (activeTooltip) {
            const term = document.querySelector('.glossary-term:hover');
            if (term) {
                positionTooltip(term, activeTooltip);
            }
        }
    });
});