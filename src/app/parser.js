const parseXml = (xml) => {
  const parser = new DOMParser();
  return parser.parseFromString(xml, 'application/xml');
};

const parseXmlToObj = (elems) => Array.from(elems).reduce((acc, current) => {
  if (current.childElementCount) {
    const items = acc.items || [];
    return ({ ...acc, items: [...items, parseXmlToObj(current.children)] });
  }

  return ({ ...acc, [current.tagName]: current.textContent });
}, {});

const getChannel = (html) => html.querySelector('channel');

export default (xmlData) => {
  const htmlData = parseXml(xmlData);
  const channel = getChannel(htmlData);
  return parseXmlToObj(channel.children);
};
