import { Provider, connect } from 'ReactRedux';
import { bindActionCreators } from 'Redux';

import store from 'store';
import * as actions from 'actions';

const connectAll = Component => connect(
  state => state.toJS(),
  dispatch => bindActionCreators(actions, dispatch)
)(Component);

const polishMap = {
  'a': 'aą', 'b': 'b', 'c': 'cć', 'd': 'd', 'e': 'eę', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k', 'l': 'lł',
  'm': 'm', 'n': 'nń', 'o': 'oó', 'p': 'p', 'r': 'r', 's': 'sś', 't': 't', 'u': 'u', 'w': 'w', 'y': 'y', 'z': 'zźż', ' ': ' ',
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
};

const polishAll = Object.values(polishMap).join('').trim();

const cachedLettersAudio = polishAll.split('').map(letter => {
  const audio = new Audio(`https://cdn.gomix.com/c41eeb90-b28a-4268-8f0f-37503b86c52e%2F${encodeURIComponent(letter)}.mp3`);
  audio.preload = 'auto';
  return { letter, audio };
});

class Config extends React.Component {
  onApiKeyChange(event) {
    this.props.updateGoogleTranslateApiKey(event.target.value);
  }
  
  onSampleUrlChanged(event) {
    this.props.updateSampleUrl(event.target.value);
  }
  
  onClose() {
    this.props.hideConfig();
    this.props.loadSampleFrom(this.props.config.sampleUrl);
  }

  render() {
    return (
      <div className="config">
        <input
          value={ this.props.config.googleTranslateApiKey }
          placeholder="google translate api key"
          onChange={ this.onApiKeyChange.bind(this) }>
        </input>
        <input
          value={ this.props.config.sampleUrl }
          placeholder="url for content source"
          onChange={ this.onSampleUrlChanged.bind(this) }>
        </input>
        <button onClick={ this.onClose.bind(this) }>close</button>
      </div>
    );
  }
}

const ConnectedConfig = connectAll(Config);

class TextSample extends React.Component {
  constructor(props) {
    super(props);
    this.word = [];

    this.state = {
      blinking: false
    };
  }

  playAudio(text, lang) {
    if (lang === 'pl-PL' && text.length === 1 && polishAll.includes(text)) {
      cachedLettersAudio.find(audio => audio.letter === text).audio.play();
    } else {
      const synth = window.speechSynthesis;
      const speech = new SpeechSynthesisUtterance(text.trim());
      speech.lang = lang;
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
      return;
    }

    if (event.code === 'ArrowLeft') {
      this.props.cursorBackward();
      this.setState({ blinking: true });
      return;
    }

    if (event.code === 'ArrowDown') {
      this.props.cursorDown();
      this.setState({ blinking: true });
      return;
    }

    if (event.code === 'ArrowUp') {
      this.props.cursorUp();
      this.setState({ blinking: true });
      return;
    }

    const currentLetter = this.props.view.currentLetter;

    if (!polishAll.includes(currentLetter) || this.letterMatch(event.key, currentLetter)) {
      this.cursorForward();
    }
  }

  cursorForward() {
    const currentLetter = this.props.view.currentLetter;
    const nextLetter = this.props.view.nextLetter;

    if (polishAll.includes(currentLetter)) {
      this.playAudio(currentLetter, 'pl-PL');
      this.word.push(currentLetter);
    }

    if (!polishAll.includes(nextLetter)) {
      const text = this.word.join('');
      this.playAudio(text, 'pl-PL');
      this.props.translate(this.props.config.googleTranslateApiKey, text);
      this.word = [];
    }

    this.props.cursorForward();
  }
  
  onDoubleClick() {
    this.props.showConfig();
  }

  renderLetter(letter, letterIndex) {
    const cursorLetter = letterIndex === this.props.view.cursor;
    const blinkingClass = (cursorLetter && this.state.blinking) ? 'blinking' : '';
    const className = `letter one ${blinkingClass} ${letterIndex}`;

    const onClick = cursorLetter ? this.cursorForward.bind(this) : () => null;

    return <div key={ letterIndex } className={ className } onClick={ onClick }>{ letter }</div>;
  }

  renderRow(row, rowIndex) {
    const letters = row.map((letter, letterIndex) => this.renderLetter(letter, (rowIndex * this.props.config.columns) + letterIndex));
    return <div key={ rowIndex } className="row">{ letters }</div>;
  }

  render() {
    if (this.props.config.visible) {
      return <ConnectedConfig/>;
    }

    if (this.props.view.translation) {
      this.playAudio(this.props.view.translation, 'en-US');
    }

    return (
      <div onDoubleClick={this.onDoubleClick.bind(this)}>
        { this.props.view.text.map(this.renderRow.bind(this)) }
      </div>
    );
  }
}

const ConnectedTextSample = connectAll(TextSample);

// Main component
class Container extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    this.props.loadSampleFrom(this.props.config.sampleUrl);
  }

  render() {
    return (
      <div className="container">
        <ConnectedTextSample />
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