import request from "../fetch";

const application_id = "659548";
const access_key = "27h8nKIoHcKjf2HU790z1P79Z8IXRtAvVGCyu4MQ09o";

export const getPicsFromUnsplash = async () =>
  request.get(
    `https://api.unsplash.com/search/photos?query=girls`,
    null,
    {
      Authorization: `${application_id} ${access_key}`,
    },
    { hasTokenInHeaders: false }
  );
