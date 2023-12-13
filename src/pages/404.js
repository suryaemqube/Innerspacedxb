import React from "react";
import Seo from "../components/SeoMeta";
import Layout from "../components/Layout";
const Error = () => {
  return (
    <Layout>
      <section class="main-content error-404 not-found">
        <div class="container first-paragraph page-content">
          <h1 class="entry-title">Oops! That page can’t be found.</h1>

          <div class="intro-text"><p>This page either doesn't exist, or it moved somewhere else.</p></div>
          <div class="back-to-home-btn btn-wrapp"><a href="/" class="btn">Go To Home</a></div>
        </div>
      </section>
    </Layout>
  );
};

export default Error;
export const Head = ({ data }) => (
  <Seo seoData={data?.wpPage?.seo || []} bodyClass={"error404"} title={"Page not found - Innerspacedxb"}>
  </Seo>
)