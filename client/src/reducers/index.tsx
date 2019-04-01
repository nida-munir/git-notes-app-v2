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
  | Actions.UpdateSelectedGistAction;
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
        selectedGist: currentGist
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
    default:
      return state;
  }
};

export default updateState;
