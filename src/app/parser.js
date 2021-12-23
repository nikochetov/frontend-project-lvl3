const parseXmlToHtml = (xml) => {
  const parser = new DOMParser();
  return parser.parseFromString(xml, 'application/xml');
};

const parseHtmlToObj = (elems) => {
  return Array.from(elems).reduce((acc, current) => {
    if (current.childElementCount) {
      const items = acc.items || [];
      return ({ ...acc, items: [...items, parseHtmlToObj(current.children)] });
    }

    return ({ ...acc, [current.tagName]: current.textContent });
  }, {});
};

const getRssChannel = (html) => html.querySelector('channel');

export default (data) => {
  const parsedXml = parseXmlToHtml(data);
  const channel = getRssChannel(parsedXml);
  return parseHtmlToObj(channel);
};
