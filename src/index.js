/**
 * Created by count on 13/02/17.
 */
// @flow

import axios from 'axios';
import fs from 'fs';
import url from 'url';
import path from 'path';
import { writeFile, buildTargetPath } from './io';
import parser from './parser';

const parseUrl = (sourceUrl, targetPath) => {
  const parsedUrl = url.parse(sourceUrl);
  const { hostname, pathname } = parsedUrl;
  const baseFileName = `${hostname}${pathname}`.replace(/[^A-Za-z0-9]/g, '-');
  return {
    baseFilename: baseFileName,
    filename: `${baseFileName}.html`,
    filePath: `${baseFileName}_files`,
    outputPath: buildTargetPath(targetPath),
    baseUrl: parsedUrl.href.replace(parsedUrl.pathname, ''),
  };
};

const dlFiles = (links, config) => {
  const load = (link) => {
    axios.get(link, { baseURL: config.baseUrl, responseType: 'arraybuffer' })
      .then(response =>
        writeFile(path.join(config.outputPath,
          config.filePath, path.basename(link)), response.data));
  };
  return Promise.all(links.map(load));
};

const loader = (sourceUrl, targetPath = '.') =>
  axios.get(sourceUrl)
    .then((resp) => {
      const config = parseUrl(sourceUrl, targetPath);
      const [parsedPage, links] = parser(resp.data, config.filePath);
      writeFile(path.join(config.outputPath, config.filename), parsedPage);
      fs.mkdirSync(path.join(config.outputPath, config.filePath));

      return dlFiles(links, config);
    });


export default loader;
