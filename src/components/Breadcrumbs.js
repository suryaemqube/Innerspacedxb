import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../hooks/token";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const Breadcrumb = ({ postId }) => {
  const PAGEID = postId;
  const [jsonData, setJsonData] = useState(null);
  const [token, setToken] = useState("");

  const shortUrl = (fullUrl) => {
    const url = fullUrl;
    const urlObject = new URL(url);
    const desiredPart = urlObject.pathname;
    return desiredPart;
  };
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
    const fetchBreadcrumbs = async () => {
      try {
        const response = await axios.get(
          `${WEBSITE_URL}/wp-json/bcn/v1/post/${PAGEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setJsonData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBreadcrumbs();
  }, [postId]);

  if (!jsonData) {
    return <div>Loading breadcrumbs...</div>;
  }

  const itemListElements = jsonData.itemListElement.map((item, index) => (
    <span key={index} property="itemListElement" typeof="ListItem">
      {index > 0 && <span> &gt; </span>}
      {index === jsonData.itemListElement.length - 1 ? (
        <span property="name" className="post post-page current-item">
          {item.item.name}
        </span>
      ) : (
        <>
          <a
            property="item"
            typeof="WebPage1"
            href={
              item.item["@id"] === WEBSITE_URL
                ? "/"
                : shortUrl(item.item["@id"])
            }
          >
            <span>{item.item.name === "Emqubeweb" ? "Home" : item.item.name}</span>
          </a>
        </>
      )}
      {index === jsonData.itemListElement.length - 1 && (
        <>
          <meta property="url" content={item.item["@id"]} />
          <meta property="position" content={item.position} />
        </>
      )}
    </span>
  ));

  return <>{itemListElements}</>;
};

export default Breadcrumb;
