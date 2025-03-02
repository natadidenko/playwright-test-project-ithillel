export async function setupTestPage(page, browserName) {
    // Налаштування заголовків авторизації для всіх браузерів
    await page.setExtraHTTPHeaders({
      'Authorization': 'Basic ' + Buffer.from('guest:welcome2qauto').toString('base64')
    });
  
    try {
      // Перехід на сторінку
      await page.goto('https://qauto.forstudy.space/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('networkidle');
    } catch (error) {
      console.error("❌ Error during page load: ", error);
    }
  
    // Перевірка наявності кнопки реєстрації
    await page.waitForSelector('button:has-text("Sign up")', { state: 'visible', timeout: 15000 });
    await page.click('button:has-text("Sign up")', { force: true });
  }
  