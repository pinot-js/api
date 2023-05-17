// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';

import { TypeRegistry } from '@polkadot/types';

import { AccountName } from './AccountName.js';

describe('AccountName', (): void => {
  const registry = new TypeRegistry();

  registry.register(AccountName);

  describe('encode/decode', (): void => {
    it('can encode', (): void => {
      const a: AccountName = registry.createType('AccountName', 'hello#5450');

      expect(a.toBigInt()).toEqual(29384913928000842n);

      const b: AccountName = registry.createType('AccountName', 'hello', 5450);

      expect(b.toBigInt()).toEqual(29384913928000842n);
    });

    it('can decode', (): void => {
      const a: AccountName = registry.createType('AccountName', 29384913928000842n);

      expect(a.toHuman()).toEqual('hello#5450');
    });
  });
});
