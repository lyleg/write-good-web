import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator} from 'draft-js';
import {Map} from 'immutable'
import writeGood from 'write-good'

let suggestions = []
const SuggestionSpan = (props) => {
  let indexMatch = props.children[0].props.start //need to declare custom decoratorType to pass extra data
  let suggestion = suggestions.get(props.children[0].props.blockKey).find(suggestion => suggestion.index === indexMatch)
  let style = {
    backgroundColor:'#ffeee6',
    border: '1px solid #ffddcc',
    color: 666
  }
  return <span data-offset-key={props.offsetKey} title={suggestion.reason} style={style}>{props.children}</span>;
};

const suggestionStrategy = function(contentBlock, callback){
  let blockKey = contentBlock.get('key')
  suggestions.get(blockKey).forEach((suggestion)=>{
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
    return editorState.getCurrentContent().blockMap.reduce((suggestionsBlockMap, block) =>{
      let key = block.get('key')
      let suggestions = writeGood(block.get('text')) || []
      return suggestionsBlockMap.set(key, suggestions: suggestions)
    },Map())
  }
  render() {
    const {editorState} = this.state;
    return (
      <div style = {styles.root}>
        <Editor
          style = {styles.editor}
          spellCheck={true}
          editorState={editorState}
          onChange={this.onChange} />
      </div>
    )
  }
}

const styles = {
  editor:{
    borderTop: '1px solid #ddd',
    cursor: 'text',
    fontSize: 16,
    marginTop: 10
  },
  root:{
    background: '#fff',
    border: '1px solid #ddd',
    fontFamily: "'Georgia', serif",
    fontSize: 14,
    padding: 15
  }
}


export default App;
