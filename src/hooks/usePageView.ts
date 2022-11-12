import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function usePageView() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ReactGA.send({ hitType: "pageview", page: url });
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
