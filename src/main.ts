import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/cobol/cobol.js';

import 'codemirror/mode/pascal/pascal.js';

import 'codemirror/mode/clike/clike.js';

import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/lib/codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;

  // Otherwise, log the boot error
}).catch(err => console.error(err));
