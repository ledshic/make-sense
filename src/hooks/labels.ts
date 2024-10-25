import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRequest } from "ahooks";

import { fetchLabelList } from "src/api/label/list";
import { getToken } from "src/utils/storage/token";

import { Settings } from "src/settings/Settings";
import type { AppState } from "src/store";
import { addLabel } from "src/api/label/add";
import { store } from "src";
import { updateLabelNames } from "src/store/labels/actionCreators";

const getLabels = async () => {
  const colorPalette = Settings.LABEL_COLORS_PALETTE;
  return fetchLabelList().then(res => {
    const labels = (res?.data ?? []).map((label, index) => ({
      id: label.labelId,
      name: label.name,
      color: colorPalette[index],
    }));
    store.dispatch(updateLabelNames(labels));
    return labels;
  });
};

const updateLabels = async (labelNames: { name: string; number: number }[]) => {
  return Promise.allSettled(labelNames.map(label => addLabel(label)));
};

export const useLabels = () => {
  const labels = useSelector((state: AppState) => state.labels.labels);

  const token = getToken();

  const { run: get } = useRequest(getLabels, { manual: true });
  const { run: update } = useRequest(updateLabels, { manual: true });

  useEffect(() => {
    console.log("labels << ", labels);
  }, [labels]);

  useEffect(() => {
    if (token) {
      get();
    }
  }, [token]);

  return { labels, update };
};
