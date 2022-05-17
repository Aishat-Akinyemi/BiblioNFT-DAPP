import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNftsComponent } from './my-nfts.component';

describe('MyNftsComponent', () => {
  let component: MyNftsComponent;
  let fixture: ComponentFixture<MyNftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyNftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
