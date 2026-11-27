import {
  Container,
  Dropdown,
  Form,
  InputGroup,
  Overlay,
  Tooltip,
} from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { getWikibaseURL, wikibaseSearchEntities } from "@entitree/helper";

import { FaSearch } from "react-icons/fa";
import SearchSuggestions from "./SearchSuggestions";
import { errorHandler } from "handlers/errorHandler";
import { getEntityUrl } from "helpers/getEntityUrl";
import { searchGeniCall } from "services/apiService";
import { setLoadingEntity } from "store/treeSlice";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useCurrentLang } from "hooks/useCurrentLang";
import useDebounce from "../hooks/useDebounce";
import { useAppDispatch } from "store";
import { useRouter } from "next/router";

export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
};

export default function SearchBar() {
  const { currentEntity, currentProp, loadingEntity, currentEntityProps } =
    useAppSelector(({ tree }) => tree);

  const { dataSource } = useAppSelector(({ settings }) => settings);

  const currentLang = useCurrentLang();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fromKeyboard, setFromKeyboard] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  // the term the current searchResults belong to, so a submit can tell
  // whether the debounced search already ran for what is in the box
  const searchedTermRef = useRef<string | null>(null);

  const runSearch = async (term: string) => {
    searchedTermRef.current = term;
    setShowSuggestions(true);
    setLoadingSuggestions(true);
    try {
      let results: SearchResult[] = [];
      if (dataSource === "wikidata" || dataSource === "factgrid") {
        const entities = await wikibaseSearchEntities(
          term,
          currentLang.code as string,
          getWikibaseURL(dataSource),
        );
        results = entities
          .filter(({ id, description }) => {
            // remove current entity from results
            if (currentEntity?.id === id) return false;
            // remove wikimedia disam pages
            if (currentLang?.disambPageDesc === description) return false;
            return true;
          })
          .map((result) => ({
            id: result.id,
            title: result.label,
            subtitle: result.description,
          }));
      }
      if (dataSource === "geni") {
        const profiles = await searchGeniCall(term);
        results = profiles.map((geniProfile) => ({
          id: "G" + geniProfile.guid,
          title: geniProfile.name,
          subtitle: geniProfile.birth?.date?.formatted_date,
        }));
      }
      // ignore responses for a term the user has already typed past
      if (searchedTermRef.current === term) setSearchResults(results);
    } catch (error) {
      errorHandler(error);
    } finally {
      if (searchedTermRef.current === term) setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm && fromKeyboard && currentLang) {
      runSearch(debouncedSearchTerm);
    } else {
      searchedTermRef.current = null;
      setLoadingSuggestions(false);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (currentEntity) {
      setFromKeyboard(false);
      setSearchTerm(currentEntity.label || "");
    }
  }, [currentEntity]);

  const propToggleRef = useRef(null);

  return (
    <ThemedSearchBar
      className="SearchBar"
      onSubmit={(e) => {
        e.preventDefault();
        const term = searchTerm.trim();
        if (!term) return;
        // mobile "Go" can arrive before the debounce fires: search right away
        if (searchedTermRef.current !== term) {
          setFromKeyboard(true);
          runSearch(term);
        } else {
          setShowSuggestions(true);
        }
        // close the mobile keyboard so the suggestions are visible
        (document.activeElement as HTMLElement | null)?.blur();
      }}
    >
      <Container>
        <Form.Group className="searchBox" controlId="searchBox">
          <InputGroup>
            <span className="searchIcon">
              <FaSearch />
            </span>
            <Form.Control
              onChange={(e) => {
                // onChange only fires for user edits (typing, autocorrect,
                // swipe, dictation, paste), never for the programmatic
                // setSearchTerm below; mobile keyboards often send no keydown
                setFromKeyboard(true);
                setSearchTerm(e.target.value);
              }}
              value={loadingEntity ? "Loading entity..." : searchTerm}
              type="search"
              readOnly={!!loadingEntity}
              placeholder="Start typing to search..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {currentEntity && (
              <Dropdown>
                <Overlay
                  placement="bottom"
                  show={false}
                  target={propToggleRef.current}
                >
                  <Tooltip id="select-prop">
                    Select a property to show a tree
                  </Tooltip>
                </Overlay>
                {/* in the edge case there are no props, hide the dropdown */}
                {/* the props list loads after the page, show the current prop meanwhile */}
                {(!currentEntityProps ||
                  !!currentEntityProps.length ||
                  !!currentProp) && (
                  <Dropdown.Toggle
                    variant="none"
                    ref={propToggleRef}
                    id="dropdown-props"
                    className={
                      !!currentEntity && !currentProp
                        ? "shouldSelectProp btn-warning"
                        : undefined
                    }
                  >
                    {currentProp
                      ? currentProp.overrideLabel || currentProp.label
                      : "Choose a property "}
                  </Dropdown.Toggle>
                )}

                <Dropdown.Menu align="end">
                  {!currentEntityProps && (
                    <Dropdown.Item disabled>
                      Loading properties...
                    </Dropdown.Item>
                  )}
                  {currentEntityProps?.map((prop) => (
                    <Dropdown.Item
                      key={prop.id}
                      className={prop.isFav ? "fav" : ""}
                      onClick={() => {
                        dispatch(setLoadingEntity(true));
                        const url = getEntityUrl(
                          currentLang.code,
                          prop.slug,
                          dataSource,
                          currentEntity.id,
                          currentEntity.wikipediaSlug,
                        );
                        router.push(url);
                      }}
                    >
                      {prop.overrideLabel || prop.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </InputGroup>
          {showSuggestions && (
            <SearchSuggestions
              loadingSuggestions={loadingSuggestions}
              searchResults={searchResults}
              setShowSuggestions={setShowSuggestions}
            />
          )}
        </Form.Group>
      </Container>
    </ThemedSearchBar>
  );
}

const ThemedSearchBar = styled(Form)`
  flex: 0 0 ${({ theme }) => theme.searchBarHeight}px;
  background-color: #eee;
  @media print {
    display: none;
  }
  .container {
    height: 100%;
  }
  .searchBox {
    position: relative;
    color: #212529;
    margin: 0;
    display: flex;
    align-items: center;
    height: 100%;

    .input-group {
      position: relative;
      flex-wrap: nowrap;
      .searchIcon {
        position: absolute;
        z-index: 5;
        top: 7px;
        left: 10px;
        color: var(--bs-gray-600);
      }
      // react-bootstrap 2 renders the Dropdown without a wrapper inside an
      // InputGroup, so the toggle is a direct flex item: size it to its label
      > .dropdown-toggle {
        width: auto;
        flex: 0 0 auto;
      }
    }

    #searchBox {
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
      padding-left: 32px;
    }

    .shouldSelectProp {
      //border-color: green;
      //background-color: #ffc107;
      font-style: italic;
    }
  }
  .dropdown-toggle {
    border: 1px solid #ced4da;
    border-radius: 0 0.25rem 0.25rem 0;
    width: 100%;
  }
  .dropdown-menu {
    max-height: 60vh;
    overflow-y: auto;
    .fav {
      font-weight: bold;
    }
  }
  .submitButton {
    margin-bottom: 1rem;
    width: 100%;
  }
`;
