const webdriver = require('selenium-webdriver')

const branch    = process.env.TRAVIS_BRANCH
const username  = process.env.SAUCE_USER_NAME
const accessKey = process.env.SAUCE_ACCESS_KEY

const driver = new webdriver.Builder()
  .withCapabilities({
      'browserName': 'chrome',
      'platform': 'Windows 10',
      'version': '55.0',
      'username': username,
      'accessKey': accessKey
  })
  .usingServer(`https://${username}:${accessKey}@ondemand.saucelabs.com/wd/hub`)
  .build()

let url = `http://${branch}.preview.kitnic.it/`
if (branch === 'master') {
    url = 'https://kitnic.it'
}

driver.get(url);

driver.getTitle().then(function (title) {
    console.log("title is: " + title);
});

driver.quit();
