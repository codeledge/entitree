import React, { memo, useState } from "react";
import ReactGA from "react-ga";
import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { FiMinus, FiPlus, FiPrinter } from "react-icons/fi";
import { FaRegShareSquare } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import { RiFocus3Line } from "react-icons/ri";
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import "./Navigation.scss";
import { SITE_NAME } from "../../../constants/meta";

export default memo(function Navigation({
  zoomIn,
  zoomOut,
  focusedNode,
  recenter,
  fitTree,
}) {
  return (
    <div className="Navigation">
      <ZoomInButton zoomIn={zoomIn} />
      <ZoomOutButton zoomOut={zoomOut} />
      <CenterTreeButton focusedNode={focusedNode} recenter={recenter} />
      <FitTreeButton fitTree={fitTree} />
      <ShareButton />
    </div>
  );
});

const ZoomInButton = memo(({ zoomIn }) => {
  const zoomInWrapper = (e) => {
    ReactGA.event({
      category: "Navigation",
      action: "zoomIn",
    });
    zoomIn(e);
  };

  return (
    <OverlayTrigger placement="right" overlay={<Tooltip>Zoom in</Tooltip>}>
      <Button variant="light" onClick={zoomInWrapper}>
        <FiPlus />
      </Button>
    </OverlayTrigger>
  );
});

const ZoomOutButton = memo(({ zoomOut }) => {
  const zoomOutWrapper = (e) => {
    ReactGA.event({
      category: "Navigation",
      action: "zoomOut",
    });
    zoomOut(e);
  };

  return (
    <OverlayTrigger placement="right" overlay={<Tooltip>Zoom out</Tooltip>}>
      <Button variant="light" onClick={zoomOutWrapper}>
        <FiMinus />
      </Button>
    </OverlayTrigger>
  );
});

const CenterTreeButton = memo(({ focusedNode, recenter }) => {
  const recenterWrapper = () => {
    ReactGA.event({
      category: "Navigation",
      action: "recenter",
      label: focusedNode.data.label,
    });
    recenter();
  };

  if (!focusedNode) return null;
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        <Tooltip>
          Center tree on {focusedNode && focusedNode.data.label}
        </Tooltip>
      }
    >
      <Button variant="light" onClick={recenterWrapper} disabled={!focusedNode}>
        <RiFocus3Line />
      </Button>
    </OverlayTrigger>
  );
});

const FitTreeButton = memo(({ fitTree }) => {
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
      overlay={<Tooltip>Fit tree to screen</Tooltip>}
    >
      <Button variant="light" onClick={fitTreeWrapper}>
        <IoMdExpand />
      </Button>
    </OverlayTrigger>
  );
});

const ShareButton = memo(() => {
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <>
      <OverlayTrigger placement="right" overlay={<Tooltip>Share</Tooltip>}>
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
              url={window.location.href}
              quote={document.title}
              hashtag={SITE_NAME}
            >
              <FacebookIcon /> Share on Facebook
            </FacebookShareButton>
          </div>
          <div className="shareButton">
            <TwitterShareButton
              url={window.location.href}
              title={document.title}
              hashtags={[SITE_NAME]}
            >
              <TwitterIcon /> Share on Twitter
            </TwitterShareButton>
          </div>
          <div className="shareButton">
            <RedditShareButton
              url={window.location.href}
              title={document.title}
            >
              <RedditIcon /> Share on Reddit
            </RedditShareButton>
          </div>
          <div className="shareButton">
            <WhatsappShareButton
              url={window.location.href}
              title={document.title}
            >
              <WhatsappIcon /> Share on Whatsapp
            </WhatsappShareButton>
          </div>
          <div className="shareButton">
            <TelegramShareButton
              url={window.location.href}
              title={document.title}
            >
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
