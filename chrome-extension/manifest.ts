import { readFileSync } from 'node:fs';
import type { ManifestType } from '@extension/shared';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

/**
 * @prop default_locale
 * if you want to support multiple languages, you can use the following reference
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
 *
 * @prop browser_specific_settings
 * Must be unique to your extension to upload to addons.mozilla.org
 * (you can delete if you only want a chrome extension)
 *
 * @prop permissions
 * Firefox doesn't support sidePanel (It will be deleted in manifest parser)
 *
 * @prop content_scripts
 * css: ['content.css'], // public folder
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: 'deepseek-auto-retry',
  browser_specific_settings: {
    gecko: {
      id: 'gweesin2000@gmail.com',
      strict_min_version: '109.0',
    },
  },
  version: packageJson.version,
  description: 'Retry automatically when your DeepSeek dialog sending request failure.',
  host_permissions: ['https://chat.deepseek.com/a/chat/*'],
  permissions: ['storage', 'scripting', 'tabs', 'notifications', 'scripting', 'activeTab'],
  background: {
    service_worker: 'background.js',
    type: 'module',
  },
  icons: {
    '128': 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['https://chat.deepseek.com/a/chat/*'],
      js: ['content/deepseek.iife.js'],
    },
    // {
    //   matches: ['https://chat.deepseek.com/a/chat/*'],
    //   js: ['content-ui/deepseek.iife.js'],
    // },
    // {
    //   matches: ['https://chat.deepseek.com/*'],
    //   css: ['content.css'],
    // },
  ],
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
} satisfies ManifestType;

export default manifest;
