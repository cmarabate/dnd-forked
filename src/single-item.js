import React, { useState } from "react";

import { DnDZone } from "./dnd";
import { Outer, TheList } from "./grid/ui";
import Item from "./grid/item";

function SingleItem() {
  const [item, setItem] = useState(null);

  function onZoneDrop({ item }) {
    setItem(item);

    return "HANDLED";
  }

  function removeItem({ item: itemToRemove }) {
    if (item && item.id === itemToRemove.id) {
      setItem(null);
    }
  }

  return (
    <Outer>
      <h2>I accept a single item only</h2>
      <DnDZone onDrop={onZoneDrop} removeItem={removeItem}>
        {({ ref, highlighted }) => (
          <TheList ref={ref} empty={!item} highlighted={!item && highlighted}>
            {item && <Item item={item} ignoreOtherItemHover />}
          </TheList>
        )}
      </DnDZone>
    </Outer>
  );
}

export default SingleItem;
