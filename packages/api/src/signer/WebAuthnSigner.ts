// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import type { Registry, Signer, SignerPayloadRaw, SignerResult } from '@polkadot/types/types';

import { compactAddLength, hexToU8a, isU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto';

let id = 0;

export class WebAuthnSigner implements Signer {
  readonly #registry: Registry;
  readonly #credentialId: Uint8Array;
  readonly address?: string;
  readonly addressRaw?: Uint8Array;

  constructor (registry: Registry, credentialId: Uint8Array | string, publicKey?: Uint8Array | string) {
    this.#registry = registry;
    this.#credentialId = isU8a(credentialId) ? credentialId : stringToU8a(credentialId);

    if (publicKey) {
      let raw: Uint8Array = isU8a(publicKey) ? publicKey : stringToU8a(publicKey);

      if (raw.length === 64) {
        raw = compactAddLength(u8aConcat(new Uint8Array([0x02 + (raw[63] & 0x01)]), raw.slice(0, 32)));
      }

      const accountId = this.#registry.createType('AccountId', u8aConcat(new Uint8Array([0x80, 0x24]), raw));

      this.address = accountId.toHuman()?.toString();
      this.addressRaw = accountId.toU8a();
    }
  }

  public async signRaw ({ address, data }: SignerPayloadRaw): Promise<SignerResult> {
    if (this.address && this.address !== address) {
      throw new Error('Signer address does not match');
    }

    if (!navigator || !navigator.credentials) {
      throw new Error('WebAuthn is not supported in this environment');
    }

    const response = ((await navigator.credentials.get({
      publicKey: {
        allowCredentials: [{
          id: this.#credentialId,
          type: 'public-key'
        }],
        challenge: blake2AsU8a(hexToU8a(data))
      }
    })) as PublicKeyCredential).response as AuthenticatorAssertionResponse;

    return {
      id: ++id,
      signature: this.#registry.createType('UniversalSignature', {
        /* eslint-disable sort-keys */
        WebAuthn: {
          clientDataJSON: compactAddLength(new Uint8Array(response.clientDataJSON)),
          authenticatorData: compactAddLength(new Uint8Array(response.authenticatorData)),
          signature: compactAddLength(new Uint8Array(response.signature))
        }
        /* eslint-enable sort-keys */
      }).toHex()
    };
  }
}
