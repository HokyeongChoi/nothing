const puppeteer = require('puppeteer');
const { setDefaultOptions } = require('expect-puppeteer');
const { writeFileSync } = require('fs');
const festivals = require('../2019.json');

setDefaultOptions({ timeout: 3000 });

const path = process.argv[2] || 'aa';

const getTime = (date) => {
    if (date.length === 0) {
        return 0;
    }
    return date[date.length - 1].year * 400 + date[date.length - 1].month * 31 + date[date.length - 1].day;
}

// https://michaljanaszek.com/blog/test-website-performance-with-puppeteer
const extractDataFromPerformanceTiming = (timing, ...dataNames) => {
    const navigationStart = timing.navigationStart;

    const extractedData = {};
    dataNames.forEach(name => {
        extractedData[name] = timing[name] - navigationStart;
    });

    return extractedData;
};

const test = async (qid, qtime, idx) => {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    // await page.goto('https://seoul-festival-git-dev.abcdefg.now.sh/p/${qid}&${qtime}');
    await page.goto(`http://localhost:3000/p/${qid}&${qtime}`);

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
    writeFileSync(__dirname + `/logs/${path}/${idx}.json`, metrics);

    await context.close();
}

const setupBrowser = async () => {
    browser = await puppeteer.launch();
};

(async () => {
    let browser;
    await setupBrowser();
    let idx = 0;
    for (let festival of festivals) {
        const qid = festival.id;
        const qtime = getTime(festival.date);
        await test(qid, qtime, idx);
        idx++;
    }
    await browser.close();
})();
