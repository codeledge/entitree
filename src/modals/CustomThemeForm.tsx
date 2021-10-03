import { Col, Form, InputGroup, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { resetCurrentTheme, setCustomTheme } from "store/settingsSlice";

import Button from "react-bootstrap/Button";
import useDebounce from "hooks/useDebounce";
import { useDispatch } from "react-redux";
import { useTheme } from "styled-components";

export default function CustomThemeForm() {
  const currentTheme = useTheme();

  const [currentCustomTheme, setCurrentCustomTheme] = useState(currentTheme);

  const debouncedCustomTheme = useDebounce(currentCustomTheme, 1000);
  useEffect(() => {
    dispatch(setCustomTheme(debouncedCustomTheme));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCustomTheme]);

  const downloadJsonFile = (e) => {
    e.preventDefault();
    const element = document.createElement("a");
    const downloadTheme = currentCustomTheme;
    const file = new Blob([JSON.stringify(downloadTheme)], {
      type: "text/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "custom_theme.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    element?.parentNode?.removeChild(element);
  };

  const dispatch = useDispatch();
  const setCustomProp = (key, val) => {
    setCurrentCustomTheme((t) => ({ ...t, [key]: val }));
  };

  return (
    <div className="currentCustomTheme mt-2">
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Node Layout
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              type="radio"
              label="horizontal"
              name="nodeFlexDirection"
              id="nodeFlexDirection-horizontal"
              checked={currentCustomTheme.nodeFlexDirection === "row"}
              onChange={(e) => setCustomProp("nodeFlexDirection", "row")}
            />
            <Form.Check
              type="radio"
              label="vertical"
              name="nodeFlexDirection"
              id="nodeFlexDirection-vertical"
              checked={currentCustomTheme.nodeFlexDirection === "column"}
              onChange={(e) => setCustomProp("nodeFlexDirection", "column")}
            />
          </Col>
        </Form.Group>
      </fieldset>
      <Form.Group as={Row} controlId="nodeHeight">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Height</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomProp("nodeHeight", +e.target.value)}
              type="number"
              value={currentCustomTheme.nodeHeight}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The fixed Height for all cards
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="nodeWidth">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Width</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomProp("nodeWidth", +e.target.value)}
              type="number"
              value={currentCustomTheme.nodeWidth}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The fixed width for all cards
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="nodeBorder">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Border</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomProp("nodeBorder", e.target.value)}
              type="text"
              value={currentCustomTheme.nodeBorder}
            />
            <InputGroup.Append>
              <InputGroup.Text>CSS</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The fixed width for all cards
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="nodeBorderRadius">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Border Radius</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomProp("nodeBorderRadius", +e.target.value)
              }
              type="number"
              value={currentCustomTheme.nodeBorderRadius}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The fixed width for all cards
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="nodeBoxShadow">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Box Shadow</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomProp("nodeBoxShadow", e.target.value)}
              type="text"
              value={currentCustomTheme.nodeBoxShadow}
            />
            <InputGroup.Append>
              <InputGroup.Text>CSS</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            Style for box-shadow property
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="nodeFocusedBoxShadow">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Focused Node Box Shadow</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomProp("nodeFocusedBoxShadow", e.target.value)
              }
              type="text"
              value={currentCustomTheme.nodeFocusedBoxShadow}
            />
            <InputGroup.Append>
              <InputGroup.Text>CSS</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            Focused style for box-shadow property
          </Form.Text>
        </Col>
      </Form.Group>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Text
          </Form.Label>
          <Col sm={9}>
            <Form.Label>Text Padding Top</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={(e) =>
                  setCustomProp("contentPaddingTop", +e.target.value)
                }
                type="number"
                value={currentCustomTheme.contentPaddingTop}
              />
              <InputGroup.Append>
                <InputGroup.Text>px</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text className="text-muted">
              The padding from the top line of the image (e.g. horizontal
              layout)
            </Form.Text>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="contentPaddingLeft">
          <Col sm={{ span: 9, offset: 3 }}>
            <Form.Label>Text Padding Left</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={(e) =>
                  setCustomProp("contentPaddingLeft", e.target.value)
                }
                type="number"
                value={currentCustomTheme.contentPaddingLeft}
              />
              <InputGroup.Append>
                <InputGroup.Text>px</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text className="text-muted">
              The padding from the right end of the image (e.g. horizontal
              layout)
            </Form.Text>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="contentLineClamp">
          <Col sm={{ span: 9, offset: 3 }}>
            <Form.Label>Line Clamp</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={(e) =>
                  setCustomProp("contentLineClamp", e.target.value)
                }
                type="number"
                value={currentCustomTheme.contentLineClamp}
              />
              <InputGroup.Append>
                <InputGroup.Text>lines</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text className="text-muted">
              The maximum number of lines shown on the node, incl. the
              description. Please adjust the node height accordingly.
            </Form.Text>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Label
          </Form.Label>
          <Col sm={9}>
            <Form.Label>Font size</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={(e) =>
                  setCustomProp("labelFontSize", +e.target.value)
                }
                type="number"
                value={currentCustomTheme.labelFontSize}
              />
              <InputGroup.Append>
                <InputGroup.Text>px</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text className="text-muted">
              The cards label e.g. the person&apos;s name
            </Form.Text>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Description
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              type="radio"
              label="show"
              name="descriptionDisplay"
              id="descriptionDisplay-inline"
              checked={currentCustomTheme.descriptionDisplay === "inline"}
              onChange={(e) => setCustomProp("descriptionDisplay", "inline")}
            />
            <Form.Check
              type="radio"
              label="hide"
              name="descriptionDisplay"
              id="descriptionDisplay-none"
              checked={currentCustomTheme.descriptionDisplay === "none"}
              onChange={(e) => setCustomProp("descriptionDisplay", "none")}
            />
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Dates
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              type="radio"
              label="show"
              name="datesDisplay"
              id="datesDisplay-block"
              checked={currentCustomTheme.datesDisplay === "block"}
              onChange={(e) => setCustomProp("datesDisplay", "block")}
            />
            <Form.Check
              type="radio"
              label="hide"
              name="datesDisplay"
              id="datesDisplay-none"
              checked={currentCustomTheme.datesDisplay === "none"}
              onChange={(e) => setCustomProp("datesDisplay", "none")}
            />
          </Col>
        </Form.Group>
      </fieldset>

      <Form.Group controlId="datesYearOnly">
        <Col sm={{ span: 9, offset: 3 }} className="pl-0">
          <Form.Check
            custom
            checked={currentCustomTheme.datesYearOnly}
            onChange={(e) => setCustomProp("datesYearOnly", e.target.checked)}
            type="checkbox"
            label="Show only year of dates"
          />
          <Form.Text className="text-muted pl-4">
            e.g. show 1968 instead of 26 May 1968
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="datesFontSize">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Date Font size</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomProp("datesFontSize", +e.target.value)}
              type="number"
              value={currentCustomTheme.datesFontSize}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The dates at the bottom of the card
          </Form.Text>
        </Col>
      </Form.Group>

      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Thumbnail Counter
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              type="radio"
              label="show"
              name="thumbCounterDisplay"
              id="thumbCounterDisplay-show"
              checked={currentCustomTheme.thumbCounterDisplay === "block"}
              onChange={(e) => setCustomProp("thumbCounterDisplay", "block")}
            />
            <Form.Check
              type="radio"
              label="hide"
              name="thumbCounterDisplay"
              id="thumbCounterDisplay-hide"
              checked={currentCustomTheme.thumbCounterDisplay === "none"}
              onChange={(e) => setCustomProp("thumbCounterDisplay", "none")}
            />
          </Col>
        </Form.Group>
      </fieldset>
      <Form.Group as={Row} controlId="thumbHeight">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Thumbnail Height</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomProp("thumbHeight", +e.target.value)}
              type="number"
              value={currentCustomTheme.thumbHeight}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            e.g. The fixed height of the image in the Person&apos;s card
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="thumbWidth">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Thumbnail Width</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomProp("thumbWidth", +e.target.value)}
              type="number"
              value={currentCustomTheme.thumbWidth}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            e.g. The fixed width of the image in the Person&apos;s card
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="thumbBorderRadius">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Thumbnail Border Radius</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomProp("thumbBorderRadius", +e.target.value)
              }
              type="number"
              value={currentCustomTheme.thumbBorderRadius}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            e.g. The rouded corners of the Person&apos;s image
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="thumbBorderRadius">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Thumbnail Image Database Transform</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomProp("thumbTransform", e.target.value)}
              type="text"
              value={currentCustomTheme.thumbTransform}
            />
          </InputGroup>
          <Form.Text className="text-muted">
            ie. make the transparent face bigger/smaller
          </Form.Text>
        </Col>
      </Form.Group>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Separation
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId="separationCousins">
              <Form.Label>Cousins Separation</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) =>
                    setCustomProp("separationCousins", +e.target.value)
                  }
                  type="number"
                  value={currentCustomTheme.separationCousins}
                />
                <InputGroup.Append>
                  <InputGroup.Text>px</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                The gap between the cousins
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="separationSameGroup">
              <Form.Label>Same Group Separation</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) =>
                    setCustomProp("separationSameGroup", +e.target.value)
                  }
                  type="number"
                  value={currentCustomTheme.separationSameGroup}
                />
                <InputGroup.Append>
                  <InputGroup.Text>px</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                The gap between siblings or parents
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="separationSiblingSpouse">
              <Form.Label>Sibling/Spouse Separation</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) =>
                    setCustomProp("separationSiblingSpouse", +e.target.value)
                  }
                  type="number"
                  value={currentCustomTheme.separationSiblingSpouse}
                />
                <InputGroup.Append>
                  <InputGroup.Text>px</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                The gap between the sibling and the spouse of a person
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="separationVertical">
              <Form.Label>Vertical Spacing</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) =>
                    setCustomProp("separationVertical", +e.target.value)
                  }
                  type="number"
                  value={currentCustomTheme.separationVertical}
                />
                <InputGroup.Append>
                  <InputGroup.Text>px</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                e.g. The vertical space between parents and children
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Colors
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId="graphBackgroundColor">
              <Form.Label>Graph Background</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomProp("graphBackgroundColor", e.target.value)
                }
                type="color"
                value={currentCustomTheme.graphBackgroundColor}
              />
              <Form.Text className="text-muted">
                The background color for the whole graph
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="nodeBackgroundColor">
              <Form.Label>Node Background</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomProp("nodeBackgroundColor", e.target.value)
                }
                type="color"
                value={currentCustomTheme.nodeBackgroundColor}
              />
              <Form.Text className="text-muted">
                The background color for the card
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="labelFontColor">
              <Form.Label>Font color</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) =>
                    setCustomProp("labelFontColor", e.target.value)
                  }
                  type="color"
                  value={currentCustomTheme.labelFontColor}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                The color of the text of the item
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Relationship
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId="relStroke">
              <Form.Label>Stroke Color</Form.Label>
              <Form.Control
                onChange={(e) => setCustomProp("relStroke", e.target.value)}
                type="text"
                value={currentCustomTheme.relStroke}
              />
              <Form.Text className="text-muted">
                The color of the line that forms the relationship
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="relStrokeWidth">
              <Form.Label>Stroke Width</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) =>
                    setCustomProp("relStrokeWidth", e.target.value)
                  }
                  type="text"
                  value={currentCustomTheme.relStrokeWidth}
                />
                <InputGroup.Append>
                  <InputGroup.Text>px</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                The thickness of the line that forms the relationship
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            More
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId="nodeCss">
              <Form.Label>Node CSS rules (advanced)</Form.Label>
              <Form.Control
                onChange={(e) => setCustomProp("nodeCss", e.target.value)}
                as="textarea"
                rows={3}
                value={currentCustomTheme.nodeCss}
              />
              <Form.Text className="text-muted">
                CSS style (supports SCSS syntax) applied to Node element (.Node
                class), use your Browser&apos;s inspector to see the class names
                of the child elements you want to change.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
      <Form.Group as={Row}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Button size="sm" onClick={() => dispatch(resetCurrentTheme())}>
            Reset values
          </Button>
          <Button
            title="Save a copy of your customized theme, you may send it to us to include as a main theme. Importing a theme in the browser is not yet supported."
            size="sm"
            className="ml-2"
            variant="outline-primary"
            onClick={downloadJsonFile}
          >
            Download Theme
          </Button>
        </Col>
      </Form.Group>
    </div>
  );
}
