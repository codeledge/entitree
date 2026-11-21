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
import ReactGA from "react-ga4";
import { SITE_NAME } from "../constants/meta";
import SettingsModal from "modals/SettingsModal";
import { setLoadingEntity } from "store/treeSlice";
import styled from "styled-components";
import { useAppDispatch } from "store";

export default function Header({ simple }: { simple?: boolean }) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const dispatch = useAppDispatch();

  const openSettingsModal = () => {
    ReactGA.event({
      category: "UI",
      action: `click`,
      label: "Settings modal button",
    });
    setShowSettingsModal(true);
  };

  const openExampleLink = (e) => {
    dispatch(setLoadingEntity(true));
    ReactGA.event({
      category: "UI",
      action: "click",
      label: "example " + e.target.href,
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
              <Dropdown.Item
                key={name}
                as={Link}
                href={href}
                onClick={openExampleLink}
              >
                {name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        )}
        {!simple && (
          <Nav className="ms-auto">
            <Button
              className="settingsButton"
              variant="none"
              onClick={openSettingsModal}
            >
              settings
              <FiSliders className="ms-2" />
            </Button>
            <SettingsModal
              show={showSettingsModal}
              onHideModal={() => setShowSettingsModal(false)}
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
