import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBlogsPageComponent } from './single-blogs-page.component';

describe('SingleBlogsPageComponent', () => {
  let component: SingleBlogsPageComponent;
  let fixture: ComponentFixture<SingleBlogsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBlogsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBlogsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
