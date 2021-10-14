import { Button, Container } from "react-bootstrap";
import React, { useEffect } from "react";

import Div100vh from "react-div-100vh";
import Footer from "layout/Footer";
import Header from "../../layout/Header";
import SearchBar from "geni/layout/SearchBar";
import { Title } from "layout/Title";
import TreeLoader from "layout/TreeLoader";
import { parseCookies } from "helpers/cookie";
import { setSetting } from "store/settingsSlice";
import styled from "styled-components";
import { useAppSelector } from "store";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [cookie, setCookie] = useCookies(["geni"]);

  // force settings to be as url, otherwise you get a mix up

  useEffect(() => {
    dispatch(setSetting({ wikibaseAlias: "geni" }));
    if (router.query?.access_token && router.query?.expires_in) {
      const access_token = router.query?.access_token as string;
      const expires_in = +(router.query?.expires_in as string);
      console.log("set cookie");
      const geniCookie = { access_token, expires_in, loggedIn: true };
      setCookie("geni", JSON.stringify(geniCookie), {
        path: "/",
        maxAge: expires_in, // Expires after 1hr
        sameSite: true,
      });
      router.push({}, undefined, {
        shallow: true,
      });
    }
  }, [router.query]);
  // const geniCookie = parseCookies(router.req);
  // console.log(geniCookie);

  const { geni } = useAppSelector(({ settings }) => settings);

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
              <Title>EntiTree for Geni</Title>
              <p>
                Visualize connected Geni people items on a dynamic, navigable
                tree diagram. Discover properties of People, Organizations and
                Events with a direct link to Wikipedia Aticles. <br />
                <br />
                {cookie.geni?.loggedIn ? (
                  <>
                    <span>
                      You are logged in, your token is{" "}
                      {cookie.geni.access_token}
                    </span>
                    <br />
                    <Button onClick={() => setCookie("geni", "")} title="">
                      Logout
                    </Button>

                    <br />
                  </>
                ) : (
                  <div>
                    Please login first.
                    <br />
                    <a href="https://www.geni.com/platform/oauth/authorize?client_id=563&response_type=token">
                      <img
                        alt="Login with Geni"
                        src="https://www.geni.com/images/connect/login-large.png"
                      />
                    </a>
                  </div>
                )}
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
