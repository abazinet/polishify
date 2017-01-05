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

actions.letterMatch = letter => {
  return {
    type: 'LETTER_MATCH',
    letter
  };
};

actions.say = (text, lang) => {
  return {
    type: 'SAY',
    text,
    lang
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

const sayTranslatedText = text => {
  return {
    type: 'SAY_TRANSLATED_TEXT',
    text
  };
};

const clearTranslatedText = () => {
  return { type: 'CLEAR_TRANSLATED_TEXT' };
};

actions.translate = (key, text) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${key}&source=pl&target=en&q=${encodeURIComponent(text)}`;
  
  return dispatch => {
    const delayHideTranslatedText = () => setTimeout(() => dispatch(hideTranslatedText()), 5000);
  
    fetch(url)
      .then(resp => resp.ok ? resp.json() : resp.statusText)
      .then(json => dispatch(sayTranslatedText(json.data.translations[0].translatedText)))
      .then(() => dispatch(clearTranslatedText()))
      .catch(console.warn);
  };
};

const keypress = event => {
  return {
    type: 'KEY_PRESS',
    key: event.key,
    code: event.code
  };
};

actions.listenToKeypress = () => {
  return dispatch => {
    window.addEventListener('keypress', keypress);
    return { cancel: () => window.removeEventListener('keypress', keypress) };
  };
};

function timerCursorBlink(dispatch, isCancelled) {
		if (!isCancelled()) {
  		dispatch({ type: 'CURSOR_BLINK' });
  		setTimeout(this.timerCursorBlink(dispatch), 700);
		}
}

actions.startCursorBlink = () => {
  let cancel = false;

  return dispatch => {
    timerCursorBlink(dispatch, () => cancel);
    return { cancel: () => cancel = true };
  }
};

export default actions;