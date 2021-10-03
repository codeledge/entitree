import { Container, Nav, Navbar } from "react-bootstrap";
import { FaCreativeCommons, FaGithub } from "react-icons/fa";

import Link from "next/link";
import React from "react";
import styled from "styled-components";

export default function Footer() {
  return (
    <StyledFooter className="Footer" bg="light" expand="lg">
      <Container>
        <Nav className="mr-auto">
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
            <a
              href="https://twitter.com/EntitreeApp?ref_src=twsrc%5Etfw"
              className="twitter-follow-button"
              // data-size="large"
              // data-show-screen-name=""
              // data-show-count=""
            >
              Follow EntiTree
            </a>
          </Nav.Item>
        </Nav>
        <Nav className="ml-auto rightLinks">
          <Link href="/about" passHref>
            <Nav.Link>About</Nav.Link>
          </Link>
          <Link href="/privacy" passHref>
            <Nav.Link>Privacy</Nav.Link>
          </Link>
        </Nav>
      </Container>
    </StyledFooter>
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
