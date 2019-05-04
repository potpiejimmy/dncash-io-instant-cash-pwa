import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

// Material:
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Externals
import { LocalStorageModule } from 'angular-2-local-storage';
import { ToastrModule } from 'ngx-toastr';

// App
import { AppRoutingModule } from './app-routing.module';
import { InstantApiService } from './services/instantapi.service';
import { AppService } from './services/app.service';
import { AppComponent } from './app.component';
import { MainComponent } from './routes/main';
import { AmountComponent } from './routes/amount';
import { DenomSelComponent } from './components/denomsel';
import { RegisterComponent } from './routes/register';
import { TokenComponent } from './routes/token';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AmountComponent,
    DenomSelComponent,
    RegisterComponent,
    TokenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    // Material:
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    // Externals:
    LocalStorageModule.forRoot({ prefix: 'dncashio-instant-cash', storageType: 'localStorage' }), // or sessionStorage
    ToastrModule.forRoot({ preventDuplicates: true })
  ],
  providers: [
    AppService,
    InstantApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
