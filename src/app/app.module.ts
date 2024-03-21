import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppComponent } from './app.component';
import { LandPricePredictionComponent } from './land-price-prediction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { RegressionService } from './regression.service';

@NgModule({
  declarations: [
    AppComponent,
    LandPricePredictionComponent  ],
  imports: [
    BrowserModule, HttpClientModule, ReactiveFormsModule, FormsModule
  ],
  providers: [DataService, RegressionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
