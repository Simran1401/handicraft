import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticPages2Component } from './static-pages2.component';

describe('StaticPages2Component', () => {
  let component: StaticPages2Component;
  let fixture: ComponentFixture<StaticPages2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticPages2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticPages2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
