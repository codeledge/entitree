/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prefer-arrow-callback */

import { CHILD_ID, EYE_COLOR_ID, GENI_ID } from "../../constants/properties";
import {
  DOWN_SYMBOL,
  LEFT_SYMBOL,
  RIGHT_SYMBOL,
  UP_SYMBOL,
} from "../../constants/tree";
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
import { EntityNode } from "types/EntityNode";
import { Image } from "types/Entity";
import { MdChildCare } from "react-icons/md";
import { Theme } from "constants/themes";
import clsx from "clsx";
import { useAppSelector } from "store";

export default memo(function Node({ node }: { node: EntityNode }) {
  const [showModal, setShowModal] = useState(false);
  const [thumbnails, setThumbnails] = useState<Image[]>(
    node.data.thumbnails || [],
  );
  const [images, setImages] = useState<Image[]>(node.data.images || []);
  const [faceImage, setFaceImage] = useState<Image>();
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const theme = useTheme() as Theme;

  const settings = useAppSelector(({ settings: s }) => s);
  const navigation = useAppSelector(({ navigation: n }) => n);

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
          {navigation.currentPropId === CHILD_ID && (
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
          {navigation.currentPropId === CHILD_ID && (
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
        navigation.currentPropId === CHILD_ID && (
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
  box-sizing: content-box;
  border-radius: ${({ theme }) => theme.nodeBorderRadius}px;
  border: ${({ theme }) => theme.nodeBorder};
  box-shadow: ${({ theme }) => theme.nodeBoxShadow};
  &.focused {
    box-shadow: ${({ theme }) => theme.nodeFocusedBoxShadow};
  }
  height: ${({ theme }) => theme.nodeHeight}px;
  width: ${({ theme }) => theme.nodeWidth}px;
  background-color: ${({ theme }) => theme.nodeBackgroundColor};
  display: flex;
  ${({ theme }) => theme.nodeFlexDirection === "row" && `align-items: center`};
  ${({ theme }) =>
    theme.nodeFlexDirection === "column" && `justify-content: center`};
  ${({ theme }) => theme.nodeCss};
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
  width: ${({ theme }) => theme.thumbWidth}px;
  height: ${({ theme }) => theme.thumbHeight}px;
  border-radius: ${({ theme }) => theme.thumbBorderRadius}px;
  ${({ theme }) =>
    theme.nodeFlexDirection === "row" &&
    `margin-left: ${(theme.nodeHeight - theme.thumbHeight) / 2}px`};
  ${({ theme }) =>
    theme.nodeFlexDirection === "column" &&
    `margin-top: ${(theme.nodeWidth - theme.thumbWidth) / 2}px`};
  .thumbnailCounter {
    display: ${({ theme }) => theme.thumbCounterDisplay};
  }
`;

const ThemedContent = styled.div<{ hasSecondLabel?: boolean }>`
  //use margin to get width 100% calculations eg dates
  margin-left: ${({ theme }) => theme.contentPaddingLeft}px;
  margin-top: ${({ theme }) => theme.contentPaddingTop}px;
  .four-line-clamp {
    -webkit-line-clamp: ${({ theme }) => theme.contentLineClamp};
  }
  .label {
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
  }
  .dates {
    display: ${({ theme }) => theme.datesDisplay};
    text-align: ${({ theme }) => theme.labelTextAlign};
    font-size: ${({ theme }) => theme.datesFontSize}px;
  }
`;
