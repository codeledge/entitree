import { MAX_SCALE, MIN_SCALE } from "constants/tree";
import React, { memo, useRef } from "react";

import Graph from "./Graph";
import { Navigation } from "components/Navigation";
import { TransformWrapper } from "react-zoom-pan-pinch";
import styled from "styled-components";
import useElementSize from "hooks/useElementSize";

export default function DrawingArea() {
  return (
    <TransformWrapper
      velocityAnimation={{
        disabled: true,
      }}
      alignmentAnimation={{
        disabled: true,
      }}
      zoomAnimation={{
        disabled: true,
      }}
      doubleClick={{
        disabled: true,
      }}
      limitToBounds={false}
      minScale={MIN_SCALE}
      maxScale={MAX_SCALE}
      wheel={{ step: 0.02 }}
    >
      {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
        <GraphWrapper
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetTransform={resetTransform}
          setTransform={setTransform}
        />
      )}
    </TransformWrapper>
  );
}

const GraphWrapper = memo(
  ({ zoomIn, zoomOut, resetTransform, setTransform }: any) => {
    const wrapperRef = useRef(null);

    const { width: drawingWidth, height: drawingHeight } =
      useElementSize(wrapperRef);

    return (
      <StyledGraphWrapper ref={wrapperRef}>
        <Graph
          setTransform={setTransform}
          drawingWidth={drawingWidth}
          drawingHeight={drawingHeight}
        />
        <Navigation
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetTransform={resetTransform}
          setTransform={setTransform}
          drawingWidth={drawingWidth}
          drawingHeight={drawingHeight}
        />
      </StyledGraphWrapper>
    );
  },
  () => true, //do not update, ever, the props are always the same functions
);

const StyledGraphWrapper = styled.div`
  position: relative;
  flex: 1;
  .react-transform-wrapper,
  .react-transform-component {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;
