import { Button, Container } from "react-bootstrap";
import { Content, Main, Page } from "layout/Page";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Footer from "layout/Footer";
import Header from "layout/Header";
import SearchBar from "layout/SearchBar";
import { Title } from "layout/Title";
import { setSetting } from "store/settingsSlice";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function GeniHome() {
  const router = useRouter();
  const [session, setSession] = useState();
  const [cookie, setCookie, removeCookie] = useCookies(["geni"]);
  const dispatch = useDispatch();

  // force settings to be as url, otherwise you get a mix up
  useEffect(() => {
    dispatch(setSetting({ dataSource: "geni" }));
  }, []);

  //Use session as a state otherwise server gets confused with pre-render
  useEffect(() => {
    setSession(cookie.geni);
  }, [cookie.geni]);

  useEffect(() => {
    if (router.query?.access_token && router.query?.expires_in) {
      const access_token = router.query?.access_token as string;
      const expires_in = +(router.query?.expires_in as string);

      setCookie("geni", JSON.stringify({ access_token }), {
        path: "/",
        maxAge: expires_in,
        sameSite: true,
      });

      router.push({}, undefined, {
        shallow: true,
      });
    }
  }, [router.query]);

  return (
    <Page>
      <Header />
      <SearchBar />
      <Main>
        <Container>
          <Content>
            <Title>EntiTree for Geni</Title>
            <p>
              Visualize connected Geni people items on a dynamic, navigable tree
              diagram. Discover properties of People, Organizations and Events
              with a direct link to Wikipedia Aticles.
            </p>
            <br />
            <br />
            {session ? (
              <Centered>
                <p>✅ You are logged in</p>
                <Button
                  key="show-tree"
                  variant="success"
                  href="/geni/en/family_tree/me"
                >
                  Show my tree
                </Button>
                <br />
                <br />
                <hr />
                <Button
                  onClick={() => {
                    removeCookie("geni");
                  }}
                  variant="outline-primary"
                >
                  Logout
                </Button>
              </Centered>
            ) : (
              <Centered>
                <p>
                  <b>Login with your Geni.com account</b>
                </p>
                <a
                  key="log-in"
                  href={`https://www.geni.com/platform/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GENI_APP_ID}&response_type=token`}
                >
                  <img
                    alt="Login with Geni"
                    src="https://www.geni.com/images/connect/login-large.png"
                  />
                </a>
              </Centered>
            )}
          </Content>
        </Container>
      </Main>
      <Footer />
    </Page>
  );
}

const Centered = styled.div`
  text-align: center;
`;
