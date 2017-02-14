/**
 * Created by count on 13/02/17.
 */

import fs from 'fs';
import path from 'path';
import nock from 'nock';
import loader from '../src/index';

const webPageContents = '<h1>get it!</h1>';
const tempDir = fs.mkdtempSync(`/tmp${path.sep}`);
const fileName = 'count-cz-courses';
const url = 'http://count.cz/courses';

nock.disableNetConnect();

nock('http://count.cz')
  .get('/courses')
  .reply(200, webPageContents);

test('begin', () => loader(url, tempDir)
    .then(() => {
      expect(fs.accessSync(path.join(tempDir, fileName))).toBeFalsy();
      expect(fs.readFileSync(path.join(tempDir, fileName), 'utf-8')).toEqual(webPageContents);
    })
    .catch((err) => {
      console.log(err);
      expect(true).toBe(false);
    }));
