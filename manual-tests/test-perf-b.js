const puppeteer = require('puppeteer');
const { setDefaultOptions } = require('expect-puppeteer');
const { writeFileSync } = require('fs');
const festivals = require('../2019.json');

setDefaultOptions({ timeout: 3000 });

// https://michaljanaszek.com/blog/test-website-performance-with-puppeteer
const extractDataFromPerformanceTiming = (timing, ...dataNames) => {
    const navigationStart = timing.navigationStart;

    const extractedData = {};
    dataNames.forEach(name => {
        extractedData[name] = timing[name] - navigationStart;
    });

    return extractedData;
};

const test = async (idx) => {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    // await page.goto('https://seoul-festival-git-dev.abcdefg.now.sh/p/${idx}');
    await page.goto(`http://localhost:3000/p/${idx}`);

    await page.waitFor('.info');    

    // const metrics = JSON.stringify(await page.metrics(), null, 2);
    const performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    const timing = extractDataFromPerformanceTiming(
        performanceTiming,
        'responseEnd',
        'domInteractive',
        'domContentLoadedEventEnd',
        'loadEventEnd'
    );
    const metrics = JSON.stringify(timing, null, 2);
    writeFileSync(__dirname + `/logs/bb/${idx}.json`, metrics);

    await context.close();
}

const setupBrowser = async () => {
    browser = await puppeteer.launch();
};

(async () => {
    let browser;
    await setupBrowser();
    for (let idx = 0; idx < festivals.length; idx++) {
        await test(idx);
    }
    await browser.close();
})();
