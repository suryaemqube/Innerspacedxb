// import React, { useState, useEffect, useRef } from "react";
// import { graphql, } from "gatsby";
// import { GatsbyImage, getImage } from "gatsby-plugin-image";
// import Isotope from "isotope-layout";
// import Layout from "../components/Layout";
// import Seo from "../components/SeoMeta";

// import scrubber from "../assets/img/scrubber-icon-1.svg";

// import iconClose from "../assets/img/icon-close.svg";

// const WEBSITE_URL = process.env.GATSBY_BASE_URL;

// const Identity = ({ data }) => {

//     const [tab, setTab] = useState();



//     const identity = data?.ourstory || [];
//     const ourTeam = data?.ourstory?.ourTeamLayout || [];

//     const PAGEID = 15;

//     function removeTags(str) {
//         if (str === null || str === "") return false;
//         else str = str.toString();
//         return str.replace(/(<([^>]+)>)/gi, "");
//     }

//     const isotope = React.useRef()
//     const [filterKey, setFilterKey] = React.useState('*')




//     const scrollToElement = (element) => {
//         setTimeout(() => {
//             element.scrollIntoView({ behavior: "smooth" });
//         }, 300);
//     };

//     const handleTab = (e) => {
//         e.preventDefault();
//         const ListSelector = e.target.closest("li");
//         const dataUrl = ListSelector.getAttribute("data-url");
//         setTab(dataUrl);
//         scrollToElement(ListSelector.children[1]);
//     };

//     const handleTabClose = (e) => {
//         e.preventDefault();
//         setTab("");
//         const ListSelector = e.target.closest("li");
//         scrollToElement(ListSelector.children[0]);
//     };

//     // useEffect(() => {
//     //     var grid = document.querySelector('.member-list');
//     //     var iso = new Isotope(grid, {
//     //         // options...
//     //         itemSelector: '.member-item',
//     //         masonry: {
//     //             columnWidth: 200
//     //         }
//     //     });
//     //     console.log(grid)
//     // }, []);

//     useEffect(() => {
//         isotope.current = new Isotope('.member-list', {
//             itemSelector: '.member-item',
//             layoutMode: 'fitRows',
//             filter: "*"
//         })
//         // cleanup
//         return () => isotope.current.destroy()
//     }, [])


//     return (
//         <Layout>
//             <Seo
//                 pageUrl={`${WEBSITE_URL}`}
//                 bodyClass={`${PAGEID === 17 ? "page-template-tp-careers" : ""}`}
//             />
//             <section className="header-image">
//                 {identity && (
//                     <div className="wrapper">
//                         <div className="holder">
//                             <GatsbyImage
//                                 image={getImage(identity.featuredImage.node)}
//                                 alt={identity.title}
//                                 width={1920}
//                                 height={733}
//                                 loading="lazy"
//                             />
//                         </div>
//                     </div>
//                 )}
//                 <h1>{identity && identity.title}</h1>
//             </section>


//             {PAGEID === 15 && ourTeam && (
//                 <section className="team-main-wrapper">
//                     <div className="container">
//                         <section className=" teams-wrapper">
//                             <div className="contain">
//                                 <div className="team-members-list clearfix">
//                                     <ul className="list member-list">
//                                         {ourTeam.firstRowMembers.length > 0 &&
//                                             ourTeam.firstRowMembers.map((row, index) => (
//                                                 <li
//                                                     key={`fdhdf` + index}
//                                                     className={"member-item " +
//                                                         row.designation +
//                                                         ` ${row.memberName === tab ? "active" : ""}`
//                                                     }
//                                                     data-url={row.memberName}
//                                                     data-content={`#colio_c${index}`}
//                                                 >
//                                                     <a
//                                                         className="colio-link"
//                                                         href="#"
//                                                         onClick={handleTab}
//                                                     >
//                                                         <p className="member-info">
//                                                             <span className="member-name">
//                                                                 {row.memberName}
//                                                             </span>
//                                                             <span className="designation">
//                                                                 {row.designation}
//                                                             </span>
//                                                         </p>
//                                                         <div className="holder">
//                                                             <GatsbyImage
//                                                                 loading={"lazy"}
//                                                                 image={getImage(row.photo)}
//                                                                 alt={row.photo.altText}
//                                                             />
//                                                             {/* <img src="" alt="" /> */}
//                                                         </div>
//                                                     </a>

//                                                     <div
//                                                         class={`colio ${row.memberName === tab ? "colio-expanded" : ""
//                                                             } `}
//                                                         id={`hacker_member`}
//                                                     >
//                                                         <div class="colio-container">
//                                                             <div
//                                                                 id={`#colio_c${index}`}
//                                                                 className={`colio-content colio-member-content ${row.memberName === tab
//                                                                     ? "tabOpen"
//                                                                     : "tabClose"
//                                                                     }`}
//                                                             >
//                                                                 <div className="main">
//                                                                     <div className="left">
//                                                                         <div className="img-wrap">
//                                                                             <p className="member-info">
//                                                                                 <span className="member-name">
//                                                                                     {row.memberName}
//                                                                                 </span>
//                                                                                 <span className="designation">
//                                                                                     {row.designation}
//                                                                                 </span>
//                                                                             </p>
//                                                                             <div className="holder">
//                                                                                 <GatsbyImage
//                                                                                     loading={"lazy"}
//                                                                                     image={getImage(row.photo)}
//                                                                                     alt={row.photo.altText}
//                                                                                 />
//                                                                                 {/* <img src="" alt="" /> */}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="right">
//                                                                         <p
//                                                                             dangerouslySetInnerHTML={{
//                                                                                 __html: removeTags(row.description),
//                                                                             }}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <a
//                                                                     class="colio-close"
//                                                                     href="#"
//                                                                     onClick={handleTabClose}
//                                                                 >
//                                                                     <span>Close</span>
//                                                                 </a>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </li>
//                                             ))}
//                                         <li className="member-item colio-item isotope-item"></li>
//                                         <li className="member-item colio-item isotope-item"></li>
//                                         <li className="member-item colio-item isotope-item"></li>

//                                         {ourTeam.secondRowMembers.length > 0 &&
//                                             ourTeam.secondRowMembers.map((row, index) => (
//                                                 <li
//                                                     key={`dfd` + index}
//                                                     className={"member-item " +
//                                                         row.designation +
//                                                         ` ${row.memberName === tab ? "active" : ""}`
//                                                     }
//                                                     data-url={row.memberName}
//                                                     data-content={`#colio_c${index}`}
//                                                 >
//                                                     <a
//                                                         className="colio-link"
//                                                         href="#"
//                                                         onClick={handleTab}
//                                                     >
//                                                         <p className="member-info">
//                                                             <span className="member-name">
//                                                                 {row.memberName}
//                                                             </span>
//                                                             <span className="designation">
//                                                                 {row.designation}
//                                                             </span>
//                                                         </p>
//                                                         <div className="holder">
//                                                             <GatsbyImage
//                                                                 loading={"lazy"}
//                                                                 image={getImage(row.photo)}
//                                                                 alt={row.photo.altText}
//                                                             />
//                                                             {/* <img src="" alt="" /> */}
//                                                         </div>
//                                                     </a>
//                                                     <div
//                                                         class={`colio ${row.memberName === tab ? "colio-expanded" : ""
//                                                             } `}
//                                                         id={`hacker_member`}
//                                                     >
//                                                         <div class="colio-container">
//                                                             <div
//                                                                 id={`#colio_c${index}`}
//                                                                 className={`colio-content colio-member-content   ${row.memberName === tab
//                                                                     ? "tabOpen"
//                                                                     : "tabClose"
//                                                                     }`}
//                                                             >
//                                                                 <div className="main">
//                                                                     <div className="left">
//                                                                         <div className="img-wrap">
//                                                                             <p className="member-info">
//                                                                                 <span className="member-name">
//                                                                                     {row.memberName}
//                                                                                 </span>
//                                                                                 <span className="designation">
//                                                                                     {row.designation}
//                                                                                 </span>
//                                                                             </p>
//                                                                             <div className="holder">
//                                                                                 <GatsbyImage
//                                                                                     loading={"lazy"}
//                                                                                     image={getImage(row.photo)}
//                                                                                     alt={row.photo.altText}
//                                                                                 />
//                                                                                 {/* <img src="" alt="" /> */}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="right">
//                                                                         <p
//                                                                             dangerouslySetInnerHTML={{
//                                                                                 __html: removeTags(row.description),
//                                                                             }}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <a
//                                                                     class="colio-close"
//                                                                     href="#"
//                                                                     onClick={handleTabClose}
//                                                                 >
//                                                                     <span>Close</span>
//                                                                 </a>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </li>
//                                             ))}

//                                         {ourTeam.thirdRowMembers.length > 0 &&
//                                             ourTeam.thirdRowMembers.map((row, index) => (
//                                                 <li
//                                                     key={`hrbsd` + index}
//                                                     className={"member-item " +

//                                                         row.designation +
//                                                         ` ${row.memberName === tab ? "active" : ""}`
//                                                     }
//                                                     data-url={row.memberName}
//                                                     data-content={`#colio_c${index}`}
//                                                 >
//                                                     <a
//                                                         className="colio-link"
//                                                         href="#"
//                                                         onClick={handleTab}
//                                                     >
//                                                         <p className="member-info">
//                                                             <span className="member-name">
//                                                                 {row.memberName}
//                                                             </span>
//                                                             <span className="designation">
//                                                                 {row.designation}
//                                                             </span>
//                                                         </p>
//                                                         <div className="holder">
//                                                             <GatsbyImage
//                                                                 loading={"lazy"}
//                                                                 image={getImage(row.photo)}
//                                                                 alt={row.photo.altText}
//                                                             />
//                                                             {/* <img src="" alt="" /> */}
//                                                         </div>
//                                                     </a>
//                                                     <div
//                                                         class={`colio ${row.memberName === tab ? "colio-expanded" : ""
//                                                             } `}
//                                                         id="hacker_member"
//                                                     >
//                                                         <div class="colio-container">
//                                                             <div
//                                                                 id={`#colio_c${index}`}
//                                                                 className={`colio-content colio-member-content ${row.memberName === tab
//                                                                     ? "tabOpen"
//                                                                     : "tabClose"
//                                                                     }`}
//                                                             >
//                                                                 <div className="main">
//                                                                     <div className="left">
//                                                                         <div className="img-wrap">
//                                                                             <p className="member-info">
//                                                                                 <span className="member-name">
//                                                                                     {row.memberName}
//                                                                                 </span>
//                                                                                 <span className="designation">
//                                                                                     {row.designation}
//                                                                                 </span>
//                                                                             </p>
//                                                                             <div className="holder">
//                                                                                 <GatsbyImage
//                                                                                     loading={"lazy"}
//                                                                                     image={getImage(row.photo)}
//                                                                                     alt={row.photo.altText}
//                                                                                 />
//                                                                                 {/* <img src="" alt="" /> */}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="right">
//                                                                         <p
//                                                                             dangerouslySetInnerHTML={{
//                                                                                 __html: removeTags(row.description),
//                                                                             }}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <a
//                                                                     class="colio-close"
//                                                                     href="#"
//                                                                     onClick={handleTabClose}
//                                                                 >
//                                                                     <span>Close</span>
//                                                                 </a>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </li>
//                                             ))}
//                                         <li className="member-item colio-item isotope-item"></li>

//                                         {ourTeam.fourthRowMembers.length > 0 &&
//                                             ourTeam.fourthRowMembers.map((row, index) => (
//                                                 <li
//                                                     key={`dsdgf` + index}
//                                                     className={"member-item " +

//                                                         row.designation +
//                                                         ` ${row.memberName === tab ? "active" : ""}`
//                                                     }
//                                                     data-url={row.memberName}
//                                                     data-content={`#colio_c${index}`}
//                                                 >
//                                                     <a
//                                                         className="colio-link"
//                                                         href="#"
//                                                         onClick={handleTab}
//                                                     >
//                                                         <p className="member-info">
//                                                             <span className="member-name">
//                                                                 {row.memberName}
//                                                             </span>
//                                                             <span className="designation">
//                                                                 {row.designation}
//                                                             </span>
//                                                         </p>
//                                                         <div className="holder">
//                                                             <GatsbyImage
//                                                                 loading={"lazy"}
//                                                                 image={getImage(row.photo)}
//                                                                 alt={row.photo.altText}
//                                                             />
//                                                             {/* <img src="" alt="" /> */}
//                                                         </div>
//                                                     </a>
//                                                     <div
//                                                         class={`colio ${row.memberName === tab ? "colio-expanded" : ""
//                                                             } `}
//                                                         id="hacker_member"
//                                                     >
//                                                         <div class="colio-container">
//                                                             <div
//                                                                 id={`#colio_c${index}`}
//                                                                 className={`colio-content colio-member-content ${row.memberName === tab
//                                                                     ? "tabOpen"
//                                                                     : "tabClose"
//                                                                     }`}
//                                                             >
//                                                                 <div className="main">
//                                                                     <div className="left">
//                                                                         <div className="img-wrap">
//                                                                             <p className="member-info">
//                                                                                 <span className="member-name">
//                                                                                     {row.memberName}
//                                                                                 </span>
//                                                                                 <span className="designation">
//                                                                                     {row.designation}
//                                                                                 </span>
//                                                                             </p>
//                                                                             <div className="holder">
//                                                                                 <GatsbyImage
//                                                                                     loading={"lazy"}
//                                                                                     image={getImage(row.photo)}
//                                                                                     alt={row.photo.altText}
//                                                                                 />
//                                                                                 {/* <img src="" alt="" /> */}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="right">
//                                                                         <p
//                                                                             dangerouslySetInnerHTML={{
//                                                                                 __html: removeTags(row.description),
//                                                                             }}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <a
//                                                                     class="colio-close"
//                                                                     href="#"
//                                                                     onClick={handleTabClose}
//                                                                 >
//                                                                     <span>Close</span>
//                                                                 </a>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </li>
//                                             ))}
//                                         <li className="member-item colio-item isotope-item"></li>
//                                         {ourTeam.fifthRowMembers.length > 0 &&
//                                             ourTeam.fifthRowMembers.map((row, index) => (
//                                                 <li
//                                                     key={`mnvdg` + index}
//                                                     className={"member-item " +

//                                                         row.designation +
//                                                         ` ${row.memberName === tab ? "active" : ""}`
//                                                     }
//                                                     data-url={row.memberName}
//                                                     data-content={`#colio_c${index}`}
//                                                 >
//                                                     <a
//                                                         className="colio-link"
//                                                         href="#"
//                                                         onClick={handleTab}
//                                                     >
//                                                         <p className="member-info">
//                                                             <span className="member-name">
//                                                                 {row.memberName}
//                                                             </span>
//                                                             <span className="designation">
//                                                                 {row.designation}
//                                                             </span>
//                                                         </p>
//                                                         <div className="holder">
//                                                             <GatsbyImage
//                                                                 loading={"lazy"}
//                                                                 image={getImage(row.photo)}
//                                                                 alt={row.photo.altText}
//                                                             />
//                                                             {/* <img src="" alt="" /> */}
//                                                         </div>
//                                                     </a>
//                                                     <div
//                                                         class={`colio ${row.memberName === tab ? "colio-expanded" : ""
//                                                             } `}
//                                                         id="hacker_member"
//                                                     >
//                                                         <div class="colio-container">
//                                                             <div
//                                                                 id={`#colio_c${index}`}
//                                                                 className={`colio-content colio-member-content ${row.memberName === tab
//                                                                     ? "tabOpen"
//                                                                     : "tabClose"
//                                                                     }`}
//                                                             >
//                                                                 <div className="main">
//                                                                     <div className="left">
//                                                                         <div className="img-wrap">
//                                                                             <p className="member-info">
//                                                                                 <span className="member-name">
//                                                                                     {row.memberName}
//                                                                                 </span>
//                                                                                 <span className="designation">
//                                                                                     {row.designation}
//                                                                                 </span>
//                                                                             </p>
//                                                                             <div className="holder">
//                                                                                 <GatsbyImage
//                                                                                     loading={"lazy"}
//                                                                                     image={getImage(row.photo)}
//                                                                                     alt={row.photo.altText}
//                                                                                 />
//                                                                                 {/* <img src="" alt="" /> */}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="right">
//                                                                         <p
//                                                                             dangerouslySetInnerHTML={{
//                                                                                 __html: removeTags(row.description),
//                                                                             }}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <a
//                                                                     class="colio-close"
//                                                                     href="#"
//                                                                     onClick={handleTabClose}
//                                                                 >
//                                                                     <span>Close</span>
//                                                                 </a>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </li>
//                                             ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         </section>
//                     </div>
//                 </section>
//             )}
//         </Layout>
//     );
// };

// export default Identity;
// export const data = graphql`
//   query Mydata {
//     ourstory: wpPage(databaseId: { eq:  15}) {
//       id
//       title
//       featuredImage {
//         node {
//           altText
//           gatsbyImage(
//             placeholder: BLURRED
//             layout: CONSTRAINED
//             width: 1920
//             height: 733
//           )
//         }
//       }
//       ourTeamLayout {
//         teamTopText
//         teamCulture {
//           cultureDesc
//           cultureTitle
//           cultureIcon {
//             altText
//             mediaItemUrl
//           }
//         }
//         firstRowMembers {
//           memberName
//           designation
//           description
//           photo {
//             gatsbyImage(
//               layout: FIXED
//               placeholder: BLURRED
//               width: 788
//               height: 788
//             )
//             altText
//             mediaItemUrl
//           }
//         }
//         secondRowMembers {
//           memberName
//           designation
//           description
//           photo {
//             gatsbyImage(
//               layout: FIXED
//               placeholder: BLURRED
//               width: 788
//               height: 788
//             )
//             altText
//             mediaItemUrl
//           }
//         }
//         thirdRowMembers {
//           memberName
//           designation
//           description
//           photo {
//             gatsbyImage(
//               layout: FIXED
//               placeholder: BLURRED
//               width: 788
//               height: 788
//             )
//             altText
//             mediaItemUrl
//           }
//         }
//         fourthRowMembers {
//           memberName
//           designation
//           description
//           photo {
//             gatsbyImage(
//               layout: FIXED
//               placeholder: BLURRED
//               width: 788
//               height: 788
//             )
//             altText
//             mediaItemUrl
//           }
//         }
//         fifthRowMembers {
//           memberName
//           designation
//           description
//           photo {
//             gatsbyImage(
//               layout: FIXED
//               placeholder: BLURRED
//               width: 788
//               height: 788
//             )
//             altText
//             mediaItemUrl
//           }
//         }
//       }
//     }
//   }
// `;
