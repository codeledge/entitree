import { Container } from "react-bootstrap";
import Div100vh from "react-div-100vh";
import Footer from "layout/Footer";
import Header from "../../layout/Header";
import React from "react";
import SearchBar from "layout/SearchBar";
import { Title } from "layout/Title";
import TreeLoader from "layout/TreeLoader";
import styled from "styled-components";
import { useAppSelector } from "store";

export default function Home() {
  const { loadingEntity } = useAppSelector(({ tree }) => tree);
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
              <Title>EntiTree for FactGrid</Title>
              <p>
                Visualize connected FactGrid items on a dynamic, navigable tree
                diagram. Discover properties of People, Organizations and Events
                with a direct link to Wikipedia Aticles.
              </p>
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
