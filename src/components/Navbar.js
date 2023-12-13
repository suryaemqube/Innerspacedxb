import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { getPrimaryMenu, getMobileMenu } from "../hooks/menu";

import defaultlogo from "../assets/img/logo-innerspace.svg";

import "swiper/css/bundle";
import "swiper/css/navigation";

import "../assets/css/normalize.css";
import "../assets/css/home-common-responsive.css";
import "../assets/css/main.css";
import "../assets/css/inside.css";
import "../assets/css/room-type.css";
import "../assets/css/identity.css";
import "../assets/css/brands.css";
import "../assets/css/last-chance-archive.css";

import "../assets/css/uifixer.css";

const Navbar = () => {
  const [headMenu, setHeadMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(null);

  useEffect(() => {
    getPrimaryMenu()
      .then((menuData) => setHeadMenu(menuData))
      .catch((error) => console.error("Error fetching primary menu:", error));

    getMobileMenu()
      .then((menuData) => setMobileMenu(menuData))
      .catch((error) => console.error("Error fetching Mobile menu:", error));
  }, []);

  const shortUrl = (fullUrl) => {
    const url = fullUrl;
    var desiredPart = "#";
    if (url) {
      const urlObject = new URL(url);
      desiredPart = urlObject.pathname;
    }
    return desiredPart;
  };

  const MenuItem = ({ item }) => (
    <li
      className={`menu-item menu-item-type-post_type menu-item-object-page ${item.classes.join(
        " "
      )} ${item.child_items ? "menu-item-has-children" : ""}
        }`}
    >
      <Link
        to={shortUrl(item.url)}
        dangerouslySetInnerHTML={{ __html: item.title }}
        onClick={(e) => selectParentClass(e)}
        activeClassName="current-page-ancestor current-menu-ancestor current-menu-parent current-page-parent current_page_parent current_page_ancestor"
      />
      {item.child_items && item.child_items.length > 0 && (
        <SubMenu items={item.child_items} />
      )}
    </li>
  );

  const SubMenu = ({ items }) => (
    <ul className="sub-menu">
      {items.map((item, index) => (
        <MenuItem item={item} key={`${index}submenu2`} />
      ))}
    </ul>
  );

  function selectParentClass(event) {
    var grandParent = event.target.closest(".menu-toggle");
    console.log(event.target.closest(".menu-toggle"));
    var parentSelector = event.target.parentNode;
    if (
      grandParent &&
      grandParent.classList.contains("menu-toggle") &&
      parentSelector.classList.contains("menu-item-has-children")
    ) {
      event.preventDefault();

      var subMenu = parentSelector.querySelector(".sub-menu");
      subMenu.classList.toggle("show");
    }
  }

  useEffect(() => {
    let menuBtn = document.querySelector(".nav-toggle");
    let menu = document.querySelector(".menu-toggle");

    function handleMenuClick() {
      menuBtn.classList.toggle("active");
      menu.classList.toggle("active");
    }

    if (menuBtn && menu) {
      menuBtn.addEventListener("click", handleMenuClick);
    }
    return () => {
      if (menuBtn && menu) {
        menuBtn.removeEventListener("click", handleMenuClick);
      }
    };
  }, [headMenu]);

  return (
    <>
      {/* <!-- burger menu starts --> */}
      <svg
        className="ham hamRotate ham1 nav-toggle"
        viewBox="0 0 100 100"
        width="80"
      >
        <path
          className="line top"
          d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40"
        />
        <path className="line middle" d="m 30,50 h 40" />
        <path
          className="line bottom"
          d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40"
        />
      </svg>
      {/* <!-- burger menu ends --> */}

      {/* <!-- header starts --> */}
      <header>
        <div className="container">
          <Link to="/" className="logo">
            <img width="150" height="74" src={defaultlogo} alt="Innerspace" />
          </Link>
          <nav>
            {headMenu && headMenu.items.length > 0 && (
              <ul>
                {headMenu.items.map((item, index) => (
                  <MenuItem item={item} key={`${index}menu2`} />
                ))}
              </ul>
            )}
          </nav>
        </div>
      </header>
      {/* <!-- header ends */}

      {/* <!-- MOBILE Nav --> */}
      <nav className="menu-toggle">
        {mobileMenu && mobileMenu.items.length > 0 && (
          <ul>
            {mobileMenu.items.map((item, index) => (
              <MenuItem item={item} key={`${index}menu2`} />
            ))}
          </ul>
        )}
      </nav>
      {/* <!-- MOBILE Nav ENDS --> */}
    </>
  );
};

export default Navbar;
