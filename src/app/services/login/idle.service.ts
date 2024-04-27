import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { Observable, fromEvent, merge, timer } from 'rxjs';
import { throttleTime, switchMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout = 3600; // in seconds
  private idleEvents = ['mousemove', 'click', 'keypress', 'DOMMouseScroll', 'mousewheel', 'touchmove', 'MSPointerMove'];
  private idleTimer: Observable<any>;

  onIdle: EventEmitter<any> = new EventEmitter();

  constructor(private ngZone: NgZone) {
    this.idleTimer = this.ngZone.runOutsideAngular(() => {
      const events = merge(...this.idleEvents.map(ev => fromEvent(document, ev)));
      return events.pipe(
        throttleTime(1000),
        switchMapTo(timer(this.idleTimeout * 1000))
      );
    });
  }

  startWatching() {
    this.idleTimer.subscribe(() => {
      this.ngZone.run(() => {
        this.onIdle.emit();
      });
    });
  }
}
