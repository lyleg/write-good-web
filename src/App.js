import React, { Component } from 'react';
import {Editor, EditorState, Modifier} from 'draft-js';
import writeGood from 'write-good'

const styleMap = {
  'suggestion': {
    color: 'red',
  },
};



class App extends Component {
  onChange = (editorState) => {
    let recs = this.computeRecs()
    if(recs.length >= 1){
    // Modifier.replaceText for words flagged for removal, place with entity that has custom style and tooltip with more info
      console.log(recs)
      let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
      this.setState({editorState:nextEditorState})
    }else{
      this.setState({editorState})
    }
  }
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};

  }
  computeRecs(){
    let plainText = this.state.editorState.getCurrentContent().getPlainText()
    return writeGood(plainText)
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
