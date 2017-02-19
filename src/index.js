/**
 * Created by count on 13/02/17.
 */
// @flow

import axios from 'axios';
import fs from 'mz/fs';
import os from 'os';
import url from 'url';
import path from 'path';
import { buildTargetPath } from './io';
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

const writeFile = (p, c) => fs.writeFile(p, c);

const loader = async (sourceUrl, targetPath = '.') => {
  const tmpFolder = await fs.mkdtemp(`${os.tmpdir()}${path.sep}`);
  const config = await parseUrl(sourceUrl, targetPath);
  const resp = await axios.get(sourceUrl);
  const [parsedPage, links] = await parser(resp.data, config.filePath);
  await writeFile(path.join(tmpFolder, config.filename), parsedPage);
  await fs.mkdir(path.join(tmpFolder, config.filePath));
  await fs.mkdir(path.join(targetPath, config.filePath));
  const load = link =>
    axios.get(link, { baseURL: config.baseUrl, responseType: 'arraybuffer' })
      .then(response => writeFile(path.join(tmpFolder,
          config.filePath, path.basename(link)), response.data))
      .then(() => {
        fs.rename(path.join(tmpFolder, config.filePath, path.basename(link)),
          path.join(targetPath, config.filePath, path.basename(link)));
      });
  await Promise.all(links.map(load))
    .then(() => fs.readdir(path.join(tmpFolder, config.filePath)));
  await fs.rename(path.join(tmpFolder, config.filename), path.join(targetPath, config.filename));
};


export default loader;
