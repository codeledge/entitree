import React from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

export default function TreeLoader() {
  return (
    <StyledTreeLoader>
      <div className="center">
        <Spinner animation="grow" />
        <div>Loading tree</div>
      </div>
    </StyledTreeLoader>
  );
}

const StyledTreeLoader = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
  .center {
    text-align: center;
    top: 50%;
    left: 50%;
    position: absolute;
    color: lightgray;
    transform: translate(-50%, -50%);
    svg,
    .spinner-grow {
      font-size: 10em;
      margin-bottom: 10px;
    }
  }
`;
