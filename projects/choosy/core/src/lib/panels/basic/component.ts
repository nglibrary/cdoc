import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  ViewEncapsulation,
  AfterViewInit
} from '@angular/core';
import { OptionsService, ConfigService } from '../../services';
import { ChoosyBasePanel, BASE_CONFIG } from '../panel.base';

@Component({
  ...BASE_CONFIG,
  selector: 'choosy-basic-panel',
  templateUrl: 'template.html',
  styleUrls: ['../../styles/style.scss']
})
export class BasicPanel extends ChoosyBasePanel implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    protected optionsService: OptionsService,
    protected configService: ConfigService,
    protected elRef: ElementRef,
    protected cdRef: ChangeDetectorRef
  ) {
    super(optionsService, configService, elRef, cdRef);
  }

  ngOnInit() {
    this.init();
    if (this.config.autoComplete.enable) {
      this.autoCompletion();
    }
    this.watchKeyPress();
    this.watchKeyboardActions();
  }

  ngAfterViewInit() {
    this.viewInit();
  }

  ngOnDestroy() {
    this._cleanUp();
  }
}
