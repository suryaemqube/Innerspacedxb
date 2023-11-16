import React, { useEffect, useState } from "react";
import { Link, graphql, navigate } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { useFormik, Formik } from "formik";

import { getToken } from "../hooks/token";
import Layout from "../components/Layout";
import Breadcrumb from "../components/Breadcrumbs";

import "swiper/css/bundle";


const Portfolio = ({ data, pageContext }) => {
  SwiperCore.use([Pagination, Autoplay]);
  const { pageId, pageUri } = pageContext;
  const [token, setToken] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [captchaExpression, setCaptchaExpression] = useState("");
  const [captchaResult, setCaptchaResult] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const header = data?.wpPage?.lastChanceMainPageLayout || [];
  const lastChance = data?.wpLastChance || [];
  const lastChanceAcf = data?.wpLastChance.lastChanceSingularPage || [];
  const seo = data?.wpLastChance?.seo || [];

  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;

  let nf = new Intl.NumberFormat("en-US");

  const percentOff = (price, salePrice) => {
    return Math.ceil(((price - salePrice) / price) * 100);
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = await getToken();
        setToken(fetchedToken);
      } catch (error) {
        console.log("fail to fetch token lc:", error);
      }
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
        url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/1513/`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          setFormFields(response.data.properties.form.fields);
          console.log(response.data.properties.form.fields);
        })
        .catch((error) => console.error("Error", error));
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios({
        method: "GET",
        url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/1513/`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          setFormFields(response.data.properties.form.fields);
        })
        .catch((error) => console.error("Error", error));
    }
  }, [token]);

  const validate = (values) => {
    const errors = {};
    if (values["your-name"] === "") {
      errors["your-name"] = "Required";
    }
    if (values["your-number"] === "") {
      errors["your-number"] = "Required";
    }
    if (values["your-message"] === "") {
      errors["your-message"] = "Required";
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

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      "your-name": "",
      "your-number": "",
      "your-email": "",
      "your-message": "",
      "acceptance-684": "",
      captcha: "",
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log("values", values);
      document.querySelector(".wpcf7-spinner").style.display = "inline-flex";

      const buttonDisable = document.querySelector(".wpcf7-submit");
      buttonDisable.setAttribute("disabled", "disabled");
      buttonDisable.classList.add("button-disabled");

      const bodyFormData = new FormData();
      bodyFormData.set("your-name", values["your-name"]);
      bodyFormData.set("your-number", values["your-number"]);
      bodyFormData.set("yourName", values["yourName"]);
      bodyFormData.set("your-message", values["your-message"]);
      bodyFormData.set("your-email", values["your-email"]);
      bodyFormData.set("dynamic-title", lastChance && lastChance.title);
      bodyFormData.set(
        "dynamic-product",
        lastChance && lastChanceAcf.lastChanceProductId
      );
      bodyFormData.set(
        "dynamic-discount-price",
        lastChance && nf.format(lastChanceAcf.lastChanceDiscountPrice)
      );
      bodyFormData.set("dynamic-content", lastChance && lastChance.content);
      bodyFormData.set(
        "dynamic-condition",
        lastChance && lastChanceAcf.lastChanceCondition
      );
      bodyFormData.set("acceptance-684", values["acceptance-684"]);

      axios({
        method: "post",
        url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/1513/feedback`,
        data: bodyFormData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          formik.resetForm();
          document.querySelector(".wpcf7-spinner").style.display = "none";
          if (response.data.status === "validation_failed") {
            buttonDisable.removeAttribute("disabled");
            setFormMessage(response.data.message);
          } else if (response.data.status === "mail_sent") {
            navigate("/last-chance-thank-you/");
            buttonDisable.removeAttribute("disabled");
            setFormMessage("");
          }
        })
        .catch((error) => console.error("Error sending email:", error));
    },
  });
  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  return (
    <> <HelmetProvider>
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

      <Helmet bodyAttributes={{ class: "last-chance-detail" }}></Helmet>
    </HelmetProvider>
      <Layout>
        {/* <Seo
          pageUrl={`${WEBSITE_URL}${pageUri}`}
          bodyClass={"last-chance-detail"}
        ></Seo> */}

        <section class="header-image last-chance ">
          {header ? (
            <>
              <div class="wrapper">
                <div class="holder">
                  {header.lastChanceImageGallery ? (
                    <GatsbyImage
                      image={getImage(header.lastChanceImageGallery[0])}
                      alt={header.lastChanceImageGallery[0].altText}
                    />
                  ) : (
                    <img
                      src={`${MEDIA_URL}/images/featureimage2.jpg`}
                      alt={lastChance.title}
                    />
                  )}
                </div>
              </div>
              <div class="header-title">
                <div class="text-wrap">
                  <h2>Last Chance Luxury</h2>
                  <p>Gorgeous pieces priced at a steal</p>
                  {pageId && (
                    <div
                      className="breadcrumbs"
                      vocab="http://schema.org/"
                      typeof="BreadcrumbList"
                    >
                      <Breadcrumb postId={pageId} />
                    </div>
                  )}
                </div>
                <div class="cta">
                  <a class="enquire" href="/last-chance/">
                    Back
                  </a>
                </div>
              </div>
            </>
          ) : (
            <img
              src={`${MEDIA_URL}/images/featureimage2.jpg`}
              alt={lastChance.title}
            />
          )}
        </section>

        <section class="main-content contact-us">
          <div class="container">
            <div class="swiper-detail-wrapper">
              <div class="left-side">
                <div class="last-chance-gallery post-gallery" id="Gal">
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
                    class="swiper-container"
                    id="luxury-slider"
                  >
                    ';
                    {lastChanceAcf &&
                      lastChanceAcf.lastChancePostGallery.map((slide, index) => (
                        <SwiperSlide class="swiper-slide" key={`jkdvhkd` + index}>
                          <div class="wrapper">
                            <div class="holder">
                              <img src={slide.mediaItemUrl} alt={slide.altText} />
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    <div class="swiper-pagination"></div>
                  </Swiper>
                </div>
              </div>

              <div class="right-side">
                <div class="last-chance content contact">
                  <div id="lchance" class="stick">
                    <h2 dangerouslySetInnerHTML={{ __html: lastChance.title }} />
                    {lastChanceAcf && lastChanceAcf.lastChanceDiscountPrice ? (
                      <div class="prod-price">
                        <span class="disc-price">
                          AED {nf.format(lastChanceAcf.lastChanceDiscountPrice)}
                        </span>
                        <span class="og-price">
                          AED {nf.format(lastChanceAcf.lastChanceOriginalPrice)}
                        </span>
                        <span class="pct-disc">
                          {percentOff(
                            lastChanceAcf.lastChanceOriginalPrice,
                            lastChanceAcf.lastChanceDiscountPrice
                          )}
                          % OFF
                        </span>
                      </div>
                    ) : (
                      <div class="prod-price">
                        <span
                          style="text-decoration: none;font-weight:700;"
                          class="og-price no-sale"
                        >
                          AED {nf.format(lastChanceAcf.lastChanceOriginalPrice)}
                        </span>
                      </div>
                    )}
                    {lastChanceAcf && (
                      <div class="conditions">
                        <strong>Conditon:</strong>
                        {lastChanceAcf.lastChanceCondition}
                      </div>
                    )}{" "}
                  </div>
                  {lastChance && (
                    <div
                      class="last-chance content contact"
                      dangerouslySetInnerHTML={{ __html: lastChance.content }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div class="form-address">
              <h3>INQUIRE ABOUT THIS PIECE</h3>
              <p>
                Fill out your contact information below and a designer will get in
                touch with you.
              </p>
              <div class="form-wrapper">
                <div class="wpcf7 js" id="wpcf7-f1513-o1" lang="en-US" dir="ltr">
                  {formFields && (
                    <Formik>
                      <form
                        class="wpcf7-form init"
                        aria-label="Contact form"
                        novalidate="novalidate"
                        data-status="init"
                        onSubmit={formik.handleSubmit}
                      >
                        <div class="enquiry-wrapper">
                          <div class="row">
                            <span
                              class="wpcf7-form-control-wrap"
                              data-name="your-name"
                            >
                              {formFields[0] && (
                                <input
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
                            <span
                              class="wpcf7-form-control-wrap"
                              data-name="your-number"
                            >
                              {formFields[1] && (
                                <input
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
                            <span
                              class="wpcf7-form-control-wrap"
                              data-name="your-email"
                            >
                              {formFields[2] && (
                                <input
                                  className={
                                    formik.errors[formFields[2].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  id={formFields[2].name}
                                  type={formFields[2].basetype}
                                  name={formFields[2].name}
                                  placeholder={formFields[2].raw_values[0]}
                                  value={formik.values[formFields[2].name]}
                                  onChange={formik.handleChange}
                                />
                              )}
                            </span>
                          </div>
                          <div class="row">
                            <span
                              class="wpcf7-form-control-wrap"
                              data-name="your-message"
                            >
                              {formFields[3] && (
                                <textarea
                                  cols="40"
                                  rows="10"
                                  className={
                                    formik.errors[formFields[3].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  aria-required="true"
                                  aria-invalid="false"
                                  placeholder={formFields[3].raw_values[0]}
                                  name={formFields[3].name}
                                  onChange={formik.handleChange}
                                ></textarea>
                              )}
                            </span>
                          </div>
                          <div class="row acceptance-wrap">
                            <span
                              class="wpcf7-form-control-wrap"
                              data-name="acceptance-684"
                            >
                              <span class="wpcf7-form-control wpcf7-acceptance">
                                <span class="wpcf7-list-item">
                                  {formFields[4] && (
                                    <input
                                      type="checkbox"
                                      name={formFields[4].name}
                                      value="1"
                                      aria-invalid="false"
                                      onChange={formik.handleChange}
                                    />
                                  )}
                                </span>
                              </span>
                            </span>
                            <label>
                              I accept that Innerspace Trading LLC will contact me
                            </label>
                          </div>

                          <div class="captcha-wrap">
                            Captcha
                            <span class="wpcf7-form-control-wrap wpcaptcha-613">
                              {captchaExpression} =
                              <input
                                size="2"
                                maxlength="2"
                                className={
                                  formik.errors.captcha
                                    ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                    : "c4wp_user_input_captcha"
                                }
                                id="captcha"
                                aria-required="true"
                                type="text"
                                name="captcha"
                                value={formik.values.captcha}
                                onChange={formik.handleChange}
                              />
                            </span>
                          </div>
                          {lastChanceAcf && (
                            <div class="dynamic-fields">
                              <span
                                class="wpcf7-form-control-wrap dynamic-title"
                                data-name="dynamic-title"
                              >
                                <input
                                  type="hidden"
                                  name="dynamic-title"
                                  size="40"
                                  class="wpcf7-form-control wpcf7-hidden wpcf7dtx wpcf7dtx-hidden"
                                  aria-invalid="false"
                                  value={lastChance.title}
                                  autocomplete="off"
                                  onChange={formik.handleChange}
                                />
                              </span>
                              <span
                                class="wpcf7-form-control-wrap dynamic-product"
                                data-name="dynamic-product"
                              >
                                <input
                                  type="hidden"
                                  name="dynamic-product"
                                  size="40"
                                  class="wpcf7-form-control wpcf7-hidden wpcf7dtx wpcf7dtx-hidden"
                                  aria-invalid="false"
                                  value={lastChanceAcf.lastChanceProductId}
                                  autocomplete="off"
                                  onChange={formik.handleChange}
                                />
                              </span>
                              <span
                                class="wpcf7-form-control-wrap dynamic-discount-price"
                                data-name="dynamic-discount-price"
                              >
                                <input
                                  type="hidden"
                                  name="dynamic-discount-price"
                                  size="40"
                                  class="wpcf7-form-control wpcf7-hidden wpcf7dtx wpcf7dtx-hidden"
                                  aria-invalid="false"
                                  value={nf.format(
                                    lastChanceAcf.lastChanceDiscountPrice
                                  )}
                                  autocomplete="off"
                                  onChange={formik.handleChange}
                                />
                              </span>
                              <span
                                class="wpcf7-form-control-wrap dynamic-content"
                                data-name="dynamic-content"
                              >
                                <input
                                  type="hidden"
                                  name="dynamic-content"
                                  size="40"
                                  class="wpcf7-form-control wpcf7-hidden wpcf7dtx wpcf7dtx-hidden"
                                  aria-invalid="false"
                                  value={lastChance.content}
                                  autocomplete="off"
                                  onChange={formik.handleChange}
                                />
                              </span>
                              <span
                                class="wpcf7-form-control-wrap dynamic-condition"
                                data-name="dynamic-condition"
                              >
                                <input
                                  type="hidden"
                                  name="dynamic-condition"
                                  size="40"
                                  class="wpcf7-form-control wpcf7-hidden wpcf7dtx wpcf7dtx-hidden"
                                  aria-invalid="false"
                                  value={lastChanceAcf.lastChanceCondition}
                                  autocomplete="off"
                                  onChange={formik.handleChange}
                                />
                              </span>
                            </div>
                          )}
                          <div class="submit-btn">
                            <input
                              class="wpcf7-form-control wpcf7-submit has-spinner"
                              type="submit"
                              value="Send"
                              disabled=""
                            />
                            <span className="wpcf7-spinner">
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};
export const data = graphql`
  query MyQuery($pageId: Int!) {
    wpPage(databaseId: { eq: 1507 }) {
      id
      title
      databaseId
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
    wpLastChance(databaseId: { eq: $pageId }) {
      title
      content
      lastChanceSingularPage {
        lastChanceProductId
        lastChanceCondition
        lastChanceDiscountPrice
        lastChanceOriginalPrice
        lastChanceSoldOutSelect
        lastChancePostGallery {
          altText
          mediaItemUrl
          height
          width
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
  }
`;
export default Portfolio;
