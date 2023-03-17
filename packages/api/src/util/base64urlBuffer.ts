// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

export function u8aToBase64url (v: Uint8Array): string {
  return Buffer.from(v).toString('base64url');
}

export function base64urlToU8a (v: string): Uint8Array {
  return Buffer.from(v, 'base64url');
}
