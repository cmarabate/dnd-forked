import React, {
  useRef,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { useDrag, useDrop } from "react-dnd";
import EE from "eventemitter3";

const type = "AWESOME_DND_ITEM";

const dndEvents = new EE();

function limitToDecimals(decimals) {
  return num => {
    const d = Math.pow(10, decimals);
    return Math.floor(num * d) / d;
  };
}

// Context shared amongst all of the grids
export const GlobalDndContext = createContext();

export function GlobalDndContextProvider({ children }) {
  const [dragItemId, setDragItemId] = useState(null);
  const [DnDZoneId, setDnDZoneId] = useState(null);

  return (
    <GlobalDndContext.Provider
      value={{ dragItemId, setDragItemId, DnDZoneId, setDnDZoneId }}
    >
      {children}
    </GlobalDndContext.Provider>
  );
}

// Context to track each separate zone
export const DnDZoneContext = createContext();

// HOC for each DnD zone
export function DnDZone({
  children,
  onItemHover,
  removeItem,
  addItem,
  onDrop
}) {
  const ref = useRef(null);
  const idRef = useRef(Symbol());

  useEffect(() => {
    function onItemRemove({ zoneId, item }) {
      if (zoneId === idRef.current) {
        removeItem({ item });
      }
    }

    function onItemDropped({ zoneId, item }) {
      if (zoneId !== idRef.current) {
        removeItem({ item });
      }
    }

    dndEvents.on("item-remove", onItemRemove);
    dndEvents.on("item-dropped", onItemDropped);

    return () => {
      dndEvents.off("item-remove", onItemRemove);
      dndEvents.off("item-dropped", onItemDropped);
    };
  });

  const [{ highlighted }, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        highlighted: monitor.canDrop()
      };
    },
    drop(dragItem, monitor) {
      if (!onDrop) {
        return;
      }

      const isOverShallow = monitor.isOver({ shallow: true });

      const clientRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset() || { x: 0, y: 0 };

      const limit = limitToDecimals(2);

      // Get the relative cursor position on the zone
      const position = {
        top: limit((clientOffset.y - clientRect.top) / clientRect.height),
        left: limit((clientOffset.x - clientRect.left) / clientRect.width)
      };
      position.bottom = limit(1 - position.top);
      position.right = limit(1 - position.left);

      const dropResult = onDrop({
        isOverShallow,
        item: dragItem.data,
        position,
        clientOffset
      });

      if (dropResult === "HANDLED") {
        dndEvents.emit("item-dropped", {
          item: dragItem.data,
          zoneId: idRef.current
        });
      }
    }
  });

  drop(ref);

  return (
    <DnDZoneContext.Provider
      value={{
        id: idRef.current,
        onItemHover,
        addItem,
        removeItem: args => dndEvents.emit("item-remove", args)
      }}
    >
      {children({ ref, highlighted })}
    </DnDZoneContext.Provider>
  );
}

// The hook for each grid item
export function useItemDnD({ item, id, ignoreOtherItemHover }) {
  const ref = useRef(null);
  const globalDndContext = useContext(GlobalDndContext);
  const zoneDnDContext = useContext(DnDZoneContext);

  const [, drag] = useDrag({
    item: {
      type,
      data: item,
      id
    },
    begin() {
      globalDndContext.setDnDZoneId(zoneDnDContext.id);

      // Wait a bit before setting the active id since setting it
      // right away makes the draggable item invisible too soon
      setTimeout(() => {
        globalDndContext.setDragItemId(id);
      });
    },
    end() {
      globalDndContext.setDragItemId(null);
      globalDndContext.setDnDZoneId(null);
    }
  });

  const [, drop] = useDrop({
    accept: type,
    hover(dragItem) {
      if (!ignoreOtherItemHover && dragItem.id !== id) {
        const sameGrid = globalDndContext.DnDZoneId === zoneDnDContext.id;
        if (sameGrid) {
          zoneDnDContext.onItemHover({
            dragItem: dragItem.data,
            hoverItem: item
          });
        } else {
          // Remove from parent
          zoneDnDContext.removeItem({
            zoneId: globalDndContext.DnDZoneId,
            item: dragItem.data
          });

          // Add to this zone
          zoneDnDContext.addItem({ hoverItem: item, item: dragItem.data });

          // Set new parent id for the draggable item
          globalDndContext.setDnDZoneId(zoneDnDContext.id);
        }
      }
    }
  });

  drag(drop(ref));

  return { ref, isDragging: globalDndContext.dragItemId === id };
}
