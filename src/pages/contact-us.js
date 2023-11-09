import React, { useEffect, useState } from "react";
import { graphql, navigate } from "gatsby";
import { useFormik, Formik } from "formik";
import axios from "axios";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { GatsbySeo } from "gatsby-plugin-next-seo";
import Layout from "../components/Layout";

import { getToken } from "../hooks/token";

const Contact = ({ data }) => {
  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;

  const [token, setToken] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [captchaExpression, setCaptchaExpression] = useState("");
  const [captchaResult, setCaptchaResult] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const page = data?.wpPage || [];
  const pageAcf = data?.wpPage?.contactUsLayout || [];
  const seo = data?.wpPage?.seo || [];

  // Get token
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
        url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/2142/`,
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
    } else if (values["your-city"] === "Select City") {
      errors["your-city"] = "Required";
    }
    if (!values["brand-dropdown"]) {
      errors["brand-dropdown"] = "Required";
    } else if (
      values["brand-dropdown"] === "What brand are you interested in?"
    ) {
      errors["brand-dropdown"] = "Required";
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
      "brand-dropdown": "",
      "how-can-help": "",
      captcha: "",
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      const bodyFormData = new FormData();
      bodyFormData.set("your-name", values["your-name"]);
      bodyFormData.set("your-email", values["your-email"]);
      bodyFormData.set("your-tel", values["your-tel"]);
      bodyFormData.set("your-city", values["your-city"]);
      bodyFormData.set("brand-dropdown", values["brand-dropdown"]);
      bodyFormData.set("how-can-help", values["how-can-help"]);
      bodyFormData.set("your-subject", "Enquiry Form");

      axios({
        method: "post",
        url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/2142/feedback`,
        data: bodyFormData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          formik.resetForm();
          if (response.data.status === "validation_failed") {
            console.log("Email sent Fail:", response.data);
            setFormMessage(response.data.message);
          } else if (response.data.status === "mail_sent") {
            console.log("Email sent successfully:", response.data);
            setFormMessage("");
            navigate("/enquiry-thank-you/");
          }
        })
        .catch((error) => console.error("Error sending email:", error));
    },
  });

  return (
    <>
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
      <Layout>
        {/* <Seo pageUrl={`${WEBSITE_URL}/contact-us/`}></Seo> */}
        <section class="header-image">
          {page && page.featuredImage.node ? (
            <div class="wrapper">
              <div class="holder">
                <img
                  src="<?php echo $featured_img_url ; ?>"
                  alt="<?php the_title(); ?>"
                />
                <GatsbyImage
                  image={getImage(page.featuredImage.node)}
                  alt={page.featuredImage.node}
                />
              </div>
            </div>
          ) : (
            <img
              src={`${MEDIA_URL}/img/room-type-header-img.jpg`}
              alt="Contact page"
            />
          )}
          <h1>{page.title}</h1>
        </section>

        <section class="main-content contact-us">
          <div class="container contact">
            {pageAcf && pageAcf.contactPageTopText ? (
              <span
                dangerouslySetInnerHTML={{ __html: pageAcf.contactPageTopText }}
              />
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

          {pageAcf && pageAcf.mapHtml && (
            <section class="innerspace-google-map">
              <span dangerouslySetInnerHTML={{ __html: pageAcf.mapHtml }} />
            </section>
          )}

          <section class="form-address">
            <div class="container">
              <div class="form-wrapper">
                {pageAcf && pageAcf.contactFormTitle && (
                  <span class="sec-title">{pageAcf.contactFormTitle}</span>
                )}

                {formFields && (
                  <>
                    <div className="form">
                      <div
                        className="wpcf7 no-js"
                        id="wpcf7-f2142-o1"
                        lang="en-US"
                        dir="ltr"
                      >
                        <Formik>
                          <form
                            className="wpcf7-form init"
                            onSubmit={formik.handleSubmit}
                          >
                            <div className="enquiry-wrapper">
                              {formFields.map((field, index) => {
                                let inputClass =
                                  "wpcf7-form-control wpcf7-text wpcf7-validates-as-required";
                                if (formik.errors[field.name]) {
                                  inputClass += " wpcf7-not-valid";
                                }

                                let inputElement;
                                if (
                                  field.basetype === "text" ||
                                  field.basetype === "tel" ||
                                  field.basetype === "email"
                                ) {
                                  inputElement = (
                                    <div
                                      className="row"
                                      key={`${index}${field.name}`}
                                    >
                                      <span className="wpcf7-form-control-wrap">
                                        <input
                                          className={inputClass}
                                          id={field.name}
                                          type={field.basetype}
                                          name={field.name}
                                          placeholder={field.raw_values[0]}
                                          value={formik.values[field.name]}
                                          onChange={formik.handleChange}
                                        />
                                      </span>
                                    </div>
                                  );
                                } else if (field.basetype === "select") {
                                  inputElement = (
                                    <div className="row">
                                      <span
                                        className="wpcf7-form-control-wrap"
                                        data-name="menu-710"
                                        key={`${index}select`}
                                      >
                                        <select
                                          id={field.name}
                                          name={field.name}
                                          value={formik.values[field.name]}
                                          onChange={formik.handleChange}
                                          className={
                                            formik.errors[field.name]
                                              ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                              : "wpcf7-form-control wpcf7-select"
                                          }
                                        >
                                          {field.raw_values.map(
                                            (option, index) => (
                                              <option
                                                key={`${index}${option}`}
                                                value={option}
                                              >
                                                {option}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </span>
                                    </div>
                                  );
                                }

                                return inputElement;
                              })}

                              {formFields.map((field, index) => {
                                switch (field.basetype) {
                                  case "textarea":
                                    return (
                                      <div
                                        className="row"
                                        key={`${index}${field.basetype}`}
                                      >
                                        <p>How can we help you?</p>
                                        <span
                                          className="wpcf7-form-control-wrap"
                                          data-name="worktogether"
                                        >
                                          <textarea
                                            id={field.name}
                                            name={field.name}
                                            placeholder={field.raw_values[0]}
                                            cols="40"
                                            rows="10"
                                            value={formik.values[field.name]}
                                            className="wpcf7-form-control wpcf7-textarea"
                                            onChange={formik.handleChange}
                                          ></textarea>
                                        </span>
                                      </div>
                                    );

                                  case "acceptance":
                                    return (
                                      <div
                                        className="row"
                                        key={`${index}acceptance`}
                                      >
                                        <input
                                          type="checkbox"
                                          name={field.name}
                                          checked={formik.values[field.name]}
                                          onChange={formik.handleChange}
                                        />
                                        {formik.errors[field.name] ? (
                                          <div className="text-xs text-red-500">
                                            {formik.errors[field.name]}
                                          </div>
                                        ) : null}
                                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                          I accept that Innerspace Trading LLC
                                          will contact me
                                        </label>
                                      </div>
                                    );
                                  default:
                                    return null;
                                }
                              })}

                              <>
                                <div
                                  className="captcha captcha-wrapper"
                                  style={{ display: "block" }}
                                  key="captcha"
                                >
                                  <p>
                                    <span className="wpcf7-form-control-wrap wpcaptcha-588"></span>
                                  </p>

                                  <span className="wpcf7-form-control-wrap wpcaptcha-531">
                                    Captcha* {captchaExpression}
                                    &nbsp;&nbsp;=&nbsp;&nbsp;{" "}
                                    <input
                                      className={
                                        formik.errors.captcha
                                          ? "c4wp_user_input_captcha wpcf7-select wpcf7-not-valid"
                                          : "c4wp_user_input_captcha"
                                      }
                                      id="captcha"
                                      type="text"
                                      name="captcha"
                                      style={{ width: 45 }}
                                      value={formik.values.captcha}
                                      onChange={formik.handleChange}
                                    />
                                  </span>
                                </div>
                                <div className="row">
                                  <input
                                    class="wpcf7-form-control wpcf7-submit has-spinner"
                                    type="submit"
                                    value="Submit"
                                  />
                                  <span className="wpcf7-spinner"></span>
                                </div>
                              </>
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
                  </>
                )}
              </div>

              <div class="contact-details">
                {pageAcf && pageAcf.showroomTitle && (
                  <span class="sec-title">{pageAcf.showroomTitle}</span>
                )}

                <div class="contact-details">
                  {pageAcf && pageAcf.contactDetails && (
                    <div
                      class="contact-wrapper"
                      dangerouslySetInnerHTML={{ __html: pageAcf.contactDetails }}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
export const data = graphql`
  query MyQuery {
    wpPage(databaseId: { eq: 33 }) {
      id
      title
      uri
      featuredImage {
        node {
          mediaItemUrl
          altText
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
      }
      contactUsLayout {
        contactDetails
        contactFormTitle
        contactPageTopText
        mapHtml
        showroomTitle
      }
    }
  }
`;
