import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeliveriesComponent } from './manage-deliveries.component';

describe('ManageDeliveriesComponent', () => {
  let component: ManageDeliveriesComponent;
  let fixture: ComponentFixture<ManageDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDeliveriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
