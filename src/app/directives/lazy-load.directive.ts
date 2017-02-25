import { Directive, ElementRef, Input, NgZone, AfterViewChecked, OnDestroy } from "@angular/core";
import * as Blazy from "blazy";

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective  implements AfterViewChecked, OnDestroy {

   @Input() bLazyOffset: number = 200;
  bLazyInstance: any = null;

  constructor(private elementRef: ElementRef, private zone: NgZone) {}

  ngAfterViewChecked() {
    // deferred execution allows bLazy to properly initialize and bind itself.
    this.zone.runOutsideAngular(() => {
      this.destroyBlazy();
      this.setupBlazy();
    });
  }

  ngOnDestroy() {
    this.destroyBlazy();
  }

  private setupBlazy() {
    if (this.bLazyInstance) {
      return;
    }

    let elementId = this.elementRef.nativeElement.id;
    if (!elementId) {
      throw Error("The element onto which the [bLazyLoadImages] directive is applied must have an id.");
    }

    this.bLazyInstance = new Blazy({
      container: '#' + elementId,
      // root: this.elementRef.nativeElement,
      offset: this.bLazyOffset
    });
  }

  private destroyBlazy() {
    if (this.bLazyInstance) {
      this.bLazyInstance.destroy();
      this.bLazyInstance = null;
    }
  }

}
