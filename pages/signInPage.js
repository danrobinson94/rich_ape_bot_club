module.exports = async (browser) => {
  const signInPage = await browser.newPage();
  await signInPage.setCacheEnabled(false);
  await signInPage.goto("https://opensea.io/login?referrer=%2Faccount");
  await signInPage.bringToFront();
  await signInPage.waitForXPath(
    "//*[@id='main']/div/div/div/div[2]/ul/li[1]/button"
  );
  const [maskButton] = await signInPage.$x(
    "//*[@id='main']/div/div/div/div[2]/ul/li[1]/button"
  );

  await signInPage.waitForXPath("//span[text()='MetaMask']", {
    visible: true,
    timeout: 5000,
  });

  const [realMaskButton] = await signInPage.$x("//span[text()='MetaMask']", {
    visible: true,
    timeout: 5000,
  });

  let extensionPage;
  let notSignedIn = true;
  await browser.on("targetcreated", async () => {
    if (notSignedIn === true) {
      const foundPage = await changePage(
        "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html"
      );
      if (foundPage) {
        //Run some basic tests on the new page

        await extensionPage.waitForXPath(
          "//*[@id='app-content']/div/div[2]/div/div[2]/div[3]/div[2]/button[2]"
        );
        const [nextButton] = await extensionPage.$x(
          "//*[@id='app-content']/div/div[2]/div/div[2]/div[3]/div[2]/button[2]"
        );

        if (nextButton) {
          await nextButton.click();
        }
        await extensionPage.waitForXPath(
          "//*[@id='app-content']/div/div[2]/div/div[2]/div[2]/div[2]/footer/button[2]"
        );
        const [connectButton] = await extensionPage.$x(
          "//*[@id='app-content']/div/div[2]/div/div[2]/div[2]/div[2]/footer/button[2]"
        );
        if (connectButton) {
          await connectButton.click();
          await extensionPage.close();
          notSignedIn = false;
        }
        return;
      }
    }
  });
  const changePage = async (url) => {
    let pages = await browser.pages();
    let foundPage = false;
    for (let i = 0; i < pages.length; i += 1) {
      if (pages[i].url() === url) {
        foundPage = true;
        extensionPage = pages[i];
        await extensionPage.bringToFront(); //set the new working page as the popup
        break;
      }
    }
    return foundPage;
  };

  //Opens the new popup window by clicking a button
  if (realMaskButton) {
    await realMaskButton.click();
  }
  await signInPage.close();

  return;
};
