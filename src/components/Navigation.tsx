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

import { FaRegShareSquare } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import ReactGA from "react-ga";
import { RiFocus3Line } from "react-icons/ri";
import { SITE_NAME } from "constants/meta";
import styled from "styled-components";
import { useRouter } from "next/dist/client/router";

export default memo(
  ({ zoomIn, zoomOut, focusedNode, recenter, fitTree }: any) => {
    return (
      <StyledNavigation>
        <ZoomInButton zoomIn={zoomIn} />
        <ZoomOutButton zoomOut={zoomOut} />
        <CenterTreeButton focusedNode={focusedNode} recenter={recenter} />
        <FitTreeButton fitTree={fitTree} />
        <ShareButton />
      </StyledNavigation>
    );
  },
);

const ZoomInButton = memo(({ zoomIn }: any) => {
  const zoomInWrapper = (e) => {
    ReactGA.event({
      category: "Navigation",
      action: "zoomIn",
    });
    zoomIn(e);
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
  const zoomOutWrapper = (e) => {
    ReactGA.event({
      category: "Navigation",
      action: "zoomOut",
    });
    zoomOut(e);
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

const CenterTreeButton = memo(({ recenter }: any) => {
  const recenterWrapper = () => {
    ReactGA.event({
      category: "Navigation",
      action: "recenter",
      //label: focusedNode.data.label,
    });
    recenter();
  };

  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id="center">Center tree</Tooltip>}
    >
      <Button variant="light" onClick={recenterWrapper}>
        <RiFocus3Line />
      </Button>
    </OverlayTrigger>
  );
});

const FitTreeButton = memo(({ fitTree }: any) => {
  const fitTreeWrapper = () => {
    ReactGA.event({
      category: "Navigation",
      action: "fitTree",
    });
    fitTree();
  };

  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id="fit">Fit tree to screen</Tooltip>}
    >
      <Button variant="light" onClick={fitTreeWrapper}>
        <IoMdExpand />
      </Button>
    </OverlayTrigger>
  );
});

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
