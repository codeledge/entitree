import "bootstrap/dist/css/bootstrap.min.css";

// Configure axios defaults for Wikipedia REST API compliance
// See: https://w.wiki/4wJS and T400119
import "lib/axiosConfig";

import { getPersistor, useAppSelector, wrapper } from "../store";
import { ReactElement, useEffect, useState } from "react";

import { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";
import DonateModal from "modals/DonateModal";
import { GlobalStyle } from "layout/GlobalStyle";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ReactGA from "react-ga4";
import isPropValid from "@emotion/is-prop-valid";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { useCurrentTheme } from "hooks/useCurrentTheme";
import usePageView from "hooks/usePageView";
import useReadQuery from "../hooks/useReadQuery";

ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_CODE || "placeholder", {
  testMode: !process.env.NEXT_PUBLIC_GA_TRACKING_CODE,
});

const MINUTES_BEFORE_SHOWING_MODAL = 3;

// styled-components v6 no longer filters props before they reach the DOM;
// keep the v5 behaviour so styling props don't end up as HTML attributes
const shouldForwardProp = (prop: string, target: unknown) =>
  typeof target === "string" ? isPropValid(prop) : true;

// Everything that reads the store has to live inside the Provider
const AppContent = ({ Component, pageProps }: Omit<AppProps, "router">) => {
  const currentTheme = useCurrentTheme();
  usePageView();
  useReadQuery();

  const [showDonateModal, setShowDonateModal] = useState(false);
  const hasDonatedAt = useAppSelector(({ settings }) => settings.hasDonatedAt);
  useEffect(() => {
    if (!hasDonatedAt) {
      const timer = setTimeout(
        () => {
          setShowDonateModal(true);
        },
        1000 * 60 * MINUTES_BEFORE_SHOWING_MODAL,
      );

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <Component {...pageProps} />
      {showDonateModal && (
        <DonateModal onHideModal={() => setShowDonateModal(false)} />
      )}
    </ThemeProvider>
  );
};

const MaybePersistGate = ({ children }: { children: ReactElement }) => {
  const persistor = getPersistor();
  if (!persistor) return children;

  return (
    <PersistGate loading={null} persistor={persistor}>
      {() => children}
    </PersistGate>
  );
};

const MyApp = ({ Component, ...rest }: AppProps) => {
  // a fresh store per request on the server, the same one in the browser
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <CookiesProvider>
        <GlobalStyle />
        <Provider store={store}>
          <MaybePersistGate>
            <AppContent Component={Component} pageProps={props.pageProps} />
          </MaybePersistGate>
        </Provider>
      </CookiesProvider>
    </StyleSheetManager>
  );
};

export default MyApp;
