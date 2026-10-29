const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = resolve(__dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const script = readFileSync(resolve(root, 'script.js'), 'utf8');
const pixelId = '1743600580129283';

function loadLanding() {
  const insertedScripts = [];
  const inertElement = { addEventListener() {}, setAttribute() {}, querySelectorAll: () => [] };
  const contacts = [...html.matchAll(/<a\b[^>]*data-contact-channel="([^"]+)"[^>]*>/g)].map(match => ({
    tag: match[0],
    dataset: { contactChannel: match[1] },
    listeners: [],
    addEventListener(event, listener) {
      assert.equal(event, 'click');
      this.listeners.push(listener);
    }
  }));
  const document = {
    createElement: () => ({}),
    getElementsByTagName: () => [{ parentNode: { insertBefore: script => insertedScripts.push(script) } }],
    querySelector: () => inertElement,
    querySelectorAll: selector => selector === '[data-contact-channel]' ? contacts : [],
    addEventListener() {}
  };
  const context = vm.createContext({ document, matchMedia: () => ({ addEventListener() {} }) });
  context.window = context;
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  vm.runInContext(script, context);
  return { context, contacts, insertedScripts };
}

function queuedCalls(context) {
  return JSON.parse(JSON.stringify(Array.from(context.fbq.queue, args => Array.from(args))));
}

test('initializes only the new Pixel and queues one PageView', () => {
  const { context, insertedScripts } = loadLanding();
  const calls = queuedCalls(context);
  assert.deepEqual(calls, [['init', pixelId], ['track', 'PageView']]);
  assert.equal(insertedScripts.length, 1);
  assert.equal(insertedScripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js');
  assert.equal(insertedScripts[0].async, true);
  assert.equal(html.includes('1556371032264770'), false);
  assert.ok(html.includes(`tr?id=${pixelId}&amp;ev=PageView&amp;noscript=1`));
});

test('Telegram and Calendly keep their correct external destinations', () => {
  assert.equal((html.match(/id="cta"/g) || []).length, 1);
  assert.match(html, /<a[^>]*id="cta"[^>]*href="https:\/\/calendly\.com\/gestionloly\/nueva-reunion"[^>]*target="_blank"/);
  const { contacts } = loadLanding();
  assert.equal(contacts.filter(contact => contact.dataset.contactChannel === 'telegram').length, 2);
  assert.equal(contacts.filter(contact => contact.dataset.contactChannel === 'calendly').length, 1);
  for (const contact of contacts) {
    const destination = contact.dataset.contactChannel === 'telegram'
      ? 'https://t.me/cambiocobalt'
      : 'https://calendly.com/gestionloly/nueva-reunion';
    assert.ok(contact.tag.includes(`href="${destination}"`));
    assert.ok(contact.tag.includes('target="_blank"'));
    assert.ok(contact.tag.includes('rel="noopener noreferrer"'));
  }
});

test('tracks exactly one Contact per click with the correct channel', () => {
  const { context, contacts } = loadLanding();
  for (const contact of contacts) {
    assert.equal(contact.listeners.length, 1);
    const before = context.fbq.queue.length;
    contact.listeners[0]();
    assert.equal(context.fbq.queue.length, before + 1);
    assert.deepEqual(queuedCalls(context).at(-1), ['track', 'Contact', { contact_channel: contact.dataset.contactChannel }]);
    contact.listeners[0]();
    assert.equal(context.fbq.queue.length, before + 2);
  }
});

test('the contact link still works when the Pixel is unavailable', () => {
  const { context, contacts } = loadLanding();
  delete context.fbq;
  contacts.forEach(contact => assert.doesNotThrow(() => contact.listeners[0]()));
});
