import { Component, OnInit } from '@angular/core';

import { parser } from "../../../assets/Gramatica/MatrioshTs";
import { TraduccionService } from "../../Servicios/traduccion.service";
import { EjecucionService } from "../../Servicios/ejecucion.service";

import { Generar3DService } from "../../Servicios/generar3-d.service";
import { OptimizarService } from "../../Servicios/optimizar.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private servTr:TraduccionService,private servEj:EjecucionService,private servGen:Generar3DService,private servOpt:OptimizarService) { }
  consola:string="";
  content:string="";
  salida:string="";
txtoptimizado:string="";
  lista:any=[];
  listasemanticos:any=[];
  listatb:any=[];
  ast;

  listaOpt:any=[];
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
    this.listasemanticos=[];
    this.servEj.Ejecucion(this.salida);
    this.listasemanticos=this.servEj.getSemanticos();
    this.lista=this.servEj.getErrores();

    if(this.listasemanticos.length==0){
      try {
          this.ast = parser.parse(this.salida);
          this.consola=this.servGen.generar3D(this.ast);
      }catch (e) {
            console.error(e);
            return;
        }

    }
    
  }
  
  TablaSimbolos(){
    this.listatb=this.servGen.getTabla();
  }

  Optimizar(){

    this.txtoptimizado=this.servOpt.Optimizar(this.consola);
  }

  ReporteOpt(){

    this.listaOpt=this.servOpt.getListOpt();
  }


}
