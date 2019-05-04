import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

// Material:
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './routes/main';
import { InstantApiService } from './services/instantapi.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    // Material:
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [
    InstantApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
