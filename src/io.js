/**
 * Created by count on 14/02/17.
 */
// @flow

import fs from 'fs';
import path from 'path';

export const writeFile = (fileName, fileData) => fs.writeFileSync(fileName, fileData);

export const makeFileName = (filePath, url) =>
  `${path.join(filePath, url.replace(/https?:\/\//g, '').replace(/[^A-Za-z]/g, '-'))}.html`;

