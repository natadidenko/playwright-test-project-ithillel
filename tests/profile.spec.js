import { test, expect } from '@playwright/test';

test('Mock user profile response', async ({ page }) => {
    // Логуємо всі запити та відповіді
    page.on('request', request => console.log(`➡️ [REQUEST] ${request.method()} ${request.url()}`));
    page.on('response', async response => {
        console.log(`✅ [RESPONSE] ${response.status()} ${response.url()}`);
        if (response.url().includes('/api/users/profile')) {
            console.log('🔎 [API RESPONSE] Отримали відповідь:', await response.json());
        }
    });

    // Відкриваємо головну сторінку
    await page.goto('https://qauto.forstudy.space/');

    // Натискаємо "Sign In"
    await page.click('button.header_signin');

    // Вводимо email та пароль
    await page.fill('#signinEmail', 'email3@domain.com');
    await page.fill('#signinPassword', 'Qa123456!');

    // Натискаємо "Login"
    await page.click('button.btn-primary:has-text("Login")');

    // Чекаємо редірект на сторінку гаража
    await page.waitForURL('https://qauto.forstudy.space/panel/garage');

    // Перехоплюємо API /api/users/profile перед натисканням "Profile"
    await page.route('**/api/users/profile', async route => {
        console.log('⚡ [MOCK] Перехоплено /api/users/profile');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: "ok",
                data: {
                    userId: 123,
                    photoFilename: "default-user.png",
                    name: "Nataliia",
                    lastName: "Doe",
                    country: "Ukraine",
                    dateBirth: "1995-05-15"
                }
            })
        });
    });

    // Натискаємо "Profile"
    const profileButton = page.locator('a.btn-sidebar.-profile');
    await expect(profileButton).toBeVisible();
    await profileButton.click();

    // Чекаємо редірект на сторінку профілю
    await page.waitForURL('https://qauto.forstudy.space/panel/profile');

    try {
        // Чекаємо відповідь API /api/users/profile з тайм-аутом 60 секунд
        const profileResponse = await page.waitForResponse(response =>
            response.url().includes('/api/users/profile') && response.status() === 200,
            { timeout: 60000 } // 60 секунд
        );
        console.log('✅ API profile response received:', await profileResponse.json());
    } catch (e) {
        console.error('Response not received in time', e);
    }

    // Перевіряємо, чи сторінка не закрита перед перезавантаженням
    if (page.isClosed()) {
        console.error('Сторінка закрита перед перезавантаженням!');
        return;
    }

    // Очікуємо кілька мілісекунд, щоб зміни з API відобразились
    await page.waitForTimeout(1000); // Додаємо невелику затримку

    // Перезавантажуємо сторінку для оновлення UI
    console.log('🔄 Перезавантажуємо сторінку для оновлення UI...');
    await page.goto('https://qauto.forstudy.space/panel/profile'); // Перехід до сторінки профілю замість reload
    await page.waitForLoadState('networkidle'); // Чекаємо, поки всі запити завершаться

    // Оновлюємо селектор для перевірки, що елемент дійсно існує
    const profileNameLocator = page.locator('.profile_name'); // Використовуємо новий клас для локатора

    // Очікуємо появу імені в профілі
    console.log('🔍 Очікуємо появу імені...');
    await profileNameLocator.waitFor({ state: 'visible', timeout: 400000 }); // Очікуємо, поки елемент стане видимим

    // Перевіряємо текст
    await expect(profileNameLocator).toHaveText('Nataliia Doe', { timeout: 400000 });

    console.log(`✅ [SUCCESS] Оновилося!`);
});
