/* eslint-env browser */
import test from 'tape-cup';
import App, {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {LoggerToken} from 'fusion-tokens';
import {getSimulator} from 'fusion-test-utils';
import plugin from '../browser.js';

test('Server logger', t => {
  let called = false;
  const app = new App('el', el => el);
  app.register(LoggerToken, plugin);
  app.register(
    UniversalEventsToken,
    createPlugin({
      provides: () => {
        return {
          emit(type, payload) {
            t.equal(type, 'universal-log');
            console.log(payload);
            called = true;
          },
        };
      },
    })
  );
  app.middleware({logger: LoggerToken}, ({logger}) => {
    logger.info('test');
    return (ctx, next) => next();
  });
  getSimulator(app);
  t.equals(called, true, 'called');
  t.end();
});
