/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prefer-arrow-callback */

import {
  BIRTH_NAME_ID,
  CHILD_ID,
  NAME_IN_KANA_ID,
  NICKNAME_ID,
  PARTNER_ID,
  SPOUSE_ID,
} from "constants/properties";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEye, FaFemale, FaMale, FaUser } from "react-icons/fa";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";
import { GiBigDiamondRing, GiPerson } from "react-icons/gi";
import React, { memo, useEffect, useState } from "react";
import { RiGroupLine, RiParentLine } from "react-icons/ri";
import styled, { css, useTheme } from "styled-components";
import {
  toggleChildren,
  toggleParents,
  toggleSiblings,
  toggleSpouses,
} from "actions/treeActions";

import { BsImage } from "react-icons/bs";
import DetailsModal from "modals/DetailsModal";
import { EntityNode } from "types/EntityNode";
import { Image } from "types/Entity";
import { LangCode } from "types/Lang";
import { MdChildCare } from "react-icons/md";
import { SettingsState } from "store/settingsSlice";
import addLifeSpan from "../lib/addLifeSpan";
import clsx from "clsx";
import { getDataprickImages } from "services/imageService";
import getEntitiesLabel from "treeHelpers/getEntitiesLabel";
import getFandomPageProps from "../services/fandomService";
import getGeniProfile from "services/geniService";
import { isProperyId } from "helpers/isPropertyId";
import { isValidImage } from "helpers/isValidImage";
import { useAppSelector } from "store";
import useBookmarks from "hooks/useBookmarks";
import { useDispatch } from "react-redux";
import usePreload from "hooks/usePreload";
import useRootExpanded from "hooks/useRootExpanded";
import useVideoOverlay from "hooks/useVideoOverlay";

export default memo(({ node }: { node: EntityNode }) => {
  const dispatch = useDispatch();

  usePreload(node);
  useRootExpanded(node);
  useBookmarks(node);
  useVideoOverlay(node);

  const [showModal, setShowModal] = useState(false);
  const [lifeSpanInYears, setLifeSpanInYears] = useState(node.lifeSpanInYears);
  const [thumbnails, setThumbnails] = useState<Image[]>(node.thumbnails || []);
  const [images, setImages] = useState<Image[]>(node.images || []);
  const [faceImage, setFaceImage] = useState<Image>();
  useEffect(() => {
    getDataprickImages(node.id.substr(1)).then((imageSet) => {
      imageSet.forEach(({ faceImage, thumbnail }) => {
        setFaceImage(faceImage);
        setThumbnails((thumbnails) => [thumbnail, ...thumbnails]);
        setImages((images) => [thumbnail, ...images]);
      });
    });
    if (settings.showExternalImages) {
      if (node.peoplepillImageUrl) {
        isValidImage(node.peoplepillImageUrl).then((valid) => {
          if (valid) {
            const ppImage = {
              url: node.peoplepillImageUrl,
              alt: `Image from peoplepill`,
            } as Image;
            setThumbnails((thumbnails) => [ppImage, ...thumbnails]);
            setImages((images) => [ppImage, ...images]);
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (node.geniId && settings.showExternalImages) {
      getGeniProfile(node.geniId).then((geniProfile) => {
        if (geniProfile?.mugshot_urls?.thumb) {
          const geniImg = {
            url: geniProfile.mugshot_urls.thumb,
            alt: `Geni.com image`,
          } as Image;
          setThumbnails((thumbnails) => thumbnails.concat(geniImg));
          setImages((images) => images.concat(geniImg));
        }

        //add Geni dates and country
        if (
          geniProfile &&
          (geniProfile.birth || geniProfile.death) &&
          node.lifeSpanInYears === undefined
        ) {
          if (geniProfile.birth && geniProfile.birth.date) {
            node.birthYear = "" + geniProfile.birth.date.year; //convert to string
            if (
              geniProfile.birth.date.circa &&
              geniProfile.birth.date.circa === true
            ) {
              node.birthYear = "~" + node.birthYear;
            }
          }
          if (geniProfile.death && geniProfile.death.date) {
            node.deathYear = "" + geniProfile.death.date.year;
            if (
              geniProfile.death.date.circa &&
              geniProfile.death.date.circa === true
            ) {
              node.deathYear = "~" + node.deathYear;
            }
          }
          addLifeSpan(node);
          setLifeSpanInYears(node.lifeSpanInYears);
        }
        if (
          geniProfile &&
          geniProfile.birth &&
          geniProfile.birth.location &&
          geniProfile.birth.location.country_code &&
          !birthCountry
        ) {
          setBirthCountry({
            code: geniProfile.birth.location.country_code,
            name: geniProfile.birth.location.country,
            text: "Born in " + geniProfile.birth.location.country + " (geni)",
          });
        } else if (
          geniProfile &&
          geniProfile.location &&
          geniProfile.location.country_code &&
          !birthCountry
        ) {
          setBirthCountry({
            code: geniProfile.location.country_code,
            name: geniProfile.location.country,
            text: "Lived in " + geniProfile.location.country + " (geni)",
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (node.fandomHost && node.fandomId) {
      getFandomPageProps(node.fandomHost, node.fandomId).then((fandomData) => {
        if (fandomData?.query?.pages) {
          const page: any = Object.values(fandomData.query.pages)[0];

          if (page.pageprops) {
            const pageprops = JSON.parse(page.pageprops.infoboxes);
            if (pageprops[0] && pageprops[0].data) {
              const image = pageprops[0].data.find(
                (entry) => entry.type === "image",
              ).data[0];

              if (image) {
                const fandomImage = {
                  url: image.url.split("/revision/")[0],
                  alt: `Fandom image, ${image.name}`,
                  source: node.fandomUrl,
                };
                setThumbnails((thumbnails) => thumbnails.concat(fandomImage));
                setImages((images) => images.concat(fandomImage));
              }
            }
          }
        }
      });
    }
  }, []);

  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const theme = useTheme();

  const [birthCountry, setBirthCountry] = useState(node.countryOfCitizenship);

  const settings = useAppSelector(({ settings: s }) => s);
  const { currentProp } = useAppSelector(({ tree }) => tree);

  const onHideModal = () => {
    setShowModal(false);
  };

  const currentThumbnail = thumbnails[thumbnailIndex];

  const onThumbClick =
    thumbnails.length > 1
      ? () =>
          setThumbnailIndex(
            (thumbnailIndex) => (thumbnailIndex + 1) % thumbnails.length,
          )
      : undefined;

  const hasLabelOnly =
    theme.descriptionDisplay === "none" && !settings.secondLabelCode;

  const [secondLabel, setSecondLabel] = useState<string>();
  const hasSecondLabel = Boolean(secondLabel);
  useEffect(() => {
    if (settings.secondLabelCode) {
      if (isProperyId(settings.secondLabelCode)) {
        switch (settings.secondLabelCode) {
          case BIRTH_NAME_ID:
            setSecondLabel(node.birthName);
            break;
          case NICKNAME_ID:
            setSecondLabel(node.nickName);
            break;
          case NAME_IN_KANA_ID:
            setSecondLabel(node.nameInKana);
            break;
          default:
            break;
        }
      } else {
        //if(isLangCode(settings.secondLabelCode))
        //check if language is already in the main languages
        getEntitiesLabel([node.id], settings.secondLabelCode as LangCode).then(
          ([secondLabel]) => {
            setSecondLabel(secondLabel);
          },
        );
      }
    } else {
      setSecondLabel(undefined);
    }
  }, [settings.secondLabelCode]);

  //this is needed to make it work with root being server side rightIds added!
  const filteredRightIds = node.rightIds?.filter((rightId) => {
    if (
      settings.rightEntityOption.propIds.indexOf(SPOUSE_ID) > -1 &&
      node.spousesIds?.includes(rightId)
    )
      return true;
    if (
      settings.rightEntityOption.propIds.indexOf(PARTNER_ID) > -1 &&
      node.partnersIds?.includes(rightId)
    )
      return true;

    return false;
  });

  return (
    <ThemedNodeOuter
      style={{
        left: node.x,
        top: node.y,
      }}
      {...settings}
      gender={node.gender}
    >
      <ThemedNodeInner>
        {theme.thumbDisplay && (
          <ThemedThumbnail
            className={clsx("imgWrapper", {
              hasThumbnails: thumbnails.length > 1,
            })}
            style={{
              overflow: "visible",
            }}
            onClick={onThumbClick}
          >
            {(!thumbnails || !thumbnails.length) && (
              <span className="defaultImgMessage">
                {node.isHuman && node.gender ? (
                  <>
                    {node.gender === "male" && <FaMale />}
                    {node.gender === "female" && <FaFemale />}
                    {node.gender === "thirdgender" && <GiPerson />}
                  </>
                ) : (
                  <BsImage />
                )}
              </span>
            )}
            {settings.showFace && faceImage ? (
              <img
                alt=""
                className="imgDatabase"
                src={
                  faceImage.url +
                  (settings.imageType === "head" ? "?factor=1.5" : "")
                }
                title={faceImage?.title}
              />
            ) : (
              <>
                {currentThumbnail && (
                  <>
                    <img
                      alt={currentThumbnail.alt}
                      src={currentThumbnail.url}
                      title={currentThumbnail.alt}
                    />
                    {thumbnails.length > 1 && (
                      <span className="thumbnailCounter">
                        {thumbnailIndex + 1}/{thumbnails.length}
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </ThemedThumbnail>
        )}
        <ThemedContent className="content" hasSecondLabel={hasSecondLabel}>
          <div
            className={clsx({
              "line-clamp": !hasLabelOnly,
            })}
          >
            {node.isRoot ? (
              <h1
                className={clsx(`label btn btn-link mb-0`, {
                  "line-clamp": hasLabelOnly,
                })}
                role="button"
                tabIndex={0}
                onKeyPress={() => setShowModal(true)}
                onClick={() => setShowModal(true)}
                title={node.label ? `Show ${node.label} details` : undefined}
              >
                {node.birthName && settings.showBirthName ? (
                  node.birthName
                ) : node.label ? (
                  node.label
                ) : (
                  <i>Unlabelled</i>
                )}
              </h1>
            ) : (
              <span
                className={clsx(`label btn btn-link`, {
                  "line-clamp": hasLabelOnly,
                })}
                role="button"
                tabIndex={0}
                onKeyPress={() => setShowModal(true)}
                onClick={() => setShowModal(true)}
                title={node.label ? `Show ${node.label} details` : undefined}
              >
                {node.birthName && settings.showBirthName ? (
                  node.birthName
                ) : node.label ? (
                  node.label
                ) : (
                  <i>Unlabelled</i>
                )}
              </span>
            )}
            {hasSecondLabel && (
              <>
                <br />
                <span className="label labelsecondLabel">{secondLabel}</span>
              </>
            )}
            {node.description && theme.descriptionDisplay !== "none" && (
              <>
                <br />
                <span className="description" title={node.description}>
                  {node.description}
                </span>
              </>
            )}
            {settings.showExtraInfo &&
              settings.extraInfo === "occupation" &&
              node.occupations && (
                <div className="occupation">
                  {node.occupations.map((entry) => (
                    <span title={entry.itemLabel}>{entry.emoji}</span>
                  ))}
                </div>
              )}
          </div>
          <div className="dates">
            {node.lifeSpan || lifeSpanInYears
              ? theme.datesYearOnly
                ? lifeSpanInYears
                : node.lifeSpan
              : node.startEndSpan
              ? node.startEndSpan
              : node.inceptionAblishedSpan
              ? node.inceptionAblishedSpan
              : ""}
          </div>
        </ThemedContent>
      </ThemedNodeInner>

      {settings.showExtraInfo && (
        <Badge>
          {settings.extraInfo === "countryFlag" && birthCountry && (
            <div className="flagIcons">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="country">{birthCountry.text}</Tooltip>}
              >
                <span>
                  <img
                    alt=""
                    src={`https://www.countryflags.io/${birthCountry.code}/flat/32.png`}
                    title={birthCountry.name}
                  />
                </span>
              </OverlayTrigger>
            </div>
          )}
          {node.eyeColor && settings.extraInfo === "eyeColor" && (
            <span
              className="eyeColor"
              title={node.eyeColor.itemLabel + " eyes"}
              style={{
                color: "#" + node.eyeColor.hex,
              }}
            >
              <FaEye size={25} />
            </span>
          )}
          {node.hairColor && settings.extraInfo === "hairColor" && (
            <span
              className="hairColor"
              title={node.hairColor.itemLabel}
              style={{
                color: "#" + node.hairColor.hex,
              }}
            >
              <FaUser />
            </span>
          )}
          {node.religion && settings.extraInfo === "religion" && (
            <div title={node.religion.itemLabel + " (wikidata)"}>
              {node.religion.emoji}
            </div>
          )}
        </Badge>
      )}

      {!settings.hideToggleButton && (
        <>
          {node.leftIds && !!node.leftIds.length && (
            <Button
              className="siblingToggle relativeToggle"
              variant="link"
              disabled={node.loadingSiblings}
              onClick={() => dispatch(toggleSiblings(node))}
              title={
                (node.siblingsTreeIds ? "Collapse" : "Expand") + " siblings"
              }
            >
              <div className="value">{node.leftIds.length}</div>
              <div className="chevron mt-1 mb-1">
                {node.siblingsTreeIds ? <FiChevronRight /> : <FiChevronLeft />}
              </div>
              <div className="icon">
                <RiGroupLine />
              </div>
            </Button>
          )}
          {!!filteredRightIds?.length && (
            <Button
              className="spouseToggle relativeToggle"
              variant="link"
              disabled={node.loadingSpouses}
              onClick={() => dispatch(toggleSpouses(node))}
              title={
                (node.spousesTreeIds ? "Collapse" : "Expand") +
                " spouses/partners"
              }
            >
              <div className="value">{filteredRightIds.length}</div>
              <div className="chevron mt-1 mb-1">
                {node.spousesTreeIds ? <FiChevronLeft /> : <FiChevronRight />}
              </div>
              <div className="icon">
                <GiBigDiamondRing />
              </div>
            </Button>
          )}
          {!!node.upIds?.length && (
            <Button
              className="parentToggle relativeToggle"
              variant="link"
              disabled={node.loadingParents}
              onClick={() => dispatch(toggleParents(node))}
            >
              <span className="value mr-1">{node.upIds.length}</span>
              <span className="chevron">
                {node.parentsTreeIds ? <FiChevronDown /> : <FiChevronUp />}
              </span>
              {currentProp?.id === CHILD_ID && (
                <span className="icon ml-1">
                  <RiParentLine />
                </span>
              )}
            </Button>
          )}
          {!!node.downIds?.length && (
            <Button
              className="childrenToggle relativeToggle"
              variant="link"
              disabled={node.loadingChildren}
              onClick={() => dispatch(toggleChildren(node))}
            >
              <span className="value mr-1">{node.childrenCount}</span>
              <span className="chevron">
                {node.childrenTreeIds ? <FiChevronUp /> : <FiChevronDown />}
              </span>
              {currentProp?.id === CHILD_ID && (
                <span className="icon ml-1">
                  <MdChildCare />
                </span>
              )}
            </Button>
          )}
          {node.downIds &&
            !node.downIds.length &&
            !!node.childrenCount &&
            node.childrenCount > 0 &&
            currentProp?.id === CHILD_ID && (
              <Button
                className="childrenToggle relativeToggle"
                variant="link"
                title="Children not available, please add them on wikidata.org"
              >
                <span className="value mr-1">{node.childrenCount}</span>
                <span className="icon">
                  <MdChildCare />
                </span>
              </Button>
            )}
        </>
      )}

      {showModal && (
        <DetailsModal
          onHideModal={onHideModal}
          node={node}
          nodeImages={images}
        />
      )}
    </ThemedNodeOuter>
  );
});

const ThemedNodeOuter = styled.div<SettingsState & { gender?: string }>`
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
    padding: 2px;
    font-size: 13px;
    font-weight: bold;
    line-height: 1;
    transition: all;
    min-height: 28px;
    display: flex;
    align-items: center;
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
      font-size: 20px;
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
    flex-direction: column;
  }
  .parentToggle,
  .childrenToggle {
    left: 50%;
    flex-direction: row;
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
  //  .colorIcons {
  //   position: absolute;
  //   bottom: 0;
  //   right: 2px;
  //   z-index: 2; //needed for tooltip
  // }
  .flagIcons {
    position: absolute;
    bottom: -5px;
    right: 0px;
    width: 32px;
    z-index: 2; //needed for tooltip
  }
  ${
    ({ showGenderColor, gender }) =>
      showGenderColor &&
      gender &&
      (gender === "female"
        ? css`
            background-color: #ffcccc;
          `
        : gender === "male"
        ? css`
            background-color: #ccd9ff;
          `
        : "")
    // gender === "thirdgender"
    // ? css`
    //     background-color: rgba(238, 130, 238, 0.11);
    //   `
    // : ""
  }
`;

const Badge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  // transform: translate(-50%, -50%);
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
  .imgDatabase {
    transform: translateY(-26px) scale(1.5);
    // border-bottom-left-radius: 30px;
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
  .line-clamp {
    -webkit-line-clamp: ${({ theme }) => theme.contentLineClamp};
    display: -webkit-box;
    -webkit-box-orient: vertical;
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
      theme.descriptionDisplay === "none" && !hasSecondLabel ? "" : "inline"};
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
    bottom: -1px;
    width: 100%; //this applies to all themes
    display: ${({ theme }) => theme.datesDisplay};
    text-align: ${({ theme }) => theme.labelTextAlign};
    font-size: ${({ theme }) => theme.datesFontSize}px;
  }
`;
