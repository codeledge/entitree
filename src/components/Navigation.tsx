import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { FiMinus, FiPlus, FiPrinter } from "react-icons/fi";
import React, { memo, useState } from "react";
import styled, { useTheme } from "styled-components";

import { FaRegShareSquare } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import { MAX_SCALE } from "constants/tree";
import ReactGA from "react-ga";
import { RiFocus3Line } from "react-icons/ri";
import { SITE_NAME } from "constants/meta";
import { useAppSelector } from "store";
import { useRouter } from "next/dist/client/router";

export default memo(
  ({
    zoomIn,
    zoomOut,
    resetTransform,
    setTransform,
    drawingWidth,
    drawingHeight,
  }: any) => {
    return (
      <StyledNavigation>
        <ZoomInButton zoomIn={zoomIn} />
        <ZoomOutButton zoomOut={zoomOut} />
        <CenterTreeButton resetTransform={resetTransform} />
        <FitTreeButton
          setTransform={setTransform}
          drawingWidth={drawingWidth}
          drawingHeight={drawingHeight}
        />
        <ShareButton />
      </StyledNavigation>
    );
  },
);

const ZoomInButton = memo(({ zoomIn }: any) => {
  const zoomInWrapper = () => {
    ReactGA.event({
      category: "Navigation",
      action: "zoomIn",
    });
    zoomIn();
  };

  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id="zoomin">Zoom in</Tooltip>}
    >
      <Button variant="light" onClick={zoomInWrapper}>
        <FiPlus />
      </Button>
    </OverlayTrigger>
  );
});

const StyledNavigation = styled.div`
  @media print {
    display: none;
  }
  position: absolute;
  bottom: 15px;
  @media (min-width: 576px) {
    bottom: 10px;
  }
  left: 10px;
  width: 32px;
  .btn {
    margin-top: 3px;
    padding: 0;
    border: 1px solid lightgray;
    line-height: 1;
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
`;

const ZoomOutButton = memo(({ zoomOut }: any) => {
  const zoomOutWrapper = () => {
    ReactGA.event({
      category: "Navigation",
      action: "zoomOut",
    });
    zoomOut();
  };

  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id="zoomout">Zoom out</Tooltip>}
    >
      <Button variant="light" onClick={zoomOutWrapper}>
        <FiMinus />
      </Button>
    </OverlayTrigger>
  );
});

const CenterTreeButton = memo(
  ({ resetTransform }: { resetTransform: () => void }) => {
    const onRecenter = () => {
      ReactGA.event({
        category: "Navigation",
        action: "recenter",
        //label: focusedNode.data.label,
      });
      resetTransform();
    };

    return (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="center">Center tree</Tooltip>}
      >
        <Button variant="light" onClick={onRecenter}>
          <RiFocus3Line />
        </Button>
      </OverlayTrigger>
    );
  },
);

const FitTreeButton = memo(
  ({ setTransform, drawingWidth, drawingHeight }: any) => {
    const theme = useTheme();
    const { maxLeft, maxTop, maxRight, maxBottom } = useAppSelector(
      ({ tree }) => tree,
    );

    const onFitTree = () => {
      ReactGA.event({
        category: "Navigation",
        action: "fitTree",
      });

      const leftEdge = maxLeft - theme.nodeWidth; //should be theme.nodeWidth / 2 but give some padding
      const topEdge = maxTop - theme.nodeWidth / 2;
      const rightEdge = maxRight + theme.nodeWidth;
      const bottomEdge = maxBottom + theme.nodeWidth / 2;
      const actualWidth = rightEdge - leftEdge;
      const actualHeight = bottomEdge - topEdge;

      let nextScale;
      if (drawingWidth - actualWidth < drawingHeight - actualHeight) {
        nextScale = drawingWidth / actualWidth;
      } else {
        nextScale = drawingHeight / actualHeight;
      }
      if (nextScale > MAX_SCALE) nextScale = MAX_SCALE;

      const centerX = leftEdge + actualWidth / 2;
      const centerY = topEdge + actualHeight / 2;

      const halfWidth = drawingWidth / 2;
      const calculatedPositionX = halfWidth - (halfWidth + centerX) * nextScale;

      const halfHeight = drawingHeight / 2;
      const calculatedPositionY =
        halfHeight - (halfHeight + centerY) * nextScale;

      setTransform(calculatedPositionX, calculatedPositionY, nextScale);
    };

    return (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="fit">Fit tree to screen</Tooltip>}
      >
        <Button variant="light" onClick={onFitTree}>
          <IoMdExpand />
        </Button>
      </OverlayTrigger>
    );
  },
);

const ShareButton = memo(() => {
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();
  const location = "";
  const title = "";
  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="share">Share</Tooltip>}
      >
        <Button variant="light" onClick={() => setShowShareModal(true)}>
          <FaRegShareSquare />
        </Button>
      </OverlayTrigger>
      <Modal
        show={showShareModal}
        centered
        onHide={() => setShowShareModal(false)}
        className="ShareModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Share this tree</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="shareButton">
            <FacebookShareButton
              url={location}
              quote={title}
              hashtag={SITE_NAME}
            >
              <FacebookIcon /> Share on Facebook
            </FacebookShareButton>
          </div>
          <div className="shareButton">
            <TwitterShareButton
              url={location}
              title={title}
              hashtags={[SITE_NAME]}
            >
              <TwitterIcon /> Share on Twitter
            </TwitterShareButton>
          </div>
          <div className="shareButton">
            <RedditShareButton url={location} title={title}>
              <RedditIcon /> Share on Reddit
            </RedditShareButton>
          </div>
          <div className="shareButton">
            <WhatsappShareButton url={location} title={title}>
              <WhatsappIcon /> Share on Whatsapp
            </WhatsappShareButton>
          </div>
          <div className="shareButton">
            <TelegramShareButton url={location} title={title}>
              <TelegramIcon /> Share on Telegram
            </TelegramShareButton>
          </div>
          <div className="shareButton">
            <Button
              variant="none"
              onClick={async () => {
                await setShowShareModal(false);
                window.print();
              }}
            >
              <FiPrinter /> Print this page
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowShareModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});
