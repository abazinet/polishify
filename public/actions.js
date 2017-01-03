class actions {}

actions.showConfig = () => {
  return { type: 'SHOW_CONFIG' };
};

actions.hideConfig = () => {
  return { type: 'HIDE_CONFIG' };
};

actions.cursorForward = () => {
  return { type: 'CURSOR_FORWARD' };
};

actions.cursorBackward = () => {
  return { type: 'CURSOR_BACKWARD' };
};

actions.updateGoogleTranslateApiKey = key => {
  return {
    type: 'UPDATE_GOOGLE_TRANSLATE_API_KEY',
    key
  };
};

const sampleLoaded = sample => {
  return {
    type: 'SAMPLE_LOADED',
    sample
  };
};

actions.loadSampleFrom = url => {
  const extractContent = html => {
    const div = document.createElement('div');
    div.innerHTML = html;

    const results = document.evaluate('//p', div, null, XPathResult.ANY_TYPE, null);

    let text = '';
    let item = results.iterateNext();
    while (item) {
      text = `${text}${item.textContent} `;
      item = results.iterateNext();
    }

    return text.split('');
  };
  
  const encodedUrl = encodeURIComponent(url);
  const yql = `https://query.yahooapis.com/v1/public/yql?q=select * from html where url="${encodedUrl}"&format=html`;

  return dispatch => {
    fetch(yql)
      .then(resp => resp.ok ? resp.text() : resp.statusText)
      .then(html => dispatch(sampleLoaded(extractContent(html))))
      .catch(console.warn);
  };
};

actions.loadDefaultSample = () => {
  return actions.loadSampleFrom('https://pl.wikipedia.org/wiki/Specjalna:Losowa_strona');
  //return actions.loadSampleFrom('http://literat.ug.edu.pl/~literat/hsnowel/003.htm');
};

const showTranslatedText = text => {
  return {
    type: 'SHOW_TRANSLATED_TEXT',
    text
  };
};

const hideTranslatedText = () => {
  return { type: 'HIDE_TRANSLATED_TEXT' };
};

actions.translate = (key, text) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${key}&source=pl&target=en&q=${encodeURIComponent(text)}`;
    return dispatch => {
      fetch(url)
        .then(resp => resp.ok ? resp.json() : resp.statusText)
        .then(json => dispatch(showTranslatedText(json.data.translations[0].translatedText)))
        .then(() => {
          setTimeout(() => {
            dispatch(hideTranslatedText())
          }, 5000)
        })
        .catch(console.warn);
    };
}

export default actions;