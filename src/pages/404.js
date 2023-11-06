import React from "react";
import { Link } from "gatsby";
import Seo from "../components/SeoMeta";
import Layout from "../components/Layout";
const WEBSITE_URL = process.env.GATSBY_BASE_URL;
const Error = () => {
  return (
    <Layout>
      <Seo pageUrl={`${WEBSITE_URL}/error/`} title={"Page not found"} />

      <section className="error-page">
        <div className="container section-404">
          <h1>Page Not Found</h1>
          <p>
            We have just rewamped our website!! Looks like the page has moved to
            a new location. <br /> <Link to="/">Click Here</Link> to go to our
            homepage.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Error;
