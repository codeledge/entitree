import { Button, Container } from "react-bootstrap";
import { Content, Main, Page } from "layout/Page";
import React, { useEffect } from "react";

import Footer from "layout/Footer";
import Header from "layout/Header";
import SearchBar from "layout/SearchBar";
import { Title } from "layout/Title";
//import { parseCookies } from "helpers/cookies";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export default function GeniHome() {
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies(["geni"]);

  // force settings to be as url, otherwise you get a mix up

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
              with a direct link to Wikipedia Aticles. <br />
              <br />
              {cookie.geni ? (
                <>
                  <a href="/geni/en/family_tree/me">
                    <Button title="">Show my tree</Button>
                  </a>
                  <br />
                  <div>✅ You are logged in</div>
                  <br />
                  <hr />
                  <Button
                    color="#ff5c5c"
                    onClick={() => removeCookie("geni")}
                    title=""
                  >
                    Logout
                  </Button>

                  <br />
                </>
              ) : (
                <div>
                  Please login first.
                  <br />
                  <a
                    href={`https://www.geni.com/platform/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GENI_APP_ID}&response_type=token`}
                  >
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
      </Main>
      <Footer />
    </Page>
  );
}
