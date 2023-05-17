// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { DeriveApi } from '@polkadot/api-derive/types';

import { of } from 'rxjs';

import { decodeAddress, isU8a } from '@noir/util';
import { memo } from '@polkadot/api-derive/util';

export function accountId (instanceId: string, api_: unknown): (...args: unknown[]) => Observable<any> {
  return memo(instanceId, (...args: unknown[]): Observable<any> => {
    const address = args[0];
    const api = api_ as DeriveApi;

    const decoded = isU8a(address) ? address : decodeAddress((address || '').toString());

    return of(api.registry.createType('AccountId', decoded));
  });
}
