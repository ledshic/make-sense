import { connect } from "react-redux";
import { Avatar, Button } from "@mui/material";

import { store } from "../../../index";
import { updateActivePopupType } from "../../../store/general/actionCreators";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import type { AppState } from "../../../store";
import { getToken } from "src/utils/storage/token";

const mapStateToProps = (state: AppState) => state;

type IProps = ReturnType<typeof mapStateToProps>;

const LoginButton: React.FC<IProps> = () => {
  const handleLogin = () => {
    store.dispatch(updateActivePopupType(PopupWindowType.USER_LOGIN));
  };

  let token = null;
  try {
    token = getToken();
  } catch (error) {
    console.log("error", error);
    token = null;
  }

  return (
    <>
      {token ? (
        <Avatar sx={{ width: 24, height: 24 }} />
      ) : (
        <Button onClick={handleLogin}>
          <span style={{ color: "#fff" }}>Login</span>
        </Button>
      )}
    </>
  );
};

export default connect(mapStateToProps)(LoginButton);
