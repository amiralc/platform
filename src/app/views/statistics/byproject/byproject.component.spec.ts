import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByprojectComponent } from './byproject.component';

describe('ByprojectComponent', () => {
  let component: ByprojectComponent;
  let fixture: ComponentFixture<ByprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByprojectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
