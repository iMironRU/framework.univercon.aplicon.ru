# plugins/table_exporter.py
import os
import pandas as pd
import re
from mkdocs.plugins import BasePlugin
from mkdocs.config.config_options import Type, Choice

class TableExporterPlugin(BasePlugin):
    config_scheme = (
        ('export_dir', Type(str, default='excel_exports')),
        ('auto_generate', Type(bool, default=True)),
        ('button_style', Choice(['default', 'primary', 'success'], default='success')),
        ('include_timestamp', Type(bool, default=True)),
    )
    
    def on_page_markdown(self, markdown, page, config, files):
        if not self.config['auto_generate']:
            return markdown
        
        # Ищем таблицы с возможными заголовками
        table_pattern = r'(?:<!--\s*table-title:\s*(.*?)\s*-->)?\n?(\|.*\|\s*\n\|[-:\s|]+\|\s*\n(?:\|.*\|\s*\n?)*)'
        tables = re.findall(table_pattern, markdown)
        
        if not tables:
            return markdown
        
        page_name = page.file.name.replace('/', '_').replace('.md', '')
        modified_markdown = markdown
        
        for table_title, table in tables:
            excel_link = self._table_to_excel(table, page_name, table_title.strip() if table_title else None)
            if excel_link:
                download_section = f"\n\n<div class=\"table-download\">\n{excel_link}\n</div>\n\n"
                modified_markdown = modified_markdown.replace(table, table + download_section)
        
        return modified_markdown
    
    def _table_to_excel(self, table_markdown, page_name, table_title=None):
        try:
            lines = table_markdown.strip().split('\n')
            data = []
            
            for line in lines:
                if line.strip().startswith('|'):
                    cells = [cell.strip() for cell in line.strip().split('|')[1:-1]]
                    data.append(cells)
            
            if len(data) < 2:
                return None
            
            headers = data[0]
            # Проверяем вторую строку на разделитель
            if all(re.search(r'[-:]+', cell) for cell in data[1]):
                rows = data[2:]
            else:
                rows = data[1:]
            
            df = pd.DataFrame(rows, columns=headers)
            
            # Генерируем имя файла
            if table_title:
                filename = f"{self._slugify(table_title)}.xlsx"
            else:
                filename = f"{page_name}_table.xlsx"
            
            filepath = os.path.join(self.export_dir, filename)
            
            # Сохраняем в Excel
            df.to_excel(filepath, index=False, engine='openpyxl')
            
            button_class = f"md-button md-button--{self.config['button_style']}"
            return f'<a href="./{self.config["export_dir"]}/{filename}" class="{button_class}">📊 Скачать Excel</a>'
            
        except Exception as e:
            print(f"Ошибка при экспорте таблицы: {e}")
            return None
    
    def _slugify(self, text):
        """Преобразует текст в безопасное имя файла"""
        text = text.lower().strip()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '_', text)
        return text