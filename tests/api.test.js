import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/analyze.js';
function response() {
  return {
    code: 200, body: null, headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; }
  };
}
test('optional API rejects non-POST methods', async () => {
  const res = response();
  await handler({ method: 'GET', headers: {} }, res);
  assert.equal(res.code, 405);
});
test('optional API does not call an LLM without a configured access token', async () => {
  const formerKey = process.env.OPENAI_API_KEY;
  const formerToken = process.env.DEMO_ACCESS_TOKEN;
  delete process.env.OPENAI_API_KEY;
  delete process.env.DEMO_ACCESS_TOKEN;
  try {
    const res = response();
    await handler({ method: 'POST', headers: {}, body: { question: 'What is the gap?', region: 'Kymenlaakso' } }, res);
    assert.equal(res.code, 503);
    assert.match(res.body.error, /not configured/i);
  } finally {
    if (formerKey !== undefined) process.env.OPENAI_API_KEY = formerKey;
    if (formerToken !== undefined) process.env.DEMO_ACCESS_TOKEN = formerToken;
  }
});
