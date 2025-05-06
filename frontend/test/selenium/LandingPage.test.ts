import {
  jest,
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  test,
  expect,
} from "@jest/globals";
import { Builder, By, until, Key } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

jest.setTimeout(30000);
describe("Landing Page Tests", () => {
  let driver: any;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options())
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    await driver.get("http://localhost:5173");
    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Username"]')),
      5000
    );
  });

  test("User can log in successfully", async () => {
    const usernameInput = await driver.wait(
      until.elementLocated(By.css('input[placeholder="Username"]')),
      5000
    );
    await usernameInput.sendKeys("Coolbuyer123");

    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[placeholder="Password"]')),
      5000
    );
    await passwordInput.sendKeys("abc123");

    const loginButton = await driver.wait(
      until.elementLocated(By.css('button[type="submit"]')),
      5000
    );
    await loginButton.click();

    await driver.wait(until.urlContains("/home"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/home");
  });

  test("User can navigate to registration form", async () => {
    const registerLink = await driver.wait(
      until.elementLocated(By.linkText("Register here")),
      5000
    );
    await registerLink.click();

    const formTitle = await driver.wait(
      until.elementLocated(
        By.xpath("//h3[contains(text(), 'Create an Account')]")
      ),
      5000
    );

    const titleText = await formTitle.getText();
    expect(titleText).toBe("Create an Account");

    const confirmPasswordField = await driver.findElement(
      By.css('input[placeholder="Confirm Password"]')
    );
    expect(await confirmPasswordField.isDisplayed()).toBe(true);
  });

  test("User can register as a buyer", async () => {
    const uniqueBuyer = `buyer_${Date.now()}`;

    const registerLink = await driver.wait(
      until.elementLocated(By.linkText("Register here")),
      5000
    );
    await registerLink.click();

    const buyerRadio = await driver.wait(
      until.elementLocated(By.css('[data-testid="buyer-radio"]')),
      5000
    );
    await buyerRadio.click();

    const usernameInput = await driver.findElement(
      By.css('input[placeholder="Username"]')
    );
    await usernameInput.sendKeys(uniqueBuyer);

    const passwordInput = await driver.findElement(
      By.css('input[placeholder="Password"]')
    );
    await passwordInput.sendKeys("Password123!");

    const confirmPasswordInput = await driver.findElement(
      By.css('input[placeholder="Confirm Password"]')
    );
    await confirmPasswordInput.sendKeys("Password123!");

    const addressInput = await driver.findElement(
      By.css('input[placeholder="Address"]')
    );
    await addressInput.sendKeys("123 Market Street");

    const registerButton = await driver.wait(
      until.elementLocated(By.css('[data-testid="register-button"]')),
      5000
    );
    await registerButton.click();

    await driver.wait(until.urlContains("/home"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/home");
  });

  test("User can register as a seller", async () => {
    const uniqueSeller = `seller_${Date.now()}`;

    const registerLink = await driver.wait(
      until.elementLocated(By.linkText("Register here")),
      5000
    );
    await registerLink.click();

    const sellerRadio = await driver.wait(
      until.elementLocated(By.css('[data-testid="seller-radio"]')),
      5000
    );
    await sellerRadio.click();

    const usernameInput = await driver.findElement(
      By.css('input[placeholder="Username"]')
    );
    await usernameInput.sendKeys(uniqueSeller);

    const passwordInput = await driver.findElement(
      By.css('input[placeholder="Password"]')
    );
    await passwordInput.sendKeys("Password456!");

    const confirmPasswordInput = await driver.findElement(
      By.css('input[placeholder="Confirm Password"]')
    );
    await confirmPasswordInput.sendKeys("Password456!");

    const uenInput = await driver.findElement(
      By.css('input[placeholder="UEN"]')
    );
    expect(await uenInput.isDisplayed()).toBe(true);
    await uenInput.sendKeys("S1234567A");

    const registerButton = await driver.wait(
      until.elementLocated(By.css('[data-testid="register-button"]')),
      5000
    );
    await registerButton.click();

    await driver.wait(until.urlContains("/home"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/home");
  });

  test("User sees validation errors with empty form submission", async () => {
    // Try to submit the login form without entering any data
    const loginButton = await driver.findElement(
      By.css('button[type="submit"]')
    );
    await loginButton.click();

    // Check for validation error messages
    const usernameError = await driver.wait(
      until.elementLocated(
        By.xpath("//div[contains(@class, 'ant-form-item-explain-error')]")
      ),
      5000
    );

    // expect(await usernameError.isDisplayed()).toBe(true);
  });

  test("User can navigate back to login from registration", async () => {
    // Navigate to registration form
    const registerLink = await driver.wait(
      until.elementLocated(By.linkText("Register here")),
      5000
    );
    await registerLink.click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h3[contains(text(), 'Create an Account')]")
      ),
      5000
    );

    const loginLink = await driver.findElement(By.linkText("Login here"));
    await loginLink.click();

    const welcomeTitle = await driver.wait(
      until.elementLocated(By.xpath("//h3[contains(text(), 'Welcome Back!')]")),
      5000
    );

    expect(await welcomeTitle.isDisplayed()).toBe(true);
  });
});
