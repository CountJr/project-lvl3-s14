/**
 * Created by count on 13/02/17.
 */
// import path from 'path';
import nock from 'nock';
import loader from '../src/index';

const mockHexlet = nock('http://count.cz')
  .get('/courses')
  .reply(200, 'get it!');

test('begin', () => {
  loader('http://count.cz/courses').then(res => expect(res).toEqual('get it!'));
});
