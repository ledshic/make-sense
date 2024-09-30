import type { User, UserActionType } from "./types";
import { Action } from "../Actions";

export function updateUserData(user: User): UserActionType {
  return {
    type: Action.UPDATE_USER_DATA,
    payload: user,
  };
}
