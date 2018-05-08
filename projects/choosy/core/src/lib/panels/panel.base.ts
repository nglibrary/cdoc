import {
  Component,
  Input,
  TemplateRef,
  ElementRef,
  HostBinding,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  SimpleChange,
  OnChanges,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, map, filter, switchMap, debounceTime, tap, delay } from 'rxjs/operators';
import { OptionsService, ConfigService } from '../services';
import { ChoosyConfig, ChoosyOption, KeyboardAction } from '../models';

export const BASE_CONFIG: Component = {
  preserveWhitespaces: false,
  exportAs: 'choosyRef',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OptionsService]
};

export abstract class ChoosyBasePanel implements OnChanges {
  readonly name = 'base';
  insId = null;
  initialOptions: Observable<any>;
  @Input() config: Partial<ChoosyConfig> = {};
  @Input()
  set options(opt) {
    this._processOptions(opt);
  }
  @Input() optionTpl: TemplateRef<any>;
  @Input() headerTpl: TemplateRef<any>;
  @Input() autoCompleteFn: Function;

  @Output() events: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();

  @HostBinding('attr.data-instance-id') insIdAttr: string;
  @HostBinding('attr.class') classNameAttr: string;

  @ViewChild('viewWrapper', { read: ElementRef })
  viewWrapper: ElementRef;

  protected _keyPressSub: Subject<any> = new Subject();
  protected _autoCompleteSub: Subject<any> = new Subject();
  protected _alive: Subject<boolean> = new Subject();

  optionsLoading = true;

  constructor(
    protected optionsService: OptionsService,
    protected configService: ConfigService,
    protected elRef: ElementRef,
    protected cdRef: ChangeDetectorRef
  ) {}
  init() {
    this.insIdAttr = this.insId;
    this.classNameAttr = `choosy choosy-type-${this.constructor.name.toLocaleLowerCase()} choosy-theme-${
      this.config.theme
    }`;

    this.optionsService.setName(this.insId);

    this.optionsService
      .getSelectedOptions()
      .pipe(takeUntil(this._alive))
      .subscribe(x => {
        this.selected.emit(x);
      });
    this.optionsService.events.pipe(takeUntil(this._alive)).subscribe(e => this.events.emit(e));

    this.optionsService
      .isLoading()
      .pipe(takeUntil(this._alive))
      .subscribe(x => {
        this.optionsLoading = x;
        this.cdRef.detectChanges();
      });
  }

  viewInit() {
    (this.viewWrapper.nativeElement as HTMLElement).style.maxHeight = this.config.dropDown.maxHeight + 'px';
  }

  search(keyword: string) {
    if (typeof keyword !== 'string') {
      return;
    }
    this.optionsService.filterOptions(keyword, this.config.search);
  }

  fetch(query: string) {
    if (query.length < this.config.autoComplete.minChars) {
      return;
    }
    this._autoCompleteSub.next(query);
  }

  updateConfig(newConfig) {
    this.config = this.configService.mergeAllWithDefault(this.config, newConfig);
    this.optionsService.updateSettings(this.config);
    this.updateClassName();
  }

  ngOnChanges(change: any) {
    if (change.config) {
      this.updateConfig(change.config.currentValue);
    }
  }

  watchKeyPress() {
    fromEvent(this.elRef.nativeElement, 'keydown')
      .pipe(takeUntil(this._alive), map((x: KeyboardEvent) => x.keyCode), filter(x => x !== undefined))
      .subscribe(x => this._keyPressSub.next(x));
  }

  watchKeyboardActions(optionEl: string = '.choosy--view>choosy-option-widget div.active') {
    this._keyPressSub
      .asObservable()
      .pipe(
        takeUntil(this._alive),
        tap(x => {
          x = String(x);
          if (x === KeyboardAction.UP) {
            this.optionsService.markPreviousAsActive();
          } else if (x === KeyboardAction.DOWN) {
            this.optionsService.markNextAsActive();
          } else if (x === KeyboardAction.ENTER) {
            this.optionsService.selectActiveOption();
          }
        }),
        filter(x => x !== KeyboardAction.ENTER)
      )
      .subscribe(a => {
        // const child = this.elRef.nativeElement.querySelector(optionEl);
        // const parent = child.parentNode.parentNode.parentNode;
        // parent.scrollTop = child.offsetTop - parent.offsetTop;
      });
  }

  autoCompletion() {
    this._autoCompleteSub
      .pipe(
        takeUntil(this._alive),
        tap(x => (this.optionsLoading = true)),
        debounceTime(500),
        switchMap(x => this.autoCompleteFn(x))
      )
      .subscribe((z: any) => {
        this.optionsService.setOptions(z, this.config);
        this.optionsLoading = false;
      });
  }

  updateClassName() {
    const features = [this.config.theme];
    this.classNameAttr = features.join(' ');
  }

  optionClicked(option) {
    if (option.state.disabled) {
      return;
    }
    const method = option.state.selected ? 'clearSelectedOption' : 'selectOption';
    (this.optionsService as any)[method](option);
  }

  optionOnFocus(option) {
    // this.optionsService.updateOptionHoverState(option, status)
  }

  scrollToSelectedOption() {
    const scollEl = this.viewWrapper.nativeElement;
    const targetEl = this.viewWrapper.nativeElement.querySelector('choosy-option-widget>.selected');
    if (!targetEl) {
      return;
    }
    scollEl.scrollTop = targetEl.offsetTop;
  }

  protected _cleanUp() {
    this._alive.next(true);
    this._alive.complete();
  }

  protected _processOptions(opt) {
    this.config = this.configService.mergeWithDefault(this.config);
    if (opt instanceof Observable) {
      this.optionsService.setOptionsFromObservable(opt, this.config);
    } else if (Array.isArray(opt)) {
      this.optionsService.setOptions(opt, this.config);
    } else {
      throw new Error('Invalid options');
    }
    this.initialOptions = this.optionsService.getOptions();
  }
}
