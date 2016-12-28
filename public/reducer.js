const defaultState = {
  content: {
    sample: 'No sample loaded.'
  }
};

export default function reducer(state = defaultState, action) {
    switch(action.type){
        case 'SAMPLE_LOADED':
          return { content: { sample: action.sample } }; // TODO: ALEX: Immutable
          break;
        default:
          return state;
    }
}