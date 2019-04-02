// lib
import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import { Input, Spin } from "antd";
import { Dispatch } from "redux";
import { Table, Modal, message, Alert } from "antd";
// src
import { getFiles } from "../../action-creators/index";
import { ApplicationState, GistWithFiles, File } from "../../application-state";

const Search = Input.Search;

class SearchGists extends React.Component<SearchProps, SearchState> {
  columns = [
    { title: "Name", dataIndex: "name", key: "name" },

    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text: string, record: File) => (
        <a onClick={() => this.showGistUrl(record)}>Share</a>
      )
    }
  ];

  showGistUrl = (gist: any) => {
    const { raw_url } = gist;
    Modal.success({
      title: "Url genrated successfully.",
      content: raw_url
    });
  };

  state: SearchState = {
    query: "",
    visible: false
  };
  //   handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     const { value } = e.currentTarget;
  //     this.setState({
  //       query: value
  //     });
  //   };
  handleSearch = (query: string) => {
    this.setState({ visible: true });
    const { getFiles } = this.props;
    getFiles(query);
  };
  info = () => {
    message.info("This is a normal message");
  };

  componetDidUpdate() {
    console.log("component update called");
    const { isLoading, selectedGist: { files = [] } = {} } = this.props;
    const { visible } = this.state;
    console.log("file", this.props);
    if (files.length < 1 || visible) {
      this.info();
    }
    this.setState({ visible: false });
  }
  render() {
    const { isLoading, selectedGist: { files = [] } = {} } = this.props;
    return (
      <div>
        <Spin spinning={isLoading}>
          <Search
            placeholder="Search gists."
            onSearch={value => this.handleSearch(value)}
            enterButton
          />

          <Table
          className="voffset1"
            columns={this.columns}
            rowKey="raw_url"
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>{record.content}</p>
            )}
            dataSource={files}
          />
        </Spin>
      </div>
    );
  }
}
type SearchProps = {
  gistWithFiles: Array<GistWithFiles>;
  isLoading: boolean;
  selectedGist: GistWithFiles;

  getFiles: (id: string) => void;
};
type SearchState = {
  query: string;
  visible: boolean;
};
type SearchStateProps = Pick<
  SearchProps,
  "gistWithFiles" | "isLoading" | "selectedGist"
>;
type SearchDispatchProps = Pick<SearchProps, "getFiles">;
function mapStateToProps(state: ApplicationState): SearchStateProps {
  const { gistWithFiles, isLoading, selectedGist } = state;
  return {
    gistWithFiles,
    isLoading,
    selectedGist
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): SearchDispatchProps {
  return {
    getFiles: async (id: string) => {
      await dispatch(getFiles(id));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchGists);
