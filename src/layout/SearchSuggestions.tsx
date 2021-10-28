import { Button, Spinner } from "react-bootstrap";
import React, { useRef } from "react";

import { SearchResult } from "./SearchBar";
import { getEntityUrl } from "helpers/getEntityUrl";
import getEntityWikipediaSlug from "wikipedia/getEntityWikipediaSlug";
import { reset } from "store/treeSlice";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";
import useOnClickOutside from "hooks/useOnClickOutside";
import { useRouter } from "next/router";

export default function SearchSuggestions({
  loadingSuggestions,
  searchResults,
  setShowSuggestions,
}: {
  loadingSuggestions: boolean;
  searchResults: SearchResult[];
  setShowSuggestions: (a) => void;
}) {
  const wrapperRef = useRef(null);

  const dispatch = useDispatch();
  useOnClickOutside(wrapperRef, () => setShowSuggestions(false));
  const router = useRouter();

  const { currentProp } = useAppSelector(({ tree }) => tree);

  const { languageCode, dataSource } = useAppSelector(
    ({ settings }) => settings,
  );

  const onSuggestionClick = async (searchResult: SearchResult) => {
    setShowSuggestions(false);
    dispatch(reset());

    let targetUrl = "";
    switch (dataSource) {
      case "factgrid":
        targetUrl = getEntityUrl(
          languageCode,
          currentProp?.slug || "",
          searchResult.id,
          dataSource,
        );
        break;
      case "geni":
        targetUrl = getEntityUrl(
          "en",
          "family_tree",
          searchResult.id,
          dataSource,
        );
        break;
      case "wikidata":
      default:
        {
          const wikipediaSlug = await getEntityWikipediaSlug(
            searchResult.id,
            languageCode,
            dataSource,
          );

          targetUrl = getEntityUrl(
            languageCode,
            currentProp?.slug || "",
            wikipediaSlug || searchResult.id,
            dataSource,
          );
        }
        break;
    }

    if (!targetUrl) throw new Error("targetUrl is empty");

    router.push(targetUrl);
  };

  return (
    <StyledSuggestions
      ref={wrapperRef}
      className="dropdown-menu show d-relative"
    >
      {loadingSuggestions && (
        <div className="searchingMessage">
          <Spinner animation="border" variant="secondary" /> Searching
        </div>
      )}
      {!loadingSuggestions && !searchResults.length && (
        <div className="searchingMessage">Sorry, no results found</div>
      )}
      {searchResults.map((searchResult) => (
        <Button
          key={searchResult.id}
          className="searchResultBtn"
          variant="light"
          onClick={() => onSuggestionClick(searchResult)}
        >
          <b>{searchResult.title}</b>
          {searchResult.subtitle && <i>{searchResult.subtitle}</i>}
        </Button>
      ))}
    </StyledSuggestions>
  );
}

const StyledSuggestions = styled.div`
  position: absolute;
  top: 50px;
  width: 100%;
  background-color: #f8f9fa;
  .searchingMessage {
    padding: 0.375rem 0.75rem;
    color: grey;
    .spinner-border {
      width: 1.2em;
      height: 1.2em;
      margin-right: 10px;
    }
  }
  .searchResultBtn {
    width: 100%;
    text-align: left;
    line-height: 1.2;
    b {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    i {
      display: block;
      color: gray;
      text-decoration: gray;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
