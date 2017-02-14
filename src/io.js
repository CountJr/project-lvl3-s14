/**
 * Created by count on 14/02/17.
 */
// @flow

import fs from 'fs';
import path from 'path';

export const writeFile = (fileName, fileData) => fs.writeFileSync(fileName, fileData);

export const makeFileName = (path2, url) =>
  path.join(path2, url.replace(/https?:\/\//g, '').replace(/[^A-Za-z]/g, '-'));
