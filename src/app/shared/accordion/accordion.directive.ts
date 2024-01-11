import { AfterContentChecked, Directive } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccordionlinkDirective } from './accordionlink.directive';
import { filter } from 'rxjs/operators';
@Directive({
  selector: '[appAccordion]'
})
export class AccordionDirective  implements AfterContentChecked {
  protected navlinks: Array<AccordionlinkDirective> = [];

  closeOtherLinks(selectedLink: AccordionlinkDirective): void {
    this.navlinks.forEach((link: AccordionlinkDirective) => {
      if (link !== selectedLink) {
        link.selected = false;
      }
    });
  }

  addLink(link: AccordionlinkDirective): void {
    this.navlinks.push(link);
  }

  removeGroup(link: AccordionlinkDirective): void {
    const index = this.navlinks.indexOf(link);
    if (index !== -1) {
      this.navlinks.splice(index, 1);
    }
  }

  checkOpenLinks() {
    this.navlinks.forEach((link: AccordionlinkDirective) => {
      if (link.group) {
        const routeUrl = this.router.url;
        const currentUrl = routeUrl.split('/');
        if (currentUrl.indexOf(link.group) > 0) {
          link.selected = true;
          this.closeOtherLinks(link);
        }
      }
    });
  }

  ngAfterContentChecked(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => this.checkOpenLinks());
  }

  constructor(private router: Router) {
    setTimeout(() => this.checkOpenLinks());
  }
}
