/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* eslint-env node */

import {createLogger} from 'winston';

import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {UniversalLoggerConfigToken} from './tokens.js';
import type {UniversalLoggerPluginType} from './types.js';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      emitter: UniversalEventsToken,
      config: UniversalLoggerConfigToken.optional,
    },
    provides: ({emitter, config}) => {
      config = config || {};
      const logger = createLogger(config);
      emitter.on('universal-log', ({level, args}) => {
        logger[level](...args);
      });
      class UniversalLogger {}
      for (const key in logger) {
        if (typeof logger[key] === 'function') {
          // $FlowFixMe
          UniversalLogger.prototype[key] = (...args) =>
            emitter.emit('universal-log', {args, level: key});
        }
      }
      return new UniversalLogger();
    },
  });

export default ((plugin: any): UniversalLoggerPluginType);
