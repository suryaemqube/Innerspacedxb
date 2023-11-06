import React, { useEffect, useState } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Seo from "../components/SeoMeta";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const CareerThankyou = ({ data }) => {
  const thankyou = data?.wpPage || [];
  return (
    <Layout>
      <Seo
        pageUrl={`${WEBSITE_URL}/career-thank-you/`}
        bodyClass={`page-template-tp-thankyou`}
      ></Seo>

      <section class="main-content">
        <div class="container first-paragraph">
          <h1>{thankyou && thankyou.title}</h1>

          <span dangerouslySetInnerHTML={{ __html: thankyou.content }} />
        </div>
      </section>
    </Layout>
  );
};
export const data = graphql`
  query MyQuery {
    wpPage(databaseId: { eq: 546 }) {
      id
      title
      content
    }
  }
`;
export default CareerThankyou;
