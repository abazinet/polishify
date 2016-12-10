const polishLetters = [
  'A', 'a', 'Ą', 'ą', 'B', 'b', 'C', 'c', 'Ć', 'ć', 
  'D', 'd', 'E', 'e', 'Ę', 'ę', 'F', 'f', 'G', 'g', 
  'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 
  'Ł', 'ł', 'M', 'm', 'N', 'n', 'Ń', 'ń', 'O', 'o', 
  'Ó', 'ó', 'P', 'p', 'R', 'r', 'S', 's', 'Ś', 'ś', 
  'T', 't', 'U', 'u', 'W', 'w', 'Y', 'y', 'Z', 'z', 
  'Ź', 'ź', 'Ż', 'ż'];

class TextSample extends React.Component {
  render() {
    const renderLetter = letter => <div key={ letter} className="box one">{ letter }</div>;
    const renderRow = text => <div className="row">{ [...Array(16)].forEach(i => renderLetter(text.shift())) }</div>;

    const sample = this.props.sample.split('');
    return [...Array(4)].forEach(i => renderRow(sample));
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
      <TextSample sample="W oświadczeniu na stronie internetowej organizacji padają słowa, że minister mówi nieprawdę."/>
      <Keyboard/>
    </div>
  }
}

ReactDOM.render(
  <Container />,
  document.getElementById('app')
);
