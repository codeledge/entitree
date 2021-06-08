import { Button, Collapse, Dropdown, Form, Modal } from "react-bootstrap";
import { EXTRA_INFO_OPTIONS, RIGHT_ENTITY_OPTIONS } from "constants/properties";
import { LANGS, SECOND_LABELS } from "constants/langs";
import React, { useEffect, useState } from "react";
import {
  setCurrentLang,
  setSecondLabel,
  setSetting,
} from "store/settingsSlice";

import { CustomMenu } from "./CustomMenu";
import CustomThemeForm from "./CustomThemeForm";
import { CustomToggle } from "./CustomToggle";
import ReactGA from "react-ga";
import { THEMES } from "constants/themes";
import { setTheme } from "store/themeSlice";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";

export default function SettingsModal({ show, hideModal }) {
  useEffect(() => {
    ReactGA.event({
      category: "Settings",
      action: `User interaction`,
      label: "modal opened",
    });
  }, []);

  const currentTheme = useAppSelector(({ theme }) => theme);
  const {
    customThemes,
    currentLang,
    secondLabel,
    rightEntityOption,
    showGenderColor,
    showExtraInfo,
    extraInfo,
    showBirthName,
    hideToggleButton,
    showExternalImages,
    showFace,
    imageType,
  } = useAppSelector(({ settings }) => settings);

  const dispatch = useDispatch();

  const [openForm, setOpenForm] = useState(false);

  return (
    <StyledModal
      show={show}
      onHide={hideModal}
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
              {Object.values(THEMES).map((theme, index) => (
                <Dropdown.Item
                  key={theme.name}
                  eventKey={index + 1}
                  active={theme.name === currentTheme.name}
                  disabled={theme.disabled}
                  onClick={() =>
                    setTheme({ ...theme, ...customThemes[theme.name] })
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
            <span className="label">Translate label to</span> {currentLang.name}
          </Dropdown.Toggle>
          <Dropdown.Menu alignRight as={CustomMenu}>
            {LANGS.map((lang, index) => (
              <Dropdown.Item
                key={lang.code}
                eventKey={index + 1}
                active={lang.code === currentLang.code}
                onClick={() => setCurrentLang(lang)}
              >
                {lang.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
          <Form.Text className="text-muted mt-0">
            If the language is available, the label (e.g. the person's name)
            will be translated
          </Form.Text>
        </Dropdown>
        <Dropdown className="langDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Add second label</span>{" "}
            {secondLabel ? secondLabel.name : <i>no</i>}
          </Dropdown.Toggle>
          <Dropdown.Menu alignRight as={CustomMenu}>
            <Dropdown.Item
              active={!secondLabel}
              onClick={() => setSecondLabel(undefined)}
            >
              - no second label -
            </Dropdown.Item>
            <Dropdown.Header>Properties</Dropdown.Header>

            {SECOND_LABELS.map((lang, index) => (
              <Dropdown.Item
                key={lang.code}
                eventKey={index + 1}
                active={secondLabel && lang.code === secondLabel.code}
                onClick={() => setSecondLabel(lang)}
                disabled={currentLang && currentLang.code === lang.code}
              >
                {lang.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Header>Languages</Dropdown.Header>

            {LANGS.map((lang, index) => (
              <Dropdown.Item
                key={lang.code}
                eventKey={index + 1}
                active={secondLabel && lang.code === secondLabel.code}
                onClick={() => setSecondLabel(lang)}
                disabled={currentLang && currentLang.code === lang.code}
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
            {rightEntityOption.propIds ? (
              rightEntityOption.title
            ) : (
              <i>{rightEntityOption.title}</i>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {RIGHT_ENTITY_OPTIONS.map((option, index) => (
              <Dropdown.Item
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                active={
                  JSON.stringify(rightEntityOption.propIds) ===
                  JSON.stringify(option.propIds)
                }
                onClick={() =>
                  dispatch(
                    setSetting({
                      key: "rightEntityOption",
                      val: option,
                    }),
                  )
                }
              >
                {rightEntityOption.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
          <Form.Text className="text-muted mt-0">
            Decide what to show on the right of each person, this applies only
            to humans and fictional characters.
          </Form.Text>
        </Dropdown>
        <hr />
        <Form.Group controlId="genderColors">
          <Form.Check
            custom
            checked={showGenderColor}
            onChange={(e) =>
              dispatch(
                setSetting({
                  key: "showGenderColor",
                  val: e.target.checked,
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
        <Form.Group controlId="extraInfo">
          <Form.Check
            custom
            className="d-inline-block"
            checked={showExtraInfo}
            onChange={(e) =>
              dispatch(
                setSetting({
                  key: "showExtraInfo",
                  val: e.target.checked,
                }),
              )
            }
            type="checkbox"
            label="Show extra info"
          />
          <Dropdown className="imageDropdown d-inline-block ml-1">
            <Dropdown.Toggle as={CustomToggle}>
              <span className="imageDropdownLabel">show</span>{" "}
              {EXTRA_INFO_OPTIONS.find((c) => c.code === extraInfo)?.title}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                active={extraInfo === "eyeColor"}
                onClick={() =>
                  dispatch(
                    setSetting({
                      key: "extraInfo",
                      val: "eyeColor",
                    }),
                  )
                }
              >
                Eye color
              </Dropdown.Item>
              <Dropdown.Item
                active={extraInfo === "hairColor"}
                onClick={() =>
                  dispatch(
                    setSetting({
                      key: "extraInfo",
                      val: "hairColor",
                    }),
                  )
                }
              >
                Hair color
              </Dropdown.Item>
              <Dropdown.Item
                active={extraInfo === "countryFlag"}
                onClick={() =>
                  dispatch(
                    setSetting({
                      key: "extraInfo",
                      val: "countryFlag",
                    }),
                  )
                }
              >
                Country flag
              </Dropdown.Item>
              <Dropdown.Item
                active={extraInfo === "religion"}
                onClick={() =>
                  dispatch(
                    setSetting({
                      key: "extraInfo",
                      val: "religion",
                    }),
                  )
                }
              >
                religion
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
                  key: "showBirthName",
                  val: e.target.checked,
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
        <Form.Group controlId="iconsDisplay">
          <Form.Check
            custom
            checked={hideToggleButton}
            onChange={(e) =>
              dispatch(
                setSetting({
                  key: "hideToggleButton",
                  val: e.target.checked,
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
        <Form.Group controlId="showExternalImages">
          <Form.Check
            custom
            checked={showExternalImages}
            onChange={(e) =>
              dispatch(
                setSetting({
                  key: "showExternalImages",
                  val: e.target.checked,
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
            checked={showFace}
            className="d-inline-block"
            onChange={(e) =>
              dispatch(
                setSetting({
                  key: "showFace",
                  val: e.target.checked,
                }),
              )
            }
            type="checkbox"
            label="Zoom in picture"
          />
          {showFace && (
            <Dropdown className="imageDropdown d-inline-block ml-1">
              <Dropdown.Toggle as={CustomToggle}>
                <span className="imageDropdownLabel">show</span> {imageType}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  active={imageType === "head"}
                  onClick={() =>
                    dispatch(
                      setSetting({
                        key: "imageType",
                        val: "head",
                      }),
                    )
                  }
                >
                  Head
                </Dropdown.Item>
                <Dropdown.Item
                  active={imageType === "face"}
                  onClick={() =>
                    dispatch(
                      setSetting({
                        key: "imageType",
                        val: "face",
                      }),
                    )
                  }
                >
                  Face
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Form.Text className="text-muted pl-4">
            Try to zoom into the person's most relevant features
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" className="mr-auto ml-0" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={hideModal}>
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
