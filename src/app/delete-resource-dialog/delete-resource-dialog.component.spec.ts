import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteResourceDialogComponent } from './delete-resource-dialog.component';

describe('DeleteResourceDialogComponent', () => {
  let component: DeleteResourceDialogComponent;
  let fixture: ComponentFixture<DeleteResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteResourceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
