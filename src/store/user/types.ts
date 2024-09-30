import { Action } from "../Actions";

export interface User {
  token: string;
}

interface UpdateUserData {
  type: typeof Action.UPDATE_USER_DATA;
  payload: User;
}

export type UserActionType = UpdateUserData;
