import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator, Entity, Modifier, ContentState, SelectionState} from 'draft-js';
import writeGood from 'write-good'

let suggestions = []
const SuggestionSpan = (props) => {
  //let data = Entity.get(props.entityKey).getData()
  let indexMatch = props.children[0].props.start //wtf
  let suggestion = suggestions.find(suggestion => suggestion.offset = indexMatch)
  //console.log(props)
  return <span data-offset-key = {props.offsetKey} title = {suggestion.reason} style={{color:'red'}}>{props.children}</span>;
};

const suggestionStrategy = function(contentBlock, callback){
  suggestions.forEach((suggestion)=>{
    callback(suggestion.index, suggestion.index + suggestion.offset, suggestion)
  })
}

const SuggestionSpanWithEntity = (props) =>{
  let data = Entity.get(props.entityKey).getData()
  return <span title = {data.suggestion.reason} style={{color:'red'}}>{props.decoratedText}</span>;
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

function cleanBlock(block){
  let cleanCharacterList = block.characterList.map(character => {
    return character.set('entity', null)
  })
  return block.set('characterList', cleanCharacterList)
}
class App extends Component {
  onChange = (editorState) =>{
    return this.setState({editorState: editorState},()=>{
      suggestions = this.computesuggestions(this.state.editorState)
    })
  }
/*  onChangeWithEntity = (editorState)=>{
    let block = editorState.getCurrentContent().blockMap.first()
    let blockKey = block.get('key')


    suggestions = this.computesuggestions(editorState)
    let targetRangeTemplate = new SelectionState({
       anchorKey: blockKey,
       anchorOffset: 0,
       focusKey: blockKey,
       focusOffset: block.getLength(),
     });



    let freshEditorStateWithEntities = suggestions.reduce((freshEditorState, suggestion) =>{
      let currentContent = freshEditorState.getCurrentContent()

      let targetRange = targetRangeTemplate
      .merge({
        anchorOffset:suggestion.index,
        focusOffset:block.getLength(),
        hasFocus: true
      })
      let key =  Entity.create(
        'TOKEN',
        'IMMUTABLE',
        {suggestion: suggestion}
      )
      let contentStateWithNewEntity =  Modifier.applyEntity(
        ,
        targetRange,
        key
      )
      return EditorState.push(editorState, contentStateWithNewEntity, 'apply-entity')
    }, editorState)

    this.setState({editorState:freshEditorStateWithEntities})
  }*/
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
