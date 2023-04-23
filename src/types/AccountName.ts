// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import type { AnyNumber, AnyString, Registry } from '@polkadot/types-codec/types';

import { U128 } from '@polkadot/types-codec';
import { isString } from '@polkadot/util';

function isAlphaNumeric (s: string) {
  for (let i = 0; i < s.length; ++i) {
    const c = s.charCodeAt(i);

    if ((c > 47 && c < 58) ||
      (c > 64 && c < 91) ||
      (c > 96 && c < 123)
    ) {
      continue;
    }

    return false;
  }

  return true;
}

export class AccountName extends U128 {
  constructor (registry: Registry, name: AnyString | AnyNumber, tag?: number) {
    if (isString(name)) {
      const raw = new Uint8Array(16);
      let name_: string, tag_: number;

      if (tag) {
        name_ = name.toString();
        tag_ = tag;
      } else {
        const words = name.toString().split('#');

        if (words.length !== 2) {
          throw new Error('AccountName should contain # separator between name and tag');
        }

        if ((words.at(-1) as string).length !== 4) {
          throw new Error('Tag string should be 0-padded 4 digit number');
        }

        name_ = words.at(0) as string;
        tag_ = parseInt(words.at(-1) as string);
      }

      if (!isAlphaNumeric(name_)) {
        throw new Error('Only alphanumeric characters can be used for AccountName');
      }

      if (name_.length > 14) {
        throw new Error('AccountName should not be longer than 14 characters');
      }

      if (tag_ < 0 || tag_ > 10000) {
        throw new Error('AccountName tag is out of range (0000-9999)');
      }

      raw[0] = tag_ & 0xff;
      raw[1] = (tag_ >> 8) & 0xff;

      for (let i = 0; i < name_.length; ++i) {
        raw[1 + (name_.length - i)] = name_.charCodeAt(i);
      }

      super(registry, raw);
    } else {
      if (tag) {
        throw new Error('Tag should not provided when instantiating AccountName from number');
      }

      super(registry, name);
    }
  }

  public override toHuman (): string {
    const raw = this.toU8a();
    const tag = new DataView(raw.slice(0, 2).buffer).getUint16(0, true);

    const nameRaw = raw.slice(2);
    let name = '';
    let index = nameRaw.indexOf(0);

    if (index === -1) {
      index = 14;
    }

    while (--index >= 0) {
      name += String.fromCharCode(nameRaw[index]);
    }

    return name + '#' + String(tag).padStart(4, '0');
  }

  public override toRawType (): string {
    return 'AccountName';
  }
}
