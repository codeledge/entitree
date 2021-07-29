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
import React, { memo, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";

import { FaRegShareSquare } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import ReactGA from "react-ga";
import { RiFocus3Line } from "react-icons/ri";
import { SITE_NAME } from "constants/meta";
import fitEdges from "treeHelpers/fitEdges";
import { useAppSelector } from "store";

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

      //node is translated -50%, -50%, so leave som margins
      fitEdges({
        drawingWidth,
        drawingHeight,
        rightX: maxRight,
        leftX: maxLeft - theme.nodeWidth,
        bottomY: maxBottom,
        topY: maxTop - theme.nodeHeight,
        setTransform,
      });
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
  const [url, setUrl] = useState("");
  const [title, seTitle] = useState("");
  useEffect(() => {
    setUrl(window.location.href);
    seTitle(document.title);
  }, []);

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
          <ShareButtonContainer>
            <FacebookShareButton url={url} quote={title} hashtag={SITE_NAME}>
              <FacebookIcon /> Share on Facebook
            </FacebookShareButton>
          </ShareButtonContainer>
          <ShareButtonContainer>
            <TwitterShareButton url={url} title={title} hashtags={[SITE_NAME]}>
              <TwitterIcon /> Share on Twitter
            </TwitterShareButton>
          </ShareButtonContainer>
          <ShareButtonContainer>
            <RedditShareButton url={url} title={title}>
              <RedditIcon /> Share on Reddit
            </RedditShareButton>
          </ShareButtonContainer>
          <ShareButtonContainer>
            <WhatsappShareButton url={url} title={title}>
              <WhatsappIcon /> Share on Whatsapp
            </WhatsappShareButton>
          </ShareButtonContainer>
          <ShareButtonContainer>
            <TelegramShareButton url={url} title={title}>
              <TelegramIcon /> Share on Telegram
            </TelegramShareButton>
          </ShareButtonContainer>
          <ShareButtonContainer>
            <Button
              variant="none"
              onClick={async () => {
                await setShowShareModal(false);
                window.print();
              }}
            >
              <FiPrinter /> Print this page
            </Button>
          </ShareButtonContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowShareModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

const ShareButtonContainer = styled.div`
  margin-bottom: 12px;
  svg {
    height: 3em;
    width: 3em;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 5px;
  }
  .btn {
    svg {
      font-size: 0.65em;
      margin: 0.5em 10px 0.5em 0.5em;
    }

    padding: 0 0.5em 0 0;
  }
`;
