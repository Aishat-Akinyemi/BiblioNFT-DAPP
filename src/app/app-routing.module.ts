
import { MyListedNftsComponent } from './compponents/my-listed-nfts/my-listed-nfts.component';
import { MyNftsComponent } from './compponents/my-nfts/my-nfts.component';
import { HomeComponent } from './compponents/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path:  '', redirectTo:  'home', pathMatch:  'full' },
  { path: 'my-nfts', component: MyNftsComponent },
  { path: 'my-listed-nfts', component: MyListedNftsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


