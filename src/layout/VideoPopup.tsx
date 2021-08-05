import Draggable from "react-draggable";
import React from "react";
import { Toast } from "react-bootstrap";
import { setVideo } from "store/alertSlice";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";

export default function VideoPopup() {
  const dispatch = useDispatch();
  const video = useAppSelector(({ alert }) => alert.video);

  if (!video) return null;

  return (
    <Draggable bounds="parent">
      <StyledToast onClose={() => dispatch(setVideo(undefined))} show>
        <Toast.Header>
          <strong className="mr-auto">{video.label}</strong>
        </Toast.Header>
        <StyledBody>
          <IFrameWrapper className="mb-2">
            <iframe
              src={video.embedLink}
              title="YouTube video player"
              allowFullScreen
            />
          </IFrameWrapper>
        </StyledBody>
      </StyledToast>
    </Draggable>
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

const StyledToast = styled(Toast)`
  position: absolute;
  left: 10px;
  top: 10px;
  width: 400px;
  cursor: move;
  z-index: 99;
`;

const StyledBody = styled(Toast.Body)`
  padding: 0;
`;
