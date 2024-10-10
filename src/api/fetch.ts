/* eslint-disable no-console */
import qs from "qs";
import { MD5 } from "crypto-js";

import { store } from "../index";
import { submitNewNotification } from "../store/notifications/actionCreators";
import { NotificationUtil } from "../utils/NotificationUtil";
import { getToken, setTokenTemp } from "src/utils/storage/token";
import { updateActivePopupType } from "src/store/general/actionCreators";
import { PopupWindowType } from "src/data/enums/PopupWindowType";

export class ResponseError extends Error {}
export class ActionError extends Error {}

export interface ResError extends ResponseError {
  status: number | string;
  url: string;
  headers: any;
  responseText: string;
}
export interface ActError extends ActionError {
  code: number | string;
}

export interface RequestOptions {
  hasTokenInHeaders?: boolean;
  stringify?: boolean;
  signal?: any;
  mode?: "cors" | "no-cors";
}
export interface ListParams {
  page?: number;
  per_page?: number;
  orderby?: Record<string, string> | string;
  filters?: any;
  search?: any;
  fields?: string;
  id?: string;
}

type ExtendableListParams<T> = {
  [P in keyof T]?: T[P];
} & ListParams;

interface FetchResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

interface FetchListResponse<T> extends FetchResponse {
  data: T;
  total: number;
  current_page: number;
}

export const getAuthorization = () => {
  try {
    const str_token = getToken();
    return `Bearer ${str_token}`;
  } catch (err) {
    return "";
  }
};

export interface Request {
  get: <T = any>(
    url: string,
    params?: any,
    headers?: any,
    requestOptions?: RequestOptions
  ) => Promise<FetchResponse<T>>;
  post: (
    url: string,
    data: any,
    headers?: any,
    requestOptions?: RequestOptions
  ) => Promise<any>;
  put: (url: string, data: any, headers?: any) => Promise<any>;
  delete: (url: string, data: any, headers?: any) => Promise<any>;
  patch: (url: string, data: any, headers: any) => Promise<any>;
  head: (url: string, headers: any) => Promise<any>;
  getList: <T, U = unknown>(
    url: string,
    params?: ExtendableListParams<U>
  ) => Promise<FetchListResponse<T>>;
  upload: (
    url: string,
    data: FormData,
    headers?: any,
    requestOptions?: RequestOptions
  ) => Promise<any>;
}

const defaultHeaders = (hasToken = true, params?: any) => {
  let headers = {
    "X-Platform": "web",
    "x-client-type": "teacher",
    credentials: "include",
  };
  if (params) {
    let sign = "";
    Object.keys(params).map(key => {
      sign += `${key}=${params[key]}&`;
    });
    const timestamp = new Date().getTime();
    sign += `timestamp=${timestamp}&`;
    sign += "#outbook888";
    headers = Object.assign(headers, {
      sign: MD5(sign).toString().toLowerCase(),
      timestamp,
    });
  }

  if (hasToken) {
    Object.assign(headers, { Authorization: getAuthorization() });
  }

  return headers;
};

const jsonResponse: (response: any) => Promise<any> = async response => {
  try {
    console.log("response", response);
    if (!response.ok) {
      const error = new ResponseError("bad response") as ResError;
      error.status = response.status;
      error.message = response.statusText;
      error.url = response.url;
      error.headers = response.headers;
      error.responseText = await response.text();
      // 401 token过期
      if (response.status === 401) {
        error.message = "invalid token";
        setTokenTemp("");
        store.dispatch(updateActivePopupType(PopupWindowType.USER_LOGIN));
      }

      throw error;
    }
    const res = await response.json();
    if (Number(res.code) !== undefined && Number(res.code) !== 200) {
      const error = new ActionError("action fail") as ActError;
      error.code = res.code;
      error.message = res.message;

      throw error;
    }

    return res;
  } catch (error) {
    console.log("fetch error", error);
    store.dispatch(
      submitNewNotification(
        NotificationUtil.createErrorNotification({
          header: String((error as ActError).code),
          description: (error as ActError).message,
        })
      )
    );
    throw error;
  }
};

const request: Request = {
  get: async (url, params, headers, requestOptions) => {
    const { hasTokenInHeaders = true, signal } = requestOptions || {};
    const options = {
      headers: Object.assign(
        { "Content-Type": "application/json", Accept: "application/json" },
        defaultHeaders(hasTokenInHeaders),
        headers
      ),
      method: "GET",
      signal,
    };
    if (params) {
      url += "?";
      url += qs.stringify(params);
    }
    return fetch(url, options)
      .then(jsonResponse)
      .catch(err => {
        console.log("request failed", err);
        return Promise.reject(err);
      });
  },
  post: async (url, data, headers = {}, requestOptions) => {
    const {
      hasTokenInHeaders = true,
      stringify = true,
      signal,
    } = requestOptions || {};
    const options = {
      method: "POST",
      body: stringify ? JSON.stringify(data || "") : data || "",
      headers: Object.assign(
        { "Content-Type": "application/json", Accept: "application/json" },
        defaultHeaders(hasTokenInHeaders),
        headers
      ),
      signal,
      referrerPolicy: "no-referrer" as ReferrerPolicy,
      credential: "omit",
    };
    return fetch(url, options)
      .then(jsonResponse)
      .catch(err => {
        console.log("request failed", err);
      });
  },
  put: async (url, data, headers = {}) => {
    const options = {
      method: "PUT",
      body: JSON.stringify(data || ""),
      headers: Object.assign(defaultHeaders(), headers),
    };
    return fetch(url, options)
      .then(jsonResponse)
      .catch(err => {
        console.log("request failed", err);
      });
  },
  delete: (url, data, headers) => {
    const options = {
      method: "DELETE",
      body: JSON.stringify(data || ""),
      headers: Object.assign(defaultHeaders(), headers),
    };
    return fetch(url, options)
      .then(jsonResponse)
      .catch(err => {
        console.log("request failed", err);
      });
  },
  patch: async (url, data, headers = {}) => {
    const options = {
      method: "POST",
      body: JSON.stringify(data || ""),
      headers: Object.assign(defaultHeaders(), headers),
    };
    return fetch(url, options)
      .then(jsonResponse)
      .catch(err => {
        console.log("request failed", err);
      });
  },
  head: async (url, headers) => {
    const options = {
      method: "HEAD",
      headers: Object.assign(defaultHeaders(), headers),
    };
    return fetch(url, options)
      .then(jsonResponse)
      .catch(err => {
        console.log("request failed", err);
      });
  },
  getList: async (url, params) => {
    const {
      page = 1,
      per_page = -1,
      filters = {},
      fields = "",
      search,
      id,
      ...rest
    } = params || {
      page: 1,
      per_page: -1,
      filters: {},
      fields: "",
      search: undefined,
      id: undefined,
    };
    let { orderby } = params || {};
    const query = {} as any;
    if (id) {
      url += `/${id.toString()}`;
    } else {
      if (!orderby) orderby = JSON.stringify([["created_at", "desc"]]);
      query.page = page || 1;
      query.per_page = per_page || -1;
    }
    orderby && (query.orderby = orderby);
    filters && (query.filters = JSON.stringify(filters));
    fields && (query.fields = fields.toString());
    search && (query.search = JSON.stringify(search));
    Object.keys(rest).forEach(key => {
      const additionalParams = (rest as { [key: string]: string })[key];
      if (additionalParams !== undefined && additionalParams !== null)
        query[key] = additionalParams;
    });

    return fetch(`${url}?${qs.stringify(query)}`, { headers: defaultHeaders() })
      .then(jsonResponse)
      .catch(err => {
        console.log("request failed", err);
      });
  },
  upload: async (url, data, headers = {}, requestOptions) => {
    const { hasTokenInHeaders = true } = requestOptions || {};

    const options = {
      method: "POST",
      body: data,
      headers: Object.assign(defaultHeaders(hasTokenInHeaders), headers),
    };
    return fetch(url, options)
      .then(jsonResponse)
      .catch(err => {
        console.log("request failed", err);
      });
  },
};

export default { ...request, getList: request.getList };
