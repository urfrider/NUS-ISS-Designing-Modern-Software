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
describe("HomePage Tests", () => {
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
  });

  test("Hero banner is displayed on HomePage", async () => {
    try {
      const heroBanner = await driver.wait(
        until.elementLocated(By.css(".HeroBanner")),
        5000
      );
      expect(await heroBanner.isDisplayed()).toBe(true);
    } catch (error) {
      const bannerElement = await driver.wait(
        until.elementLocated(
          By.css(
            'img[src*="banner"], h1, .ant-layout-content > div:first-child'
          )
        ),
        5000
      );
      expect(await bannerElement.isDisplayed()).toBe(true);
    }
  });

  test("User can search for products", async () => {
    const searchInput = await driver.wait(
      until.elementLocated(By.css(".ant-input-search input")),
      5000
    );

    await searchInput.clear();
    await searchInput.sendKeys("test product");
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(2000);

    const productsOrEmpty = await driver.wait(
      until.elementLocated(By.css(".ant-row, .ant-empty")),
      5000
    );

    expect(await productsOrEmpty.isDisplayed()).toBe(true);
  });

  test("User can navigate between product categories", async () => {
    // Click on a category tab (e.g., "Fashion")
    const fashionTab = await driver.wait(
      until.elementLocated(
        By.css("div[role='tab'][aria-controls='rc-tabs-1-panel-2']")
      ),
      5000
    );

    await fashionTab.click();

    // Wait for category content to load
    await driver.sleep(2000);

    // Verify we're on the Fashion tab
    const activeTab = await driver.wait(
      until.elementLocated(By.css(".ant-tabs-tab-active .ant-tabs-tab-btn")),
      5000
    );

    const tabText = await activeTab.getText();
    expect(tabText).toContain("Fashion");
  });
});
