import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRquestComponent } from './user-rquest.component';

describe('UserRquestComponent', () => {
  let component: UserRquestComponent;
  let fixture: ComponentFixture<UserRquestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRquestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRquestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
