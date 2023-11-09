import React from "react";
import { graphql } from "gatsby";

import { GatsbySeo } from "gatsby-plugin-next-seo";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "swiper/css/bundle";
import "../assets/css/landing-page.css"

const RolfThankyou = ({ data }) => {
    const WEBSITE_URL = process.env.GATSBY_BASE_URL;
    const MEDIA_URL = process.env.GATSBY_MEDIA_URL;
    const seo = data?.wpPage?.seo || []


    return (
        <>
            <HelmetProvider>
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
                <Helmet bodyAttributes={{ class: "page-template-tp-lp-rolf-thankyou" }}></Helmet>
            </HelmetProvider>
            <section class="header">
                <div class="holder">

                    <picture>
                        <source srcset={`${MEDIA_URL}/img/Nouthing-but-wunderbar-mobile.jpg`} media="(max-width: 767px)" />
                        <img src={`${MEDIA_URL}/img/Nouthing-but-wunderbar.jpg`} alt="Nouthing But Wunderbar" />
                    </picture>

                </div>
                <div class="header-content">
                    <div class="logo">
                        <a href="https://www.innerspacedxb.com/">
                            <img src={`${MEDIA_URL}/img/rolf-benz.svg `} alt="Relf Benz" />
                        </a>
                    </div>
                    <h1>{data && data.wpPage.title}</h1>
                    {data && data.wpPage.content ? (
                        <span dangerouslySetInnerHTML={{ __html: data.wpPage.content }} />

                    ) : (
                        <p>Thank You for your Enquiry.</p>
                    )}
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
                                    <p>
                                        <a class="email footer" href="mailto:hello@innerspacedxb.com">hello@innerspacedxb.com</a>
                                        <a class="tel footer" href="tel:+971 (0) 4 252  6500">+971 (0) 4 252 6500</a>
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
export const data = graphql`
query MyQuery {
  wpPage(databaseId: {eq: 1128 }) {
    id
    title
    content
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
export default RolfThankyou;
