import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import { getPrimaryMenu, getSecondaryMenu } from "../hooks/menu";
import Layout from "../components/Layout";
import Seo from "../components/SeoMeta";

const Sitemap = () => {
  const WEBSITE_URL = process.env.GATSBY_WEBSITE_URL;
  const [primaryMenu, setPrimaryMenu] = useState(null);
  const [secondaryMenu, setSecondaryMenu] = useState(null);

  useEffect(() => {
    const fetchPrimaryMenu = async () => {
      try {
        const fetchedData = await getPrimaryMenu();
        setPrimaryMenu(fetchedData);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchPrimaryMenu();
  }, []);

  useEffect(() => {
    const fetchSecondaryMenu = async () => {
      try {
        const fetchedData = await getSecondaryMenu();
        setSecondaryMenu(fetchedData);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchSecondaryMenu();
  }, []);

  const MenuItem = ({ item }) => (
    <li
      className={`menu-item menu-item-type-post_type menu-item-object-page  ${item.child_items ? "menu-item-has-children" : ""}`}
    >
      <Link
        to={shortUrl(item.url)}
        dangerouslySetInnerHTML={{ __html: item.title }}
      />
      {item.child_items && item.child_items.length > 0 && (
        <SubMenu items={item.child_items} />
      )}
    </li>
  );

  const SubMenu = ({ items }) => (
    <ul>
      {items.map((item, index) => (
        <MenuItem item={item} key={`${index}submenu2`} />
      ))}
    </ul>
  );

  const shortUrl = (fullUrl) => {
    const url = fullUrl;
    var desiredPart = "#";
    if (url) {
      const urlObject = new URL(url);
      desiredPart = urlObject.pathname;
    }
    return desiredPart;
  };

  return (
    <Layout>
      <section className="sitemap">
        <div className="container">
          <div className="static-txt-wrapper sitemap-wrapper">
            <ul>
              <li>
                <a href="/">
                  <h4>Home</h4>
                </a>
              </li>
              {secondaryMenu &&
                secondaryMenu.items.map((menuItem, index) => (
                  <li key={`${index}secondarymenu`}>
                    <Link to={shortUrl(menuItem.url)}>
                      <h4>{menuItem.title}</h4>
                    </Link>
                  </li>
                ))}
            </ul>


            {primaryMenu && primaryMenu.items.length > 0 && (
              <ul>
                {primaryMenu.items.map((item, index) => (
                  <MenuItem item={item} key={`${index}menu2`} />
                ))}
              </ul>
            )}

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sitemap;
export const Head = ({ data }) => (
  <Seo seoData={data?.wpPage?.seo || []} bodyClass={"page-template-tp-thankyou"} title={"Sitemap - Innerspacedxb"} description={"Sitemap - Innerspacecdxb"}>
  </Seo>
)
