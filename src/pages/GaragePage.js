import { expect } from '@playwright/test';  // Додаємо імпорт expect

class GaragePage {
    constructor(page) {
      this.page = page;
    }
  
    // Відкриваємо сторінку гаража
    async visit() {
      await this.page.goto('https://qauto.forstudy.space/panel/garage');
    }
  
    // Додаємо машину
    async addCar(carDetails) {
      await this.page.locator('button:has-text("Add car")').click();
      await this.page.locator('app-add-car-form').waitFor({ state: 'visible' });
  
      await this.page.locator('select[name="carBrandId"]').selectOption({ label: carDetails.brand });
      await this.page.locator('select[name="carModelId"]').selectOption({ label: carDetails.model });
      await this.page.locator('input[name="mileage"]').fill(carDetails.mileage);
  
      // Клікаємо кнопку додавання машини
      await this.page.locator('.modal-footer > .btn-primary').click();
    }
  
    // Перевіряємо, чи машина з'явилася на сторінці
    async verifyCarExists(brand, model) {
        await expect(this.page.locator(`p.car_name:has-text("${brand} ${model}")`).first()).toBeVisible();
      }      
  }
  
  export default GaragePage;
  