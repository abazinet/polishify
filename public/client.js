import { Provider, connect } from 'ReactRedux';
import { bindActionCreators } from 'Redux';

import store from 'store';
import * as actions from 'actions';

const range = length => [...Array(length).keys()];

const connectAll = Component => connect(
  state => state.toJS(),
  dispatch => bindActionCreators(actions, dispatch)
)(Component);

const polishMap = {
  'a': 'aą', 'b': 'b', 'c': 'cć', 'd': 'd', 'e': 'eę', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k', 'l': 'lł',
  'm': 'm', 'n': 'nń', 'o': 'oó', 'p': 'p', 'r': 'r', 's': 'sś', 't': 't', 'u': 'u', 'w': 'w', 'y': 'y', 'z': 'zźż', ' ': ' ',
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
};

const polishAll = Object.values(polishMap).join('');

const cachedLettersAudio = polishAll.trim().split('').map(letter => {
  const audio = new Audio(`https://cdn.gomix.com/c41eeb90-b28a-4268-8f0f-37503b86c52e%2F${encodeURIComponent(letter)}.mp3`);
  audio.preload = 'auto';
  return { letter, audio };
});

class TextSample extends React.Component {
  constructor(props) {
    super(props);
    this.word = [];

    this.state = {
      blinking: false
    };
  }

  playAudio(text) {
    if (text.length === 1 && text !== ' ' && polishAll.includes(text)) {
      cachedLettersAudio.find(audio => audio.letter === text).audio.play();
    } else {
      const synth = window.speechSynthesis;
      const speech = new SpeechSynthesisUtterance(text.trim());
      speech.lang = 'pl-PL';
      synth.speak(speech);
    }
  }

  blink() {
		this.setState({ blinking: !this.state.blinking });
		this.timer = setTimeout(this.blink.bind(this), 700);
	}

	componentWillMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
		this.blink();
	}

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

	componentWillUnmount() {
	  clearTimeout(this.timer);
	}
	
  letterMatch(input, target) {
    const targets = polishMap[input.toLowerCase()];
    return targets ? targets.includes(target) : false;
  }

  handleKeyDown(event) {
    if (event.code === 'ArrowRight') {
      this.props.cursorForward();
      this.setState({ blinking: true });
    }

    if (event.code === 'ArrowLeft') {
      this.props.cursorBackward();
      this.setState({ blinking: true });
    }

    const currentLetter = this.props.content.sample[this.props.view.start + this.props.view.cursor].toLowerCase();

    if (!polishAll.includes(currentLetter) || this.letterMatch(event.key, currentLetter)) {
      if (polishAll.includes(currentLetter)) this.playAudio(currentLetter);
      this.word.push(currentLetter);
  
      if (currentLetter === ' ') {
        this.playAudio(this.word.join(''));
        this.word = [];
      }

      this.props.cursorForward();
    }
  }

  renderLetter(letter, letterIndex) {
    const blinkingClass = (letterIndex === this.props.view.cursor && this.state.blinking) ? 'blinking' : '';
    const className = `letter one ${blinkingClass} ${letterIndex}`;

    return <div key={ letterIndex } className={ className } onClick={ this.playAudio.bind(this, letter) }>{ letter }</div>;
  }

  renderRow(row, rowIndex) {
    const letters = row.map((letter, letterIndex) => this.renderLetter(letter, (rowIndex * this.props.config.columns) + letterIndex));
    return <div key={ rowIndex } className="row">{ letters }</div>;
  }

  render() {
    return <div>{ this.props.view.text.map(this.renderRow.bind(this)) }</div>;
  }
}

const ConnectedTextSample = connectAll(TextSample);

class Keyboard extends React.Component {
  render() {
    const renderKey = (letter, size) => <div key={ letter} className={`box ${size}`}>{ letter }</div>;

    return (
      <div className="keyboard">
        <div className="row">
          { ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map(l => renderKey(l, 'one')) }
          { renderKey('backspace', 'two') }
        </div>
        <div className="row">
          { renderKey('tab', 'one-half') }
          { ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'].map(l => renderKey(l, 'one')) }
        </div>
        <div className="row">
          { renderKey('capslock', 'one-half') }
          { ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''].map(l => renderKey(l, 'one')) }
          { renderKey('enter', 'two') }
        </div>
        <div className="row">
          { renderKey('shift', 'two-half') }
          { ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'].map(l => renderKey(l, 'one')) }
          { renderKey('shift ', 'two-half') }
        </div>
        <div className="row">
          { renderKey('ctrl', 'two') }
          { renderKey('alt', 'two') }
          { renderKey('space', 'five') }
          { renderKey('alt ', 'one-half') }
          { renderKey('ctrl ', 'one') }
          { renderKey('', 'two-half') }
        </div>
      </div>
    );
  }
}

// Main component
class Container extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    this.props.loadDefaultSample();
  }

  render() {
    return (
      <div className="container">
        <ConnectedTextSample />
        <Keyboard />
      </div>
    );
  }
}

const ConnectedContainer = connectAll(Container);

ReactDOM.render(
  <Provider store={ store }>
    <ConnectedContainer/>
  </Provider>,
  document.getElementById('app')
);
