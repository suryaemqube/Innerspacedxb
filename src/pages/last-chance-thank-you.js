import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Seo from "../components/SeoMeta";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const LastThankyou = ({ data }) => {
  const thankyou = data?.wpPage || [];
  return (
    <Layout>
      <Seo
        pageUrl={`${WEBSITE_URL}/last-chance-thank-you/`}
        bodyClass={`last-chance-ty`}
      ></Seo>

      <section class="header">
        <div class="holder">
          <picture>
            <source
              srcset="https://www.innerspacedxb.com/wp-content/themes/Innerspacechild/img/design-the-wardrobe-mobile.jpg"
              media="(max-width: 767px)"
            />
            <img
              src="https://www.innerspacedxb.com/wp-content/themes/Innerspacechild/img/design-the-wardrobe.jpg"
              alt="Bespoke Wardrobes Designed in Dubai and Made in Germany"
            />
          </picture>
        </div>
        <div class="header-content">
          <div class="logo" style={{ "margin-bottom": "40px;" }}>
            <a href="https://www.innerspacedxb.com/">
              {thankyou && (
                <img
                  src={thankyou.featuredImage.node.mediaItemUrl}
                  alt="Innerspace Logo"
                />
              )}
            </a>
          </div>

          <span dangerouslySetInnerHTML={{ __html: thankyou.content }} />
        </div>
      </section>
    </Layout>
  );
};
export const data = graphql`
  query MyQuery {
    wpPage(databaseId: { eq: 1561 }) {
      id
      title
      content
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
    }
  }
`;
export default LastThankyou;
