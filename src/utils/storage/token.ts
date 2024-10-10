const prefix = "outbook-";

export function setToken(token: string) {
  localStorage.setItem(`${prefix}token`, token);
}

export function setTokenTemp(token: string) {
  sessionStorage.setItem(`${prefix}token`, token);
}

export function getToken() {
  try {
    const tokenTemp = sessionStorage.getItem(`${prefix}token`);
    const tokenPresist = localStorage.getItem(`${prefix}token`);

    if (tokenTemp || tokenPresist) {
      return tokenTemp || tokenPresist;
    } else {
      throw new Error("Token not found");
    }
  } catch (err) {
    return null;
  }
}
