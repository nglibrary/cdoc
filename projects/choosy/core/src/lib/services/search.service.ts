import { Injectable } from '@angular/core';
import { ChoosyOptions, ChoosySearch } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _fuse: any;
  search(options: ChoosyOptions, keyword: string, config: ChoosySearch) {
    return this._getFuse().then((fuse: any) => new fuse(options, config).search(keyword));
  }
  private async _getFuse() {
    if (!this._fuse) {
      this._fuse = ((await import(/* webpackChunkName: "fusejs" */ 'fuse.js')) as any).default;
    }
    return this._fuse;
  }
}
