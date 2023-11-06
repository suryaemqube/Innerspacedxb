import React, { useEffect, useState } from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from "../components/Layout";
import Seo from "../components/SeoMeta";
import { getOptionData } from "../hooks/optionpage";


const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const ProductDetail = ({ pageContext, data }) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [options, setOptions] = useState(null);
  const post = pageContext;

  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!isBrowser) return;
    // Access the window object in the useEffect hook
    setWindowWidth(isBrowser ? window.innerWidth : 0);
    const handleResize = () => {
      setWindowWidth(isBrowser ? window.innerWidth : 0);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchOptionData = async () => {
      try {
        const fetchedData = await getOptionData();
        setOptions(fetchedData);
        console.log("fetchedData: ");
        console.log(fetchedData);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchOptionData();
  }, []);

  const PAGELINK = post.pageLink;
  const PAGENAME = post.pageName;

  return (
    <Layout>
      <Seo pageUrl={`${WEBSITE_URL}${PAGELINK}`} />
    </Layout >
  );
};



export default ProductDetail;
