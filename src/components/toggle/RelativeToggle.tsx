import { Button } from "react-bootstrap";
import styled from "styled-components";

export const RelativeToggle = styled(Button)`
  position: absolute;
  padding: 2px;
  font-size: 13px;
  font-weight: bold;
  line-height: 1;
  transition: all;
  min-height: 28px;
  display: flex;
  align-items: center;
  @media print {
    color: gray;
  }
  &:hover {
    text-decoration: none;
  }
  &:focus {
    text-decoration: underline;
    box-shadow: none;
  }
  .chevron {
    stroke-width: 2;
    font-size: 20px;
    @media print {
      display: none;
    }
  }

  .value {
    display: inline-block;
    min-width: 1em; //default to optional icon width for central alignment
  }
`;
