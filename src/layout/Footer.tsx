import { Container, Nav, Navbar } from "react-bootstrap";
import { FaCreativeCommons, FaGithub } from "react-icons/fa";

import Link from "next/link";
import React, { useEffect, useRef } from "react";

import NoSsr from "./NoSsr";
import styled from "styled-components";

export default function Footer() {
  return (
    <StyledFooter className="Footer" bg="light" expand="lg">
      <Container>
        <Nav className="me-auto">
          <Navbar.Brand
            id="wikidata-logo"
            target="_blank"
            href="https://www.wikidata.org"
          >
            <img
              height="30"
              src="/powered-by-wikidata-light.png"
              alt="Powered By Wikidata"
            />
          </Navbar.Brand>
          <Nav.Link
            target="_blank"
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.en"
          >
            <FaCreativeCommons />
          </Nav.Link>
          <Nav.Link
            target="_blank"
            href="https://github.com/codeledge/entitree"
          >
            <FaGithub />
          </Nav.Link>
          <Nav.Item id="twitterFollowButton">
            <NoSsr>
              <TwitterFollowButton />
            </NoSsr>
          </Nav.Item>
        </Nav>
        <Nav className="ms-auto rightLinks">
          <Nav.Link as={Link} href="/about">
            About
          </Nav.Link>
          <Nav.Link as={Link} href="/privacy">
            Privacy
          </Nav.Link>
        </Nav>
      </Container>
    </StyledFooter>
  );
}

// Twitter's widgets.js swaps this link for an iframe as soon as it loads,
// which can happen before React hydrates and causes a hydration mismatch.
// Render it in the browser only, and ask widgets.js to upgrade it if the
// script was already loaded by the time we mount.
function TwitterFollowButton() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    (window as any).twttr?.widgets?.load(ref.current);
  }, []);

  return (
    <span ref={ref}>
      <a
        href="https://twitter.com/EntitreeApp?ref_src=twsrc%5Etfw"
        className="twitter-follow-button"
      >
        Follow EntiTree
      </a>
    </span>
  );
}

const StyledFooter = styled(Navbar)`
  //height: 58px;
  .navbar-nav {
    flex-direction: row;
    a {
      padding-right: 0.5rem;
      padding-left: 0.5rem;
    }
    .nav-item {
      margin-top: 12px;
      margin-left: 5px;
    }
    @media (max-width: 600px) {
      #wikidata-logo {
        display: none;
      }
    }
  }
  .rightLinks {
    @media (max-width: 768px) {
      margin-left: unset !important;
    }
  }
`;
