const polishLetters = [
  'A', 'a', 'Ą', 'ą', 'B', 'b', 'C', 'c', 'Ć', 'ć', 
  'D', 'd', 'E', 'e', 'Ę', 'ę', 'F', 'f', 'G', 'g', 
  'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 
  'Ł', 'ł', 'M', 'm', 'N', 'n', 'Ń', 'ń', 'O', 'o', 
  'Ó', 'ó', 'P', 'p', 'R', 'r', 'S', 's', 'Ś', 'ś', 
  'T', 't', 'U', 'u', 'W', 'w', 'Y', 'y', 'Z', 'z', 
  'Ź', 'ź', 'Ż', 'ż'];

const range = (length, start) => {
  return [...Array(length).keys()].map(i => i + (start || 0));
}

class TextReader {
  constructor(text) {
    this.text = Array.isArray(text) ? text : text.split('');
    this.position = -1;
  }

  nextChunk(length) {
    return [...Array(length)].map(() => this.next());
  }
  
  previousChunk(length) {
    return [...Array(length)].map(() => this.previous()).reverse();
  }

  next() {
    this.position++;
    if (this.position === this.text.length) {
      this.position = 0;
    }

    return this.text[this.position];
  }

  previous() {
    this.position--;
    if (this.position === -1) {
      this.position = this.text.length - 1;
    }

    return this.text[this.position];
  }
  
  currentPosition() {
    return this.position;
  }
}

class TextSample extends React.Component {
  constructor(props) {
    super(props);
    this.text = new TextReader(props.text);
    this.lettersInRow = 10;
    this.rowsInText = 3;

    this.state = {
      blinking: false,
      sample: new TextReader(this.text.nextChunk(this.lettersInRow * this.rowsInText)),
      cursorPosition: 0
    };
  }

  playAudio(letter) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance(letter);
    speech.lang = 'pl-PL';
    synth.speak(speech);
  }
  
  blink() {
		this.setState({ blinking: !this.state.blinking });
		setTimeout(this.blink.bind(this), 700);
	}

	componentDidMount () {
		this.blink();
	}

  renderLetter(index, letter) {
    const blinkingClass = (index === this.state.cursorPosition && this.state.blinking) ? 'blinking' : '';
    const className = `letter one ${blinkingClass} ${index}`;

    return <div key={ index } className={ className } onClick={ this.playAudio.bind(this, letter) }>{ letter }</div>;
  }

  renderRow() {
    const row = range(this.lettersInRow).map(() => {
      const sample = this.state.sample;
      const letter = sample.next();
      const position = sample.currentPosition();

      return this.renderLetter(position, letter)
    });

    return <div className="row">{ row }</div>;
  }

  render() {
    const rows = range(this.rowsInText).map(() => this.renderRow(this.state.sample));
    return <div>
      { rows }
    </div>;
  }
}

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
          { renderKey('shift', 'two-half') }
        </div>
        <div className="row">
          { renderKey('ctrl', 'two') }
          { renderKey('alt', 'two') }
          { renderKey('spacebar', 'five') }
          { renderKey('alt', 'one-half') }
          { renderKey('ctrl', 'one') }
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
  
  render() {
    return <div>
      <TextSample text="Błona biologiczna może odkładać się na granicy faz niezależnie od ich rodzaju."/>
      <Keyboard/>
    </div>
  }
}

ReactDOM.render(
  <Container />,
  document.getElementById('app')
);
