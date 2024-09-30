import type { UserActionType } from "./types";
import { Action } from "../Actions";

const initialState = {
  id: null,
};

export function userReducer(state = initialState, action: UserActionType) {
  switch (action.type) {
    case Action.UPDATE_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
