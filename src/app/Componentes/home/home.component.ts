import { Component, OnInit } from '@angular/core';

import { parser } from "../../../assets/Gramatica/MatrioshTs";
import { TraduccionService } from "../../Servicios/traduccion.service";
import { EjecucionService } from "../../Servicios/ejecucion.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private servTr:TraduccionService,private servEj:EjecucionService) { }
  consola:string="";
  content:string="";
  salida:string="";

  lista:any=[];
  listasemanticos:any=[];
  listatb:any=[];
  ast;


  ngOnInit(): void {
  }


  Graficar(){
    this.ast = parser.parse(this.salida);
    this.servTr.Graficar(this.ast);
  }


  Traducir(){
    try {
      this.ast = parser.parse(this.content);

    if(this.ast.nombre!="error"){
      this.lista=[];
      let pila=[];
      pila.push("");
      this.salida="";
      this.servTr.PrimeraPasada(this.ast);
      this.salida=this.servTr.getResult(this.ast,pila);
    }else{
      this.lista=this.ast.lista;
    } 
    } catch (e) {
      console.error(e);
      return;
  }
  }

  Ejecutar(){    
    this.consola="";
    this.lista=[];
    this.listatb=[];
    this.servEj.Ejecucion(this.salida);
    this.listasemanticos=this.servEj.getSemanticos();
    this.lista=this.servEj.getErrores();
    
  }
  
  TablaSimbolos(){
    //this.listatb=this.servEj.getTbs();
  }


}
