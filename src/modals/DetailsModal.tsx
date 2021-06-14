import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { FiExternalLink } from "react-icons/fi";
import getEntitiesLabel from "treeHelpers/getEntitiesLabel";
import { getEntityUrl } from "helpers/getEntityUrl";
import getWikipediaArticle from "wikipedia/getWikipediaArticle";
import { loadEntity } from "treeHelpers/loadEntity";
import { missingImagesLink } from "services/imageService";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function DetailsModal({ node, hideModal, nodeImages }) {
  const { languageCode } = useAppSelector(({ settings }) => settings);
  const { currentEntity, currentProp } = useAppSelector(({ tree }) => tree);
  const router = useRouter();

  const dispatch = useDispatch();
  const [images, setImages] = useState(nodeImages);
  const [birthPlace, setBirthPlace] = useState<string>();
  const [deathPlace, setDeathPlace] = useState<string>();
  const [wikipediaExtract, setWikipediaExtract] = useState<string>();

  useEffect(() => {
    if (node.data.wikipediaSlug)
      getWikipediaArticle(node.data.wikipediaSlug, languageCode).then(
        ({ data: { extract, thumbnail } }) => {
          if (extract) setWikipediaExtract(extract);
          if (thumbnail && !images.length) {
            setImages({
              url: thumbnail.source,
              alt: `${node.data.label}'s Wikipedia image`,
            });
          }
        },
      );
  }, [languageCode, images.length, node.data.wikipediaSlug, node.data.label]);

  useEffect(() => {
    if (node.data.birthPlaceId || node.data.deathPlaceId) {
      getEntitiesLabel(
        [node.data.birthPlaceId, node.data.deathPlaceId],
        languageCode,
      ).then(([birthPlaceLabel, deathPlaceLabel]) => {
        setBirthPlace(birthPlaceLabel);
        setDeathPlace(deathPlaceLabel);
      });
    }
  }, [languageCode, node.data.birthPlaceId, node.data.deathPlaceId]);

  return (
    <StyledModal show onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {node.data.label}
          {node.data.secondLabel && (
            <>
              <span className="labelsecondLabel">
                &nbsp;({node.data.secondLabel})
              </span>
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!images.length && (
          <div className="allImages">
            {images &&
              images.map((image) => (
                <img
                  key={image.url}
                  alt={image.alt}
                  src={image.url}
                  title={image.alt}
                />
              ))}
          </div>
        )}

        {(node.data.birthDate ||
          birthPlace ||
          node.data.deathDate ||
          deathPlace) && (
          <p>
            <i>
              {node.data.birthDate} {birthPlace}
              {(node.data.deathDate || deathPlace) && (
                <>
                  {" "}
                  - {node.data.deathDate} {deathPlace}
                </>
              )}
            </i>
          </p>
        )}
        <p>
          {wikipediaExtract || node.data.description || (
            <i>This entity has no description</i>
          )}
        </p>

        <a
          className="addImagesLink"
          target="_blank"
          rel="noopener noreferrer"
          href={missingImagesLink(node.data.id, node.data.label)}
        >
          Add missing image <FiExternalLink />
        </a>

        {node.data.website && (
          <p>
            <a
              href={node.data.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open official website <FiExternalLink />
            </a>
          </p>
        )}
        <div className="externalLinks">
          {node.data.wikidataUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Wikidata item in a new tab"
              href={node.data.wikidataUrl}
            >
              <img src="/icons/wikidata.png" alt="Wikidata" />
            </a>
          )}
          {node.data.wikipediaUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Wikipedia article in a new tab"
              href={node.data.wikipediaUrl}
            >
              <img src="/icons/wikipedia.png" alt="Wikipedia" />
            </a>
          )}
          {/*{node.data.wikipediaUrl && (*/}
          {/*  <a*/}
          {/*    target="_blank"*/}
          {/*    rel="noopener noreferrer"*/}
          {/*    title="Open Wikipedia article in a new tab"*/}
          {/*    href={`https://peoplepill.com/people/${node.data.peoplepillSlug}`}*/}
          {/*  >*/}
          {/*    <img src="/icons/pp.png" alt="PeoplePill" />*/}
          {/*  </a>*/}
          {/*)}*/}
          {node.data.externalLinks?.map((link, index) => (
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
        {node.data.id !== currentEntity?.id && (
          <Button
            variant="light"
            className="mr-auto"
            onClick={async () => {
              const {
                currentEntity: nextCurrentEntity,
                currentProp: nextCurrentProp,
              } = await loadEntity({
                itemId: node.data.id,
                langCode: languageCode,
                propSlug: currentProp?.slug,
                dispatch,
                redirectToFamilyTreeProp: true,
              });
              const url = getEntityUrl(
                languageCode,
                nextCurrentProp,
                nextCurrentEntity,
              );
              router.push(url, url, { shallow: true });

              hideModal();
            }}
          >
            Show tree from here
          </Button>
        )}
        <Button variant="primary" onClick={hideModal}>
          OK
        </Button>
      </Modal.Footer>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .allImages {
    margin-bottom: 3px;
    overflow: hidden;
    min-height: 172px; // to avoid jumps when the image loads
    img {
      max-height: 168px; //remember multi line here
      max-width: 100%;
      margin-right: 4px;
      margin-bottom: 4px;
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
  }
`;
