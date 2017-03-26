import {assert} from 'chai';
import * as path from 'path';
import {Analyzer, FSUrlLoader} from 'polymer-analyzer';

import {generateDatabindingCode} from '../gen-ts';

const fixturesDir = path.join(__dirname, '..', '..', 'src', 'test', 'fixtures');
suite('generateDatabindingCode', () => {
  test('basic-elem', async() => {
    const analyzer = new Analyzer(
        {urlLoader: new FSUrlLoader(path.join(fixturesDir, 'basic-elem'))});
    const pkg = await analyzer.analyzePackage();
    const result = generateDatabindingCode(pkg);
    assert.deepEqual(
        result,
        (await analyzer.analyze('expected.js')).parsedDocument.contents);
  });
});
