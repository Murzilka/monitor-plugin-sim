# monitor-plugin-sim
monitor plugins subsystem simulator

Скрипт генерирует имя для именованного канала, запускает сервер на прослушивание порта 8087 и создаёт дочерний процесс.
В дочернем процессе загружается плагин, которому передаётся инициализированный объект KodeksApi.
Все запросы переадресуются в именованный канал.

# Usage
В папку arm поместить плагин. Запуск командой
    node app.js
