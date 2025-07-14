<!-- ----------------------- Настройка автоматизации для хостинга https://www.ukraine.com.ua/wiki/hosting/other/github-actions/----------------------- -->

1. В проекте в корневой папке создать папку .github/workflows/deploy.yml
2. Вложить код ниже в фаил deploy.yml

<!-- YML настроййки -->

<!-- ==================================== -->

    name: Build and Deploy
    on:
    push:
    branches: - main

    jobs:
    build-and-deploy:
    runs-on: ubuntu-latest

    env:
      REACT_APP_BASE_URL: ${{ secrets.REACT_APP_BASE_URL }}
      REACT_APP_CONSUMER_KEY: ${{ secrets.REACT_APP_CONSUMER_KEY }}
      REACT_APP_CONSUMER_SECRET_KEY: ${{ secrets.REACT_APP_CONSUMER_SECRET_KEY }}

    steps:
      # 1. Клонирование репозитория
      - uses: actions/checkout@v4

      # 2. Установка Node.js
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 22.6.0 # Укажите нужную версию Node.js

      # 3. Установка зависимостей
      - name: Install dependencies
        run: npm ci

      # 4. Сборка проекта
      - name: Build project
        run: CI=false npm run build

      # 5. Подготовка всех файлов и папок для деплоя
      - name: Prepare files for deployment
        # при обновлении всех фаилов закоментировать
        run: |
          mkdir deployment
          cp -r build/* deployment/

      # 6. Деплой содержимого папки build
      - name: Deploy to remote server
        uses: burnett01/rsync-deployments@7.0.1
        with:
          # с посошью --exclude=  помечаем фаилы которые не нужно удалять
          switches: -avzr --delete --exclude='amo/' --exclude='vendor/' --exclude='composer.json' --exclude='composer.lock' --exclude='.htaccess'
          # switches: -avzr --delete
          path: deployment/ # Передаём всё из одной папки

          remote_host: ${{ secrets.REMOTE_HOST }}
          remote_user: ${{ secrets.REMOTE_USER }}
          remote_key: ${{ secrets.REMOTE_KEY }}
          # remote_path: ${{ secrets.REMOTE_PATH_TEST }} #тестовый
          remote_path: ${{ secrets.REMOTE_PATH }} #основной

<!-- ==================================== -->

# Подрпобное описание

name: Build and Deploy

# Запуск workflow при push на ветку main

on:
push:
branches: - main # Указываем ветку, для которой срабатывает workflow
jobs:
build-and-deploy: # Указываем операционную систему для выполнения действий
runs-on: ubuntu-latest

# если в проекте есть скрытые ключи в .env их тоже нужнодобавить в action secret

     env:
      REACT_APP_BASE_URL: ${{ secrets.REACT_APP_BASE_URL }}
      REACT_APP_CONSUMER_KEY: ${{ secrets.REACT_APP_CONSUMER_KEY }}
      REACT_APP_CONSUMER_SECRET_KEY: ${{ secrets.REACT_APP_CONSUMER_SECRET_KEY }}

steps:

# 1. Клонирование репозитория

# Этот шаг использует action `actions/checkout`, чтобы загрузить весь код репозитория

# на машину, где выполняется workflow.

      - uses: actions/checkout@v4

# 2. Установка Node.js

# Используем action `actions/setup-node`, чтобы установить Node.js.

# Задаём нужную версию Node.js через параметр `node-version`.

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 22.6.0  # Версия Node.js для проекта

# 3. Установка зависимостей

# Выполняется команда `npm ci`, которая устанавливает зависимости,

# указанные в файле package-lock.json или yarn.lock.

# Используется для обеспечения воспроизводимой среды.

      - name: Install dependencies
        run: npm ci

# 4. Сборка проекта

# Выполняется команда `npm run build`, которая запускает процесс сборки проекта.

# Флаг `CI=false` отключает прерывание сборки из-за предупреждений линтера.

      - name: Build project
        run: CI=false npm run build

# 5. Подготовка файлов для деплоя

# Создаём новую папку `deployment` и копируем содержимое папки `build`

# в эту папку. Это делается для удобства деплоя, чтобы не перезаписывать другие файлы.

      - name: Prepare files for deployment
        run: |
          mkdir deployment  # Создаём папку deployment
          cp -r build/* deployment/  # Копируем содержимое build в папку deployment

# если нужно обновить все фаилы разкоментировать

# run: |

# mkdir deployment

# cp -r build/\* deployment/

# cp -r amo deployment/

# cp -r vendor deployment/

# cp composer.json deployment/

# cp composer.lock deployment/

# cp .htaccess deployment/

# 6. Деплой содержимого только папки build

# Используем action `burnett01/rsync-deployments`, чтобы передать файлы

# на удалённый сервер через rsync. Здесь важно:

# - `--delete` удаляет файлы на удалённой стороне, которые отсутствуют локально.

# - `--exclude` исключает указанные файлы и папки от удаления.

# - еслю нужно перезаписывать полностью всё оставить `-avzr --delete`.

      - name: Deploy to remote server
        uses: burnett01/rsync-deployments@7.0.1
        with:
          switches: -avzr --delete --exclude='amo/' --exclude='vendor/' --exclude='composer.json' --exclude='composer.lock' --exclude='.htaccess'
          path: deployment/  # Указываем папку, содержимое которой будет передано
          remote_host: ${{ secrets.REMOTE_HOST }}  # Адрес удалённого сервера (секретное значение)
          remote_user: ${{ secrets.REMOTE_USER }}  # Пользователь для подключения к серверу (секретное значение)
          remote_key: ${{ secrets.REMOTE_KEY }}    # SSH-ключ для подключения к серверу (секретное значение)
          remote_path: ${{ secrets.REMOTE_PATH }} # Путь на сервере, куда загружаются файлы

3. Создать пару SSH ключей
   3.0 создаnm каталог %userprofile%\.ssh командой: => mkdir %userprofile%\.ssh
   3.1 открыть консоль в проекте и прописать туда строку (Перейдите в каталог .ssh:): => cd %userprofile%\.ssh
   3.2 Сгенерируйте пару ключей после -f указать полный путь к папке,
   в конце пути название фаила: => ssh-keygen -t rsa -b 2048 -f /d/work/trimbg/%userprofile%\.ssh/id_rsa
   ssh-keygen -t rsa -b 4096 -m PEM -f /d/work/trimbg/%userprofile%\.ssh/id_rsa
   потом просто нажать 2 раза enter
4. Выведите содержимое публичного ключа в терминал: => cat ~.ssh/id_rsa.pub
5. Скопируйте выведенное содержимое публичного ключа и добавьте ключ в учётной записи клиента.
   Переходим SSH-доступ -> добавить -> добаить ключь -> пишем название любое и вставляем публичный ключь из терминала -> добавить -> привязать
   СТРАНИЦУ НЕ ЗАКРЫВАТЬ ПРИГОДИТСЯ
6. Выведим содержимое приватного ключа в терминал: => cat /d/work/trimbg/%userprofile%\.ssh/id_rsa_github_rsa
   копируем всё между етих строк и ети строки тоже
   -----BEGIN OPENSSH PRIVATE KEY-----
   ...
   -----END OPENSSH PRIVATE KEY-----
7. Теперь идём в git переходим репозиторий с проектом дальше -> Settings -> Secrets and variables -> actions -> New repository secret
   и создаём "секреты" название секрета согласно костантам в фаиле yml

REMOTE_HOST # Адрес хостинга => на странице SSH-доступ (Хост: og316697.ftp.tools)
REMOTE_USER # Пользователь для подключения к серверу (id хостинга)=> на странице SSH-доступ (Логин: og316697)
REMOTE_KEY # SSH-ключ для подключения к серверу => вставляем скопированый приватный ключь из терминала
REMOTE_PATH # Путь берём из: мои сайты -> фаил-менеджер (домена) -> переходим в папку сожержащюю сайт из папки билд
и копируем путь которй напротив названия хостинга /home/og316697/evacar.vn.ua/(test или www)
REACT_APP_BASE_URL => Значение берём из .env если используем
REACT_APP_CONSUMER_KEY => Значение берём из .env если используем
REACT_APP_CONSUMER_SECRET_KEY => Значение берём из .env если используем

8. Далее делаем комит и ждём
