//@flow
import React, { Component } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import SimpleDecorator from "draft-js-simpledecorator";
import { SuggestionSpan, suggestionStrategy } from "./suggestion";

import "./App.css";
import "./Draft.css";

const simpleDecorator = new SimpleDecorator(suggestionStrategy, SuggestionSpan);

let sampleText = `So the cat was stolen. I would really like it you could e-mail me back.`;

const styles = {
  editor: {
    borderTop: "1px solid #ddd",
    cursor: "text",
    fontSize: 16,
    marginTop: 10
  },
  root: {
    background: "#fff",
    border: "1px solid #ddd",
    fontFamily: "'Georgia', serif",
    fontSize: 14,
    width: 500,
    height: 300,
    padding: 15
  },
  suggestionSpan: {
    backgroundColor: "#ffeee6",
    border: "1px solid #ffddcc",
    color: 666
  }
};

type AppProps = {};
class App extends Component {
  props: AppProps;
  state: { editorState: Object };
  onChange: Function;
  constructor(props: AppProps) {
    super(props);
    let initialContentState = ContentState.createFromText(sampleText);
    this.state = {
      editorState: EditorState.createWithContent(
        initialContentState,
        simpleDecorator
      )
    };
    this.onChange = (editorState: Object) => this.setState({ editorState });
  }

  render() {
    const { editorState } = this.state;
    const editorStyle = {
      borderTop: "1px solid #ddd",
      cursor: "text",
      fontSize: 16,
      marginTop: 10
    };
    return (
      <div style={{ marginLeft: 20 }}>
        <h1>Write Good Web</h1>
        <div className="editorContainer">
          <Editor
            style={editorStyle}
            spellCheck={true}
            editorState={editorState}
            onChange={this.onChange}
          />
        </div>
        <p style={{ marginTop: 50 }}>
          A simple web interface to
          <a
            target="_blank"
            href="https://github.com/btford/write-good"
          >
           Write Good
           </a>
        </p>
      </div>
    );
  }
}

export default App;
