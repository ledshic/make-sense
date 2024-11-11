import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";

import { useLabels } from "src/hooks/labels";
import { Settings } from "src/settings/Settings";
import { updateActivePopupType } from "src/store/general/actionCreators";
import { PopupWindowType } from "src/data/enums/PopupWindowType";
import { updateActiveLabelNameId } from "src/store/labels/actionCreators";

import "./TopLabelEditor.scss";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: "1px solid transparent",
    },
}));

export const TopLabelEditor = () => {
  const dispatch = useDispatch();
  const { labels } = useLabels();
  const colorPalette = Settings.LABEL_COLORS_PALETTE;

  const handleLabelClick = label => {
    dispatch(updateActiveLabelNameId(label.id));
  };

  return (
    <div className="TopLabelEditor">
      <div className="TopLabelEditor__label">标签:</div>
      <div className="TopLabelEditor__list">
        <StyledToggleButtonGroup>
          {labels.map((label, index) => (
            <ToggleButton
              key={index}
              value={index}
              onClick={() => handleLabelClick(label)}
            >
              <span
                className="TopLabelEditor__list-item"
                style={{ color: colorPalette[index] }}
              >
                {label.name}
              </span>
            </ToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          dispatch(updateActivePopupType(PopupWindowType.UPDATE_LABEL))
        }
      >
        添加标签
      </Button>
    </div>
  );
};
