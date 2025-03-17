import { test, expect } from '@playwright/test'; // імпортуємо Playwright test utilities
import { test as customTest } from '../src/utils/userGaragePage'; // імпортуємо кастомний test з фікстурою
import GaragePage from '../src/pages/GaragePage'; // Імпортуємо GaragePage

customTest.describe('Garage Page Tests', () => {
  customTest('Додавання машини до гаража', async ({ userGaragePage }) => {
    const garagePage = new GaragePage(userGaragePage); // Створюємо об'єкт для сторінки гаража

    // Відкриваємо сторінку гаража
    await garagePage.visit();
    
    // Перевіряємо, що ми на сторінці гаража
    await expect(userGaragePage).toHaveURL('https://qauto.forstudy.space/panel/garage');
    
    // Додаємо машину
    const carDetails = { brand: 'Audi', model: 'TT', mileage: '250' };
    await garagePage.addCar(carDetails);

    // Перевіряємо, що машина додалась у список
    await garagePage.verifyCarExists('Audi', 'TT');
  });
});
