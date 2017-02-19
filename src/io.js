/**
 * Created by count on 14/02/17.
 */
// @flow

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export const buildTargetPath = (targetPath) => {
  const fullPath = path.resolve(__dirname, targetPath);
  mkdirp.sync(fullPath);
  return fullPath;
};

export const writeFile = (fileName, fileData) => fs.writeFile(fileName, fileData);

