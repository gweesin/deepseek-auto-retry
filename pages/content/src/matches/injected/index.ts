import { sampleFunction } from '@src/sample-function';

console.log('[CEB] Example content script loaded');

setTimeout(() => {
  sampleFunction();
  console.log('[CEB] Example content script executed sampleFunction()');
}, 1000);
