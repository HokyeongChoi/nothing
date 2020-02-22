module.exports = {
    launch: {
      dumpio: false,
      headless: process.env.HEADLESS !== 'false',
    },
    browser: 'chromium',
    browserContext: 'default',
  }