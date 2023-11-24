import React, { useState, useEffect } from "react";
import { Link, navigate, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image"
import { useFormik, Formik } from "formik";
import axios from "axios";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { getToken } from "../hooks/token";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import "../assets/css/lp-hulsta.css"

const Hulsta = ({ data }) => {
    SwiperCore.use([Navigation]);
    const WEBSITE_URL = process.env.GATSBY_BASE_URL;
    const MEDIA_URL = "https://app.innerspacedxb.com/wp-content/themes/Innerspacechild";

    const [token, setToken] = useState("");
    const [formFields, setFormFields] = useState([]);
    const [captchaExpression, setCaptchaExpression] = useState("");
    const [captchaResult, setCaptchaResult] = useState("");
    const [formMessage, setFormMessage] = useState("");

    const seo = data?.wpPage?.seo || [];

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const fetchedToken = await getToken();
                setToken(fetchedToken);
            } catch (error) { }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        const generateCaptcha = () => {
            const operands = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];
            const operator = "+";
            const expression = `${operands[0]} ${operator} ${operands[1]}`;
            setCaptchaExpression(expression);
            const result = operands[0] + operands[1]; // Calculate the result
            setCaptchaResult(result.toString());
        };

        generateCaptcha();
    }, []);

    useEffect(() => {
        if (token) {
            axios({
                method: "GET",
                url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/1286/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    setFormFields(response.data.properties.form.fields);
                    console.log("fields: ", response.data.properties.form.fields);
                })
                .catch((error) => console.error("Error", error));
        }
    }, [token]);

    const validate = (values) => {
        const errors = {};
        if (values["your-name"] === "") {
            errors["your-name"] = "Required";
        }
        if (values["your-tel"] === "") {
            errors["your-tel"] = "Required";
        }
        if (!values["your-city"]) {
            errors["your-city"] = "Required";
        } else if (values["your-city"] === "City/Emirates") {
            errors["your-city"] = "Required";
        }

        if (values["how-can-help"] === "") {
            errors["how-can-help"] = "Required";
        }

        if (values["your-email"] === "") {
            errors["your-email"] = "Required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values["your-email"])
        ) {
            errors["your-email"] = "Invalid email address";
        }

        if (values.captcha === "") {
            errors.captcha = "Required";
        } else if (values.captcha !== captchaResult) {
            errors.captcha = "Incorrect captcha result";
        }
        console.log(errors);

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            "your-name": "",
            "your-city": "",
            "your-email": "",
            "your-tel": "",
            "how-can-help": "",
            captcha: "",
        },
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: (values) => {
            document.querySelector(".wpcf7-spinner-career").style.display =
                "inline-flex";
            const bodyFormData = new FormData();
            bodyFormData.set("your-name", values["your-name"]);
            bodyFormData.set("your-email", values["your-email"]);
            bodyFormData.set("your-tel", values["your-tel"]);
            bodyFormData.set("your-city", values["your-city"]);
            bodyFormData.set("how-can-help", values["how-can-help"]);
            // bodyFormData.set("your-subject", "Enquiry Form");

            const buttonDisable = document.querySelector(".wpcf7-submit");
            buttonDisable.setAttribute("disabled", "disabled");
            buttonDisable.classList.add("button-disabled");

            axios({
                method: "post",
                url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/1286/feedback`,
                data: bodyFormData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((response) => {
                    formik.resetForm();
                    document.querySelector(".wpcf7-spinner-career").style.display =
                        "none";
                    if (response.data.status === "validation_failed") {
                        console.log("Email sent Fail:", response.data);
                        setFormMessage(response.data.message);
                        buttonDisable.removeAttribute("disabled");
                    } else if (response.data.status === "mail_sent") {
                        console.log("Email sent successfully:", response.data);
                        buttonDisable.removeAttribute("disabled");
                        setFormMessage("");
                        navigate("/enquiry-thank-you/");

                    }
                })
                .catch((error) => console.error("Error sending email:", error));
        },
    });


    return (
        <>
            <HelmetProvider >
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
                <Helmet bodyAttributes={{ class: "page-template-tp-lp-hulusta" }}></Helmet>
            </HelmetProvider>

            <section class="header">
                <div class="holder">
                    {typeof window !== "undefined" &&
                        window.innerWidth > 767 && (
                            <StaticImage
                                src={`${MEDIA_URL}/img/design-the-wardrobe.jpg`}
                                alt="A dinosaur"
                                placeholder="blurred"
                                layout="fixed"
                                width={1920}
                                height={825}
                            />
                        )}

                    {typeof window !== "undefined" &&
                        window.innerWidth <= 767 && (
                            <StaticImage
                                src={`${MEDIA_URL}/img/design-the-wardrobe-mobile.jpg`}
                                alt="A dinosaur"
                                placeholder="blurred"
                                layout="fixed"
                                width={768}
                                height={800}
                            />
                        )}
                    {/* <picture>
                        <source srcset={`${MEDIA_URL}/img/design-the-wardrobe-mobile.jpg`} media="(max-width: 767px)" />
                        <img src={`${MEDIA_URL}/img/design-the-wardrobe.jpg`} alt="Bespoke Wardrobes Designed in Dubai and Made in Germany" />
                    </picture> */}
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

                                <div class="wpcf7 js" id="wpcf7-f1286-o1" lang="en-US" dir="ltr">
                                    <Formik>
                                        <form class="wpcf7-form init" aria-label="Contact form" novalidate="novalidate" data-status="init" onSubmit={formik.handleSubmit}>
                                            <h6>Speak to our team</h6>
                                            <div class="row">
                                                <span class="wpcf7-form-control-wrap" data-name="your-name">
                                                    {formFields[0] && (
                                                        <input
                                                            size="40"
                                                            className={
                                                                formik.errors[formFields[0].name]
                                                                    ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                                                    : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                                            }
                                                            id={formFields[0].name}
                                                            type={formFields[0].basetype}
                                                            name={formFields[0].name}
                                                            placeholder={formFields[0].raw_values[0]}
                                                            value={formik.values[formFields[0].name]}
                                                            onChange={formik.handleChange}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                            <div class="row">
                                                <span class="wpcf7-form-control-wrap" data-name="your-email">
                                                    {formFields[1] && (
                                                        <input
                                                            size="40"
                                                            className={
                                                                formik.errors[formFields[1].name]
                                                                    ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                                                    : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                                            }
                                                            id={formFields[1].name}
                                                            type={formFields[1].basetype}
                                                            name={formFields[1].name}
                                                            placeholder={formFields[1].raw_values[0]}
                                                            value={formik.values[formFields[1].name]}
                                                            onChange={formik.handleChange}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                            <div class="row">
                                                <span class="wpcf7-form-control-wrap" data-name="your-city">

                                                    {formFields[2] && (
                                                        <select
                                                            id={formFields[2].name}
                                                            name={formFields[2].name}
                                                            value={formik.values[formFields[2].name]}
                                                            onChange={formik.handleChange}
                                                            className={
                                                                formik.errors[formFields[2].name]
                                                                    ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                                                    : "wpcf7-form-control wpcf7-select"
                                                            }
                                                            aria-invalid="false"
                                                        >
                                                            {formFields[2].raw_values.map(
                                                                (option, index) => (
                                                                    <option
                                                                        key={`${index}select`}
                                                                        value={option}
                                                                    >
                                                                        {option}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    )}
                                                </span></div>
                                            <div class="row">
                                                <span class="wpcf7-form-control-wrap" data-name="your-tel">
                                                    {formFields[3] && (
                                                        <input
                                                            size="40"
                                                            className={
                                                                formik.errors[formFields[3].name]
                                                                    ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                                                    : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                                            }
                                                            id={formFields[3].name}
                                                            type={formFields[3].basetype}
                                                            name={formFields[3].name}
                                                            placeholder={formFields[3].raw_values[0]}
                                                            value={formik.values[formFields[3].name]}
                                                            onChange={formik.handleChange}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                            <div class="row">
                                                <span class="wpcf7-form-control-wrap" data-name="how-can-help">
                                                    {formFields[4] && (
                                                        <textarea
                                                            cols="40"
                                                            rows="3"
                                                            className={
                                                                formik.errors[formFields[4].name]
                                                                    ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                                                    : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                                            }
                                                            aria-required="true"
                                                            aria-invalid="false"
                                                            placeholder={formFields[4].raw_values[0]}
                                                            name={formFields[4].name}
                                                            onChange={formik.handleChange}
                                                        ></textarea>
                                                    )}
                                                </span>
                                            </div>
                                            <div class="captcha">
                                                <table class="captcha-wrapper">
                                                    <tbody><tr class="captcha_image">

                                                        <td>
                                                            {captchaExpression}
                                                        </td>
                                                    </tr>
                                                        <tr class="captcha_text">
                                                            <td><span class="wpcf7-form-control-wrap" data-name="captcha-720b">
                                                                <input
                                                                    className={
                                                                        formik.errors.captcha
                                                                            ? "c4wp_user_input_captcha wpcf7-select wpcf7-not-valid"
                                                                            : "c4wp_user_input_captcha"
                                                                    }
                                                                    id="captcha"
                                                                    type="text"
                                                                    name="captcha"
                                                                    placeholder="Insert Captcha Here"
                                                                    value={formik.values.captcha}
                                                                    onChange={formik.handleChange}
                                                                /></span></td>
                                                        </tr>
                                                    </tbody></table>
                                            </div>
                                            <div class="row sub-btn">
                                                <input size={"40"} class="wpcf7-form-control wpcf7-submit has-spinner" type="submit" value="Submit" /><span className="wpcf7-spinner-career">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="45px"
                                                        height="45px"
                                                        viewBox="0 0 100 100"
                                                        preserveAspectRatio="xMidYMid"
                                                    >
                                                        <g transform="translate(80,50)">
                                                            <g transform="rotate(0)">
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="6"
                                                                    fill="#1c4595"
                                                                    fill-opacity="1"
                                                                >
                                                                    <animateTransform
                                                                        attributeName="transform"
                                                                        type="scale"
                                                                        begin="-0.7608695652173912s"
                                                                        values="1.5 1.5;1 1"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                    ></animateTransform>
                                                                    <animate
                                                                        attributeName="fill-opacity"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                        values="1;0"
                                                                        begin="-0.7608695652173912s"
                                                                    ></animate>
                                                                </circle>
                                                            </g>
                                                        </g>
                                                        <g transform="translate(71.21320343559643,71.21320343559643)">
                                                            <g transform="rotate(45)">
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="6"
                                                                    fill="#1c4595"
                                                                    fill-opacity="0.875"
                                                                >
                                                                    <animateTransform
                                                                        attributeName="transform"
                                                                        type="scale"
                                                                        begin="-0.6521739130434782s"
                                                                        values="1.5 1.5;1 1"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                    ></animateTransform>
                                                                    <animate
                                                                        attributeName="fill-opacity"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                        values="1;0"
                                                                        begin="-0.6521739130434782s"
                                                                    ></animate>
                                                                </circle>
                                                            </g>
                                                        </g>
                                                        <g transform="translate(50,80)">
                                                            <g transform="rotate(90)">
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="6"
                                                                    fill="#1c4595"
                                                                    fill-opacity="0.75"
                                                                >
                                                                    <animateTransform
                                                                        attributeName="transform"
                                                                        type="scale"
                                                                        begin="-0.5434782608695652s"
                                                                        values="1.5 1.5;1 1"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                    ></animateTransform>
                                                                    <animate
                                                                        attributeName="fill-opacity"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                        values="1;0"
                                                                        begin="-0.5434782608695652s"
                                                                    ></animate>
                                                                </circle>
                                                            </g>
                                                        </g>
                                                        <g transform="translate(28.786796564403577,71.21320343559643)">
                                                            <g transform="rotate(135)">
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="6"
                                                                    fill="#1c4595"
                                                                    fill-opacity="0.625"
                                                                >
                                                                    <animateTransform
                                                                        attributeName="transform"
                                                                        type="scale"
                                                                        begin="-0.4347826086956521s"
                                                                        values="1.5 1.5;1 1"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                    ></animateTransform>
                                                                    <animate
                                                                        attributeName="fill-opacity"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                        values="1;0"
                                                                        begin="-0.4347826086956521s"
                                                                    ></animate>
                                                                </circle>
                                                            </g>
                                                        </g>
                                                        <g transform="translate(20,50.00000000000001)">
                                                            <g transform="rotate(180)">
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="6"
                                                                    fill="#1c4595"
                                                                    fill-opacity="0.5"
                                                                >
                                                                    <animateTransform
                                                                        attributeName="transform"
                                                                        type="scale"
                                                                        begin="-0.3260869565217391s"
                                                                        values="1.5 1.5;1 1"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                    ></animateTransform>
                                                                    <animate
                                                                        attributeName="fill-opacity"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                        values="1;0"
                                                                        begin="-0.3260869565217391s"
                                                                    ></animate>
                                                                </circle>
                                                            </g>
                                                        </g>
                                                        <g transform="translate(28.78679656440357,28.786796564403577)">
                                                            <g transform="rotate(225)">
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="6"
                                                                    fill="#1c4595"
                                                                    fill-opacity="0.375"
                                                                >
                                                                    <animateTransform
                                                                        attributeName="transform"
                                                                        type="scale"
                                                                        begin="-0.21739130434782605s"
                                                                        values="1.5 1.5;1 1"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                    ></animateTransform>
                                                                    <animate
                                                                        attributeName="fill-opacity"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                        values="1;0"
                                                                        begin="-0.21739130434782605s"
                                                                    ></animate>
                                                                </circle>
                                                            </g>
                                                        </g>
                                                        <g transform="translate(49.99999999999999,20)">
                                                            <g transform="rotate(270)">
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="6"
                                                                    fill="#1c4595"
                                                                    fill-opacity="0.25"
                                                                >
                                                                    <animateTransform
                                                                        attributeName="transform"
                                                                        type="scale"
                                                                        begin="-0.10869565217391303s"
                                                                        values="1.5 1.5;1 1"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                    ></animateTransform>
                                                                    <animate
                                                                        attributeName="fill-opacity"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                        values="1;0"
                                                                        begin="-0.10869565217391303s"
                                                                    ></animate>
                                                                </circle>
                                                            </g>
                                                        </g>
                                                        <g transform="translate(71.21320343559643,28.78679656440357)">
                                                            <g transform="rotate(315)">
                                                                <circle
                                                                    cx="0"
                                                                    cy="0"
                                                                    r="6"
                                                                    fill="#1c4595"
                                                                    fill-opacity="0.125"
                                                                >
                                                                    <animateTransform
                                                                        attributeName="transform"
                                                                        type="scale"
                                                                        begin="0s"
                                                                        values="1.5 1.5;1 1"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                    ></animateTransform>
                                                                    <animate
                                                                        attributeName="fill-opacity"
                                                                        keyTimes="0;1"
                                                                        dur="0.8695652173913042s"
                                                                        repeatCount="indefinite"
                                                                        values="1;0"
                                                                        begin="0s"
                                                                    ></animate>
                                                                </circle>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                    Form is getting submitted, please wait...
                                                </span>
                                            </div>
                                            {formMessage && (
                                                <div
                                                    className="wpcf7-response-output"
                                                    aria-hidden="true"
                                                    style={{ color: "red" }}
                                                >
                                                    {formMessage}
                                                </div>
                                            )}
                                        </form>
                                    </Formik>
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
                            <a href="/" class="footer-logo">
                                <img src="https://app.innerspacedxb.com/wp-content/uploads/2021/10/logo-innerspace-black.svg"
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
export const data = graphql`
query MyQuery {
  wpPage(databaseId: {eq: 1128}) {
    id
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
}
`;