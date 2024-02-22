import React, { useState, useEffect } from "react";
import { Link } from "gatsby";

import defaultlogo from "../assets/img/logo-innerspace.svg";

const Navbar = ({ sliceContext }) => {
  const headMenu = sliceContext?.priMenuData || [];
  const mobileMenu = sliceContext?.mobMenuData || [];


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

  const MenuItem = ({ item, level }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const toggleSubMenu = (event) => {
      if (window != "undefined" && window.innerWidth < 821) {
        event.preventDefault()
        setIsSubMenuOpen(!isSubMenuOpen);
      }
    };

    return (
      <li
        className={`menu-item menu-item-type-post_type menu-item-object-page ${Array.isArray(item.cssClasses) && item.cssClasses.length
            ? item.cssClasses.join(' ')
            : ''
          } ${Array.isArray(item.children) && item.children.length ? 'menu-item-has-children' : ''}`}
      >
        <Link
          to={item.children && item.children.length > 0 && window != "undefined" && window.innerWidth < 821 ? "/":item.path}
          dangerouslySetInnerHTML={{ __html: item.label }}
          onClick={toggleSubMenu}
          activeClassName="current-page-ancestor current-menu-ancestor current-menu-parent current-page-parent current_page_parent current_page_ancestor"
        />
        {item.children && item.children.length > 0 && (
          <SubMenu items={item.children} level={level + 1} isOpen={isSubMenuOpen} />
        )}
      </li>
    );
  };

  const SubMenu = ({ items, level, isOpen }) => {
    return (
      <ul className={`sub-menu ${isOpen ? 'show' : ''} level-${level}`}>
        {items.map((item, index) => (
          <MenuItem item={item} key={`${index}submenu2`} level={level + 1} />
        ))}
      </ul>
    );
  };

  // function selectParentClass(event, elem) {

  //   var grandParent = event.target.closest(".menu-toggle");

  //   var parentSelector = event.target.parentNode;
  //   if (
  //     grandParent &&
  //     grandParent.classList.contains("menu-toggle") &&
  //     parentSelector.classList.contains("menu-item-has-children")
  //   ) {
  //     event.preventDefault();

  //     var subMenu = parentSelector.querySelector(".sub-menu");
  //     console.log("subMenu", subMenu.classList.contains('level-2'));
  //     if (elem.classList.contains('level-2') && !subMenu.classList.contains('show')) {
  //       setMenuClass('show')
  //     } else if (subMenu.classList.contains('level-4') && !subMenu.classList.contains('show')) {
  //       setMenuClass('show')
  //     } else {
  //       setMenuClass('')
  //     }
  //   }
  // }

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
  }, []);

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
            {headMenu && headMenu.length > 0 && (
              <ul>
                {headMenu.map((item, index) => (
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
        {mobileMenu && mobileMenu.length > 0 && (
          <ul>
            {mobileMenu.map((item, index) => (
              <MenuItem item={item} key={`${index}menu2`} level={1} />
            ))}
          </ul>
        )}
      </nav>
      {/* <!-- MOBILE Nav ENDS --> */}
    </>
  );
};

export default Navbar;
