const { chromium } = require("@playwright/test");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", (msg) => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on("pageerror", (err) => {
    console.error(`[BROWSER ERROR]`, err);
  });

  page.on("requestfailed", (req) => {
    console.error(`[BROWSER REQ FAIL] ${req.method()} ${req.url()} (${req.failure()?.errorText})`);
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      console.log(`[BROWSER RES ERROR] ${res.status()} ${res.url()}`);
    }
  });

  try {
    console.log("Navigating to login page...");
    await page.goto("http://localhost:3333/auth/sign-in", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000); // wait for hydration

    console.log("Filling credentials...");
    await page.fill('input[name="username"]', "owner");
    await page.fill('input[name="password"]', "owner123");

    console.log("Clicking submit...");
    await page.click('button[type="submit"]');

    console.log("Waiting for auth_token...");
    await page.waitForFunction(
      () => Boolean(window.localStorage.getItem("auth_token") || window.sessionStorage.getItem("auth_token")),
      null,
      { timeout: 10000 }
    );

    const token = await page.evaluate(() => window.localStorage.getItem("auth_token"));
    console.log("Success! Token:", token);
  } catch (err) {
    console.error("Test failed:", err.message);
  } finally {
    await browser.close();
  }
}

main();
