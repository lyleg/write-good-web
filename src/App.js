import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator, Entity, SelectionState, Modifier} from 'draft-js';
import writeGood from 'write-good'

const styleMap = {
  'suggestion': {
    color: 'red',
  },
};

let suggestions = []
const SuggestionSpan = (props) => {
  console.log(props)

  return <span {...props} title = "Heeey" style={{color:'red'}}>{props.children}</span>;
};

/*const suggestionStrategy = function(contentBlock, callback){
  console.log(suggestions)
  suggestions.forEach((suggestion)=>{
    callback(suggestion.index, suggestion.index + suggestion.offset, suggestion)
  })
}
*/
const suggestionStrategyByEntity = function(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      console.log(entityKey !== null)
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'SUGGESTION'
      );
    },
    callback
  );
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: suggestionStrategyByEntity,
    component: SuggestionSpan,
  },
]);


class App extends Component {
  onChange = (editorState) => {
    suggestions = this.computesuggestions(editorState)
  /*  const newContentState = suggestions.reduce((contentState, suggestion)=>{
      let key =  Entity.create(
        'SUGGESTION',
        'IMMUTABLE',
        {suggestion: suggestion}
      )
      let targetRange = editorState.getSelection()
debugger;
      return Modifier.applyEntity(
        contentState,
        targetRange.merge({
          anchorKey:suggestion.index,
          anchorOffset:(suggestion.index + suggestion.offset)
        }),
        key
      );
    },editorState.getCurrentContent())*/

    let newEditorState = suggestions.reduce((newEditorState, suggestion) =>{
      let targetRange = editorState.getSelection()
      .merge({
        anchorOffset:suggestion.index,
        focusOffset:(suggestion.index + suggestion.offset)
      })
      let key =  Entity.create(
        'SUGGESTION',
        'IMMUTABLE',
        {suggestion: suggestion}
      )
      return Modifier.replaceText(
        newEditorState.getCurrentContent(),
        targetRange,
        'entity',
        null,
        key
      )
    }, editorState)
    this.setState({editorState:newEditorState})
  }
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty(compositeDecorator)};

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
          customStyleMap={styleMap}
          spellCheck={true}
          editorState={editorState}
          onChange={this.onChange} />
      </div>
    )
  }
}

export default App;
