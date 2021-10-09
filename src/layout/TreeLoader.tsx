import Logo from "./Logo";
import React from "react";
import styled from "styled-components";

export default function TreeLoader() {
  return (
    <StyledTreeLoader>
      <div className="center">
        <Logo height=".5em" />
        <div>Loading tree</div>
      </div>
    </StyledTreeLoader>
  );
}

const StyledTreeLoader = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
  font-size: 18px;
  svg {
    stroke-dasharray: 170 110;
    animation: dash 8s linear infinite alternate;
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 1000;
    }
  }
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
