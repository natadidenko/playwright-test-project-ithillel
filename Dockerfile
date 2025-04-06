# Використовуємо офіційний образ Playwright
FROM mcr.microsoft.com/playwright:v1.39.0-jammy

# Встановлюємо робочу директорію
WORKDIR /usr/src/app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо всі файли репозиторію
COPY . .

# Вказуємо команду для запуску тестів
CMD ["npx", "playwright", "test"]
