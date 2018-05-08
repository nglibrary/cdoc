import { Injectable, Inject } from '@angular/core';
import merge from 'deepmerge';
import { ChoosyConfig } from '../models';
import { CONFIG } from '../config';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(@Inject(CONFIG) public defaultConfig: ChoosyConfig) {}

  mergeWithDefault(config: Partial<ChoosyConfig>): ChoosyConfig {
    return merge(this.defaultConfig, config);
  }

  mergeAllWithDefault(...configs: Partial<ChoosyConfig>[]): ChoosyConfig {
    return merge.all([this.defaultConfig, ...configs]);
  }
}
