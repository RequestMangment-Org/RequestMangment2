import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplyRequestsComponent } from './disply-requests.component';

describe('DisplyRequestsComponent', () => {
  let component: DisplyRequestsComponent;
  let fixture: ComponentFixture<DisplyRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplyRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
