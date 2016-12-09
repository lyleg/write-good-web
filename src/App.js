import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator} from 'draft-js';
import writeGood from 'write-good'

let suggestions = []
const SuggestionSpan = (props) => {
  let indexMatch = props.children[0].props.start //wtf
  let suggestion = suggestions.find(suggestion => suggestion.index === indexMatch)
  let style = {
    backgroundColor:'#ffeee6',
    border: '1px solid #ffddcc',
    color: 666
  }
  return <span data-offset-key={props.offsetKey} title={suggestion.reason} style={style}>{props.children}</span>;
};

const suggestionStrategy = function(contentBlock, callback){
  suggestions.forEach((suggestion)=>{
    callback(suggestion.index, suggestion.index + suggestion.offset, suggestion)
  })
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: suggestionStrategy,
    component: SuggestionSpan,
  },
]);


class App extends Component {
  onChange = (editorState) =>{
    return this.setState({editorState: editorState},()=>{
      suggestions = this.computesuggestions(this.state.editorState)
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      suggestions:[],
      editorState: EditorState.createEmpty(compositeDecorator)
    };
  }
  computesuggestions(editorState){
    let plainText = editorState.getCurrentContent().getPlainText()
    return writeGood(plainText) || []
  }
  render() {
    const {editorState} = this.state;
    return (
      <div>
        <Editor
          spellCheck={true}
          editorState={editorState}
          onChange={this.onChange} />
      </div>
    )
  }
}

export default App;
