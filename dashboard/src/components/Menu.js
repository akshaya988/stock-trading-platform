import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
const LOGIN_URL =
  process.env.REACT_APP_LOGIN_URL || "http://localhost:3000/login";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

    // Get logged-in user's name
  const [userName, setUserName] = useState("USERID");

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/me`, {
        withCredentials: true,
      })
      .then((response) => {
        setUserName(response.data.user.name);
      })
      .catch((error) => {
        console.error("Could not fetch user:", error);
      });
  }, []);


  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = (index) => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      window.location.assign(LOGIN_URL);
    } catch {
      setLogoutError("Could not log out. Please try again.");
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Company logo" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
  <div className="avatar">
    {userName.charAt(0).toUpperCase()}
  </div>
  <p className="username">{userName}</p>
</div>
        {isProfileDropdownOpen && (
          <div className="profile-menu">
            {logoutError && <p role="alert">{logoutError}</p>}
            <button type="button" onClick={handleLogout}>Log out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
