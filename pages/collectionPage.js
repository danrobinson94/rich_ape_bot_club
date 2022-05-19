const listingPage = require("./listingPage");
const fs = require("fs");

module.exports = async (browser, inputs) => {
  const offersConfirmed = require("../../offersConfirmed.json");
  const page1 = await browser.newPage();
  await page1.goto(inputs[0]?.collectionUrl);
  await page1.setCacheEnabled(false);
  await page1.bringToFront();
  const [firstPage] = await browser.pages();
  await firstPage.close();

  await page1.setDefaultNavigationTimeout(60000);

  await page1.waitForXPath(
    "//*[@id='__next']/div/div[1]/nav/ul/div[2]/div/li/a/div/img",
    { visible: true, timeout: 10000 }
  );
  await page1.waitForXPath(
    `//a[contains(@href, 'assets/ethereum/${inputs[0].collectionWallet}')]`,
    { visible: true, timeout: 15000 }
  );

  let linksArray = [];
  const badData = await fs.readFileSync("pages/timesScrolled.json");
  const scrolledObject = JSON.parse(badData);
  const timesScrolled = Number(scrolledObject?.timesScrolled);
  await page1.waitForTimeout(200);
  if (timesScrolled > 3) {
    await page1.evaluate((timesScrolled) => {
      window.scrollBy(0, 800 * timesScrolled);
    }, timesScrolled);
    if (timesScrolled > 50) {
      for (let i = 0; i < timesScrolled - 10; i += 1) {
        await page1.evaluate(() => {
          window.scrollBy(0, 800);
        });
        await page1.waitForTimeout(200);
      }
    }
  }

  let offeredArray = offersConfirmed;
  const makeOffers = async () => {
    if (linksArray?.length > 0) {
      let pageCount = [];
      for (let i = 0; i < linksArray.length; i += 1) {
        pageCount = await browser.pages();
        if (pageCount.length > 1) {
          for (let y = 1; y < pageCount.length; y += 1) {
            await pageCount[y].close();
          }
        }
        await page1.waitForTimeout(250);
        await listingPage(browser, linksArray[i], inputs);
        // await listingPage(
        //   browser,
        //   "https://opensea.io/assets/0x60e4d786628fea6478f785a6d7e704777c86a7c6/21568"
        // );

        const offerObject = {
          link: linksArray[i],
          amount: inputs[0]?.offerAmount,
        };
        await offeredArray.push(offerObject);
        await page1.waitForTimeout(500);
        await fs.writeFile(
          "/Users/danrobinson/Documents/Projects/Archive/offersConfirmed.json",
          JSON.stringify(offeredArray, null, 2),
          function (err, result) {
            if (err) console.log("error", err);
          }
        );
        console.log("COLLECTION - OFFERED", offeredArray.length);

        pageCount = await browser.pages();
        if (pageCount.length > 1) {
          await page1.waitForTimeout(1000);
        }
      }
      await page1.waitForTimeout(500);
    }
    linksArray = [];
  };

  let getMoreCounter = Number(timesScrolled);

  const getMoreListings = async () => {
    let gotMore = false;
    const pageCount = await browser.pages();
    if (pageCount.length > 1) {
      for (let i = 1; i < pageCount.length; i += 1) {
        await pageCount[i].close();
      }
    }
    await page1.evaluate(() => {
      window.scrollBy(0, 800);
    });
    await page1.waitForTimeout(750);
    const listingsArray = await page1.$x(
      `//a[contains(@href, 'assets/ethereum/${inputs[0].collectionWallet}')]`,
      { visible: true, timeout: 10000 }
    );
    const data = await fs.readFileSync(
      "/Users/danrobinson/Documents/Projects/Archive/offersConfirmed.json"
    );
    const alreadyOffered = await JSON.parse(data);
    for (let i = 0; i < listingsArray.length; i += 1) {
      let link = await page1.evaluate(
        (anchor) => anchor.getAttribute("href"),
        listingsArray[i]
      );
      link = "https://opensea.io" + link;
      if (!alreadyOffered.includes(link) && !linksArray.includes(link)) {
        linksArray.push(link);
        gotMore = true;
      }
    }
    if ((gotMore = true)) {
      getMoreCounter += 1;
      await fs.writeFile(
        "pages/timesScrolled.json",
        `{"timesScrolled": "${JSON.stringify(getMoreCounter)}"}`,
        function (err, result) {
          if (err) console.log("error", err);
        }
      );
    }
    return;
  };
  const filterPill = inputs[0]?.filterPill;
  await page1.waitForXPath(`//span[text() = "${filterPill}"]`);
  const [kodaPill] = await page1.$x(`//span[text() = "${filterPill}"]`, {
    visible: true,
    timeout: 10000,
  });
  for (let i = 0; i < 10000; i += 1) {
    if (kodaPill) {
      if (linksArray.length < 5) {
        console.log("COLLECTION - GETTING LISTINGS");
        await page1.waitForTimeout(1000);
        await getMoreListings();
      } else {
        console.log("COLLECTION - MAKING OFFERS");
        await page1.waitForTimeout(1000);
        await makeOffers();
      }
    }
    console.log("ENDING FOR LOOP");
  }

  console.log("WHY AM I OUTSIDE THE FOR LOOP");
};
