import axios from 'axios';
import iso6391 from 'iso-639-1';
import { v4 as uuidv4 } from 'uuid';

let key = "2fab777456e24883ac78af9aab2473f5";
let endpoint = "https://api.cognitive.microsofttranslator.com/"; //translation api endpoint
let location = "eastus";

// convert a language name to a language code
function convertLanguageNameToCode(languageName) {
  const languageCode = iso6391.getCode(languageName);
  return languageCode;
}

async function translateText(textToTranslate, language) {

  try {
    const response = await axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString(),
      },
      params: {
        'api-version': '3.0',
        from: 'en',
        to: [language],
      },
      data: [
        {
          'text': textToTranslate,
        },
      ],
      responseType: 'json',
    });

    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    throw error; 
  }
}

export {translateText, convertLanguageNameToCode};


 