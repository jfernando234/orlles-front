import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDetalleComponent } from './content-detalle.component';

describe('ContentDetalleComponent', () => {
  let component: ContentDetalleComponent;
  let fixture: ComponentFixture<ContentDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
