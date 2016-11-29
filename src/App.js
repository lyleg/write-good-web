import React, { Component } from 'react';
import {Editor, EditorState} from 'draft-js';
import writeGood from 'write-good'

class App extends Component {
  onChange = (editorState) => {
    this.setState({editorState})
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
    let recs = this.computeRecs()
    console.log(recs)
    return (
      <div>
        <Editor editorState={editorState} onChange={this.onChange} />
      </div>
    )
  }
}

export default App;
