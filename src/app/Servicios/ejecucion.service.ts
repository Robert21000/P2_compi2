import { Injectable } from '@angular/core';

import { parser } from "../../assets/Gramatica/MatrioshTs.js";

@Injectable({
  providedIn: 'root'
})
export class EjecucionService {

  constructor() { }

  listaErrores=[];
  listaSemanticos=[];
  ast;
  txtImprimir="";
  
  tbsimbolos=[];
  tbGlobal={tabla:this.tbsimbolos,padre:null};

Ejecucion(entrada){

  try {
    this.ast = parser.parse(entrada);

  if(this.ast.nombre!="error"){
    this.listaErrores=[];
    this.tbsimbolos=[];
    this.tbGlobal={tabla:this.tbsimbolos,padre:null};
    this.RecogerFunciones(this.ast);
    let cicloG={nombre:"",valor:""};
    this.Visitar(this.ast,"","",cicloG,this.tbGlobal);

  }else{
    this.listaErrores=this.ast.lista;

  } 
  } catch (e) {
    console.error(e);
    return;
}


}

getSemanticos(){

  return this.listaSemanticos;
}

getErrores(){

  return this.listaErrores;
}





  RecogerFunciones(Nodo){
    switch(Nodo.nombre){
        case "ini":
          this.RecogerFunciones(Nodo.hijos[0]);
          break;
        case "instrucciones":
            if(Nodo.hijos.length==2){
                this.RecogerFunciones(Nodo.hijos[0]);
                this.RecogerFunciones(Nodo.hijos[1]);
            }else if(Nodo.hijos.length==1){
                this.RecogerFunciones(Nodo.hijos[0]);
            }
          break;
        case "instruccion":
  
              if(Nodo.hijos[0].nombre=="Rfunction"){
                
                if(Nodo.hijos.length==8){
                  let id=Nodo.hijos[1].valor;
                  this.RecogerFunciones(Nodo.hijos[6]);
                  let tipo=Nodo.hijos[6].valor;
                  this.RecogerFunciones(Nodo.hijos[3]);
                  
                  this.tbGlobal.tabla.push({nombre:id,tipo:tipo,valor:"",rol:"funcion",parametros:Nodo.hijos[3].parametros,valores:null,nodo:Nodo,return:""});
                  
  
                }else if(Nodo.hijos.length==7){
                  let id=Nodo.hijos[1].valor;
                  this.RecogerFunciones(Nodo.hijos[5]);
                  let tipo=Nodo.hijos[5].valor;
                  let parametros=[];
                  this.tbGlobal.tabla.push({nombre:id,tipo:tipo,valor:"",rol:"funcion",parametros:parametros,valores:null,nodo:Nodo,return:""});
  
                }
                
              }
          break;
  
      case "Param":
              if(Nodo.hijos.length==5){
                  this.RecogerFunciones(Nodo.hijos[0]);
                  this.RecogerFunciones(Nodo.hijos[4]);
                  for(let item of Nodo.hijos[0].parametros){
                      Nodo.parametros.push(item);
                  }
                  Nodo.parametros.push({nombre:Nodo.hijos[2].valor,tipo:Nodo.hijos[4].valor});
  
              }else if(Nodo.hijos.length==3){
                  this.RecogerFunciones(Nodo.hijos[2]);
                  Nodo.parametros.push({nombre:Nodo.hijos[0].valor,tipo:Nodo.hijos[2].valor});
              }
        break;
  
        case "Ntipo":
          if(Nodo.hijos.length==1){
            Nodo.valor=Nodo.hijos[0].valor;
          }else if(Nodo.hijos.length==3){
            Nodo.valor="arr";
          }
          
          break;
    }
  
  }






  Visitar(Nodo,idFun,tipoFun,ciclo,tbs){
        switch(Nodo.nombre){
            case "ini":
              this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
            break;
            case "instrucciones":
              if(Nodo.hijos.length==1){
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos.length==2){
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
              }
            break;

            case "instruccion":
              if(Nodo.hijos[0].nombre=="DecLet"){
                  this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="DecConst"){
                  //console.log("por aqui si?");
                this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="id"){
                  if(Nodo.hijos.length==4){
                    if(Nodo.hijos[1].nombre=="igual"){
                        let id=Nodo.hijos[0].valor;
                            console.log(id+"para verificar");
                          if(this.existeId(id,tbs)){
                            let tipoId=this.TipoId(id,tbs);
                            let tipoExp:string=this.getExpTipo(Nodo.hijos[2],ciclo,tbs);
                            if(tipoId.toLowerCase()==tipoExp.toLowerCase()){
                                
                                  if(!this.esConst(id,tbs)){

                                  }else{
                                    let error={tipo:"Error Semantico",valor:id,descripcion:"las constantes no pueden reasignarse",linea:Nodo.hijos[1].linea,columna:10};
                                    this.listaSemanticos.push(error);      
                                  }
                            }else{
                                console.log("paso2");
                              let error={tipo:"Error Semantico",valor:id,descripcion:"El tipo id es diferente al tipo de la Expresion",linea:Nodo.hijos[1].linea,columna:10};
                              this.listaSemanticos.push(error);  
                            }
                            
                          }else{
                            let error={tipo:"Error Semantico",valor:id,descripcion:id+ " no se encuentra declarada",linea:Nodo.hijos[1].linea,columna:8};  
                            this.listaSemanticos.push(error);
                          }

                    }else if(Nodo.hijos[1].nombre=="pIzq"){
                      let id=Nodo.hijos[0].valor;                            
                        if(this.EstaFuncion(id)){

                          }else{
                            let error={tipo:"Error Semantico",valor:id,descripcion:"la funcion "+id+ " no se encuentra declarada",linea:Nodo.hijos[1].linea,columna:12};  
                            this.listaSemanticos.push(error); 
                          }
                    }

                  }else if(Nodo.hijos.length==5){

                    let id=Nodo.hijos[0].valor;                            
                    if(this.EstaFuncion(id)){
                          Nodo.hijos[2].valores=[];
                          this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                          let tamanio=Nodo.hijos[2].valores.length;
                          if(tamanio=this.NoParametros(id)){
                              if(!this.diferentesTipos(id,Nodo.hijos[2].valores)){

                              }else{
                                let error={tipo:"Error Semantico",valor:id,descripcion:"la funcion "+id+ " no tiene los mismos tipos",linea:Nodo.hijos[1].linea,columna:18};  
                                this.listaSemanticos.push(error);  
                              }
                          }else{
                            let error={tipo:"Error Semantico",valor:id,descripcion:"la funcion "+id+ " no tiene el mismo numero de parametros",linea:Nodo.hijos[1].linea,columna:15};  
                            this.listaSemanticos.push(error);    
                          }
                          
                      }else{
                        let error={tipo:"Error Semantico",valor:id,descripcion:"la funcion "+id+ " no se encuentra declarada",linea:Nodo.hijos[1].linea,columna:12};  
                        this.listaSemanticos.push(error); 
                      }

                  }else if(Nodo.hijos.length==7){
                      let id=Nodo.hijos[0].valor;
                      if(this.existeId(id,tbs)){
                          if(this.esArreglo(id,tbs)){   
                              if(this.getExpTipo(Nodo.hijos[2],ciclo,tbs)=="number"){
                                  let tipo=this.getExpTipo(Nodo.hijos[2],ciclo,tbs);
                                  if(tipo.toLowerCase()==this.tipoArreglo(id,tbs).toLowerCase()){

                                  }else{
                                    let error={tipo:"Error Semantico",valor:id,descripcion:"el index debe ser tipo number",linea:Nodo.hijos[1].linea,columna:18};  
                                    this.listaSemanticos.push(error);    
                                  }
                              }else{
                                let error={tipo:"Error Semantico",valor:id,descripcion:"el index debe ser tipo number",linea:Nodo.hijos[1].linea,columna:25};  
                                this.listaSemanticos.push(error);    
                              }
                          }else{
                            let error={tipo:"Error Semantico",valor:id,descripcion:"el id "+id+ " no es de tipo arreglo",linea:Nodo.hijos[1].linea,columna:31};  
                            this.listaSemanticos.push(error);
                          }
                    }else{
                        let error={tipo:"Error Semantico",valor:id,descripcion:"el id "+id+ " no existe",linea:Nodo.hijos[1].linea,columna:21};  
                        this.listaSemanticos.push(error);
                    }
                  }
              }else if(Nodo.hijos[0].nombre=="Rfunction"){
                  if(Nodo.hijos.length==7){
                      let tabla=[];
                      let tbsLocal={tabla:tabla,padre:this.tbGlobal};
                      let id=Nodo.hijos[1].valor;
                      this.Visitar(Nodo.hijos[5],idFun,tipoFun,ciclo,tbs);
                      let tipo=Nodo.hijos[5].valor;  
                      
                      this.Visitar(Nodo.hijos[6],id,tipo,ciclo,tbsLocal);
                  }else if(Nodo.hijos.length==8){
                    let tabla=[];
                    let tbsLocal={tabla:tabla,padre:this.tbGlobal};  
                    this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbsLocal);
                    let id=Nodo.hijos[1].valor;
                    this.Visitar(Nodo.hijos[6],idFun,tipoFun,ciclo,tbs);
                    let tipo=Nodo.hijos[6].valor;  
                    
                    this.Visitar(Nodo.hijos[7],id,tipo,ciclo,tbsLocal);
                  }

              }else if(Nodo.hijos[0].nombre=="Rbreak"){
                        if(ciclo.nombre=="ciclo"){

                        }else{
                          let error={tipo:"Error Semantico",valor:"break",descripcion:"Un break solo debe venir dentro dentro de un ciclo o switch",linea:Nodo.hijos[0].linea,columna:7};  
                          this.listaSemanticos.push(error);
                        }

              }else if(Nodo.hijos[0].nombre=="Rreturn"){
                    if(Nodo.hijos.length==2){
                        if(idFun!=""){

                        }else{
                          let error={tipo:"Error Semantico",valor:"return",descripcion:"Un return solo debe venir dentro de una funcion",linea:Nodo.hijos[1].linea,columna:7};  
                          this.listaSemanticos.push(error);
                        }
                    }else if(Nodo.hijos.length==3){
                      if(idFun!=""){
                        let tipo=this.getExpTipo(Nodo.hijos[1],ciclo,tbs);
                        if(tipo.toLowerCase()==tipoFun.toLowerCase()){

                        }else{
                          let error={tipo:"Error Semantico",valor:"return",descripcion:"El valor de retorno debe ser del mismo tipo de la funcion",linea:Nodo.hijos[0].linea,columna:7};  
                          this.listaSemanticos.push(error);  
                        }
                      }else{
                        let error={tipo:"Error Semantico",valor:"return",descripcion:"Un return solo debe venir dentro de una funcion",linea:Nodo.hijos[0].linea,columna:7};  
                        this.listaSemanticos.push(error);
                      }

                    }

              }else if(Nodo.hijos[0].nombre=="Rcontinue"){
                if(ciclo.nombre=="ciclo"){

                }else{
                  let error={tipo:"Error Semantico",valor:"continue",descripcion:"Un continue solo debe venir dentro dentro de un ciclo",linea:Nodo.hijos[0].linea,columna:7};  
                  this.listaSemanticos.push(error);
                }
              }else if(Nodo.hijos[0].nombre=="Rif"){
                  if(Nodo.hijos.length==3){
                      this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                      let tipo=Nodo.hijos[1].res;
                      if(tipo.toLowerCase()=="boolean"){
                            let tabla=[];
                            let tbsLocal={tabla:tabla,padre:tbs};  
                            this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbsLocal);
                      }else{
                        let error={tipo:"Error Semantico",valor:"if",descripcion:"La condicion del If debe ser tipo boolean",linea:Nodo.hijos[0].linea,columna:25};  
                        this.listaSemanticos.push(error);
                      }
                  }else if(Nodo.hijos.length==4){
                    this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                    let tipo=Nodo.hijos[1].res;
                      if(tipo.toLowerCase()=="boolean"){
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs};  
                        this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbsLocal);
                        let tabla2=[];
                        let tbsLocal2={tabla:tabla2,padre:tbs};
                        this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbsLocal2);
                      }else{
                        let error={tipo:"Error Semantico",valor:"if",descripcion:"La condicion del If debe ser tipo boolean",linea:Nodo.hijos[0].linea,columna:25};  
                        this.listaSemanticos.push(error);
                      }

                  }else if(Nodo.hijos.length==5){
                      this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                      let tipo=Nodo.hijos[1].res;
                      if(tipo.toLowerCase()=="boolean"){
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs};  
                        this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbsLocal);
                        let tabla2=[];
                        let tbsLocal2={tabla:tabla2,padre:tbs};
                        this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbsLocal2);
                        let tabla3=[];
                        let tbsLocal3={tabla:tabla3,padre:tbs};
                        this.Visitar(Nodo.hijos[4],idFun,tipoFun,ciclo,tbsLocal3);
                      }else{
                        let error={tipo:"Error Semantico",valor:"if",descripcion:"La condicion del If debe ser tipo boolean",linea:Nodo.hijos[0].linea,columna:25};  
                        this.listaSemanticos.push(error);
                      }

                  }

              }else if(Nodo.hijos[0].nombre=="Rswitch"){
                  let tipo=this.getExpTipo(Nodo.hijos[2],ciclo,tbs);
                  if(tipo.toLowerCase()=="boolean".toLowerCase()||tipo.toLowerCase()=="number".toLowerCase()){
                    let tabla=[];
                    let tbsLocal={tabla:tabla,padre:tbs};
                    let miciclo={nombre:"ciclo",valor:""};  
                    this.Visitar(Nodo.hijos[5],idFun,tipoFun,miciclo,tbsLocal);

                    let tabla2=[];
                    let tbsLocal2={tabla:tabla2,padre:tbs};
                    let miciclo2={nombre:"ciclo",valor:""};  
                    this.Visitar(Nodo.hijos[6],idFun,tipoFun,miciclo2,tbsLocal2);

                  }else{
                    let error={tipo:"Error Semantico",valor:"switch",descripcion:"El tipo de la expresion no es permitida",linea:Nodo.hijos[1].linea,columna:25};  
                    this.listaSemanticos.push(error);
                  }
              }else if(Nodo.hijos[0].nombre=="Rwhile"){
                 this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);   
                 let tipo=Nodo.hijos[1].res;
                 if(tipo.toLowerCase()=="boolean"){
                  let tabla=[];
                  let tbsLocal={tabla:tabla,padre:tbs};
                  let miciclo={nombre:"ciclo",valor:""};
                  this.Visitar(Nodo.hijos[2],idFun,tipoFun,miciclo,tbsLocal);
                 }else{
                  let error={tipo:"Error Semantico",valor:"while",descripcion:"El tipo de expresión debe ser booleana",linea:Nodo.hijos[0].linea,columna:25};  
                  this.listaSemanticos.push(error);
                 }

              }else if(Nodo.hijos[0].nombre=="Rdo"){
                  this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);
                  let tipo=Nodo.hijos[3].res;
                  let tabla=[];
                  let tbsLocal={tabla:tabla,padre:tbs};
                  let miciclo={nombre:"ciclo",valor:""};
                  this.Visitar(Nodo.hijos[1],idFun,tipoFun,miciclo,tbsLocal);

                  if(tipo.toLowerCase()=="boolean"){

                  }else{
                    let error={tipo:"Error Semantico",valor:"do while",descripcion:"El tipo de expresión debe ser booleana",linea:Nodo.hijos[0].linea,columna:25};  
                    this.listaSemanticos.push(error);
                  }

              }else if(Nodo.hijos[0].nombre=="Rfor"){
                  if(Nodo.hijos.length==8){
                  
                  }else if(Nodo.hijos.length==9){
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs};
                      this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbsLocal);
                      let tipo=this.getExpTipo(Nodo.hijos[4],ciclo,tbsLocal);
                      if(tipo.toLowerCase()=="boolean".toLowerCase()){
                        this.Visitar(Nodo.hijos[6],idFun,tipoFun,ciclo,tbsLocal);
                        
                        let miciclo={nombre:"ciclo",valor:""};
                        this.Visitar(Nodo.hijos[8],idFun,tipoFun,miciclo,tbsLocal);
                      }else{
                        let error={tipo:"Error Semantico",valor:"for",descripcion:"El tipo de expresión debe ser booleana",linea:Nodo.hijos[1].linea,columna:25};  
                        this.listaSemanticos.push(error);
                      }
                      
                  }

              }else if(Nodo.hijos[0].nombre=="Rconsole"){
                    let tipo=this.getExpTipo(Nodo.hijos[4],ciclo,tbs);
                    if(tipo.toLowerCase()=="string".toLowerCase()||tipo.toLowerCase()=="number".toLowerCase()||tipo.toLowerCase()=="boolean".toLowerCase()){

                    }else{
                        let error={tipo:"Error Semantico",valor:"console",descripcion:"El tipo de expresion no es permitida para imprimirse",linea:Nodo.hijos[1].linea,columna:33};  
                        this.listaSemanticos.push(error);
                    }

              }else if(Nodo.hijos[0].nombre=="Aumento"){
                    
                    this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="Decremento"){
                    this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="SumaIgual"){
                    this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }else if(Nodo.hijos[0].nombre=="RestaIgual"){
                  this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
              }

              break;
              case "Lparam":
                  if(Nodo.hijos.length==3){
                    Nodo.valores=[];
                    this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);  
                    for(let item of Nodo.hijos[0].valores){
                        Nodo.valores.push(item);
                      }
                      let tipo=this.getExpTipo(Nodo.hijos[2],ciclo,tbs);
                      Nodo.valores.push(tipo);  
                    
                  }else if(Nodo.hijos.length==1){
                    Nodo.valores=[];
                    let tipo=this.getExpTipo(Nodo.hijos[0],ciclo,tbs);
                    Nodo.valores.push(tipo);
                    }
               break;
               
             case "DecLet":
                  this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);    
               break;
             case "Lasig":
                    if(Nodo.hijos.length==1){
                   
                      this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                    }else if(Nodo.hijos.length==3){
                      this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                      this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs); 
                    }
               break;
              case "IA":
                    let id=Nodo.hijos[0].valor;
                    this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                    let tipo=Nodo.hijos[2].valor;
                   if(Nodo.hijos.length==3){
                        if(!this.existeEnMiAmbito(id,tbs)){
                          this.asignarIdcnTipo(id,tipo,"let",tbs);
                        }else{
                          let error={tipo:"Error Semantico",valor:id,descripcion:"el id "+id+ " ya  existe en este ambito",linea:Nodo.hijos[1].linea,columna:3};  
                          this.listaSemanticos.push(error);
                        }
                        
                   }else if(Nodo.hijos.length==5){
                     
                        let tipo2=this.getExpTipo(Nodo.hijos[4],ciclo,tbs);
                        //this.asignarIdcnTipo(id,tipo,"let",tbs);
                        if(!this.existeEnMiAmbito(id,tbs)){
                            if(tipo.toLowerCase()==tipo2.toLowerCase()){
                              this.asignarIdcnTipo(id,tipo,"let",tbs);
                            }else{
                              let error={tipo:"Error Semantico",valor:id,descripcion:"los tipos no son iguales en la asignacion",linea:Nodo.hijos[1].linea,columna:15};  
                              this.listaSemanticos.push(error);    
                            }

                        }else{
                          let error={tipo:"Error Semantico",valor:id,descripcion:"el id "+id+ " ya  existe en este ambito",linea:Nodo.hijos[1].linea,columna:3};  
                          this.listaSemanticos.push(error);
                        }

                   } 
                break;
            case "DecConst":
                  console.log("y por aqui?");
                   this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
              break; 
            
            case "Lconst":
                   console.log("ahora aqui?");
                   if(Nodo.hijos.length==1){
                      this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                   }else if(Nodo.hijos.length==3){
                      this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                      this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                   }
              break;
            
             case "CA":
                  let id2=Nodo.hijos[0].valor;
                  console.log("entro en CA");
                  if(!this.existeEnMiAmbito(id2,tbs)){
                      this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                      let tipo=Nodo.hijos[2].valor;
                      let tipo2=this.getExpTipo(Nodo.hijos[4],ciclo,tbs);  
                      if(tipo.toLowerCase()==tipo2.toLowerCase()){
                          console.log("se pudo asignar");
                          this.asignarIdcnTipo(id2,tipo,"const",tbs);
                      }else{
                          let error={tipo:"Error Semantico",valor:id,descripcion:"el id "+id+ " ya  existe en este ambito",linea:Nodo.hijos[1].linea,columna:8};  
                          this.listaSemanticos.push(error);  
                      }
                  }else{
                      let error={tipo:"Error Semantico",valor:id,descripcion:"el id "+id+ " ya  existe en este ambito",linea:Nodo.hijos[1].linea,columna:8};  
                      this.listaSemanticos.push(error);

                  }  

               break;
           case "Condicion":
                  let tipocon=this.getExpTipo(Nodo.hijos[1],ciclo,tbs);
                  Nodo.res=tipocon;
             break;
          
            case "BloqueIns":
                  if(Nodo.hijos.length==2){

                  }else if(Nodo.hijos.length==3){
                      this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbs);
                  }
              break;
              
            case "NelseIf":
                  if(Nodo.hijos.length==4){ 
                      this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                      let tipo=Nodo.hijos[2].res;
                      if(tipo.toLowerCase()=="boolean"){
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs};  
                        this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbsLocal);
                      }else{
                        let error={tipo:"Error Semantico",valor:"else if",descripcion:"La condicion del esle if debe ser tipo boolean",linea:Nodo.hijos[1].linea,columna:25};  
                        this.listaSemanticos.push(error);
                      }

                  }else if(Nodo.hijos.length==5){
                      this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                      this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);
                      let tipo=Nodo.hijos[3].res;
                      if(tipo.toLowerCase()=="boolean"){
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs};  
                        this.Visitar(Nodo.hijos[4],idFun,tipoFun,ciclo,tbsLocal);
                      }else{
                        let error={tipo:"Error Semantico",valor:"else if",descripcion:"La condicion del esle if debe ser tipo boolean",linea:Nodo.hijos[1].linea,columna:25};  
                        this.listaSemanticos.push(error);
                      }

                  }
              break;

              case "Nelse":
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs};  
                        this.Visitar(Nodo.hijos[1],idFun,tipoFun,ciclo,tbsLocal);
                break;
              case "Ncase":
                    if(Nodo.hijos.length==4){
                        let tipo=this.getExpTipo(Nodo.hijos[1],ciclo,tbs);
                        if(tipo.toLowerCase()=="number".toLowerCase()||tipo.toLowerCase()=="boolean".toLowerCase()){
                            this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs);
                        }else{
                          let error={tipo:"Error Semantico",valor:"case",descripcion:"El tipo de la expresion no es permitida",linea:Nodo.hijos[0].linea,columna:27};  
                          this.listaSemanticos.push(error);
                        }

                    }else if(Nodo.hijos.length==5){
                        this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                        let tipo=this.getExpTipo(Nodo.hijos[2],ciclo,tbs);
                        if(tipo.toLowerCase()=="number".toLowerCase()||tipo.toLowerCase()=="boolean".toLowerCase()){
                          this.Visitar(Nodo.hijos[4],idFun,tipoFun,ciclo,tbs);
                        }else{
                          let error={tipo:"Error Semantico",valor:"case",descripcion:"El tipo de la expresion no es permitida",linea:Nodo.hijos[1].linea,columna:27};  
                          this.listaSemanticos.push(error);
                        }

                    }
                break;
              
               case "Ndefault":
                 if(Nodo.hijos.length==1){

                 }else if(Nodo.hijos.length==3){
                  this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                 }
                     
                 break; 
              case "AsignaFor":
                      if(Nodo.hijos.length==3){
                          if(this.existeId(id,tbs)){
                              if(!this.esConst(id,tbs)){
                                let tipo=this.getExpTipo(Nodo.hijos[0],ciclo,tbs);
                                let tiop2=this.getExpTipo(Nodo.hijos[2],ciclo,tbs);
                                if(tipo.toLowerCase()==tiop2.toLowerCase()){

                                }else{
                                    let error={tipo:"Error Semantico",valor:id,descripcion:"No se le puede asignar un tipo diferente",linea:Nodo.hijos[1].linea,columna:24};  
                                    this.listaSemanticos.push(error);  
                                }

                              }else{
                                let error={tipo:"Error Semantico",valor:id,descripcion:"El id para for no puede ser const",linea:Nodo.hijos[1].linea,columna:24};  
                                this.listaSemanticos.push(error);    
                              }
                          }else{
                            let error={tipo:"Error Semantico",valor:id,descripcion:"El id para for no existe",linea:Nodo.hijos[1].linea,columna:24};  
                            this.listaSemanticos.push(error);
                          }
                      }else if(Nodo.hijos.length==6){
                            let id=Nodo.hijos[1].valor;
                            if(!this.existeEnMiAmbito(id,tbs)){
                                this.Visitar(Nodo.hijos[3],idFun,tipoFun,ciclo,tbs); 
                                let tipo1=Nodo.hijos[3].valor;
                                let tipo2=this.getExpTipo(Nodo.hijos[5],ciclo,tbs);
                                if(tipo1.toLowerCase()==tipo2.toLowerCase()){
                                      this.asignarIdcnTipo(id,tipo2,"let",tbs);
                                }else{
                                  let error={tipo:"Error Semantico",valor:id,descripcion:"El id para for se le quiere asignar un tipo distinto",linea:Nodo.hijos[2].linea,columna:24};  
                                  this.listaSemanticos.push(error);  
                                }
                            }else{
                                let error={tipo:"Error Semantico",valor:id,descripcion:"El id para for no existe",linea:Nodo.hijos[2].linea,columna:24};  
                                this.listaSemanticos.push(error);
                            }

                      }
                break;

                case "insfor":
                      if(Nodo.hijos.length==1){
                          this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                      }else if(Nodo.hijos.length==3){
                          let id=Nodo.hijos[0].valor;
                          if(this.existeId(id,tbs)){
                              if(!this.esConst(id,tbs)){
                                let tipo1=this.getExpTipo(Nodo.hijos[0],ciclo,tbs);
                                let tipo2=this.getExpTipo(Nodo.hijos[2],ciclo,tbs);
                                  if(tipo1.toLowerCase()==tipo2.toLowerCase()){

                                  }else{
                                    let error={tipo:"Error Semantico",valor:id,descripcion:"el id de for se el quiere asignar un tipo distinto",linea:Nodo.hijos[1].linea,columna:45};  
                                    this.listaSemanticos.push(error);      
                                  }

                              }else{
                                let error={tipo:"Error Semantico",valor:id,descripcion:"el id de asignacion for es const",linea:Nodo.hijos[1].linea,columna:45};  
                                this.listaSemanticos.push(error);    
                              }

                          }else{
                            let error={tipo:"Error Semantico",valor:id,descripcion:"El id para for no existe",linea:Nodo.hijos[1].linea,columna:45};  
                            this.listaSemanticos.push(error);
                          }
                      }
                  break;
                  case "Aumento":
                    let id3=Nodo.hijos[0].valor;
                      if(this.existeId(id3,tbs)){
                          let tipo=this.TipoId(id3,tbs);
                          if(tipo.toLowerCase()=="number".toLowerCase()){

                          }else{
                            let error={tipo:"Error Semantico",valor:id3,descripcion:"El id para aumentar debe ser tipo number",linea:Nodo.hijos[1].linea,columna:45};  
                            this.listaSemanticos.push(error); 
                          }
                      }else{
                            let error={tipo:"Error Semantico",valor:id3,descripcion:"El id no existe para aumentar",linea:Nodo.hijos[1].linea,columna:52};  
                            this.listaSemanticos.push(error);
                      }
                    break;

                   case "Decremento":
                        let id4=Nodo.hijos[0].valor;
                        if(this.existeId(id4,tbs)){
                            let tipo=this.TipoId(id4,tbs);
                            if(tipo.toLowerCase()=="number".toLowerCase()){

                            }else{
                              let error={tipo:"Error Semantico",valor:id4,descripcion:"El id para decremento debe ser tipo number",linea:Nodo.hijos[1].linea,columna:45};  
                              this.listaSemanticos.push(error); 
                            }
                        }else{
                              let error={tipo:"Error Semantico",valor:id4,descripcion:"El id no existe para decrementar",linea:Nodo.hijos[1].linea,columna:52};  
                              this.listaSemanticos.push(error);
                        }
                     break;
                  case "SumaIgual":
                    let id5=Nodo.hijos[0].valor;
                    if(this.existeId(id5,tbs)){
                        let tipo=this.TipoId(id5,tbs);
                        if(tipo.toLowerCase()=="number".toLowerCase()||tipo.toLowerCase()=="string".toLowerCase()){

                        }else{
                          let error={tipo:"Error Semantico",valor:id5,descripcion:"El id para suma igual debe ser tipo number o string",linea:Nodo.hijos[1].linea,columna:45};  
                          this.listaSemanticos.push(error); 
                        }
                    }else{
                          let error={tipo:"Error Semantico",valor:id5,descripcion:"El id no existe para suma igual",linea:Nodo.hijos[1].linea,columna:52};  
                          this.listaSemanticos.push(error);
                    }
                    break;
                  case "RestaIgual":
                    let id6=Nodo.hijos[0].valor;
                    if(this.existeId(id6,tbs)){
                        let tipo=this.TipoId(id6,tbs);
                        if(tipo.toLowerCase()=="number".toLowerCase()){

                        }else{
                          let error={tipo:"Error Semantico",valor:id6,descripcion:"El id para resta igual debe ser tipo number",linea:Nodo.hijos[1].linea,columna:45};  
                          this.listaSemanticos.push(error); 
                        }
                    }else{
                          let error={tipo:"Error Semantico",valor:id6,descripcion:"El id no existe para resta igual",linea:Nodo.hijos[1].linea,columna:52};  
                          this.listaSemanticos.push(error); 
                        }
                    break;
              case "Ntipo":
                  if(Nodo.hijos.length==1){
                    Nodo.valor=Nodo.hijos[0].valor;
                  }else if(Nodo.hijos.length==3){
                    Nodo.valor="arr";
                  }   
                break;
              case "Param":
                  if(Nodo.hijos.length==3){
                      let id=Nodo.hijos[0].valor;
                      this.Visitar(Nodo.hijos[2],idFun,tipoFun,ciclo,tbs);
                      let tipo=Nodo.hijos[2].valor;
                      this.asignarIdcnTipo(id,tipo,"let",tbs);

                  }else if(Nodo.hijos.length==5){
                      this.Visitar(Nodo.hijos[0],idFun,tipoFun,ciclo,tbs);
                      let id=Nodo.hijos[2].valor;
                      this.Visitar(Nodo.hijos[4],idFun,tipoFun,ciclo,tbs);
                      let tipo=Nodo.hijos[4].valor;
                      this.asignarIdcnTipo(id,tipo,"let",tbs);
                    }
                break; 


        }



  }


  existeId(id,tbs){
    let existe=false;
    let padre=null;
    //console.log(id);
    padre=tbs;
   
      while(padre!=null){
        for(let item of padre.tabla){
            //console.log("--"+item.nombre+"--");
          if(item.nombre.toLowerCase()==id.toLowerCase()&&(item.rol.toLowerCase()=="let".toLowerCase()||item.rol.toLowerCase()=="const".toLowerCase())){
              existe=true;
          }
      }
        if(existe){
            break;
        }
        padre=padre.padre;
      }
    return existe;
    }


    esConst(id,tbs){
      let existe=false;
      let padre=null;
      padre=tbs;
        while(padre!=null){
          for(let item of padre.tabla){
            if(item.nombre.toLowerCase()==id.toLowerCase()&&item.rol.toLowerCase()=="const"){
                existe=true;
            }
        }
          if(existe){
              break;
          }
          padre=padre.padre;
        }
      return existe;
      }


    EstaFuncion(id){
      let existe=false;
      for(let item of this.tbGlobal.tabla){
            if(item.nombre.toLowerCase()==id.toLowerCase()&&item.rol.toLowerCase()=="funcion"){
                existe=true;
            }
        }
          
      return existe;
      }

      NoParametros(id){
        let numero=0;
        let existe=false;
        for(let item of this.tbGlobal.tabla){
              if(item.nombre.toLowerCase()==id.toLowerCase()&&item.rol.toLowerCase()=="funcion"){
                  existe=true;
                  numero=item.parametros.length;
              }
          }
            
        return numero;
      }


      diferentesTipos(id,parametros){
        let existe=false;
        let diferente=false;
        for(let item of this.tbGlobal.tabla){
              if(item.nombre.toLowerCase()==id.toLowerCase()&&item.rol.toLowerCase()=="funcion"){
                  existe=true;
                  for(let i=0; i< item.parametros.length;i++){
                      if(parametros[i].toLowerCase()!=item.parametros[i].tipo.toLowerCase()){
                            diferente=true;
                      }
                  }
              }
            if(existe){
                break;
            }  
        }
            
        return diferente;
      }
    
  TipoId(id,tbs){
    let existe=false;
    let padre=null;
    let tipo="string";
    padre=tbs;
      while(padre!=null){
        for(let item of padre.tabla){
          if(item.nombre.toLowerCase()==id.toLowerCase()&&(item.rol.toLowerCase()=="let".toLowerCase()||item.rol.toLowerCase()=="const".toLowerCase())){
              existe=true;
              tipo=item.tipo;
          }
      }
        if(existe){
            break;
        }
        padre=padre.padre;
      }
    
    return tipo;
    }

    tipoFuncion(id){
      let tipo="";
      for(let item of this.tbGlobal.tabla){
            if(item.nombre.toLowerCase()==id.toLowerCase()&&item.rol.toLowerCase()=="funcion"){
                tipo=item.tipo;
            }
        }
          
      return tipo;
      }

      esArreglo(id,tbs){
        let existe=false;
        let padre=null;
        padre=tbs;
          while(padre!=null){
            for(let item of padre.tabla){
              if(item.nombre.toLowerCase()==id.toLowerCase()&&(item.rol.toLowerCase()=="let".toLowerCase()||item.rol.toLowerCase()=="const".toLowerCase())&&item.tipo=="arr"){
                  existe=true;
              }
          }
            if(existe){
                break;
            }
            padre=padre.padre;
          }
        return existe;
        }



        tipoArreglo(id,tbs){
          let tipo="number";
          let existe=false;
          let padre=null;
          padre=tbs;
            while(padre!=null){
              for(let item of padre.tabla){
                if(item.nombre.toLowerCase()==id.toLowerCase()&&(item.rol.toLowerCase()=="let".toLowerCase()||item.rol.toLowerCase()=="const".toLowerCase())&&item.tipo=="arr"){
                    existe=true;
                    tipo=item.parametros[0].tipo;
                }
            }
              if(existe){
                  break;
              }
              padre=padre.padre;
            }
          return tipo;
          }

          existeEnMiAmbito(id,tbs){
            let existe=false;
                for(let item of tbs.tabla){
                  if(item.nombre.toLowerCase()==id.toLowerCase()&&(item.rol=="let"||item.rol=="const")){
                      existe=true;
                  }
              }
               
            return existe;
            }

            asignarIdcnTipo(id,tipo,rol,tbs){
              tbs.tabla.push({nombre:id,tipo:tipo,valor:"",rol:rol});  
            }




    getExpTipo(Exp,ciclo,tb):string{
       if(Exp.hijos.length==5){
         let condicion:string=this.getExpTipo(Exp.hijos[0],ciclo,tb);
         if(condicion.toLowerCase()=="boolean".toLowerCase()){
             
            return this.getExpTipo(Exp.hijos[2],ciclo,tb);
         }else{
            let error={tipo:"Error Semantico",valor:condicion,descripcion:"La condicion debe ser booleana",linea:Exp.hijos[1].linea,columna:5};
            this.listaSemanticos.push(error);
            return "number";
         }
   
       }else if(Exp.hijos.length==4){
           if(Exp.hijos[1].nombre=="pIzq"){
                let id= Exp.hijos[0].valor;                
                if(this.EstaFuncion(id)){
                    let tipo=this.tipoFuncion(id);

                    Exp.hijos[2].valores=[];
                    this.Visitar(Exp.hijos[2],"","",ciclo,tb);
                    let tamanio=Exp.hijos[2].valores.length;

                    if(tamanio==this.NoParametros(id)){
                        if(!this.diferentesTipos(id,Exp.hijos[2].valores)){

                            return tipo;
                        }else{
                            let error={tipo:"Error Semantico",valor:id,descripcion:"Los tipos de Parametros de la funcion son distintos",linea:Exp.hijos[1].linea,columna:24};
                            this.listaSemanticos.push(error);
                            return tipo;    
                        }

                    }else{
                      let error={tipo:"Error Semantico",valor:id,descripcion:"El numero de Parametros de la funcion son distintos",linea:Exp.hijos[1].linea,columna:24};
                      this.listaSemanticos.push(error);
                      return tipo;
                    }
             }else{
                let error={tipo:"Error Semantico",valor:id,descripcion:"la funcion no Existe",linea:Exp.hijos[1].linea,columna:24};
                this.listaSemanticos.push(error);
                return "string";
             }
             
            
            return "string";
         
           }else if(Exp.hijos[1].nombre=="cIzq"){
               let id=Exp.hijos[0].valor;
               if(!this.existeId(id,tb)){
                  let error={tipo:"Error Semantico",valor:id,descripcion:"El id no existe ",linea:Exp.hijos[1].linea,columna:11};
                  this.listaSemanticos.push(error);   
                  return "string";
               }
   
               let tipo=this.getExpTipo(Exp.hijos[2],ciclo,tb);
               if(tipo.toLowerCase()=="number".toLowerCase()){
                return tipo;
               }else{
                let error={tipo:"Error Semantico",valor:id,descripcion:"El index debe ser tipo number",linea:Exp.hijos[1].linea,columna:7};
                this.listaSemanticos.push(error);   
                return "number";
               }
                    
      
           }
   
       }else if(Exp.hijos.length==3){
         let tipo1;
         let tipo2;
             if(Exp.hijos[1].nombre!="Exp"&&Exp.hijos[1].nombre!="pIzq"&&Exp.hijos[1].nombre!="LExp"&&Exp.hijos[1].nombre!="punto"){
               tipo1=this.getExpTipo(Exp.hijos[0],ciclo,tb);
                tipo2=this.getExpTipo(Exp.hijos[2],ciclo,tb);
             }  
               
         switch (Exp.hijos[1].nombre) {
             case "difer":
              if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){

                return "boolean";
              }else if(tipo1.toLowerCase()=="boolean"&&tipo2.toLowerCase()=="boolean"){

                return "boolean";
              }else if(tipo1.toLowerCase()=="string"&&tipo2.toLowerCase()=="string"){
                return "boolean";
              }else if(tipo1.toLowerCase()=="arr"&&tipo2.toLowerCase()=="arr"){
                return "boolean";
              }else if(tipo1.toLowerCase()=="string"&&tipo2.toLowerCase()=="null"){
                return "boolean";
              }else if(tipo1.toLowerCase()=="arr"&&tipo2.toLowerCase()=="null"){    
                return "boolean";  
              }else if(tipo1.toLowerCase()=="null"&&tipo2.toLowerCase()=="null"){
                return "boolean";
              }else{
                let error={tipo:"Error Semantico",valor:"!",descripcion:"No se puede comparar tipos incompatibles",linea:Exp.hijos[1].linea,columna:11};
                this.listaSemanticos.push(error);
                return "boolean";
              }     
            case "dbigual":
              if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){

                return "boolean";
              }else if(tipo1.toLowerCase()=="boolean"&&tipo2.toLowerCase()=="boolean"){

                return "boolean";
              }else if(tipo1.toLowerCase()=="string"&&tipo2.toLowerCase()=="string"){
                return "boolean";
              }else if(tipo1.toLowerCase()=="arr"&&tipo2.toLowerCase()=="arr"){
                return "boolean";
              }else if(tipo1.toLowerCase()=="string"&&tipo2.toLowerCase()=="null"){
                return "boolean";
              }else if(tipo1.toLowerCase()=="arr"&&tipo2.toLowerCase()=="null"){    
                return "boolean";  
              }else if(tipo1.toLowerCase()=="null"&&tipo2.toLowerCase()=="null"){
                return "boolean";
              }else{
                let error={tipo:"Error Semantico",valor:"==",descripcion:"No se puede comparar tipos incompatibles",linea:Exp.hijos[1].linea,columna:11};
                this.listaSemanticos.push(error);
                return "boolean";
              }    

              case "mas":
                if(tipo1.toLowerCase()!="arr"&&tipo2.toLowerCase()!="arr"){

                  if(tipo1.toLowerCase()=="string"||tipo2.toLowerCase()=="string"){

                    return "string";
                  }else if(tipo1.toLowerCase()=="number"||tipo2.toLowerCase()=="number"){
                     
                    return "number";
                  }
                  else{
                    let error={tipo:"Error Semantico",valor:"+",descripcion:"No se puede operar tipos incompatibles",linea:Exp.hijos[1].linea,columna:22};
                    this.listaSemanticos.push(error);
                    return "number";
                  }

                }else{
                  let error={tipo:"Error Semantico",valor:"+",descripcion:"No se puede operar tipos incompatibles",linea:Exp.hijos[1].linea,columna:22};
                  this.listaSemanticos.push(error);
                  return "number";
                }
                
             case "menos":
                if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                  return "number";
                }else{
                  let error={tipo:"Error Semantico",valor:"-",descripcion:"No se puede operar tipos incompatibles",linea:Exp.hijos[1].linea,columna:9};
                  this.listaSemanticos.push(error);
                  return "number";
                }
               
             case "por":
              if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                return "number";
              }else{
                let error={tipo:"Error Semantico",valor:"*",descripcion:"No se puede operar tipos incompatibles",linea:Exp.hijos[1].linea,columna:8};
                this.listaSemanticos.push(error);
                return "number";
              }
               
             case "div":
              if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                return "number";
              }else{
                let error={tipo:"Error Semantico",valor:"/",descripcion:"No se puede operar tipos incompatibles",linea:Exp.hijos[1].linea,columna:13};
                this.listaSemanticos.push(error);
                return "number";
              }
               
             case "pot":
              if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                return "number";
              }else{
                let error={tipo:"Error Semantico",valor:"**",descripcion:"No se puede operar tipos incompatibles",linea:Exp.hijos[1].linea,columna:16};
                this.listaSemanticos.push(error);
                return "number";
              }
   
             case "mod":
              if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                return "number";
              }else{
                let error={tipo:"Error Semantico",valor:"%",descripcion:"No se puede operar tipos incompatibles",linea:Exp.hijos[1].linea,columna:8};
                this.listaSemanticos.push(error);
                return "number";
              }
             case "menor":
               if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                return "boolean";
              }else{
                let error={tipo:"Error Semantico",valor:"<",descripcion:"No se puede comparar tipos incompatibles",linea:Exp.hijos[1].linea,columna:12};
                this.listaSemanticos.push(error);
                return "boolean";
              }
               
               

             case "mayor":
      
              if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                return "boolean";
              }else{
                let error={tipo:"Error Semantico",valor:">",descripcion:"No se puede comparar tipos incompatibles",linea:Exp.hijos[1].linea,columna:16};
                this.listaSemanticos.push(error);
                return "boolean";
              }
               
               case "menorq":
                if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                  return "boolean";
                }else{
                  let error={tipo:"Error Semantico",valor:"<=",descripcion:"No se puede comparar tipos incompatibles",linea:Exp.hijos[1].linea,columna:13};
                  this.listaSemanticos.push(error);
                  return "boolean";
                }
             case "mayorq":
               
              if(tipo1.toLowerCase()=="number"&&tipo2.toLowerCase()=="number"){
                return "boolean";
              }else{
                let error={tipo:"Error Semantico",valor:">=",descripcion:"No se puede comparar tipos incompatibles",linea:Exp.hijos[1].linea,columna:22};
                this.listaSemanticos.push(error);
                return "boolean";
              }
              
             case "or":
              if(tipo1.toLowerCase()=="boolean"&&tipo2.toLowerCase()=="boolean"){
                return "boolean";
              }else{
                let error={tipo:"Error Semantico",valor:"||",descripcion:"No se puede comparar tipos incompatibles",linea:Exp.hijos[1].linea,columna:16};
                this.listaSemanticos.push(error);
                return "boolean";
              }
             case "and":
              if(tipo1.toLowerCase()=="boolean"&&tipo2.toLowerCase()=="boolean"){
                return "boolean";
              }else{
                let error={tipo:"Error Semantico",valor:"&&",descripcion:"No se puede comparar tipos incompatibles",linea:Exp.hijos[1].linea,columna:21};
                this.listaSemanticos.push(error);
                return "boolean";
              }
                
             case "Exp":
               
               return this.getExpTipo(Exp.hijos[1],ciclo,tb);
               
             case "pIzq":
               let id=Exp.hijos[0].valor;
               if(this.EstaFuncion(id)){
                  let tipo=this.tipoFuncion(id);
                  return tipo;
               }else{
                let error={tipo:"Error Semantico",valor:id,descripcion:"la funcion no existe",linea:Exp.hijos[1].linea,columna:21};
                this.listaSemanticos.push(error);
                return "string";
               }
             
             case "LExp":
                 return "arr";
               
             case "punto":
                 return "number";    
             default:
               console.log("no debio pasar por aqui Exp");
               return "null";

           }
   
       }else if(Exp.hijos.length==2){
             
            let tipo1=this.getExpTipo(Exp.hijos[1],ciclo,tb);
         if (Exp.hijos[0].nombre=="menos"){
           if(tipo1.toLowerCase()=="number".toLowerCase()){
                 
             return "number";
             
           }else{
                let error={tipo:"Error Semantico",valor:"-",descripcion:"No se puede Operar unario si no es number",linea:Exp.hijos[0].linea,columna:18};
                this.listaSemanticos.push(error); 
             return "number";
           }
             
         }else if(Exp.hijos[0].nombre=="neg"){
           if(tipo1.toLowerCase()=="boolean".toLowerCase()){
             return  "boolean";
             
           }else{
             
            let error={tipo:"Error Semantico",valor:"!",descripcion:"No se puede Operar negacion si no es boolean",linea:Exp.hijos[0].linea,columna:18};
                this.listaSemanticos.push(error); 
             return "boolean";
           }
           
         }
   
       }else if(Exp.hijos.length==1){
   
           if(Exp.hijos[0].nombre=="entero"){
   
             return "number";
   
           }else if(Exp.hijos[0].nombre=="decimal"){
             return "number";
           }else if(Exp.hijos[0].nombre=="Rfalse"){
   
             return "boolean";
           }else if(Exp.hijos[0].nombre=="Rtrue"){
             return "boolean";
           }else if(Exp.hijos[0].nombre=="cadena"){
             
             return "string";  
           }else if(Exp.hijos[0].nombre=="cadenaSimple"){
             return "string";
           }else if(Exp.hijos[0].nombre=="id"){
               
             let padre=null;
             padre=tb;
             let encontrado=false;
             let tipo="string";
             let id=Exp.hijos[0].valor;
             while(padre!=null){
               for(let item of padre.tabla){
   
                   if (item.nombre.toLowerCase()==id.toLowerCase()&&(item.rol=="let"||item.rol=="const")){
                       encontrado=true;
                       tipo=item.tipo;
                     //  this.txtImprimir+="encontro "+item.nombre+"\n";
                   }
               }
   
               if(encontrado){
                   break;
               }
               padre=padre.padre;
             }
             
             if(encontrado){
               return  tipo;
             }else{
              let error={tipo:"Error Semantico",valor:id,descripcion:"El id no se encontró",linea:Exp.hijos[0].linea,columna:18};
              this.listaSemanticos.push(error); 
               return "string";
             }
             
           }
       }
   
   }

}








