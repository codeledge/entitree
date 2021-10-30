import { Button, Collapse, Dropdown, Form, Modal } from "react-bootstrap";
import {
  EXTRA_INFO_OPTIONS,
  RIGHT_ENTITY_OPTIONS,
  SECOND_LABELS,
} from "constants/properties";
import React, { useEffect, useState } from "react";
import { setSecondLabelCode, setSetting } from "store/settingsSlice";
import styled, { useTheme } from "styled-components";

import { CustomMenu } from "./CustomMenu";
import CustomThemeForm from "./CustomThemeForm";
import { CustomToggle } from "./CustomToggle";
import { IMAGE_SERVER_OVERFLOW } from "services/imageService";
import { LANGS } from "constants/langs";
import ReactGA from "react-ga";
import { THEMES } from "constants/themes";
import { switchLanguage } from "actions/loadActions";
import { useAppSelector } from "store";
import { useCurrentLang } from "hooks/useCurrentLang";
import { useCurrentSecondLabel } from "hooks/useCurrentSecondLabel";
import { useDispatch } from "react-redux";

export default function SettingsModal({ show, onHideModal }) {
  useEffect(() => {
    ReactGA.modalview("settings");
  }, []);

  const currentTheme = useTheme();
  const currentLang = useCurrentLang();
  const currentSecondLabel = useCurrentSecondLabel();

  const {
    languageCode,
    dataSource,
    rightEntityOption,
    showGenderColor,
    showExtraInfo,
    extraInfo,
    showBirthName,
    hideToggleButton,
    showExternalImages,
    // showFace,
    imageType,
    imageOverflow,
    followNavigation,
    orientation,
  } = useAppSelector(({ settings }) => settings);
  const { currentProp, currentEntity } = useAppSelector(({ tree }) => tree);

  const dispatch = useDispatch();

  const [openForm, setOpenForm] = useState(false);

  return (
    <StyledModal
      show={show}
      onHide={onHideModal}
      dialogClassName="SettingsModalDialog"
      className="SettingsModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown className="themeDropdown">
          <div>
            <Dropdown.Toggle as={CustomToggle} className="float-left">
              <span className="label">Use Theme</span>
              &nbsp;&nbsp;
              {currentTheme.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {THEMES.map((theme, index) => (
                <Dropdown.Item
                  key={theme.code}
                  eventKey={index + 1}
                  active={theme.code === currentTheme.code}
                  disabled={theme.disabled}
                  onClick={() =>
                    dispatch(setSetting({ themeCode: theme.code }))
                  }
                >
                  {theme.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            <Button
              variant="link"
              className="float-right"
              onClick={() => setOpenForm(!openForm)}
              aria-controls="collapse-custom-theme-form"
              aria-expanded={openForm}
            >
              <i>customize</i>
            </Button>
          </div>
          <Form.Text className="text-muted mt-0">
            Give the tree the style you prefer, useful for custom styling
          </Form.Text>
        </Dropdown>
        <Collapse in={openForm} mountOnEnter>
          <div id="collapse-custom-theme-form">
            <CustomThemeForm />
          </div>
        </Collapse>
        <hr />
        <Dropdown className="langDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Language</span> {currentLang?.name}
          </Dropdown.Toggle>
          <Dropdown.Menu alignRight as={CustomMenu}>
            {LANGS.map((lang, index) => (
              <Dropdown.Item
                key={lang.code}
                eventKey={index + 1}
                active={lang.code === languageCode}
                onClick={() => {
                  dispatch(setSetting({ languageCode: lang.code }));
                  if (currentEntity) {
                    dispatch(
                      switchLanguage(
                        lang.code,
                        dataSource,
                        currentEntity.id,
                        currentProp?.id,
                      ),
                    );
                  }
                }}
              >
                {lang.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
          <Form.Text className="text-muted mt-0">
            If the language is available, the person's name and description will
            be translated
          </Form.Text>
        </Dropdown>
        <Dropdown className="langDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Add second label</span>{" "}
            {currentSecondLabel ? currentSecondLabel.name : <i>no</i>}
          </Dropdown.Toggle>
          <Dropdown.Menu alignRight as={CustomMenu}>
            <Dropdown.Item
              active={!currentSecondLabel}
              onClick={() => dispatch(setSecondLabelCode(undefined))}
            >
              - no second label -
            </Dropdown.Item>
            <Dropdown.Header>Properties</Dropdown.Header>

            {SECOND_LABELS.map((secondLabelOption, index) => (
              <Dropdown.Item
                key={secondLabelOption.code}
                eventKey={index + 1}
                active={secondLabelOption.code === currentSecondLabel?.code}
                onClick={() =>
                  dispatch(setSecondLabelCode(secondLabelOption.code))
                }
                disabled={languageCode === secondLabelOption.code}
              >
                {secondLabelOption.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Header>Languages</Dropdown.Header>

            {LANGS.map((lang, index) => (
              <Dropdown.Item
                key={lang.code}
                eventKey={index + 1}
                active={lang.code === currentSecondLabel?.code}
                onClick={() => dispatch(setSecondLabelCode(lang.code))}
                disabled={languageCode === lang.code}
              >
                {lang.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
          <Form.Text className="text-muted mt-0">
            If the property or language is available, a second label will be
            shown, useful when people are known by different names
          </Form.Text>
        </Dropdown>
        <Dropdown className="spousesDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Show on the right</span>{" "}
            {rightEntityOption.propIds?.length ? (
              rightEntityOption.title
            ) : (
              <i>{rightEntityOption.title}</i>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {RIGHT_ENTITY_OPTIONS.map((option) => (
              <Dropdown.Item
                key={option.title}
                active={
                  JSON.stringify(rightEntityOption.propIds) ===
                  JSON.stringify(option.propIds)
                }
                onClick={async () => {
                  dispatch(
                    setSetting({
                      rightEntityOption: option,
                    }),
                  );
                }}
              >
                {option.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
          <Form.Text className="text-muted mt-0">
            Decide what to show on the right of each person, this applies only
            to humans and fictional characters. Reload the page to apply
            changes.
          </Form.Text>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Orientation</span> {orientation}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              eventKey={1}
              active={orientation === "vertical"}
              onClick={() => {
                dispatch(setSetting({ orientation: "vertical" }));
              }}
            >
              Vertical
            </Dropdown.Item>
            <Dropdown.Item
              eventKey={2}
              active={orientation === "horizontal"}
              onClick={() => {
                dispatch(setSetting({ orientation: "horizontal" }));
              }}
            >
              Horizontal
            </Dropdown.Item>
          </Dropdown.Menu>
          <Form.Text className="text-muted mt-0">
            Choose which way your tree will grow
          </Form.Text>
        </Dropdown>
        <hr />
        <Form.Group controlId="followNavigation">
          <Form.Check
            custom
            checked={followNavigation}
            onChange={(e) =>
              dispatch(
                setSetting({
                  followNavigation: e.target.checked,
                }),
              )
            }
            type="checkbox"
            label="Follow navigation automatically"
          />
          <Form.Text className="text-muted pl-4">
            Center the new appearing nodes and or the most relevant node
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="iconsDisplay">
          <Form.Check
            custom
            checked={hideToggleButton}
            onChange={(e) =>
              dispatch(
                setSetting({
                  hideToggleButton: e.target.checked,
                }),
              )
            }
            type="checkbox"
            label="Hide expand/collapse buttons"
          />
          <Form.Text className="text-muted pl-4">
            If this option is selected, it's not possible to navigate the tree
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="genderColors">
          <Form.Check
            custom
            checked={showGenderColor}
            onChange={(e) =>
              dispatch(
                setSetting({
                  showGenderColor: e.target.checked,
                }),
              )
            }
            type="checkbox"
            label="Use colors based on gender"
          />
          <Form.Text className="text-muted pl-4">
            If browsing family trees, the nodes will have a background color
            (blue for men, red for women)
          </Form.Text>
        </Form.Group>
        {(dataSource === "wikidata" || dataSource === "geni") && (
          <>
            <Form.Group controlId="extraInfo">
              <Form.Check
                custom
                className="d-inline-block"
                checked={showExtraInfo}
                onChange={(e) =>
                  dispatch(
                    setSetting({
                      showExtraInfo: e.target.checked,
                    }),
                  )
                }
                type="checkbox"
                label="Show badge"
              />
              {showExtraInfo && (
                <Dropdown className="imageDropdown d-inline-block ml-1">
                  <Dropdown.Toggle as={CustomToggle}>
                    {EXTRA_INFO_OPTIONS.find((c) => c.code === extraInfo)
                      ?.title || <i>Select</i>}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {EXTRA_INFO_OPTIONS.map((extraOption) => (
                      <Dropdown.Item
                        key={extraOption.code}
                        active={extraInfo === extraOption.code}
                        onClick={() =>
                          dispatch(
                            setSetting({
                              extraInfo: extraOption.code,
                            }),
                          )
                        }
                      >
                        {extraOption.title}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <Form.Text className="text-muted pl-4">
                An icon with extra infos (beta)
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="birthName">
              <Form.Check
                custom
                checked={showBirthName}
                onChange={(e) =>
                  dispatch(
                    setSetting({
                      showBirthName: e.target.checked,
                    }),
                  )
                }
                type="checkbox"
                label="Show birth name instead of label"
              />
              <Form.Text className="text-muted pl-4">
                Often people change their names during their life
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="showExternalImages">
              <Form.Check
                custom
                checked={showExternalImages}
                onChange={(e) =>
                  dispatch(
                    setSetting({
                      showExternalImages: e.target.checked,
                    }),
                  )
                }
                type="checkbox"
                label="Show external images"
              />
              <Form.Text className="text-muted pl-4">
                Allow entitree to fetch images from other websites
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="faceDisplay">
              <Form.Check
                custom
                checked={imageType === "transparent_head"}
                className="d-inline-block"
                onChange={(e) =>
                  dispatch(
                    setSetting({
                      imageType: e.target.checked ? "transparent_head" : "face",
                    }),
                  )
                }
                type="checkbox"
                label="Remove image background"
              />
              {/* {true && (
            <Dropdown className="imageDropdown d-inline-block ml-1">
              <Dropdown.Toggle as={CustomToggle}>
                <span className="imageDropdownLabel">show</span> {imageType}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {IMAGE_SERVER_TYPES.map((imageIndex, index) => (
                  <Dropdown.Item
                    key={imageIndex.code}
                    eventKey={index + 1}
                    active={imageIndex.code === imageType}
                    onClick={() =>
                      dispatch(
                        setSetting({
                          imageType: imageIndex.code,
                        }),
                      )
                    }
                  >
                    {imageIndex.code}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )} */}
              {imageType === "transparent_head" && (
                <Dropdown className="imageDropdown d-inline-block ml-1">
                  <Dropdown.Toggle as={CustomToggle}>
                    <span className="imageDropdownLabel">overflow</span>{" "}
                    {imageOverflow}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {IMAGE_SERVER_OVERFLOW.map((item, index) => (
                      <Dropdown.Item
                        key={item.code}
                        eventKey={index + 1}
                        active={item.code === imageOverflow}
                        onClick={() =>
                          dispatch(
                            setSetting({
                              imageOverflow: item.code,
                            }),
                          )
                        }
                      >
                        {item.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <Form.Text className="text-muted pl-4">
                {/* Try to zoom into the person's most relevant features */}
              </Form.Text>
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" className="mr-auto ml-0" onClick={onHideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={onHideModal}>
          Done
        </Button>
      </Modal.Footer>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .dropdown-toggle {
    display: inline-block;
    padding: 0.4rem 0;
    .label {
      color: #212529;
    }
  }
  .dropdown-menu {
    .filterWrapper {
      padding: 0 1.3rem;
      margin-bottom: 8px;
    }
    .list {
      max-height: 200px;
      overflow-y: scroll;
      margin-bottom: 0;
    }
  }
  .langDropdown {
    .dropdown-menu {
      left: 0;
      width: 100%;
      max-width: 320px;
    }
  }
  .imageDropdown {
    .dropdown-toggle {
      vertical-align: top;
      display: inline-block;
      padding: 0;
    }
  }
`;
