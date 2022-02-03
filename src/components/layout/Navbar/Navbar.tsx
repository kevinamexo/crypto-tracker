import React, { useState, useEffect, useCallback } from "react";
import "./Navbar.css";
import Button from "../../Button/Button";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showMenuIcon, setShowMenuIcon] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [width, setWidth] = useState<number | null>(null);
  // const { width, height } = useWindowSize();
  // const width = 700;
  const menuButtonWidth = width !== null && width < 600 ? "100%" : "300px";

  const handleOpenNavbarMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (width === null) return;
    if (width <= 1050) {
      setShowMenuIcon(true);
    } else {
      setShowMenuIcon(false);
      setShowMenu(false);
    }
  }, [width]);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    if (window.innerWidth <= 1050) setShowMenuIcon(true);
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <nav className="navbar">
      <section className="navbar-section1">
        <p className="navbar-logo">cryptrack</p>
      </section>
      {showMenuIcon === false && (
        <section className="navbar-section2">
          <ul>
            <Link to="/coins">
              <li className="navbar-section2-item">Prices</li>
            </Link>
            <Link to="/coins">
              <li className="navbar-section2-item">Cryptocurrency news</li>
            </Link>
            <Link to="/coins">
              <li className="navbar-section2-item">API</li>
            </Link>
          </ul>
        </section>
      )}
      <section className="navbar-section3">
        {showMenuIcon === false && <p className="navbar-signin">Sign in</p>}
        <Button
          text="Get started"
          height="36px"
          color="#0052ff"
          width="105px"
          radius="7px"
          fontSize="14px"
          onClick={() => console.log("Sign In")}
          className="navbar-signin-primary"
        />
        {showMenuIcon === true && (
          <span className="navbar-openClose-menu">
            {showMenu === false && (
              <AiOutlineMenu onClick={handleOpenNavbarMenu} />
            )}

            {showMenu == true && (
              <AiOutlineClose onClick={handleOpenNavbarMenu} />
            )}
          </span>
        )}
      </section>
      {showMenuIcon && showMenu === true && (
        <ul className={`navbar-menu${showMenu && "-showMenu"}`}>
          <li className="navbar-menu-item">
            <span>Prices</span>
          </li>
          <li className="navbar-menu-item">
            <span>Cryptocurrency news</span>
          </li>
          <li className="navbar-menu-item">
            <span>API</span>
          </li>
          <li className="navbar-menu-item">
            <span>Github Repository</span>
          </li>
          <div className="authButtons">
            <li className="navbar-menu-item">
              <Button
                text="Get started"
                height="55px"
                border="2px solid #0052ff"
                color="#fff"
                fontColor="#0052ff"
                width={menuButtonWidth}
                radius="7px"
                fontSize="16px"
                onClick={() => console.log("Sign Up")}
                className="navbarMenuBtn-signup-secondary"
              />
            </li>
            <li className="navbar-menu-item">
              <Button
                text="Sign in"
                height="55px"
                color="#0052ff"
                width={menuButtonWidth}
                radius="7px"
                fontSize="16px"
                onClick={() => console.log("Sign In")}
                className="navbarMenuBtn-signin-secondary"
              />
            </li>
          </div>
        </ul>
      )}
    </nav>
  );
};

export default React.memo(Navbar);
