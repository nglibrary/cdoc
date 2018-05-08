import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
  HostBinding,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { ChoosyOption, ChoosyConfig, ChoosyView, ChoosyOptions } from '../../models';
import { OptionsService } from '../../services/options.service';
import { ConfigService } from '../../services/config.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'choosy-simple-list-view',
  templateUrl: './template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true
})
export class SimpleListView implements ChoosyView {
  @Input() options: Observable<any>;
  @Input() config: ChoosyConfig;
  @Input() optionTpl: TemplateRef<any>;

  @Output() optionClicked: EventEmitter<ChoosyOption> = new EventEmitter();
  @Output() optionOnFocus: EventEmitter<ChoosyOption> = new EventEmitter();

  trackByFn(index, item) {
    return item.uid;
  }
}
