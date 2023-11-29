import React, { useEffect, useState } from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Seo from "../components/SeoMeta";
import Layout from "../components/Layout";

import Breadcrumb from "../components/Breadcrumbs";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

const Portfolio = ({ data }) => {

  SwiperCore.use([Pagination, Autoplay]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const [conditionInput, setCondtion] = useState("");
  const [categoryInput, setCategory] = useState("");

  const NOOFPOST = 16;

  const header = data?.wpPage?.lastChanceMainPageLayout || [];
  const lastChance = data?.allWpLastChance?.edges || [];
  const lastCat = data?.allWpLastChanceCategory?.edges || [];
  const allCondtionObject = data?.wp?.allCondtionObject || [];
  const totalCount = data?.allWpLastChance?.totalCount || [];
  const seo = data?.wpPage.seo || [];

  const pageCount = Math.ceil(totalCount / NOOFPOST);

  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;

  let nf = new Intl.NumberFormat("en-US");

  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }
  const handlePage = (e) => {
    e.preventDefault();
    setCurrentPage(e.target.getAttribute("data-page"));
  };
  const handleNextPage = (e) => {
    e.preventDefault();
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = (e) => {
    e.preventDefault();
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 5;

    const halfRange = Math.floor(totalPagesToShow / 2);

    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(startPage + totalPagesToShow - 1, pageCount);

    // let endPage = Math.min(
    //   startPage + pageCount > 4 ? totalPagesToShow - 1 : pageCount,
    //   totalCount
    // );
    // console.log(
    //   "PageInfo: ",
    //   startPage,
    //   endPage,
    //   halfRange,
    //   pageCount,
    //   currentPage
    // );
    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(endPage - totalPagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        currentPage === i ? (
          <span class="current">{currentPage}</span>
        ) : (
          <Link
            to={`${i === 1 ? "/last/" : `/last/page/${i}/`}`}
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

  const percentOff = (price, salePrice) => {
    return Math.ceil(((price - salePrice) / price) * 100);
  };
  useEffect(() => {
    setFilteredData(lastChance);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);

    const filterData = lastChance.filter((edge) => {
      const conditionMatch =
        !conditionInput ||
        (allCondtionObject &&
          allCondtionObject.some((category) => category === conditionInput));
      const categoryMatch =
        !categoryInput ||
        (edge.node.lastChanceCategories &&
          edge.node.lastChanceCategories.nodes.some(
            (category) => category.slug === categoryInput
          ));
      // console.log("ok: ", conditionMatch, categoryMatch);
      return conditionMatch && categoryMatch;
    });

    setFilteredData(filterData);
  };

  const startIndex = (currentPage - 1) * NOOFPOST;
  const endIndex = startIndex + NOOFPOST;
  const displayedData = filteredData.slice(startIndex, endIndex);

  return (

    <Layout>

      <section class="header-image last-chance ">
        {header ? (
          <>
            <div class="wrapper last-chance-wrapper">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: ".swiper-pagination",
                  clickable: true,
                }}
                className="holder swiper-container"
                id="luxury-slider"
              >
                {header.lastChanceImageGallery.map((slide, index) => (
                  <SwiperSlide class="swiper-slide" key={`kgiodds` + index}>
                    {/* <img src={slide.mediaItemUrl} alt={slide.altText} /> */}
                    <GatsbyImage image={getImage(slide)} altText={slide.altText} />
                  </SwiperSlide>
                ))}
                <div class="swiper-pagination"></div>
              </Swiper>
            </div>
            <div class="header-title">
              <div class="text-wrap">
                <h2>Last Chance Luxury</h2>
                <p>Gorgeous pieces priced at a steal</p>
                {data && data.wpPage.databaseId && (
                  <div
                    className="breadcrumbs"
                    vocab="http://schema.org/"
                    typeof="BreadcrumbList"
                  >
                    <Breadcrumb postId={data.wpPage.databaseId} />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <img src={`${MEDIA_URL}/images/featureimage2.jpg`} />
        )}
      </section>

      <section class="main-content">
        <div class="container first-paragraph">
          <div class="top-para-room">
            <p
              dangerouslySetInnerHTML={{
                __html: removeTags(header.lastChanceContent),
              }}
            />
          </div>
        </div>
        <div class="container">
          <div class="filter-wrapper">
            <div class="filter-title">Filter by:</div>

            <div class="filters">
              <div class="select">
                <select
                  name="filter-post"
                  id="last-chance-filter-category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">by Category</option>
                  {lastCat &&
                    lastCat.map((cat, index) => (
                      <option value={cat.node.slug} key={`fjds;j` + index}>
                        {cat.node.name}
                      </option>
                    ))}
                </select>
              </div>
              <div class="select">
                <select
                  name="filter-condition"
                  id="last-chance-filter-condition"
                  onChange={(e) => setCondtion(e.target.value)}
                >
                  <option value="">by Condition</option>
                  {allCondtionObject &&
                    allCondtionObject.map((item, index) => (
                      <option value={item} key={`gsfdg;j` + index}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div class="portfolio-filter-wrapper" onClick={handleFilter}>
                <input
                  type="submit"
                  value="filter"
                  id="last-chance-filter-button"
                />
              </div>
            </div>
          </div>

          <div class="portfolio-wrapper">
            {displayedData &&
              displayedData.length > 0 ? (
              <ul id="last-chance-post">
                {displayedData.map((last) => (
                  <li>
                    <a href={last.node.uri}>
                      <div class="prod-media">
                        <div class="wrapper">
                          <div class="holder">
                            <img
                              src={
                                last.node.lastChanceSingularPage
                                  .lastChancePostGallery[0].mediaItemUrl
                              }
                              alt={
                                last.node.lastChanceSingularPage
                                  .lastChancePostGallery[0].altText
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </a>
                    <div class="prod-price">
                      <h3>{last.node.title}</h3>
                      <span class="disc-price">
                        AED{" "}
                        {nf.format(
                          last.node.lastChanceSingularPage
                            .lastChanceDiscountPrice
                        )}
                      </span>
                      <span class="og-price">
                        AED{" "}
                        {nf.format(
                          last.node.lastChanceSingularPage
                            .lastChanceOriginalPrice
                        )}
                      </span>
                      <span class="pct-disc">
                        {percentOff(
                          last.node.lastChanceSingularPage
                            .lastChanceOriginalPrice,
                          last.node.lastChanceSingularPage
                            .lastChanceDiscountPrice
                        )}
                        % OFF
                      </span>
                    </div>
                    <a class="enquire" href={last.node.uri}>
                      INQUIRE
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p class="no-data-found">No data found</p>
            )}
          </div>
          {displayedData.length >= NOOFPOST && (
            <div id="pagination">
              {totalCount > 1 && (
                <div class="pagination">
                  <span>
                    Page {currentPage} of {pageCount} &nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  {currentPage > 1 && (
                    <a href="#" onClick={handlePrevPage}>
                      « Previous
                    </a>
                  )}
                  {renderPageNumbers()}
                  {currentPage !== pageCount && (
                    <a href="#" onClick={handleNextPage}>
                      Next ›
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>

  );
};
export const Head = ({ data }) => (
  <Seo seoData={data?.wpPage?.seo || []} bodyClass={"last-chance page-id-1507"}>
  </Seo>
)
export const data = graphql`
    query MyQuery {
      allWpLastChanceCategory {
      edges {
      node {
      id
      slug
      name
        }
      }
    }
    wp {
      allCondtionObject
    }
    wpPage(databaseId: {eq: 1507 }) {
      id
      title
      databaseId
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
      lastChanceMainPageLayout {
        lastChanceContent
        lastChanceImageGallery {
          id
          mediaItemUrl
          altText
          gatsbyImage(
            height: 733
            placeholder: BLURRED
            layout: CONSTRAINED
            width: 1920
          )
        }
      }
        }
        allWpLastChance(
        filter: {
          lastChanceSingularPage: {lastChanceSoldOutSelect: {ne: "sold" } }
      }
        ) {
          edges {
          node {
          id
          title
        uri
        lastChanceSingularPage {
          lastChanceCondition
            lastChanceDiscountPrice
        lastChanceOriginalPrice
        lastChanceSoldOutSelect
        lastChancePostGallery {
          altText
              mediaItemUrl
            }
          }
        lastChanceCategories {
          nodes {
          slug
              name
            }
          }
        }
      }
        totalCount
    }
  }
        `;
export default Portfolio;
