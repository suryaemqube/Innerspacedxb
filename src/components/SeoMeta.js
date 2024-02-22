import React from "react";
// import { useSiteMetadata } from "../hooks/use-site-metadata"


  const Seo = ({ bodyClass, title, description, pageUrl="https://innerspacedxb.com/", seoData, children, visibility = true, }) => {
  // const { title: defaultTitle, description: defaultDescription, image, siteUrl } = useSiteMetadata()
  // const seo = {
  //   title: title || defaultTitle,
  //   description: description || defaultDescription,
  //   image: image,
  //   url: siteUrl,
  // }
  const shortUrl = (fullUrl) => {
    var url = fullUrl;
    try {
      const urlObject = new URL(url);
      url = urlObject.pathname ? urlObject.pathname : url;
    } catch (error) {
      url = fullUrl;
    }
    return url;
  };

  return (
    <>
      <html lang="en" />
      <body className={bodyClass || ""} />
      <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />

      <title>{seoData && seoData.title ? seoData.title : title}</title>
      <meta name="description" content={seoData && seoData.metaDesc ? seoData.metaDesc : description} />

      {/* <meta name="robots" content={`${seoData && seoData.metaRobotsNoindex ? seoData.metaRobotsNoindex : "index"}, ${seoData && seoData.metaRobotsNofollow ? seoData.metaRobotsNofollow : "follow"}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`} /> */}

      {visibility ? (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      ) : (
        <meta name="robots" content="noindex,nofollow" />
      )}

      <link rel="canonical" href={"https://innerspacedxb.com" + shortUrl(pageUrl)}></link>

      <meta property="og:locale" content={"en_US"} />
      <meta property="og:type" content={"Website"} />
      <meta property="og:title" content={seoData && seoData.title ? seoData.title : title} />
      <meta property="og:description" content={seoData && seoData.metaDesc ? seoData.metaDesc : description} />
      
      <meta property="og:url" content={"https://innerspacedxb.com" + shortUrl(pageUrl)} />

      <meta property="og:site_name" content={seoData && seoData.opengraphSiteName ? seoData.opengraphSiteName : "Achievers"} />

      <meta property="og:image" content={seoData && seoData.opengraphImage ? seoData.opengraphImage.mediaItemUrl : "https://app.innerspacedxb.com/wp-content/uploads/2022/11/logo-innerspace-black.png"} />
      <meta property="og:image:width" content={seoData && seoData.opengraphImage ? seoData.opengraphImage.width : 200} />
      <meta property="og:image:height" content={seoData && seoData.opengraphImage ? seoData.opengraphImage.height : 200} />
      <meta property="og:image:type" content={seoData && seoData?.mediaType ? seoData.mediaType : "image/png"} />
      <meta
        property="article:modified_time"
        content={seoData && seoData.opengraphModifiedTime}
      />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta name="twitter:site" content={seoData && seoData.opengraphSiteName ? seoData.opengraphSiteName : "Innerspacedxb"} />

      {/* <meta
        name="google-site-verification"
        content="4KgWrYQfz8sTPAgJGMlDVKzR-OLGh6yRTd5kmLV1Xlw"
      /> */}

<script type="application/ld+json">{seoData.schema ? seoData.schema.raw : "{}"}</script>
      {/* <script type="application/ld+json">{JSON.stringify(seoData && seoData.schema ? seoData.schema : "{}")}</script> */}
      {children}
    </>
  );
};
export default Seo;