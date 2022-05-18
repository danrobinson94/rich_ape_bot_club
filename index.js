const puppeteer = require("puppeteer-extra");
const MetaCRX = "./nkbihfbeogaeaoehlefnkodbefgpgknn/10.12.3_0";
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const metamask = require("./pages/metamask");
const signInPage = require("./pages/signInPage");
const collectionPage = require("./pages/collectionPage");
const inputs = require("./inputs.json");
puppeteer.use(StealthPlugin());

class BrowserHandler {
  constructor() {
    const launch_browser = async () => {
      this.browser = false;
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
          "--enable-automation",
          `--disable-extensions-except=${MetaCRX}`,
          "--disable-dev-shm-usage",
          "--no-sandbox",
          "--disable-gpu",
          "--unlimited-storage",
          "--full-memory-crash-report",
          "--start-maximized",
        ],
      });
      this.browser.on("disconnected", async () => {
        await new BrowserHandler();
      });
    };

    (async () => {
      await launch_browser()
        .then(async () => {
          await metamask(this.browser, inputs);
          await signInPage(this.browser);
          await collectionPage(this.browser, inputs);
        })
        .catch(async (err) => {
          console.log("Timeout or other error: ", err);
          await this.browser.close();
          return;
        });
    })();
  }
}

const wait_for_browser = (browser_handler) =>
  new Promise((resolve, reject) => {
    const browser_check = setInterval(() => {
      if (browser_handler.browser !== false) {
        clearInterval(browser_check);
        resolve(true);
      }
    }, 100);
  });

const puppeteerLauncher = async () => {
  const browserHandler = await new BrowserHandler();
  await wait_for_browser(browserHandler);
};

puppeteerLauncher();
