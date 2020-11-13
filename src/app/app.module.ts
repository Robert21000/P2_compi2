import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CodemirrorModule } from "@ctrl/ngx-codemirror";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './Componentes/nav-bar/nav-bar.component';
import { HomeComponent } from './Componentes/home/home.component';
import { ArbolComponent } from './Componentes/arbol/arbol.component';
import { OptimizacionComponent } from './Componentes/optimizacion/optimizacion.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    ArbolComponent,
    OptimizacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CodemirrorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
