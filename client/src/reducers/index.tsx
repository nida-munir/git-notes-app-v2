import * as Actions from "../action-creators/types";
import * as ActionTypes from "../action-types/index";
type Action =
  | Actions.UpdateLocalStorage
  | Actions.UpdateGistsAction
  | Actions.DeleteGistAction
  | Actions.CreateGistAction
  | Actions.GetFilesAction
  | Actions.DeleteFileAction
  | Actions.UpdateIsAuthenticatedAction
  | Actions.UpdateIsLoadingAction
  | Actions.EditGistAction
  | Actions.UpdateSelectedGistAction
  | Actions.EditFileAction;
import { ApplicationState, defaultState } from "../application-state";

const updateState = (
  state: ApplicationState = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.UPDATE_IS_AUTHENTICATED:
      const { isAuthenticated } = action;
      return {
        ...state,
        isAuthenticated,
        isLoading: false
      };
    case ActionTypes.UPDATE_SELECTED_GIST:
      const { selectedGist: currentGist } = action;
      return {
        ...state,
        selectedGist: currentGist,
        isLoading: false
      };

    case ActionTypes.UPDATE_IS_LOADING:
      const { isLoading } = action;
      return {
        ...state,
        isLoading
      };

    case ActionTypes.UPDATE_GISTS:
      return {
        ...state,
        gists: action.gists,
        isLoading: false
      };
    case ActionTypes.UPDATE_LOCAL_STORAGE:
      const { username, avatar, token } = action.user;
      return {
        ...state,
        username,
        avatar,
        token,
        isAuthenticated: true
      };
    case ActionTypes.DELETE_GIST:
      const { id } = action;
      const { gists } = state;
      return {
        ...state,
        gists: gists.filter(g => g.id !== id),
        isLoading: false
      };

    case ActionTypes.CREATE_GIST:
      const { gist } = action;
      return {
        ...state,
        gists: [gist, ...state.gists],
        isLoading: false
      };
    case ActionTypes.EDIT_GIST:
      const {
        gist: { id: editedGistId, description }
      } = action;
      const gistsCopy = state.gists.slice(); // Create local copy to change.
      gistsCopy.forEach(g => {
        if (g.id === editedGistId) {
          g.description = description;
        }
      });
      return {
        ...state,
        gists: gistsCopy,
        isLoading: false
      };
    case ActionTypes.GET_FILES:
      const { selectedGist } = action;
      const { gistWithFiles } = state;
      const updatedGistWithFiles = [...gistWithFiles, selectedGist];
      return {
        ...state,
        selectedGist,
        gistWithFiles: updatedGistWithFiles,
        isLoading: false
      };
    case ActionTypes.DELETE_FILE:
      const { fileName } = action;
      const {
        selectedGist: { files = [] }
      } = state;
      const filteredFiles = files.filter(f => f.name !== fileName);
      const { selectedGist: updatedGist } = state;
      updatedGist.files = filteredFiles;
      return {
        ...state,
        selectedGist: updatedGist,
        isLoading: false
      };
    case ActionTypes.EDIT_FILE:
      const {
        data: { id: idToEdit, oldFileName, file }
      } = action;
      const gistsWithFilesCopy = state.gistWithFiles.slice();
      gistsWithFilesCopy.forEach(g => {
        const { id, files } = g;
        if (id === idToEdit) {
          const index = files.findIndex(f => f.name == oldFileName);
          files[index] = file;
        }
      });
      return {
        ...state,
        isLoading: false,
        gistWithFiles: gistsWithFilesCopy
      };

    default:
      return state;
  }
};

export default updateState;
