import "bootstrap/dist/css/bootstrap.min.css";

import store, { persistor, wrapper } from "../store";

import { AppProps } from "next/app";
import { GlobalStyle } from "layout/GlobalStyle";
import Head from "next/head";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import React from "react";
import ReactGA from "react-ga";
import { ThemeProvider } from "styled-components";
import { useCurrentTheme } from "hooks/useCurrentTheme";
import usePageView from "hooks/usePageView";
import useReadQuery from "../hooks/useReadQuery";

ReactGA.initialize("UA-171207101-1");

const MyApp = ({ Component, pageProps }: AppProps) => {
  const currentTheme = useCurrentTheme();
  usePageView();
  useReadQuery();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6287145012628815"
          crossOrigin="anonymous"
        />
        <script async src="https://platform.twitter.com/widgets.js" />
      </Head>
      <GlobalStyle />
      <PersistGate loading={null} persistor={persistor}>
        {() => (
          <ThemeProvider theme={currentTheme}>
            <Provider store={store}>
              <Component {...pageProps} />
            </Provider>
          </ThemeProvider>
        )}
      </PersistGate>
    </>
  );
};

export default wrapper.withRedux(MyApp);
