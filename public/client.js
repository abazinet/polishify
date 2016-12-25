const polishLetters = [
  'A', 'a', 'Ą', 'ą', 'B', 'b', 'C', 'c', 'Ć', 'ć', 
  'D', 'd', 'E', 'e', 'Ę', 'ę', 'F', 'f', 'G', 'g', 
  'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 
  'Ł', 'ł', 'M', 'm', 'N', 'n', 'Ń', 'ń', 'O', 'o', 
  'Ó', 'ó', 'P', 'p', 'R', 'r', 'S', 's', 'Ś', 'ś', 
  'T', 't', 'U', 'u', 'W', 'w', 'Y', 'y', 'Z', 'z', 
  'Ź', 'ź', 'Ż', 'ż'];

class TextReader {
  constructor(text) {
    this.text = text;
    this.position = 0;
  }

  next() {
    if (this.position === this.text.length) {
      this.position = -1;
    }
    return this.text.charAt(this.position++);
  }

  previous() {
    if (this.position === 0) {
      this.position = this.text.length;
    }
    return this.text.charAt(this.position--);
  }
}

class AudioPlayer extends React.Component {
  reunder() {
    return <audio src="{ this.props.audioSrc }" controls autoplay/>;
  }
}

class TextSample extends React.Component {
  constructor(props) {
    super(props);
    this.lettersInRow = 10;
    this.rowsInText = 3;
    this.text = new TextReader(props.sample);
  }

  componentWillReceiveProps(nextProps) {
    this.text = new TextReader(this.props.sample);
  }

  renderLetter(index, letter) {
    return <div key={ index } className="letter one">{ letter }</div>;
  }

  renderRow() {
    const row = [...Array(this.lettersInRow)].map(i => this.renderLetter(i, this.text.next()));
    return <div className="row">{ row }</div>;
  }

  render() {
    const sample = this.props.sample.split('');
    const rows = [...Array(this.rowsInText)].map(() => this.renderRow(sample));
    return <div>{ rows }</div>;
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
      <TextSample sample="This is just a test with a number of letters"/>
      <Keyboard/>
    </div>
  }
}

ReactDOM.render(
  <Container />,
  document.getElementById('app')
);
