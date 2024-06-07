// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import type { ApiOptions } from '@polkadot/api/types';

import { ApiPromise as ApiPromiseBase } from '@polkadot/api';

import { Binary } from '@pinot/types';

export class ApiPromise extends ApiPromiseBase {
  public static override async create (options?: ApiOptions): Promise<ApiPromise> {
    const instance = await super.create({
      ...options
    });

    /* eslint-disable sort-keys */
    instance.registerTypes({
      Binary,
      ExtrinsicSignature: 'AuthenticationProof',
      P256Signature: '[u8; 65]',
      AuthenticationProof: {
        _enum: {
          Ed25519: 'Ed25519Signature',
          Sr25519: 'Sr25519Signature',
          Secp256k1: 'EcdsaSignature',
          P256: 'P256Signature',
          WebAuthn: 'WebAuthnSignature'
        }
      },
      WebAuthnSignature: {
        clientDataJSON: 'Binary',
        authenticatorData: 'Binary',
        signature: 'Binary'
      }
    });
    /* eslint-enable sort-keys */

    return instance;
  }
}
