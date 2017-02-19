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
    .catch((e) => {
      done.fail(e);
    });
});

test('2nd step tests', async (done) => {
  nock.disableNetConnect();
  nock('http://count.cz')
    .get('/very-big.one.html')
    .replyWithFile(200, path.join(__dirname, 'fixtures', 'very-big.one.html'));
  nock('http://count.cz')
    .get('/files/favicon-8fa102c058afb01de5016a155d7db433283dc7e08ddc3c4d1aef527c1b8502b6.ico')
    .replyWithFile(200, path.join(__dirname, 'fixtures', 'files', 'favicon-8fa102c058afb01de5016a155d7db433283dc7e08ddc3c4d1aef527c1b8502b6.ico'));
  nock('http://count.cz')
    .get('/files/main.css')
    .replyWithFile(200, path.join(__dirname, 'fixtures', 'files', 'main.css'));
  nock('https://cdn2.hexlet.io')
    .get('/assets/icons/default/favicon-128-a9446dd4e081479874e0c59b63960612d181b05b10b2fbd544a7da7c5f6ead2a.png')
    .replyWithFile(200, path.join(__dirname, 'fixtures', 'files', 'favicon-128-a9446dd4e081479874e0c59b63960612d181b05b10b2fbd544a7da7c5f6ead2a.png'));
  nock('http://count.cz')
    .get('/files/fail.js')
    .replyWithFile(200, path.join(__dirname, 'fixtures', 'files', 'fail.js'));

  const tempDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  const url = 'http://count.cz/very-big.one.html';
  const fileName = 'count-cz-very-big-one-html.html';
  const folderName = 'count-cz-very-big-one-html_files';
  const expected = fs.readFileSync(path.join(__dirname, 'fixtures', 'very-big-expect.html'), 'utf-8');

  await loader(url, tempDir);
  expect(fs.readFileSync(path.join(tempDir, fileName), 'utf-8')).toEqual(expected);
  expect(fs.readdirSync(path.join(tempDir, folderName)).length).toBe(4);
  done();
});
