import { Container } from "react-bootstrap";
import Div100vh from "react-div-100vh";
import Footer from "layout/Footer";
import Header from "../layout/Header";
import React from "react";
import SearchBar from "layout/SearchBar";
import { Title } from "layout/Title";
import styled from "styled-components";

export default function Home() {
  return (
    <Page>
      <Header />
      <SearchBar />
      <Main>
        <Container>
          <Content>
            <Title>EntiTree</Title>
            <p>
              Visualize connected Wikidata items on a dynamic, navigable tree
              diagram. Discover properties of People, Organizations and Events
              with a direct link to Wikipedia Aticles.
            </p>
            <iframe
              style={{ maxWidth: "100%" }}
              width="560"
              height="315"
              frameBorder="0"
              title="How does it work?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              src="https://www.youtube.com/embed/uYXUJz3W6J4"
            />
          </Content>
        </Container>
      </Main>
      <Footer />
    </Page>
  );
}

const Page = styled(Div100vh)`
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex-grow: 1;
  paddin
`;

const Content = styled.main`
  max-width: 560px;
  margin: 0 auto;
`;

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
