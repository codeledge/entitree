/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prefer-arrow-callback */

import { FaEye, FaFemale, FaMale } from "react-icons/fa";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";
import { GiBigDiamondRing, GiPerson } from "react-icons/gi";
import React, { memo, useEffect, useMemo, useState } from "react";
import { RiGroupLine, RiParentLine } from "react-icons/ri";
import styled, { useTheme } from "styled-components";
import {
  toggleChildren,
  toggleParents,
  toggleSiblings,
  toggleSpouses,
} from "store/treeSlice";

import { BsImage } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { CHILD_ID } from "constants/properties";
import { EntityNode } from "types/EntityNode";
import { Image } from "types/Entity";
import { MdChildCare } from "react-icons/md";
import { Theme } from "constants/themes";
import clsx from "clsx";
import { useAppSelector } from "store";

export default memo(({ node }: { node: EntityNode }) => {
  const [showModal, setShowModal] = useState(false);
  const [thumbnails, setThumbnails] = useState<Image[]>(
    node.data.thumbnails || [],
  );
  const [images, setImages] = useState<Image[]>(node.data.images || []);
  const [faceImage, setFaceImage] = useState<Image>();
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const theme = useTheme() as Theme;

  const settings = useAppSelector(({ settings: s }) => s);
  const { currentProp } = useAppSelector(({ navigation }) => navigation);

  const hideModal = () => {
    setShowModal(false);
  };

  const {
    data: { gender, isHuman },
  } = node;

  const currentThumbnail = thumbnails[thumbnailIndex];

  const onThumbClick =
    thumbnails.length > 1
      ? () => setThumbnailIndex((thumbnailIndex + 1) % thumbnails.length)
      : undefined;

  const hasLabelOnly =
    theme.descriptionDisplay === "none" && !settings.secondLanguageCode;

  const hasSecondLabel = Boolean(
    settings.secondLanguageCode &&
      node.data.secondLabel &&
      node.data.label !== node.data.secondLabel,
  );

  return (
    <ThemedNodeOuter
      style={{
        left: node.x,
        top: node.y,
      }}
    >
      <ThemedNodeInner>
        {theme.thumbDisplay && (
          <ThemedThumbnail
            className={clsx("imgWrapper", {
              hasThumbnails: thumbnails.length > 1,
            })}
            onClick={onThumbClick}
          >
            {(!thumbnails || !thumbnails.length) && (
              <span className="defaultImgMessage">
                {isHuman && gender ? (
                  <>
                    {gender === "male" && <FaMale />}
                    {gender === "female" && <FaFemale />}
                    {gender === "thirdgender" && <GiPerson />}
                  </>
                ) : (
                  <BsImage />
                )}
              </span>
            )}
            {currentThumbnail && (
              <>
                {settings.showFace && faceImage ? (
                  <img
                    alt={faceImage?.alt}
                    src={
                      faceImage.url +
                      (settings.imageType === "head" ? "?factor=1.5" : "")
                    }
                    title={faceImage.alt}
                  />
                ) : (
                  <img
                    alt={currentThumbnail.alt}
                    src={currentThumbnail.url}
                    title={currentThumbnail.alt}
                  />
                )}
                {thumbnails.length > 1 && (
                  <span className="thumbnailCounter">
                    {thumbnailIndex + 1}/{thumbnails.length}
                  </span>
                )}
              </>
            )}
          </ThemedThumbnail>
        )}
        <ThemedContent className="content" hasSecondLabel={hasSecondLabel}>
          <div
            className={clsx({
              "four-line-clamp": !hasLabelOnly,
            })}
          >
            {node.isRoot ? (
              <h1
                className={clsx(`label btn btn-link mb-0`, {
                  "four-line-clamp": hasLabelOnly,
                })}
                role="button"
                tabIndex={0}
                onKeyPress={() => setShowModal(true)}
                onClick={() => setShowModal(true)}
                title={
                  node.data.label
                    ? `Show ${node.data.label} details`
                    : undefined
                }
              >
                {node.data.birthName && settings.showBirthName ? (
                  node.data.birthName
                ) : node.data.label ? (
                  node.data.label
                ) : (
                  <i>Unlabelled</i>
                )}
              </h1>
            ) : (
              <span
                className={clsx(`label btn btn-link`, {
                  "four-line-clamp": hasLabelOnly,
                })}
                role="button"
                tabIndex={0}
                onKeyPress={() => setShowModal(true)}
                onClick={() => setShowModal(true)}
                title={
                  node.data.label
                    ? `Show ${node.data.label} details`
                    : undefined
                }
              >
                {node.data.birthName && settings.showBirthName ? (
                  node.data.birthName
                ) : node.data.label ? (
                  node.data.label
                ) : (
                  <i>Unlabelled</i>
                )}
              </span>
            )}
            {hasSecondLabel && (
              <>
                <br />
                <span className="label labelsecondLabel">
                  {node.data.secondLabel}
                </span>
              </>
            )}
            {node.data.description && theme.descriptionDisplay !== "none" && (
              <>
                <br />
                <span className="description" title={node.data.description}>
                  {node.data.description}
                </span>
              </>
            )}
          </div>
          <div className="dates">
            {node.data.lifeSpan
              ? theme.datesYearOnly
                ? node.data.lifeSpanInYears
                : node.data.lifeSpan
              : node.data.startEndSpan
              ? node.data.startEndSpan
              : node.data.inceptionAblishedSpan
              ? node.data.inceptionAblishedSpan
              : ""}
          </div>
        </ThemedContent>
      </ThemedNodeInner>

      {node.data.leftIds && !!node.data.leftIds.length && (
        <Button
          className="siblingToggle relativeToggle"
          variant="link"
          disabled={node.loadingSiblings}
          onClick={() => toggleSiblings(node)}
          title={(node._siblingsExpanded ? "Collapse" : "Expand") + " siblings"}
        >
          <div className="value">{node.data.leftIds.length}</div>
          <div className="chevron mt-1 mb-1">
            {node._siblingsExpanded ? <FiChevronRight /> : <FiChevronLeft />}
          </div>
          <div className="icon">
            <RiGroupLine />
          </div>
        </Button>
      )}
      {node.data.rightIds && !!node.data.rightIds.length && (
        <Button
          className="spouseToggle relativeToggle"
          variant="link"
          disabled={node.loadingSpouses}
          onClick={() => toggleSpouses(node)}
          title={(node._spousesExpanded ? "Collapse" : "Expand") + " spouses"}
        >
          <div className="value">{node.data.rightIds.length}</div>
          <div className="chevron mt-1 mb-1">
            {node._spousesExpanded ? <FiChevronLeft /> : <FiChevronRight />}
          </div>
          <div className="icon">
            <GiBigDiamondRing />
          </div>
        </Button>
      )}
      {node.data.upIds && !!node.data.upIds.length && (
        <Button
          className="parentToggle relativeToggle"
          variant="link"
          disabled={node.loadingParents}
          onClick={() => toggleParents(node)}
        >
          <span className="value">{node.data.upIds.length}</span>
          <span className="chevron ml-1 mr-1">
            {node._parentsExpanded ? <FiChevronDown /> : <FiChevronUp />}
          </span>
          {currentProp?.id === CHILD_ID && (
            <span className="icon">
              <RiParentLine />
            </span>
          )}
        </Button>
      )}
      {node.data.downIds && !!node.data.downIds.length && (
        <Button
          className="childrenToggle relativeToggle"
          variant="link"
          disabled={node.loadingChildren}
          onClick={() => toggleChildren(node)}
        >
          <span className="value">{node.data.childrenCount}</span>
          <span className="chevron ml-1 mr-1">
            {node._childrenExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </span>
          {currentProp?.id === CHILD_ID && (
            <span className="icon">
              <MdChildCare />
            </span>
          )}
        </Button>
      )}
      {node.data.downIds &&
        !node.data.downIds.length &&
        !!node.data.childrenCount &&
        node.data.childrenCount > 0 &&
        currentProp?.id === CHILD_ID && (
          <Button
            className="childrenToggle relativeToggle"
            variant="link"
            title="Children not available, please add them on wikidata.org"
          >
            <span className="value">{node.data.childrenCount}</span>
            <span className="icon">
              <MdChildCare />
            </span>
          </Button>
        )}
    </ThemedNodeOuter>
  );
});

const ThemedNodeOuter = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all ease-in-out 0.2s;
  box-sizing: content-box;
  border-radius: ${({ theme }) => theme.nodeBorderRadius}px;
  border: ${({ theme }) => theme.nodeBorder};
  box-shadow: ${({ theme }) => theme.nodeBoxShadow};
  height: ${({ theme }) => theme.nodeHeight}px;
  width: ${({ theme }) => theme.nodeWidth}px;
  background-color: ${({ theme }) => theme.nodeBackgroundColor};
  display: flex;
  ${({ theme }) => theme.nodeFlexDirection === "row" && `align-items: center`};
  ${({ theme }) =>
    theme.nodeFlexDirection === "column" && `justify-content: center`};
  ${({ theme }) => theme.nodeCss};

  .downPropLabel,
  .upPropLabel {
    position: absolute;
    left: 50%;
    span {
      position: absolute;
      padding-bottom: 3px;
      font-size: 14px;
      color: gray;
      white-space: nowrap;
      transform: translate(-50%, -50%);
    }
  }
  .relativeToggle {
    position: absolute;
    padding: 3px;
    font-size: 12px;
    font-weight: bold;
    //background-color: red;
    line-height: 1;
    transition: all;
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
      font-size: 16px;
      @media print {
        display: none;
      }
    }
  }
  .siblingToggle {
    right: 100%;
  }
  .spouseToggle {
    left: 100%;
  }
  .siblingToggle,
  .spouseToggle {
    top: 50%;
    transform: translateY(-50%);
  }
  .parentToggle,
  .childrenToggle {
    left: 50%;
    white-space: nowrap;
    transform: translateX(-50%);
    .value {
      display: inline-block;
      min-width: 1em; //default to optional icon width for central alignment
    }
  }
  .parentToggle {
    bottom: 100%;
  }
  .childrenToggle {
    top: 100%;
  }

  //SETTINGS
  &.female {
    .showGenderColor & {
      background-color: #ffcccc;
    }
  }
  &.male {
    .showGenderColor & {
      background-color: #ccd9ff;
    }
  }
  &.thirdgender {
    .showGenderColor & {
      //background-color: rgba(238, 130, 238, 0.11);
    }
  }
  .relativeToggle {
    .hideToggleButton & {
      display: none;
    }
  }
  .colorIcons {
    position: absolute;
    bottom: 0;
    right: 2px;
  }
`;

const ThemedNodeInner = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: ${({ theme }) => theme.nodeFlexDirection};
  ${({ theme }) =>
    theme.nodeFlexDirection === "row" && `height: ${theme.thumbHeight}px`};
  ${({ theme }) =>
    theme.nodeFlexDirection === "column" && `width: ${theme.thumbWidth}px`};
`;

const ThemedThumbnail = styled.div`
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  width: ${({ theme }) => theme.thumbWidth}px;
  height: ${({ theme }) => theme.thumbHeight}px;
  border-radius: ${({ theme }) => theme.thumbBorderRadius}px;
  ${({ theme }) =>
    theme.nodeFlexDirection === "row" &&
    `margin-left: ${(theme.nodeHeight - theme.thumbHeight) / 2}px`};
  ${({ theme }) =>
    theme.nodeFlexDirection === "column" &&
    `margin-top: ${(theme.nodeWidth - theme.thumbWidth) / 2}px`};
  &.hasThumbnails {
    cursor: pointer;
  }
  .defaultImgMessage {
    color: gray;
    font-size: 50px;
    font-style: italic;
    opacity: 0.3;
    display: block;
    text-align: center;
    top: -4px;
    white-space: nowrap;
  }
  img {
    object-fit: cover;
    object-position: top;
    width: 100%;
    font-size: 12px; //for alt text
  }
  .thumbnailCounter {
    position: absolute;
    right: 2px;
    bottom: 2px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 15px;
    font-size: 10px;
    line-height: 1;
    padding: 2px 4px 3px;
    cursor: pointer;
    z-index: 1;
    display: ${({ theme }) => theme.thumbCounterDisplay};
  }
`;

const ThemedContent = styled.div<{ hasSecondLabel?: boolean }>`
  position: relative;
  flex-grow: 1;
  //use margin to get width 100% calculations eg dates
  margin-left: ${({ theme }) => theme.contentPaddingLeft}px;
  margin-top: ${({ theme }) => theme.contentPaddingTop}px;
  .four-line-clamp {
    -webkit-line-clamp: ${({ theme }) => theme.contentLineClamp};
    display: -webkit-box;
    -webkit-box-orient: vertical;
    //-webkit-line-clamp: => moved to Node.js
    line-height: 1; // leave 1, the children will be proportional to this
    overflow: hidden;
  }
  .label {
    //do not set display, will come from theme
    vertical-align: text-top; //allow text start from top despite the line height
    border: 0;
    padding: 0;
    font-weight: bold;
    line-height: 1.2;
    @media print {
      color: gray;
    }
    &:focus {
      outline: none;
      border: 0;
      box-shadow: none;
      text-decoration: underline;
    }
    word-break: break-word;
    text-align: ${({ theme }) => theme.labelTextAlign};
    font-size: ${({ theme }) => theme.labelFontSize}px;
    color: ${({ theme }) => theme.labelFontColor};
    //if there is no description we can have this block and have the dots of the same color of the text
    //but only ONE can be display block
    display: ${({ theme, hasSecondLabel }) =>
      theme.descriptionDisplay === "none" && !hasSecondLabel
        ? "block"
        : "inline"};
  }
  .description {
    //if "block" the dots will have the same color of the text
    display: ${({ theme }) => theme.descriptionDisplay};
    line-height: 1.1;
    font-size: 12px;
    color: #666;
  }
  .dates {
    //do not set display nor font size, will come from theme
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    bottom: 0;
    width: 100%; //this applies to all themes
    display: ${({ theme }) => theme.datesDisplay};
    text-align: ${({ theme }) => theme.labelTextAlign};
    font-size: ${({ theme }) => theme.datesFontSize}px;
  }
`;
