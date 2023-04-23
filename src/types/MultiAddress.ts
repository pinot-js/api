// Copyright 2017-2023 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Inspect, Registry } from '@polkadot/types-codec/types';

import { Enum } from '@polkadot/types-codec';
import { isBn, isNumber, isString, isU8a } from '@polkadot/util';

import { decodeAddress } from '../util/index.js';
import { AccountName } from './AccountName.js';
import { UniversalAddress } from './UniversalAddress.js';

function decodeU8a (registry: Registry, u8a: Uint8Array): unknown {
  if (u8a.length === 0) {
    return { Id: u8a };
  } else if ((u8a.length >= 34 && u8a.length <= 36) && [0x88, 0x8c, 0x90].includes(u8a[0])) {
    return { Id: registry.createType('AccountId', u8a) };
  } else if (u8a.length <= 19) {
    return { Index: registry.createType<AccountName>('AccountIndex', u8a).toNumber() };
  }

  return u8a;
}

function decodeMultiAny (registry: Registry, value?: unknown): unknown {
  if (value instanceof UniversalAddress) {
    return { Id: UniversalAddress };
  } else if (isU8a(value)) {
    return decodeU8a(registry, value);
  } else if (value instanceof MultiAddress) {
    return value;
  } else if (value instanceof AccountName || isBn(value) || isNumber(value)) {
    return { Index: isNumber(value) ? value : value.toNumber() };
  } else if (isString(value)) {
    return decodeU8a(registry, decodeAddress(value.toString()));
  }

  return value;
}

export class MultiAddress extends Enum {
  constructor (registry: Registry, value?: unknown) {
    super(registry, {
      Id: 'AccountId',
      Index: 'Compact<AccountIndex>',
      Raw: 'Bytes',
      // eslint-disable-next-line sort-keys
      Address32: 'H256',
      // eslint-disable-next-line sort-keys
      Address20: 'H160'
    }, decodeMultiAny(registry, value));
  }

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  override inspect (): Inspect {
    const { inner, outer = [] } = this.inner.inspect();

    return {
      inner,
      outer: [new Uint8Array([this.index]), ...outer]
    };
  }

  /**
   * @description Returns the string representation of the value
   */
  public override toString (): string {
    return this.value.toString();
  }
}
