import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import { Helmet, HelmetProvider } from "react-helmet-async";
const WEBSITE_URL = process.env.GATSBY_BASE_URL;
const Error = () => {
  return (
    <>
      <HelmetProvider>
        <GatsbySeo
          title={"Page not found - Innerspace Dubai"}
          openGraph={{
            title: "Page not found - Innerspace Dubai",
            site_name: "Innerspace Dubai",
          }}
          twitter={{
            handle: '@handle',
            site: '@site',
            cardType: 'summary_large_image',
          }}

          noindex={false}

        />
        <Helmet bodyAttributes={{ class: "error404" }}></Helmet>
      </HelmetProvider>
      <Layout>
        <section class="main-content error-404 not-found">
          <div class="container first-paragraph page-content">
            <h1 class="entry-title">Oops! That page can’t be found.</h1>

            <div class="intro-text"><p>This page either doesn't exist, or it moved somewhere else.</p></div>
            <div class="back-to-home-btn btn-wrapp"><a href="https://www.innerspacedxb.com" class="btn">Go To Home</a></div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Error;
