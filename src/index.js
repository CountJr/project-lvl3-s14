/**
 * Created by count on 13/02/17.
 */

import axios from 'axios';

const loader = url => axios.get(url)
  .then(response =>
    response.data,
  )
  .catch((error) => {
    // error
    console.log(error);
  });

export default loader;
