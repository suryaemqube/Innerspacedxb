import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const BlogDetail = ({ data, pageContext }) => {
  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;
  const { pageUri } = pageContext;

  const blogpost = data?.wpPost || [];

  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  return (
    <>
      <GatsbySeo
        title={blogpost.title}
        description={removeTags(blogpost.content.split(" ").slice(0, 60).join(" "))}
        canonical={`${WEBSITE_URL}${pageUri}`}
        openGraph={{
          url: `${WEBSITE_URL}${pageUri}`
          ,
          title: blogpost.title,
          description: removeTags(blogpost.content.split(" ").slice(0, 30).join(" ")),
          images: [
            {
              url: blogpost.featuredImage.node.mediaItemUrl,
              width: blogpost.featuredImage.node.width,
              height: blogpost.featuredImage.node.height,
              alt: 'Og Image Alt',
            },
          ],
          site_name: 'Innerspacedxb',
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />

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
    }
  }
`;
export default BlogDetail;
