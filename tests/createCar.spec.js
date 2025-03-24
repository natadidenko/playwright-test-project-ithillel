import { test, expect, request } from '@playwright/test';

let apiContext;
let authToken;

test.beforeAll(async () => {
    apiContext = await request.newContext();

    // 🔹 Виконуємо авторизацію
    const loginResponse = await apiContext.post('https://qauto.forstudy.space/api/auth/signin', {
        data: {
            email: 'email3@domain.com',
            password: 'Qa123456!',
            remember: false,
        },
    });

    expect(loginResponse.status()).toBe(200); // Переконуємося, що запит успішний

    const loginData = await loginResponse.json();
    authToken = loginData.token; // Зберігаємо отриманий токен

    console.log('✅ Авторизація пройдена. Отриманий токен:', authToken);
});

// ✅ **Позитивний тест: успішне створення машини**
test('✅ API: Успішне створення машини', async () => {
    const response = await apiContext.post('https://qauto.forstudy.space/api/cars', {
        headers: {
            'Authorization': `Bearer ${authToken}`, // Додаємо токен
        },
        data: {
            carBrandId: 1,
            carModelId: 5,
            mileage: 122,
        },
    });

    expect(response.status()).toBe(201); // Код 201 означає "створено"
    const responseBody = await response.json();
    console.log('🚗 Машина створена:', responseBody);
});

// ❌ **Негативний тест 1: створення машини без авторизації**
test('❌ API: Неможливо створити машину без авторизації', async () => {
    const unauthContext = await request.newContext();

    const response = await unauthContext.post('https://qauto.forstudy.space/api/cars', {
        data: {
            carBrandId: 2,
            carModelId: 8,
            mileage: 123,
        },
    });

    console.log(`📜 Статус відповіді: ${response.status()}`);
    console.log(`📜 Тіло відповіді:`, await response.json());

    expect(response.status()).toBe(401); // Очікуємо 401 (Unauthorized)

    await unauthContext.dispose(); // Очищаємо контекст
});

// ❌ **Негативний тест 2: створення машини з некоректними даними**
test('❌ API: Неможливо створити машину з некоректними даними', async () => {
    const response = await apiContext.post('https://qauto.forstudy.space/api/cars', {
        headers: {
            'Authorization': `Bearer ${authToken}`, // Додаємо токен
        },
        data: {
            carBrandId: 'wrong', // Некоректний ID
            carModelId: null,    // Некоректний ID
            mileage: -100,       // Від'ємний пробіг
        },
    });

    console.log(`⚠️ Статус відповіді: ${response.status()}`);
    console.log(`⚠️ Тіло відповіді:`, await response.json());

    expect(response.status()).toBe(400); // Очікуємо 400 Bad Request
    console.log('⚠️ Некоректні дані, машина не створена.');
});

test.afterAll(async () => {
    await apiContext.dispose();
    console.log('🛑 API контекст закрито.');
});
