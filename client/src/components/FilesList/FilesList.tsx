// lib
const queryString = require("query-string");
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React from "react";
import { Table, Divider, Tag, Modal, Button, Input, Spin } from "antd";

// src
import {
  getFiles,
  deleteFile,
  updateIsLoading
} from "../../action-creators/index";
import { ApplicationState, Gist } from "../../application-state";
import { GistWithFiles } from "./../../application-state";

type FileState = {
  selectedGist: GistWithFiles;
};
class FilesList extends React.Component<FileProps, FileState> {
  state: FileState = {
    selectedGist: { id: "", description: "", files: [], html_url: "" }
  };
  // parse id from query string
  parsed = queryString.parse(this.props.location.search);
  // define column structure for antd table
  columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text: string, record: any) => (
        <span>
          <a>Edit</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record)}>Delete</a>
        </span>
      )
    }
  ];

  handleDelete = (rec: any) => {
    const { gistId } = this.parsed;
    const { deleteFile, updateIsLoading } = this.props;
    console.log("Deleting file....");
    updateIsLoading(true);
    deleteFile(gistId, rec.name);
  };

  componentDidMount() {
    const { getFiles } = this.props;
    const { gistId } = this.parsed;
    getFiles(gistId);
  }

  public render() {
    const { files = [] } = this.props.selectedGist;
    const { isLoading = false, gistWithFiles } = this.props;
    console.log("Selected gist: ", this.props.selectedGist);
    // gistWithFiles.filter((g:GistWithFiles) => g.id)
    return (
      <div>
        <Spin spinning={isLoading}>
          <Table
            columns={this.columns}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>{record.content}</p>
            )}
            dataSource={files}
            rowKey="raw_url"
          />
        </Spin>
      </div>
    );
  }
}
//  all notebook props
interface FileProps {
  location: any;
  getFiles: (id: string) => void;
  deleteFile: (id: string, fileName: string) => void;
  updateIsLoading: (isLoading: boolean) => void;
  selectedGist: ApplicationState["selectedGist"];
  isLoading: boolean;
  gistWithFiles: Array<GistWithFiles>;
}
type FileStateProps = Pick<
  FileProps,
  "location" | "selectedGist" | "isLoading" | "gistWithFiles"
>;
type FileDispatchProps = Pick<
  FileProps,
  "getFiles" | "deleteFile" | "updateIsLoading"
>;

function mapStateToProps(
  state: ApplicationState,
  ownProps: any
): FileStateProps {
  const { selectedGist, isLoading, gistWithFiles } = state;
  return {
    location: ownProps.location,
    selectedGist,
    gistWithFiles,
    isLoading
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): FileDispatchProps {
  return {
    getFiles: async (id: string) => {
      await dispatch(getFiles(id));
    },
    deleteFile: async (id: string, fileName: string) => {
      await dispatch(deleteFile(id, fileName));
    },
    updateIsLoading: async (isLoading: boolean) => {
      await dispatch(updateIsLoading(isLoading));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesList);
