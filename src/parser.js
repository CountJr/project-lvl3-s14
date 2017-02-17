/**
 * Created by count on 16/02/17.
 */
// @flow

import cheerio from 'cheerio';
import path from 'path';

// TODO: avoid mutations there
const parseData = (data, folder, tag, attr) => {
  const links = [];
  data(tag)
    .attr(attr, (arr, str) => {
      if (str) {
        // console.log(str)
        links.push(str);
        return `${folder}/${path.basename(str)}`;
      }
      return null;
    });
  return { src: data, links };
};

const parseMap = {
  link: ['link', 'href'],

  script: ['script', 'src'],
};

const parsePage = (src, folder) => {
  const $ = cheerio.load(src);
  const result = Object.keys(parseMap).reduce((acc, type) => {
    const parsedType = parseData($, folder, ...parseMap[type]);
    return { src: parsedType.src, linksToDl: [...acc.linksToDl, ...parsedType.links] };
  }, { src: $, linksToDl: [] });
  return [result.src.html(), result.linksToDl];
};

export default parsePage;
