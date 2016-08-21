'use strict';

/* eslint-disable max-len */
const test = require('tape');
const psjs = require('./index');

const getCss = psjs.getCss;

test('Tagged template string containing classes', t => {
  t.plan(2);
  const cssObj = psjs`.cool, .story { display: flex; }`;
  const expectedObj = {
    cool: {
      type: 'class',
      scopedName: 'cool_4k44bl',
      selector: '.cool_4k44bl',
    },
    story: {
      type: 'class',
      scopedName: 'story_4k44bl',
      selector: '.story_4k44bl',
    },
  };
  const expectedCss = '.cool_4k44bl, .story_4k44bl { display: flex; }';

  t.deepEqual(cssObj, expectedObj);
  t.equal(getCss(cssObj), expectedCss);
});

test('Tagged template string with custom scopeify function', t => {
  t.plan(2);
  const custPsjs = psjs.psjs({ scopeifyFn: () => name => `${name}_1` });
  const cssObj = custPsjs`.cool, .story { display: flex; }`;
  const expectedObj = {
    cool: {
      type: 'class',
      scopedName: 'cool_1',
      selector: '.cool_1',
    },
    story: {
      type: 'class',
      scopedName: 'story_1',
      selector: '.story_1',
    },
  };
  const expectedCss = '.cool_1, .story_1 { display: flex; }';

  t.deepEqual(cssObj, expectedObj);
  t.equal(getCss(cssObj), expectedCss);
});

test('Tagged template string with keyframe', t => {
  t.plan(2);
  const custPsjs = psjs.psjs({ scopeifyFn: () => name => `${name}_1`, classes: false });
  const cssObj = custPsjs`@keyframes yolo { 0% { opacity: 0; } 100% { opacity: 1; } } .foo { animation: yolo 5s infinite; }`;
  const expectedObj = {
    yolo: {
      type: 'keyframe',
      scopedName: 'yolo_1',
      selector: 'yolo_1',
    },
  };
  const expectedCss = '@keyframes yolo_1 { 0% { opacity: 0; } 100% { opacity: 1; } } .foo { animation: yolo_1 5s infinite; }';
  t.deepEqual(cssObj, expectedObj);
  t.equal(getCss(cssObj), expectedCss);
});

test('Element and class collision', t => {
  t.plan(2);
  const custPsjs = psjs.psjs({ scopeifyFn: () => name => `${name}_1`, elements: false, ids: false });
  const cssObj = custPsjs`.div { display: flex; } div { color: #fff; }`;
  const expectedObj = {
    div: {
      type: 'class',
      scopedName: 'div_1',
      selector: '.div_1',
    },
  };
  const expectedCss = '.div_1 { display: flex; } div { color: #fff; }';
  t.deepEqual(cssObj, expectedObj);
  t.equal(getCss(cssObj), expectedCss);
});
