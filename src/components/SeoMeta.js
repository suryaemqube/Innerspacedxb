import React from "react";
// import { useSiteMetadata } from "../hooks/use-site-metadata"

const Seo = ({ bodyClass, title, description, seoData, children }) => {
  // const { title: defaultTitle, description: defaultDescription, image, siteUrl } = useSiteMetadata()
  // const seo = {
  //   title: title || defaultTitle,
  //   description: description || defaultDescription,
  //   image: image,
  //   url: siteUrl,
  // }
  return (
    <>
      <html lang="en" />
      <body className={bodyClass || ""} />
      <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />

      <title>{seoData.title ? seoData.title : title}</title>
      <meta name="description" content={seoData.metaDesc ? seoData.metaDesc : description} />
      <meta name="robots" content={`${seoData.metaRobotsNoindex}, ${seoData.metaRobotsNofollow}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`} />

      <link rel="canonical" href={seoData.canonical ? seoData.canonical : "/"}></link>
      <meta property="og:locale" content={"en_US"} />
      <meta property="og:type" content={"Website"} />
      <meta property="og:title" content={seoData.title ? seoData.title : title} />
      <meta property="og:description" content={seoData.metaDesc ? seoData.metaDesc : description} />
      <meta property="og:url" content={seoData.opengraphUrl ? seoData.opengraphUrl : "https://innerspacedxb.com/"} />
      <meta property="og:site_name" content={seoData.opengraphSiteName ? seoData.opengraphSiteName : "Innerspacedxb"} />

      <meta property="og:image" content={seoData.opengraphImage ? seoData.opengraphImage.mediaItemUrl : "https://app.innerspacedxb.com/wp-content/uploads/2022/11/logo-innerspace-black.png"} />
      <meta property="og:image:width" content={seoData.opengraphImage ? seoData.opengraphImage.width : 200} />
      <meta property="og:image:height" content={seoData.opengraphImage ? seoData.opengraphImage.height : 200} />
      <meta property="og:image:type" content={seoData?.mediaType ? seoData.mediaType : "image/jpeg"} />
      <meta
        property="article:modified_time"
        content={seoData.opengraphModifiedTime}
      />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta name="twitter:site" content={seoData.opengraphSiteName ? seoData.opengraphSiteName : "Innerspacedxb"} />

      <meta
        name="google-site-verification"
        content="4KgWrYQfz8sTPAgJGMlDVKzR-OLGh6yRTd5kmLV1Xlw"
      />
      <script type="application/ld+json">{JSON.stringify(seoData.schema ? seoData.schema : "{}")}</script>
      {children}
    </>
  );
};
export default Seo;
