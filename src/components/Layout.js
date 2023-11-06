import React, { useEffect, useContext } from "react";
import { Slice } from "gatsby";
import { HelmetProvider } from "react-helmet-async";
import { PageStateContext } from "../components/context/PageStateContext";
import Lenis from "@studio-freight/lenis";

const Layout = ({ children }) => {
  const helmetContext = {};

  const { pageState, setPageEntering, setPageActive, setPageExiting } =
    useContext(PageStateContext);
  const pageTransitionClasses = {
    entering: "page-entering",
    active: "page-active",
    exiting: "page-exiting",
  };
  console.log("pageState: ", pageState);

  const layoutClassName = `layout-fade ${pageTransitionClasses[pageState]}`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageActive();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [pageState]);

  useEffect(() => {
    const unlisten = navigateListener();
    return () => {
      unlisten();
    };
  }, []);

  const navigateListener = () => {
    return () => {
      setPageEntering();
    };
  };

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", (e) => {});

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  return (
    <HelmetProvider context={helmetContext}>
      <Slice alias="navigation-bar" />
      <div className={layoutClassName}>{children}</div>
      <Slice alias="footer" />
    </HelmetProvider>
  );
};

export default Layout;
