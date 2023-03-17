// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import type { ApiOptions } from '@polkadot/api/types';

import { ApiPromise as ApiPromiseBase } from '@polkadot/api';

import { AccountName, Binary, MultiAddress, UniversalAddress } from '../../types/index.js';
import * as derives from '../derive/index.js';

export class ApiPromise extends ApiPromiseBase {
  public static override async create (options?: ApiOptions): Promise<ApiPromise> {
    const instance = await super.create({
      derives,
      ...options
    });

    /* eslint-disable sort-keys */
    instance.registerTypes({
      AccountId: 'UniversalAddress',
      AccountIndex: 'AccountName',
      AccountName,
      Address: 'MultiAddress',
      Binary,
      ExtrinsicSignature: 'UniversalSignature',
      LookupSource: 'MultiAddress',
      MultiAddress,
      P256Signature: '[u8; 64]',
      UniversalAddress,
      UniversalSignature: {
        _enum: {
          Ed25519: 'Ed25519Signature',
          Sr25519: 'Sr25519Signature',
          Secp256k1: 'EcdsaSignature',
          P256: 'P256Signature',
          WebAuthn: 'WebAuthnSignature'
        }
      },
      WebAuthnSignature: {
        clientDataJson: 'Binary',
        authenticatorData: 'Binary',
        signature: 'Binary'
      }
    });
    /* eslint-enable sort-keys */

    return instance;
  }
}
