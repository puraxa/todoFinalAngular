import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletefilemodalComponent } from './deletefilemodal.component';

describe('DeletefilemodalComponent', () => {
  let component: DeletefilemodalComponent;
  let fixture: ComponentFixture<DeletefilemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletefilemodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletefilemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
