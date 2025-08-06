import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByuserComponent } from './byuser.component';

describe('ByuserComponent', () => {
  let component: ByuserComponent;
  let fixture: ComponentFixture<ByuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
