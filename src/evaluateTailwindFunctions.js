/**
 * This file contains code licensed under MIT from the Tailwind CSS project:
 *
 *   https://github.com/tailwindlabs/tailwindcss/blob/v3.4.1/src/lib/evaluateTailwindFunctions.js
 *
 * And is covered by the following license:
 *
 *   Copyright (c) Tailwind Labs, Inc.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

import didYouMean from 'didyoumean';
import dlv from 'dlv';
import postcss from 'postcss';
import { toPath } from 'tailwindcss/lib/util/toPath';
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue';
import parseValue from 'tailwindcss/lib/value-parser/index';

function isObject(input) {
  return typeof input === 'object' && input !== null;
}

function findClosestExistingPath(theme, path) {
  let parts = toPath(path);
  do {
    parts.pop();

    if (dlv(theme, parts) !== undefined) break;
  } while (parts.length);

  return parts.length ? parts : undefined;
}

function pathToString(path) {
  if (typeof path === 'string') return path;
  return path.reduce((acc, cur, i) => {
    if (cur.includes('.')) return `${acc}[${cur}]`;
    return i === 0 ? cur : `${acc}.${cur}`;
  }, '');
}

function list(items) {
  return items.map((key) => `'${key}'`).join(', ');
}

function listKeys(obj) {
  return list(Object.keys(obj));
}

function validatePath(config, path, defaultValue, themeOpts = {}) {
  const pathString = Array.isArray(path) ? pathToString(path) : path.replace(/^['"]+|['"]+$/g, '');
  const pathSegments = Array.isArray(path) ? path : toPath(pathString);
  const value = dlv(config.theme, pathSegments, defaultValue);

  if (value === undefined) {
    let error = `'${pathString}' does not exist in your theme config.`;
    const parentSegments = pathSegments.slice(0, -1);
    const parentValue = dlv(config.theme, parentSegments);

    if (isObject(parentValue)) {
      const validKeys = Object.keys(parentValue).filter(
        (key) => validatePath(config, [...parentSegments, key]).isValid,
      );
      const suggestion = didYouMean(pathSegments[pathSegments.length - 1], validKeys);
      if (suggestion) {
        error += ` Did you mean '${pathToString([...parentSegments, suggestion])}'?`;
      } else if (validKeys.length > 0) {
        error += ` '${pathToString(parentSegments)}' has the following valid keys: ${list(
          validKeys,
        )}`;
      }
    } else {
      const closestPath = findClosestExistingPath(config.theme, pathString);
      if (closestPath) {
        const closestValue = dlv(config.theme, closestPath);
        if (isObject(closestValue)) {
          error += ` '${pathToString(closestPath)}' has the following keys: ${listKeys(
            closestValue,
          )}`;
        } else {
          error += ` '${pathToString(closestPath)}' is not an object.`;
        }
      } else {
        error += ` Your theme has the following top-level keys: ${listKeys(config.theme)}`;
      }
    }

    return {
      isValid: false,
      error,
    };
  }

  if (
    !(
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'function' ||
      value instanceof String ||
      value instanceof Number ||
      Array.isArray(value)
    )
  ) {
    let error = `'${pathString}' was found but does not resolve to a string.`;

    if (isObject(value)) {
      let validKeys = Object.keys(value).filter(
        (key) => validatePath(config, [...pathSegments, key]).isValid,
      );
      if (validKeys.length) {
        error += ` Did you mean something like '${pathToString([...pathSegments, validKeys[0]])}'?`;
      }
    }

    return {
      isValid: false,
      error,
    };
  }

  const [themeSection] = pathSegments;

  return {
    isValid: true,
    value: transformThemeValue(themeSection)(value, themeOpts),
  };
}

function extractArgs(node, vNodes, functions) {
  vNodes = vNodes.map((vNode) => resolveVNode(node, vNode, functions));

  let args = [''];

  for (let vNode of vNodes) {
    if (vNode.type === 'div' && vNode.value === ',') {
      args.push('');
    } else {
      args[args.length - 1] += parseValue.stringify(vNode);
    }
  }

  return args;
}

function resolveVNode(node, vNode, functions) {
  if (vNode.type === 'function' && functions[vNode.value] !== undefined) {
    let args = extractArgs(node, vNode.nodes, functions);
    vNode.type = 'word';
    vNode.value = functions[vNode.value](node, ...args);
  }

  return vNode;
}

function resolveFunctions(node, input, functions) {
  let hasAnyFn = Object.keys(functions).some((fn) => input.includes(`${fn}(`));
  if (!hasAnyFn) return input;

  return parseValue(input)
    .walk((vNode) => {
      resolveVNode(node, vNode, functions);
    })
    .toString();
}

/**
 * @param {string} path
 * @returns {Iterable<[path: string, alpha: string|undefined]>}
 */
function* toPaths(path) {
  // Strip quotes from beginning and end of string
  // This allows the alpha value to be present inside of quotes
  path = path.replace(/^['"]+|['"]+$/g, '');

  let matches = path.match(/^([^\s]+)(?![^\[]*\])(?:\s*\/\s*([^\/\s]+))$/);
  let alpha = undefined;

  yield [path, undefined];

  if (matches) {
    path = matches[1];
    alpha = matches[2];

    yield [path, alpha];
  }
}

/**
 *
 * @param {any} config
 * @param {string} path
 * @param {any} defaultValue
 */
function resolvePath(config, path, defaultValue) {
  const results = Array.from(toPaths(path)).map(([path, alpha]) => {
    return Object.assign(validatePath(config, path, defaultValue, { opacityValue: alpha }), {
      resolvedPath: path,
      alpha,
    });
  });

  return results.find((result) => result.isValid) ?? results[0];
}

export default function (config) {
  const functions = {
    theme: (node, path, ...defaultValue) => {
      let { isValid, value, error } = resolvePath(
        config,
        path,
        defaultValue.length ? defaultValue : undefined,
      );

      if (!isValid) {
        throw node.error(error);
      }

      return value;
    },
  };

  return (value) => {
    const root = postcss.parse(`--:${value}`);
    const node = root.nodes[0];

    return resolveFunctions(node, node.value, functions);
  };
}
