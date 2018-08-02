export const getCookie = (key) => {
  const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
  if (match) return match[2];
  else return null;
}

export const deleteCookie = (key) => {
  document.cookie = `${key}=; Max-Age=-99999999;`;
}
