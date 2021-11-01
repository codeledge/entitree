import { Card, Col, Container, Row } from "react-bootstrap";
import { Content, Main, Page } from "layout/Page";
import React, { useEffect } from "react";

import Footer from "layout/Footer";
import Header from "../layout/Header";
import SearchBar from "layout/SearchBar";
import { SubTitle } from "layout/SubTitle";
import { Title } from "layout/Title";
import TreeLoader from "layout/TreeLoader";
import { setSetting } from "store/settingsSlice";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";

const imgHeight = 240;

export default function Home() {
  const { loadingEntity } = useAppSelector(({ tree }) => tree);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSetting({ dataSource: "wikidata" }));
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
                with a direct link to Wikipedia Articles.
              </p>
              <StyledRow>
                <StyledCol xs={12} md={6}>
                  <a title="" href="/geni">
                    <Card>
                      <ImgBox alt="Geni Logo" src="/icons/geni_big.png" />

                      <Card.Body>
                        Start exploring &amp; visualizing your own family tree,
                        if you have an account on Geni.com
                      </Card.Body>
                    </Card>
                  </a>
                </StyledCol>
                <StyledCol xs={12} md={6}>
                  <a
                    title="Go to Queen Elizabeth II family tree"
                    href="/en/family_tree/Elizabeth_II"
                  >
                    <Card>
                      <ImgBox
                        alt="Queen Elizabeth II family tree"
                        src="/examples/queen.png"
                      />

                      <Card.Body>
                        Explore the British royal family tree 👸🏻🤴
                      </Card.Body>
                    </Card>
                  </a>
                </StyledCol>
              </StyledRow>
              <StyledRow>
                <StyledCol xs={12} md={6}>
                  <a
                    title="Go to Freddie mercury's family tree"
                    href="/en/family_tree/Freddie_Mercury"
                  >
                    <Card>
                      <ImgBox
                        alt="An example search"
                        src="/examples/freddie.png"
                      />
                      <Card.Body>
                        Search for anyone in the world, literally, anyone 🌎
                      </Card.Body>
                    </Card>
                  </a>
                </StyledCol>
                <StyledCol xs={12} md={6}>
                  <a
                    title="Go to Joe Biden's family tree"
                    href="/en/family_tree/Joe_Biden"
                  >
                    <Card>
                      <ImgBox
                        alt="Joe Biden family tree"
                        src="/examples/joe-biden.png"
                      />
                      <Card.Body>
                        Explore family trees of Presidents, Actors and Famous
                        People
                      </Card.Body>
                    </Card>
                  </a>
                </StyledCol>
              </StyledRow>
              <StyledRow>
                <StyledCol xs={12} md={6}>
                  <a
                    title="Go to Spongebob's family tree"
                    href="/en/family_tree/SpongeBob_SquarePants_(character)?0u1=u"
                  >
                    <Card>
                      <ImgBox
                        alt="Spongebob family tree"
                        src="/examples/spongebob.png"
                      />
                      <Card.Body>
                        Did we mention Fictional characters? And theme
                        customisation?
                      </Card.Body>
                    </Card>
                  </a>
                </StyledCol>
                <StyledCol xs={12} md={6}>
                  <Card>
                    <iframe
                      style={{ maxWidth: "100%" }}
                      height={imgHeight}
                      frameBorder="0"
                      title="How does it work?"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      src="https://www.youtube.com/embed/uYXUJz3W6J4"
                    />
                    <Card.Body>
                      Watch an introductory video to familiarize with the
                      navigation
                    </Card.Body>
                  </Card>
                </StyledCol>
              </StyledRow>
              <StyledRow>
                <StyledCol xs={12} md={6}>
                  <a
                    title="Go to Entitree's Medium page"
                    href="https://medium.com/family-trees"
                  >
                    <Card>
                      <ImgBox
                        alt="Medium article"
                        src="/examples/lana-del-rey.png"
                      />
                      <Card.Body>
                        Read more Medium articles, there are more than 600 trees
                        created 📝
                      </Card.Body>
                    </Card>
                  </a>
                </StyledCol>
                <StyledCol xs={12} md={6}>
                  <Card>
                    <a
                      title="Go to Kim Jong-il's page"
                      href="/en/family_tree/Kim_Jong-il"
                    >
                      <ImgBox
                        alt="Medium article"
                        src="/examples/settings.png"
                      />
                      <Card.Body>
                        Entitree is Multi-Label, and Multi-Language 👌
                      </Card.Body>
                    </a>
                  </Card>
                </StyledCol>
              </StyledRow>
              <SubTitle>What they say about us:</SubTitle>
              <StyledRow>
                <StyledCol xs={12} md={6}>
                  <Card>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>
                          Wow. This is a really great website! It will
                          definitely be useful for the research I do on a
                          regular basis.
                        </p>
                        <footer className="blockquote-footer">
                          <cite>
                            <a
                              target="_blank"
                              href="https://usefulcharts.com/"
                              rel="noreferrer"
                            >
                              UsefulCharts
                            </a>
                          </cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </StyledCol>
                <StyledCol xs={12} md={6}>
                  <Card>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>
                          I just learned about Entitree and I am really excited
                          to see it!
                        </p>
                        <footer className="blockquote-footer">
                          <cite>
                            <a
                              target="_blank"
                              href="https://wikidocumentaries-demo.wmflabs.org/"
                              rel="noreferrer"
                            >
                              Wikidocumentaries
                            </a>
                          </cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </StyledCol>
              </StyledRow>
              <StyledRow>
                <StyledCol xs={12} md={6}>
                  <Card>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>
                          Congratulations to your really great tool! It is so
                          much fun to surf through connected data with that.
                        </p>
                        <footer className="blockquote-footer">
                          <cite>
                            <a
                              target="_blank"
                              href="https://www.garetien.de/index.php?title=Hauptseite"
                              rel="noreferrer"
                            >
                              Garetien
                            </a>
                          </cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </StyledCol>
                <StyledCol xs={12} md={6}>
                  <Card>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>Love it!</p>
                        <footer className="blockquote-footer">
                          <cite>
                            <a
                              target="_blank"
                              href="http://royaltrees.co.uk/"
                              rel="noreferrer"
                            >
                              royaltrees.co.uk
                            </a>
                          </cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </StyledCol>
              </StyledRow>
            </Content>
          </Container>
        )}
      </Main>
      <Footer />
    </Page>
  );
}

const ImgBox = ({ alt, src }) => {
  return (
    <ImgBoxWrapper>
      <img alt={alt} src={src} />
    </ImgBoxWrapper>
  );
};

const ImgBoxWrapper = styled.div`
  height: ${imgHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const StyledRow = styled(Row)``;

const StyledCol = styled(Col)`
  margin-bottom: 16px;
`;
