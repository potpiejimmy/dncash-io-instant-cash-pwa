import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

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
import { ProcessComponent } from './routes/process';
import { DenomShowComponent } from './components/denomshow';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AmountComponent,
    DenomSelComponent,
    DenomShowComponent,
    RegisterComponent,
    TokenComponent,
    ProcessComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
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
