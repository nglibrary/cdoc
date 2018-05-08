import { Component } from '@angular/core';
import { places } from './_data/places';

@Component({
  selector: 'doc-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  data = places;
  title = 'doc';
}
