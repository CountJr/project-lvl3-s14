/**
 * Created by count on 13/02/17.
 */
// @flow

import fs from 'fs';
import os from 'os';
import path from 'path';
import nock from 'nock';
import loader from '../src/';

test('1st step tests', (done) => {
  const webPageContents = '<h1>get it!</h1>';
  const tempDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  const fileName = 'count-cz-courses-html.html';
  const url = 'http://count.cz/courses.html';
  nock.disableNetConnect();

  nock('http://count.cz')
    .get(/.*/)
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
test('2nd step tests', (done) => {
  nock.enableNetConnect();
  nock.cleanAll();
  // TODO: nock the fixtures folder
  const tempDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  const url = 'http://count.cz/very-big.one.html';
  const fileName = 'count-cz-very-big-one-html.html';
  // const folderName = 'count-cz-very-big-one-html_files';
  const expected = fs.readFileSync(path.join(__dirname, 'fixtures', 'very-big-expect.html'), 'utf-8');

  loader(url, tempDir)
    .then(() => {
      expect(fs.readFileSync(path.join(tempDir, fileName), 'utf-8')).toEqual(expected);
      // console.log(fs.readdirSync(path.join(tempDir, folderName)));
      // expect(fs.readdirSync(path.join(tempDir, folderName)).length).toBe(4);
      done();
    }).catch((err) => {
      console.log(err);
      expect(true).toBe(false);
    });
});
