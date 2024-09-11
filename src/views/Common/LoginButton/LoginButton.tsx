import { useState } from "react";
import { Avatar, Button } from "@mui/material";

import { store } from "../../../index";
import { updateActivePopupType } from "../../../store/general/actionCreators";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";

const LoginButton = () => {
  const [loginStatus, setLoginStatus] = useState(false);

  const handleLogin = () => {
    store.dispatch(updateActivePopupType(PopupWindowType.USER_LOGIN));
  };

  return loginStatus ? (
    <Avatar />
  ) : (
    <Button onClick={handleLogin}>
      <span style={{ color: "#fff" }}>Login</span>
    </Button>
  );
};

export default LoginButton;
