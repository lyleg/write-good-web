import React, { Component } from 'react'
import {Editor, EditorState, CompositeDecorator} from 'draft-js'
import {Map} from 'immutable'
import writeGood from 'write-good'
import { Popover } from 'antd'
import SimpleDecorator from 'draft-js-simpledecorator'

import './antd.css'
import './Draft.css'

let suggestions = []

class SuggestionSpan extends Component {
  remove(){
  }
  render(){
    let {suggestion, offsetKey, children} = this.props

    if(!suggestion){//sometimes we get out of sync for one cycle if we change length of word associated with suggestion
      return <span data-offset-key={offsetKey}>{children}</span>
    }
    return (
      <Popover content = {suggestion.reason}>
        <span onClick ={this.remove} data-offset-key={offsetKey} style={styles.suggestionSpan}>{children}</span>
      </Popover>
    )
  }
};

const suggestionStrategy = function(contentBlock, callback){
  let blockKey = contentBlock.get('key')
  let block = suggestions.get(blockKey) || []

  block.forEach((suggestion)=>{
    callback(suggestion.index, suggestion.index + suggestion.offset, {suggestion:suggestion})
  })
}

const compositeDecorator = new SimpleDecorator(suggestionStrategy, SuggestionSpan)

class App extends Component {
  onChange = (editorState) =>{
    this.setState({editorState: editorState},()=>{
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
      <div style = {{marginLeft:20}}>
        <h1>Write Good Web</h1>
        <div style = {styles.root}>
          <Editor
            style = {styles.editor}
            spellCheck={true}
            editorState={editorState}
            onChange={this.onChange} />
        </div>
        <p>A simple web interface to <a href ="https://github.com/btford/write-good"> Write Good </a></p>
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

export default App;
