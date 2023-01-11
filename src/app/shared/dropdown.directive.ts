import { Directive, HostBinding, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective{

  constructor(private elRef : ElementRef, private renderer: Renderer2) { }

  @HostBinding('class.open')  isOpen = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    const sibling = this.renderer.nextSibling(this.elRef.nativeElement);
    this.isOpen ? this.showMenu(sibling) : this.hideMenu(sibling)
  }

  private showMenu(node: any) {
    this.renderer.removeClass(node, 'hidden')
  }

  private hideMenu(node: any) {
    this.renderer.addClass(node, 'hidden')
  }

}
