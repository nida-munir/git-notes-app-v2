// lib
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React from "react";
import { Table, Divider, Spin, Modal, Button, Input } from "antd";
// src
import "./NotebookList.css";
import {
  updateGists,
  deleteGist,
  createGist,
  updateIsLoading,
  editGist
} from "../../action-creators/index";
import { ApplicationState, Gist } from "../../application-state";

class NotebookList extends React.Component<NotebookProps, {}> {
  state = {
    visible: false,
    userInput: "",
    isEditMode: false,
    gistId: ""
  };
  showModal = (gist: any) => {
    const isEditMode = gist ? true : false;
    const userInput = gist ? gist.description : "";
    const gistId = gist ? gist.id : "";
    this.setState({
      visible: true,
      userInput,
      isEditMode,
      gistId
    });
  };
  handleGistCreation = () => {
    const { createGist, updateIsLoading, editGist } = this.props;
    const { userInput, isEditMode, gistId } = this.state;
    updateIsLoading(true);
    isEditMode ? editGist(gistId, userInput) : createGist(userInput);
    this.setState({
      visible: false,
      userInput: "",
      isEditMode: false
    });
  };

  handleEdit = (gist: any) => {
    this.showModal(gist);
  };
  handleGistCancel = () => {
    this.setState({
      visible: false,
      userInput: ""
    });
  };
  columns = [
    {
      title: "Name",
      dataIndex: "description",
      key: "description",
      render: (text: string, record: any) => (
        <a onClick={() => this.handleNameClick(record)}>{text}</a>
      )
    },
    {
      title: "Files Count",
      dataIndex: "filesCount",
      key: "filesCount",
      render: (text: string) => <p>{text}</p>
    },
    {
      title: "Status",
      dataIndex: "public",
      key: "public",
      render: (text: boolean) => {
        if (text == true) return <p>Public</p>;
        else {
          return <p>Private</p>;
        }
      }
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => <p>{text}</p>
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: any) => (
        <span>
          <a onClick={() => this.handleEdit(record)}>Edit</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record)}>Delete</a>
          <Divider type="vertical" />

          <a onClick={() => this.showGistUrl(record)}>Share</a>
        </span>
      )
    }
  ];

  showGistUrl = (gist: any) => {
    const { html_url } = gist;
    Modal.success({
      title: "Url genrated successfully.",
      content: html_url
    });
  };
  // replace any with gist
  handleDelete = (gist: any) => {
    const confirm = Modal.confirm;
    const { deleteGist, updateIsLoading } = this.props;
    confirm({
      title: `Delete gist ${gist.description}?`,
      content: "Are you sure you want to delete this gist?",
      onOk() {
        updateIsLoading(true);
        deleteGist(gist.id);
      }
    });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: userInput } = e.target;
    this.setState({
      userInput
    });
  };

  handleNameClick = (record: any) => {
    this.props.history.push({
      pathname: "/files",
      search: `?gistId=${record.id}`
    });
  };
  componentDidMount() {
    // const { updateGists, updateIsLoading } = this.props;
    // // get updated gists
    // updateIsLoading(true);
    // updateGists();
  }

  refresh = () => {
    const { updateGists, updateIsLoading } = this.props;
    // get updated gists
    updateIsLoading(true);
    updateGists();
  };
  public render() {
    const { gists, isLoading } = this.props;
    const { visible, userInput } = this.state;
    const {
      showModal,
      handleGistCreation,
      handleGistCancel,
      handleInputChange,
      columns
    } = this;

    return (
      <div>
        <Spin spinning={isLoading}>
          <div>
            <Button
              type="primary"
              onClick={() => showModal(null)}
              className="hoffset"
            >
              New
            </Button>

            <Button type="primary" onClick={this.refresh}>
              Refresh
            </Button>
            <Modal
              title="Add new gist"
              visible={visible}
              onOk={() => handleGistCreation()}
              confirmLoading={isLoading}
              onCancel={handleGistCancel}
            >
              <Input
                placeholder="Gist Name"
                id="gistName"
                onChange={handleInputChange}
                value={userInput}
              />
            </Modal>
          </div>
          <Table
            className="voffset1"
            columns={columns}
            dataSource={gists}
            rowKey="id"
          />
          ,
        </Spin>
      </div>
    );
  }
}
//  all notebook props
interface NotebookProps {
  gists: Array<Gist>;
  history: any;
  isLoading: boolean;
  updateGists: () => void;
  deleteGist: (id: string) => void;
  editGist: (id: string, dscription: string) => void;
  updateIsLoading: (isLoading: boolean) => void;
  createGist: (id: string) => void;
}
// get state and dispatch props from notebook props
type NoteBookDispatchProps = Pick<
  NotebookProps,
  "updateGists" | "deleteGist" | "createGist" | "updateIsLoading" | "editGist"
>;
type NoteBookStateProps = Pick<
  NotebookProps,
  "gists" | "history" | "isLoading"
>;

function mapStateToProps(
  state: ApplicationState,
  ownProps: any
): NoteBookStateProps {
  const { gists, isLoading } = state;
  return {
    gists,
    history: ownProps.history,
    isLoading
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): NoteBookDispatchProps {
  return {
    updateGists: async () => {
      await dispatch(updateGists());
    },
    deleteGist: async (id: string) => {
      await dispatch(deleteGist(id));
    },
    createGist: async (name: string) => {
      await dispatch(createGist(name));
    },
    updateIsLoading: async (isLoading: boolean) => {
      await dispatch(updateIsLoading(isLoading));
    },
    editGist: async (id: string, description: string) => {
      await dispatch(editGist(id, description));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotebookList);
