/**
 * Created by count on 13/02/17.
 */
// @flow

import axios from 'axios';
import fs from 'mz/fs';
import os from 'os';
import url from 'url';
import path from 'path';
import parser from './parser';

const parseUrl = (sourceUrl, targetPath) => {
  const parsedUrl = url.parse(sourceUrl);
  const { hostname, pathname } = parsedUrl;
  const baseFileName = `${hostname}${pathname}`.replace(/[^A-Za-z0-9]/g, '-');
  return {
    baseFilename: baseFileName,
    filename: `${baseFileName}.html`,
    filePath: `${baseFileName}_files`,
    outputPath: path.resolve(__dirname, targetPath),
    baseUrl: parsedUrl.href.replace(parsedUrl.pathname, ''),
  };
};

const loader = async (sourceUrl, targetPath = '.') => {
  try {
    // TODO: refuse if target exists or unavaible, check for tmp.
    const tmpFolder = await fs.mkdtemp(`${os.tmpdir()}${path.sep}`);
    const config = parseUrl(sourceUrl, targetPath);
    // TODO: catch failed download from http
    const resp = await axios.get(sourceUrl);
    // TODO: any errors in parse??? have to think about.
    const [parsedPage, links] = parser(resp.data, config.filePath);
    // TODO: yoooohooooo!!!
    fs.writeFile(path.join(tmpFolder, config.filename), parsedPage);
    // TODO: same as previous
    await fs.mkdir(path.join(tmpFolder, config.filePath));
    await fs.mkdir(path.join(targetPath, config.filePath));
    const load = link =>
      axios.get(link, { baseURL: config.baseUrl, responseType: 'arraybuffer' })
        .then(response => fs.writeFile(path.join(tmpFolder,
          config.filePath, path.basename(link)), response.data));
    await Promise.all(links.map(load));
    // TODO: recursive move files routing needed
    fs.rename(path.join(tmpFolder, config.filename), path.join(targetPath, config.filename));
    links.map(link => fs.rename(path.join(tmpFolder, config.filePath, path.basename(link)),
      path.join(targetPath, config.filePath, path.basename(link))));
    return Promise.resolve('done');
  } catch (e) {
    if (e.code === 'ENOENT') {
      return Promise.reject(`Error: Taz can't find file or folder ${e.path}`);
    }
    if (e.response) {
      return Promise.reject(`Error: Taz scared of ${e.response.status} from ${e.response.config.url}`);
    }
    return Promise.reject(`Error: Taz confused. He found '${e}'`);
  }
};


export default loader;
