import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/performance.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
  .replace("from 'svelte/store'", `from '${import.meta.resolve('svelte/store')}'`);
const { classify, effectiveMode } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);
const signals = { threads: 8, memory: 8, saveData: false, reducedMotion: false, width: 1920, height: 1080, touch: false };

test('high capability receives high mode', () => assert.deepEqual(classify(signals), { mode: 'high', score: 4 }));
test('mid-range device receives medium mode', () => assert.equal(classify({ ...signals, threads: 4, memory: 4 }).mode, 'medium'));
test('limited CPU or memory caps auto at basic', () => {
  assert.equal(classify({ ...signals, threads: 2 }).mode, 'basic');
  assert.equal(classify({ ...signals, memory: 2 }).mode, 'basic');
});
test('unknown hardware uses neutral scores', () => assert.deepEqual(classify({ ...signals, threads: null, memory: null }), { mode: 'medium', score: 2 }));
test('data saver and reduced motion select basic', () => {
  assert.equal(classify({ ...signals, saveData: true }).mode, 'basic');
  assert.equal(classify({ ...signals, reducedMotion: true }).mode, 'basic');
});
test('touch and screen size alone never penalize capable devices', () => assert.equal(classify({ ...signals, width: 390, height: 844, touch: true }).mode, 'high'));
test('manual override works unless reduced motion is requested', () => {
  assert.equal(effectiveMode('high', 'basic', false), 'high');
  assert.equal(effectiveMode('auto', 'medium', false), 'medium');
  assert.equal(effectiveMode('high', 'high', true), 'basic');
});