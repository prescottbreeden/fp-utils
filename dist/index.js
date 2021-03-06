"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reject = exports.Task = exports.nothing = exports.just = exports.maybe = exports.Maybe = exports.lte = exports.lt = exports.gte = exports.gt = exports.subtract = exports.add = exports.safeGet = exports.objProp = exports.prop = exports.tail = exports.head = exports.concat = exports.splitAt = exports.split = exports.includes = exports.toUpper = exports.toLower = exports.randomString = exports.trace = exports.doNothing = exports.defaultTo = exports.either = exports.equals = exports.isNil = exports.all = exports.some = exports.reduce = exports.filter = exports.map = exports.identity = exports.converge = exports.curry = exports.compose = void 0;
__exportStar(require("./types"), exports);
/**
 *  compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
 */
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
exports.compose = compose;
/**
 *  curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
 */
function curry(fn) {
    const arity = fn.length;
    return function $curry(...args) {
        if (args.length < arity) {
            return $curry.bind(null, ...args);
        }
        return fn.call(null, ...args);
    };
}
exports.curry = curry;
/**
 * takes a function requiring 2 arguments and an array of functions. each func
 * in the array will be applied against the argument of the returned function
 * and then passed as the arguments to the first function.
 * @example converge(concat, [prop('firstName'), prop('lastName')]);
 * @param fn the function to be called last
 * @param wraps array of functions to supply as arguments to fn
 * @returns (fn, ...wraps) -> arg -> fn(...wraps(arg))
 */
const converge = (fn, wraps) => (arg) => fn(...wraps.map((wrap) => wrap(arg)));
exports.converge = converge;
// ============================================================
//                      -- Monoids --
// ============================================================
/**
 *  identity :: x -> x
 */
const identity = (x) => x;
exports.identity = identity;
/**
 *  map :: (a -> b) -> [a] -> [b]
 */
exports.map = curry((fn, xs) => {
    return xs === null || xs === undefined || xs.map === undefined
        ? xs
        : xs.map(fn);
});
/**
 *  filter :: (a -> b) -> [a] -> b
 */
exports.filter = curry((fn, xs) => {
    return xs === null || xs === undefined || xs.filter === undefined
        ? xs
        : xs.filter(fn);
});
// ============================================================
//                      -- Not? Monoids --
// ============================================================
/**
 *  map :: (a -> b) -> [a] -> b
 */
exports.reduce = curry((fn, xs) => {
    return xs === null || xs === undefined || xs.reduce === undefined
        ? xs
        : xs.reduce(fn);
});
// ============================================================
//                      -- Reduce --
// ============================================================
/**
 *   some :: fn -> xs -> boolean
 */
exports.some = curry((pred, list) => {
    return list === null || list === undefined || list.reduce === undefined
        ? false
        : list.reduce((prev, curr) => {
            return prev ? prev : pred(curr);
        }, false);
});
/**
 *   all :: fn -> xs -> boolean
 */
exports.all = curry((pred, list) => {
    return list === null || list === undefined || list.reduce === undefined
        ? false
        : list.reduce((prev, curr) => {
            return prev ? pred(curr) : prev;
        }, false);
});
// ============================================================
//                      -- logic --
// ============================================================
/**
 *   isNil :: a -> boolean
 */
const isNil = (x) => x === null || x === undefined;
exports.isNil = isNil;
/**
 *  equals :: a -> a -> bool
 */
exports.equals = curry((a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
});
/**
 *  either :: f -> g -> x -> f(x) | g(x)
 */
exports.either = curry((pred1, pred2, val) => {
    return exports.isNil(val) ? pred2(val) : pred1(val);
});
/**
 *   defaultTo :: a -> b -> a | b
 */
exports.defaultTo = curry((def, val) => (val ? val : def));
/**
 *   doNothing :: a -> null
 */
const doNothing = (_) => null;
exports.doNothing = doNothing;
// ============================================================
//                      -- debug --
// ============================================================
/**
 *  trace :: string -> a -> a
 */
exports.trace = curry((msg, a) => {
    console.log(msg, a);
    return a;
});
// ============================================================
//          -- strings / numbers / lists / objects --
// ============================================================
/**
 *  randomString :: () -> string
 */
const randomString = () => {
    return Math.random().toString(36).substring(7);
};
exports.randomString = randomString;
/**
 *  toLower :: string -> string
 */
const toLower = (str) => str.toLowerCase();
exports.toLower = toLower;
/**
 *  toUpper :: string -> string
 */
const toUpper = (str) => str.toUpperCase();
exports.toUpper = toUpper;
/**
 *  includes :: string -> boolean
 */
exports.includes = curry((a, b) => {
    if (typeof b === 'string') {
        return b.includes(a);
    }
    return false;
});
/**
 *  split :: string -> string -> [ string ]
 */
exports.split = curry((sep, str) => str.split(sep));
/**
 *  split :: number -> xs | string -> [ xs | [string], xs | [string] ]
 */
exports.splitAt = curry((index, xs) => {
    const p1 = xs.slice(0, index);
    const p2 = xs.slice(index);
    return [p1, p2];
});
/**
 *  concat :: string -> string -> string
 */
exports.concat = curry((a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
        return a.concat(b);
    }
    return '';
});
/**
 *  head :: [a] -> a
 */
const head = (xs) => {
    if (typeof xs === 'string' || Array.isArray(xs)) {
        if (xs.length === 0) {
            return null;
        }
        else if (xs.length > 0) {
            return xs[0];
        }
        return null;
    }
};
exports.head = head;
/**
 *  head :: [a] -> a
 */
const tail = (xs) => {
    if (typeof xs === 'string' || Array.isArray(xs)) {
        if (xs.length === 0) {
            return null;
        }
        else if (xs.length > 0) {
            return xs[xs.length - 1];
        }
        return null;
    }
};
exports.tail = tail;
/**
 *  prop :: String -> Object -> a
 */
exports.prop = curry((p, obj) => exports.isNil(obj) ? null : obj[p]);
/**
 *  objProp :: Object -> String -> a
 */
exports.objProp = curry((obj, property) => {
    return exports.prop(property, obj);
});
/*
 *  safeGet :: obj -> string -> a | undefined
 */
function safeGet(entity) {
    return (property) => {
        return exports.prop(property, entity);
    };
}
exports.safeGet = safeGet;
// ============================================================
//                      -- math --
// ============================================================
/**
 *  add :: a -> b -> (a + b): number
 */
exports.add = curry((a, b) => a + b);
/**
 *  subtract :: a -> b -> (a - b): number
 */
exports.subtract = curry((a, b) => a - b);
/**
 *  gt :: a -> b -> (b > a): boolean
 */
exports.gt = curry((a, b) => b > a);
/**
 *  gte :: a -> b -> (b >= a): boolean
 */
exports.gte = curry((a, b) => b >= a);
/**
 *  lt :: a -> b -> (b < a): boolean
 */
exports.lt = curry((a, b) => b < a);
/**
 *  lte :: a -> b -> (b <= a): boolean
 */
exports.lte = curry((a, b) => b <= a);
// ============================================================
//                  -- Functor Constructors --
// ============================================================
// Maybes
// ============================================================
//                      -- Maybe --
// ============================================================
class Maybe {
    constructor(x) {
        this.$value = x;
    }
    get isNothing() {
        return this.$value === null || this.$value === undefined;
    }
    get isJust() {
        return !this.isNothing;
    }
    // ----- Pointed Maybe
    static of(x) {
        return new Maybe(x);
    }
    // ----- Functor Maybe
    map(fn) {
        return this.isNothing ? this : Maybe.of(fn(this.$value));
    }
    // ----- Applicative Maybe
    ap(f) {
        return this.isNothing ? this : f.map(this.$value);
    }
    // ----- Monad Maybe
    chain(fn) {
        return this.map(fn).join();
    }
    join() {
        return this.isNothing ? this : this.$value;
    }
    // ----- Traversable Maybe
    sequence(of) {
        return this.traverse(of, exports.identity);
    }
    traverse(of, fn) {
        return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
    }
}
exports.Maybe = Maybe;
const maybe = (x) => Maybe.of(x);
exports.maybe = maybe;
const just = (x) => exports.maybe(x);
exports.just = just;
exports.nothing = exports.maybe(null);
// Tasks
// ============================================================
//                      -- Task --
// ============================================================
class Task {
    constructor(fork) {
        this.fork = fork;
    }
    static rejected(x) {
        return new Task((rej, _) => rej(x));
    }
    // ----- Pointed (Task a)
    static of(x) {
        return new Task((_, resolve) => resolve(x));
    }
    // ----- Functor (Task a)
    map(fn) {
        return new Task((rej, resolve) => this.fork(rej, exports.compose(resolve, fn)));
    }
    // ----- Applicative (Task a)
    ap(f) {
        return this.chain((fn) => f.map(fn));
    }
    // ----- Monad (Task a)
    chain(fn) {
        return new Task((rej, resolve) => this.fork(exports.reject, (x) => fn(x).fork(rej, resolve)));
    }
    join() {
        return this.chain(exports.identity);
    }
}
exports.Task = Task;
const reject = (x) => Task.rejected(x);
exports.reject = reject;
//# sourceMappingURL=index.js.map