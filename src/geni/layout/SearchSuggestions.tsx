import { Button, Spinner } from "react-bootstrap";
import React, { useRef } from "react";

import { GeniProfile } from "services/geniService";
// import { SearchResult } from "services/wikidataService";
import { getEntityUrl } from "helpers/getEntityUrl";
// import getEntityWikipediaSlug from "treeHelpers/getEntityWikipediaSlug";
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
  searchResults: GeniProfile[];
  setShowSuggestions: (a) => void;
}) {
  const wrapperRef = useRef(null);

  const dispatch = useDispatch();
  useOnClickOutside(wrapperRef, () => setShowSuggestions(false));
  const router = useRouter();

  const { currentProp } = useAppSelector(({ tree }) => tree);

  const { languageCode, wikibaseAlias } = useAppSelector(
    ({ settings }) => settings,
  );
  console.log(searchResults);

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
          onClick={async () => {
            setShowSuggestions(false);
            dispatch(reset());
            const url = getEntityUrl(
              "en",
              "family_tree",
              {
                id: searchResult.id.substr(8),
              },
              "geni",
            );
            console.log(url);
            router.push(url);
          }}
        >
          <b>{searchResult.name}</b>
          {searchResult.guid && <i>{searchResult.guid}</i>}
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
