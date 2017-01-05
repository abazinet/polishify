import Immutable from 'Immutable';

const COLUMNS = 30;
const ROWS = 4;
const LENGTH = COLUMNS * ROWS;

const polishMap = {
  'a': 'aą', 'b': 'b', 'c': 'cć', 'd': 'd', 'e': 'eę', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k', 'l': 'lł',
  'm': 'm', 'n': 'nń', 'o': 'oó', 'p': 'p', 'r': 'r', 's': 'sś', 't': 't', 'u': 'u', 'w': 'w', 'y': 'y', 'z': 'zźż', ' ': ' ',
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
};

const polishAll = Object.values(polishMap).join('');

const defaultState = Immutable.fromJS({
  config: {
    visible: false,
    columns: COLUMNS,
    rows: ROWS,
    textLength: LENGTH,
    googleTranslateApiKey: ''
  },
  content: {
    sample: null
  },
  view: {
    text: [['l', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.']],
    say: {
      text: null,
      lang: null
    },
    word: '',
    start: 0,
    cursor: 0,
    currentLetter: 'l',
    blinking: false
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

  const cursorForward = mutate => {
    const newCursor = mutate.getIn(['view', 'cursor']) + 1;
    mutate.setIn(['view', 'cursor'], newCursor);
    mutate.setIn(['view', 'blinking'], true);

    if (newCursor === LENGTH) {
      const sample = mutate.getIn(['content', 'sample']);
      const newStart = (mutate.getIn(['view', 'start']) + LENGTH) % sample.length;

      mutate.setIn(['view', 'start'], newStart);
      mutate.setIn(['view', 'cursor'], 0);

      updateViewText(mutate, sample, newStart);
    }
  };
  
  const cursorBackward = mutate => {
    const newCursor = mutate.getIn(['view', 'cursor']) - 1;
    mutate.setIn(['view', 'cursor'], newCursor);
    mutate.setIn(['view', 'blinking'], true);

    if (newCursor < 0) {
      const sample = mutate.getIn(['content', 'sample']);
      const start = mutate.getIn(['view', 'start']);
      const newStart = (start - LENGTH < 0) ? (sample.length + start) : (start - LENGTH);

      mutate.setIn(['view', 'start'], newStart);
      mutate.setIn(['view', 'cursor'], LENGTH - 1);

      updateViewText(mutate, sample, newStart);
    }
  };
  
  const say = (mutate, text, lang) => {
    mutate.setIn(['view', 'say', 'text'], text);
    mutate.setIn(['view', 'say', 'lang'], lang);
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
      return state.withMutations(cursorForward);

    case 'CURSOR_BACKWARD':
      return state.withMutations(cursorBackward);
    
    case 'SHOW_CONFIG':
      return state.setIn(['config', 'visible'], true);

    case 'HIDE_CONFIG':
      return state.setIn(['config', 'visible'], false);

    case 'UPDATE_GOOGLE_TRANSLATE_API_KEY':
      return state.setIn(['config', 'googleTranslateApiKey'], action.key);

    case 'SAY_TRANSLATED_TEXT':
      return state.setIn(['view', 'translation'], action.text);

    case 'CLEAR_TRANSLATED_TEXT':
      return state.setIn(['view', 'translation'], null);
    
    case 'LETTER_MATCH':
      const newWord = `${state.getIn(['view', 'word'])}${action.letter}`;
      return state.setIn(['view', 'word'], newWord);

    case 'SAY':
      return state.withMutations(mutate => say(mutate, action.text, action.lang));

    case 'KEY_PRESS':
      function letterMatch(input, target) {
        const targets = polishMap[input.toLowerCase()];
        return targets ? targets.includes(target) : false;
      }

      if (action.code === 'ArrowRight') {
        return state.withMutations(cursorForward);
      }
  
      if (event.code === 'ArrowLeft') {
        return state.withMutations(cursorBackward);
      }

      let newState = state;
  
      const currentLetter = state.getIn(['view', 'currentLetter']);
  
      if (!polishAll.includes(currentLetter) || this.letterMatch(event.key, currentLetter)) {
        
          newState = state.withMutations(mutate => {
            if (polishAll.includes(currentLetter)) {
              say(mutate, currentLetter, 'pl-PL');
              const newWord = `${state.getIn(['view', 'word'])}${currentLetter}`;
              mutate.setIn(['view', 'word'], newWord);
            }
            if (currentLetter === ' ') {
              say(mutate, mutate.getIn(['view', 'word']), 'pl-PL');
              this.props.translate(this.props.config.googleTranslateApiKey, this.props.view.word);
            }    
          });


        if (polishAll.includes(currentLetter)) {
        }
  
        if (currentLetter === ' ') {
          this.playAudio(this.props.view.word, 'pl-PL');
          this.props.translate(this.props.config.googleTranslateApiKey, this.props.view.word);
        }
  
        this.props.cursorForward();
      }
    break;
    
    case 'CURSOR_BLINK':
      return state.setIn(['view', 'blinking'], !state.getIn(['view', 'blinking']));

    default:
      return state;
  }
}