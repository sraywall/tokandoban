import React from "react";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">ToKanDoBan</Link>
      </div>
      <ul>
        <li>
          <Link to="/login">
            <FaSignInAlt /> Login
          </Link>
        </li>
        <Link to="/register">
          <FaUser /> Register
        </Link>
      </ul>
    </header>
  );
}

export default Header;
