const parseXml = (xml) => {
  const parser = new DOMParser();
  return parser.parseFromString(xml, 'application/xml');
};

const parseXmlToObj = (elems) => {
  return Array.from(elems).reduce((acc, current) => {
    if (current.childElementCount) {
      const items = acc.items || [];
      return ({ ...acc, items: [...items, parseXmlToObj(current.children)] });
    }

    return ({ ...acc, [current.tagName]: current.textContent });
  }, {});
};

const setIds = (parsedData) => {
  const itemsWithId = parsedData.items.map((item) => ({ ...item }));
  return ({ ...parsedData, items: itemsWithId });
};

const getChannel = (html) => html.querySelector('channel');

export default (xmlData) => {
  const htmlData = parseXml(xmlData);
  const channel = getChannel(htmlData);
  const parsedData = parseXmlToObj(channel.children);
  return setIds(parsedData);
};
