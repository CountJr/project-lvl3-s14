/**
 * Created by count on 16/02/17.
 */
// @flow

import cheerio from 'cheerio';
import path from 'path';

const parseMap = {
  link: 'href',
  script: 'src',
};

const parsePage = (src, folder) => {
  const $ = cheerio.load(src);

  const links = Object.keys(parseMap).reduce((acc, type) =>
    [...acc, ...$(type).map((x, y) => $(y).attr(parseMap[type])).get()],
    []);

  const parsedSrc = links.reduce((a, l) => a.replace(l, `${folder}/${path.basename(l)}`), src);
  return [parsedSrc, links];
};

export default parsePage;
