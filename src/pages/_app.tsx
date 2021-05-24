import "bootstrap/dist/css/bootstrap.min.css";

import store, { persistor, useAppSelector, wrapper } from "../store";

import { AppProps } from "next/app";
import { DEFAULT_DESC } from "constants/meta";
import { GlobalStyle } from "components/GlobalStyle";
import Head from "next/head";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import React from "react";
import ReactGA from "react-ga";
import { ThemeProvider } from "styled-components";

ReactGA.initialize("UA-171207101-1");

const MyApp = ({ Component, pageProps }: AppProps) => {
  const currentTheme = useAppSelector(({ theme }) => theme);
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Head>
        <title>EntiTree - Grow your knowledge</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={DEFAULT_DESC} />
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={currentTheme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </PersistGate>
  );
};

export default wrapper.withRedux(MyApp);
