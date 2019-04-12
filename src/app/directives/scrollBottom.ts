import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[scrollbottom]'
})

export class ScrollBottomDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLElement>) { }

  ngAfterViewInit() {
    const parent = this.el.nativeElement.parentElement;
    if (parent.scrollTop > parent.scrollHeight - parent.offsetHeight - 200) {
      parent.scrollTop = parent.scrollHeight;
    }
  }

}
