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

  const MenuItem = ({ item, show }) => (
    <li
      className={`menu-item menu-item-type-post_type menu-item-object-page ${item.classes.join(
        " "
      )} ${item.child_items ? "menu-item-has-children" : ""} ${show
        ? "current-page-ancestor current-menu-ancestor current-menu-parent current-page-parent current_page_parent current_page_ancestor"
        : ""
        }`}
    >
      <Link
        to={shortUrl(item.url)}
        dangerouslySetInnerHTML={{ __html: item.title }}
      />
      {item.child_items && item.child_items.length > 0 && (
        <SubMenu items={item.child_items} show={show} />
      )}
    </li>
  );

  const SubMenu = ({ items, show }) => (
    <ul className="sub-menu">
      {items.map((item, index) => (
        <MenuItem item={item} show={show} key={`${index}submenu2`} />
      ))}
    </ul>
  );

  const shortUrl = (fullUrl) => {
    const url = fullUrl;
    const urlObject = new URL(url);
    const desiredPart = urlObject.pathname;
    return desiredPart;
  };

  return (
    <Layout>
      <Seo pageUrl={`${WEBSITE_URL}/sitemap/`} title={"Sitemap"} />
      {/* <section className="sitemap">
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
                  <MenuItem item={item} show={show} key={`${index}menu2`} />
                ))}
              </ul>
            )}

          </div>
        </div>
      </section> */}
    </Layout>
  );
};

export default Sitemap;
