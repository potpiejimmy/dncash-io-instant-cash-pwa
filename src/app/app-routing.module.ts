import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './routes/main';
import { AmountComponent } from './routes/amount';
import { RegisterComponent } from './routes/register';
import { TokenComponent } from './routes/token';
import { ProcessComponent } from './routes/process';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'amount', component: AmountComponent},
  {path: 'token', component: TokenComponent},
  {path: 'process', component: ProcessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
