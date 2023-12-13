import React, { useEffect, useState } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Seo from "../components/SeoMeta";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const SubscribeThankyou = ({ data }) => {
  const thankyou = data?.wpPage || [];
  return (
    <Layout>
      <section class="main-content">
        <div class="container first-paragraph">
          <h1>{thankyou && thankyou.title}</h1>

          <span dangerouslySetInnerHTML={{ __html: thankyou.content }} />
        </div>
      </section>
    </Layout>
  );
};
export const Head = ({ data }) => (
  <Seo seoData={data?.wpPage?.seo || []} bodyClass={"page-template-tp-thankyou"}>
  </Seo>
)
export const data = graphql`
  query MyQuery {
    wpPage(databaseId: { eq: 553 }) {
      id
      title
      content
      seo {
    canonical
    opengraphDescription
      opengraphImage {
        altText
        mediaItemUrl
        height
        width
        mediaType
    }
    opengraphSiteName
    opengraphTitle
    metaRobotsNofollow
    metaRobotsNoindex
    opengraphUrl
    opengraphModifiedTime
    opengraphType
    title
    metaDesc
      schema {
        raw
    }
}
    }
  }
`;
export default SubscribeThankyou;
