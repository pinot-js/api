// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import { AnyU8a, Registry } from '@polkadot/types-codec/types';
import { isHex, isString } from '@polkadot/util';

import { u8aToBase64url } from '../util/index.js';
import { Binary } from './Binary.js';

/* eslint-disable sort-keys */
const MULTICODEC = {
  secp256k1: new Uint8Array([0xe7, 0x01]),
  sr25519: new Uint8Array([0xef, 0x01]),
  p256: new Uint8Array([0x80, 0x24]),
  blake2b_256: new Uint8Array([0xa0, 0xe4, 0x02, 0x20])
};
/* eslint-enable sort-keys */

function u8aStartsWith (v: Uint8Array, w: Uint8Array): boolean {
  if (v.length < w.length) {
    return false;
  }

  for (let i = 0; i < w.length; ++i) {
    if (v[i] !== w[i]) {
      return false;
    }
  }

  return true;
}

export class UniversalAddress extends Binary {
  static validate (u8a: Uint8Array): Uint8Array {
    let alg: keyof typeof MULTICODEC;

    for (alg in MULTICODEC) {
      if (u8aStartsWith(u8a, MULTICODEC[alg])) {
        return u8a;
      }
    }

    throw new Error('Unknown algorithm, UniversalAddress construction is failed');
  }

  constructor (registry: Registry, value?: AnyU8a) {
    if (!isHex(value) && isString(value)) {
      if (value.at(0) !== 'u') {
        throw new Error('Multibase (base64url) format address is only supported now');
      }

      super(registry, value.substring(1));
    } else {
      super(registry, value);
    }
    UniversalAddress.validate(this);
  }

  public override toHuman (): string {
    return 'u' + u8aToBase64url(this.toU8a(true));
  }

  public override toRawType (): string {
    return 'UniversalAddress';
  }
}
