
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const url = 'https://parade.com/968666/parade/chuck-norris-jokes/';

async function fetchData() {
  // const executablePath = await new Promise(resolve => locateChrome((arg) => resolve(arg))) || '';

  const browser = await puppeteer.launch({
    headless: true,
    // executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitForSelector('ol');

    // extract <li> elements within the <ol>
    const jokes = await page.evaluate(() => {
      const ol = document.querySelector('ol');
      const listElements = Array.from(ol.querySelectorAll('li'));
      const listData = listElements.map((li, index) => `${index+1}. ${li.innerText}`);
      return listData;
    });
      console.log(jokes);
      return jokes;
    } catch (error) {
      console.error(error);
    } finally {
      await browser.close();
    }
  }

 export default fetchData;