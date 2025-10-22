// Скрипт для добавления минималистичных кнопок предложения изменений
document.addEventListener('DOMContentLoaded', function() {
    // Ждем загрузки всей страницы
    setTimeout(initContributeSection, 100);
});

function initContributeSection() {
    const baseUrl = 'https://github.com/iMironRU/my-awesome-docs';
    
    // Создаем минималистичный блок
    const section = document.createElement('div');
    section.className = 'contribute-minimal';
    
    section.innerHTML = `
        <div class="contribute-minimal__content">
            <div class="contribute-minimal__text">
                <strong>Присоединяйтесь к разработке открытой системы управления образованием!</strong>
                <span class="contribute-minimal__github">
                    GitHub: <a href="${baseUrl}" target="_blank" rel="noopener">iMironRU</a>
                </span>
            </div>
            <div class="contribute-minimal__actions">
                <a href="${baseUrl}/edit/main/docs/${getFilePath()}" 
                   class="contribute-minimal__link" 
                   target="_blank" 
                   rel="noopener" 
                   title="Предложить правку к этой странице">
                    <span>✏️</span>
                </a>
                <a href="${baseUrl}/issues/new?template=documentation.yml" 
                   class="contribute-minimal__link" 
                   target="_blank" 
                   rel="noopener"
                   title="Сообщить об ошибке">
                    <span>🐛</span>
                </a>
                <a href="${baseUrl}/discussions" 
                   class="contribute-minimal__link" 
                   target="_blank" 
                   rel="noopener"
                   title="Предложить идею">
                    <span>💡</span>
                </a>
            </div>
        </div>
    `;

    // Вставляем в подвал или перед подвалом
    const footer = document.querySelector('.md-footer');
    const footerNav = document.querySelector('.md-footer-nav');
    
    if (footer && !document.querySelector('.contribute-minimal')) {
        footer.parentNode.insertBefore(section, footer);
    } else if (footerNav) {
        footerNav.parentNode.insertBefore(section, footerNav);
    } else {
        // Если не нашли подвал, вставляем в конец контента
        const content = document.querySelector('.md-content__inner');
        if (content) {
            content.appendChild(section);
        }
    }
}

function getFilePath() {
    // Определяем путь к текущему файлу
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
        return 'index.md';
    }
    
    // Преобразуем URL в путь к файлу .md
    let filePath = path.replace(/\.html$/, '').replace(/^\//, '');
    if (!filePath.endsWith('.md')) {
        filePath += '.md';
    }
    return filePath;
}