const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const html = readFileSync(resolve(__dirname, '../index.html'), 'utf8');
const script = readFileSync(resolve(__dirname, '../script.js'), 'utf8');

function loadLanding(values = { volumen: 'USD 1.000 a 5.000', negocio: 'Servicios', 'primera-vez': 'No' }) {
  const listeners = {};
  const element = id => ({ id, value: '', hidden: false, required: false,
    addEventListener(event, handler) { listeners[id + ':' + event] = handler; },
    setCustomValidity(value) { this.error = value; }, reportValidity() {},
    setAttribute() {}, querySelectorAll: () => [] });
  const elements = Object.fromEntries(['prefilter-form', 'negocio', 'otro-negocio', 'detalle-negocio'].map(id => [id, element(id)]));
  const inert = element('inert');
  const document = {
    createElement: () => ({}), getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
    querySelector: selector => elements[selector.slice(1)] || inert,
    querySelectorAll: () => [], addEventListener() {}
  };
  const opened = [];
  const context = vm.createContext({ document, matchMedia: () => ({ addEventListener() {} }),
    FormData: class { get(key) { return values[key]; } }, open: (...args) => opened.push(args) });
  context.window = context;
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  vm.runInContext(script, context);
  return { context, listeners, elements, opened };
}

test('Pixel initializes once and all contact buttons reach the filter', () => {
  const { context } = loadLanding();
  assert.deepEqual(JSON.parse(JSON.stringify(context.fbq.queue.map(args => [...args]))), [['init', '1743600580129283'], ['track', 'PageView']]);
  const buttons = [...html.matchAll(/<a\b[^>]*class="[^"]*\bbutton\b[^"]*"[^>]*>/g)].map(match => match[0]);
  assert.ok(buttons.length >= 5);
  buttons.forEach(tag => assert.ok(tag.includes('href="#prefiltro"')));
  assert.ok(html.includes('id="prefilter-form"'));
});

test('valid answers prepare a Telegram draft and track one contact', () => {
  const { context, listeners, opened } = loadLanding();
  listeners['prefilter-form:submit']({ preventDefault() {} });
  assert.equal(opened.length, 1);
  const url = new URL(opened[0][0]);
  assert.equal(url.origin + url.pathname, 'https://t.me/Cobaltcambios');
  assert.match(url.searchParams.get('text'), /Volumen diario estimado: USD 1\.000 a 5\.000/);
  assert.match(url.searchParams.get('text'), /Negocio: Servicios/);
  assert.match(url.searchParams.get('text'), /Primera vez cambiando pesos a USDT: No/);
  assert.equal(context.fbq.queue.length, 3);
});

test('other business requires a meaningful description and does not send tracking on failure', () => {
  const { context, listeners, elements, opened } = loadLanding({ volumen: 'Menos de USD 1.000', negocio: 'Otro', 'detalle-negocio': '   ', 'primera-vez': 'Sí' });
  elements.negocio.value = 'Otro';
  listeners['negocio:change']();
  assert.equal(elements['otro-negocio'].hidden, false);
  assert.equal(elements['detalle-negocio'].required, true);
  listeners['prefilter-form:submit']({ preventDefault() {} });
  assert.equal(opened.length, 0);
  assert.equal(context.fbq.queue.length, 2);
  assert.ok(elements['detalle-negocio'].error);
});

test('Telegram opens when the Pixel is unavailable', () => {
  const { context, listeners, opened } = loadLanding();
  delete context.fbq;
  listeners['prefilter-form:submit']({ preventDefault() {} });
  assert.equal(opened.length, 1);
});
