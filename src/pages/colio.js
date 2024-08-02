import React, { useEffect, useState, useRef } from "react";
import { graphql, navigate } from "gatsby";
import { useFormik, Formik } from "formik";
import axios from "axios";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import Layout from "../components/Layout";
import { getToken } from "../hooks/token";
import Seo from "../components/SeoMeta";
import { dashCase } from '../utils';

import scrubber from "../assets/img/scrubber-icon-1.svg";


const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const Identity = ({ pageContext, data }) => {
    const post = pageContext;
    const [tab, setTab] = useState();
    const [teamData, setTeamData] = useState(null);
    const teamContent = useRef(null);

    const identity = data?.ourstory || [];
    const ourTeam = data?.ourstory?.ourTeamLayout || [];

    const seo = data?.ourstory?.seo || [];

    const PAGELINK = post.pageUri;
    const PAGEID = 15;

    function removeTags(str) {
        if (str === null || str === "") return false;
        else str = str.toString();
        return str.replace(/(<([^>]+)>)/gi, "");
    }

    const scrollToElement = (element) => {
        setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
        }, 200);
    };

    const handleTab = (e, row) => {
        e.preventDefault();
        const List = e.target.closest("ul");
        const listDiemenions = List.getBoundingClientRect();
        console.log("Diemenions: ", listDiemenions)

        const ListSelector = e.target.closest("li");
        const scrollToContent = teamContent.current;
        scrollToContent.classList.add("colio-sec-exp")
        const dataUrl = ListSelector.getAttribute("data-url");

        setTab(dataUrl);
        setTeamData(row);

        if (scrollToContent) {
            console.log("ScrollUP", scrollToContent);
            scrollToElement(scrollToContent);
        }
    };

    const handleTabClose = (e, el) => {
        e.preventDefault();
        setTab("");
        const scrollToContent = teamContent.current;
        scrollToContent.classList.remove("colio-sec-exp")
        console.log("tab: ", tab)
        const ListSelector = document.querySelector(`.${el}`);
        setTimeout(() => {
            ListSelector.scrollIntoView({ behavior: "smooth" });
        }, 500);
        // scrollToElement(ListSelector);
    };




    const short = (fileUrl) => {
        const originalURL = fileUrl;
        const desiredURL = originalURL.split("/wp-content")[1];
        return desiredURL;
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
                                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                nulla pariatur.
                            </p>
                        )}
                    </div>


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
                                                dangerouslySetInnerHTML={{ __html: culture.cultureDesc }}
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
                            </div>
                        </section>
                    )}
                </section>

                {PAGEID === 15 && ourTeam && (
                    <section className="team-main-wrapper">
                        <div className="container">
                            <section className=" teams-wrapper">
                                <div className="contain">
                                    <div className="team-members-list clearfix">
                                        <ul className="list member-list">
                                            {ourTeam.firstRowMembers.length > 0 &&
                                                ourTeam.firstRowMembers.map((row, index) => (
                                                    <li
                                                        key={`fdhdf` + index}
                                                        className={
                                                            dashCase(row.memberName) + " " +
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
                                            {typeof window !== "undefined" && window.innerWidth > 769 &&
                                                <>
                                                    <li className="colio-item isotope-item"></li>
                                                    <li className="colio-item isotope-item"></li>
                                                    <li className="colio-item isotope-item"></li>
                                                </>}

                                            {ourTeam.secondRowMembers.length > 0 &&
                                                ourTeam.secondRowMembers.map((row, index) => (
                                                    <li
                                                        key={`dfd` + index}
                                                        className={
                                                            dashCase(row.memberName) + " " +
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

                                            {ourTeam.thirdRowMembers.length > 0 &&
                                                ourTeam.thirdRowMembers.map((row, index) => (
                                                    <li
                                                        key={`hrbsd` + index}
                                                        className={
                                                            dashCase(row.memberName) + " " +
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
                                            {typeof window !== "undefined" && window.innerWidth > 769 &&
                                                <li className="colio-item isotope-item"></li>
                                            }

                                            {ourTeam.fourthRowMembers.length > 0 &&
                                                ourTeam.fourthRowMembers.map((row, index) => (
                                                    <li
                                                        key={`dsdgf` + index}
                                                        className={
                                                            dashCase(row.memberName) + " " +
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
                                            {typeof window !== "undefined" && window.innerWidth > 769 &&
                                                <li className="colio-item isotope-item"></li>
                                            }
                                            {/* {ourTeam.fifthRowMembers.length > 0 &&
                                                ourTeam.fifthRowMembers.map((row, index) => (
                                                    <li
                                                        key={`mnvdg` + index}
                                                        className={
                                                            dashCase(row.memberName) + " " +
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
                                                ))} */}
                                        </ul>
                                    </div>
                                </div>
                            </section >



                            {/* <div className="container"> */}
                            <section className="colio-sec" ref={teamContent}>
                                {teamData &&

                                    <div
                                        id="team-content"
                                        className={`colio-content colio-member-content`}
                                    >
                                        <div className="main">
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
                                            onClick={(e) => handleTabClose(e, dashCase(teamData.memberName))}
                                        >
                                            <span>Close</span>
                                        </a>
                                    </div>

                                }
                            </section>

                            <section className="btm-team-wrapper">
                                <ul className="list">
                                    <li>
                                        <img
                                            src="https://app.innerspacedxb.com/wp-content/uploads/2022/08/warehouse-team.jpg"
                                            alt="Warehouse team"
                                        />
                                        <p>Logistics Team</p>
                                    </li>
                                    <li>
                                        <img
                                            src="https://app.innerspacedxb.com/wp-content/uploads/2022/08/innerspace-installation-team.jpg"
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

export const data = graphql`
  query Mydata {
    ourstory: wpPage(databaseId: { eq: 15 }) {
      id
      title
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
    }
  }
`;
