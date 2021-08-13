import ReactGA from "react-ga";
import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { setSetting } from "../store/settingsSlice";
import { useDispatch } from "react-redux";

export default function useReadQuery() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Router.router?.query.theme) {
      //TODO check if theme exists
      dispatch(
        setSetting({ key: "themeCode", val: Router.router?.query.theme }),
      );
    }
  }, [router.events]);
}
