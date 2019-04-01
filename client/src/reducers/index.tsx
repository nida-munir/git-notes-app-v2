import * as Actions from "../action-creators/index";
import * as ActionTypes from "../action-types/index";
type Action =
  | Actions.UpdateGreetingAction
  | Actions.IncrementAction
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
import { GistWithFiles } from "./../application-state";

const updateState = (
  state: ApplicationState = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.UPDATE_GREETING:
      return {
        ...state
      };
    case ActionTypes.UPDATE_IS_AUTHENTICATED:
      const { isAuthenticated } = action;
      return {
        ...state,
        isAuthenticated
      };
    case ActionTypes.UPDATE_SELECTED_GIST:
      console.log("updating selected gist, ", action.selectedGist);
      const { selectedGist: currentGist } = action;
      return {
        ...state,
        selectedGist: currentGist,
        isLoading: false
      };

    case ActionTypes.UPDATE_IS_LOADING:
      const { isLoading } = action;
      console.log("prev state", state.isLoading + " " + isLoading);
      return {
        ...state,
        isLoading
      };

    case ActionTypes.UPDATE_GISTS:
      return {
        ...state,
        gists: action.gists
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
        gists: gists.filter(g => g.id !== id)
      };

    case ActionTypes.CREATE_GIST:
      const { gist } = action;
      return {
        ...state,
        gists: [gist, ...state.gists]
      };
    case ActionTypes.EDIT_GIST:
      const { gist: editedGist } = action;
      const gistsCopy = state.gists.slice(); // Create local copy to change.
      gistsCopy.forEach(g => {
        if (g.id === editedGist.id) {
          g.description = editedGist.description;
        }
      });
      return {
        ...state,
        gists: gistsCopy
      };
    case ActionTypes.GET_FILES:
      const { selectedGist } = action;
      // const { gists } = state;
      // update gist with files
      const { gistWithFiles } = state;
      const updatedGistWithFiles = [...gistWithFiles, selectedGist];
      console.log(updatedGistWithFiles);
      return {
        ...state,
        selectedGist,
        gistWithFiles: updatedGistWithFiles,
        isLoading: false
      };
    case ActionTypes.DELETE_FILE:
      const { fileName } = action;
      // const { gists } = state;
      const { files = [] } = state.selectedGist;
      const filteredFiles = files.filter(f => f.name !== fileName);
      const { selectedGist: updatedGist } = state;
      updatedGist.files = filteredFiles;
      return {
        ...state,
        selectedGist: updatedGist
      };
    case ActionTypes.EDIT_FILE:
      const { data } = action;
      const gistsWithFilesCopy = state.gistWithFiles.slice(); // Create local copy to change.
      gistsWithFilesCopy.forEach(g => {
        if (g.id === data.id) {
          //
          const index = g.files.findIndex(f => f.raw_url == data.file.raw_url);
          g.files = g.files.filter(f => f.raw_url != data.file.raw_url);
          console.log("Filtered files", g.files);
          g.files = [data.file, ...g.files];
          console.log("updated files", g.files);
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
