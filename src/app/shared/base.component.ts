import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export abstract class BaseComponent implements OnDestroy {

  protected destroyed$: Subject<void> = new Subject();

  protected constructor() { }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
