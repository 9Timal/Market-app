import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreComponent } from './centre.component';

describe('CentreComponent', () => {
  let component: CentreComponent;
  let fixture: ComponentFixture<CentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
