import React, { useEffect, useState, lazy, Suspense } from "react";
import { graphql, navigate } from "gatsby";
import { useFormik, Formik } from "formik";
import axios from "axios";
import LazyLoad from "react-lazy-load";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Seo from "../components/SeoMeta";
import Layout from "../components/Layout";

import { getToken } from "../hooks/token";

const Map = lazy(() => import("../components/lazyload/ContactMap"))
const Contact = ({ data }) => {
  const WEBSITE_URL = process.env.GATSBY_BASE_URL;
  const MEDIA_URL = process.env.GATSBY_MEDIA_URL;
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [captchaExpression, setCaptchaExpression] = useState("");
  const [captchaResult, setCaptchaResult] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const page = data?.wpPage || [];
  const pageAcf = data?.wpPage?.contactUsLayout || [];


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
        url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/2586/`,
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
    // if (!values["brand-dropdown"]) {
    //   errors["brand-dropdown"] = "Required";
    // } else if (
    //   values["brand-dropdown"] === "What brand are you interested in?"
    // ) {
    //   errors["brand-dropdown"] = "Required";
    // }

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

    if (values["topic-sel"] === "") {
      errors["topic-sel"] = "Required";
    } else if (values["topic-sel"] === "What is the topic of your enquiry?") {
      errors["topic-sel"] = "Required";
    }

    if (values["topic-sel"] === "Job Application" && values["which-role"] === "") {
      console.log("Empty")
      errors["which-role"] = "Required";
    } else if (values["which-role"] === "What kind of role would you like to apply for?") {
      errors["which-role"] = "Required";
      console.log("Select other option")
    }
    if (values["topic-sel"] === "Job Application") {
      formik.setFieldValue("project-location", '');
    } else if (values["topic-sel"] === "New Kitchen Design") {
      formik.setFieldValue("which-role", '');
    }else{
      formik.setFieldValue("project-location", '');
      formik.setFieldValue("which-role", '');
    }

    if (values["topic-sel"] === "New Kitchen Design" && values["project-location"] === "") {
      errors["project-location"] = "Required";
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
      // "brand-dropdown": "",
      "topic-sel": "",
      "which-role": "",
      "project-location": "",
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
      // bodyFormData.set("brand-dropdown", values["brand-dropdown"]);
      bodyFormData.set("topic-sel", values["topic-sel"]);
      bodyFormData.set("which-role", values["which-role"]);
      bodyFormData.set("project-location", values["project-location"]);
      bodyFormData.set("how-can-help", values["how-can-help"]);
      // bodyFormData.set("your-subject", "Enquiry Form");

      axios({
        method: "post",
        url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/2586/feedback`,
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
    <Layout>
      {/* <Seo pageUrl={`${WEBSITE_URL}/contact-us/`}></Seo> */}
      <section className="header-image">
        {page && page.featuredImage.node ? (
          <div className="wrapper">
            <div className="holder">
              {typeof window !== "undefined" &&
                window.innerWidth > 767 && (
                  <GatsbyImage
                    image={getImage(page.featuredImage.node)}
                    alt={page.featuredImage.node}
                  />
                )}

              {typeof window !== "undefined" &&
                window.innerWidth < 767 && (
                  <GatsbyImage
                    image={getImage(page.mobileImages.mobileHeaderImage)}
                    alt={page.mobileImages.mobileHeaderImage.altText}
                  />
                )}

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

      <section className="main-content contact-us">
        <div className="container contact">
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
        <section className="innerspace-google-map" id="visit-showroom">
        {!isLoaded && <div>Loading...</div>}
        <LazyLoad offset={100} onContentVisible={() => setIsLoaded(true)}>
          <Suspense
            fallback={() => {
              setIsLoaded(true);
            }}
          >
            <Map pageAcf={pageAcf} />
          </Suspense>
        </LazyLoad>
        </section>

        <section className="form-address">
          <div className="container">
            <div className="form-wrapper">
              {pageAcf && pageAcf.contactFormTitle && (
                <span className="sec-title">{pageAcf.contactFormTitle}</span>
              )}

              {formFields && (
                <>
                  <div className="form">
                    <div
                      className="wpcf7 no-js"
                      id="wpcf7-f317-o1"
                      lang="en-US"
                      dir="ltr"
                    >
                      <Formik>
                        <form
                          className="wpcf7-form init"
                          onSubmit={formik.handleSubmit}
                        >
                          <div className="enquiry-wrapper">
                            {formFields[0] &&
                              <>
                                <div className="row">
                                  <span className="wpcf7-form-control-wrap">
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
                                  </span>
                                </div>


                                <div
                                  className="row"
                                >
                                  <span className="wpcf7-form-control-wrap">
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
                                  </span>
                                </div>

                                <div className="row">
                                  <span
                                    className="wpcf7-form-control-wrap"
                                    data-name="menu-710"
                                  >
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
                                    >
                                      {formFields[2].raw_values.map(
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


                                <div
                                  className="row"
                                >
                                  <span className="wpcf7-form-control-wrap">
                                    <input
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
                                  </span>
                                </div>


                               {/* <div className="row">
                                  <span
                                    className="wpcf7-form-control-wrap"
                                    data-name="menu-710"
                                  >
                                    <select
                                      id={formFields[4].name}
                                      name={formFields[4].name}
                                      value={formik.values[formFields[4].name]}
                                      onChange={formik.handleChange}
                                      className={
                                        formik.errors[formFields[4].name]
                                          ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                          : "wpcf7-form-control wpcf7-select"
                                      }
                                    >
                                      {formFields[4].raw_values.map(
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
                                */}

                                <div className="row">
                                  <span
                                    className="wpcf7-form-control-wrap"
                                    data-name="menu-7101"
                                  >
                                    <select
                                      id={formFields[4].name}
                                      name={formFields[4].name}
                                      value={formik.values[formFields[4].name]}
                                      onChange={formik.handleChange}
                                      className={
                                        formik.errors[formFields[4].name]
                                          ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                          : "wpcf7-form-control wpcf7-select"
                                      }
                                    >
                                      {formFields[4].raw_values.map(
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

                                {formik.values['topic-sel'] === "Job Application" &&
                                  <div className="row">
                                    <span
                                      className="wpcf7-form-control-wrap"
                                      data-name="menu-710"
                                    >
                                      <select
                                        id={formFields[5].name}
                                        name={formFields[5].name}
                                        value={formik.values[formFields[5].name]}
                                        onChange={formik.handleChange}
                                        className={
                                          formik.errors[formFields[5].name]
                                            ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                            : "wpcf7-form-control wpcf7-select"
                                        }
                                      >
                                        {formFields[5].raw_values.map(
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
                                }


                                {formik.values['topic-sel'] === "New Kitchen Design" &&
                                  <div
                                  className="row"
                                >
                                  <span className="wpcf7-form-control-wrap">
                                    <input
                                      className={
                                        formik.errors[formFields[6].name]
                                          ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                          : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                      }
                                      id={formFields[6].name}
                                      type={formFields[6].basetype}
                                      name={formFields[6].name}
                                      placeholder={formFields[6].raw_values[0]}
                                      value={formik.values[formFields[6].name]}
                                      onChange={formik.handleChange}
                                    />
                                  </span>
                                </div>
                                }


                                <div className="row">
                                  {/* <p>How can we help you?</p> */}
                                  <span
                                    className="wpcf7-form-control-wrap"
                                    data-name="worktogether"
                                  >
                                    <textarea
                                      id={formFields[7].name}
                                      name={formFields[7].name}
                                      placeholder={formFields[7].raw_values[0]}
                                      cols="40"
                                      rows="10"
                                      value={formik.values[formFields[7].name]}
                                      className={
                                        formik.errors[formFields[7].name]
                                          ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                          : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                      }
                                      onChange={formik.handleChange}
                                    ></textarea>
                                  </span>
                                </div>
                              </>
                            }

                            {formik.values['your-name'] && formik.values['your-email'] && formik.values['your-tel'] && formik.values['how-can-help'] &&  formik.values['topic-sel'] &&
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
                            }
                            <div className="row">
                              <input
                                className="wpcf7-form-control wpcf7-submit has-spinner"
                                type="submit"
                                value="Submit"
                              />
                              <span className="wpcf7-spinner"></span>
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
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="contact-details">
              {pageAcf && pageAcf.showroomTitle && (
                <span className="sec-title">{pageAcf.showroomTitle}</span>
              )}

              <div className="contact-details">
                {pageAcf && pageAcf.contactDetails && (
                  <div
                    className="contact-wrapper"
                    dangerouslySetInnerHTML={{ __html: pageAcf.contactDetails }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default Contact;
export const Head = ({ data }) => (
  <Seo seoData={data?.wpPage?.seo || []}>
  </Seo>
)
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
      schema {
        raw
      }
    }
      contactUsLayout {
        contactDetails
        contactFormTitle
        contactPageTopText
        mapHtml
        showroomTitle
      }
      mobileImages{
        mobileHeaderImage{
          mediaItemUrl
          altText
          gatsbyImage(
            height: 400
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 767
          )
        }
      }
    }
  }
`;
