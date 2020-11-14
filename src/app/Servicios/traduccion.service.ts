import { Injectable } from '@angular/core';
import { graphviz } from "d3-graphviz";
import { wasmFolder } from "@hpcc-js/wasm";


@Injectable({
  providedIn: 'root'
})
export class TraduccionService {

  constructor() { }



  grafica:string="";
  txtGrafica:string="";
  txtresult:string="";
  
 
  public Graficar(ast){
    this.txtGrafica="digraph { \n";
    this.txtGrafica+="graph [ rankdir = \"UD\" \n bgcolor = \"balck:white\"];\n";
    this.Recorre(ast);
    this.txtGrafica+="}";
    this.Generar(this.txtGrafica);
  }




  Recorre(Nodo){
    if(Nodo.tipo=="noterminal"){        
        this.txtGrafica+=Nodo.nodo+"[fillcolor =\"green\", style=\"filled,setlinewidth(2)\",shape = doublecircle,color=red,fontsize=24,fontcolor=\"white\",label=\""+Nodo.nombre+" \"];\n";
        for(var item of Nodo.hijos){
          this.txtGrafica+=Nodo.nodo+"->"+item.nodo+"[color=\"red\",style=\"filled,setlinewidth(2)\"];\n";
        }
        for(var item of Nodo.hijos){
          this.Recorre(item);
        }        
    }else if(Nodo.tipo=="terminal"){
        if(Nodo.nombre=="llDer"||Nodo.nombre=="llIzq"||Nodo.nombre=="mayor"||Nodo.nombre=="menor"||Nodo.nombre=="mayorq"||Nodo.nombre=="menorq"){
          this.txtGrafica+=Nodo.nodo+"[fillcolor =\"green\", style=\"filled,setlinewidth(2)\",shape = doublecircle,color=blue,fontsize=24,fontcolor=\"white\",label=\""+Nodo.nombre+"\"];\n";
        }else{
          this.txtGrafica+=Nodo.nodo+"[fillcolor =\"green\", style=\"filled,setlinewidth(2)\",shape = doublecircle,color=blue,fontsize=24,fontcolor=\"white\",label=\""+Nodo.nombre+"\"];\n";
        }
          
       // console.log(Nodo.nombre+"->"+Nodo.valor);
    }else{
      console.log("No debio pasar por aca");
    }
}



Generar(entrada:string){
  wasmFolder('/assets/@hpcc-js/wasm/dist/');
 graphviz('app-arbol').renderDot(entrada);

}


pilaResult=[];
tbSimbolos=[];


getResult(raiz,pila):string{
  this.txtresult="";
  this.pilaResult=[];
  this.LenguajeTraducito(raiz,"",pila,"");
  for(let i=this.pilaResult.length-1;i>=0;i--){
      this.txtresult+=this.pilaResult[i];
  }
  //console.log(this.pilaResult);
  return this.txtresult;
}


PrimeraPasada(Ast){
this.tbSimbolos=[];
this.llenarTabla(Ast,"");
}

llenarTabla(Nodo,idFun){
    switch (Nodo.nombre) {
      case "ini":
        this.llenarTabla(Nodo.hijos[0],idFun);          
        break;
      case "instrucciones":
        if(Nodo.hijos.length==1){
          this.llenarTabla(Nodo.hijos[0],idFun);
          
        }else if(Nodo.hijos.length==2){
          this.llenarTabla(Nodo.hijos[0],idFun);
          this.llenarTabla(Nodo.hijos[1],idFun);
        }
        break;

      case "instruccion":
        if(Nodo.hijos[0].nombre=="Rfunction"){
            this.tbSimbolos.push({ambito:Nodo.hijos[1].valor,padres:idFun});

            if(Nodo.hijos.length==8){
                  if(idFun==""){
                    this.llenarTabla(Nodo.hijos[7],Nodo.hijos[1].valor);
                  }else{
                    this.llenarTabla(Nodo.hijos[7],idFun+","+Nodo.hijos[1].valor);  
                  }
                  
            }else if(Nodo.hijos.length==7){ 
              if(idFun==""){
                this.llenarTabla(Nodo.hijos[6],Nodo.hijos[1].valor);
              }else{
                this.llenarTabla(Nodo.hijos[6],idFun+","+Nodo.hijos[1].valor);  
              }
            }else if(Nodo.hijos.length==6){
              if(idFun==""){
                this.llenarTabla(Nodo.hijos[5],Nodo.hijos[1].valor);
              }else{
                this.llenarTabla(Nodo.hijos[5],idFun+","+Nodo.hijos[1].valor);  
              }
            }else if(Nodo.hijos.length==5){
              if(idFun==""){
                this.llenarTabla(Nodo.hijos[4],Nodo.hijos[1].valor);
              }else{
                this.llenarTabla(Nodo.hijos[4],idFun+","+Nodo.hijos[1].valor);  
              }
            }
        }
      
        break;

       case "BloqueIns":
            if(Nodo.hijos.length==3){
                this.llenarTabla(Nodo.hijos[1],idFun);
            }
         break;
      default:
        break;
    }

}






LenguajeTraducito(Nodo,idFun:string,stack,bloqFun){

  switch (Nodo.nombre) {
    case "ini":
                this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,"ini");
                break;
    case "instrucciones":
                if(Nodo.hijos.length==2){

                        if(bloqFun=="ini"){                                           
                          this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                          this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,"instrucciones");
                          this.pilaResult.push(stack[stack.length-1]);
                          stack.pop();
                         
                        }else{
                          //stack[stack.length-1]+="\t";
                          this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun); 
                                        
                          this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);

                        }
                

                      }else if(Nodo.hijos.length==1){
                       // stack[stack.length-1]+="\t";
                        this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                        
                }       
                break;
    case "instruccion":
                if(Nodo.hijos[0].nombre=="DecLet"){
                  this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);                     

                }else if(Nodo.hijos[0].nombre=="DecConst"){
                  this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);   

                }else if(Nodo.hijos[0].nombre=="id"){
                      if(Nodo.hijos.length==4){
                            if(Nodo.hijos[1].nombre=="pIzq"){
                              let id=Nodo.hijos[0].valor;
                              for(let item of this.tbSimbolos){
                                    if(item.ambito==id){
                                     if(item.padres!=""){
                                        if(item.padres.includes(",")){
                                            
                                          let lista=item.padres.split(",");
                                          for(let i=lista.length-1;i>=0;i--){
                                              id+="_"+lista[i];
                                          }
                                        }else{
                                          id+="_"+item.padres;
                                        }
                                     }   
                                    }
  
                              }
                              stack[stack.length-1]+=id+Nodo.hijos[1].valor;
                              stack[stack.length-1]+=Nodo.hijos[2].valor+Nodo.hijos[3].valor+"\n";

                            }else if(Nodo.hijos[1].nombre=="igual"){
                              stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor;
                              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
                              stack[stack.length-1]+=Nodo.hijos[3].valor+"\n"; 

                            }

                      }else if(Nodo.hijos.length==5){
                          let id=Nodo.hijos[0].valor;
                          for(let item of this.tbSimbolos){
                                if(item.ambito==id){
                                if(item.padres!=""){
                                    if(item.padres.includes(",")){
                                        
                                      let lista=item.padres.split(",");
                                      for(let i=lista.length-1;i>=0;i--){
                                          id+="_"+lista[i];
                                      }
                                    }else{
                                      id+="_"+item.padres;
                                    }
                                }   
                                }

                          }
                          stack[stack.length-1]+=id+Nodo.hijos[1].valor;
                          this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
                          stack[stack.length-1]+=Nodo.hijos[3].valor+Nodo.hijos[4].valor+"\n";
                      }else if(Nodo.hijos.length==6){
                        stack[stack.length-1]+=Nodo.hijos[0].valor;
                        stack[stack.length-1]+=Nodo.hijos[1].valor;
                        stack[stack.length-1]+=Nodo.hijos[2].valor;
                        stack[stack.length-1]+=Nodo.hijos[3].valor;
                        stack[stack.length-1]+=Nodo.hijos[4].valor;
                        stack[stack.length-1]+=Nodo.hijos[5].valor+"\n";
                      }
                      else if(Nodo.hijos.length==7){
                        if(Nodo.hijos[1].nombre=="cIzq"){
                          stack[stack.length-1]+=Nodo.hijos[0].valor;
                          stack[stack.length-1]+=Nodo.hijos[1].valor;
                          this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
                          stack[stack.length-1]+=Nodo.hijos[3].valor;
                          stack[stack.length-1]+=Nodo.hijos[4].valor;
                          this.LenguajeTraducito(Nodo.hijos[5],idFun,stack,bloqFun);
                          stack[stack.length-1]+=Nodo.hijos[6].valor+"\n";
                        }else if(Nodo.hijos[1].nombre=="punto"){
                          stack[stack.length-1]+=Nodo.hijos[0].valor;
                          stack[stack.length-1]+=Nodo.hijos[1].valor;
                          stack[stack.length-1]+=Nodo.hijos[2].valor;
                          stack[stack.length-1]+=Nodo.hijos[3].valor;
                          this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
                          stack[stack.length-1]+=Nodo.hijos[5].valor;
                          stack[stack.length-1]+=Nodo.hijos[6].valor+"\n"; 

                        }
                         
                      }

                }else if(Nodo.hijos[0].nombre=="Rfunction"){    
                          stack.push("");
                      if(Nodo.hijos.length==8){
                           let id_fun="";    
                          if(bloqFun=="funcion"){
                            id_fun=Nodo.hijos[1].valor+"_"+idFun;
                            stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+"_"+idFun;
                          }else{
                            id_fun=Nodo.hijos[1].valor
                            stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor;
                          }
                          
                          stack[stack.length-1]+=Nodo.hijos[2].valor;
                          this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
                          stack[stack.length-1]+=Nodo.hijos[4].valor+Nodo.hijos[5].valor;
                         
                          this.LenguajeTraducito(Nodo.hijos[6],idFun,stack,bloqFun);
                          this.LenguajeTraducito(Nodo.hijos[7],id_fun,stack,"funcion");     
                          stack[stack.length-1]+="\n";

                      }else if(Nodo.hijos.length==7){
                        let id_fun="";
                        if(bloqFun=="funcion"){
                          id_fun=Nodo.hijos[1].valor+"_"+idFun;
                          stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+"_"+idFun;
                        }else{
                          id_fun=Nodo.hijos[1].valor;
                          stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor;
                        }
                          stack[stack.length-1]+=Nodo.hijos[2].valor+Nodo.hijos[3].valor;
                          stack[stack.length-1]+=Nodo.hijos[4].valor;
                          
                          this.LenguajeTraducito(Nodo.hijos[5],idFun,stack,bloqFun);
                          this.LenguajeTraducito(Nodo.hijos[6],id_fun,stack,"funcion");     
                          stack[stack.length-1]+="\n";

                      }else if(Nodo.hijos.length==6){
                        let id_fun="";
                        if(bloqFun=="funcion"){
                          id_fun=Nodo.hijos[1].valor+"_"+idFun;

                          stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+"_"+idFun;
                        }else{
                          id_fun=Nodo.hijos[1].valor;
                          stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor;
                        }
                          stack[stack.length-1]+=Nodo.hijos[2].valor;
                          this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
                          stack[stack.length-1]+=Nodo.hijos[4].valor;
                          
                          this.LenguajeTraducito(Nodo.hijos[5],id_fun,stack,"funcion");     
                          stack[stack.length-1]+="\n";                        

                      }else if(Nodo.hijos.length==5){
                        let id_fun="";
                        if(bloqFun=="funcion"){
                            id_fun=Nodo.hijos[1].valor+"_"+idFun;
                          stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+"_"+idFun;
                        }else{
                           id_fun=Nodo.hijos[1].valor;
                          stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor;
                        }
                          stack[stack.length-1]+=Nodo.hijos[2].valor+Nodo.hijos[3].valor;
                          
                          this.LenguajeTraducito(Nodo.hijos[4],id_fun,stack,"funcion");     
                          stack[stack.length-1]+="\n";     

                      }
                
                }else if(Nodo.hijos[0].nombre=="Rreturn"){
                      if(Nodo.hijos.length==3){
                          stack[stack.length-1]+=Nodo.hijos[0].valor+" ";
                          this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);     
                          stack[stack.length-1]+=Nodo.hijos[2].valor;
                          stack[stack.length-1]+="\n";                              

                      }else if(Nodo.hijos.length==2){
                        stack[stack.length-1]+=Nodo.hijos[0].valor;     
                        stack[stack.length-1]+=Nodo.hijos[1].valor+"\n";

                      }

                }else if(Nodo.hijos[0].nombre=="Rbreak"){

                  stack[stack.length-1]+=Nodo.hijos[0].valor;     
                  stack[stack.length-1]+=Nodo.hijos[1].valor+"\n";

                }else if(Nodo.hijos[0].nombre=="Rcontinue"){ 

                  stack[stack.length-1]+=Nodo.hijos[0].valor;     
                  stack[stack.length-1]+=Nodo.hijos[1].valor+"\n";  

                }else if(Nodo.hijos[0].nombre=="Rif"){
                      
                      if(Nodo.hijos.length==5){
                          stack[stack.length-1]+=Nodo.hijos[0].valor+" ";
                          this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);     
                          this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,"ciclo");
                          this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
                          this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
                          stack[stack.length-1]+="\n";

                      }else if(Nodo.hijos.length==4){

                          stack[stack.length-1]+=Nodo.hijos[0].valor+" ";
                          this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);     
                          this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,"ciclo");
                          this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
                          stack[stack.length-1]+="\n";

                      }else if(Nodo.hijos.length==3){
                          stack[stack.length-1]+=Nodo.hijos[0].valor+" ";
                          this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);     
                          this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,"ciclo");
                          stack[stack.length-1]+="\n";
                      }


                }else if(Nodo.hijos[0].nombre=="Rswitch"){
                    stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor;
                    this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[3].valor+Nodo.hijos[4].valor+"\n";
                    this.LenguajeTraducito(Nodo.hijos[5],idFun,stack,bloqFun);
                    this.LenguajeTraducito(Nodo.hijos[6],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[7].valor+"\n";
                
                  }else if(Nodo.hijos[0].nombre=="Rwhile"){
                    stack[stack.length-1]+=Nodo.hijos[0].valor;
                    this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
                    this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,"ciclo");

                  }else if(Nodo.hijos[0].nombre=="Rdo"){
                    stack[stack.length-1]+=Nodo.hijos[0].valor+" ";
                    this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,"ciclo");
                    stack[stack.length-1]+=Nodo.hijos[2].valor;
                    this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[4].valor+"\n";
                  
                  
                  }else if(Nodo.hijos[0].nombre=="Rfor"){

                          if(Nodo.hijos.length==9){

                              stack[stack.length-1]+=Nodo.hijos[0].valor;
                              stack[stack.length-1]+=Nodo.hijos[1].valor;
                              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
                              stack[stack.length-1]+=Nodo.hijos[3].valor;
                              this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
                              stack[stack.length-1]+=Nodo.hijos[5].valor;
                              this.LenguajeTraducito(Nodo.hijos[6],idFun,stack,bloqFun);
                              stack[stack.length-1]+=Nodo.hijos[7].valor;
                              this.LenguajeTraducito(Nodo.hijos[8],idFun,stack,"ciclo");

                          }else if(Nodo.hijos.length==8){

                            stack[stack.length-1]+=Nodo.hijos[0].valor;
                            stack[stack.length-1]+=Nodo.hijos[1].valor;
                            stack[stack.length-1]+=Nodo.hijos[2].valor+" "+Nodo.hijos[3].valor+" ";
                            stack[stack.length-1]+=Nodo.hijos[4].valor+" "+Nodo.hijos[5].valor;
                            stack[stack.length-1]+=Nodo.hijos[6].valor;
                            this.LenguajeTraducito(Nodo.hijos[7],idFun,stack,"ciclo");

                          }



                  }else if(Nodo.hijos[0].nombre=="Rconsole"){

                        stack[stack.length-1]+=Nodo.hijos[0].valor;
                        stack[stack.length-1]+=Nodo.hijos[1].valor;
                        stack[stack.length-1]+=Nodo.hijos[2].valor+Nodo.hijos[3].valor;
                        this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
                        stack[stack.length-1]+=Nodo.hijos[5].valor+Nodo.hijos[6].valor+"\n";

                  }
                  else if(Nodo.hijos[0].nombre=="Aumento"){  
                    this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[1].valor+"\n";
                  }else if(Nodo.hijos[0].nombre=="Decremento"){
                    this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[1].valor+"\n";
                  }else if(Nodo.hijos[0].nombre=="SumaIgual"){
                    this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[1].valor+"\n";
                  }else if(Nodo.hijos[0].nombre=="RestaIgual"){
                    this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[1].valor+"\n";
                  }else if(Nodo.hijos[0].nombre=="Rgraficar"){
                    stack[stack.length-1]+=Nodo.hijos[0].valor;
                    stack[stack.length-1]+=Nodo.hijos[1].valor;
                    stack[stack.length-1]+=Nodo.hijos[2].valor;
                    stack[stack.length-1]+=Nodo.hijos[3].valor+"\n";
                  }      

                break;
    
    case "BloqueIns":
                  
          if(Nodo.hijos.length==3){

                stack[stack.length-1]+=Nodo.hijos[0].valor+"\n";
                this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
                stack[stack.length-1]+=Nodo.hijos[2].valor+"\n";
                
                if(bloqFun=="funcion"){
                  //this.txtresult+=stack[stack.length-1];
                  this.pilaResult.push(stack[stack.length-1]);
                  stack.pop();
                }

          }else if(Nodo.hijos.length==2){
                stack[stack.length-1]+=Nodo.hijos[0].valor;
                stack[stack.length-1]+=Nodo.hijos[1].valor+"\n";
                if(bloqFun=="funcion"){
                  //this.txtresult+=stack[stack.length-1];
                  this.pilaResult.push(stack.length-1);
                  stack.pop();
                }

          }          
        break;
    
    case "Asigna":
            stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+Nodo.hijos[2].valor;
            this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
            stack[stack.length-1]+=Nodo.hijos[4].valor;
            this.LenguajeTraducito(Nodo.hijos[5],idFun,stack,bloqFun);
            //stack[stack.length-1]+="\n";
                  
      break;
      
    case "AsignaFor":

            if(Nodo.hijos.length==6){
                  stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+Nodo.hijos[2].valor;
                  this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
                  stack[stack.length-1]+=Nodo.hijos[4].valor;
                  this.LenguajeTraducito(Nodo.hijos[5],idFun,stack,bloqFun);
                  


            }else if(Nodo.hijos.length==4){
                  stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+Nodo.hijos[2].valor;
                  this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
                  

            }else if(Nodo.hijos.length==3){
                  stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor;
                  this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);

            }
        break; 
      
    case "NelseIf":
            if(Nodo.hijos.length==5){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[1].valor+" "+Nodo.hijos[2].valor;
              this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
              this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,"ciclo");

            }else if(Nodo.hijos.length==4){
              stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor;
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
              this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,"ciclo");

            }
      break;

    case "Condicion":
            stack[stack.length-1]+=Nodo.hijos[0].valor;
            this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
            stack[stack.length-1]+=Nodo.hijos[2].valor;
      break;  
    
    case "Nelse":
          stack[stack.length-1]+=Nodo.hijos[0].valor;
          this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,"ciclo");
      break; 
    
    case "Ncase":
            if(Nodo.hijos.length==5){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[1].valor+" ";
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[3].valor+"\n";
              this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,"ciclo");

            }else if(Nodo.hijos.length==4){
              stack[stack.length-1]+=Nodo.hijos[0].valor+" ";
              this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[2].valor+"\n";
              this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,"ciclo");
            }
      break;

    case "Ndefault":
            if(Nodo.hijos.length==3){

              stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor+"\n";
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,"ciclo");

            }
      break;

    
    case "Aumento":

          stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+Nodo.hijos[2].valor;

      break; 
            
    case "Decremento":
            stack[stack.length-1]+=Nodo.hijos[0].valor+" "+Nodo.hijos[1].valor+Nodo.hijos[2].valor;
        break;

    case "SumaIgual":
            stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor+Nodo.hijos[2].valor;
            this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
      break;
      
    case "RestaIgual":
          stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor+Nodo.hijos[2].valor;
          this.LenguajeTraducito(Nodo.hijos[3],idFun,stack,bloqFun);
      break;

    case "insfor":
            if(Nodo.hijos.length==3){
                  stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor;
                  this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
            }else if(Nodo.hijos.length==1){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
            }
      break;

    case "Param":
            
            if(Nodo.hijos.length==5){
                    this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[1].valor+Nodo.hijos[2].valor+Nodo.hijos[3].valor;
                    this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
            }else if(Nodo.hijos.length==3){
                    stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor;
                    this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
            }
      break;
    
    case "DecLet":
        stack[stack.length-1]+=Nodo.hijos[0].valor+" ";
        this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
        stack[stack.length-1]+=Nodo.hijos[2].valor+"\n";  
      break;  
    
    case "Lasig":
            if(Nodo.hijos.length==3){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[1].valor;
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);

            }else if(Nodo.hijos.length==1){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
            }
      break; 
      
    case "IA":
            if(Nodo.hijos.length==5){
              stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor;
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[3].valor;
              this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
            }else if(Nodo.hijos.length==3){
              stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor;
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
            }

      break; 
      case "DecConst":
        stack[stack.length-1]+=Nodo.hijos[0].valor+" ";
        this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
        stack[stack.length-1]+=Nodo.hijos[2].valor+"\n";
        break; 
    
      case "Lconst":
            if(Nodo.hijos.length==3){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[1].valor;
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
            }else if(Nodo.hijos.length==1){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
            }
        break;
        
      case "CA":
        if(Nodo.hijos.length==5){
          stack[stack.length-1]+=Nodo.hijos[0].valor+Nodo.hijos[1].valor;
          this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
          stack[stack.length-1]+=Nodo.hijos[3].valor;
          this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
        }

        break;  

    case "Ntipo":
          if(Nodo.hijos.length==1){
            stack[stack.length-1]+=Nodo.hijos[0].valor;
          }else if(Nodo.hijos.length==3){
            stack[stack.length-1]+=Nodo.hijos[0].valor;
            stack[stack.length-1]+=Nodo.hijos[1].valor;
            stack[stack.length-1]+=Nodo.hijos[2].valor;
          }
            
      break;
    
    case "LExp":
            if(Nodo.hijos.length==3){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[1].valor;
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);

            }else if(Nodo.hijos.length==1){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun); 
            }
      break;
      case "LLExp":
        if(Nodo.hijos.length==3){
          this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
          stack[stack.length-1]+=Nodo.hijos[1].valor;
          this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);

        }else if(Nodo.hijos.length==1){
          this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun); 
        }
      break;
      
    
    case "Exp":
            if(Nodo.hijos.length==1){
                  if(Nodo.hijos[0].nombre=="Objeto"){
                    this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                  }else{
                    if(Nodo.hijos[0].nombre=="cadena"){
                      stack[stack.length-1]+="\""+Nodo.hijos[0].valor+"\"";
                    }else if(Nodo.hijos[0].nombre=="cadenaSimple"){
                      stack[stack.length-1]+="\'"+Nodo.hijos[0].valor+"\'";  
                    }else{

                      stack[stack.length-1]+=Nodo.hijos[0].valor;
                    }
                    
                  }

            }else if(Nodo.hijos.length==2){
                stack[stack.length-1]+=Nodo.hijos[0].valor;
                this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);

            }else if(Nodo.hijos.length==3){              
              if(Nodo.hijos[0].nombre=="Exp"&&Nodo.hijos[2].nombre=="Exp"){

                this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                stack[stack.length-1]+=Nodo.hijos[1].valor;
                this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);  
              }else if(Nodo.hijos[0].nombre=="Exp"&&Nodo.hijos[2].nombre=="Rlength"){
                
                this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                stack[stack.length-1]+=Nodo.hijos[1].valor;
                stack[stack.length-1]+=Nodo.hijos[2].valor;
              }else if(Nodo.hijos[0].nombre=="id"){
                  if(Nodo.hijos[1].nombre=="pIzq"){

                        let id=Nodo.hijos[0].valor;
                              for(let item of this.tbSimbolos){
                                    if(item.ambito==id){
                                     if(item.padres!=""){
                                        if(item.padres.includes(",")){
                                            
                                          let lista=item.padres.split(",");
                                          for(let i=lista.length-1;i>=0;i--){
                                              id+="_"+lista[i];
                                          }
                                        }else{
                                          id+="_"+item.padres;
                                        }
                                     }   
                                    }
  
                              }  

                          stack[stack.length-1]+=id+Nodo.hijos[1].valor;
                          stack[stack.length-1]+=Nodo.hijos[2].valor;
                }else if(Nodo.hijos[1].nombre=="punto"){
                  stack[stack.length-1]+=Nodo.hijos[0].valor;
                  stack[stack.length-1]+=Nodo.hijos[1].valor;
                  stack[stack.length-1]+=Nodo.hijos[2].valor;
                }             
              }else if(Nodo.hijos[0].nombre=="Objeto"){ 
                  this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                  stack[stack.length-1]+=Nodo.hijos[1].valor;
                  stack[stack.length-1]+=Nodo.hijos[2].valor;
              }else if(Nodo.hijos[0].nombre=="llIzq"){
                  stack[stack.length-1]+=Nodo.hijos[0].valor;
                  this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
                  stack[stack.length-1]+=Nodo.hijos[2].valor;

              }else if(Nodo.hijos[0].nombre=="pIzq"){
                  stack[stack.length-1]+=Nodo.hijos[0].valor;
                  this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
                  stack[stack.length-1]+=Nodo.hijos[2].valor;
              }else if(Nodo.hijos[0].nombre=="cIzq"){
                stack[stack.length-1]+=Nodo.hijos[0].valor;
                this.LenguajeTraducito(Nodo.hijos[1],idFun,stack,bloqFun);
                stack[stack.length-1]+=Nodo.hijos[2].valor;
              }

            }else if(Nodo.hijos.length==4){
              if(Nodo.hijos[1].nombre=="pIzq"){
                let id=Nodo.hijos[0].valor;
                for(let item of this.tbSimbolos){
                      if(item.ambito==id){
                      if(item.padres!=""){
                          if(item.padres.includes(",")){
                              
                            let lista=item.padres.split(",");
                            for(let i=lista.length-1;i>=0;i--){
                                id+="_"+lista[i];
                            }
                          }else{
                            id+="_"+item.padres;
                          }
                      }   
                      }
  
                }
                    stack[stack.length-1]+=id+Nodo.hijos[1].valor;
                    this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
                    stack[stack.length-1]+=Nodo.hijos[3].valor;
              }else if(Nodo.hijos[1].nombre=="cIzq"){
                stack[stack.length-1]+=Nodo.hijos[0].valor;
                stack[stack.length-1]+=Nodo.hijos[1].valor;
                this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
                stack[stack.length-1]+=Nodo.hijos[3].valor;
              }
              

            }else if(Nodo.hijos.length==5){
                    if(Nodo.hijos[0].nombre=="Exp"&&Nodo.hijos[2].nombre=="Exp"){
                      this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                      stack[stack.length-1]+=Nodo.hijos[1].valor;
                      this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
                      stack[stack.length-1]+=Nodo.hijos[3].valor;
                      this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
                    }else{
                      this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                      stack[stack.length-1]+=Nodo.hijos[1].valor;
                      stack[stack.length-1]+=Nodo.hijos[2].valor;
                      stack[stack.length-1]+=Nodo.hijos[3].valor;
                      stack[stack.length-1]+=Nodo.hijos[4].valor;
                    }

            }else if(Nodo.hijos.length==6){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[1].valor;
              stack[stack.length-1]+=Nodo.hijos[2].valor;
              stack[stack.length-1]+=Nodo.hijos[3].valor;
              this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[5].valor;
            }    
      break;
    
    case "Par":
            if(Nodo.hijos.length==5){
                  this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
                  stack[stack.length-1]+=Nodo.hijos[1].valor;
                  stack[stack.length-1]+=Nodo.hijos[2].valor;
                  stack[stack.length-1]+=Nodo.hijos[3].valor;
                  this.LenguajeTraducito(Nodo.hijos[4],idFun,stack,bloqFun);
            
            }else if(Nodo.hijos.length==3){
                  stack[stack.length-1]+=Nodo.hijos[0].valor;
                  stack[stack.length-1]+=Nodo.hijos[1].valor;
                  this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
            
            }
      break;
      
    case "Lparam":
            if(Nodo.hijos.length==3){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
              stack[stack.length-1]+=Nodo.hijos[1].valor;
              this.LenguajeTraducito(Nodo.hijos[2],idFun,stack,bloqFun);
            }else if(Nodo.hijos.length==1){
              this.LenguajeTraducito(Nodo.hijos[0],idFun,stack,bloqFun);
            }
      break;


    default:
            console.log("no debió pasar por aqui this.LenguajeTraducido()");
        break;
  }


}


  }
