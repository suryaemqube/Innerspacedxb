import React, { useState } from "react";
import Layout from "../components/Layout";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Seo from "../components/SeoMeta";


const Blog = ({ data }) => {
  const initialPerPage = 4;
  const [perPage, setPerPage] = useState(initialPerPage);

  const blogpost = data?.allWpPost?.edges || [];
  const blogPage = data?.wpPage || [];
  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;

  const loadMore = (e) => {
    e.preventDefault();
    setPerPage((prevPerPage) => prevPerPage + initialPerPage);
  };

  return (
    <Layout>

      <section class="header-image">
        {blogPage.featuredImage ? (
          <div class="wrapper">
            <div class="holder">
              <GatsbyImage
                image={getImage(blogPage.featuredImage.node)}
                alt={blogPage.title}
              />
            </div>
          </div>
        ) : (
          <img
            src={`${MEDIA_URL}/img/room-type-header-img.jpg`}
            alt={blogPage.title}
          />
        )}
        <h1>{blogPage.title}</h1>
      </section>

      {blogpost ? (
        <section class="main-content">
          <div class="container">
            <div class="blog-wrapper">
              <ul>
                {blogpost &&
                  blogpost.slice(0, perPage).map((post, index) => (
                    <li key={`ffdsfa` + index}>
                      <div class="blog-media">
                        <div class="wrapper">
                          <div class="holder">
                            <Link to={post.node.uri}>
                              {/* <img src={post.featuredImage.node.mediaItemUrl} alt="<?php echo $recent_alt_text ; ?>"
                            alt="every kitchen tells a story" /> */}
                              {post.node.featuredImage ? (
                                <GatsbyImage
                                  image={getImage(post.node.featuredImage.node)}
                                  alt={post.node.featuredImage.node.altText}
                                />
                              ) : (
                                <img
                                  src={`${MEDIA_URL}/img/room-type-header-img.jpg`}
                                  alt=""
                                />
                              )}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <h3
                        dangerouslySetInnerHTML={{ __html: post.node.title }}
                      />
                      <p
                        dangerouslySetInnerHTML={{
                          __html:
                            post.node.content
                              .split(" ")
                              .slice(0, 20)
                              .join(" ") + "...",
                        }}
                      />
                      <Link class="more" to={post.node.uri}>
                        read more
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            {blogpost.length > perPage && (
              <div class="load-more" onClick={loadMore}>
                <a
                  href="javascript: void(0);"
                  class="load-more-button"
                  id="load-blog"
                >
                  load more
                </a>
              </div>
            )}
          </div>
        </section>
      ) : (
        <p class="no-more-list">Currently blogs not available...</p>
      )}
    </Layout>
  );
};

export const Head = ({ data }) => (
  <Seo seoData={data?.wpPage?.seo || []}>
  </Seo>
)

export const query = graphql`
  query MyQuery {
    wpPage(databaseId: { eq: 79 }) {
      id
      title
      featuredImage {
        node {
          mediaItemUrl
          altText
          height
              width
              mediaType
          gatsbyImage(
            height: 733
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 1920
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
   allWpPost(sort: {date: DESC}) {
      edges {
        node {
          id
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
    }
  }
`;
export default Blog;
