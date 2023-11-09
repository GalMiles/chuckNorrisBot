import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import scrapeJokes from './scraper.js';
import {translateText, convertLanguageNameToCode} from './translator.js';

const imageURL = 'https://phantom-marca.unidadeditorial.es/d3b2f6b3f58a422ed456ea28656c47cd/crop/0x0/1022x682/resize/720/f/webp/assets/multimedia/imagenes/2023/07/27/16904939599201.jpg'

const bot = new Telegraf('6640764071:AAHh1-TO84Eg3peRFRNeL1SzuWOqNeN4PSs');

// session middleware for seperate session each run
const session = new LocalSession({
  database: 'example_db.json', 
  storage: LocalSession.storageFileAsync, 
  format: {
    serialize: (obj) => JSON.stringify(obj),
    deserialize: (str) => JSON.parse(str),
  },
});

bot.use(session.middleware());

let jokes;
let language='';

//start command
bot.command('start', async (ctx) =>  {
    jokes = await scrapeJokes();
    // console.log('jokes: ', jokes);
    if(jokes != null) {
      ctx.replyWithPhoto(imageURL, {caption: 'Welcome to the Chuck Norris\' Jokes Bot!\n- Set your language by typing "set language <your_language>".\n- Set a number between 1-101 to get a joke.\n- To exit, type click "/exit"'});
      } else {
        ctx.reply('Sorry, no jokes available.');
    }
}
);

//returning no problem 
bot.hears(/set language (\w+)/i, async (ctx) => {
  let langFromText = ctx.message.text.split(' ')[2];
  langFromText = convertLanguageNameToCode(langFromText);
  language = langFromText;

  //checking if user send not valid language
  if(language == '') {
    ctx.reply('Sorry, language not found.');
  } else {
    const translationData = await translateText('no problem', language)
    ctx.reply(translationData);
  }})

// get joke number
bot.hears(/\d+/, async (ctx) => {
  const index = parseInt(ctx.message.text);

  if(language != '') {
    if (index >= 1 && index <= jokes.length) {
        let joke = jokes[index - 1];
        const translationData = await translateText(joke, language);
        ctx.reply(translationData);
      } else {
        ctx.reply('Please enter a valid number between 1 and ' + jokes.length);
      }
  }
  else {
    ctx.reply('Please set your language first.');
  }
 
});

bot.command('exit', (ctx) => {
  ctx.reply('Bye!');
});

bot.on('text', (ctx) => {
  ctx.reply('Bot does not understand this command.');
});

bot.launch();
console.log('bot started');

//os calls to stop the bot
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));


