const moment = require("moment-timezone");
module.exports = async (browser, link, inputs) => {
  const page2 = await browser.newPage();
  await page2.setCacheEnabled(false);
  await page2.goto(link);
  await page2.bringToFront();
  await page2.waitForTimeout(1200);

  await page2.waitForXPath("//i[text() = 'local_offer']", {
    visible: true,
    timeout: 12500,
  });

  const [makeOffer] = await page2.$x("//i[text() = 'local_offer']", {
    visible: true,
    timeout: 12500,
  });

  const bidButtons = await page2.$x("//button[contains(text(),'Place bid')]", {
    visible: true,
    timeout: 10000,
  });

  const correctType = inputs[0]?.propertyType;
  const correctValue = inputs[0]?.propertyValue;
  await page2.waitForXPath(
    `//div[contains(., "${correctType}") and @class="Property--type"]/../div[2]`
  );
  const [property] = await page2.$x(
    `//div[contains(., "${correctType}") and @class="Property--type"]/../div[2]`,
    { visible: true, timeout: 5000 }
  );
  let propertyValue;
  propertyValue = await page2.evaluate(
    (anchor) => anchor.textContent,
    property
  );

  if (bidButtons.length === 0 && propertyValue === correctValue) {
    let offerAmount = inputs[0]?.offerAmount;
    let timeAmount = "Custom date";

    if (makeOffer) {
      await makeOffer.click();
      await page2.waitForTimeout(1000);
      await page2.waitForSelector("input.Input--input", {
        visible: true,
        timeout: 12500,
      });
      await page2.type("input.Input--input", offerAmount, { delay: 25 });
      await page2.waitForTimeout(30);
      await page2.keyboard.press("Tab");
      await page2.waitForTimeout(10);
      await page2.keyboard.press("Tab");
      await page2.waitForTimeout(10);
      await page2.keyboard.press("Tab");
      await page2.waitForTimeout(10);
      await page2.keyboard.press("Tab");
      await page2.waitForTimeout(10);
      await page2.keyboard.press("Tab");
      await page2.waitForTimeout(10);
      await page2.keyboard.press("Tab");
      await page2.waitForTimeout(10);
      await page2.keyboard.press("Enter");
      await page2.waitForTimeout(100);
      await page2.waitForXPath(`//input[@value = '${offerAmount}']`);
      await page2.waitForXPath(`//input[@value = '${timeAmount}']`);
      const [amountFound] = await page2.$x(
        `//input[@value = '${offerAmount}']`
      );
      const [timeFound] = await page2.$x(`//input[@value = '${timeAmount}']`);
      const timeSet = await page2.evaluate(
        (timeHtml) => timeHtml.getAttribute("value"),
        timeFound
      );

      const amount = await page2.evaluate(
        (amountHtml) => amountHtml.getAttribute("value"),
        amountFound
      );

      const increaseExp = Number(inputs[0]?.increaseExp);
      let dateShown;
      let newDate;
      if (increaseExp > 0) {
        await page2.waitForXPath("//i[@value = 'calendar_today']", {
          visible: true,
          timeout: 5000,
        });
        const [calendarIcon] = await page2.$x(
          "//i[@value = 'calendar_today']",
          {
            visible: true,
            timeout: 5000,
          }
        );
        if (calendarIcon) {
          await calendarIcon.click();
        }
        await page2.waitForXPath("//i[@value = 'access_time']", {
          visible: true,
          timeout: 10000,
        });

        const originalDate = moment().tz("America/Denver");
        const date = originalDate.add(increaseExp, "h");
        await date.add(30, "m");
        newDate = date.format("MMM DD, YYYY h:mm A");
        const newDay = date.format("D");
        const [clockIcon] = await page2.$x("//i[@value = 'access_time']", {
          visible: true,
          timeout: 10000,
        });
        if (clockIcon) {
          await clockIcon.click();
        }
        for (let x = 0; x < increaseExp; x += 1) {
          await page2.waitForTimeout(10);
          await page2.keyboard.press("ArrowUp");
        }
        console.log("NEW DAY", newDay);
        await page2.waitForXPath(`//button[contains(., "${newDay}")]`, {
          visible: true,
          timeout: 5000,
        });
        const [dateToday] = await page2.$x(
          `//button[contains(., "${newDay}")]`,
          {
            visible: true,
            timeout: 5000,
          }
        );
        if (dateToday) {
          await dateToday.click();
        }
        await page2.waitForTimeout(10);
        await page2.keyboard.press("Enter");
        await page2.waitForXPath(
          "//i[@value = 'calendar_today']/../../div[2]",
          {
            visible: true,
            timeout: 5000,
          }
        );
        const [dateElement] = await page2.$x(
          "//i[@value = 'calendar_today']/../../div[2]",
          { visible: true, timeout: 5000 }
        );

        if (dateElement) {
          dateShown = await page2.evaluate(
            (anchor) => anchor.textContent,
            dateElement
          );
        }
      }
      let checkDates = false;
      if (increaseExp > 0) {
        checkDates = true;
      }
      if (
        checkDates === false ||
        (checkDates === true && newDate === dateShown)
      ) {
        if (timeSet === timeAmount && amount === offerAmount) {
          await page2.waitForXPath("//button[contains(., 'Make Offer')]", {
            visible: true,
            timeout: 10000,
          });
          const [makeOfferButt] = await page2.$x(
            "//button[contains(., 'Make Offer')]",
            {
              visible: true,
              timeout: 10000,
            }
          );
          try {
            if (makeOfferButt) {
              await makeOfferButt.click();
            }

            let extensionPage2 = false;
            try {
              let foundPage2 = false;
              for (let i = 0; i < 10; i += 1) {
                const pagesAmount = await browser.pages();
                if (pagesAmount.length < 3) {
                  await page2.waitForTimeout(750);
                } else {
                  if (
                    pagesAmount[2]?._target?._targetInfo?.url ===
                    "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html"
                  ) {
                    foundPage2 = true;
                    extensionPage2 = pagesAmount[2];
                  }
                  break;
                }
              }

              if (foundPage2 && extensionPage2) {
                await page2.waitForTimeout(100);
                await extensionPage2.waitForTimeout(1000);
                await extensionPage2.bringToFront(); //set the new working page as the popup
                await extensionPage2.waitForXPath(
                  "//*[@id='app-content']/div/div[2]/div/div[3]/div[1]",
                  {
                    visible: true,
                    timeout: 20000,
                  }
                );
                const [scrollButton] = await extensionPage2.$x(
                  "//*[@id='app-content']/div/div[2]/div/div[3]/div[1]",
                  {
                    visible: true,
                    timeout: 20000,
                  }
                );
                if (scrollButton) {
                  await scrollButton.click();
                }
                await extensionPage2.waitForXPath(
                  "//*[@id='app-content']/div/div[2]/div/div[4]/button[2]",
                  { visible: true, timeout: 5000 }
                );
                const [signButton] = await extensionPage2.$x(
                  "//*[@id='app-content']/div/div[2]/div/div[4]/button[2]"
                );
                if (signButton) {
                  await signButton.click();
                  signedListings = true;
                  await page2.waitForXPath(
                    "//div[contains(., 'Your offer was submitted successfully!')]",
                    { visible: true, timeout: 10000 }
                  );
                  const [offerConfirmation] = await page2.$x(
                    "//div[contains(., 'Your offer was submitted successfully!')]",
                    { visible: true, timeout: 10000 }
                  );
                  if (offerConfirmation) {
                    signedListing = true;
                    await page2.waitForTimeout(100);
                    await page2.close();
                  }
                }
                return;
              }
            } catch (e) {
              console.log("E", e);
            }
            await page2.waitForTimeout(10000);
          } catch (e) {
            console.log("E", e);
          }
        }
      }
    }
  } else {
    console.log("IN ELSE");
  }
};
