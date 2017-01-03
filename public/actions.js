class actions {}

actions.cursorForward = () => {
  return { type: 'CURSOR_FORWARD' };
};

actions.cursorBackward = () => {
  return { type: 'CURSOR_BACKWARD' };
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
  //return actions.loadSampleFrom('https://pl.wikipedia.org/wiki/Specjalna:Losowa_strona');
  return actions.loadSampleFrom('http://literat.ug.edu.pl/~literat/hsnowel/003.htm');
};

export default actions;