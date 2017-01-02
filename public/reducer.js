import Immutable from 'Immutable';

const COLUMNS = 30;
const ROWS = 4;
const LENGTH = COLUMNS * ROWS;

const defaultState = Immutable.fromJS({
  config: {
    columns: COLUMNS,
    rows: ROWS,
    textLength: LENGTH
  },
  content: {
    sample: 'Loading...'.split('')
  },
  view: {
    text: [[]],
    start: 0,
    cursor: 0
  }
});

const range = length => [...Array(length).keys()];

export default function reducer(state = defaultState, action) {

  const updateViewText = (mutate, sample, start) => {
    const text = [];
    range(ROWS).forEach(rowIndex => {
      text.push([]);
      range(COLUMNS).forEach(columnIndex => {
        text[rowIndex].push(sample[start % sample.length]);
        start++;
      });
    });
    mutate.setIn(['view', 'text'], text);
  };

  switch(action.type) {

    case 'SAMPLE_LOADED':
      if (!Array.isArray(action.sample)) {
        throw new Error('sample has to be an array');
      }

      return state.withMutations(mutate => {
        mutate.setIn(['content', 'sample'], action.sample);
        mutate.setIn(['view', 'start'], 0);
        mutate.setIn(['view', 'cursor'], 0);

        updateViewText(mutate, action.sample, 0);
      });

    case 'CURSOR_FORWARD':
      return state.withMutations(mutate => {
        const newCursor = mutate.getIn(['view', 'cursor']) + 1;
        mutate.setIn(['view', 'cursor'], newCursor);
        
        console.log(mutate.toJS());

        if (newCursor === LENGTH) {
          const sample = mutate.getIn(['content', 'sample']);
          const newStart = (mutate.getIn(['view', 'start']) + LENGTH) % sample.length;

          mutate.setIn(['view', 'start'], newStart);
          mutate.setIn(['view', 'cursor'], 0);

          updateViewText(mutate, sample, newStart);
        }
      });

    case 'CURSOR_BACKWARD':
      return state.withMutations(mutate => {
        const newCursor = mutate.getIn(['view', 'cursor']) - 1;
        mutate.setIn(['view', 'cursor'], newCursor)

        if (newCursor < 0) {
          const sample = mutate.getIn(['content', 'sample']);
          const start = mutate.getIn(['view', 'start']);
          const newStart = (start - LENGTH < 0) ? (sample.length + start) : (start - LENGTH);

          mutate.setIn(['view', 'start'], newStart);
          mutate.setIn(['view', 'cursor'], LENGTH - 1);

          updateViewText(mutate, sample, newStart);
        }
      });

    default:
      return state;
  }
}