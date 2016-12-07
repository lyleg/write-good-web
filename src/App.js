import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator, Entity, Modifier, ContentState} from 'draft-js';
import writeGood from 'write-good'

let suggestions = []
const SuggestionSpan = (props) => {
  //let data = Entity.get(props.entityKey).getData()
  let indexMatch = props.children[0].props.start //wtf
  let suggestion = suggestions.find(suggestion => suggestion.offset = indexMatch)
  return <span title = {'sdf'} style={{color:'red'}}>{props.decoratedText}</span>;
};
const suggestionStrategy = function(contentBlock, callback){
  suggestions.forEach((suggestion)=>{
    callback(suggestion.index, suggestion.index + suggestion.offset, suggestion)
  })
}
const suggestionStrategyByEntity = function(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'TOKEN'
      );
    },
    callback
  );
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: suggestionStrategy,
    component: SuggestionSpan,
  },
]);


class App extends Component {
  onChange = (editorState) => {
    suggestions = this.computesuggestions(editorState)

    this.setState({
      editorState:editorState
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
