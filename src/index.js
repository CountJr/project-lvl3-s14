/**
 * Created by count on 13/02/17.
 */
// @flow

import axios from 'axios';
import { writeFile, buildFileName } from './io';

const loader = (url, path) => axios.get(url)
  .then((response) => {
    const fileName = buildFileName(path, url);
    writeFile(fileName, response.data);
  },
  )
  .catch((error) => {
    // error
    console.log(error);
  });

export default loader;
