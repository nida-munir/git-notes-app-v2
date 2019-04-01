// lib
import React, { Component } from "react";
// src
import logo from "./diamond.png";
import { NavLinks } from "../App/NavLinks";
import "./Navbar.css";
class Navbar extends Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper teal lighten-2">
          <a href="#" className="brand-logo">
            <img src={logo} alt="logo" id="logo" />
          </a>
          <NavLinks />
        </div>
      </nav>
    );
  }
}
export default Navbar;
