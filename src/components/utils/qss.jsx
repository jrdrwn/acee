import QueryString from 'qs';

export default function QSS(obj, opts = {}) {
  return QueryString.stringify(obj, {
    ...opts,
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });
}
