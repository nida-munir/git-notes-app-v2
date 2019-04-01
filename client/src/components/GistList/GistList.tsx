// libs
import axios from "axios";
import * as React from "react";
import { connect } from "react-redux";

type Props = {};
type GistState = {
  name: string;
  gists: Array<string>;
};
type State = {};
type Gist = {};
class GistList extends React.Component<Props, GistState> {
  state = {
    name: "",
    gists: []
  };
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    this.setState({
      name: value
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted");
    const { name } = this.state;
    const gist = {
      name: name
    };
    axios
      .post("http://localhost:3000/addGist", gist)
      .then(function(response) {
        console.log("response", response);
      })
      .catch(function(error) {
        console.log("Error while creating gist", error);
      });
  };

  componentDidMount() {
    console.log("getting all gists");
    const self = this;
    axios
      .get("http://localhost:3000/getAllGists")
      .then(function(response) {
        console.log("response", response);
      })
      .catch(function(error) {
        console.log("Error while creating gist", error);
      });
  }
  render() {
    const { gists } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s12">
              <input
                id="name"
                type="text"
                className="validate"
                onChange={this.handleChange}
              />
              <label htmlFor="name">Add New Gist</label>
            </div>
          </div>
          <button
            className="btn waves-effect waves-light"
            type="submit"
            name="action"
          >
            <i className="material-icons right">Add</i>
          </button>
        </form>

        {/* <ul>
          {gists.map(g => {
            <li>{g.id}</li>;
          })}
        </ul> */}
      </div>
    );
  }
}

export default GistList;
