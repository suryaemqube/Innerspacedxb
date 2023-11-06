import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Seo from "../components/SeoMeta";

const BlogDetail = ({ data, pageContext }) => {
  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MAIN_URL = process.env.GATSBY_MAIN_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;
  const { pageUri, pageId } = pageContext;

  const blogpost = data?.wpPost || [];
  const isBrowser = typeof window !== "undefined";

  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  return (
    <Layout>
      <Seo pageUrl={`${WEBSITE_URL}${pageUri}`} />
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
