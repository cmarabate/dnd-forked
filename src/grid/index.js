import React from "react";

import { DnDZone } from "../dnd";
import { reorderArray } from "./helpers";
import Item, { gapAttr } from "./item";
import { Outer, TheList } from "./ui";

function findItemIndex({ array, item }) {
  return array.findIndex(i => i.id === item.id);
}

function Grid({ grid, onChange }) {
  function onItemHover({ dragItem, hoverItem }) {
    onChange(
      reorderArray({
        array: grid.items,
        fromIndex: findItemIndex({ array: grid.items, item: dragItem }),
        toIndex: findItemIndex({ array: grid.items, item: hoverItem })
      })
    );
  }

  function removeItem({ item }) {
    const index = findItemIndex({ array: grid.items, item });
    if (index === -1) {
      return;
    }

    const items = [...grid.items];
    const [removedItem] = items.splice(index, 1);

    onChange(items);

    return removedItem;
  }

  function addItem({ item, hoverItem }) {
    const index = findItemIndex({ array: grid.items, item: hoverItem });
    if (index === -1) {
      return;
    }
    const items = [...grid.items];
    items.splice(index, 0, item);
    onChange(items);
  }

  function onZoneDrop({ isOverShallow, item, clientOffset }) {
    // It is not dropped directly on the zone
    if (!isOverShallow) {
      return;
    }

    function isDroppedOnGap() {
      const element = document.elementFromPoint(clientOffset.x, clientOffset.y);
      return element.hasAttribute(gapAttr);
    }

    if (grid.items.length === 0 || !isDroppedOnGap()) {
      const newItems = [...grid.items];
      const index = findItemIndex({ array: grid.items, item });

      // Already at end. Do nothing
      if (newItems.length > 0 && index === newItems.length - 1) {
        return;
      }

      // Remove it from other place in the array
      if (index !== -1) {
        newItems.splice(index, 1);
      }
      newItems.push(item);

      onChange(newItems);

      return "HANDLED";
    }
  }

  return (
    <Outer>
      <h2>{grid.name}</h2>
      <p>{grid.description}</p>
      <DnDZone
        onDrop={onZoneDrop}
        onItemHover={onItemHover}
        removeItem={removeItem}
        addItem={addItem}
      >
        {({ ref, highlighted }) => (
          <TheList
            ref={ref}
            empty={grid.items.length === 0}
            highlighted={grid.items.length === 0 && highlighted}
          >
            {grid.items.map(item => (
              <Item key={item.id} item={item} />
            ))}
          </TheList>
        )}
      </DnDZone>
    </Outer>
  );
}

export default Grid;
