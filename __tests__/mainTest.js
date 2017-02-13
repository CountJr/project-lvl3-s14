/**
 * Created by count on 13/02/17.
 */
// import path from 'path';
import nock from 'nock';
import loader from '../src/index';

const webPageContents = '<h1>get it!</h1>';

nock('http://count.cz')
  .get('/courses')
  .reply(200, webPageContents);

test('begin', () => {
  loader('http://count.cz/courses').then(res => expect(res).toEqual(webPageContents));
});
