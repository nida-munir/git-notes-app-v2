// lib
import React from "react";
import {
  Switch,
  Route,
  BrowserRouter,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
// src
import Welcome from "../src/components/Welcome/Welcome";
import NotebookList from "./components/NotebookList/NotebookList";
import FilesList from "./components/FilesList/FilesList";
import { auth } from "./components/App/utils";
import { NavLinks } from "./components/App/NavLinks";

import { PrivateRoute } from "./components/App/PrivateRoute";
import Search from "./components/Search/Search";

// class Login extends React.Component {
//   state = {
//     redirectToReferrer: false
//   };
//   login = () => {
//     if (auth.isSignedIn() === true) {
//       this.setState(() => ({
//         redirectToReferrer: true
//       }));
//     }
//   };
//   render() {
//     const { from } = { from: { pathname: "/welcome" } } || {
//       from: { pathname: "/" }
//     };
//     // const { from } = this.props.location.state || { from: { pathname: '/' }
//     const { redirectToReferrer } = this.state;

//     if (redirectToReferrer === true) {
//       return <Redirect to={from} />;
//     }

//     return (
//       <div>
//         <p>You must log in to view the page</p>
//         <button onClick={this.login}>Log in</button>
//       </div>
//     );
//   }
// }

class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <main>
              <NavLinks />
              <Switch>
                <Route path="/login" component={Welcome} />
                <Route path="/search" component={Search} />
                <PrivateRoute path="/notebooks" component={NotebookList} />
                <PrivateRoute path="/files" component={FilesList} />
                <Route path="/" component={Welcome} />
              </Switch>
            </main>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
