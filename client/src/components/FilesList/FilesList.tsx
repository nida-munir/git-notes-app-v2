// lib
const queryString = require("query-string");
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React from "react";
import { Table, Divider, Tag, Modal, Button, Input, Spin } from "antd";
const { TextArea } = Input;

// src
import {
  getFiles,
  deleteFile,
  updateIsLoading,
  editFile
} from "../../action-creators/index";
import { ApplicationState, Gist } from "../../application-state";
import { GistWithFiles } from "./../../application-state";
import {
  FileDispatchProps,
  FileStateProps,
  FileProps,
  FileState
} from "../types";

class FilesList extends React.Component<FileProps, FileState> {
  state: FileState = {
    fileName: "",
    fileContent: "",
    visible: false,
    gistId: "",
    oldFileName: "",
    isEditMode: false
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
          <a onClick={() => this.showModal(record)}>Edit</a>
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
  showModal = (file: any) => {
    const isEditMode = file ? true : false;
    const fileContent = file ? file.content : "";
    const fileName = file ? file.name : "";
    this.setState({
      visible: true,
      fileContent,
      fileName,
      oldFileName: fileName,
      isEditMode
    });
  };
  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: fileName } = e.currentTarget;
    this.setState({ fileName });
  };
  handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value: fileContent } = e.currentTarget;
    this.setState({ fileContent });
  };
  handleFileCancel = () => {
    console.log("cancelling file cration");
    this.setState({
      visible: false,
      fileName: "",
      fileContent: ""
    });
  };
  handleFileCreation = () => {
    console.log("creating new file", this.state);
    const { editFile, selectedGist, updateIsLoading } = this.props;
    const { fileContent, fileName, oldFileName, isEditMode } = this.state;
    // if file with this name already exist, return in add
    console.log("edit mode: ", isEditMode);
    if (!isEditMode && selectedGist.files.find(f => f.name === fileName)) {
      console.log("File with this name already exists.");
      return;
    }
    updateIsLoading(true);
    editFile(selectedGist.id, oldFileName, fileName, fileContent);
    // isEditMode ? editGist(gistId, userInput) : createGist(userInput);
    this.setState({
      visible: false,
      fileName: "",
      fileContent: "",
      oldFileName: ""
    });
  };
  public render() {
    const { files = [] } = this.props.selectedGist;
    const { isLoading = false, gistWithFiles } = this.props;
    const { visible, fileName, fileContent } = this.state;
    const {
      showModal,
      handleFileCreation,
      handleFileCancel,
      handleContentChange,
      handleNameChange,
      columns
    } = this;

    return (
      <div>
        <Spin spinning={isLoading}>
          <Button type="primary" onClick={() => showModal(null)}>
            New
          </Button>
          <Modal
            title="Add new File"
            visible={visible}
            onOk={() => handleFileCreation()}
            confirmLoading={isLoading}
            onCancel={handleFileCancel}
          >
            <Input
              placeholder="File Name"
              id="fileName"
              onChange={handleNameChange}
              value={fileName}
            />
            <TextArea
              placeholder="Content"
              id="fileContent"
              autosize={{ minRows: 2, maxRows: 6 }}
              onChange={handleContentChange}
              value={fileContent}
            />
          </Modal>
          <Table
            className="voffset1"
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
    },
    editFile: async (
      id: string,
      oldFileName: string,
      updatedFileName: string,
      fileContent: string
    ) => {
      await dispatch(editFile(id, oldFileName, updatedFileName, fileContent));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesList);
