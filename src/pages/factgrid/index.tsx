import { Content, Main, Page } from "layout/Page";
import React, { useEffect } from "react";

import { Container } from "react-bootstrap";
import Footer from "layout/Footer";
import Header from "../../layout/Header";
import SearchBar from "layout/SearchBar";
import { Title } from "layout/Title";
import TreeLoader from "layout/TreeLoader";
import { setSetting } from "store/settingsSlice";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();

  // force settings to be as url, otherwise you get a mix up
  useEffect(() => {
    dispatch(setSetting({ dataSource: "factgrid" }));
  }, []);

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
              <img
                src="/icons/factgrid.png"
                style={{ width: "300px" }}
                alt="FactGrid Logo"
              />{" "}
            </Content>
          </Container>
        )}
      </Main>
      <Footer />
    </Page>
  );
}
