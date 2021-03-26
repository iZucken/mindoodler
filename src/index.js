import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import KeyProvider from "./KeyProvider";
import EditorStore from "./EditorStore";

const editorStore = new EditorStore()

editorStore.addBlock({
    text: "woop",
    position: {
        x: 50,
        y: 50
    },
    size: {
        width: 100,
        height: 100
    }
})
editorStore.addBlock({
    text: "boop",
    position: {
        x: 200,
        y: 100
    },
    size: {
        width: 100,
        height: 100
    }
})
editorStore.addLink(0, 1)

ReactDOM.render(
  <React.StrictMode>
    <KeyProvider>
      <App editorStore={editorStore}/>
    </KeyProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
