import {
  Container,
  Dropdown,
  Form,
  InputGroup,
  Overlay,
  Tooltip,
} from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";

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
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { searchTerm as wikidataSearchTerm } from "services/wikidataService";

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
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fromKeyboard, setFromKeyboard] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    (async () => {
      if (debouncedSearchTerm && fromKeyboard && currentLang) {
        setShowSuggestions(true);
        setLoadingSuggestions(true);
        try {
          if (dataSource === "wikidata" || dataSource === "factgrid") {
            const results = await wikidataSearchTerm(
              debouncedSearchTerm,
              currentLang.code,
              dataSource,
            );
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
            setSearchResults(
              filteredResults.map((result) => {
                return {
                  id: result.id,
                  title: result.label,
                  subtitle: result.description,
                };
              }),
            );
          }
          if (dataSource === "geni") {
            const profiles = await searchGeniCall(debouncedSearchTerm);
            setSearchResults(
              profiles.map((geniProfile) => {
                return {
                  id: "G" + geniProfile.guid,
                  title: geniProfile.name,
                  subtitle: geniProfile.birth?.date?.formatted_date,
                };
              }),
            );
          }
        } catch (error) {
          errorHandler(error);
        } finally {
          setLoadingSuggestions(false);
        }
      } else {
        setLoadingSuggestions(false);
        setShowSuggestions(false);
      }
    })();
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
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
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
                  {/* in the edge case there are no props, hide the dropdown */}
                  {!!currentEntityProps?.length && (
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

                  <Dropdown.Menu alignRight>
                    {currentEntityProps?.map((prop) => (
                      <Dropdown.Item
                        key={prop.id}
                        className={prop.isFav ? "fav" : ""}
                        onClick={() => {
                          dispatch(setLoadingEntity(true));
                          const url = getEntityUrl(
                            currentLang.code,
                            prop.slug,
                            currentEntity.wikipediaSlug || currentEntity.id,
                            dataSource,
                          );
                          router.push(url);
                        }}
                      >
                        {prop.overrideLabel || prop.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup.Append>
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
