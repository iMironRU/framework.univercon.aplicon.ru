# Создаем виртуальное окружение
python3 -m venv venv

# Активируем виртуальное окружение 
# Всегда активируйте виртуальное окружение перед работой с проектом
source venv/bin/activate

# Деактивация виртуального окружения когда не нужно
deactivate

# Теперь устанавливаем зависимости в виртуальное окружение
pip install -r requirements.txt

# Если файла requirements.txt нет, создайте его после установки всех зависимостей
pip freeze > requirements.txt

# Запускаем mkdocs
mkdocs serve

mkdocs serve --livereload 

# собираем билд mkdocs
mkdocs build

# копирование на хостинг
rsync -avz --delete -e ssh '/Users/mal/Documents/!hugo!/framework.univercon.aplicon.ru/site/' admin@ubitek.ru:/home/admin/web/framework.aplicon.ru/public_html/