import "bootstrap/dist/css/bootstrap.min.css";

// Configure axios defaults for Wikipedia REST API compliance
// See: https://w.wiki/4wJS and T400119
import "lib/axiosConfig";

import store, { persistor, useAppSelector, wrapper } from "../store";

import { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";
import { GlobalStyle } from "layout/GlobalStyle";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { ThemeProvider } from "styled-components";
import { useCurrentTheme } from "hooks/useCurrentTheme";
import usePageView from "hooks/usePageView";
import useReadQuery from "../hooks/useReadQuery";
import DonateModal from "modals/DonateModal";

ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_CODE || "placeholder", {
  testMode: !process.env.NEXT_PUBLIC_GA_TRACKING_CODE,
});

const MINUTES_BEFORE_SHOWING_MODAL = 3;

const MyApp = ({ Component, pageProps }: AppProps) => {
  const currentTheme = useCurrentTheme();
  usePageView();
  useReadQuery();

  const [showDonateModal, setShowDonateModal] = useState(false);
  const hasDonatedAt = useAppSelector(({ settings }) => settings.hasDonatedAt);
  useEffect(() => {
    if (!hasDonatedAt) {
      const timer = setTimeout(() => {
        setShowDonateModal(true);
      }, 1000 * 60 * MINUTES_BEFORE_SHOWING_MODAL);

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <CookiesProvider>
      <GlobalStyle />
      <PersistGate loading={null} persistor={persistor}>
        {() => (
          <ThemeProvider theme={currentTheme}>
            <Provider store={store}>
              <Component {...pageProps} />
              {showDonateModal && (
                <DonateModal onHideModal={() => setShowDonateModal(false)} />
              )}
            </Provider>
          </ThemeProvider>
        )}
      </PersistGate>
    </CookiesProvider>
  );
};

export default wrapper.withRedux(MyApp);
