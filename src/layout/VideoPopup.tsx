import { Container, Toast } from "react-bootstrap";

import React, { useState } from "react";
import styled from "styled-components";
import Div100vh from "react-div-100vh";

export default function VideoPopup() {
  const [show, setShow] = useState(true);

  return (
    <StyledVideoPopup>
  {/*<Container>*/}
    <Toast onClose={() => setShow(false)} show={show}>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">Video of </strong>
        <small>11 mins ago</small>
      </Toast.Header>
      <Toast.Body>

        <IFrameWrapper className="mb-2">
          <iframe
            src="https://www.youtube.com/embed/NgK4fJ709Xo"
            title="YouTube video player"
            allowFullScreen
          />
        </IFrameWrapper>

      </Toast.Body>
    </Toast>
  {/*</Container>*/}
    </StyledVideoPopup>
);
}
const IFrameWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9, for an aspect ratio of 1:1 change to this value to 100% */

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const StyledVideoPopup = styled(Div100vh)`
  position:absolute;
  bottom:20px;
  right:20px;
  // width:200px;
      height:250px;
  z-index: 3;//overlap the footer
  
  .toast {
      width: 350px;
      height:250px;
  }
`;


