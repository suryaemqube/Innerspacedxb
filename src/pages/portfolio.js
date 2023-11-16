import React, { useEffect, useState, useRef } from "react";
import { Link, graphql, navigate } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import LightGallery from "lightgallery/react";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Layout from "../components/Layout";
// import Seo from "../components/SeoMeta";

const Portfolio = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const [roomtypeInput, setRoomtypeInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const formSelector = useRef();

  const NOOFPOST = 9;

  const page = data?.wpPage || [];
  const portfolio = data?.allWpPortfolio?.edges || [];
  const brandCat = data.allWpBrandCategory.edges || [];
  const roomCat = data.allWpRoomtypeCategory.edges || [];
  const seo = data?.wpPage?.seo || [];

  const totalCount = data?.allWpPortfolio?.totalCount || [];
  const pageCount = Math.ceil(totalCount / NOOFPOST);
  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;

  const handlePage = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    queryParams.set("page", e.target.getAttribute("data-page"));
    console.log('queryParams: ', queryParams)
    navigate(`?${queryParams}`);
    setCurrentPage(e.target.getAttribute("data-page"));
  };


  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 5;

    const halfRange = Math.floor(totalPagesToShow / 2);

    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(startPage + totalPagesToShow - 1, pageCount);
    //  let endPage = Math.min(
    //   startPage + pageCount > 4 ? totalPagesToShow - 1 : pageCount,
    //   totalCount
    // );
    console.log("PageInfo: ", startPage, endPage, halfRange, pageCount);
    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(endPage - totalPagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        currentPage === i ? (
          <span class="current">{currentPage}</span>
        ) : (
          <Link
            to={`${i === 1 ? "/portfolio/" : `/portfolio/page/${i}/`}`}
            class="inactive"
            data-page={i}
            onClick={handlePage}
          >
            {i}
          </Link>
        )
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    setFilteredData(portfolio);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("filter-room") || "";
    const brandParam = params.get("filter-brand") || "";

    setRoomtypeInput(roomParam);
    setBrandInput(brandParam);

    if (roomParam || brandParam) {
      handleFilter();
    }
  }, []);

  const handleFilter = () => {
    setCurrentPage(1);
    // e.preventDefault();
    const filteredData = data.allWpPortfolio.edges.filter((edge) => {
      console.log("inputdata:", roomtypeInput, brandInput);
      // console.log("brandInput:", brandInput, edge.node.brandCategory.nodes);
      const roomtypeMatch =
        !roomtypeInput ||
        (edge.node.roomtypeCategory &&
          edge.node.roomtypeCategory.nodes.some(
            (category) => category.slug === roomtypeInput
          ));
      const brandMatch =
        !brandInput ||
        (edge.node.brandCategory &&
          edge.node.brandCategory.nodes.some(
            (category) => category.slug === brandInput
          ));
      // console.log("ok: ", roomtypeMatch, brandMatch);
      return roomtypeMatch && brandMatch;
    });

    const queryParams = new URLSearchParams();
    if (roomtypeInput) {
      queryParams.set("filter-room", roomtypeInput);
    }
    if (brandInput) {
      queryParams.set("filter-brand", brandInput);
    }

    navigate(`/portfolio/?${queryParams.toString()}`);

    setFilteredData(filteredData);
    // console.log("ok: ", filteredData);
  };

  const startIndex = (currentPage - 1) * NOOFPOST;
  const endIndex = startIndex + NOOFPOST;
  const displayedData = filteredData.slice(startIndex, endIndex);
  // console.log("TestData:", startIndex, endIndex)
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
        <Helmet bodyAttributes={{ class: "portfolio" }}></Helmet>
      </HelmetProvider>
      <Layout>

        {/* <Seo pageUrl={`${WEBSITE_URL}/portfolio/`} bodyClass={"portfolio"}></Seo> */}
        <section class="header-image">
          {page && page.featuredImage ? (
            <div class="wrapper">
              <div class="holder">
                {/* <img
                src={page.featuredImage.node.mediaItemUrl}
                alt={page.title}
              /> */}
                <GatsbyImage
                  image={getImage(page.featuredImage.node)}
                  alt={page.title}
                />
              </div>
            </div>
          ) : (
            <img
              src={`${MEDIA_URL}/img/room-type-header-img.jpg`}
              alt="header image"
            />
          )}
          <h1>{page.title}</h1>
        </section>

        <section class="main-content">
          <div class="container">
            <div class="filter-wrapper">
              <div class="filter-title">filter by:</div>
              <div
                name="filter-portfolio"
                className="filter-portfolio"

                ref={formSelector}
              >
                <div class="filters">
                  <div class="select">
                    <select
                      name="filter-room"
                      id="filter-portfolio-room"
                      value={roomtypeInput}
                      onChange={(e) => setRoomtypeInput(e.target.value)}
                    >
                      <option value="">by room</option>
                      {roomCat &&
                        roomCat.map((brand, index) => (
                          <option
                            key={`kf;skfhf` + index}
                            value={brand.node.slug}
                          >
                            {brand.node.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div class="select">
                    <select
                      name="filter-brand"
                      id="filter-portfolio-brands"
                      value={brandInput}
                      onChange={(e) => setBrandInput(e.target.value)}
                    >
                      <option value="">by brand</option>
                      {brandCat &&
                        brandCat.map((brand, index) => (
                          <option key={`kf;skf` + index} value={brand.node.slug}>
                            {brand.node.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div class="portfolio-filter-wrapper">
                    <input type="submit" value="filter" id="portfolio-filter" onClick={handleFilter} />
                  </div>
                </div>
              </div>
            </div>
            {displayedData ? (
              <>
                {displayedData.length > 0 ? (
                  <>
                    <div class="portfolio-wrapper">
                      <ul>
                        {displayedData.map((portfolioSlide, index) => (
                          <li key={`ighfdoivh` + index}>
                            {portfolioSlide.node.portfolioGalleryLayout
                              .portfolioGallery ? (
                              <LightGallery
                                plugins={[lgThumbnail, lgZoom]}
                                loop={true}
                                thumbnail={true}
                                exThumbImage={"data-exthumbimage"}
                                download={false}
                                counter={false}
                                selector={".item"}
                              >
                                <div class="design-gallery" id="Gal">
                                  {portfolioSlide.node.portfolioGalleryLayout.portfolioGallery.map(
                                    (gallerySlide, index) => (
                                      <div
                                        className="item"
                                        data-exthumbimage={
                                          gallerySlide.mediaItemUrl
                                        }
                                        data-src={gallerySlide.mediaItemUrl}
                                        data-sub-html={`<div class="lightGallery-captions"><h5>${portfolioSlide.node.title}</h5></div>`}
                                      >
                                        {index + 1 === 1 && (
                                          <a href="#">
                                            <div class="img-wrap">
                                              {portfolioSlide.node
                                                .featuredImage ? (
                                                <GatsbyImage
                                                  image={getImage(
                                                    portfolioSlide.node
                                                      .featuredImage.node
                                                  )}
                                                  alt={portfolioSlide.node.title}
                                                />
                                              ) : (
                                                <img
                                                  class="ok"
                                                  src={`${MEDIA_URL}/img/portfolio-placeholder.jpg`}
                                                  alt={portfolioSlide.node.title}
                                                />
                                              )}
                                            </div>
                                            <h3>{portfolioSlide.node.title}</h3>
                                          </a>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </LightGallery>
                            ) : (
                              <a href="#">
                                <div class="img-wrap">
                                  {portfolioSlide.node.featuredImage ? (
                                    <img
                                      class="<?php echo $portfolio_images['url'][0]; ?>"
                                      src="<?php echo $main_img; ?>"
                                      alt={portfolioSlide.node.title}
                                    />
                                  ) : (
                                    <img
                                      class=""
                                      src={`${MEDIA_URL}/img/portfolio-placeholder.jpg`}
                                      alt={portfolioSlide.node.title}
                                    />
                                  )}
                                </div>
                                <h3>{portfolioSlide.node.title}</h3>
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* {console.log("Page: ", displayedData.length >= NOOFPOST, currentPage >= 3, currentPage)} */}
                    {(pageCount > 1) &&
                      displayedData.length >= NOOFPOST && (
                        <div class="pagination">
                          <span>
                            Page {currentPage} of {pageCount}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                          {renderPageNumbers()}
                        </div>
                      )}
                  </>
                ) : (
                  <p class="no-data-found">No data found</p>
                )}
              </>
            ) : (
              <p class="no-data-found">No data found</p>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};
export const data = graphql`
  query MyQuery {
    allWpBrandCategory(filter: { databaseId: { ne: 34 } }) {
      edges {
        node {
          slug
          id
          name
        }
      }
    }
    allWpRoomtypeCategory {
      edges {
        node {
          id
          slug
          name
        }
      }
    }

    wpPage(databaseId: { eq: 77 }) {
      id
      title
      featuredImage {
        node {
          mediaItemUrl
          altText
          gatsbyImage(
            height: 733
            layout: FIXED
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
      }
    }
    allWpPortfolio {
      edges {
        node {
          id
          title
          featuredImage {
            node {
              mediaItemUrl
              altText
              gatsbyImage(
                layout: CONSTRAINED
                placeholder: BLURRED
                width: 910
                height: 832
              )
            }
          }
          roomtypeCategory {
            nodes {
              slug
            }
          }
          brandCategory {
            nodes {
              slug
            }
          }
          portfolioGalleryLayout {
            portfolioGallery {
              altText
              mediaItemUrl
            }
          }
        }
      }
      totalCount
    }
  }
`;
export default Portfolio;
