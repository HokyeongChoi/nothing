const { setDefaultOptions } = require("expect-puppeteer");
const devices = require("puppeteer/DeviceDescriptors");

jest.setTimeout(300000);
setDefaultOptions({ timeout: 3000 });

const between = (l, r) => Math.floor(Math.random() * (r - l)) + l;
let c0, c1, c2;
c0 = between(0, devices.length);
if (c0 !== 0 && c0 !== devices.length - 1) {
  c1 = between(0, c0);
  c2 = between(c0 + 1, devices.length);
} else if (c0 === 0) {
  c1 = between(1, devices.length);
  c2 = c1 === 1 ? between(2, devices.length) : between(1, c1);
} else {
  c1 = between(0, c0);
  c2 = c1 === 0 ? between(1, c0) : between(0, c1);
}
const indices = [c0, c1, c2];
indices.sort((a, b) => a - b);

const devices3 = [];
for (let idx of indices) {
  device = devices[idx];
  devices3.push(device);
}

devices3.forEach(device => {
  describe(device.name, () => {
    beforeAll(async () => {
      console.log(new Date());
      console.log(device.name);
      await page.emulate(device);
      await page.goto("https://seoul-festival-git-dev.abcdefg.now.sh");
    });

    it("should", async () => {
      await expect(page).toClick("svg");
      await page.waitFor(".fest-list-a");
      let num = await page.$$eval(".fest-list-a", divs => divs.length);
      for (let i = 0; i < num; i++) {
        await page.evaluate(i => {
          document.querySelectorAll(".fest-list-a")[i].click();
        }, i);
        await page.waitFor(".info");
        await page.goBack();
        await expect(page).toClick("svg");
        await page.waitFor(".fest-list-a");
      }

      await page.evaluate(() => {
        document
          .querySelector(
            "body > div > div > div > div > div > div > div > label > span"
          )
          .click();
      });
      await page.waitForFunction(
        "document.querySelectorAll('.fest-list-a > div > span').length > 50"
      );
      num = await page.$$eval(".fest-list-a", divs => divs.length);
      for (let i = 0; i < num; i++) {
        await page.evaluate(i => {
          document.querySelectorAll(".fest-list-a")[i].click();
        }, i);
        await page.waitFor(".info");
        await page.goBack();
        await expect(page).toClick("svg");
        await page.waitFor(".fest-list-a");
        await page.evaluate(() => {
          document
            .querySelector(
              "body > div > div > div > div > div > div > div > label > span"
            )
            .click();
        });
        await page.waitForFunction(
          "document.querySelectorAll('.fest-list-a > div > span').length > 50"
        );
      }
    });
  });
});
