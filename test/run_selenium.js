const webdriver = require('selenium-webdriver')

const branch    = process.env.TRAVIS_BRANCH
const username  = process.env.SAUCE_USER_NAME
const accessKey = process.env.SAUCE_ACCESS_KEY

const chrome_versions = ['51', '52', '53', '54', '55', 'latest']


const osx_versions = ['Mac OS X 10.9', 'Mac OS X 10.10', 'Mac OS X 10.11']
const windows_versions =  ['Windows 10', 'Windows 8', 'Windows 8.1', 'Windows 7', 'Windows XP']

const platforms = osx_versions.concat(windows_versions)

const promises = platforms.map(platform => {
  return chrome_versions.map(version => {
    return new Promise((resolve, reject) => {
      const driver = new webdriver.Builder()
      .withCapabilities({
          browserName: 'chrome',
          platform,
          version,
          username,
          accessKey
      })
      .usingServer(`https://${username}:${accessKey}@ondemand.saucelabs.com/wd/hub`)
      .build()
      resolve(driver)
    }).then(driver => {
      let url = `http://${branch}.preview.kitnic.it/`
      if (branch === 'master') {
          url = 'https://kitnic.it'
      }

      driver.get(url)

      driver.getTitle().then(function (title) {
          console.log("title is: " + title)
      })

      driver.quit()
    })
  })
})

Promise.all(flatten(promises)).catch(err => {
    console.error(err)
    process.exit(1)
})

function flatten(a) {
  return [].concat.apply([], a)
}

