/**
 * Created by count on 13/02/17.
 */
// @flow

import fs from 'mz/fs';
import os from 'os';
import path from 'path';
import nock from 'nock';
import loader from '../src/';

beforeEach(() => {
  nock.disableNetConnect();
});

test('1st step tests', async (done) => {
  const webPageContents = '<h1>get it!</h1>';
  const tempDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  const fileName = 'count-cz-courses-html.html';
  const url = 'http://count.cz/courses.html';

  nock('http://count.cz')
    .get(/.*/)
    .reply(200, webPageContents);

  try {
    await loader(url, tempDir);
    expect(await fs.access(path.join(tempDir, fileName))).toBeFalsy();
    expect(await fs.readFile(path.join(tempDir, fileName), 'utf-8')).toEqual(webPageContents);
    done();
  } catch (e) {
    done.fail(e);
  }
});

test('2nd step tests', async (done) => {
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

  try {
    const result = await loader(url, tempDir);
    const mainFile = await fs.readFile(path.join(tempDir, fileName), 'utf-8');
    const subFiles = await fs.readdir(path.join(tempDir, folderName));
    expect(mainFile).toEqual(expected);
    expect(subFiles.length).toBe(4);
    expect(result).toBe('done');
    done();
  } catch (e) {
    done.fail(e);
  }
});

test('4th step. looooots of errors expected', async (done) => {
  expect(true).toBe(true);
  done();
});
