export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }

  return null;
};

export const setCookie = (
  name: string,
  value: string | number,
  options?: string,
) => {
  document.cookie = `${name}=${value}; path=/; ${options}; ${
    globalThis.location.hostname !== "localhost" && "domain=.granado.com.br"
  }`;
};
