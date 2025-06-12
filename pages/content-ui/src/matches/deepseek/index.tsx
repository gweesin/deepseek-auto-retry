import inlineCss from '../../../dist/deepseek/index.css?inline';
import { initAppWithShadow } from '@extension/shared';
import App from '@src/matches/deepseek/App';

initAppWithShadow({ id: 'CEB-extension-example', app: <App />, inlineCss });
