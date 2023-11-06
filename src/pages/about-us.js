import React, { useEffect, useState } from "react";
// import { graphql } from "gatsby";
// import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from "../components/Layout";
import Seo from "../components/SeoMeta";
// import Breadcrumb from "../components/Breadcrumbs";
import { getOptionData } from "../hooks/optionpage";


const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const Navbar = ({ data }) => {
  const [options, setOptions] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const fetchOptionData = async () => {
      try {
        const fetchedData = await getOptionData();
        setOptions(fetchedData);
        console.log("fetchedData: ", fetchedData);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchOptionData();
  }, []);

  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!isBrowser) return;
    setWindowWidth(isBrowser ? window.innerWidth : 0);
    const handleResize = () => {
      setWindowWidth(isBrowser ? window.innerWidth : 0);
    };
    window.addEventListener("resize", handleResize);
    { console.log("windowWidth", windowWidth) }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <Layout>
      <Seo pageUrl={`${WEBSITE_URL}/about-us/`}></Seo>
      <h1>About Us</h1>

    </Layout>
  );
};

// export const data = graphql`
// `;

export default Navbar;
