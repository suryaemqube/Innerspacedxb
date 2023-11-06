import React, { useState } from "react";
import { Link } from "gatsby";
import { HelmetProvider } from "react-helmet-async";
import Seo from "../components/SeoMeta";

import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import "../assets/css/lp-hulsta.css"

const Hulsta = () => {
    SwiperCore.use([Navigation]);
    const WEBSITE_URL = process.env.GATSBY_BASE_URL;
    const MEDIA_URL = process.env.GATSBY_MEDIA_URL;

    const helmetContext = {};

    return (
        <>
            <HelmetProvider context={helmetContext} >
                <Seo pageUrl={`${WEBSITE_URL}/hulsta-dubai/`} bodyClass="page-template-tp-lp-hulusta"></Seo>
            </HelmetProvider>
            <section class="header">
                <div class="holder">

                    <picture>
                        <source srcset={`${MEDIA_URL}/img/design-the-wardrobe-mobile.jpg`} media="(max-width: 767px)" />
                        <img src={`${MEDIA_URL}/img/design-the-wardrobe.jpg`} alt="Bespoke Wardrobes Designed in Dubai and Made in Germany" />
                    </picture>
                </div>
                <div class="header-content">
                    <div class="logo">
                        <Link to="/">
                            <img src={`${MEDIA_URL}/img/hulsta-was-awarded.svg`} alt="Hülsta" />
                        </Link>
                    </div>
                    <h1>Design the Wardrobe of Your Wildest Dreams  </h1>
                    <p>Bespoke Wardrobes Designed in Dubai and Made in Germany </p>
                </div>

            </section>

            <section class="services">
                <div class="container">
                    <ul>
                        <li>
                            <div class="logo">
                                <img src={`${MEDIA_URL}/img/limitless-design.svg`} width="80" height="80" alt="Limitless Design
              Possibilities" />
                            </div>
                            <div class="title">
                                <h4>Limitless Design <br />
                                    Possibilities </h4>
                            </div>
                        </li>
                        <li>
                            <div class="logo">
                                <img src={`${MEDIA_URL}/img/fully-made-in-germany.svg`} width="90" height="90" alt="Fully Made in Germany" />
                            </div>
                            <div class="title">
                                <h4>Fully Made<br />
                                    in Germany</h4>
                            </div>
                        </li>
                        <li >
                            <div class="logo">
                                <img src={`${MEDIA_URL}/img/sustainable-manufacturing.svg`} width="95" height="87" alt="Sustainable manufacturing" />
                            </div>
                            <div class="title">
                                <h4>Sustainable<br />
                                    Manufacturing</h4>
                            </div>
                        </li>
                        <li>
                            <div class="logo">
                                <img src={`${MEDIA_URL}/img/europian-trained-installation-team.svg`} width="85" height="85"
                                    alt="Europian trained Installation team" />
                            </div>
                            <div class="title">
                                <h4>European Trained <br />
                                    Installation Team</h4>
                            </div>
                        </li>
                        <li class="mfg">
                            <div class="logo">
                                <img src={`${MEDIA_URL}/img/responsive-after-sales-services.svg`} width="50" height="65"
                                    alt="Responsive After sales service" />
                            </div>
                            <div class="title">
                                <h4>Responsive After<br />
                                    Sales Service</h4>
                            </div>
                        </li>
                    </ul>
                </div>

            </section>




            <section class="about-hulsta">

                <div class="container">
                    <div class="ah-left">
                        <img src={`${MEDIA_URL}/img/about-hulsta.jpg`} alt="About Rolf Ben image" />
                    </div>
                    <div class="ah-right">
                        <h2>About hülsta</h2>
                        <p>Founded over 75 years ago in Germany, hülsta is a leader in European wardrobe manufacture. With a focus on creating beautiful, high-quality, and functional wardrobes for every style and size of space, hülsta’s system enables clients to select from a vast array of materials, colors, and solutions to customise the luxury closet of their wildest dreams.
                        </p>
                        <p>You can create your own bespoke German wardrobe by visiting the hülsta showroom on Sheikh Zayed Road at Innerspace Dubai. Meet with our experienced team to design a closet that eclipses your expectations.</p>

                    </div>

                </div>
            </section>



            <section class="incredible-wardrobes">
                <div class="container">

                    <h4>Incredible Wardrobes, Inside and Out</h4>
                    <Swiper
                        modules={[Navigation]}
                        slidesPerView={3.3}
                        spaceBetween={30}
                        breakpoints={{

                            1280: {
                                slidesPerView: 3.3,
                                spaceBetween: 20,
                            },
                            1152: {
                                slidesPerView: 3.3,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3.3,
                                spaceBetween: 10,
                            },
                            912: {
                                slidesPerView: 3.3,
                                spaceBetween: 10,
                            },
                            820: {
                                slidesPerView: 2.5,
                                spaceBetween: 15,
                            },
                            768: {
                                slidesPerView: 2.3,
                                spaceBetween: 10,
                            },
                            540: {
                                slidesPerView: 1.3,
                                spaceBetween: 10,
                            },
                            375: {
                                slidesPerView: 1,
                                spaceBetween: 0,
                            },
                            360: {
                                slidesPerView: 1,
                                spaceBetween: 0,
                            },
                            280: {
                                slidesPerView: 1,
                                spaceBetween: 0,
                            }
                        }}
                        direction={"horizontal"}
                        navigation={{
                            nextEl: ".swiper-button-next-1",
                            prevEl: ".swiper-button-prev-1",
                        }}
                        keyboard={{
                            enabled: true,
                            onlyInViewport: false,
                        }}

                        loop={true}
                        id="product-corosal" class="swiper">
                        <SwiperSlide class="swiper-slide ">
                            <div class="premium-title">
                                <img src={`${MEDIA_URL}/img/tailored-to-you-1.jpg`} alt="100% Tailored to You" />
                            </div>
                            <div class="swiper-content">
                                <h3>100% Tailored to You</h3>
                                <p>
                                    hülsta’s customised wardrobes <br />are designed to suit the <br />aesthetic and needs of each <br />individual client.
                                </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide class="swiper-slide">
                            <div class="premium-title">
                                <img src={`${MEDIA_URL}/img/solid-wood-sourced-in-germany-1.jpg`} alt="Solid Wood Sourced in Germany" />
                            </div>
                            <div class="swiper-content">
                                <h3>Solid Wood Sourced<br /> in Germany</h3>
                                <p>
                                    All wood used in the manufacture <br />of hülsta wardrobes is sustainably<br /> sourced in Germany.
                                </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide class="swiper-slide ">
                            <div class="premium-title">

                                <img src={`${MEDIA_URL}/img/intelligent-design-solutions-1.jpg`} alt="Intelligent design<br /> Solutions" />
                            </div>
                            <div class="swiper-content">
                                <h3>Intelligent design<br /> Solutions</h3>
                                <p>
                                    Create a dedicated space for<br /> every item in your wardrobe so <br />your space is forever sleek and<br /> tidy.
                                </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide class="swiper-slide ">
                            <div class="premium-title">
                                <img src={`${MEDIA_URL}/img/maximise-your-space-1.jpg`} alt="Maximise Your Space " />
                            </div>
                            <div class="swiper-content">
                                <h3>Maximise Your Space </h3>
                                <p>
                                    hülsta‘s wardrobe systems enable<br /> you to make the most of your <br />space, no matter its size.
                                </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide class="swiper-slide ">
                            <div class="premium-title">

                                <img src={`${MEDIA_URL}/img/internal-lighting-systems-1.jpg`} alt="Internal Lighting Systems" />
                            </div>
                            <div class="swiper-content">
                                <h3>Internal Lighting Systems</h3>
                                <p>
                                    Clever internal lighting solutions allow you to see everything in your wardrobe clearly to ensure you never lose a treasured item.
                                </p>
                            </div>

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




            <section class="hulsta-was-awarded">
                <div class="container">

                    <div class="left">
                        <img src={`${MEDIA_URL}/img/blue-angle.png`} />
                    </div>
                    <div class="right">
                        <p>hülsta was awarded the Blue Angel certification in 1996, which is the world's first environmental label. Granting of this voluntary certification indicates that our products are particularly environmentally friendly and low in emissions. We are proud of reducing our ecological footprint and creating beautiful products that still keep our planet beautiful.</p>
                    </div>
                </div>
            </section>



            <section class="expert">
                <div class="container">
                    <div class="expert-content">
                        <div class="left">
                            <h2>Design a Wardrobe That’s<br /> Beautiful, Inside and Out.</h2>
                            <h5>Speak to the Innerspace team in Dubai today.   </h5>
                        </div>
                        <div class="right">
                            <div class="form-wrap">

                                {/* <?php echo do_shortcode( '[contact-form-7 id="1286" title="speak to our team - lp-hulsta"]' ); ?> */}
                                <div class="wpcf7 js" id="wpcf7-f1286-o1" lang="en-US" dir="ltr">
                                    <form class="wpcf7-form init" aria-label="Contact form" novalidate="novalidate" data-status="init">
                                        <h6>Speak to our team​</h6>
                                        <div class="row">
                                            <span class="wpcf7-form-control-wrap" data-name="your-name">
                                                <input size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" aria-invalid="false" placeholder="Name*" value="" type="text" name="your-name" />
                                            </span>
                                        </div>
                                        <div class="row"><span class="wpcf7-form-control-wrap" data-name="your-email">
                                            <input size="40" class="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email" aria-required="true" aria-invalid="false" placeholder="E-mail*" value="" type="email" name="your-email" />
                                        </span>
                                        </div>
                                        <div class="row">
                                            <span class="wpcf7-form-control-wrap" data-name="your-city">
                                                <select class="wpcf7-form-control wpcf7-select wpcf7-validates-as-required" aria-required="true" aria-invalid="false" name="your-city"><option value="">City/Emirates</option><option value="Dubai">Dubai</option><option value="Abu Dhabi">Abu Dhabi</option><option value="Sharjah">Sharjah</option><option value="Al Ain">Al Ain</option><option value="Ajman">Ajman</option><option value="Ras Al Khaimah">Ras Al Khaimah</option><option value="Fujairah">Fujairah</option><option value="Umm al-Quwain">Umm al-Quwain</option><option value="Dibba Al-Fujairah">Dibba Al-Fujairah</option><option value="Khor Fakkan">Khor Fakkan</option><option value="Kalba">Kalba</option><option value="Jebel Ali">Jebel Ali</option><option value="Madinat Zayed">Madinat Zayed</option><option value="Ruwais">Ruwais</option><option value="Liwa Oasis">Liwa Oasis</option><option value="Dhaid">Dhaid</option><option value="Ghayathi">Ghayathi</option><option value="Ar-Rams">Ar-Rams</option><option value="Dibba Al-Hisn">Dibba Al-Hisn</option>
                                                    <option value="Hatta">Hatta</option>
                                                    <option value="Al Madam">Al Madam</option>
                                                </select>
                                            </span></div>
                                        <div class="row">
                                            <span class="wpcf7-form-control-wrap" data-name="your-tel">
                                                <input size="40" class="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel" aria-required="true" aria-invalid="false" placeholder="Mobile Number*" value="" type="tel" name="your-tel" />
                                            </span>
                                        </div>
                                        <div class="row">
                                            <span class="wpcf7-form-control-wrap" data-name="how-can-help">
                                                <textarea cols="10" rows="3" class="wpcf7-form-control wpcf7-textarea wpcf7-validates-as-required" aria-required="true" aria-invalid="false" placeholder="How can we help you?*" name="how-can-help"></textarea>
                                            </span>
                                        </div>
                                        <div class="captcha">

                                        </div>
                                        <div class="row sub-btn">
                                            <input class="wpcf7-form-control wpcf7-submit has-spinner" type="submit" value="Submit" /><span class="wpcf7-spinner"></span>
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
                                <img src="https://www.innerspacedxb.com/wp-content/uploads/2021/10/logo-innerspace-black.svg"
                                    alt="Innserspace" />
                            </a>
                            <p>A Collective of Luxury<br />German Kitchen & Interior Brands</p>
                        </div>
                    </div>

                    <div class="right-col">
                        <div class="footer-bottom-wrapper">
                            <ul>
                                <li>
                                    <h5>visit our showroom</h5>
                                    <p>Innerspace Dubai Showroom<br />104 API Business Suites<br />
                                        Al Barsha, Sheikh Zayed Road<br /> Dubai</p>
                                    <a href="https://goo.gl/maps/CFZ4WcwBxFyuyyyU8" target="_blank" class="get-direction">Get Directions</a>
                                </li>
                                <li>
                                    <h5>speak to our designers </h5>
                                    <p><a class="email footer" href="mailto:hello@innerspacedxb.com">hello@innerspacedxb.com</a><a
                                        class="tel footer" href="tel:+971 (0) 4 252  6500">+971 (0) 4 252 6500</a>
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
export default Hulsta;
