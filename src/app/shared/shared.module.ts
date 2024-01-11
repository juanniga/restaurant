import { NgModule } from '@angular/core';
import { AccordionanchorDirective, AccordionlinkDirective, AccordionDirective } from './accordion';
import { MenuItems } from './menu-items';



@NgModule({
  declarations: [
    AccordionanchorDirective,
    AccordionlinkDirective,
    AccordionDirective
  ],
  exports: [
    AccordionanchorDirective,
    AccordionlinkDirective,
    AccordionDirective
   ],
  providers: [MenuItems]
})
export class SharedModule { }
