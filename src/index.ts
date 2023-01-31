import { Page } from "puppeteer";

const puppeteer = require("puppeteer");

const url = "https://monkeytype.com/"

const selectors = {
  privacyPolicy: "#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-47sehv",
  cookieAccept: "#cookiePopup > div.main > div.buttons > div.button.active.acceptAll",
  letters: "#words > div.word.active > letter"
}

const scrape = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const pages = await browser.pages();
    const page = pages[0];
    await page.setViewport({
      width: 1366,
      height: 768,
    });
    await page.goto(url);

    // confirm privacy policy and cookies
    await page.waitForSelector(selectors.cookieAccept);
    await page.click(selectors.cookieAccept, { delay: 1000 });
    await page.waitForSelector(selectors.privacyPolicy);
    await page.click(selectors.privacyPolicy, { delay: 1000 });

    await page.mouse.click(100, 100);
    // start typing for 30 seconds
    let startTime = new Date().getTime();
    while (new Date().getTime() - startTime < 30000) {
      await typeWord(page);
      await page.waitForTimeout(Math.floor(Math.random() * 50) + 50);
    }

    // screenshot the results
    // await page.screenshot({ path: `${__dirname}/./screenshots/result-${new Date().toJSON()}.png` });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

const typeWord = async (page: Page) => {
  const letters = await page.$$eval(selectors.letters, (letters) => letters.map((letter) => letter.textContent));
  console.log(letters);
  for (const letter of letters) {
    if (letter) {
      page.keyboard.type(letter);
    }
  }
  page.keyboard.press("Space");
}

scrape();