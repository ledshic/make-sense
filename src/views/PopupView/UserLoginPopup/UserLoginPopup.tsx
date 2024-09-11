import { useState } from "react";
import { Button } from "@mui/material";
import { useRequest } from "ahooks";

import { login } from "../../../api/user/login";
import { PopupActions } from "../../../logic/actions/PopupActions";

import "./UserLoginPopup.scss";

const UserLoginPopup = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const closePopup = () => {
    PopupActions.close();
  };

  const { run } = useRequest(login, {
    manual: true,
    onSuccess: res => {
      console.log("res", res);
    },
  });

  const handleLogin = () => {
    run(account, password);
  };

  const handleCancel = () => {
    closePopup();
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
        </div>
      </div>
    </div>
  );
};

export default UserLoginPopup;
