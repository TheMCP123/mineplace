# Mineplace Prototype

Статический прототип Mineplace для Cloudflare Pages.

## Что уже есть

- 2D canvas-карта 1024x1024
- блоки вместо пикселей
- Minecraft-like процедурные текстуры без чужих ассетов
- pan/zoom
- cooldown
- сохранение в localStorage
- экспорт/импорт карты JSON
- готово для деплоя на Cloudflare Pages

## Как запустить локально

Можно просто открыть `index.html`, но лучше через локальный сервер:

```bash
python -m http.server 5173
```

Потом открыть:

```text
http://localhost:5173
```

## Как залить на Cloudflare Pages

1. Создай GitHub репозиторий.
2. Загрузи эти файлы в корень репозитория.
3. Cloudflare Dashboard → Workers & Pages → Create → Pages.
4. Подключи GitHub repo.
5. Build command оставь пустым.
6. Output directory: `/`
7. Deploy.

Сайт будет доступен на `*.pages.dev`.

## Что будет следующим этапом

Заменить localStorage на backend API:

```text
POST /api/place-block
GET /api/chunks?chunk_x=0&chunk_y=0
```

И подключить:

- Supabase Auth
- Supabase Database
- Supabase Realtime

Или вариант полностью на Cloudflare:

- Pages Functions
- D1
- Durable Objects/WebSocket для realtime
