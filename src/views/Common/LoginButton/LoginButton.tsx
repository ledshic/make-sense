import { connect } from "react-redux";
import { Avatar, Button } from "@mui/material";

import { store } from "../../../index";
import { updateActivePopupType } from "../../../store/general/actionCreators";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import type { AppState } from "../../../store";

const mapStateToProps = (state: AppState) => state;

type IProps = ReturnType<typeof mapStateToProps>;

const LoginButton: React.FC<IProps> = () => {
  const handleLogin = () => {
    store.dispatch(updateActivePopupType(PopupWindowType.USER_LOGIN));
  };

  let token = null;
  try {
    token = sessionStorage.getItem("outbook-token");
  } catch (error) {
    console.log("error", error);
    token = null;
  }

  return (
    <>
      {token ? <Avatar sx={{ width: 24, height: 24 }} /> : null}
      <Button onClick={handleLogin}>
        <span style={{ color: "#fff" }}>Login</span>
      </Button>
    </>
  );
};

export default connect(mapStateToProps)(LoginButton);
