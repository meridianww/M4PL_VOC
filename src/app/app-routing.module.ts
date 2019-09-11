import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { routeValues } from './utility/route-name';
import { VocComponent } from './voc/voc.component';


const routes: Routes = [
  { path: '', component: VocComponent },
  { path: routeValues.voc, component: VocComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
