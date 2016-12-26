class actions {}

const textLoaded = text => {
  return {
    type: 'TEXT_LOADED',
    text
  };
}

actions.loadText = url => {
  return dispatch => {
    fetch(url)
      .then(response => response.text())
      .then(text => dispatch(textLoaded(text)))
      .catch(console.warn);
  };
};

export default actions;