import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator, Entity, Modifier, ContentState} from 'draft-js';
import writeGood from 'write-good'

let suggestions = []
const SuggestionSpan = (props) => {
  let data = Entity.get(props.entityKey).getData()
  return <span title = {data.suggestion.reason} style={{color:'red'}}>{props.decoratedText}</span>;
};

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
    strategy: suggestionStrategyByEntity,
    component: SuggestionSpan,
  },
]);


class App extends Component {
  onChange = (editorState) => {
    suggestions = this.computesuggestions(editorState)

    let targetRangeTemplate = editorState.getSelection()

    let freshEditorStateWithEntities = suggestions.reduce((freshEditorState, suggestion) =>{
      let targetRange = targetRangeTemplate
      .merge({
        anchorOffset:suggestion.index,
        focusOffset:(suggestion.index + suggestion.offset),
        hasFocus: true
      })
      let key =  Entity.create(
        'TOKEN',
        'IMMUTABLE',
        {suggestion: suggestion}
      )
      let contentStateWithNewEntity =  Modifier.applyEntity(
        freshEditorState.getCurrentContent(),
        targetRange,
        key
      )
      return EditorState.push(editorState, contentStateWithNewEntity, 'apply-entity')
    }, editorState)

    this.setState({editorState:freshEditorStateWithEntities})
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
          spellCheck={true}
          editorState={editorState}
          onChange={this.onChange} />
      </div>
    )
  }
}

export default App;
