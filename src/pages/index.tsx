import { Card, Col, Container, Row } from "react-bootstrap";
import React, { useEffect } from "react";

import Div100vh from "react-div-100vh";
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
    dispatch(setSetting({ wikibaseAlias: "wikidata" }));
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
                <Col>
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
                        Explore Living and past Royal family trees
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
                <Col>
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
                        Search for anyone in the world, literally, anyone
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              </StyledRow>
              <StyledRow>
                <Col>
                  <a
                    title="The Simpson's family tree"
                    href="/en/family_tree/Homer_Simpson?0u0=u"
                  >
                    <Card>
                      <ImgBox
                        alt="The Simpson's family tree"
                        src="/examples/simpsons.png"
                      />

                      <Card.Body>
                        Get entertained with Fictional characters and their
                        ancestors
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
                <Col>
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
                </Col>
              </StyledRow>
              <StyledRow>
                <Col>
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
                </Col>
                <Col>
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
                </Col>
              </StyledRow>
              <StyledRow>
                <Col>
                  <a
                    title="Go to Entitree's Medium page"
                    href="https://wikidata.medium.com/"
                  >
                    <Card>
                      <ImgBox
                        alt="Medium article"
                        src="/examples/lana-del-rey.png"
                      />
                      <Card.Body>
                        Read more Medium articles, there are more than 600 trees
                        created
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
                <Col>
                  <a
                    title="Go to Kim Jong-il's page"
                    href="/en/family_tree/Kim_Jong-il"
                  >
                    <Card>
                      <ImgBox
                        alt="Medium article"
                        src="/examples/settings.png"
                      />
                      <Card.Body>
                        Entitree is Multi-Label, and Multi-Language 👌
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              </StyledRow>
              <SubTitle>What they say about us:</SubTitle>
              <StyledRow>
                <Col>
                  <Card>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>
                          Wow. This is a really great website! It will
                          definitely be useful for the research I do on a
                          regular basis.
                        </p>
                        <footer className="blockquote-footer">
                          <cite title="Source Title">UsefulCharts</cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>
                          I just learned about Entitree and I am really excited
                          to see it!
                        </p>
                        <footer className="blockquote-footer">
                          <cite title="Source Title">Wikidocumentaries</cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </Col>
              </StyledRow>
              <StyledRow>
                <Col>
                  <Card>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>
                          Congratulations to your really great tool! It is so
                          much fun to surf through connected data with that.
                        </p>
                        <footer className="blockquote-footer">
                          <cite title="Source Title">Garetien</cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>Love it!</p>
                        <footer className="blockquote-footer">
                          <cite title="Source Title">royaltrees.co.uk</cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </Col>
              </StyledRow>
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
  max-width: 680px;
  margin: 0 auto;
`;

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

const StyledRow = styled(Row)`
  margin-bottom: 16px;
`;
