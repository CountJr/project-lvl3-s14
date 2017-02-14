/**
 * Created by count on 13/02/17.
 */
// @flow

import axios from 'axios';
import { writeFile, makeFileName } from './io';

const loader = (url, path) => axios.get(url)
  .then((response) => {
    const fileName = makeFileName(path, url);
    console.log(fileName);
    writeFile(fileName, response.data);
  },
  )
  .catch((error) => {
    // error
    console.log(error);
  });

export default loader;
