import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appSwipeDelete]'
})
export class SwipeDeleteDirective {
  private startX = 0;
  private startY = 0;
  private threshold = 30; // 触发滑动的最小距离
  private restraint = 100; // 最大允许偏差

  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    const touch = e.changedTouches[0];
    this.startX = touch.pageX;
    this.startY = touch.pageY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches[0];
    const distX = touch.pageX - this.startX;
    const distY = touch.pageY - this.startY;

    if (Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint) {
      if (distX < 0) {
        this.swipeLeft.emit();
      } else {
        this.swipeRight.emit();
      }
    }
  }
}
