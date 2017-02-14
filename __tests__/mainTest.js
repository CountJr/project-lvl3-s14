/**
 * Created by count on 13/02/17.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import nock from 'nock';
import loader from '../src/';

const webPageContents = '<h1>get it!</h1>';
const tempDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
const fileName = 'count-cz-courses-html.html';
const url = 'http://count.cz/courses.html';

test('load of plain html page without parsing', (done) => {
  nock.disableNetConnect();

  nock('http://count.cz')
    .get('/courses.html')
    .reply(200, webPageContents);

  loader(url, tempDir)
    .then(() => {
      expect(fs.accessSync(path.join(tempDir, fileName))).toBeFalsy();
      expect(fs.readFileSync(path.join(tempDir, fileName), 'utf-8')).toEqual(webPageContents);
      done();
    })
    .catch((err) => {
      console.log(err);
      expect(true).toBe(false);
    });
});
