import axios from 'axios';
import cheerio from 'cheerio';

const urlToScrape = 'https://www.hellaentertainment.com/blog/celebrities/80-chuck-norris-jokes-for-his-80th-birthday/';

async function scrapeJokes() {
  try {
    const response = await axios.get(urlToScrape);
    const html = response.data;

    const $ = cheerio.load(html);

    const jokesArray = [];

    $('ol:first-of-type li').each((index, element) => {
        let listElement = $(element).text().trim();
        jokesArray.push(`${index+1}. ${listElement}`);
      });

    return jokesArray;

  } catch (error) {
    console.error('Error scraping list items:', error);
    throw error;
  }
}

export default scrapeJokes;