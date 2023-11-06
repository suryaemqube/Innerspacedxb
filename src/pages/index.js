import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import LazyLoad from "react-lazy-load";
import SwiperCore, { Autoplay, Parallax } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css"; // Swiper CSS
import { Pagination, Navigation } from "swiper";
import "swiper/css/pagination";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Seo from "../components/SeoMeta";
import Layout from "../components/Layout";
import swiperNext from "../assets/img/swiper-next.png";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const SliderLazy = lazy(() => import("../components/lazyload/BrandsSlider"));

export default function Home({ data }) {
  SwiperCore.use([Parallax, Navigation, Autoplay]);
  gsap.registerPlugin(ScrollTrigger);

  const [isLoaded, setIsLoaded] = useState(false);

  const designBy = useRef();
  const portfolioElem = useRef();

  const homePage = data?.wpPage || [];
  const home = data?.wpPage?.homePageContent || [];
  const brand = data?.allWpBrand?.nodes || [];
  const shortUrl = (fullUrl) => {
    const url = fullUrl;
    var desiredPart = "#";
    if (url) {
      const urlObject = new URL(url);
      desiredPart = urlObject.pathname;
    }
    return desiredPart;
  };

  useEffect(() => {
    const delayAnimation = setTimeout(() => {
      let ctx = gsap.context(() => {
        var designByRoomText = gsap.timeline();
        designByRoomText.from(
          ".design-by-room h2, .design-by-room h3, .design-by-room p",
          { duration: 1, opacity: 0, y: 300, ease: "power1.out", stagger: 0.1 },
          "-=1"
        );

        var dBRoomText = gsap.timeline({
          scrollTrigger: {
            trigger: designBy.current,
            start: "top 80%",
            markers: false,
          },
        });
        dBRoomText.add(designByRoomText);

        var designByRoom = gsap.timeline();
        designByRoom.from(
          ".design-by-room .design-swiper",
          { duration: 1, opacity: 0, ease: "power1.out", stagger: 0.1 },
          "-=1"
        );

        var dBRoom = gsap.timeline({
          scrollTrigger: {
            // scroller: ".scrollContainer",
            trigger: ".design-swiper",
            start: "top 80%",
          },
        });
        dBRoom.add(designByRoom);
      }, designBy);

      return () => {
        ctx.revert();
      };
    }, 100);
    return () => {
      clearTimeout(delayAnimation);
    };
  }, []);

  useEffect(() => {
    const delayAnimation = setTimeout(() => {
      let ctx = gsap.context(() => {
        var piBrands = gsap.timeline();
        piBrands
          .from("ul.portfolio-wrappe li", {
            duration: 2,
            opacity: 0,
            y: 400,
            ease: "power1.out",
            stagger: 0.1,
          })
          .fromTo(
            "ul.portfolio-wrappe li .holder img",
            { scale: 1.1, y: 100 },
            { scale: 1, y: 0, duration: 2, ease: "power1.inOut" },
            "-=1"
          );

        var tPI = gsap.timeline({
          scrollTrigger: {
            // scroller: ".scrollContainer",
            trigger: portfolioElem.current,
            start: "top 80%",
            markers: false,
          },
        });
        tPI.add(piBrands);
      }, portfolioElem);

      return () => {
        ctx.revert();
      };
    }, 100);
    return () => {
      clearTimeout(delayAnimation);
    };
  }, []);

  return (
    <>
      <Seo pageUrl={`${WEBSITE_URL}/`} bodyClass={`home`} title={"Luxury Furniture Brand in Dubai | Kitchen Showroom Dubai"} description={"Luxury Furniture Brand in Dubai: Redefine elegance with our complete home interior design service using premium furniture, and luxurious accessories."} />
      <Layout>
        {/* <!-- hero slider starts  --> */}
        <section className="hero-slider page-wrap">
          <div id="home-slider">
            <Swiper
              speed={2000}
              pagination={false}
              modules={[Pagination, Navigation, Autoplay]}
              slidesPerView={1}
              autoplay={{
                delay: 4500,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              preloadImages={false}
              lazy={{
                loadPrevNext: false,
                loadOnTransitionStart: true,
              }}
              parallax={true}
              effect="slide"
              loop={true}
              className="swiper-container vertical-swpier"
            >
              {home &&
                home.heroSlider.map((slide, index) => (
                  <SwiperSlide
                    className={`swiper-slide swiper-slide-${index + 1}`}
                  >
                    <div className="swiper-image" data-swiper-parallax-x="35%">
                      <div
                        className="swiper-image-inner swiper-image-right"
                      // style={{
                      //   backgroundImage: `url(${slide.sliderImage.mediaItemUrl})`,
                      // }}
                      >
                        <div className="img-wrap">
                          {typeof window !== "undefined" &&
                            window.innerWidth > 767 && (
                              <GatsbyImage
                                image={getImage(slide.sliderImage)}
                                alt={slide.sliderImage.altText}
                                loading="lazy"
                                className="swiper-image-inner swiper-lazy swiper-image-right"
                              />
                            )}
                          {typeof window !== "undefined" &&
                            window.innerWidth < 767 && (
                              <GatsbyImage
                                image={getImage(slide.mobileSliderImage)}
                                alt={slide.sliderImage.altText}
                                loading="lazy"
                                className="swiper-image-inner swiper-lazy swiper-image-right test"
                              />
                            )}
                          {/* <div className="swiper-lazy-preloader"></div> */}
                        </div>
                        <div
                          className="contain"
                          dangerouslySetInnerHTML={{
                            __html: slide.sliderContent,
                          }}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

              <div className="swiper-button-prev swiper-button-white"></div>
              <div className="swiper-button-next swiper-button-white"></div>
            </Swiper>
          </div>
        </section>
        {/* <!-- hero slider ends  --> */}
        {/* <!-- design by room starts  --> */}
        <section className="design-by-room" ref={designBy}>
          {home && (
            <div
              className="container"
              dangerouslySetInnerHTML={{
                __html: home.designByRoomIntroduction,
              }}
            />
          )}

          <div className="design-swiper">
            <Swiper
              speed={2000}
              pagination={false}
              modules={[Pagination, Navigation, Autoplay]}
              slidesPerView={1}
              autoplay={{
                delay: 4500,
              }}
              navigation={{
                nextEl: ".swiper-button-nxt",
                prevEl: ".swiper-button-prev",
              }}
              preloadImages={false}
              lazy={{
                loadPrevNext: false,
                loadOnTransitionStart: true,
              }}
              grabCursor={true}
              loop={true}
              className="swiper-container design-container"
              id="designSwiper"
            >
              {home &&
                home.designByRoomSlider.map((slide, index) => (
                  <SwiperSlide
                    className="swiper-slide"
                  // style="background: url(<?php echo get_sub_field('slider_image')['url']; ?>) no-repeat center; background-size: cover;"
                  >
                    <div className="img-wrap">
                      <div className="img-design">
                        {/* <img className="swiper-lazy" height="728" width="1920" src="" data-src="<?php echo get_sub_field('slider_image')['url']; ?>" alt="" /> */}
                        {typeof window !== "undefined" &&
                          window.innerWidth > 767 && (
                            <GatsbyImage
                              image={getImage(slide.sliderImage)}
                              alt={slide.sliderImage.altText}
                              width="1920"
                              height="728"
                              loading="lazy"
                              className="swiper-image-inner swiper-lazy swiper-image-right"
                            />
                          )}

                        {typeof window !== "undefined" &&
                          window.innerWidth < 767 && (
                            <GatsbyImage
                              image={getImage(slide.mobileSliderImage)}
                              alt={slide.sliderImage.altText}
                              width="1920"
                              height="728"
                              loading="lazy"
                              className="swiper-image-inner swiper-lazy swiper-image-right test"
                            />
                          )}
                        {/* <div className="swiper-lazy-preloader"></div> */}
                      </div>
                      <div className="cta-text">
                        <div className="cta">
                          <h3
                            dangerouslySetInnerHTML={{
                              __html: slide.title,
                            }}
                          />
                          <a
                            className="view-more"
                            href={shortUrl(slide.viewMoreLink)}
                          >
                            View More
                          </a>
                        </div>

                        <div className="content">
                          <p>{slide && slide.shortDescription}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>

            <div className="swiper-button-nxt" id="designSwiperNext">
              <a href="#">
                <img
                  loading="lazy"
                  height="63"
                  width="62"
                  src={swiperNext}
                  alt=""
                />
              </a>
            </div>
          </div>
        </section>
        {/* <!-- design by room ends  --> */}

        {/* <!-- brands starts --> */}
        {!isLoaded && <div>Loading...</div>}
        <LazyLoad offset={100} onContentVisible={() => setIsLoaded(true)}>
          <Suspense
            fallback={() => {
              setIsLoaded(true);
            }}
          >
            <SliderLazy home={home} brand={brand} />
          </Suspense>
        </LazyLoad>
        {/* <!-- brands ends --> */}

        {/* <!-- portfolio identity starts --> */}
        <section className="portfolio-identity testing" ref={portfolioElem}>
          {home && (
            <div
              className="container testing"
              dangerouslySetInnerHTML={{
                __html: home.portfolioAndIdentityContent,
              }}
            />
          )}
        </section>
        {/* <!-- portfolio identity starts --> */}
      </Layout>
    </>
  );
}

export const data = graphql`
  query MyQuery {
    wpPage(databaseId: { eq: 7 }) {
      title

      homePageContent {
        brandsIntroduction
        designByRoomIntroduction
        designByRoomSlider {
          shortDescription
          title
          viewMoreLink
          sliderImage {
            altText
            gatsbyImage(
              height: 728
              width: 1920
              placeholder: BLURRED
              layout: CONSTRAINED
            )
          }
          mobileSliderImage {
            altText
            gatsbyImage(
              height: 293
              width: 767
              placeholder: BLURRED
              layout: CONSTRAINED
            )
          }
        }
        portfolioAndIdentityContent
        heroSlider {
          sliderContent
          sliderImage {
            altText
            mediaItemUrl
            gatsbyImage(
              height: 945
              width: 1920
              placeholder: BLURRED
              layout: CONSTRAINED
            )
          }
          mobileSliderImage {
            altText
            gatsbyImage(
              height: 378
              width: 767
              placeholder: BLURRED
              layout: CONSTRAINED
            )
          }
        }
      }
    }
    allWpBrand(sort: { date: ASC }) {
      nodes {
        id
        brands {
          brandLogo {
            altText
            mediaItemUrl
          }
          brandRelationshipField {
            ... on WpPage {
              id
              link
              title
            }
          }
        }
        featuredImage {
          node {
            altText
            gatsbyImage(
              height: 549
              width: 549
              placeholder: BLURRED
              layout: CONSTRAINED
            )
          }
        }
      }
    }
  }
`;
