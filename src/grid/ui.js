import styled from "styled-components";
import is from "styled-is";

export const Outer = styled.section`
  margin: 0 0 2em;
`;

export const TheList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: -10px 0 0 -10px;
  padding: 0 0 10px;
  list-style: none;
  min-height: 81px;

  ${is("empty")`
    outline: 4px dashed lightgrey;
    background: #fbfbfb;
  `};

  ${is("highlighted")`
    outline: 4px dashed lightblue;
    background: #f3f9fb;
  `};
`;
