import { useState } from "react";
import { Button } from "@mui/material";
import { useRequest } from "ahooks";

import { login } from "../../../api/auth/login";
import { register } from "../../../api/user/register";
import { PopupActions } from "../../../logic/actions/PopupActions";
import { store } from "../../../index";
import { updateActivePopupType } from "../../../store/general/actionCreators";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";

import "./UserRegisterPopup.scss";

const UserRegisterPopup = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const closePopup = () => {
    PopupActions.close();
  };

  const { run: sendLogin } = useRequest(login, {
    manual: true,
    onSuccess: res => {
      console.log("login success", res);
      sessionStorage.setItem("outbook-token", res.data);
      closePopup();
    },
    onError: err => {
      console.log("login error", err);
      store.dispatch(updateActivePopupType(PopupWindowType.USER_LOGIN));
    },
  });

  const { run } = useRequest(register, {
    manual: true,
    onSuccess: res => {
      console.log("register success", res);
      sendLogin(account, password);
    },
    onError: err => {
      console.log("register error", err);
    },
  });

  const handleRegister = () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("password and confirm password are not the same");
      }

      run(account, password);
    } catch (err) {
      console.log("register error", err);
    }
  };

  const handleCancel = () => {
    closePopup();
  };

  const handleBackToLogin = () => {
    closePopup();
    store.dispatch(updateActivePopupType(PopupWindowType.USER_LOGIN));
  };

  return (
    <div className="user-login-window">
      <div className="login-form">
        <h2>Register</h2>

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

        <fieldset>
          <legend>confirm password</legend>
          <input
            type="password"
            name="confirm-password"
            placeholder="Enter your password again"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </fieldset>

        <div className="footer">
          <Button onClick={handleRegister}>Register</Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleBackToLogin}>back to Login</Button>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterPopup;
