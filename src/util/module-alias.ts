import * as path from 'path';
import ma from 'module-alias';

const files = path.resolve(__dirname, '../../');

ma.addAliases({
  '@src': path.resolve(files, 'src'),
  '@test': path.resolve(files, 'test'),
});
