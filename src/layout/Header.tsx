import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Nav,
  Navbar,
} from "react-bootstrap";
import React, { useState } from "react";

import { EXAMPLES } from "../constants/examples";
import { FiSliders } from "react-icons/fi";
import Link from "next/link";
import Logo from "./Logo";
import ReactGA from "react-ga";
import { SITE_NAME } from "../constants/meta";
import SettingsModal from "modals/SettingsModal";
import styled from "styled-components";

export default function Header({ simple }: { simple?: boolean }) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const openSettingsModal = () => {
    ReactGA.modalview("settings");
    setShowSettingsModal(true);
  };

  const openExampleLink = (e) => {
    ReactGA.event({
      category: "Examples",
      action: "Clicked on example",
      label: e.target.href,
    });
  };

  return (
    <ThemedHeader className="Header" bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <Logo /> {SITE_NAME}
        </Navbar.Brand>
        {!simple && (
          <DropdownButton
            title="Examples"
            variant="info"
            size="sm"
            id="mainExamplesButtom"
            className="examplesButton"
          >
            {EXAMPLES.map(({ name, href }) => (
              <Link key={name} href={href} passHref>
                <Dropdown.Item onClick={openExampleLink}>{name}</Dropdown.Item>
              </Link>
            ))}
          </DropdownButton>
        )}
        {!simple && (
          <Nav className="ml-auto">
            <Button
              className="settingsButton"
              variant="none"
              onClick={openSettingsModal}
            >
              settings
              <FiSliders className="ml-2" />
            </Button>
            <SettingsModal
              show={showSettingsModal}
              hideModal={() => setShowSettingsModal(false)}
            />
          </Nav>
        )}
      </Container>
    </ThemedHeader>
  );
}

const ThemedHeader = styled(Navbar)`
  flex: 0 0 ${({ theme }) => theme.headerHeight}px;
  padding-top: 0;
  padding-bottom: 0;
  height: 50px; //just a default fallback for other pages
  .navbar-brand {
    margin-right: 0;
    svg {
      top: -2px;
      position: relative;
    }
  }
  .examplesButton {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99; // stay over tree

    .dropdown-menu {
      top: 105%;
    }
    @media (max-width: 576px) {
      .dropdown-menu {
        left: 45px;
        transform: translateX(-50%);
      }
    }
  }
  .settingsButton {
    color: white;
    &:hover {
      background-color: lightgray;
      color: #233;
    }
    svg {
      position: relative;
      top: -1px;
    }
  }
`;
