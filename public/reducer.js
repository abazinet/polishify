const defaultState = {
  text: 'Błona biologiczna może odkładać się na granicy faz niezależnie od ich rodzaju.'
}

export default function reducer(state = defaultState, action) {
    switch(action.type){
        case 'TEXT_LOADED':
          return { text: action.text }; // TODO: ALEX: Immutable
          break;
        default:
          return state;
    }
}