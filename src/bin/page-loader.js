/**
 * Created by count on 13/02/17.
 */
import commander from 'commander';
import pjson from '../../package.json';
import loader from '../index';

commander
  .version(pjson.version)
  .description(pjson.description)
  .option('--output [dir]', 'Output directory', './')
  .arguments('<url>')
  .action((url) => {
    loader(url, commander.output).then(res => console.log(res));
  });

commander
  .parse(process.argv);

if (!commander.args.length) commander.help();
