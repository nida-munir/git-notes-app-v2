import { withRouter, Link } from "react-router-dom";
import React from "react";
import { auth } from "./utils";
export const NavLinks = withRouter(({ history }) => {
  const signOut = () => {
    console.log("Signing out!");
    var gitHubUser = {
      isAuthenticated: false
    };
    localStorage.setItem("gitHubUser", JSON.stringify(gitHubUser));
    history.push("/");
  };

  return auth.isSignedIn() ? (
    <ul id="nav-mobile" className="right hide-on-med-and-down">
      <li>
        <a href="#"> Welcome {auth.getUserName()}!</a>
      </li>
      <li>
        <Link to="/search">Search</Link>
      </li>
      <li>
        <Link to="/notebooks">Notebooks</Link>
      </li>
      <li>
        <Link to="/" onClick={signOut}>
          Sign out
        </Link>
      </li>
    </ul>
  ) : (
    <ul id="nav-mobile" className="right hide-on-med-and-down">
      <li>
        <Link to="/">Welcome to GitNotes</Link>
      </li>
    </ul>
  );
  // put this code in welcome page
});
