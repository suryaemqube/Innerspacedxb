import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Seo from "../components/SeoMeta";

import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import "../assets/css/landing-page.css";

const Rolf = () => {
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;

  const helmetContext = {};

  return (
    <>
      <HelmetProvider context={helmetContext}>
        <Seo
          pageUrl={`${WEBSITE_URL}/hulsta-dubai/`}
          bodyClass="page-template-tp-lp"
        ></Seo>
      </HelmetProvider>
      <section class="header">
        <div class="holder">
          <picture>
            <source
              srcset={`${MEDIA_URL}/img/Nouthing-but-wunderbar-mobile.jpg`}
              media="(max-width: 767px)"
            />
            <img
              src={`${MEDIA_URL}/img/Nouthing-but-wunderbar.jpg `}
              alt="Nouthing But Wunderbar"
            />
          </picture>
        </div>
        <div class="header-content">
          <div class="logo">
            <a href="https://www.innerspacedxb.com/">
              <img src={`${MEDIA_URL}/img/rolf-benz.svg`} alt="Relf Benz" />
            </a>
          </div>
          <h1>Nothing but Wünderbar </h1>
          <p>Luxury Furniture expertly Crafted in Germany since 1964</p>
        </div>
      </section>
      <section class="services">
        <div class="container">
          <ul>
            <li>
              <div class="logo">
                <img
                  src={`${MEDIA_URL}/img/tailored-to-you.svg`}
                  width="80"
                  height="80"
                  alt="Tailored to yous"
                />
              </div>
              <div class="title">
                <h4>
                  Tailored to
                  <br /> You
                </h4>
              </div>
            </li>
            <li>
              <div class="logo">
                <img
                  src={`${MEDIA_URL}/img/fully-made-in-germany.svg`}
                  width="90"
                  height="90"
                  alt="Fully Made in Germany"
                />
              </div>
              <div class="title">
                <h4>
                  Fully Made
                  <br /> in Germany
                </h4>
              </div>
            </li>
            <li>
              <div class="logo">
                <img
                  src={`${MEDIA_URL}/img/sustainable-manufacturing.svg`}
                  width="95"
                  height="87"
                  alt="Sustainable manufacturing"
                />
              </div>
              <div class="title">
                <h4>
                  Sustainable
                  <br /> Manufacturing
                </h4>
              </div>
            </li>
            <li>
              <div class="logo">
                <img
                  src={`${MEDIA_URL}/img/europian-trained-installation-team.svg`}
                  width="85"
                  height="85"
                  alt="Europian trained Installation team"
                />
              </div>
              <div class="title">
                <h4>
                  European Trained
                  <br /> Installation Team
                </h4>
              </div>
            </li>
            <li class="mfg">
              <div class="logo">
                <img
                  src={`${MEDIA_URL}/img/responsive-after-sales-services.svg`}
                  width="50"
                  height="65"
                  alt="Responsive After sales service"
                />
              </div>
              <div class="title">
                <h4>
                  Responsive After
                  <br /> Sales Service
                </h4>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="about-rolf-benz">
        <div class="container">
          <h2>About Rolf Benz</h2>
          <p>
            Since 1964 Rolf Benz has created designer furniture with the aim of
            achieving the highest levels of form and function. Dedicated to not
            only designing pieces that are beautiful to the eye, Rolf Benz
            ensures that every item of furniture serves a purpose that improves
            life. With tailored materials, colors, heights, firmness, and more
            for its living, dining, and bedroom ranges, Rolf Benz takes luxury
            to another level.{" "}
          </p>
          <p>
            The brand truly lives by the promise “nothing but wünderbar
            (wonderful)”{" "}
          </p>
        </div>
        <div class="about-rolf-benz-img">
          <picture>
            <source
              srcset={`${MEDIA_URL}/img/about-rolf-benz-mobile.jpg`}
              media="(max-width: 767px)"
            />
            <img
              src={`${MEDIA_URL}/img/about-rolf-benz.jpg`}
              alt="About Rolf Benz"
            />
          </picture>
        </div>
      </section>

      <section class="art">
        <div class="container">
          <h4>The Art of Choice </h4>
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            slidesPerView={2.3}
            spaceBetween={10}
            freeMode={true}
            breakpoints={{
              1280: {
                slidesPerView: 2.3,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 2.3,
                spaceBetween: 10,
              },
              912: {
                slidesPerView: 2.3,
                spaceBetween: 15,
              },
              820: {
                slidesPerView: 2.3,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 2.3,
                spaceBetween: 10,
              },
              360: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              280: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
            }}
            speed={1000}
            direction={"horizontal"}
            navigation={{
              nextEl: ".swiper-button-next-1",
              prevEl: ".swiper-button-prev-1",
            }}
            pagination={{
              el: ".swiper-pagination",
              dynamicBullets: false,
            }}
            zoom={true}
            keyboard={{
              enabled: true,
              onlyInViewport: false,
            }}
            autoplay={{
              delay: 2000,
            }}
            loop={true}
            id="product-corosal"
            class="swiper"
          >
            <SwiperSlide class="swiper-slide ">
              <div class="premium-title">
                <h3>Sofas </h3>
                <img src={`${MEDIA_URL}/img/sofas.jpg`} alt="Sofas" />
              </div>
              <p>
                Reimagine sofa design with Rolf Benz’s elegant and intelligent
                ranges designed for the ultimate levels of comfort and beauty.
                Choose from leather, suede, wool, and other sustainably sourced
                materials to create the perfect sofa for you.
              </p>
            </SwiperSlide>
            <SwiperSlide class="swiper-slide ">
              <div class="premium-title">
                <h3>Armchairs </h3>
                <img src={`${MEDIA_URL}/img/armchairs.jpg`} alt="Armchairs" />
              </div>
              <p>
                Curl up in the perfect armchair from Rolf Benz. Whether placed
                together as a pair to spark conversation or in a corner for a
                beautiful moment of solitude, these works of art are a brilliant
                addition to any space.
              </p>
            </SwiperSlide>
            <SwiperSlide class="swiper-slide ">
              <div class="premium-title">
                <h3>Coffee Tables</h3>
                <img
                  src={`${MEDIA_URL}/img/coffee-tables.jpg`}
                  alt="Coffee Tables"
                />
              </div>
              <p>
                Create statement focal points with Rolf Benz’s line of luxury
                coffee tables made from an array of high-end material. Explore
                eclectic pieces or work with iconic statement furniture to
                elevate your living space.
              </p>
            </SwiperSlide>
          </Swiper>
          <div class="paginations">
            <div class="swiper-button-prev-1">
              <img src={`${MEDIA_URL}/img/ionic-md-arrow-back.svg`} />
            </div>
            <div class="swiper-button-next-1">
              <img src={`${MEDIA_URL}/img/ikon-arrow-next.svg`} />
            </div>
          </div>
        </div>
      </section>

      <section class="testimonials-slider">
        <div class="container">
          <Swiper
            modules={[Pagination]}
            loop={true}
            navigation={false}
            pagination={{
              el: ".pagination",
              clickable: true,
            }}
            class="swiper-container"
            id="testimonials-slider"
          >
            <SwiperSlide class="swiper-slide">
              <div class="test-wrapper">
                <div class="left">
                  <img src={`${MEDIA_URL}/img/Our-Rolf-Benz-sofa.jpg`} />
                </div>
                <div class="right">
                  <p>
                    "Our Rolf Benz sofa really is the heart of our living room
                    and so comfortable for the whole family. It’s beautiful and
                    also a piece of art in own its right. the quality of the
                    leather and hand stitching is exactly why we chose this
                    German luxury brand."
                  </p>
                  <p class="c-name">- Tania Berbez </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide class="swiper-slide">
              <div class="test-wrapper">
                <div class="left">
                  <img src={`${MEDIA_URL}/img/testimonial-chair.jpg`} />
                </div>
                <div class="right">
                  <p>
                    "Superb quality and timeless design. Made for eternity with
                    proper and regular care of the leather."
                  </p>
                  <p class="c-name">- Jürgen Zweeny</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide class="swiper-slide">
              <div class="test-wrapper">
                <div class="left">
                  <img src={`${MEDIA_URL}/img/testimonial-sofa.jpg`} />
                </div>
                <div class="right">
                  <p>
                    "Style, durability and design. I still like our Rolf Benz
                    today, and we have had it for 38 years now."
                  </p>
                  <p class="c-name"> - Mathilde Noppel</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <div class="pagination"></div>
        </div>
      </section>

      <section class="expert">
        <div class="container">
          <div class="expert-content">
            <div class="left">
              <h2>
                Elevate Your Home with
                <br /> Rolf Benz Designer Furniture.
              </h2>
              <h5>Speak to the Innerspace team in Dubai today. </h5>
            </div>
            <div class="right">
              <div class="form-wrap">
                {/* <?php echo do_shortcode( '[contact-form-7 id="1131" title="speak to our team"]' ); ?> */}
                <div
                  class="wpcf7 js"
                  id="wpcf7-f1286-o1"
                  lang="en-US"
                  dir="ltr"
                >
                  <form
                    class="wpcf7-form init"
                    aria-label="Contact form"
                    novalidate="novalidate"
                    data-status="init"
                  >
                    <h6>Speak to our team​</h6>
                    <div class="row">
                      <span
                        class="wpcf7-form-control-wrap"
                        data-name="your-name"
                      >
                        <input
                          size="40"
                          class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                          aria-required="true"
                          aria-invalid="false"
                          placeholder="Name*"
                          value=""
                          type="text"
                          name="your-name"
                        />
                      </span>
                    </div>
                    <div class="row">
                      <span
                        class="wpcf7-form-control-wrap"
                        data-name="your-email"
                      >
                        <input
                          size="40"
                          class="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email"
                          aria-required="true"
                          aria-invalid="false"
                          placeholder="E-mail*"
                          value=""
                          type="email"
                          name="your-email"
                        />
                      </span>
                    </div>
                    <div class="row">
                      <span
                        class="wpcf7-form-control-wrap"
                        data-name="your-city"
                      >
                        <select
                          class="wpcf7-form-control wpcf7-select wpcf7-validates-as-required"
                          aria-required="true"
                          aria-invalid="false"
                          name="your-city"
                        >
                          <option value="">City/Emirates</option>
                          <option value="Dubai">Dubai</option>
                          <option value="Abu Dhabi">Abu Dhabi</option>
                          <option value="Sharjah">Sharjah</option>
                          <option value="Al Ain">Al Ain</option>
                          <option value="Ajman">Ajman</option>
                          <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                          <option value="Fujairah">Fujairah</option>
                          <option value="Umm al-Quwain">Umm al-Quwain</option>
                          <option value="Dibba Al-Fujairah">
                            Dibba Al-Fujairah
                          </option>
                          <option value="Khor Fakkan">Khor Fakkan</option>
                          <option value="Kalba">Kalba</option>
                          <option value="Jebel Ali">Jebel Ali</option>
                          <option value="Madinat Zayed">Madinat Zayed</option>
                          <option value="Ruwais">Ruwais</option>
                          <option value="Liwa Oasis">Liwa Oasis</option>
                          <option value="Dhaid">Dhaid</option>
                          <option value="Ghayathi">Ghayathi</option>
                          <option value="Ar-Rams">Ar-Rams</option>
                          <option value="Dibba Al-Hisn">Dibba Al-Hisn</option>
                          <option value="Hatta">Hatta</option>
                          <option value="Al Madam">Al Madam</option>
                        </select>
                      </span>
                    </div>
                    <div class="row">
                      <span
                        class="wpcf7-form-control-wrap"
                        data-name="your-tel"
                      >
                        <input
                          size="40"
                          class="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel"
                          aria-required="true"
                          aria-invalid="false"
                          placeholder="Mobile Number*"
                          value=""
                          type="tel"
                          name="your-tel"
                        />
                      </span>
                    </div>
                    <div class="row">
                      <span
                        class="wpcf7-form-control-wrap"
                        data-name="how-can-help"
                      >
                        <textarea
                          cols="10"
                          rows="3"
                          class="wpcf7-form-control wpcf7-textarea wpcf7-validates-as-required"
                          aria-required="true"
                          aria-invalid="false"
                          placeholder="How can we help you?*"
                          name="how-can-help"
                        ></textarea>
                      </span>
                    </div>
                    <div class="captcha"></div>
                    <div class="row sub-btn">
                      <input
                        class="wpcf7-form-control wpcf7-submit has-spinner"
                        type="submit"
                        value="Submit"
                      />
                      <span class="wpcf7-spinner"></span>
                    </div>
                    <div class="wpcf7-response-output" aria-hidden="true"></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div class="container">
          <div class="left-col">
            <div class="footer-logo-wrapper">
              <a href="https://www.innerspacedxb.com/" class="footer-logo">
                <img
                  src="https://www.innerspacedxb.com/wp-content/uploads/2021/10/logo-innerspace-black.svg"
                  alt="Innserspace"
                />
              </a>
              <p>
                A Collective of Luxury
                <br />
                German Kitchen & Interior Brands
              </p>
            </div>
          </div>

          <div class="right-col">
            <div class="footer-bottom-wrapper">
              <ul>
                <li>
                  <h5>visit our showroom</h5>
                  <p>
                    Innerspace Dubai Showroom
                    <br />
                    104 API Business Suites
                    <br />
                    Al Barsha, Sheikh Zayed Road
                    <br /> Dubai
                  </p>
                  <a
                    href="https://goo.gl/maps/CFZ4WcwBxFyuyyyU8"
                    target="_blank"
                    class="get-direction"
                  >
                    Get Directions
                  </a>
                </li>
                <li>
                  <h5>speak to our designers </h5>
                  <p>
                    <a
                      class="email footer"
                      href="mailto:hello@innerspacedxb.com"
                    >
                      hello@innerspacedxb.com
                    </a>
                    <a class="tel footer" href="tel:+971 (0) 4 252  6500">
                      +971 (0) 4 252 6500
                    </a>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="contain credits-copy">
          <div class="container">
            <div class="credits">Copyright&copy;. Innerspace Trading LLC</div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Rolf;
