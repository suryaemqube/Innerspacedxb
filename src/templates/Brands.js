import React, { useEffect, useState } from "react";
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
// import "lightgallery/css/lightgallery-bundle.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import Seo from "../components/SeoMeta";

import Layout from "../components/Layout";
import swiperNext from "../assets/img/swiper-next.png";
const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const Brands = ({ pageContext, data }) => {
  console.log("pageContext: ", pageContext);
  const { pageId, pageUri, pageSlug } = pageContext;
  SwiperCore.use([Pagination, Autoplay, EffectFade]);
  const [swiper1, setSwiper1] = useState(null);
  const [swiper2, setSwiper2] = useState(null);
  const [swiper3, setSwiper3] = useState(null);

  const brands = data?.wpPage || [];
  const brandsAcf = data?.wpPage?.brandsMainPageLayout || [];
  const portfolio = data?.allWpPortfolio?.edges || [];
  const testCount = brandsAcf.testimonialThought?.length || 0;
  const seo = data?.wpPage?.seo || [];

  var testimonialOption = {};

  if (testCount > 1) {
    testimonialOption = {
      loop: true,
      pagination: true,
      grabCursor: false,
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 0,
    };
  } else {
    testimonialOption = {
      navigation: false,
    };
  }

  const brandHeader = {
    spaceBetween: 30,
    effect: "fade",
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    grabCursor: false,
    slidesPerView: 1,
    spaceBetween: 0,
  };

  const handleSwiperNext = (e) => {
    e.preventDefault();
    swiper1.slideNext();
  };

  const handleProductRange = (e) => {
    e.preventDefault();
    swiper2.slideNext();
    swiper3.slideNext();
  };
  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }
  return (
    <>
      <Layout>
        <section className="header-image brand-header-slider">
          {brandsAcf && brandsAcf.brandLogo && (
            <div className="brand-logo">
              <img
                src={brandsAcf.brandLogo.mediaItemUrl}
                className="slide-brand-logo"
                alt={brands.title}
              />
            </div>
          )}
          <div className="brandHeaderWrapper">
            <Swiper
              {...brandHeader}
              modules={[EffectFade]}
              className="swiper-container brand-header"
            >
              {brandsAcf &&
                brandsAcf.brandSliderImages &&
                brandsAcf.brandSliderImages.length > 1 ? (
                brandsAcf.brandSliderImages.map((slide, index) => (
                  <SwiperSlide
                    className={`swiper-slide swiper-slide-${index + 1}`}
                    key={`ljgdf` + index}
                  >
                    <div className="wrapper">
                      <div className="holder">
                        {/* <img src={slide.mediaItemUrl} alt={brands.title} /> */}
                        <GatsbyImage image={getImage(slide)} loading="lazy" />
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="swiper-slide">
                  <div className="wrapper">
                    <div className="holder">
                      <img
                        src={`${WEBSITE_URL}/img/brand-header-slider-img.jpg`}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="swiper-pagination"></div>
            </Swiper>
          </div>
        </section>

        <section className="main-content">
          <div className="container first-paragraph">
            {brandsAcf && brandsAcf.topText ? (
              <span dangerouslySetInnerHTML={{ __html: brandsAcf.topText }} />
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

          <section className="feature-wrapper">
            <div className="container">
              <span className="sec-title">features</span>
              {brandsAcf && brandsAcf.featureBlockTitle ? (
                <h2>{brandsAcf.featureBlockTitle}</h2>
              ) : (
                <h2>what makes us different</h2>
              )}

              {brandsAcf && brandsAcf.featureContent ? (
                <p className="main-txt">{brandsAcf.featureContent}</p>
              ) : (
                <p>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                  takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                  dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et.
                </p>
              )}
              {brandsAcf &&
                brandsAcf.featureList &&
                brandsAcf.featureList.length > 0 ? (
                <ul className="feature-list">
                  {brandsAcf.featureList.map((feature, index) => (
                    <li key={`jfjd` + index}>
                      <div className="img-box">
                        {/* <img src={feature.featureImage.mediaItemUrl} alt={feature.featureImage.altText} /> */}
                        <GatsbyImage
                          image={getImage(feature.featureImage)}
                          alt={feature.featureImage.altText}
                        />
                      </div>
                      <h3>{feature.featureTitle}</h3>
                      <p>{feature.featureShortDescription}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="feature-list">
                  <li>
                    <div className="img-box">
                      <img src={`${WEBSITE_URL}/img/single-product.jpg`} alt="" />
                    </div>
                    <h3>functionality</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consetetur elitr, sed diam
                      nonumy eirmod tempor invidunt ut labore et dolore magna
                      aliquyam erat, sed diam.{" "}
                    </p>
                  </li>
                  <li>
                    <div className="img-box">
                      <img src={`${WEBSITE_URL}/img/single-product.jpg`} alt="" />
                    </div>
                    <h3>functionality</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consetetur elitr, sed diam
                      nonumy eirmod tempor invidunt ut labore et dolore magna
                      aliquyam erat, sed diam.{" "}
                    </p>
                  </li>
                  <li>
                    <div className="img-box">
                      <img src={`${WEBSITE_URL}/img/single-product.jpg`} alt="" />
                    </div>
                    <h3>functionality</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consetetur elitr, sed diam
                      nonumy eirmod tempor invidunt ut labore et dolore magna
                      aliquyam erat, sed diam.{" "}
                    </p>
                  </li>
                </ul>
              )}
            </div>
          </section>

          <section className="testimonial-wrapp">
            <div className="container">
              <div className="testiWrapper">
                <Swiper
                  onSwiper={(s) => {
                    setSwiper1(s);
                  }}
                  {...testimonialOption}
                  className="swiper-container testiSlider"
                >
                  {brandsAcf &&
                    brandsAcf.testimonialThought &&
                    brandsAcf.testimonialThought.length > 0 ? (
                    brandsAcf.testimonialThought.map((testimonial, index) => (
                      <SwiperSlide
                        className="swiper-slide"
                        key={`safsdg` + index}
                      >
                        <div className="wrapper-">
                          <div className="holder-">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: removeTags(testimonial.thought),
                              }}
                            />
                            <div className="author">
                              <p className="name">{testimonial.author}</p>
                              <div className="location">
                                {testimonial.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide className="swiper-slide">
                      <div className="wrapper">
                        <div className="holder">
                          <p>
                            "Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo dolores
                            et ea rebum. Stet clita kasd gubergren, no sea
                            takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                            ipsum dolor sit amet, consetetur sadipscing elitr."
                          </p>
                          <div className="author">
                            <p className="name">John Doe</p>
                            <div className="location">Villa in Jumeriah</div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  )}
                  {testCount > 1 && (
                    <div className="swiper-button-nxt" id="testiSliderSwiperNext">
                      <a href="#" onClick={handleSwiperNext}>
                        <img src={swiperNext} alt="next Button" />
                      </a>
                    </div>
                  )}
                </Swiper>
              </div>
            </div>
          </section>

          <section class="product-range col2">
            <div class="productRangeWrapper">
              {portfolio && (
                <Swiper
                  onSwiper={(s) => {
                    setSwiper2(s);
                  }}
                  speed={1200}
                  pagination={false}
                  slidesPerView={1}
                  navigation={false}
                  allowTouchMove={false}
                  loop={true}
                  spaceBetween={0}
                  initialSlide={0}
                  className="swiper-container productRange"
                >
                  {portfolio.map((slide, index) => (
                    <SwiperSlide class="swiper-slide" key={`dfsfe` + index}>
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
                              {slide.node.portfolioGalleryLayout.portfolioGallery.map(
                                (gallerySlide, index) => (
                                  <li
                                    data-src={gallerySlide.mediaItemUrl}
                                    data-exthumbimage={gallerySlide.mediaItemUrl}
                                    data-sub-html={`<div class="lightGallery-captions"><h5>${slide.node.title}</h5></div>`}
                                    key={`garega` + index}
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

                          {slide.node.featuredImage.node.mediaItemUrl ? (
                            <img
                              src={slide.node.featuredImage.node.mediaItemUrl}
                              alt="portfolio"
                            />
                          ) : (
                            <img
                              src="<?php echo get_stylesheet_directory_uri(); ?>/img/portfolio-banner.jpg"
                              alt="portfolio"
                            />
                          )}
                        </div>
                      </div>
                      <h3>{slide.node.title}</h3>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {portfolio && (
                <Swiper
                  onSwiper={(s) => {
                    setSwiper3(s);
                  }}
                  speed={1200}
                  pagination={false}
                  slidesPerView={1}
                  navigation={false}
                  allowTouchMove={false}
                  loop={true}
                  spaceBetween={0}
                  initialSlide={1}
                  className="swiper-container productRangeOne"
                >
                  {portfolio.map((slide, index) => (
                    <SwiperSlide class="swiper-slide" key={`gdfs` + index}>
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
                            <ul class="design-gallery" id={`Gal` + index}>
                              {slide.node.portfolioGalleryLayout.portfolioGallery.map(
                                (gallerySlide, index) => (
                                  <li
                                    data-src={gallerySlide.mediaItemUrl}
                                    data-exthumbimage={gallerySlide.mediaItemUrl}
                                    data-sub-html={`<div class="lightGallery-captions"><h5>${slide.node.title}</h5></div>`}
                                    key={`garega` + index}
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

                          {slide.node.featuredImage.node.mediaItemUrl ? (
                            <img
                              src={slide.node.featuredImage.node.mediaItemUrl}
                              alt="portfolio"
                            />
                          ) : (
                            <img
                              src="<?php echo get_stylesheet_directory_uri(); ?>/img/portfolio-banner.jpg"
                              alt="portfolio"
                            />
                          )}
                        </div>
                      </div>
                      <h3>{slide.node.title}</h3>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              <div class="portfolio-view-all">
                <Link to="/portfolio/" class="view-all portfolio-view-all">
                  View All
                </Link>
              </div>
            </div>
            <div class="swiper-button-nxt" id="productRangeSwiperNext">
              <a href="#" onClick={handleProductRange}>
                <img src={swiperNext} alt="Swiper next button" />
              </a>
            </div>
          </section>

          <section class="brand-footer-sldier">
            <div class="brandFooterWrapper">
              <div class="wrapper">
                <div class="holder">
                  {brandsAcf && brandsAcf.brandFooterSliderImage ? (
                    // <img src={ brandsAcf.brandFooterSliderImage.mediaItemUrl} alt="Brand Footer" />
                    <GatsbyImage
                      image={getImage(brandsAcf.brandFooterSliderImage)}
                      alt="Brand Footer"
                    />
                  ) : (
                    <img
                      src="<?php echo get_stylesheet_directory_uri(); ?>/img/brand-footer-img.jpg"
                      alt="Brand Footer"
                    />
                  )}
                  <div class="content">
                    {brandsAcf && brandsAcf.brandLogo && (
                      <img
                        src={brandsAcf.brandLogo.mediaItemUrl}
                        class="slide-brand-logo"
                        alt={brands.title}
                      />
                    )}
                    {brandsAcf && brandsAcf.brandFooterContent ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: brandsAcf.brandFooterContent,
                        }}
                      />
                    ) : (
                      <p>The best place in life must be at home</p>
                    )}
                    {brandsAcf && brandsAcf.brandPageLink && (
                      <a href={brandsAcf.brandPageLink}>
                        {brandsAcf.brandPageLinkText
                          ? brandsAcf.brandPageLinkText
                          : `visit our website`}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </Layout>
    </>
  );
};
export default Brands;
export const Head = ({ data }) => (
  <Seo seoData={data?.wpPage?.seo || []}>
  </Seo>
)

export const data = graphql`
  query MyQuery($pageId: Int!, $pageSlug: String!) {
    wpPage(databaseId: { eq: $pageId }) {
      id
      title
      slug
      uri
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
      brandsMainPageLayout {
        brandFooterContent
        brandFooterSliderImage {
          altText
          gatsbyImage(
            height: 481
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 1920
          )
          mediaItemUrl
        }
        brandLogo {
          altText
          mediaItemUrl
        }
        brandPageLink
        brandPageLinkText
        brandSliderImages {
          altText
          gatsbyImage(
            width: 1920
            placeholder: BLURRED
            layout: CONSTRAINED
            height: 733
          )
          mediaItemUrl
        }
        featureBlockTitle
        featureContent
        featureList {
          featureImage {
            altText
            gatsbyImage(
              height: 549
              layout: CONSTRAINED
              placeholder: DOMINANT_COLOR
              width: 549
            )
            mediaItemUrl
          }
          featureShortDescription
          featureTitle
        }
        topText
        testimonialThought {
          author
          location
          thought
        }
      }
    }
    allWpPortfolio(
      filter: {
        brandCategory: { nodes: { elemMatch: { slug: { eq: $pageSlug } } } }
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
            }
          }
          portfolioGalleryLayout {
            portfolioGallery {
              mediaItemUrl
              altText
              gatsbyImage(
                height: 832
                layout: CONSTRAINED
                placeholder: BLURRED
                width: 910
              )
            }
          }
        }
      }
    }
  }
`;
