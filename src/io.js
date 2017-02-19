/**
 * Created by count on 14/02/17.
 */
// @flow

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export const buildTargetPath = (targetPath) => {
  const fullPath = path.resolve(__dirname, targetPath);
  mkdirp(fullPath);
  return fullPath;
};

export const writeFile = (p, c) => fs.writeFile(p, c);
