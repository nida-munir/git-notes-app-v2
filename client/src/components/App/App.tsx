// lib
import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
// src
import Welcome from "../Welcome/Welcome";
import NotebookList from "../NotebookList/NotebookList";
import FilesList from "../FilesList/FilesList";
import "./App.css";
import { PrivateRoute } from "./PrivateRoute";
import Search from "../Search/Search";
import Navbar from "../Navbar/Navbar";

class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Navbar />
            <main id="main">
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
