import React from "react";
import ReactDOM from "react-dom";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import GlobalStyle from "./global-styles";
import Grids from "./grids";

function App() {
  return (
    <>
      <GlobalStyle />
      <DndProvider backend={HTML5Backend}>
        <main>
          <Grids />
        </main>
      </DndProvider>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
