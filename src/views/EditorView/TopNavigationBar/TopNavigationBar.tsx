import React from "react";
import { connect } from "react-redux";
import { Button } from "@mui/material";

import TextInput from "../../Common/TextInput/TextInput";
import { ProjectData } from "../../../store/general/types";
import DropDownMenu from "./DropDownMenu/DropDownMenu";
import StateBar from "../StateBar/StateBar";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import LoginButton from "../../Common/LoginButton/LoginButton";

import {
  updateActivePopupType,
  updateProjectData,
} from "../../../store/general/actionCreators";

import type { AppState } from "../../../store";

import "./TopNavigationBar.scss";

interface IProps {
  updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
  updateProjectDataAction: (projectData: ProjectData) => any;
  projectData: ProjectData;
}

const TopNavigationBar: React.FC<IProps> = props => {
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setSelectionRange(0, event.target.value.length);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase().replace(" ", "-");

    props.updateProjectDataAction({
      ...props.projectData,
      name: value,
    });
  };

  const closePopup = () =>
    props.updateActivePopupTypeAction(PopupWindowType.EXIT_PROJECT);

  const handleSubmit = () => {
    props.updateActivePopupTypeAction(PopupWindowType.SUBMIT_ANNOTATIONS);
  };

  return (
    <div className="TopNavigationBar">
      <StateBar />
      <div className="TopNavigationBarWrapper">
        <div className="NavigationBarGroupWrapper">
          {/* <div className="Header" onClick={closePopup}>
            <img
              draggable={false}
              alt={"make-sense"}
              src={"/make-sense-ico-transparent.png"}
            />
            Make Sense
          </div> */}
        </div>
        <div className="NavigationBarGroupWrapper">
          <DropDownMenu />
        </div>
        <div className="NavigationBarGroupWrapper middle">
          <div className="ProjectName">名称:</div>
          <TextInput
            isPassword={false}
            value={props.projectData.name}
            onChange={onChange}
            onFocus={onFocus}
          />
        </div>
        <div className="NavigationBarGroupWrapper">
          <LoginButton />
          <Button onClick={handleSubmit}>
            <span style={{ color: "#fff" }}>提交</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  updateActivePopupTypeAction: updateActivePopupType,
  updateProjectDataAction: updateProjectData,
};

const mapStateToProps = (state: AppState) => ({
  projectData: state.general.projectData,
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigationBar);
