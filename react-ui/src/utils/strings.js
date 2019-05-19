export const getVerificationToken = queryString => {
  /* eslint-disable no-useless-escape */
  const tokenRegex = /.*(\?|\&)token=([^&]*)(\&.*|$)/;
  const matchArr = queryString.match(tokenRegex);
  if (matchArr == null || matchArr.length < 3) return;
  return matchArr[ 2 ];
}
