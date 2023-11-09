import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import { Helmet, HelmetProvider } from "react-helmet-async";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const CareerThankyou = ({ data }) => {
  const thankyou = data?.wpPage || [];
  const seo = data?.wpPage?.seo || []
  return (
    <>
      <HelmetProvider>
        <GatsbySeo
          title={seo && seo.title}
          description={seo && seo.metaDesc}
          canonical={seo && seo.canonical}
          openGraph={{
            url: seo && seo.opengraphUrl,
            title: seo && seo.opengraphTitle,
            description: seo && seo.opengraphDescription,
            images: [
              {
                url: seo && seo.opengraphImage.mediaItemUrl,
                width: seo && seo.opengraphImage.width,
                height: seo && seo.opengraphImage.height,
                alt: seo && seo.opengraphTitle,
              },
            ],
            site_name: seo && seo.opengraphSiteName,
          }}
          twitter={{
            handle: '@handle',
            site: '@site',
            cardType: 'summary_large_image',
          }}
          nofollow={seo && seo.metaRobotsNofollow === "follow" ? true : false}
          noindex={seo && seo.metaRobotsNoindex === "index" ? true : false}
          article={{
            modifiedTime: seo && seo.opengraphModifiedTime
          }}
        />
        <Helmet bodyAttributes={{ class: "page-template-tp-thankyou" }}></Helmet>
      </HelmetProvider>
      <Layout>


        <section class="main-content">
          <div class="container first-paragraph">
            <h1>{thankyou && thankyou.title}</h1>

            <span dangerouslySetInnerHTML={{ __html: thankyou.content }} />
          </div>
        </section>
      </Layout>
    </>
  );
};
export const data = graphql`
  query MyQuery {
    wpPage(databaseId: { eq: 546 }) {
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
      }
    }
  }
`;
export default CareerThankyou;
