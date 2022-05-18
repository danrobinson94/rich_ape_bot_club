module.exports = async (browser, inputs) => {
  const metaPage = await browser.newPage();
  await metaPage.setCacheEnabled(false);
  await metaPage.goto(
    "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome"
  );
  await metaPage.bringToFront();

  await metaPage.waitForXPath(
    "//*[@id='app-content']/div/div[2]/div/div/div/button",
    { visible: true, timeout: 5000 }
  );

  const [getStartedButton] = await metaPage.$x(
    "//*[@id='app-content']/div/div[2]/div/div/div/button"
  );

  if (getStartedButton) {
    await getStartedButton.click();
  }
  await metaPage.waitForXPath(
    "//*[@id='app-content']/div/div[2]/div/div/div[2]/div/div[2]/div[1]/button"
  );
  const [importButton] = await metaPage.$x(
    "//*[@id='app-content']/div/div[2]/div/div/div[2]/div/div[2]/div[1]/button"
  );
  if (importButton) {
    await importButton.click();
  }
  await metaPage.waitForXPath(
    "//*[@id='app-content']/div/div[2]/div/div/div/div[5]/div[1]/footer/button[2]"
  );
  const [agreeButton] = await metaPage.$x(
    "//*[@id='app-content']/div/div[2]/div/div/div/div[5]/div[1]/footer/button[2]"
  );
  if (agreeButton) {
    await agreeButton.click();
  }

  await metaPage.waitForSelector("#import-srp__srp-word-0");

  await metaPage.$eval("#create-new-vault__terms-checkbox", (form) =>
    form.click()
  );

  // await metaPage.waitForTimeout(45000);

  await metaPage.type("#import-srp__srp-word-0", inputs[0]?.first);
  await metaPage.type("#import-srp__srp-word-1", inputs[0]?.second);
  await metaPage.type("#import-srp__srp-word-2", inputs[0]?.third);
  await metaPage.type("#import-srp__srp-word-3", inputs[0]?.fourth);
  await metaPage.type("#import-srp__srp-word-4", inputs[0]?.fifth);
  await metaPage.type("#import-srp__srp-word-5", inputs[0]?.sixth);
  await metaPage.type("#import-srp__srp-word-6", inputs[0]?.seventh);
  await metaPage.type("#import-srp__srp-word-7", inputs[0]?.eighth);
  await metaPage.type("#import-srp__srp-word-8", inputs[0]?.ninth);
  await metaPage.type("#import-srp__srp-word-9", inputs[0]?.tenth);
  await metaPage.type("#import-srp__srp-word-10", inputs[0]?.eleventh);
  await metaPage.type("#import-srp__srp-word-11", inputs[0]?.twelfth);

  await metaPage.type("#password", "DanPhamSlam1!");
  await metaPage.type("#confirm-password", "DanPhamSlam1!");

  await metaPage.waitForXPath(
    "//*[@id='app-content']/div/div[2]/div/div/div[2]/form/button"
  );

  const [submitButt] = await metaPage.$x(
    "//*[@id='app-content']/div/div[2]/div/div/div[2]/form/button"
  );
  if (submitButt) {
    await submitButt.click();
  }

  await metaPage.waitForXPath(
    "//*[@id='app-content']/div/div[2]/div/div/button",
    {
      visible: true,
      timeout: 10000,
    }
  );
  const [doneButt] = await metaPage.$x(
    "//*[@id='app-content']/div/div[2]/div/div/button",
    {
      visible: true,
      timeout: 10000,
    }
  );
  if (doneButt) {
    await doneButt.click();
  }

  await metaPage.waitForXPath(
    "//*[@id='popover-content']/div/div/section/header/div/button"
  );
  const [xButt] = await metaPage.$x(
    "//*[@id='popover-content']/div/div/section/header/div/button"
  );
  if (xButt) {
    await xButt.click();
  }
  await metaPage.close();
  const [firstPage] = await browser.pages();
  await firstPage.close();
};
