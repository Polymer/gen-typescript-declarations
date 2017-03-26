/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

export type Result<V, E> = Success<V, E>| Failure<V, E>;

export namespace Result {
  export function succeed<V>(value: V) {
    return new Success<V, any>(value);
  }
  export function fail<E>(error: E) {
    return new Failure<any, E>(error);
  }

  export function all<V, E>(results: Result<V, E>[]): Result<V[], E> {
    const vals: V[] = [];
    for (const result of results) {
      if (!result.successful) {
        return result as any as Result<V[], E>;
      }
      vals.push(result.value);
    }
    return Result.succeed(vals);
  }
}

export class Success<V, E> {
  readonly successful: true = true;
  readonly value: V;
  constructor(value: V) {
    this.value = value;
  }

  unwrapOr<U>(_fallback: U): V|U {
    return this.value;
  }

  andThen<U>(f: (v: V) => Result<U, E>): Result<U, E> {
    return f(this.value);
  }

  map<U>(f: (v: V) => U): Result<U, E> {
    return Result.succeed(f(this.value));
  }

  mapFailure<F>(_f: (e: E) => F): Result<V, F> {
    return this as Result<V, any>as Result<V, F>;
  }

  and<U>(res: Result<U, E>): Result<U, E> {
    return res;
  }

  or<F>(_res: Result<V, F>): Result<V, F> {
    return this as Result<V, any>as Result<V, F>;
  }

  orElse<F>(_op: (e: E) => Result<V, F>): Result<V, F> {
    return this as Result<V, any>as Result<V, F>;
  }

  unwrap(): V {
    return this.value;
  }

  unwrapFailure(): E {
    throw new Error(
        `Expected Result to be failed, it succeeded with: ${this.value}`);
  }

  unwrapOrDefault(): V|undefined {
    return this.value;
  }

  * [Symbol.iterator](): Iterable<V> {
    if (this.successful) {
      yield this.value as V;
    }
  }
}

export class Failure<V, E> {
  readonly successful: false = false;
  readonly value: E;
  constructor(value: E) {
    this.value = value;
  }

  unwrapOr<U>(fallback: U): V|U {
    return fallback;
  }

  andThen<U>(_f: (v: V) => Result<U, E>): Result<U, E> {
    return this as Result<any, E>as Result<U, E>;
  }

  map<U>(_f: (v: V) => U): Result<U, E> {
    return this as Result<any, E>as Result<U, E>;
  }

  mapFailure<F>(f: (e: E) => F): Result<V, F> {
    return Result.fail(f(this.value));
  }

  and<U>(_res: Result<U, E>): Result<U, E> {
    return this as Result<any, E>as Result<U, E>;
  }

  or<F>(res: Result<V, F>): Result<V, F> {
    return res;
  }

  orElse<F>(op: (e: E) => Result<V, F>): Result<V, F> {
    return op(this.value);
  }

  unwrap(): V {
    throw new Error(`Tried to unwrap a failed Result of: ${this.value}`);
  }

  unwrapFailure(): E {
    return this.value;
  }

  unwrapOrDefault(): V|undefined {
    return undefined;
  }

  * [Symbol.iterator](): Iterable<V> {}
}
