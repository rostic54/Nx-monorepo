import {
  Directive,
  ElementRef, EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit, Output,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appShowInputField]',
  standalone: true,
  exportAs: 'importantDateForm'
})
export class ShowInputFieldDirective {
  @Input('appShowInputField') isSelectMode = false;
  @Output() missClicked = new EventEmitter<boolean>()
  selected = false;

  constructor( private containerRef: ViewContainerRef,
              private elementRef: ElementRef) {
  }

  @HostBinding('style.fontSize') fontSize = 1;
  @HostBinding('class') className: string | undefined;

  @HostListener('window:click', ['$event'])
  clickOutside(event: any): void {
    if(this.selected) {
      const clickedInside: boolean = this.elementRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.selected = false;
        this.missClicked.emit(false);
        // this.clearContainer();
      } else {
        this.missClicked.emit(true);
      }
    }
  }

  @HostListener('click', ['$event'])
  clickHandler() {
    if(this.isSelectMode) {
      this.selected = !this.selected;
    }
    //   if(this.selected) {
    //     // this.containerRef.createEmbeddedView(this.appShowInputField);
    //   } else {
    //     // this.clearContainer();
    //   }
    // }
  }

  @HostBinding('class.selected') get isSelected() {
    // TODO: Need to unselect after click outside
    return this.selected;
  }

  // closeForm(): void {
  //  this.clearContainer();
  // }
  //
  // private clearContainer(): void {
  //   this.selected = false;
  //   this.containerRef.clear();
  // }


}
