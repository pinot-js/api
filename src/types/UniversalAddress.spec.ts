// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';

import { TypeRegistry } from '@polkadot/types';
import { compactToU8a, hexToU8a, u8aConcat } from '@polkadot/util';

import { UniversalAddress } from './UniversalAddress.js';

describe('UniversalAddress', (): void => {
  const registry = new TypeRegistry();

  registry.register(UniversalAddress);

  const b = 'u5wECOvHh76TR4a1cueOWfpjpAdr803xEzwv7bCFpl_XuUd8';

  describe('decoding', (): void => {
    it('can decode u8a', (): void => {
      const len = compactToU8a(35);
      const code = new Uint8Array([0xe7, 0x01]);
      const key = hexToU8a('023af1e1efa4d1e1ad5cb9e3967e98e901dafcd37c44cf0bfb6c216997f5ee51df');

      const a = u8aConcat(len, code, key);
      const ua = registry.createType<UniversalAddress>('UniversalAddress', a);

      expect(ua.toHuman()).toEqual(b);
    });

    it('can decode string', (): void => {
      const ua = registry.createType<UniversalAddress>('UniversalAddress', b);

      expect(ua.toHuman()).toEqual(b);
    });

    it('can convert to raw binary without the length', (): void => {
      const ua = registry.createType<UniversalAddress>('UniversalAddress', b);

      expect(ua.toU8a(true)).toEqual(hexToU8a('e701023af1e1efa4d1e1ad5cb9e3967e98e901dafcd37c44cf0bfb6c216997f5ee51df'));
      expect(ua.toU8a(false)).toEqual(hexToU8a('8ce701023af1e1efa4d1e1ad5cb9e3967e98e901dafcd37c44cf0bfb6c216997f5ee51df'));
    });
  });
});
