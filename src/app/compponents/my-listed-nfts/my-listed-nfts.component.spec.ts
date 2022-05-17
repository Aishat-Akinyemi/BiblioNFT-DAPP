import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListedNftsComponent } from './my-listed-nfts.component';

describe('MyListedNftsComponent', () => {
  let component: MyListedNftsComponent;
  let fixture: ComponentFixture<MyListedNftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyListedNftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyListedNftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
