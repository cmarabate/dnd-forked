import React from "react";
import styled from "styled-components";
import is from "styled-is";

import { useItemDnD } from "../dnd";

export const gapAttr = "data-gap";

const Outer = styled.li`
  margin: 0;
  padding: 0;
  opacity: ${p => (p.hide ? "0" : "1")};
  display: flex;
  flex-wrap: wrap;
`;

const Inner = styled.span`
  flex: 1 1 auto;
  padding: 10px;
  background: ${p => p.background};

  &::first-letter {
    text-transform: uppercase;
  }
`;

const Gap = styled.span.attrs(() => ({
  [gapAttr]: 1
}))`
  ${is("top")`
    height: 10px;
    flex: 1 0 100%;
  `};

  ${is("left")`
    flex: 0 0 10px;
    width: 10px;
  `};
`;

const Item = ({ item, ignoreOtherItemHover }) => {
  const { ref, isDragging } = useItemDnD({
    id: item.id,
    item,
    ignoreOtherItemHover
  });

  return (
    <Outer hide={isDragging}>
      <Gap top />
      <Gap left />
      <Inner ref={ref} background={item.color}>
        {item.text}
      </Inner>
    </Outer>
  );
};

export default Item;
