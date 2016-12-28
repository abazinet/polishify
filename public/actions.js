class actions {}

const sampleLoaded = sample => {
  return {
    type: 'SAMPLE_LOADED',
    sample
  };
};

actions.loadSampleFrom = url => {
  const encodedUrl = encodeURIComponent(url);
  const yql = `https://query.yahooapis.com/v1/public/yql?q=select * from html where url="${encodedUrl}"&format=html`;

  return dispatch => {
    fetch(yql)
      .then(resp => {
        if (resp.ok) {
          return resp.text();
        }
        throw new Error(resp.statusText);
      })
      .then(html => {
        const div = document.createElement('div');
        div.innerHTML = html;

        const results = document.evaluate('//p', div, null, XPathResult.ANY_TYPE, null);

        let text = '';
        let item = results.iterateNext();
        while (item) {
          console.log(item.textContent);
          text = text + item.textContent;
          item = results.iterateNext();
        }  

        dispatch(sampleLoaded(text));
      })
      .catch(console.warn);
  };
};

actions.loadDefaultSample = () => {
  return actions.loadSampleFrom('https://pl.wikipedia.org/wiki/Specjalna:Losowa_strona');
};

export default actions;