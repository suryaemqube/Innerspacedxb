import React, { useEffect, useState, useRef } from "react";
import { graphql, navigate } from "gatsby";
import { useFormik, Formik } from "formik";
import axios from "axios";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Isotope from "isotope-layout";
import Seo from "../components/SeoMeta";

import Layout from "../components/Layout";
import { getToken } from "../hooks/token";
import { dashCase } from "../utils";

import scrubber from "../assets/img/scrubber-icon-1.svg";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const Identity = ({ pageContext, data, location }) => {
  const post = pageContext;

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(null);
  const sliderRef = useRef(null);

  const isotope = useRef();
  const teamMain = useRef(null);
  const teamContent = useRef(null);
  const teamContainer = useRef(null);
  const [tab, setTab] = useState();
  const [teamData, setTeamData] = useState(null);
  const [prevClickedTab, setPrevClickedTab] = useState({});
  const [PrevHeight, setPrevHeight] = useState(null);

  const [token, setToken] = useState("");
  const [careerFormFields, setCareerFormFields] = useState([]);
  const [careerCaptchaExpression, setCareerCaptchaExpression] = useState("");
  const [careerCaptchaResult, setCareerCaptchaResult] = useState("");
  const [careerFormMessage, setCareerFormMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileUrl2, setFileUrl2] = useState(null);
  const [fileError, setFileError] = useState("");
  const allowedExtensions = ["pdf", "docx", "doc"];
  const maxFileSize = 5 * 1024 * 1024;

  const identity = data?.ourstory || [];
  const ourTeam = data?.ourstory?.ourTeamLayout || [];

  const PAGELINK = post.pageUri;
  const PAGEID = post.pageId;

  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  const handleMouseDown = (e) => {
    const slider = sliderRef.current;
    const sliderRect = slider.getBoundingClientRect();
    setIsDown(true);
    slider.classList.add("active");
    setStartX(e.clientX - sliderRect.left);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseLeave = () => {
    const slider = sliderRef.current;
    setIsDown(false);
    slider.classList.remove("active");
  };

  const handleMouseUp = () => {
    const slider = sliderRef.current;
    setIsDown(false);
    slider.classList.remove("active");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    const slider = sliderRef.current;
    const sliderRect = slider.getBoundingClientRect();
    e.preventDefault();
    const x = e.clientX - sliderRect.left;
    const walk = (x - startX) * 3; // scroll-fast
    slider.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    if (PAGEID !== 15) return;
    if (typeof window !== undefined) {
      isotope.current = new Isotope(".member-list", {
        itemSelector: ".isotope-item",
        layoutMode: "fitRows",
      });
    }
    return () => isotope.current.destroy();
  }, []);

  useEffect(() => {
    if (PAGEID !== 15) return;
    const queryString =
      typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(queryString);
    const partner = params.get("partner") || "";

    if (partner) {
      const timeoutId = setTimeout(() => {
        var clickingElem = document.querySelector(`.${partner}`);
        clickingElem.children[0].click();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const scrollToElement = (element) => {
    setTimeout(() => {
      const scrollToContent = teamContent.current;
      scrollToContent.classList.add("colio-sec-exp");
    }, 200);

    setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const updateQueryStringParameter = (key, value) => {
    const baseUrl = [location.protocol, "//", location.host, location.pathname].join("");
    const urlQueryString = document.location.search;
    const newParam = key + "=" + value;
    const params = urlQueryString
      ? urlQueryString.replace(new RegExp("([?&])" + key + "[^&]*"), "$1" + newParam)
      : "?" + newParam;
  
    window.history.replaceState({}, "", baseUrl + (params === "?" ? "" : params));
  };

  function animateProperty(
    targetElement,
    property,
    startValue,
    targetValue,
    duration
  ) {
    var startTime = null;
    var start = parseFloat(startValue, 10);
    var target = parseFloat(targetValue, 10);
    function animationStep(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      var percentage = Math.min(progress, 1);
      const newValue = start + (target - start) * percentage;
      targetElement.style[property] = `${newValue}px`;
      if (percentage < 1) requestAnimationFrame(animationStep);
    }
    requestAnimationFrame(animationStep);
  }

  const handleTab = (e, row) => {
    e.preventDefault();
    setTeamData(row);

    const ulElem = e.target.closest("ul");
    const liElem = e.target.closest("li");
    const scrollToContent = teamContent.current;
    const teamContained = teamContainer.current;
    scrollToContent.classList.add("colio-sec-exp");

    const interval = setInterval(() => {
      if (teamContent.current !== null && teamMain.current !== null) {
        const ulDiem = ulElem.getBoundingClientRect();
        var teamMainHeight = teamMain.current.getBoundingClientRect().height;
        var contentHeight = teamMainHeight + teamMain.current.offsetTop * 2;
        setPrevHeight(contentHeight);
        clearInterval(interval);

        const teamContainerDiem = teamContained.getBoundingClientRect();
        const bodyScrollTop = teamContainerDiem.top;

        const liDiem = liElem.getBoundingClientRect();
        const cols = parseInt(ulDiem.width / liDiem.width);

        const clickedLi = Array.from(ulElem.children).indexOf(liElem);
        const clickedRow = parseInt(clickedLi / cols) + 1;

        const lastIndexInRow = clickedRow * cols;

        scrollToContent.style.visibility = "hidden";
        scrollToContent.style.height = "0px";
        scrollToContent.style.top = "0px";
        scrollToContent.style.transition = "unset";
        scrollToContent.classList.remove("colio-sec-exp");
        var valCorrection = contentHeight - PrevHeight;
        if (!ulElem.classList.contains("has-activated")) {
          ulElem.style.height = ulDiem.height + contentHeight + "px";
        } else {
          ulElem.style.height = ulDiem.height + valCorrection + "px";
        }

        Array.from(ulElem.children).forEach((element, index) => {
          const isLastElemInRow = lastIndexInRow >= index + 1;
          var elTopValue = parseFloat(element.style.top, 10);
          if (
            !ulElem.classList.contains("has-activated") &&
            prevClickedTab.clickedRow !== clickedRow
          ) {
            element.style.top = isLastElemInRow
              ? element.style.top
              : elTopValue + contentHeight + "px";
             
          } else {
            if (
              prevClickedTab.clickedRow < clickedRow &&
              index + 1 > prevClickedTab.clickedRow * cols &&
              index + 1 <= lastIndexInRow
            ) {
              element.style.top =
                elTopValue - contentHeight + valCorrection + "px";
                animateProperty(
                  element,
                  "top",
                  elTopValue,
                  elTopValue - contentHeight + valCorrection,
                300
                );
            } else if (
              prevClickedTab.clickedRow > clickedRow &&
              index + 1 > lastIndexInRow &&
              index + 1 <= prevClickedTab.clickedRow * cols
            ) {
              element.style.top = elTopValue + contentHeight + "px";
              animateProperty(
                element,
                "top",
                elTopValue,
                elTopValue + contentHeight,
              300
              );
            } else if (index + 1 > lastIndexInRow) {
              element.style.top = elTopValue + valCorrection + "px";
            }

            if (prevClickedTab.clickedRow === clickedRow) {
              scrollToContent.style.transition = "all 1s";
              scrollToContent.style.opacity = 0;
              setTimeout(function () {
                scrollToContent.style.opacity = 1;
              }, 400);
            }
          }

          if (index + 1 === clickedLi + 1) {
            const elementPos = element.getBoundingClientRect();
            const bodyTop = bodyScrollTop - elementPos.top - elementPos.height;
            console.log(bodyScrollTop, elementPos.top, elementPos.height)
            scrollToContent.style.top = Math.abs(bodyTop) - ((window.innerWidth < 767) ? 0:0 )+ "px";
          }
        });
        setTimeout(() => {
          scrollToContent.style.transition = "all 1s";
          scrollToContent.style.visibility = "visible";
          scrollToContent.style.position = "absolute";
          scrollToContent.style.overflow = "hidden";
          scrollToContent.style.height = `${contentHeight}px`;
        }, 300);
        ulElem.classList.add("has-activated");

        const dataUrl = liElem.getAttribute("data-url");
        updateQueryStringParameter("partner", dashCase(dataUrl));

        setTab(dataUrl);
        setPrevClickedTab({ clickedLi, clickedRow });
        if (scrollToContent) {
          scrollToElement(scrollToContent);
        }
      }
    }, 300);
  };

  const handleTabClose = (e, el) => {
    e.preventDefault();
    setTab("");
    const contentHeight = PrevHeight;

    const scrollToContent = teamContent.current;
    const teamContained = teamContainer.current;
    const teamContainerDiem = teamContained.getBoundingClientRect();
    const bodyScrollTop = teamContainerDiem.top;
    scrollToContent.style.transition = "all 1s";
    const ulElem = document.querySelector(".member-list");
    const ulDiem = ulElem.getBoundingClientRect();
    if (ulElem.classList.contains("has-activated")) {
      animateProperty(
        ulElem,
        "height",
        ulDiem.height,
        ulDiem.height - contentHeight,
        600
      );
    }
    ulElem.classList.remove("has-activated");

    const liElem = document.querySelector(".isotope-item");
    const liDiem = liElem.getBoundingClientRect();
    const cols = parseInt(ulDiem.width / liDiem.width);
    const clickedLi = prevClickedTab.clickedLi;
    const ClickedRow = parseInt(clickedLi / cols) + 1;
    const lastIndexInRow = ClickedRow * cols;

    Array.from(ulElem.children).forEach((element, index) => {
      const isLastElemInRow = lastIndexInRow >= index + 1;
      var elTopValue = parseFloat(element.style.top, 10);
      animateProperty(
        element,
        "top",
        element.style.top,
        isLastElemInRow ? element.style.top : elTopValue - contentHeight + "px",
        600
      );

      if (index + 1 === clickedLi + 1) {
        const elementPos = element.getBoundingClientRect();
        const bodyTop = bodyScrollTop - elementPos.top;
        scrollToContent.style.top =
          Math.abs(bodyTop - elementPos.height) + "px";
      }
    });

    scrollToContent.classList.remove("colio-sec-exp");
    scrollToContent.style.height = "0px";
    const ListSelector = document.querySelector(`.${el}`);
    setTimeout(() => {
      ListSelector.scrollIntoView({ behavior: "smooth" });
    }, 500);
    setPrevClickedTab({});
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = await getToken();
        setToken(fetchedToken);
      } catch (error) {}
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
      setCareerCaptchaExpression(expression);
      const result = operands[0] + operands[1]; // Calculate the result
      setCareerCaptchaResult(result.toString());
    };

    generateCaptcha();
  }, []);

  const short = (fileUrl) => {
    const originalURL = fileUrl;
    const desiredURL = originalURL.split("/wp-content")[1];
    return desiredURL;
  };

  useEffect(() => {
    if (token) {
      axios({
        method: "GET",
        url: `${WEBSITE_URL}/wp-json/contact-form-7/v1/contact-forms/286/`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          setCareerFormFields(response.data.properties.form.fields);
        })
        .catch((error) => console.error("Error", error));
    }
  }, [token]);

  const careerValidate = (values) => {
    values["cover-letter"] = fileUrl ? short(fileUrl) : null;
    values["curriculum-vite"] = fileUrl2 ? short(fileUrl2) : null;

    const errors = {};
    if (values["your-name"] === "") {
      errors["your-name"] = "Required";
    }
    if (values["your-email"] === "") {
      errors["your-email"] = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values["your-email"])
    ) {
      errors["your-email"] = "Invalid email address";
    }

    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (!urlPattern.test(values["url-844"])) {
      errors["url-844"] = "Invalid email address";
    }

    if (values["kitchen-interiors-experience"] === "") {
      errors["kitchen-interiors-experience"] = "Required";
    }

    if (values["your-experience"] === "") {
      errors["your-experience"] = "Required";
    }
    if (values["textarea-870"] === "") {
      errors["textarea-870"] = "Required";
    }

    if (!values["menu-56"]) {
      errors["menu-56"] = "Required";
    } else if (values["menu-56"] === "Select") {
      errors["menu-56"] = "Required";
    }

    if (values["text-887"] === "") {
      errors["text-887"] = "Required";
    }
    if (values["employers"] === "") {
      errors["employers"] = "Required";
    }

    if (values["cover-letter"] === "" || values["cover-letter"] === null) {
      errors["cover-letter"] = "Required";
    }
    if (
      values["curriculum-vite"] === "" ||
      values["curriculum-vite"] === null
    ) {
      errors["curriculum-vite"] = "Required";
    }

    if (values.captcha === "") {
      errors.captcha = "Required";
    } else if (values.captcha !== careerCaptchaResult) {
      errors.captcha = "Incorrect captcha result";
    }
    console.log("field eror", errors);

    return errors;
  };

  const formik2 = useFormik({
    initialValues: {
      "your-name": "",
      "your-email": "",
      "url-844": "",
      "kitchen-interiors-experience": "",
      "your-experience": "",
      "textarea-870": "",
      "menu-56": "",
      "text-887": "",
      employers: "",
      "cover-letter": "",
      "curriculum-vite": "",
      "your-subject": "",
      captcha: "",
    },
    validate: careerValidate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      const bodyFormData = new FormData();
      document.querySelector(".wpcf7-spinner-career").style.display =
        "inline-flex";
      bodyFormData.set("your-name", values["your-name"]);
      bodyFormData.set("your-email", values["your-email"]);
      bodyFormData.set("url-844", values["url-844"]);

      bodyFormData.set(
        "kitchen-interiors-experience",
        values["kitchen-interiors-experience"]
      );
      bodyFormData.set("your-experience", values["your-experience"]);

      bodyFormData.set("textarea-870", values["textarea-870"]);
      bodyFormData.set("menu-56", values["menu-56"]);
      bodyFormData.set("text-887", values["text-887"]);
      bodyFormData.set("employers", values["employers"]);
      bodyFormData.set("your-subject", "Career Form");

      bodyFormData.append("cover-letter", fileUrl ? short(fileUrl) : null);
      bodyFormData.append("curriculum-vite", fileUrl2 ? short(fileUrl2) : null);

      const buttonDisable = document.querySelector(".wpcf7-submit");
      buttonDisable.setAttribute("disabled", "disabled");
      buttonDisable.classList.add("button-disabled");

      axios({
        method: "post",
        url: `${WEBSITE_URL}/wp-json/custom/v1/send-email`,
        data: bodyFormData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          formik2.resetForm();
          console.log("mail: ", response.data);
          if (response.data.status === "validation_failed") {
            document.querySelector(".wpcf7-spinner-career").style.display =
              "none";
            buttonDisable.removeAttribute("disabled");
            setCareerFormMessage(response.data.message);
          } else if (response.data.status === "mail_sent") {
            navigate("/career-thank-you/");
            document.querySelector(".wpcf7-spinner-career").style.display =
              "none";
            buttonDisable.removeAttribute("disabled");

            setCareerFormMessage("");
          }
        })
        .catch((error) => console.error("Error sending email:", error));
    },
  });

  const handleFileChange = (event, selection) => {
    document.querySelector(
      `${selection ? ".cl-spinner" : ".cv-spinner"}`
    ).style.display = "block";
    const selectedFile = event.target.files[0];
    if (event.target && selectedFile) {
      // const parentNode = event.target.offsetParent;
      const fileName = selectedFile.name;
      const fileSize = selectedFile.size;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      if (fileSize > maxFileSize) {
        setFileError("File size exceeds the 5MB limit.");
        event.target.value = "";
        // parentNode.setAttribute("data-txt", "Upload the file");
        setFile(null);
        return;
      }

      if (!allowedExtensions.includes(fileExtension)) {
        setFileError("Invalid file format. Allowed formats: PDF, DOCX, DOC.");
        event.target.value = "";
        // parentNode.setAttribute("data-txt", "Upload the file");
        setFile(null);
        return;
      }
      setFile(selectedFile);

      // parentNode.setAttribute("data-txt", fileName);

      const formData = new FormData();
      formData.append("cover-letter", event.target.files[0]);
      formData.append("curriculum-vite", event.target.files[0]);

      axios({
        method: "POST",
        url: `${WEBSITE_URL}/wp-json/custom/v1/upload-media`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          document.querySelector(
            `${selection ? ".cl-spinner" : ".cv-spinner"}`
          ).style.display = "none";
          if (response.status === 200) {
            const data = response.data;
            selection ? setFileUrl(data.file_url) : setFileUrl2(data.file_url);
          } else {
            console.error("Error uploading file");
          }
        })
        .catch((error) => console.error("Error file upload on email:", error));
    }
  };
  return (
    <>
      <Layout>
        <section className="header-image">
          {identity && (
            <div className="wrapper">
              <div className="holder">
                <GatsbyImage
                  image={getImage(identity.featuredImage.node)}
                  alt={identity.title}
                  width={1920}
                  height={733}
                  loading="lazy"
                />
              </div>
            </div>
          )}
          <h1>{identity && identity.title}</h1>
        </section>

        <section className="main-content our-story">
          <div className="container about-innerspace">
            {identity || ourTeam ? (
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    PAGEID === 13
                      ? identity.ourStoryLayout.topText
                      : PAGEID === 15
                      ? ourTeam.teamTopText
                      : PAGEID === 17
                      ? identity.careerLayout.topCareerText
                      : "",
                }}
              />
            ) : (
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            )}
          </div>

          {identity && PAGEID === 13 && identity.ourStoryLayout.storyImg && (
            <section className="room-image">
              <GatsbyImage
                image={getImage(identity.ourStoryLayout.storyImg)}
                alt={identity.title}
                width={1920}
                height={429}
                loading="lazy"
              />
            </section>
          )}
          {PAGEID === 15 && ourTeam && (
            <section className="team-culture">
              <div className="container">
                <ul>
                  {ourTeam.teamCulture.map((culture, index) => (
                    <li key={index + "gdfsa"}>
                      <img
                        src={culture.cultureIcon.mediaItemUrl}
                        alt={culture.cultureIcon.altText}
                      />
                      <h3>{culture.cultureTitle}</h3>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: culture.cultureDesc,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
          {PAGEID === 13 && (
            <section className="milestones">
              <div className="contain">
                {identity && identity.ourStoryLayout.timelineText && (
                  <div
                    className="container about-innerspace"
                    dangerouslySetInnerHTML={{
                      __html: identity.ourStoryLayout.timelineText,
                    }}
                  />
                )}

                <div className="timeline-wrapper">
                  {identity &&
                    identity.ourStoryLayout.timelineList.length > 0 && (
                      <ul
                        ref={sliderRef}
                        className="timeline-wrap-scroll"
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                      >
                        {identity.ourStoryLayout.timelineList.map(
                          (timeLine, index) => (
                            <li key={index}>
                              <p>
                                <span className="timeline-year">
                                  {timeLine.topLevelYear}
                                </span>
                                <span
                                  className="timelie-info"
                                  dangerouslySetInnerHTML={{
                                    __html: timeLine.topLevelTimelineText,
                                  }}
                                />
                              </p>
                              <p>
                                <span className="timeline-year">
                                  {timeLine.bottomLevelYear}
                                </span>
                                <span
                                  className="timelie-info"
                                  dangerouslySetInnerHTML={{
                                    __html: timeLine.bottomLevelTimelineText,
                                  }}
                                />
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  <div className="scrubber-info">
                    <img src={scrubber} loading="lazy" alt="" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {PAGEID === 13 &&
            identity &&
            identity.ourStoryLayout.otherStoryText && (
              <div
                className="container about-innerspace"
                dangerouslySetInnerHTML={{
                  __html: identity.ourStoryLayout.otherStoryText,
                }}
              />
            )}
          {PAGEID === 17 && (
            <section className="career-form-wrapper">
              <div className="container">
                <div
                  className="wpcf7 js"
                  id="wpcf7-f286-o1"
                  lang="en-US"
                  dir="ltr"
                >
                  {careerFormFields && (
                    <Formik>
                      <form
                        className="wpcf7-form init"
                        aria-label="Contact form"
                        enctype="multipart/form-data"
                        novalidate="novalidate"
                        data-status="init"
                        onSubmit={formik2.handleSubmit}
                      >
                        <div className="career-form-wrapper">
                          <div className="row">
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="your-name"
                            >
                              {careerFormFields[0] && (
                                <input
                                  size="40"
                                  className={
                                    formik2.errors[careerFormFields[0].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  id={careerFormFields[0].name}
                                  type={careerFormFields[0].basetype}
                                  name={careerFormFields[0].name}
                                  placeholder={
                                    careerFormFields[0].raw_values[0]
                                  }
                                  value={
                                    formik2.values[careerFormFields[0].name]
                                  }
                                  onChange={formik2.handleChange}
                                />
                              )}
                            </span>
                          </div>
                          <div className="row">
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="your-email"
                            >
                              {careerFormFields[1] && (
                                <input
                                  size="40"
                                  className={
                                    formik2.errors[careerFormFields[1].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  id={careerFormFields[1].name}
                                  type={careerFormFields[1].basetype}
                                  name={careerFormFields[1].name}
                                  placeholder={
                                    careerFormFields[1].raw_values[0]
                                  }
                                  value={
                                    formik2.values[careerFormFields[1].name]
                                  }
                                  onChange={formik2.handleChange}
                                />
                              )}
                            </span>
                          </div>
                          <div className="row">
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="url-844"
                            >
                              {careerFormFields[2] && (
                                <input
                                  size="40"
                                  className={
                                    formik2.errors[careerFormFields[2].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  id={careerFormFields[2].name}
                                  type={careerFormFields[2].basetype}
                                  name={careerFormFields[2].name}
                                  placeholder={
                                    careerFormFields[2].raw_values[0]
                                  }
                                  value={
                                    formik2.values[careerFormFields[2].name]
                                  }
                                  onChange={formik2.handleChange}
                                />
                              )}
                            </span>
                          </div>
                          <div className="row">
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="kitchen-interiors-experience"
                            >
                              {careerFormFields[3] && (
                                <textarea
                                  cols="40"
                                  rows="10"
                                  className={
                                    formik2.errors[careerFormFields[3].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  aria-required="true"
                                  aria-invalid="false"
                                  placeholder={
                                    careerFormFields[3].raw_values[0]
                                  }
                                  name={careerFormFields[3].name}
                                  onChange={formik2.handleChange}
                                ></textarea>
                              )}
                            </span>
                          </div>
                          <div className="row">
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="your-experience"
                            >
                              {careerFormFields[4] && (
                                <input
                                  size="40"
                                  className={
                                    formik2.errors[careerFormFields[4].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  id={careerFormFields[4].name}
                                  type={careerFormFields[4].basetype}
                                  name={careerFormFields[4].name}
                                  placeholder={
                                    careerFormFields[4].raw_values[0]
                                  }
                                  value={
                                    formik2.values[careerFormFields[4].name]
                                  }
                                  onChange={formik2.handleChange}
                                />
                              )}
                            </span>
                          </div>
                          <div className="row">
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="textarea-870"
                            >
                              {careerFormFields[5] && (
                                <textarea
                                  cols="40"
                                  rows="10"
                                  className={
                                    formik2.errors[careerFormFields[5].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  aria-required="true"
                                  aria-invalid="false"
                                  placeholder={
                                    careerFormFields[5].raw_values[0]
                                  }
                                  name={careerFormFields[5].name}
                                  onChange={formik2.handleChange}
                                ></textarea>
                              )}
                            </span>
                          </div>
                          <div className="row">
                            <p>How did you hear about this role? (required) </p>
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="menu-56"
                            >
                              {careerFormFields[6] && (
                                <select
                                  id={careerFormFields[6].name}
                                  name={careerFormFields[6].name}
                                  value={
                                    formik2.values[careerFormFields[6].name]
                                  }
                                  onChange={formik2.handleChange}
                                  className={
                                    formik2.errors[careerFormFields[6].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-select"
                                  }
                                  aria-invalid="false"
                                >
                                  {careerFormFields[6].raw_values.map(
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
                            </span>
                          </div>
                          <div className="row">
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="text-887"
                            >
                              {careerFormFields[7] && (
                                <input
                                  size="40"
                                  className={
                                    formik2.errors[careerFormFields[7].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  id={careerFormFields[7].name}
                                  type={careerFormFields[7].basetype}
                                  name={careerFormFields[7].name}
                                  placeholder={
                                    careerFormFields[7].raw_values[0]
                                  }
                                  value={
                                    formik2.values[careerFormFields[7].name]
                                  }
                                  onChange={formik2.handleChange}
                                />
                              )}
                            </span>
                          </div>
                          <div className="row">
                            <span
                              className="wpcf7-form-control-wrap"
                              data-name="employers"
                            >
                              {careerFormFields[8] && (
                                <input
                                  size="40"
                                  className={
                                    formik2.errors[careerFormFields[8].name]
                                      ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                      : "wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                  }
                                  id={careerFormFields[8].name}
                                  type={careerFormFields[8].basetype}
                                  name={careerFormFields[8].name}
                                  placeholder={
                                    careerFormFields[8].raw_values[0]
                                  }
                                  value={
                                    formik2.values[careerFormFields[8].name]
                                  }
                                  onChange={formik2.handleChange}
                                />
                              )}
                            </span>
                          </div>
                          <div className="row">
                            <p style={{ marginBottom: "0px" }}>
                              Please attach your cover letter (required)
                            </p>
                            <p style={{ marginBottom: "0px" }}>
                              <span
                                className="wpcf7-form-control-wrap"
                                data-name="cover-letter"
                              >
                                {careerFormFields[9] && (
                                  <input
                                    size="40"
                                    type={careerFormFields[9].basetype}
                                    className={
                                      formik2.errors[careerFormFields[9].name]
                                        ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                        : "wpcf7-form-control wpcf7-file wpcf7-validates-as-required uploadCl"
                                    }
                                    id="uploadCl"
                                    accept=".pdf,.doc,.docx"
                                    aria-required="true"
                                    aria-invalid="false"
                                    value={formik2.values[fileUrl]}
                                    name={careerFormFields[9].name}
                                    onChange={(e) => handleFileChange(e, true)}
                                  />
                                )}
                              </span>
                            </p>
                            <p
                              className={`subtext ${fileError ? "error" : ""}`}
                            >
                              {fileError
                                ? fileError
                                : "File size:5mb, Accepted file types : .doc, .docx, .pdf"}
                            </p>
                            <span className="cl-spinner">
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
                            </span>
                          </div>
                          <div className="row">
                            <p>Please attach your CV (required)</p>
                            <p>
                              <span
                                className="wpcf7-form-control-wrap"
                                data-name="curriculum-vite"
                              >
                                {careerFormFields[10] && (
                                  <input
                                    size="40"
                                    type={careerFormFields[10].basetype}
                                    className={
                                      formik2.errors[careerFormFields[10].name]
                                        ? "wpcf7-form-control wpcf7-select wpcf7-not-valid"
                                        : "wpcf7-form-control wpcf7-file wpcf7-validates-as-required uploadCV"
                                    }
                                    id="uploadCV"
                                    accept=".pdf,.doc,.docx"
                                    aria-required="true"
                                    aria-invalid="false"
                                    value={formik2.values[fileUrl]}
                                    name={careerFormFields[10].name}
                                    onChange={(e) => handleFileChange(e, false)}
                                  />
                                )}
                              </span>
                            </p>
                            <p
                              className={`subtext ${fileError ? "error" : ""}`}
                            >
                              {fileError
                                ? fileError
                                : "File size:5mb, Accepted file types : .doc, .docx, .pdf"}
                            </p>
                            <span className="cv-spinner">
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
                            </span>
                          </div>
                          {formik2.values['cover-letter'] && formik2.values['curriculum-vite'] && formik2.values['employers'] && formik2.values['kitchen-interiors-experience'] && formik2.values['menu-56'] && formik2.values['text-887'] && formik2.values['textarea-870'] && formik2.values['url-844'] && formik2.values['your-email'] && formik2.values['your-experience'] && formik2.values['your-name'] &&
                          <div
                            className="captcha captcha-wrapper"
                            key="captcha"
                          >
                            <p>
                              <span className="wpcf7-form-control-wrap wpcaptcha-588"></span>
                            </p>

                            <span className="wpcf7-form-control-wrap wpcaptcha-531">
                              Captcha* {careerCaptchaExpression}
                              &nbsp;&nbsp;=&nbsp;&nbsp;
                              <input
                                className={
                                  formik2.errors.captcha
                                    ? "c4wp_user_input_captcha wpcf7-select wpcf7-not-valid"
                                    : "c4wp_user_input_captcha"
                                }
                                id="captcha"
                                type="text"
                                name="captcha"
                                style={{ width: 45 }}
                                value={formik2.values.captcha}
                                onChange={formik2.handleChange}
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
                            <span className="wpcf7-spinner-career">
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
                        {careerFormMessage && (
                          <div
                            className="wpcf7-response-output"
                            aria-hidden="true"
                            style={{ color: "red" }}
                          >
                            {careerFormMessage}
                          </div>
                        )}
                      </form>
                    </Formik>
                  )}
                </div>
              </div>
            </section>
          )}
        </section>

        {PAGEID === 15 && ourTeam && (
          <section className="team-main-wrapper">
            <div className="container">
              <section className=" teams-wrapper">
                <div className="contain">
                  <div
                    className="team-members-list clearfix"
                    ref={teamContainer}
                  >
                    <ul className="list member-list">
                      {ourTeam.firstRowMembers.length > 0 &&
                        ourTeam.firstRowMembers.map((row, index) => (
                          <li
                            key={`fdhdf` + index}
                            className={
                              "isotope-item " +
                              dashCase(row.memberName) +
                              " " +
                              row.designation +
                              ` ${row.memberName === tab ? "active1" : ""}`
                            }
                            data-url={row.memberName}
                            data-content={`#colio_c${index}`}
                          >
                            <a
                              className="colio-link"
                              href="#"
                              onClick={(e) => handleTab(e, row)}
                            >
                              <p className="member-info">
                                <span className="member-name">
                                  {row.memberName}
                                </span>
                                <span className="designation">
                                  {row.designation}
                                </span>
                              </p>
                              <div className="holder">
                                <GatsbyImage
                                  loading={"lazy"}
                                  image={getImage(row.photo)}
                                  alt={row.photo.altText}
                                />
                                {/* <img src="" alt="" /> */}
                              </div>
                            </a>
                          </li>
                        ))}
                      {typeof window !== "undefined" &&
                        window.innerWidth > 821 && (
                          <>
                            <li className="colio-item isotope-item"></li>
                            <li className="colio-item isotope-item"></li>
                            <li className="colio-item isotope-item"></li>
                          </>
                        )}

                      {ourTeam.secondRowMembers.length > 0 &&
                        ourTeam.secondRowMembers.map((row, index) => (
                          <li
                            key={`dfd` + index}
                            className={
                              "isotope-item " +
                              dashCase(row.memberName) +
                              " " +
                              row.designation +
                              ` ${row.memberName === tab ? "active1" : ""}`
                            }
                            data-url={row.memberName}
                            data-content={`#colio_c${index}`}
                          >
                            <a
                              className="colio-link"
                              href="#"
                              onClick={(e) => handleTab(e, row)}
                            >
                              <p className="member-info">
                                <span className="member-name">
                                  {row.memberName}
                                </span>
                                <span className="designation">
                                  {row.designation}
                                </span>
                              </p>
                              <div className="holder">
                                <GatsbyImage
                                  loading={"lazy"}
                                  image={getImage(row.photo)}
                                  alt={row.photo.altText}
                                />
                                {/* <img src="" alt="" /> */}
                              </div>
                            </a>
                          </li>
                        ))}

                      {ourTeam.thirdRowMembers.length > 0 &&
                        ourTeam.thirdRowMembers.map((row, index) => (
                          <li
                            key={`hrbsd` + index}
                            className={
                              "isotope-item " +
                              dashCase(row.memberName) +
                              " " +
                              row.designation +
                              ` ${row.memberName === tab ? "active1" : ""}`
                            }
                            data-url={row.memberName}
                            data-content={`#colio_c${index}`}
                          >
                            <a
                              className="colio-link"
                              href="#"
                              onClick={(e) => handleTab(e, row)}
                            >
                              <p className="member-info">
                                <span className="member-name">
                                  {row.memberName}
                                </span>
                                <span className="designation">
                                  {row.designation}
                                </span>
                              </p>
                              <div className="holder">
                                <GatsbyImage
                                  loading={"lazy"}
                                  image={getImage(row.photo)}
                                  alt={row.photo.altText}
                                />
                              </div>
                            </a>
                          </li>
                        ))}
                      {typeof window !== "undefined" &&
                        window.innerWidth > 821 && (
                          <li className="colio-item isotope-item"></li>
                        )}

                      {ourTeam.fourthRowMembers.length > 0 &&
                        ourTeam.fourthRowMembers.map((row, index) => (
                          <li
                            key={`dsdgf` + index}
                            className={
                              "isotope-item " +
                              dashCase(row.memberName) +
                              " " +
                              row.designation +
                              ` ${row.memberName === tab ? "active1" : ""}`
                            }
                            data-url={row.memberName}
                            data-content={`#colio_c${index}`}
                          >
                            <a
                              className="colio-link"
                              href="#"
                              onClick={(e) => handleTab(e, row)}
                            >
                              <p className="member-info">
                                <span className="member-name">
                                  {row.memberName}
                                </span>
                                <span className="designation">
                                  {row.designation}
                                </span>
                              </p>
                              <div className="holder">
                                <GatsbyImage
                                  loading={"lazy"}
                                  image={getImage(row.photo)}
                                  alt={row.photo.altText}
                                />
                              </div>
                            </a>
                          </li>
                        ))}
                      {typeof window !== "undefined" &&
                        window.innerWidth > 821 && (
                          <>
                            <li className="colio-item isotope-item"></li>
                            
                          </>
                        )}
                      {ourTeam.fifthRowMembers.length > 0 &&
                        ourTeam.fifthRowMembers.map((row, index) => (
                          <li
                            key={`mnvdg` + index}
                            className={
                              "isotope-item " +
                              dashCase(row.memberName) +
                              " " +
                              row.designation +
                              ` ${row.memberName === tab ? "active1" : ""}`
                            }
                            data-url={row.memberName}
                            data-content={`#colio_c${index}`}
                          >
                            <a
                              className="colio-link"
                              href="#"
                              onClick={(e) => handleTab(e, row)}
                            >
                              <p className="member-info">
                                <span className="member-name">
                                  {row.memberName}
                                </span>
                                <span className="designation">
                                  {row.designation}
                                </span>
                              </p>
                              <div className="holder">
                                <GatsbyImage
                                  loading={"lazy"}
                                  image={getImage(row.photo)}
                                  alt={row.photo.altText}
                                />
                                {/* <img src="" alt="" /> */}
                              </div>
                            </a>
                          </li>
                        ))}
                    </ul>
                    <section className="colio-sec" ref={teamContent}>
                      {teamData && (
                        <div
                          id="team-content"
                          className={`colio-content colio-member-content`}
                        >
                          <div className="main" ref={teamMain}>
                            <div className="left">
                              <div className="img-wrap">
                                <p className="member-info">
                                  <span className="member-name">
                                    {teamData.memberName}
                                  </span>
                                  <span className="designation">
                                    {teamData.designation}
                                  </span>
                                </p>
                                <div className="holder">
                                  <GatsbyImage
                                    loading={"lazy"}
                                    image={getImage(teamData.photo)}
                                    alt={teamData.photo.altText}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="right">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: removeTags(teamData.description),
                                }}
                              />
                            </div>
                          </div>
                          <a
                            class="colio-close"
                            href="#"
                            onClick={(e) =>
                              handleTabClose(e, dashCase(teamData.memberName))
                            }
                          >
                            <span>Close</span>
                          </a>
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </section>

              <section className="btm-team-wrapper">
                <ul className="list">
                  <li>
                    <img
                      src="https://app.innerspacedxb.com/wp-content/uploads/2024/04/warehouse-team-v1.webp"
                      alt="Warehouse team"
                    />
                    <p>Logistics Team</p>
                  </li>
                  <li>
                    <img
                      src="https://app.innerspacedxb.com/wp-content/uploads/2024/04/installation-team-v1.webp"
                      alt="Installation team"
                    />
                    <p>Installation Team</p>
                  </li>
                </ul>
              </section>
            </div>
          </section>
        )}
      </Layout>
    </>
  );
};

export default Identity;
export const Head = ({ data }) => (
  <Seo seoData={data?.ourstory?.seo || []} pageUrl={data?.ourstory?.uri}>
  </Seo>
)
export const data = graphql`
  query Mydata($pageId: Int!) {
    ourstory: wpPage(databaseId: { eq: $pageId }) {
      id
      title
      uri
      databaseId
      featuredImage {
        node {
          altText
          gatsbyImage(
            placeholder: BLURRED
            layout: CONSTRAINED
            width: 1920
            height: 733
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
      ourStoryLayout {
        topText
        storyImg {
          gatsbyImage(
            width: 1920
            height: 429
            layout: CONSTRAINED
            placeholder: BLURRED
          )
        }
        timelineText
        timelineList {
          topLevelYear
          topLevelTimelineText
          bottomLevelYear
          bottomLevelTimelineText
        }
        otherStoryText
      }
      ourTeamLayout {
        teamTopText
        teamCulture {
          cultureDesc
          cultureTitle
          cultureIcon {
            altText
            mediaItemUrl
          }
        }
        firstRowMembers {
          memberName
          designation
          description
          photo {
            gatsbyImage(
              layout: FIXED
              placeholder: BLURRED
              width: 788
              height: 788
            )
            altText
            mediaItemUrl
          }
        }
        secondRowMembers {
          memberName
          designation
          description
          photo {
            gatsbyImage(
              layout: FIXED
              placeholder: BLURRED
              width: 788
              height: 788
            )
            altText
            mediaItemUrl
          }
        }
        thirdRowMembers {
          memberName
          designation
          description
          photo {
            gatsbyImage(
              layout: FIXED
              placeholder: BLURRED
              width: 788
              height: 788
            )
            altText
            mediaItemUrl
          }
        }
        fourthRowMembers {
          memberName
          designation
          description
          photo {
            gatsbyImage(
              layout: FIXED
              placeholder: BLURRED
              width: 788
              height: 788
            )
            altText
            mediaItemUrl
          }
        }
        fifthRowMembers {
          memberName
          designation
          description
          photo {
            gatsbyImage(
              layout: FIXED
              placeholder: BLURRED
              width: 788
              height: 788
            )
            altText
            mediaItemUrl
          }
        }
      }
      careerLayout {
        topCareerText
      }
    }
  }
`;
