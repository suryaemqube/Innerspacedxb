import React, { useEffect, useContext } from "react";
import { Slice } from "gatsby";
import { PageStateContext } from "../components/context/PageStateContext";
import Lenis from "@studio-freight/lenis";

import "swiper/css/bundle";
import "swiper/css/navigation";

import "../assets/css/normalize.css";
import "../assets/css/home-common-responsive.css";
import "../assets/css/main.css";
import "../assets/css/inside.css";
import "../assets/css/room-type.css";
import "../assets/css/identity.css";
import "../assets/css/brands.css";
import "../assets/css/last-chance-archive.css";

import "../assets/css/uifixer.css";

const Layout = ({ children }) => {

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

    lenis.on("scroll", (e) => { });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  return (
    <>
      <Slice alias="navigation-bar" />
      <div className={layoutClassName}>{children}</div>
      <Slice alias="footer" />
    </>
  );
};

export default Layout;
