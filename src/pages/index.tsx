import React, { useEffect } from "react";

import { Container } from "react-bootstrap";
import Div100vh from "react-div-100vh";
import Footer from "layout/Footer";
import Header from "../layout/Header";
import SearchBar from "layout/SearchBar";
import { Title } from "layout/Title";
import TreeLoader from "layout/TreeLoader";
import { setSetting } from "store/settingsSlice";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";

export default function Home() {
  const { loadingEntity } = useAppSelector(({ tree }) => tree);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSetting({ wikibase: "wikidata" }));
  }, []);
  return (
    <Page>
      <Header />
      <SearchBar />
      <Main>
        {loadingEntity ? (
          <TreeLoader />
        ) : (
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
        )}
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
  position: relative;
`;

const Content = styled.main`
  max-width: 560px;
  margin: 0 auto;
`;
