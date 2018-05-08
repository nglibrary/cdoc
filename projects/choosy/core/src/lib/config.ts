import { InjectionToken } from '@angular/core';
import { ChoosyConfig } from './models';

export const CONFIG = new InjectionToken<ChoosyConfig>('config');

export const choosyDefaultConfig: ChoosyConfig = {
  search: {
    shouldSort: false,
    threshold: 0.0,
    tokenize: true,
    matchAllTokens: true,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['value'],
    autoFocus: true,
    hasClearBtn: true,
    enable: true
  },
  footer: {
    enable: false
  },
  dropDown: {
    maxHeight: 300
  },
  type: '',
  displayValue: 'value',
  theme: 'default',
  multiSelect: {
    enable: false,
    removeOnSelect: false,
    checkbox: false
  },
  autoComplete: {
    enable: false,
    minChars: 2
  },
  groupBy: null
};
