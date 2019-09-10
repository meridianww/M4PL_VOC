import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VocComponent } from './voc/voc.component';
import { from } from 'rxjs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTreeModule,
  MatIconModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatRadioModule,
  
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    VocComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatRadioModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
