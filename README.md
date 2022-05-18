# rich_ape_bot_club

run yarn to get necessary packages, then enter "node index.js" in your terminal to run the bot.

add url of the project listings page and the price you want to offer in "inputs.json".
you can also add your 12 key and password there, or enter them manually.

to make bot run in background, go to "node_modules/puppeteer/.local-chromium/Info.plist".
there, add the following lines, without spaces in the html tags:

< key >LSBackgroundOnly</ key >
< string >True</ string >

below the first < dict > and right above the first < key >. they should take up lines 5 and 6.

the bot is designed to go to listings page, add from 5 - 16 listings to an array, then
make offers on all 5 - 16 in the array. then it will scroll down on the collections page,
and add any listings not in the offersConfirmed file to the array. it will repeatedly
scroll down until there are at least 5 listings in the array, but usually there will be
~10 depending on screen size. make offers on those, repeat.

if you want to enter your 12 key manually, go to "pages/metamask.js" and comment out
lines 50 through 64, and un-comment line 48. this will give you forty seconds to enter
12 key and passwords manually before the bot continues automatically. after entering
the keys manually do not do do anything further, just wait. the bot will select the checkbox
and connect for you after the time is up.

the bot double checks the amount entered and offer expiration before clicking "make offer".
offer expiration is set to 30 minutes.

has ~95% success rate, some of the listings added to "pages/offersConfirmed.json" won't
actually have offers made.

the bot adds url's to the "pages/offersConfirmed.json" file as offers are made, so that if
the bot crashes it has a restart point and will not make duplicate offers. you can delete
everything in this file except for the square brackets if you want the bot to start over
and make offers on every listing.

at the bottom of "pages/collectionPage.js", the bot is set to repeat the process 100,000
times. However, the bot usually crashes and restarts every ten minutes or so, so it will
likely never hit that. it should go on indefinitely until you stop it or it hits a bug
that hasn't been addressed. or you can set a lower number to try and make it stop earlier.
