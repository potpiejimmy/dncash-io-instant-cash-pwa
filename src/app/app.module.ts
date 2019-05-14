import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OverlayModule } from '@angular/cdk/overlay';

// Material:
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

// Externals
import { LocalStorageModule } from 'angular-2-local-storage';
import { ToastrModule } from 'ngx-toastr';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

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
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ApplePayPanel} from './routes/amount';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AmountComponent,
    DenomSelComponent,
    DenomShowComponent,
    RegisterComponent,
    TokenComponent,
    ProcessComponent,
    ApplePayPanel
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    OverlayModule,
    // Material:
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    // Externals:
    LocalStorageModule.forRoot({ prefix: 'dncashio-instant-cash', storageType: 'localStorage' }), // or sessionStorage
    ToastrModule.forRoot({ preventDuplicates: true }), ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ZXingScannerModule
  ],
  providers: [
    AppService,
    InstantApiService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ApplePayPanel
  ]
})
export class AppModule { }
