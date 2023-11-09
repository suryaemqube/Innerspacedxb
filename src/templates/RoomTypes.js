import React, { useEffect, useState, useRef } from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import SwiperCore, {
  Pagination,
  Navigation,
  EffectFade,
  Autoplay,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import LightGallery from "lightgallery/react";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import { GatsbySeo } from "gatsby-plugin-next-seo";
// import { HelmetProvider } from "react-helmet-async";
import Layout from "../components/Layout";
// import Seo from "../components/SeoMeta";

import swiperNext from "../assets/img/swiper-next.png";
import arrowLeft from "../assets/img/arrow-left-solid.svg";
import arrowRight from "../assets/img/arrow-right-solid.svg";
import { Helmet, HelmetProvider } from "react-helmet-async";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;
const MEDIA_URL = process.env.GATSBY_MEDIA_URL;

const Roomtypes = ({ pageContext, data }) => {
  const { pageId, pageSlug, pageUrl } = pageContext;

  SwiperCore.use([Pagination, Autoplay, EffectFade]);
  const [swiper1, setSwiper1] = useState(null);
  const [swiper2, setSwiper2] = useState(null);
  const [swiper3, setSwiper3] = useState(null);
  const [swiper4, setSwiper4] = useState(null);
  const [selectedTab, setSelectedTab] = useState("tab-1");

  const tabNavigation = useRef();

  const room = data?.wpPage || [];
  const roomAcf = data?.wpPage?.roomsContent || [];
  const tabSection = data?.wpPage?.tabSection?.tabSection || [];
  const brand = data?.allWpBrand?.edges || [];
  const brandAcf = data?.brands || [];
  const portfolio = data?.allWpPortfolio?.edges || [];
  const portfolioAcf = data?.allWpPortfolio?.portfolioGalleryLayout || [];
  const seo = data?.wpPage?.seo || [];
  // const tabImgCount = data?.wpPage?.tabSection?.tabSection.elementImage.length || 0;

  const handleProductRange = (e) => {
    e.preventDefault();
    swiper1.slideNext();
    swiper2.slideNext();
  };

  const handlePortfolioSlide = (e) => {
    e.preventDefault();
    swiper3.slideNext();
    swiper4.slideNext();
  };
  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  const handleTabClick = (e) => {
    setSelectedTab(e.target.id);
    console.log(e);
  };

  var clickedIndex = 0;

  function goRight(e) {
    var content = tabNavigation.current;
    if (clickedIndex < 3) {
      clickedIndex = clickedIndex + 1;
      if (content) {
        content.style.marginLeft = -175 * clickedIndex + "px";
      }
    }
  }
  function goLeft(e) {
    var content = tabNavigation.current;
    if (clickedIndex > 0) {
      clickedIndex = clickedIndex - 1;
      if (content) {
        content.style.marginLeft = -175 * clickedIndex + "px";
      }
    } else {
    }
  }

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
        <Helmet bodyAttributes={{ class: `roomtypes ${pageSlug}` }}></Helmet>
      </HelmetProvider>
      <Layout>
        <section class="header-image room-header-slider">
          {roomAcf && roomAcf.roomSlider && (
            <div class="roomHeaderWrapper">
              <Swiper
                modules={[EffectFade, Pagination, Autoplay]}
                speed={2000}
                effect={"fade"}
                loop={true}
                autoplay={{
                  delay: 2000,
                }}
                slideToClickedSlide={true}
                pagination={{
                  el: ".swiper-pagination",
                  clickable: true,
                }}
                grabCursor={false}
                slidesPerView={1}
                spaceBetween={0}
                class="swiper-container room-header"
              >
                {roomAcf.roomSlider.map((slide, index) => (
                  <SwiperSlide class={`swiper-slide swiper-slide-${index + 1}`}>
                    <div class="wrapper">
                      <div class="holder">
                        {/* <img src={slide.mediaItemUrl} alt={slide.altText} width={1920} height={733} /> */}
                        <GatsbyImage
                          image={getImage(slide)}
                          alt={slide.altText}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div class="swiper-pagination"></div>
            </div>
          )}
          {/* {room && room.featuredImage ? (
                    <img src={room.featuredImage.node.mediaItemUrl} alt={room.featuredImage.node.altText} />) : (
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/img/room-type-header-img.jpg" alt="<?php echo $alt ; ?>" />
                )} */}
          {room && <h1 dangerouslySetInnerHTML={{ __html: room.title }} />}
        </section>

        <section class="main-content">
          <div class="container first-paragraph">
            {roomAcf && roomAcf.topContent ? (
              <span dangerouslySetInnerHTML={{ __html: roomAcf.topContent }} />
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

          <section class="room-image">
            {roomAcf && roomAcf.roomImage ? (
              // <img src={roomAcf.roomImage.mediaItemUrl} alt={roomAcf.roomImage.altText} />
              <GatsbyImage
                image={getImage(roomAcf.roomImage)}
                alt={roomAcf.roomImage.altText}
              />
            ) : (
              <img src={`${MEDIA_URL}/img/dummy-banner.jpg`} alt={room.title} />
            )}
          </section>

          {tabSection && tabSection.length > 0 && (
            <section className="tab-section">
              <div className="container">
                <h2>Elements of the Room</h2>
                <div className="tab-wrapper">
                  <ul
                    className="tabs"
                    id={`tabContent ${selectedTab}`}
                    ref={tabNavigation}
                  >
                    {tabSection.map((tabTitle, index) => (
                      <li
                        onClick={handleTabClick}
                        key={`tab-${index}`}
                        className={`tab-link ${selectedTab === `tab-${index + 1}` ? "active" : ""
                          }`}
                        id={`tab-${index + 1}`}
                        data-tab={index + 1}
                      >
                        {tabTitle.title}
                      </li>
                    ))}
                    <div className="indicator"></div>
                  </ul>
                </div>

                <a className="clickable" id="btnLeft" onClick={goLeft}>
                  <img src={arrowLeft} alt="arrow Left" />
                </a>
                <a className="clickable" id="btnRight" onClick={goRight}>
                  <img src={arrowRight} alt="Arrow Right" />
                </a>

                <div className="content-wrapper">
                  {tabSection.map(
                    (tabContent, index) =>
                      selectedTab === `tab-${index + 1}` && (
                        <div
                          key={`tab-content-${index}`}
                          id={`tab-${index + 1}`}
                          className={`tab-content ${selectedTab === `tab-${index + 1}` ? "active" : ""
                            }`}
                        >
                          <div className="content">
                            <div className="gallery-wrapper">
                              {tabContent.elementImage ? (
                                <Swiper
                                  modules={[Navigation, Autoplay]}
                                  loop={false}
                                  lazy={{
                                    loadPrevNext: true,
                                  }}
                                  direction={"horizontal"}
                                  autoplay={{
                                    delay: 1000,
                                    disableOnInteraction: false,
                                  }}
                                  pagination={false}
                                  navigation={{
                                    nextEl: ".gal-button-next",
                                    prevEl: ".gal-button-prev",
                                  }}
                                  className="swiper-container material-gal"
                                >
                                  {tabContent.elementImage.map(
                                    (tabImgCount, index) => (
                                      <SwiperSlide
                                        className="swiper-slide"
                                        key={`swiper-slide-${index}`}
                                      >
                                        {/* <img
                                        src={tabImgCount.mediaItemUrl}
                                        alt={tabImgCount.altText}
                                        className={`${
                                          tabContent.elementImage.length > 1
                                            ? "swiper-lazy"
                                            : ""
                                        }`}
                                      /> */}
                                        <GatsbyImage
                                          image={getImage(tabImgCount)}
                                          alt={tabImgCount.altText}
                                          className={`${tabContent.elementImage.length > 1
                                            ? "swiper-lazy"
                                            : ""
                                            }`}
                                        />
                                        {tabContent.elementImage.length > 1 && (
                                          <div className="swiper-lazy-preloader"></div>
                                        )}
                                      </SwiperSlide>
                                    )
                                  )}
                                  {tabContent.elementImage.length > 1 && (
                                    <div className="gal-button-next swiper-button-next">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="45.184"
                                        height="20.557"
                                        viewBox="0 0 45.184 20.557"
                                      >
                                        <g transform="translate(1 1.414)">
                                          <path
                                            d="M7.5,18H50.684"
                                            transform="translate(-7.5 -9.136)"
                                            fill="none"
                                            stroke="#fff"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                          />
                                          <path
                                            d="M18,7.5l8.864,8.864L18,25.228"
                                            transform="translate(16.32 -7.5)"
                                            fill="none"
                                            stroke="#fff"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                          />
                                        </g>
                                      </svg>
                                    </div>
                                  )}
                                  {tabContent.elementImage.length > 1 && (
                                    <div className="gal-button-prev swiper-button-prev">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="45.184"
                                        height="20.557"
                                        viewBox="0 0 45.184 20.557"
                                      >
                                        <g transform="translate(-170 -2801.586)">
                                          <path
                                            d="M50.684,18H7.5"
                                            transform="translate(163.5 2793.864)"
                                            fill="none"
                                            stroke="#fff"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            strokeWidth="2"
                                          />
                                          <path
                                            d="M26.864,7.5,18,16.364l8.864,8.864"
                                            transform="translate(153 2795.5)"
                                            fill="none"
                                            stroke="#fff"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            strokeWidth="2"
                                          />
                                        </g>
                                      </svg>
                                    </div>
                                  )}
                                </Swiper>
                              ) : (
                                <img
                                  src={`get_stylesheet_directory_uri()/img/gal-img.jpg`}
                                  alt={`{current_pagetitle}`}
                                />
                              )}
                            </div>
                            <div className="tabcontent">
                              <h3>{tabContent.title}</h3>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: tabContent.description,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </section>
          )}

          <section class="room-brands roomtypebrands">
            <div class="room-brands-content">
              <div class="container">
                {roomAcf && roomAcf.brandsContent ? (
                  <p
                    dangerouslySetInnerHTML={{ __html: roomAcf.brandsContent }}
                  />
                ) : (
                  <p>
                    Lorem ipsum dolor sit amet, consectetur <br />
                    adipiscing elit, sed do eiusmod
                  </p>
                )}
              </div>
            </div>
            {console.log("len: ", brand.length)}
            <div class={`room-brands-wrapper ${brand && brand.length <= 1 ? "hide-other-slider justify-center" : ""}`}>
              <div class="container slider-activated">
                {brand && brandAcf && (
                  <>
                    <Swiper
                      onSwiper={(s) => {
                        setSwiper1(s);
                      }}
                      speed={1200}
                      pagination={false}
                      nextButton={".swiper-button-nxt-brand"}
                      slidesPerView={1}
                      navigation={false}
                      allowTouchMove={false}
                      loop={true}
                      spaceBetween={0}
                      initialSlide={0}
                      className="swiper-container productBrandType swiper-container-initialized"
                    >
                      {brand.map((brandslide, index) => (
                        <SwiperSlide class="swiper-slide" key={`fjdlsjf` + index}>
                          <div class="img-wrapper">
                            <Link
                              to={
                                brandslide.node.brands.brandRelationshipField.uri
                              }
                            >
                              {brandslide.node.brands.brandLogo ? (
                                <img
                                  class={`brand-logo ${brandslide.node.title}`}
                                  src={
                                    brandslide.node.brands.brandLogo.mediaItemUrl
                                  }
                                  alt={brandslide.node.title}
                                />
                              ) : (
                                <img
                                  class={`brand-logo ${brandslide.node.title}`}
                                  src={`${MEDIA_URL}/img/brand-logo.jpg`}
                                  alt={brandslide.node.title}
                                />
                              )}
                              {brandslide.node.featuredImage ? (
                                //   <img
                                //     src={
                                //       brandslide.node.featuredImage.node
                                //         .mediaItemUrl
                                //     }
                                //     alt={brandslide.node.title}
                                //   />
                                <GatsbyImage
                                  image={getImage(
                                    brandslide.node.featuredImage.node
                                  )}
                                  alt={brandslide.node.title}
                                />
                              ) : (
                                <img
                                  src={`${MEDIA_URL}/img/single-product.jpg`}
                                  alt={brandslide.node.title}
                                />
                              )}
                            </Link>
                          </div>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: removeTags(brandslide.node.content),
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {brand && brand.length > 1 &&
                      <Swiper
                        onSwiper={(s) => {
                          setSwiper2(s);
                        }}
                        speed={1200}
                        pagination={false}
                        nextButton={".swiper-button-nxt-brand"}
                        slidesPerView={1}
                        navigation={false}
                        allowTouchMove={false}
                        loop={true}
                        spaceBetween={0}
                        initialSlide={1}
                        className="swiper-container productBrandTypeOne "
                      >
                        {brand.map((brandslide, index) => (
                          <SwiperSlide class="swiper-slide" key={`sdfds` + index}>
                            <div class="img-wrapper">
                              <Link
                                to={
                                  brandslide.node.brands.brandRelationshipField.uri
                                }
                              >
                                {brandslide.node.brands.brandLogo ? (
                                  <img
                                    class={`brand-logo ${brandslide.node.title}`}
                                    src={
                                      brandslide.node.brands.brandLogo.mediaItemUrl
                                    }
                                    alt={brandslide.node.title}
                                  />
                                ) : (
                                  <img
                                    class={`brand-logo ${brandslide.node.title}`}
                                    src={`${MEDIA_URL}/img/brand-logo.jpg`}
                                    alt={brandslide.node.title}
                                  />
                                )}
                                {brandslide.node.featuredImage ? (
                                  //   <img
                                  //     src={
                                  //       brandslide.node.featuredImage.node
                                  //         .mediaItemUrl
                                  //     }
                                  //     alt={brandslide.node.title}
                                  //   />

                                  <GatsbyImage
                                    image={getImage(
                                      brandslide.node.featuredImage.node
                                    )}
                                    alt={brandslide.node.title}
                                  />
                                ) : (
                                  <img
                                    src={`${MEDIA_URL}/img/single-product.jpg`}
                                    alt={brandslide.node.title}
                                  />
                                )}
                              </Link>
                            </div>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: removeTags(brandslide.node.content),
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    }

                    <div
                      class="swiper-button-nxt-brand"
                      id="brandRangeSwiperNext"
                    >
                      <a href="#" onClick={handleProductRange}>
                        <img src={swiperNext} alt="" />
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {portfolio && portfolioAcf && (
            <section class="product-range col2">
              <div class="productRangeWrapper">
                <Swiper
                  onSwiper={(s) => {
                    setSwiper3(s);
                  }}
                  speed={1200}
                  pagination={false}
                  nextButton={".swiper-button-nxt-brand"}
                  slidesPerView={1}
                  navigation={false}
                  allowTouchMove={false}
                  loop={true}
                  spaceBetween={0}
                  initialSlide={0}
                  className="swiper-container productRange"
                >
                  {portfolio.map((portfolioSlide, index) => (
                    <SwiperSlide class="swiper-slide" key={`dfggdvdf` + index}>
                      <div class="wrapper">
                        <div class="holder">
                          <LightGallery
                            plugins={[lgThumbnail, lgZoom]}
                            loop={true}
                            thumbnail={true}
                            exThumbImage={"data-exthumbimage"}
                            download={false}
                            counter={false}
                            selector={"li"}
                          >
                            <ul class="design-gallery" id="Gal">
                              {portfolioSlide.node.portfolioGalleryLayout.portfolioGallery.map(
                                (gallerySlide, index) => (
                                  <li
                                    data-exthumbimage={gallerySlide.mediaItemUrl}
                                    data-src={gallerySlide.mediaItemUrl}
                                    data-sub-html={`<div class="lightGallery-captions"><h5>${portfolioSlide.node.title}</h5></div>`}
                                    key={`fjljd` + index}
                                  >
                                    {index === 0 && (
                                      <a href="" class="view-more">
                                        view more
                                      </a>
                                    )}
                                  </li>
                                )
                              )}
                            </ul>
                          </LightGallery>

                          {portfolioSlide.node.featuredImage ? (
                            //   <img
                            //     src={
                            //       portfolioSlide.node.featuredImage.node
                            //         .mediaItemUrl
                            //     }
                            //     alt="portfolio"
                            //   />
                            <GatsbyImage
                              image={getImage(
                                portfolioSlide.node.featuredImage.node
                              )}
                              alt="portfolio"
                            />
                          ) : (
                            <img
                              src={`${MEDIA_URL}/img/portfolio-banner.jpg`}
                              alt="portfolio"
                            />
                          )}
                        </div>
                      </div>
                      <h3>{portfolioSlide.node.title}</h3>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                  onSwiper={(s) => {
                    setSwiper4(s);
                  }}
                  speed={1200}
                  pagination={false}
                  nextButton={".swiper-button-nxt-brand"}
                  slidesPerView={1}
                  navigation={false}
                  allowTouchMove={false}
                  loop={true}
                  spaceBetween={0}
                  initialSlide={1}
                  className="swiper-container productRangeOne"
                >
                  {portfolio.map((portfolioSlide, index) => (
                    <SwiperSlide class="swiper-slide">
                      <div class="wrapper">
                        <div class="holder">
                          <LightGallery
                            plugins={[lgThumbnail, lgZoom]}
                            loop={true}
                            thumbnail={true}
                            exThumbImage={"data-exthumbimage"}
                            download={false}
                            counter={false}
                            selector={"li"}
                          >
                            <ul class="design-gallery" id="Gal">
                              {portfolioSlide.node.portfolioGalleryLayout.portfolioGallery.map(
                                (gallerySlide, index) => (
                                  <li
                                    data-exthumbimage={gallerySlide.mediaItemUrl}
                                    data-src={gallerySlide.mediaItemUrl}
                                    data-sub-html={`<div class="lightGallery-captions"><h5>${portfolioSlide.node.title}</h5></div>`}
                                    key={`fjljd` + index}
                                  >
                                    {index === 0 && (
                                      <a href="" class="view-more">
                                        view more
                                      </a>
                                    )}
                                  </li>
                                )
                              )}
                            </ul>
                          </LightGallery>
                          {portfolioSlide.node.featuredImage ? (
                            //   <img
                            //     src={
                            //       portfolioSlide.node.featuredImage.node
                            //         .mediaItemUrl
                            //     }
                            //     alt="portfolio"
                            //   />
                            <GatsbyImage
                              image={getImage(
                                portfolioSlide.node.featuredImage.node
                              )}
                              alt="portfolio"
                            />
                          ) : (
                            <img
                              src={`${MEDIA_URL}/img/portfolio-banner.jpg`}
                              alt="portfolio"
                            />
                          )}
                        </div>
                      </div>
                      <h3>{portfolioSlide.node.title}</h3>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div class="portfolio-view-all">
                  <Link to="/portfolio/" class="view-all portfolio-view-all">
                    View All
                  </Link>
                </div>
              </div>
              <div class="swiper-button-nxt" id="productRangeSwiperNext">
                <a href="#" onClick={handlePortfolioSlide}>
                  <img src={swiperNext} alt="" />
                </a>
              </div>
            </section>
          )}

          {/* main-content */}
        </section>
      </Layout>
    </>
  );
};
export default Roomtypes;
export const data = graphql`
  query MyQuery($pageId: Int!, $pageSlug: String!) {
    wpPage(databaseId: { eq: $pageId }) {
      id
      title
      featuredImage {
        node {
          altText
          mediaItemUrl
          gatsbyImage(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 550
            height: 549
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
      roomsContent {
        topContent
        roomSlider {
          altText
          gatsbyImage(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 1920
            height: 733
          )
          mediaItemUrl
        }
        roomImage {
          altText
          mediaItemUrl
          gatsbyImage(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 1920
            height: 429
          )
        }
        brandsContent
      }
      tabSection {
        tabSection {
          description
          title
          elementImage {
            altText
            mediaItemUrl
            gatsbyImage(
              layout: CONSTRAINED
              placeholder: BLURRED
              width: 702
              height: 513
            )
          }
        }
      }
    }
    allWpBrand(
      filter: {
        typeOfRoomCategory: {
          nodes: { elemMatch: { slug: { eq: $pageSlug } } }
        }
      }
      sort: { databaseId: ASC }
    ) {
      edges {
        node {
          id
          title
          content
          featuredImage {
            node {
              altText
              mediaItemUrl
              gatsbyImage(
                layout: CONSTRAINED
                placeholder: BLURRED
                width: 550
                height: 549
              )
            }
          }
          brands {
            brandLogo {
              altText
              mediaItemUrl
            }
            brandRelationshipField {
              ... on WpPage {
                id
                uri
              }
            }
          }
        }
      }
    }
    allWpPortfolio(
      filter: {
        roomtypeCategory: { nodes: { elemMatch: { slug: { eq: $pageSlug } } } }
      }
    ) {
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
          portfolioGalleryLayout {
            portfolioGallery {
              altText
              mediaItemUrl
            }
          }
        }
      }
    }
  }
`;
