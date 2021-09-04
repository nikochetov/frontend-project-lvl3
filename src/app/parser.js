// const parseXml = (xml) => {
//   const parser = new DOMParser();
//   return parser.parseFromString(xml, 'application/xml');
// };
//
// const createObj = (elem) => {
//   return Array.from(elem.children).reduce((acc, cur) => {
//     return { ...acc, [cur.tagName]: cur.textContent };
//   }, {});
// };
//
// const parseHtml = (html) => {
//   console.log(html)
//   const channel = html.querySelector('channel');
//   const channelObj = createObj(channel);
//   const items = channel.querySelectorAll('item');
//   const itemsOdj = Array.from(items).map((item) => {
//     return createObj(item);
//   });
//
//   return ({
//     ...channelObj, items: itemsOdj,
//   });
// };
//

// const parsedHtml = (html) => {
//
// }
//
// export default (data) => {
//   const parsedXml = parseXml(data);
//   const parsedHtml = parseHtml(parsedXml);
//   console.log(parsedHtml)
// };
