const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

async function loginTest() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('http://localhost:3000/login'); // Replace with your login page URL
    await driver.wait(until.elementLocated(By.name('username')), 10000); // Wait for username field
    await driver.findElement(By.name('username')).sendKeys('Sammitha T'); // Replace 'admin' with your username
    await driver.findElement(By.name('password')).sendKeys('password'); // Replace 'password' with your password
    await driver.findElement(By.linkText('Login')).click(); // Use link text to find the link
    await driver.wait(until.urlIs('http://localhost:3000/account'), 10000); // Replace with your account page URL
  } finally {
    await driver.quit();
  }
}

// async function membersListTest() {
//   let driver = await new Builder().forBrowser('firefox').build();
//   try {
//     await driver.get('http://localhost:3000/members'); // Replace with your members page URL
//     await driver.wait(until.elementLocated(By.css('.members-list')), 10000); // Wait for members list to be located
//     let members = await driver.findElements(By.css('.member-item')); // Replace with your member item class
//     console.log(`Found ${members.length} members.`);
//   } finally {
//     await driver.quit();
//   }
// }

loginTest();
// membersListTest();
