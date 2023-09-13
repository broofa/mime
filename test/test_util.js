import assert from 'assert';

export function testGetType(t, mime, tests) {
  for (const { input, expected } of tests) {
    assert.equal(
      mime.getType(input),
      expected,
      `${t.name}: ${input}, ${expected}`,
    );
  }
}

export function testGetExtension(t, mime, tests) {
  for (const { input, expected } of tests) {
    assert.equal(
      mime.getExtension(input),
      expected,
      `${t.name}: ${input}, ${expected}`,
    );
  }
}
