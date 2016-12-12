import React, { Component } from 'react'
import {Editor, EditorState } from 'draft-js'
import writeGood from 'write-good'
import { Popover } from 'antd'
import SimpleDecorator from 'draft-js-simpledecorator'

import './antd.css'
import './Draft.css'
import './gh-fork-ribbon.css'

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
    width: 500,
    height:300,
    padding: 15
  },
  suggestionSpan:{
    backgroundColor:'#ffeee6',
    border: '1px solid #ffddcc',
    color: 666
  }
}

type Suggestion = {
  index: number,
  offset: number,
  reason: string
}

type SuggestionSpanProps = {
  offsetKey:string,
  suggestion:Suggestion
}
class SuggestionSpan extends Component {
  props:SuggestionSpanProps
  remove(){//?
  }
  render(){
    let {suggestion, offsetKey, children} = this.props
    return (
      <Popover content={suggestion.reason}>
        <span onClick={this.remove} data-offset-key={offsetKey} style={styles.suggestionSpan}>{children}</span>
      </Popover>
    )
  }
};

const suggestionStrategy = function(contentBlock, callback){
  let suggestions = writeGood(contentBlock.get('text')) || []
  suggestions.forEach(suggestion=>{
    callback(suggestion.index, suggestion.index + suggestion.offset, {suggestion:suggestion})
  })
}

const simpleDecorator = new SimpleDecorator(suggestionStrategy, SuggestionSpan)

type AppProps = {}
class App extends Component {
  props: AppProps
  state:{
    editorState:Object
  }
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(simpleDecorator)
    };
    this.onChange = (editorState:Object) => this.setState({editorState});
  }

  render() {
    const {editorState} = this.state;
    return (
      <div style={{marginLeft:20}}>
        <h1>Write Good Web</h1>
        <div style={styles.root}>
          <Editor
            style={styles.editor}
            spellCheck={true}
            editorState={editorState}
            onChange={this.onChange} />
        </div>
        <p>A simple web interface to <a href="https://github.com/btford/write-good"> Write Good </a></p>
      </div>
    )
  }
}

export default App;
