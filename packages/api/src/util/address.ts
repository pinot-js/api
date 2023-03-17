// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import { compactAddLength, compactFromU8aLim, isHex, isU8a, u8aToU8a } from '@polkadot/util';

import { base64urlToU8a, u8aToBase64url } from './base64url.js';

// eslint-disable-next-line no-unused-vars
export function encodeAddress (key: HexString | Uint8Array | string, _ss58Format = -1): string {
  const u8a = decodeAddress(key);
  const [offset] = compactFromU8aLim(u8a);

  return 'u' + u8aToBase64url(u8a.slice(offset));
}

// eslint-disable-next-line no-unused-vars
export function decodeAddress (encoded?: HexString | string | Uint8Array | null, _ignoreChecksum?: boolean, _ss58Format = 1): Uint8Array {
  if (!encoded) {
    throw new Error('Invalid empty address passed');
  }

  if (isU8a(encoded) || isHex(encoded)) {
    return u8aToU8a(encoded);
  }

  if (encoded.at(0) !== 'u') {
    throw new Error('Multibase (base64url) format address is only supported now');
  }

  return compactAddLength(base64urlToU8a(encoded.substring(1)));
}
