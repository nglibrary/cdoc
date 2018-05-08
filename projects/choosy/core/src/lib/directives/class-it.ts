import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[classIt]'
})
export class ClassItDirective {
  @Input() classIt = '';
  @HostBinding('attr.class') className: string;
  constructor(private elRef: ElementRef) {
    this.className = `choosy--view ${this.elRef.nativeElement.localName} ${this.classIt}`;
  }
}
