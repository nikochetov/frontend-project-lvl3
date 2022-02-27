const parseXml = (xml) => {
  const parser = new DOMParser();
  return parser.parseFromString(xml, 'application/xml');
};

const isRss = (xmlData) => {
  const parsedXmlData = parseXml(xmlData);
  const rssElem = parsedXmlData.querySelector('rss');
  return !!rssElem;
};

const parseXmlToObj = (elems) => Array.from(elems).reduce((acc, current) => {
  if (current.childElementCount) {
    const items = acc.items || [];
    return ({ ...acc, items: [...items, parseXmlToObj(current.children)] });
  }

  return ({ ...acc, [current.tagName]: current.textContent });
}, {});

const getChannel = (html) => html.querySelector('channel');

const parseRssXml = (xmlData) => {
  const htmlData = parseXml(xmlData);
  const channel = getChannel(htmlData);
  return parseXmlToObj(channel.children);
};

export {
  parseXml, parseXmlToObj, getChannel, parseRssXml, isRss,
};
