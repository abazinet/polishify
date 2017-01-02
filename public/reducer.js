import Immutable from 'Immutable';

const defaultState = Immutable.fromJS({
  content: {
    sample: 'Loading...'
  }
});

export default function reducer(state = defaultState, action) {
  switch(action.type){
      case 'SAMPLE_LOADED':
         return state.setIn(['content', 'sample'], action.sample);
      default:
        return state;
  }
}