// lib
import { connect } from "react-redux";
import { Dispatch } from "redux";
import React, { Component } from "react";
import GitHubLogin from "react-github-login";
import { Spin, Button } from "antd";
// src
import { ApplicationState } from "../../application-state";
import {
  updateLocalStorage,
  updateIsLoading,
  updateGists
} from "../../action-creators/index";
import "./Welcome.css";
import { auth } from "../utils/utils";

class Welcome extends Component<WelcomeProps> {
  componentDidMount() {
    // when user goes to localhost:3000/, then
    // if user is authenticated, navigate to notebooks page
    if (auth.isSignedIn()) {
      const { updateGists, updateIsLoading } = this.props;
      updateGists();
      this.props.history.push("/notebooks");
    }
  }
  componentDidUpdate() {
    // if user is authenticated, navigate to notebooks page
    // this is called when the compoenent is rerendered after signing in
    if (auth.isSignedIn()) {
      this.props.history.push("/notebooks");
    }
  }
  // please disable popup blocker
  onSuccess = (response: any) => {
    const { updateIsLoading } = this.props;
    // dispatch action is loading
    const { code } = response;
    const { updateLocalStorage } = this.props;
    updateLocalStorage(code);
  };
  onFailure = (response: any) => {
    console.log(
      "Error while getting code from GitHub. Please try again later.",
      response
    );
  };

  handleSearch = () => {
    this.props.history.push("/search");
  };
  render() {
    const CLIENT_ID = "92bfb1aa190ee8615b78";
    const REDIRECT_URI = "http://localhost:3000/redirect";
    const { isLoading } = this.props;
    return (
      <div id="welcome">
        <Spin spinning={isLoading}>
          <GitHubLogin
            clientId={CLIENT_ID}
            onSuccess={this.onSuccess}
            onFailure={this.onFailure}
            redirectUri={REDIRECT_URI}
            scope="user,gist"
          />
          <br />
          <Button
            className="voffset1"
            type="primary"
            icon="search"
            onClick={this.handleSearch}
          >
            Search Gists
          </Button>
        </Spin>
      </div>
    );
  }
}

export interface WelcomeProps {
  history: any;
  ownProps: any;
  isLoading: boolean;
  updateLocalStorage: (code: string) => void;
  updateIsLoading: (isLoading: boolean) => void;
  updateGists: () => void;
}
// pick
type WelcomeStateProps = Pick<WelcomeProps, "ownProps" | "isLoading">;
type WelcomeDispatchProps = Pick<
  WelcomeProps,
  "history" | "updateGists" | "updateLocalStorage" | "updateIsLoading"
>;

function mapStateToProps(
  state: ApplicationState,
  ownProps: any
): WelcomeStateProps {
  const { isLoading } = state;
  return {
    ownProps,
    isLoading
  };
}
// remove username, avatarurl, is authenticated from state

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  ownProps: any
): WelcomeDispatchProps {
  return {
    history: ownProps.history,
    updateLocalStorage: async (code: string) => {
      await dispatch(updateLocalStorage(code));
    },
    updateIsLoading: async (isLoading: boolean) => {
      await dispatch(updateIsLoading(isLoading));
    },
    updateGists: async () => {
      await dispatch(updateGists());
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
