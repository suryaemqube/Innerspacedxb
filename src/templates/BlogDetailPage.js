import React from "react";
import Layout from "../components/Layout";
import Seo from "../components/SeoMeta";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const BlogDetail = ({ data, pageContext }) => {
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;
  const blogpost = data?.wpPost || [];

  return (
    <>
      <Layout>
        <section class="header-image blog-thumbnail">
          {blogpost.featuredImage ? (
            <GatsbyImage
              image={getImage(blogpost.featuredImage.node)}
              alt={blogpost.title}
            />
          ) : (
            <img
              src={`${MEDIA_URL}/img/room-type-header-img.jpg`}
              alt={blogpost.title}
            />
          )}
          <h1 dangerouslySetInnerHTML={{ __html: blogpost.title }} />
        </section>

        <section class="main-content blog-detail-content">
          <div class="container">
            {blogpost.content ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: blogpost.content,
                }}
              />
            ) : (
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export const Head = ({ data }) => (
  <Seo seoData={data?.wpPost?.seo || []} pageUrl={data?.wpPost?.uri}>
  </Seo>
)

export const query = graphql`
  query MyQuery($pageId: Int!) {
    wpPost(databaseId: { eq: $pageId }) {
      title
      content
      uri
      featuredImage {
        node {
          mediaItemUrl
          altText
          height
          width
          gatsbyImage(
            height: 1200
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 1700
          )
        }
      }
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
export default BlogDetail;
