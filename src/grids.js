import React, { useState } from "react";
import Faker from "faker";

import Grid from "./grid";
import SingleItem from "./single-item";
import { GlobalDndContextProvider } from "./dnd";

let idIncr = 0;

function createItem({ color }) {
  return {
    id: ++idIncr,
    text: `${Faker.hacker.verb()} ${Faker.hacker.adjective()} ${Faker.hacker.abbreviation()}`,
    color
  };
}

function createGrid(name, numItems, color) {
  const items = [];
  for (let i = 0; i < numItems; i++) {
    items.push(createItem({ color }));
  }
  return { name, description: Faker.lorem.sentences(), items };
}

const Grids = () => {
  const [grids, setGrids] = useState([
    createGrid("Nerdy stuff", 1, "#ffdddd"),
    createGrid("Everyday things", 8, "#ddddff"),
    createGrid("Intro topics", 6, "#ddffdd")
  ]);

  function onGridChange({ items, index }) {
    setGrids(grids => {
      const newGrids = [...grids];
      newGrids[index] = {
        ...newGrids[index],
        items
      };
      return newGrids;
    });
  }

  return (
    <GlobalDndContextProvider>
      {grids.map((grid, index) => (
        <Grid
          key={index}
          grid={grid}
          onChange={items => onGridChange({ items, index })}
        />
      ))}
      <SingleItem />
    </GlobalDndContextProvider>
  );
};

export default Grids;
