import { Button, Figure, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";

import { EntityNode } from "types/EntityNode";
import { FiExternalLink } from "react-icons/fi";
import { Image } from "types/Entity";
import { errorHandler } from "handlers/errorHandler";
import { getEntityUrl } from "helpers/getEntityUrl";
import getWikibaseEntitiesLabel from "wikibase/getWikibaseEntitiesLabel";
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import { missingImagesLink } from "services/imageService";
import { setLoadingEntity } from "store/treeSlice";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function DetailsModal({
  node,
  onHideModal,
  nodeImages,
}: {
  node: EntityNode;
  onHideModal: () => void;
  nodeImages: Image[];
}) {
  useEffect(() => {
    ReactGA.modalview("details");
  }, []);

  const { languageCode, dataSource } = useAppSelector(
    ({ settings }) => settings,
  );
  const { currentEntity, currentProp } = useAppSelector(({ tree }) => tree);
  const router = useRouter();

  const dispatch = useDispatch();
  const [images, setImages] = useState(nodeImages);
  const [birthPlace, setBirthPlace] = useState(node.birthPlace);
  const [deathPlace, setDeathPlace] = useState(node.deathPlace);
  const [wikipediaExtract, setWikipediaExtract] = useState<string>();

  useEffect(() => {
    if (node.wikipediaSlug) {
      getWikipediaArticle(node.wikipediaSlug, languageCode)
        .then(({ data: { extract, thumbnail } }) => {
          if (extract) setWikipediaExtract(extract);
          if (thumbnail && !images.length) {
            setImages((i) => [
              ...i,
              {
                url: thumbnail.source,
                alt: `${node.label}'s Wikipedia image`,
              },
            ]);
          }
        })
        .catch(errorHandler);
    }
  }, [languageCode, dataSource, images.length, node.wikipediaSlug, node.label]);

  useEffect(() => {
    if (node.birthPlaceId || node.deathPlaceId) {
      getWikibaseEntitiesLabel(
        [node.birthPlaceId || "", node.deathPlaceId || ""],
        languageCode,
        dataSource,
      )
        .then(([birthPlaceLabel, deathPlaceLabel]) => {
          setBirthPlace(birthPlaceLabel);
          setDeathPlace(deathPlaceLabel);
        })
        .catch(errorHandler);
    }
  }, [languageCode, dataSource, node.birthPlaceId, node.deathPlaceId]);

  return (
    <StyledModal show onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{node.label}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!images.length && (
          <div className="allImages">
            {images &&
              images.map((image) => (
                <Figure>
                  <Figure.Image
                    key={image.url}
                    alt={image.alt}
                    src={image.url}
                    title={image.alt}
                  />
                  <Figure.Caption>
                    {image.sourceUrl && (
                      <Button
                        variant="light"
                        target="_blank"
                        className="mb-3"
                        size="sm"
                        href={image.sourceUrl}
                      >
                        Source
                      </Button>
                    )}
                    {image.sourceUrl && !image.imageDb && (
                      <Button
                        variant="light"
                        target="_blank"
                        size="sm"
                        href={missingImagesLink({
                          wikidataEntity: node.id,
                          wikidataLabel: node.label,
                          sourceUrl: image.sourceUrl,
                          downloadUrl: image.downloadUrl,
                        })}
                        title="Import image to our database for face detection & background removal"
                      >
                        Import
                      </Button>
                    )}
                  </Figure.Caption>
                </Figure>
              ))}
          </div>
        )}

        {(node.birthDate || birthPlace || node.deathDate || deathPlace) && (
          <p>
            <i>
              {node.birthDate} {birthPlace}
              {(node.deathDate || deathPlace) && (
                <>
                  {" "}
                  - {node.deathDate} {deathPlace}
                </>
              )}
            </i>
          </p>
        )}
        <p>
          {wikipediaExtract || node.description || (
            <i>This entity has no description</i>
          )}
        </p>

        <a
          className="addImagesLink"
          target="_blank"
          rel="noopener noreferrer"
          href={missingImagesLink({
            wikidataEntity: node.id,
            wikidataLabel: node.label,
          })}
        >
          Add missing image <FiExternalLink />
        </a>

        {node.website && (
          <p>
            <a href={node.website} target="_blank" rel="noopener noreferrer">
              Open official website <FiExternalLink />
            </a>
          </p>
        )}
        <div className="externalLinks">
          {node.wikidataUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Wikidata item in a new tab"
              href={node.wikidataUrl}
            >
              <img src="/icons/wikidata.png" alt="Wikidata" />
            </a>
          )}
          {node.factgridUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open FactGrid item in a new tab"
              href={node.factgridUrl}
            >
              <img
                src="/icons/factgrid.png"
                style={{ width: "100px" }}
                alt="FactGrid Link"
              />
            </a>
          )}
          {node.wikipediaUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Wikipedia article in a new tab"
              href={node.wikipediaUrl}
            >
              <img src="/icons/wikipedia.png" alt="Wikipedia" />
            </a>
          )}
          {node.geniProfileUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Geni in a new tab"
              href={node.geniProfileUrl}
            >
              <img src="/icons/geni.png" alt="Geni link" />
            </a>
          )}
          {/*{node.wikipediaUrl && (*/}
          {/*  <a*/}
          {/*    target="_blank"*/}
          {/*    rel="noopener noreferrer"*/}
          {/*    title="Open Wikipedia article in a new tab"*/}
          {/*    href={`https://peoplepill.com/people/${node.peoplepillSlug}`}*/}
          {/*  >*/}
          {/*    <img src="/icons/pp.png" alt="PeoplePill" />*/}
          {/*  </a>*/}
          {/*)}*/}
          {node.fandomUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Fandom article in a new tab"
              href={node.fandomUrl}
            >
              <svg className="wds-icon">
                <svg id="wds-company-logo-fandom-heart" viewBox="0 0 35 35">
                  <path
                    d="M32.003 16.524c0 .288-.115.564-.32.768L18.3 30.712c-.226.224-.454.324-.738.324-.292 0-.55-.11-.77-.325l-.943-.886a.41.41 0 0 1-.01-.59l15.45-15.46c.262-.263.716-.078.716.29v2.46zm-17.167 10.12l-.766.685a.642.642 0 0 1-.872-.02L3.01 17.362c-.257-.25-.4-.593-.4-.95v-1.858c0-.67.816-1.007 1.298-.536l10.814 10.56c.188.187.505.57.505 1.033 0 .296-.068.715-.39 1.035zM5.73 7.395L9.236 3.93a.421.421 0 0 1 .592 0l11.736 11.603a3.158 3.158 0 0 1 0 4.5l-3.503 3.462a.423.423 0 0 1-.59 0L5.732 11.89a3.132 3.132 0 0 1-.937-2.25c0-.85.332-1.65.935-2.246zm13.89 1.982l3.662-3.62a3.232 3.232 0 0 1 2.737-.897c.722.098 1.378.47 1.893.978l3.708 3.667a.41.41 0 0 1 0 .585l-5.64 5.576a.419.419 0 0 1-.59 0l-5.77-5.704a.411.411 0 0 1 0-.585zm14.56-.687L26.014.475a.869.869 0 0 0-1.228-.002L18.307 6.94c-.5.5-1.316.5-1.82.004l-6.48-6.4A.87.87 0 0 0 8.793.542L.447 8.67C.16 8.95 0 9.33 0 9.727v7.7c0 .392.158.77.44 1.048l16.263 16.072a.87.87 0 0 0 1.22 0l16.25-16.073c.28-.278.438-.655.438-1.048V9.73c0-.39-.153-.763-.43-1.04z"
                    fill="#00D6D6"
                    fillRule="evenodd"
                  />
                </svg>
              </svg>
            </a>
          )}
          {node.externalLinks?.map((link, index) => (
            <a
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              title={link.title}
              href={link.url}
            >
              <img src={link.iconSrc} alt={link.alt} />
            </a>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {node.id !== currentEntity?.id && (
          <Button
            variant="light"
            className="mr-auto"
            onClick={() => {
              dispatch(setLoadingEntity(true));
              const url = getEntityUrl(
                languageCode,
                currentProp?.slug || "",
                node.wikipediaSlug || node.id,
                dataSource,
              );
              router.push(url);
              onHideModal();
            }}
          >
            Show tree from here
          </Button>
        )}
        <Button variant="primary" onClick={onHideModal}>
          OK
        </Button>
      </Modal.Footer>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .allImages {
    margin-bottom: 8px;
    overflow: hidden;
    min-height: 172px; // to avoid jumps when the image loads
    img {
      max-height: 168px; //remember multi line here
      max-width: 100%;
      vertical-align: middle;
      margin-bottom: 0;
    }
  }

  .figure {
    margin-right: 4px;
    margin-bottom: 4px;
    position: relative;
    figcaption {
      background-color: rgba(0, 0, 0, 0.25);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
    }
    :hover {
      figcaption {
        display: flex;
      }
    }
  }

  .addImagesLink {
    display: inline-block;
    margin-bottom: 1rem;
  }

  .externalLinks {
    a {
      padding: 1px;
      margin-right: 10px;
      display: inline-block;
      line-height: 1;
      img {
        vertical-align: middle;
        width: 32px;
      }
    }
    .wds-icon {
      height: 30px;
      width: 30px;
    }
  }
`;
