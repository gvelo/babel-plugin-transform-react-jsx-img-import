import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';

import transformReactImg from '../src';
import transformSyntaxJSX from 'babel-plugin-syntax-jsx';
import transformReactJSX from 'babel-plugin-transform-react-jsx';



function trim (str) {
  return str.replace(/^\s+|\s+$/, '');
}

function runFixture( fixtureName ) {

  const fixturesDir = path.join(__dirname, 'fixtures');
  const fixtureDir = path.join(fixturesDir, fixtureName);
  const actualPath = path.join(fixtureDir, 'actual.js');

  const actual = transformFileSync(actualPath, {
    plugins: [ transformSyntaxJSX, transformReactJSX, transformReactImg ],
  }).code;

  const expected = fs.readFileSync(
    path.join(fixtureDir, 'expected.js')
  ).toString();

  assert.equal(trim(actual), trim(expected));

}

describe('Transform jsx images', () => {

  it('should generate an import for the img src when img src is literal',() => {
    runFixture('importImg')
  });

  it('should generate a unique defaultMember import for each img when multiple img are processed',() => {
    runFixture('importMultipleImg')
  });

  it('should not generate imports when img has a computed src atribute',() => {
    runFixture('importNonLiteralsSrc')
  });

  it('should generate only one import for multiples img when img src are the same',() => {
    runFixture('importSameImg')
  });

  it('should not generate import if img src is a url',() => {
    runFixture('ignoreURL')
  });


});
