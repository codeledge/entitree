import {
  Container,
  Dropdown,
  Form,
  InputGroup,
  Overlay,
  Tooltip,
} from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import {
  SearchResult,
  searchTerm as wikidataSearchTerm,
} from "services/wikidataService";

import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import Suggestions from "./Suggestions";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useCurrentLang } from "hooks/useCurrentLang";
import useDebounce from "../hooks/useDebounce";

export default function SearchBar() {
  const {
    currentEntity,
    currentProp,
    loadingEntity,
    currentEntityProps,
  } = useAppSelector(({ tree }) => tree);

  const currentLang = useCurrentLang();

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fromKeyboard, setFromKeyboard] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    if (debouncedSearchTerm && fromKeyboard && currentLang) {
      setShowSuggestions(true);
      setLoadingSuggestions(true);
      wikidataSearchTerm(debouncedSearchTerm, currentLang.code)
        .then((results) => {
          const filteredResults = results.filter(({ id, description }) => {
            // remove current entity from results
            if (currentEntity?.id === id) {
              return false;
            }

            // remove wikimedia disam pages
            if (currentLang?.disambPageDesc === description) return false;

            return true;
          });

          setSearchResults(filteredResults);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoadingSuggestions(false);
        });
    } else {
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
        setShowSuggestions(true);
      }}
    >
      <Container>
        <Form.Group className="searchBox" controlId="searchBox">
          <InputGroup>
            <InputGroup.Prepend>
              <FaSearch />
            </InputGroup.Prepend>
            <Form.Control
              onKeyDown={() => setFromKeyboard(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              value={loadingEntity ? "Loading entity..." : searchTerm}
              type="search"
              readOnly={!!loadingEntity}
              placeholder="Start typing to search..."
              autoComplete="off"
            />
            {currentEntity && (
              <InputGroup.Append>
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

                  <Dropdown.Menu alignRight>
                    {currentEntityProps?.map((prop) => (
                      <Link
                        key={prop.id}
                        href={`/${currentLang.code}/${prop.slug}/${currentEntity.wikipediaSlug}`}
                        passHref
                      >
                        <Dropdown.Item
                          className={prop.isFav ? "fav" : ""}
                          // onClick={() => dispatch(setCurrentProp(prop))}
                        >
                          {prop.overrideLabel || prop.label}
                        </Dropdown.Item>
                      </Link>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup.Append>
            )}
          </InputGroup>
          {showSuggestions && (
            <Suggestions
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
      .input-group-prepend {
        position: absolute;
        z-index: 5;
        top: 11px;
        left: 10px;
        color: var(--gray);
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
    max-height: 32 * 8px + 8px !important;
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
