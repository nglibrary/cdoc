import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChipsWidget, FilterWidget, InfoPanelWidget, LoaderWidget, OptionWidget } from './widgets';
import { BasicPanel } from './panels';
import { SimpleListView } from './views';
import { ClassItDirective } from './directives';
import { ConfigService, OptionsService, SearchService } from './services';
import { GroupByPipe } from './pipes';
import { CONFIG, choosyDefaultConfig } from './config';

const WIDGETS = [ChipsWidget, FilterWidget, InfoPanelWidget, LoaderWidget, OptionWidget];
const DIRECTIVES = [ClassItDirective];
const COMPONENTS = [BasicPanel, SimpleListView];
const PIPES = [GroupByPipe];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [...COMPONENTS, ...WIDGETS, ...DIRECTIVES, ...PIPES],
  exports: [...COMPONENTS, ...WIDGETS]
})
export class ChoosyModule {
  static forRoot(globalConfig: any = {}): ModuleWithProviders {
    return {
      ngModule: ChoosyModule,
      providers: [
        {
          provide: CONFIG,
          useValue: choosyDefaultConfig
        }
      ]
    };
  }
}
