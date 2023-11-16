import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const Seo = ({ pageUrl, title, description, bodyClass }) => {
  const [head, setHead] = useState("");
  useEffect(() => {
    axios({
      method: "get",
      url: `${WEBSITE_URL}/wp-json/yoast/v1/get_head?url=${pageUrl}`,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        setHead(response.data.json);
        console.log(response.data.json);
      })
      .catch((error) => console.error("SeoError:", error));
  }, [pageUrl]);
  const headContext = {};
  return (
    <HelmetProvider context={headContext}>
      <Helmet htmlAttributes={{ lang: "en" }} bodyAttributes={{ class: bodyClass }}>
        {/* <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <title>{title ? title : head.title}</title>
        <meta
          name="description"
          content={description ? description : head.description}
        />

        <meta property="og:locale" content={"en_US"} />
        <meta property="og:type" content={"website"} />
        <meta property="og:site_name" content={"Innerspacedxb"} />

        <meta property="og:title" content={title ? title : head.og_title} />
        <meta property="og:description" content={description ? description : head.og_description} />
        <meta property="og:url" content={pageUrl} />

        <meta property="og:image" content={imageUrl ? imageUrl : "https://www.innerspacedxb.com/wp-content/uploads/2022/11/logo-innerspace-black.png"} />
        <meta property="og:image:width" content={imgWidth ? imgWidth : "400"} />
        <meta property="og:image:height" content={imgHeight ? imgHeight : "300"} />
        <meta property="og:image:type" content={imgType ? imgType : "image/png"} />
        <link rel="canonical" href={pageUrl} />
        <meta
          name="robots"
          content={`index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`}
        />
        <meta name="twitter:card" content={"summary_large_image"} />
        <meta name="twitter:site" content={"@site"} />
        <meta name="twitter:creator" content="@handle" /> */}
        <title>{head.title ? head.title : title}</title>
        <meta
          name="description"
          content={head.description ? head.description : description}
        />
        <meta
          name="robots"
          content={`index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`}
        />

        <meta name="twitter:card" content={head.twitter_card} />
        <meta name="twitter:site" content={head.twitter_site} />

        <meta property="og:locale" content={head.og_locale} />
        <meta property="og:type" content={head.og_type} />
        <meta
          property="og:title"
          content={head.og_title ? head.og_title : title}
        />
        <meta
          property="og:description"
          content={head.og_description ? head.og_description : description}
        />
        <meta property="og:url" content={head.og_url} />
        <meta property="og:site_name" content={head.og_site_name} />
        <meta
          property="article:modified_time"
          content={head.article_modified_time}
        />
        <meta
          name="google-site-verification"
          content="4KgWrYQfz8sTPAgJGMlDVKzR-OLGh6yRTd5kmLV1Xlw"
        />
        <link rel="canonical" href={head.canonical} />

        <script type="application/ld+json">{JSON.stringify(head.schema)}</script>
      </Helmet>
    </HelmetProvider>
  );
};
export default Seo;
