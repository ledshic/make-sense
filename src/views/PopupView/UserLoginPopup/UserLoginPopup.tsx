import { useState } from "react";
import { Button } from "@mui/material";
import { useRequest } from "ahooks";

import { login } from "../../../api/auth/login";
import { PopupActions } from "../../../logic/actions/PopupActions";
import { store } from "../../../index";
import { updateActivePopupType } from "../../../store/general/actionCreators";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";

import "./UserLoginPopup.scss";
import { setTokenTemp } from "src/utils/storage/token";

const UserLoginPopup = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const closePopup = () => {
    PopupActions.close();
  };

  const { run } = useRequest(login, {
    manual: true,
    onSuccess: res => {
      console.log("login success", res);
      setTokenTemp(res.data);
      closePopup();
    },
  });

  const handleLogin = () => {
    run(account, password);
  };

  const handleCancel = () => {
    closePopup();
  };

  const handleRegister = () => {
    closePopup();
    store.dispatch(updateActivePopupType(PopupWindowType.USER_REGISTER));
  };

  return (
    <div className="user-login-window">
      <div className="login-form">
        <h2>Login</h2>

        <fieldset>
          <legend>account</legend>
          <input
            type="text"
            name="account"
            placeholder="Enter your Account"
            required
            value={account}
            onChange={e => setAccount(e.target.value)}
          />
        </fieldset>

        <fieldset>
          <legend>password</legend>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </fieldset>

        <div className="footer">
          <Button onClick={handleLogin}>Login</Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleRegister}>Register</Button>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPopup;
