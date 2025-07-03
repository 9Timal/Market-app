import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreStoreComponent } from './centre-store.component';

describe('CentreStoreComponent', () => {
  let component: CentreStoreComponent;
  let fixture: ComponentFixture<CentreStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentreStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
