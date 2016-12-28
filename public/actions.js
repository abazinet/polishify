class actions {}

const sampleLoaded = sample => {
  return {
    type: 'SAMPLE_LOADED',
    sample
  };
};

actions.loadSampleFrom = url => {
  const encodedUrl = encodeURIComponent(url.toLowerCase());
  const yql = `https://query.yahooapis.com/v1/public/yql?q=select * from html where url="${encodedUrl}"&format=html`;

  return dispatch => {
    fetch(yql)
      .then(resp => resp.ok ? resp.text() : resp.statusText)
      .then(text => dispatch(sampleLoaded(text)))
      .catch(console.warn);
  };
};

actions.loadDefaultSample = () => {
  return actions.loadSampleFrom('https://pl.wikipedia.org/wiki/Specjalna:Losowa_strona');
};

export default actions;