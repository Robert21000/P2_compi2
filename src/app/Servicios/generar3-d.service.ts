import { Injectable, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, NgModuleFactoryLoader } from '@angular/core';
import { _ParseAST, TemplateBindingParseResult } from '@angular/compiler';
import { VirtualTimeScheduler } from 'rxjs';
import { TemplateDefinitionBuilder } from '@angular/compiler/src/render3/view/template';

@Injectable({
  providedIn: 'root'
})
export class Generar3DService {

  constructor() { }

  generado:string;
  encabezado:string;
  contador:number=-1;
  contador2:number=-1;



  tabla=[];
  tbGlobal={tabla:this.tabla,padre:null,tamanio:0,actual:0};
  generar3D(Nodo):string{
    this.contador=-1;
    this.contador2=-1;
    this.generado="";

    let ptr=0;
    this.RecogerFunciones(Nodo);
    this.Recorre(Nodo,this.tbGlobal,ptr,"","");
    this.encabezado="#include <stdio.h>\n";
    this.encabezado+="#include <math.h>\n";
    this.encabezado+="double ";
    for(let i=0;i<=this.contador;i++){
      if(i==this.contador){
        this.encabezado+="t"+i+";\n";
      }else{
        this.encabezado+="t"+i+",";
      } 
    }

    this.encabezado+="double heap[16384];\n";
    this.encabezado+="double stack[16394];\n";
    this.encabezado+="double h;\n";
    this.encabezado+="double ptr;\n";
    this.encabezado+="int main(){\nh=0;\nptr=0;\n";
    this.encabezado+=this.generado+"\n";
    this.encabezado+="return 0;\n}"
    return this.encabezado;
  }


  Recorre(Nodo,tbs,ptr,lt,lf){
        switch(Nodo.nombre){
            case "ini":
            
              this.TamanioAmbito(Nodo.hijos[0],tbs);
              //tbs.tamanio=tamanio;
              this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
              this.generado+=Nodo.hijos[0].clase.codigo;
              
              break;
            case "instrucciones":
                if(Nodo.hijos.length==1){
                  let codigo="";
                  if(Nodo.hijos[0].hijos[0].nombre!="Rfunction"){
                    Nodo.hijos[0].clase.Lfalse=Nodo.clase.Lfalse;
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    codigo+=Nodo.hijos[0].clase.codigo;
                  }
                    
                  Nodo.clase.codigo=codigo;
                }else if(Nodo.hijos.length==2){
                   let codigo1="";
                   let codigo2=""; 
                  if(Nodo.hijos[0].hijos[0].nombre!="Rfunction"){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    codigo1+=Nodo.hijos[0].clase.codigo;
                  }
                    this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                    codigo2+=Nodo.hijos[1].clase.codigo;
                    Nodo.clase.codigo=codigo1+codigo2;
                }
              break;
            case "instruccion":

              if(Nodo.hijos[0].nombre=="Rconsole"){
                  this.Recorre(Nodo.hijos[4],tbs,ptr,lt,lf);
                  if(Nodo.hijos[4].clase.tipo=="number"){
                    let codigo="";
                    codigo+=Nodo.hijos[4].clase.codigo;
                    codigo+="printf(\"%lf\", (double)"+Nodo.hijos[4].clase.direccion+");\n";
                    codigo+="printf(\"\\n\");\n";
                    Nodo.clase.codigo=codigo;
                  }else if(Nodo.hijos[4].clase.tipo=="string"){

                    let codigo="";
                    let temp1=this.nuevoTemp();
                    codigo+=temp1+"="+Nodo.hijos[4].clase.direccion+";\n"
                    let l1=this.nuevaLabel();
                    codigo+=l1+":\n";
                    let temp2=this.nuevoTemp();
                    codigo+=temp2+"=heap[(int)"+temp1+"];\n"
                    codigo+="printf(\"%c\",(int)"+temp2+");\n";
                    codigo+=temp1+"="+temp1+"+1;\n";
                    codigo+="if(heap[(int)"+temp1+"]!=-1) goto "+l1+";\n";
                    codigo+="printf(\"\\n\");\n";
                    Nodo.clase.codigo=Nodo.hijos[4].clase.codigo+codigo;

                  }else if(Nodo.hijos[4].clase.tipo=="boolean"){
                    
                    let codigo="";
                    let direccion4=Nodo.hijos[4].clase.direccion;
                    let codigo4=Nodo.hijos[4].clase.codigo;
                    let temp1=this.nuevoTemp();
                    
                    let L0=this.nuevaLabel();
                    let L1=this.nuevaLabel();
                    let L2=this.nuevaLabel();
                    codigo+="if("+direccion4+"==1) goto "+L0+";\n";
                    codigo+="goto "+L1+";\n";
                    codigo+=L0+":\n"+this.getCodigoCadena(temp1,"true")+" goto "+L2+";\n";
                    codigo+=L1+":\n"+this.getCodigoCadena(temp1,"false")+" goto "+L2+";\n"
                    
                    codigo+=L2+":\n";
                    let l3=this.nuevaLabel();
                    codigo+=l3+":\n";
                    codigo+="printf(\"%c\",(int)heap[(int)"+temp1+"]);\n";
                    codigo+=temp1+"="+temp1+"+1;\n";
                    codigo+="if(heap[(int)"+temp1+"]!=-1) goto "+l3+";\n";
                    codigo+="printf(\"\\n\");\n";
                    Nodo.clase.codigo=codigo4+codigo;

                  }
                  
              }else if(Nodo.hijos[0].nombre=="DecLet"){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    Nodo.clase.codigo=Nodo.hijos[0].clase.codigo;
              }else if(Nodo.hijos[0].nombre=="DecConst"){
                this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                Nodo.clase.codigo=Nodo.hijos[0].clase.codigo;
              }else if(Nodo.hijos[0].nombre=="id"){
                  if(Nodo.hijos.length==4){
                      if(Nodo.hijos[1].nombre=="igual"){
                          this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                          if(Nodo.hijos[2].clase.tipo=="boolean"){
                              let L0=this.nuevoTemp();
                              let L1=this.nuevoTemp();
                              Nodo.hijos[2].clase.Ltrue=L0;
                              Nodo.hijos[2].clase.Lfalse=L1;
                              this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                              let codigo2="";
                              let tmpBool=this.nuevoTemp();
                              codigo2+=tmpBool+"=0;\n";
                              codigo2+=Nodo.hijos[2].clase.codigo+L0+":\n";
                              codigo2+=tmpBool+"=1;\n";
                              let id=Nodo.hijos[0].valor.toLowerCase();
                              codigo2+="stack[(int)"+this.getDireccionId(id,tbs,ptr)+"]="+tmpBool+";\n";
                              Nodo.clase.codigo=codigo2;
                          }else{
                              
                              let codigo1=Nodo.hijos[2].clase.codigo;
                              let direccion1=Nodo.hijos[2].clase.direccion;
                              let codigo="";
                              let id=Nodo.hijos[0].valor.toLowerCase();
                              codigo+="stack[(int)"+this.getDireccionId(id,tbs,ptr)+"]="+direccion1+";\n";
                              Nodo.clase.codigo=codigo1+codigo;

                          }
                          
                      }else if(Nodo.hijos[1].nombre=="pIzq"){
                          let id=Nodo.hijos[0].valor.toLowerCase();
                          
                          this.Recorre(this.getNodofuncion(id),tbs,ptr,lt,lf);
                          Nodo.clase.codigo=this.getNodofuncion(id).clase.codigo;
                          
                      }
                  }else if(Nodo.hijos.length==5){
                    let id=Nodo.hijos[0].valor.toLowerCase();
                    this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                    console.log(Nodo.hijos[2].valores);
                    console.log(Nodo.hijos[2].clase.codigo);

                    this.getNodofuncion(id).clase.valores=Nodo.hijos[2].valores;
                    this.getNodofuncion(id).clase.codigo=Nodo.hijos[2].clase.codigo;
                    this.Recorre(this.getNodofuncion(id),tbs,ptr,lt,lf);
                    Nodo.clase.codigo=this.getNodofuncion(id).clase.codigo;
                    

                  }

              }else if(Nodo.hijos[0].nombre=="Rfunction"){
                    if(Nodo.hijos.length==7){
                        this.Recorre(Nodo.hijos[5],tbs,ptr,lt,lf);
                        let tipo=Nodo.hijos[5].valor;
                      if(tipo.toLowerCase()=="void"){
                        let tini=this.nuevaLabel();
                        let final=this.nuevaLabel();
                        let codigo="";
                        let id=Nodo.hijos[1].valor;
   
                         //***************** */
                         ptr=ptr+tbs.tamanio;
                         let tabla=[];
                         let tbsLocal={tabla:tabla,padre:this.tbGlobal,tamanio:0,actual:0}
                         let codigo4="ptr=ptr+"+tbs.tamanio+";\n";
                         this.TamanioAmbito(Nodo.hijos[6],tbsLocal);
                         /** */
                        this.Recorre(Nodo.hijos[6],tbsLocal,ptr,lt,final);
                         /** */
                         let codigo5="ptr=ptr-"+tbs.tamanio+";\n";
                         ptr=ptr-tbs.tamanio;
                         /** */
                        let codigo1=Nodo.hijos[6].clase.codigo;
                        codigo+="\n\n"+tini+"_"+id+":\n"+codigo4+codigo1+codigo5+final+":\n\n";
                        Nodo.clase.codigo=codigo;
                      }else{
                        let tini=this.nuevaLabel();
                        let final=this.nuevaLabel();
                        let codigo="";
                        let id=Nodo.hijos[1].valor;
   
                         //***************** */
                         ptr=ptr+tbs.tamanio;
                         let tabla=[];
                         let tbsLocal={tabla:tabla,padre:this.tbGlobal,tamanio:0,actual:0}
                         let codigo4="ptr=ptr+"+tbs.tamanio+";\n";
                         this.TamanioAmbito(Nodo.hijos[6],tbsLocal);
                         /** */
                        this.Recorre(Nodo.hijos[6],tbsLocal,ptr,lt,final);
                         /** */
                         let codigo5="ptr=ptr-"+tbs.tamanio+";\n";
                         ptr=ptr-tbs.tamanio;
                         /** */
                        let codigo1=Nodo.hijos[6].clase.codigo;
                        let temp1=this.nuevoTemp();
                        let temp2=this.nuevoTemp();
                       // console.log(tbsLocal.tamanio);
                        codigo1+=temp1+"=ptr+"+(tbsLocal.tamanio-1)+";\n";  
                        codigo1+=temp2+"=stack[(int)"+temp1+"];\n";
                        codigo+="\n\n"+tini+"_"+id+":\n"+codigo4+codigo1+codigo5+final+":\n\n";
                        Nodo.clase.codigo=codigo;
                        Nodo.clase.direccion=temp2;

                      }
                     
                    }else if(Nodo.hijos.length==8){
                      this.Recorre(Nodo.hijos[6],tbs,ptr,lt,lf);
                      let tipo=Nodo.hijos[6].valor;
                          if(tipo.toLowerCase()=="void"){
                            let tini=this.nuevaLabel();
                            let final=this.nuevaLabel();
                            let codigo="";
                            let codigoExp=Nodo.clase.codigo;
                            let id=Nodo.hijos[1].valor;
      
                            //***************** */
                            codigo+="\n\n"+tini+"_"+id+":\n";
                            ptr=ptr+tbs.tamanio;
                            let tabla=[];
                            let tbsLocal={tabla:tabla,padre:this.tbGlobal,tamanio:0,actual:0}
                            let codigo4="ptr=ptr+"+tbs.tamanio+";\n";
                            this.Recorre(Nodo.hijos[3],tbsLocal,ptr,lt,lf);
                            let codParam=Nodo.hijos[3].clase.codigo;
                            codigo+=codigo4+codParam+codigoExp;
                            console.log(Nodo.clase.valores);
                            for(let i=0;i<Nodo.clase.valores.length;i++){
                                let t1= this.nuevoTemp();
                                codigo+=t1+"=ptr+"+i+";\n";
                                codigo+="stack[(int)"+t1+"]="+Nodo.clase.valores[i]+";\n";
                            }

                            this.TamanioAmbito(Nodo.hijos[7],tbsLocal);
                            tbsLocal.tamanio+=this.NumParametros(Nodo.hijos[3]);
                            /** */
                            this.Recorre(Nodo.hijos[7],tbsLocal,ptr,lt,final);
                            /** */
                            let codigo5="ptr=ptr-"+tbs.tamanio+";\n";
                            ptr=ptr-tbs.tamanio;
                            /** */
                            let codigo1=Nodo.hijos[7].clase.codigo;
                            codigo+=codigo1+codigo5+final+":\n\n";
                            Nodo.clase.codigo=codigo;

                          }else{

                            let tini=this.nuevaLabel();
                            let final=this.nuevaLabel();
                            let codigo="";
                            let codigoExp=Nodo.clase.codigo;
                            let id=Nodo.hijos[1].valor;
      
                            //***************** */
                            codigo+="\n\n"+tini+"_"+id+":\n";
                            ptr=ptr+tbs.tamanio;
                            let tabla=[];
                            let tbsLocal={tabla:tabla,padre:this.tbGlobal,tamanio:0,actual:0}
                            let codigo4="ptr=ptr+"+tbs.tamanio+";\n";
                            this.Recorre(Nodo.hijos[3],tbsLocal,ptr,lt,lf);
                            let codParam=Nodo.hijos[3].clase.codigo;
                            codigo+=codigo4+codParam+codigoExp;
                            console.log(Nodo.clase.valores);
                            for(let i=0;i<Nodo.clase.valores.length;i++){
                                let t1= this.nuevoTemp();
                                codigo+=t1+"=ptr+"+i+";\n";
                                codigo+="stack[(int)"+t1+"]="+Nodo.clase.valores[i]+";\n";
                            }

                            this.TamanioAmbito(Nodo.hijos[7],tbsLocal);
                            tbsLocal.tamanio+=this.NumParametros(Nodo.hijos[3]);
                            /** */
                            this.Recorre(Nodo.hijos[7],tbsLocal,ptr,lt,final);
                            /** */
                            let codigo5="ptr=ptr-"+tbs.tamanio+";\n";
                            ptr=ptr-tbs.tamanio;
                            /** */
                            let codigo1=Nodo.hijos[7].clase.codigo;
                            let temp1=this.nuevoTemp();
                            
                            let temp2=this.nuevoTemp();
                       // console.log(tbsLocal.tamanio);
                            codigo1+=temp1+"=ptr+"+(tbsLocal.tamanio-1)+";\n";  
                            codigo1+=temp2+"=stack[(int)"+temp1+"];\n";
                            codigo+=codigo1+codigo5+final+":\n\n";
                            Nodo.clase.codigo=codigo;
                            Nodo.clase.direccion=temp2;

                          }
                    }

              }else if(Nodo.hijos[0].nombre=="Rif"){
                  if(Nodo.hijos.length==3){
                        let codigo="";        
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        //Nodo.hijos[1].clase.Ltrue=L0; 
                        //Nodo.hijos[1].clase.Lfalse=L1;
                        this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                        let codigo1=Nodo.hijos[1].clase.codigo;
                        //***************** */
                        ptr=ptr+tbs.tamanio;
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                        let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                        this.TamanioAmbito(Nodo.hijos[2],tbsLocal);
                        /** */
                        this.Recorre(Nodo.hijos[2],tbsLocal,ptr,lt,lf);
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        /** */
                        let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                        ptr=ptr-tbs.tamanio;
                        /** */
                        
                        //codigo+=Nodo.hijos[1].clase.codigo+L0+":\n"+codigo1+Nodo.hijos[2].clase.codigo+codigo2+"\n"+L1+":\n";
                        codigo+="if("+Nodo.hijos[1].clase.direccion+"==1) goto "+L0+";\n goto "+L1+";\n"
                        codigo+=L0+":\n"+codigo9+codigo2+codigo10;
                        codigo+=L1+":\n";

                        Nodo.clase.codigo=codigo1+codigo;

                  }else if(Nodo.hijos.length==4){
                        let codigo="";        
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        let L2=this.nuevaLabel();
                        
                        this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                        let direccion1=Nodo.hijos[1].clase.direccion;
                        let codigo1=Nodo.hijos[1].clase.codigo;
                        /** */
                        ptr=ptr+tbs.tamanio;
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                        let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                        this.TamanioAmbito(Nodo.hijos[2],tbsLocal);
                        /** */

                        this.Recorre(Nodo.hijos[2],tbsLocal,ptr,lt,lf);
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        /** */
                        let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                        ptr=ptr-tbs.tamanio;
                        /** */  

                                               
                        Nodo.hijos[3].clase.Ltrue=L1;
                        Nodo.hijos[3].clase.Lfalse=L2;
                        this.Recorre(Nodo.hijos[3],tbs,ptr,lt,lf);
                        let codigo3=Nodo.hijos[3].clase.codigo;
                        

                        //codigo+=codigo1+Ltrue+":\n"+codigo4+codigo2+codigo5+"\n goto "+Lsalida+";\n"+Lfalse+":\n"+codigo3+"\n"+Lsalida+":\n";
                        codigo+=codigo1+"if("+direccion1+"==1) goto "+L0+";\n";
                        codigo+="goto "+L1+";\n";
                        codigo+=L0+":\n"+codigo9+codigo2+codigo10+"goto "+L2+";\n"+codigo3+Nodo.hijos[3].clase.Ltrue+":\n"+L2+":\n";

                        Nodo.clase.codigo=codigo;


                  }else if(Nodo.hijos.length==5){
                        
                        let codigo="";        
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        let L2=this.nuevaLabel();
                        let L3=this.nuevaLabel();

                        
                        this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                        let codigo1=Nodo.hijos[1].clase.codigo;
                        let direccion1=Nodo.hijos[1].clase.direccion;
                        /** */
                        ptr=ptr+tbs.tamanio;
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                        let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                        this.TamanioAmbito(Nodo.hijos[2],tbsLocal);
                        /** */                        
                        
                        this.Recorre(Nodo.hijos[2],tbsLocal,ptr,lt,lf);
                        let codigo2=Nodo.hijos[2].clase.codigo;

                        //** */
                        let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                        ptr=ptr-tbs.tamanio;
                        /** */
                        
                        Nodo.hijos[3].clase.Ltrue=L1;
                        Nodo.hijos[3].clase.Lfalse=L2;
                        this.Recorre(Nodo.hijos[3],tbs,ptr,lt,lf);
                        let codigo3=Nodo.hijos[3].clase.codigo;

                        Nodo.hijos[4].clase.Ltrue=Nodo.hijos[3].clase.Ltrue;
                        Nodo.hijos[4].clase.Lfalse=L2;
                        this.Recorre(Nodo.hijos[4],tbs,ptr,lt,lf);

                        let codigo4=Nodo.hijos[4].clase.codigo;
                        
                        //codigo+=codigo1+Ltrue+":\n"+codigo5+codigo2+codigo6+"\n goto "+Lsalida+";\n"+Lfalse+":\n"+codigo3+"goto "+Lsalida+";\n"+Lfalse2+":\n"+codigo4+" goto "+Lsalida+";\n"+Lsalida+":\n";
                        codigo+=codigo1+"if("+direccion1+"==1) goto "+L0+";\n";
                        codigo+="goto "+L1+";\n";
                        codigo+=L0+":\n"+codigo9+codigo2+codigo10+"goto "+L2+";\n"+codigo3+codigo4+L2+":\n";
                        Nodo.clase.codigo=codigo;

                  }
              }else if(Nodo.hijos[0].nombre=="Rwhile"){
                    let codigo="";        
                    let L0=this.nuevaLabel();
                    let L1=this.nuevaLabel();
                   // Nodo.hijos[1].clase.Ltrue=L0; 
                    //Nodo.hijos[1].clase.Lfalse=L1;
                    this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                    let codigo1=Nodo.hijos[1].clase.codigo;
                    let direccion1=Nodo.hijos[1].clase.direccion;
                    
                    /** */
                    ptr=ptr+tbs.tamanio;
                    let tabla=[];
                    let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                    let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                    this.TamanioAmbito(Nodo.hijos[2],tbsLocal);
                    /** */
                    this.Recorre(Nodo.hijos[2],tbsLocal,ptr,lt,L1);
                    let codigo2=Nodo.hijos[2].clase.codigo;
                    //** */
                      let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                     ptr=ptr-tbs.tamanio;
                     /** */

                    let Lregresa=this.nuevaLabel();
                    //codigo+=Lregresa+":\n"+Nodo.hijos[1].clase.codigo+L0+":\n"+codigo4+Nodo.hijos[2].clase.codigo+codigo5+"goto "+Lregresa+";\n"+"\n"+L1+":\n";
                    codigo+=Lregresa+":\n"+codigo1+"if("+direccion1+"==1) goto "+L0+";\n goto "+L1+";\n";
                    codigo+=L0+":\n"+codigo9+codigo2+codigo10+"goto "+Lregresa+";\n"+L1+":\n";
                    Nodo.clase.codigo=codigo;

              }else if(Nodo.hijos[0].nombre=="Rdo"){

                    let codigo="";        
                    let L0=this.nuevaLabel();
                    let L1=this.nuevaLabel();
                    //Nodo.hijos[3].clase.Ltrue=L0; 
                    //Nodo.hijos[3].clase.Lfalse=L1;
                     /** */
                     ptr=ptr+tbs.tamanio;
                     let tabla=[];
                     let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                     let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                     this.TamanioAmbito(Nodo.hijos[1],tbsLocal);
                     /** */
                    this.Recorre(Nodo.hijos[1],tbsLocal,ptr,lt,L1);
                    let codigo1=Nodo.hijos[1].clase.codigo;
                    //** */
                    let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                    ptr=ptr-tbs.tamanio;
                    /** */

                    this.Recorre(Nodo.hijos[3],tbs,ptr,lt,lf);
                    let codigo3=Nodo.hijos[3].clase.codigo;
                    let direccion3=Nodo.hijos[3].clase.direccion;
          
                    //codigo+=L0+":\n"+codigo4+Nodo.hijos[1].clase.codigo+codigo5+Nodo.hijos[3].clase.codigo+L1+":\n";
                    codigo+=L0+":\n"+codigo9+codigo1+codigo10+codigo3+"if("+direccion3+"==1) goto "+L0+";\n"+L1+":\n";                    
                    Nodo.clase.codigo=codigo;

              }else if(Nodo.hijos[0].nombre=="Rswitch"){
                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                      let codigo1=Nodo.hijos[2].clase.codigo;
                      let direccion=Nodo.hijos[2].clase.direccion;

                      
                      let L1=this.nuevaLabel();

                      Nodo.hijos[5].clase.direccion=direccion;
                      this.Recorre(Nodo.hijos[5],tbs,ptr,lt,L1);
                      let codigo5=Nodo.hijos[5].clase.codigo;
                      let codigo="";
                      this.Recorre(Nodo.hijos[6],tbs,ptr,lt,L1);
                      let codigo6=Nodo.hijos[6].clase.codigo;
                      codigo+=codigo1+codigo5+Nodo.hijos[5].clase.Ltrue+":\n"+codigo6+" goto "+L1+";\n"+L1+":\n";
                      Nodo.clase.codigo=codigo;

              }else if(Nodo.hijos[0].nombre=="Rfor"){
                    
                    if(Nodo.hijos.length==9){
                      
                      let codigo="";        
                      let L0=this.nuevaLabel();
                      let L1=this.nuevaLabel();
                      let L2=this.nuevaLabel();
                      let Lregresa=this.nuevaLabel();
                      
                       /** */
                       ptr=ptr+tbs.tamanio;
                       let tabla=[];
                       let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                       let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                       
                       /** */
                      this.Recorre(Nodo.hijos[2],tbsLocal,ptr,lt,lf);
                      let codigo2=Nodo.hijos[2].clase.codigo;
                      this.TamanioAmbito(Nodo.hijos[2],tbsLocal);
                      this.TamanioAmbito(Nodo.hijos[8],tbsLocal);
                      //** */
                        let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                        
                      /** */
                      
                      //Nodo.hijos[4].clase.Ltrue=L0; 
                      //Nodo.hijos[4].clase.Lfalse=L1;
                      //Nodo.hijos[4].clase.codicion="condicion";
                      this.Recorre(Nodo.hijos[4],tbsLocal,ptr,lt,lf);
                      let codigo4=Nodo.hijos[4].clase.codigo;
                      let direccion4=Nodo.hijos[4].clase.direccion;
                      this.Recorre(Nodo.hijos[6],tbsLocal,ptr,lt,lf);
                      let codigo6=Nodo.hijos[6].clase.codigo;
                      this.Recorre(Nodo.hijos[8],tbsLocal,ptr,lt,L2);
                      let codigo8=Nodo.hijos[8].clase.codigo;
                      ptr=ptr-tbs.tamanio;
                      //codigo+=codigo9+codigo2+Lregresa+":\n"+codigo4+L0+":\n"+codigo8+codigo6+"goto "+Lregresa+";\n"+L1+":\n"+codigo10;  
                      codigo+=codigo9+codigo2+Lregresa+":\n"+codigo4+"if("+direccion4+"==1) goto "+L0+";\n";
                      codigo+="goto "+L1+";\n";
                      codigo+=L0+":\n"+codigo8+codigo6+" goto "+Lregresa+";\n"+L1+":\n"+codigo10+L2+":\n";
                      Nodo.clase.codigo=codigo;
                    }

              }else if(Nodo.hijos[0].nombre=="Rbreak"){

                  Nodo.clase.codigo="ptr=ptr-"+tbs.padre.tamanio+";\n"+"goto "+lf+";\n";
              }else if(Nodo.hijos[0].nombre=="Aumento"){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    Nodo.clase.codigo=Nodo.hijos[0].clase.codigo;
              }else if(Nodo.hijos[0].nombre=="Decremento"){
                this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                Nodo.clase.codigo=Nodo.hijos[0].clase.codigo;
              }else if(Nodo.hijos[0].nombre=="Rreturn"){
                if(Nodo.hijos.length==2){

                    Nodo.clase.codigo="goto "+lf+";\n";
                }else if(Nodo.hijos.length==3){
                  
                  let codigo="";
                  this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                  let tipo=Nodo.hijos[1].clase.tipo;
                  let codigo1=Nodo.hijos[1].clase.codigo;
                  let direccion1=Nodo.hijos[1].clase.direccion;
                  let t1=this.nuevoTemp();
                  codigo+=t1+"=ptr+"+tbs.actual+";\n";
                  codigo+="stack[(int)"+t1+"]="+direccion1+";\n";                          
                  this.declararSinExp("return",tipo,"let",tbs);
                  tbs.actual+=1;
                  Nodo.clase.codigo=codigo1+codigo;
                  console.log("return");
                  console.log(Nodo.clase.codigo);
                }
                

              }

              break;



            case "Exp":
              if(Nodo.hijos.length==1){
             
                if(Nodo.hijos[0].nombre=="entero"||Nodo.hijos[0].nombre=="decimal"){
                  Nodo.clase.codigo="";
                  Nodo.clase.direccion=Nodo.hijos[0].valor;
                  Nodo.clase.tipo="number";

                }else if(Nodo.hijos[0].nombre=="Rtrue"){

                    Nodo.clase.codigo="";
                    Nodo.clase.direccion=1;
                    Nodo.clase.tipo="boolean";
                  
                }else if(Nodo.hijos[0].nombre=="Rfalse"){
                 
                    Nodo.clase.codigo="";
                    Nodo.clase.direccion=0;
                    Nodo.clase.tipo="boolean";
                               
                }else if(Nodo.hijos[0].nombre=="cadena"){
                  
                  let direccion="";
                  let temp1=this.nuevoTemp();
                  direccion=temp1;                  
                  let cadena=Nodo.hijos[0].valor;
                  Nodo.clase.codigo=this.getCodigoCadena(temp1,cadena);
                  Nodo.clase.direccion=direccion;
                  Nodo.clase.tipo="string";

                }else if(Nodo.hijos[0].nombre=="cadenaSimple"){
                  
                  let direccion="";
                  let temp1=this.nuevoTemp();
                  direccion=temp1;                  
                  let cadena=Nodo.hijos[0].valor;  
                  Nodo.clase.codigo=this.getCodigoCadena(temp1,cadena);
                  Nodo.clase.direccion=direccion;
                  Nodo.clase.tipo="string";

                }else if(Nodo.hijos[0].nombre=="id"){
                  let id=Nodo.hijos[0].valor.toLowerCase();
                  let direccion=this.getDireccionId(id,tbs,ptr);
                  let tipo=this.getTipoId(id,tbs,ptr);
                  let codigo="";
                  let temp1=this.nuevoTemp();

                  codigo+=temp1+"=stack[(int)"+direccion+"];\n";
                  Nodo.clase.tipo=tipo;
                  Nodo.clase.direccion=temp1;
                  Nodo.clase.codigo=codigo;
                  
                }
                
              }else if(Nodo.hijos.length==2){

                  if(Nodo.hijos[0].nombre=="menos"){
                      let codigo="";
                      this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                      let dir=Nodo.hijos[1].clase.direccion;
                      let codigo1=Nodo.hijos[1].clase.codigo;
                      let t1=this.nuevoTemp();
                      codigo+=t1+"=-1;\n";
                      let t2=this.nuevoTemp();
                      codigo+=t2+"="+dir+"*"+t1+";\n";
                      
                      Nodo.clase.codigo=codigo1+codigo;
                      Nodo.clase.direccion=t2;
                      Nodo.clase.tipo="number";

                    }else if(Nodo.hijos[0].nombre=="neg"){

                        this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                        let codigo1=Nodo.hijos[1].clase.codigo;
                        let direccion1=Nodo.hijos[1].clase.direccion;
                        let codigo="";
                        let tmpBool=this.nuevoTemp();
                        let L1=this.nuevaLabel();
                        let L2=this.nuevaLabel();
                        codigo+=tmpBool+"=0;\n";
                        codigo+="if("+direccion1+"==1) goto "+L1+";\n";
                        codigo+="goto "+L2+";\n";
                        codigo+=L2+":\n";
                        codigo+=tmpBool+"=1;\n";
                        codigo+=L1+":\n";

                        Nodo.clase.codigo=codigo1+codigo;
                        Nodo.clase.direccion=tmpBool;
                        Nodo.clase.tipo="boolean";

                      



                  }
              }else if(Nodo.hijos.length==3){

                  if(Nodo.hijos[1].nombre=="mas"){

                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);


                     if(Nodo.hijos[0].clase.tipo=="string"&&Nodo.hijos[2].clase.tipo=="string"){
                            let codigo1=  Nodo.hijos[0].clase.codigo;
                            let codigo2= Nodo.hijos[2].clase.codigo;
                            let direccion1=Nodo.hijos[0].clase.direccion;
                            let direccion2=Nodo.hijos[2].clase.direccion;
                             
                            let direccion="";
                            let temp1=this.nuevoTemp();
                            direccion=temp1;
                            
                            Nodo.clase.codigo=codigo1+codigo2+this.getConcatenarCadenas(temp1,direccion1,direccion2);
                            Nodo.clase.direccion=direccion;
                            Nodo.clase.tipo="string";

                      }else if(Nodo.hijos[0].clase.tipo=="string"&&Nodo.hijos[2].clase.tipo=="number"){
                            let direccion1=Nodo.hijos[0].clase.direccion;                    
                            let codigo1=Nodo.hijos[0].clase.codigo;
                            
                            let direccion2="";
                            let temp2=this.nuevoTemp();
                            let cadena2:string=String(Nodo.hijos[2].clase.direccion);
                            let codigoN=Nodo.hijos[2].clase.codigo;
                            direccion2=temp2;
                            let codigo2=this.getCodigoNumero(temp2,cadena2);

                            let direccion="";
                            let tempres=this.nuevoTemp();
                            direccion=tempres;
                            
                            Nodo.clase.codigo=codigo1+codigoN+codigo2+this.getConcatenarCadenas(tempres,direccion1,direccion2);
                            Nodo.clase.direccion=direccion;
                            Nodo.clase.tipo="string";

                      }
                      else if(Nodo.hijos[0].clase.tipo=="number"&&Nodo.hijos[2].clase.tipo=="string"){
                            
                            
                            
                            let direccion1="";
                            let temp1=this.nuevoTemp();

                            let cadena1:string=String(Nodo.hijos[0].clase.direccion);
                            direccion1=temp1;
                            let codigo1=Nodo.hijos[0].clase.codigo+this.getCodigoNumero(temp1,cadena1);

                            let direccion2=Nodo.hijos[2].clase.direccion;                    
                            let codigo2=Nodo.hijos[2].clase.codigo;

                            let direccion="";
                            let tempres=this.nuevoTemp();
                            direccion=tempres;
                            
                            Nodo.clase.codigo=codigo1+codigo2+this.getConcatenarCadenas(tempres,direccion1,direccion2);
                            Nodo.clase.direccion=direccion;
                            Nodo.clase.tipo="string";

                      }
                      else if(Nodo.hijos[0].clase.tipo=="string"&&Nodo.hijos[2].clase.tipo=="boolean"){
                          let codigo1=  Nodo.hijos[0].clase.codigo;
                          let direccion1=Nodo.hijos[0].clase.direccion;

                          let codigo2=Nodo.hijos[2].clase.codigo;
                          let direccion2=Nodo.hijos[2].clase.direccion;
                          
                          let temp1=this.nuevoTemp();
                          let temp2=this.nuevoTemp();
                        

                          let L0=this.nuevaLabel();
                          let L1=this.nuevaLabel();
                          let L2=this.nuevaLabel();
                          
                          let codigo="";
                          codigo+="if("+direccion2+"==1) goto "+L0+";\n goto "+L1+";\n";
                          codigo+=L0+":\n"+this.getCodigoCadena(temp2,"true")+" goto "+L2+";\n";
                          codigo+=L1+":\n"+this.getCodigoCadena(temp2,"false")+" goto "+L2+";\n";
                          codigo+=L2+":\n";
                          Nodo.clase.codigo=codigo1+codigo2+codigo+this.getConcatenarCadenas(temp1,direccion1,temp2);
                          Nodo.clase.direccion=temp1;
                          Nodo.clase.tipo="string";

                      }
                      else if(Nodo.hijos[0].clase.tipo=="boolean"&&Nodo.hijos[2].clase.tipo=="string"){

                            let codigo1=  Nodo.hijos[0].clase.codigo;
                            let direccion1=Nodo.hijos[0].clase.direccion;

                            let codigo2=Nodo.hijos[2].clase.codigo;
                            let direccion2=Nodo.hijos[2].clase.direccion;
                            
                            let temp1=this.nuevoTemp();
                            let temp2=this.nuevoTemp();
                          

                            let L0=this.nuevaLabel();
                            let L1=this.nuevaLabel();
                            let L2=this.nuevaLabel();
                            
                            let codigo="";
                            codigo+="if("+direccion1+"==1) goto "+L0+";\n goto "+L1+";\n";
                            codigo+=L0+":\n"+this.getCodigoCadena(temp2,"true")+" goto "+L2+";\n";
                            codigo+=L1+":\n"+this.getCodigoCadena(temp2,"false")+" goto "+L2+";\n";
                            codigo+=L2+":\n";
                            Nodo.clase.codigo=codigo1+codigo2+codigo+this.getConcatenarCadenas(temp1,temp2,direccion2);
                            Nodo.clase.direccion=temp1;
                            Nodo.clase.tipo="string";

                      }else{

                        let temp1=this.nuevoTemp();
                        let codigo1=  Nodo.hijos[0].clase.codigo;
                        let codigo2= Nodo.hijos[2].clase.codigo;
                        let direccion1=Nodo.hijos[0].clase.direccion;
                        let direccion2=Nodo.hijos[2].clase.direccion;

                        Nodo.clase.codigo=codigo1+codigo2+temp1+"="+direccion1+"+"+direccion2+";\n";
                        Nodo.clase.direccion=temp1;
                        Nodo.clase.tipo="number";
                      }
                      
                  
                    }else if(Nodo.hijos[1].nombre=="menos"){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                    Nodo.clase.direccion=this.nuevoTemp();  
                    Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo+Nodo.clase.direccion+"="+Nodo.hijos[0].clase.direccion+"-"+Nodo.hijos[2].clase.direccion+";\n";
                    Nodo.clase.tipo="number";  
                  }else if(Nodo.hijos[1].nombre=="por"){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                    Nodo.clase.direccion=this.nuevoTemp();  
                    Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo+Nodo.clase.direccion+"="+Nodo.hijos[0].clase.direccion+"*"+Nodo.hijos[2].clase.direccion+";\n";
                    Nodo.clase.tipo="number";
                  }else if(Nodo.hijos[1].nombre=="div"){
                  this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                  this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                  Nodo.clase.direccion=this.nuevoTemp();  
                  Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo+Nodo.clase.direccion+"="+Nodo.hijos[0].clase.direccion+"/"+Nodo.hijos[2].clase.direccion+";\n";
                  Nodo.clase.tipo="number";  
                }else if(Nodo.hijos[1].nombre=="mod"){
                  this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                  this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                  Nodo.clase.direccion=this.nuevoTemp();  
                  Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo+Nodo.clase.direccion+"=fmod("+Nodo.hijos[0].clase.direccion+","+Nodo.hijos[2].clase.direccion+");\n";
                  Nodo.clase.tipo="number";  
                }else if(Nodo.hijos[1].nombre=="pot"){
                      let codigo="";
                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                      let temp0=this.nuevoTemp();
                      let temp1=this.nuevoTemp();
                      let temp2=this.nuevoTemp();

                      codigo+=temp0+"="+Nodo.hijos[0].clase.direccion+";\n";
                      codigo+=temp1+"="+Nodo.hijos[2].clase.direccion+";\n";
                      let L1=this.nuevaLabel();
                      let L2=this.nuevaLabel();
                      let L3=this.nuevaLabel();

                      codigo+="if("+temp1+"==0) goto "+L2+";\n";
                      codigo+=temp2+"="+temp0+";\n";
                      codigo+=L1+":\n";
                      codigo+=temp1+"="+temp1+"-1;\n";
                      codigo+=temp2+"="+temp2+"*"+temp0+";\n";
                      codigo+="if("+temp1+">1) goto "+L1+";\n";
                      codigo+="goto "+L3+";\n";
                      codigo+=L2+":\n";
                      codigo+=temp2+"=1;\n";
                      codigo+="goto "+L3+";\n";
                      codigo+=L3+":\n";
                      Nodo.clase.codigo=codigo;
                      Nodo.clase.direccion=temp2;
                      Nodo.clase.tipo="number";
                  }else if(Nodo.hijos[1].nombre=="mayor"){
                     
                        this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                        this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                        let codigo0=Nodo.hijos[0].clase.codigo;
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        let direccion0=Nodo.hijos[0].clase.direccion;
                        let direccion2=Nodo.hijos[2].clase.direccion;
                        let codigo="";
                        let tmpBool=this.nuevoTemp();
                        codigo+=tmpBool+"=0;\n";
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        codigo+="if("+direccion0+">"+direccion2+") goto "+L0+";\n";
                        codigo+="goto "+L1+";\n";
                        codigo+=L0+":\n";
                        codigo+=tmpBool+"=1;\n";
                        codigo+=L1+":\n";
                        Nodo.clase.direccion=tmpBool;
                        Nodo.clase.tipo="boolean";
                        Nodo.clase.codigo=codigo0+codigo2+codigo;

                  }else if(Nodo.hijos[1].nombre=="menor"){
                     
                        this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                        this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                        let codigo0=Nodo.hijos[0].clase.codigo;
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        let direccion0=Nodo.hijos[0].clase.direccion;
                        let direccion2=Nodo.hijos[2].clase.direccion;
                        let codigo="";
                        let tmpBool=this.nuevoTemp();
                        codigo+=tmpBool+"=0;\n";
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        codigo+="if("+direccion0+"<"+direccion2+") goto "+L0+";\n";
                        codigo+="goto "+L1+";\n";
                        codigo+=L0+":\n";
                        codigo+=tmpBool+"=1;\n";
                        codigo+=L1+":\n";
                        Nodo.clase.direccion=tmpBool;
                        Nodo.clase.tipo="boolean";
                        Nodo.clase.codigo=codigo0+codigo2+codigo;
                                    
                  }else if(Nodo.hijos[1].nombre=="mayorq"){
                        this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                        this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                        let codigo0=Nodo.hijos[0].clase.codigo;
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        let direccion0=Nodo.hijos[0].clase.direccion;
                        let direccion2=Nodo.hijos[2].clase.direccion;
                        let codigo="";
                        let tmpBool=this.nuevoTemp();
                        codigo+=tmpBool+"=0;\n";
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        codigo+="if("+direccion0+">="+direccion2+") goto "+L0+";\n";
                        codigo+="goto "+L1+";\n";
                        codigo+=L0+":\n";
                        codigo+=tmpBool+"=1;\n";
                        codigo+=L1+":\n";
                        Nodo.clase.direccion=tmpBool;
                        Nodo.clase.tipo="boolean";
                        Nodo.clase.codigo=codigo0+codigo2+codigo;

                  }else if(Nodo.hijos[1].nombre=="menorq"){

                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                      let codigo0=Nodo.hijos[0].clase.codigo;
                      let codigo2=Nodo.hijos[2].clase.codigo;
                      let direccion0=Nodo.hijos[0].clase.direccion;
                      let direccion2=Nodo.hijos[2].clase.direccion;
                      let codigo="";
                      let tmpBool=this.nuevoTemp();
                      codigo+=tmpBool+"=0;\n";
                      let L0=this.nuevaLabel();
                      let L1=this.nuevaLabel();
                      codigo+="if("+direccion0+"<="+direccion2+") goto "+L0+";\n";
                      codigo+="goto "+L1+";\n";
                      codigo+=L0+":\n";
                      codigo+=tmpBool+"=1;\n";
                      codigo+=L1+":\n";
                      Nodo.clase.direccion=tmpBool;
                      Nodo.clase.tipo="boolean";
                      Nodo.clase.codigo=codigo0+codigo2+codigo;

                  }else if(Nodo.hijos[1].nombre=="dbigual"){
                      let codigo="";
                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                    if(Nodo.hijos[0].clase.tipo=="string"&&Nodo.hijos[2].clase.tipo=="string"){
                    
                        let codigo1=Nodo.hijos[0].clase.codigo;
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        let direccion1=Nodo.hijos[0].clase.direccion;
                        let direccion2=Nodo.hijos[2].clase.direccion;
                        let tmpBool=this.nuevoTemp();
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        codigo+=tmpBool+"=0;\n";
                        codigo+=codigo1+codigo2+this.getIgualstring(L0,L1,direccion1,direccion2);
                        codigo+=L0+":\n";
                        codigo+=tmpBool+"=1;\n";
                        codigo+L1+":\n";
                        Nodo.clase.codigo=codigo;
                        Nodo.clase.tipo="boolean";  
                        Nodo.clase.direccion=tmpBool;
                        
                    }else{
                      
                          let codigo0=Nodo.hijos[0].clase.codigo;
                          let codigo2=Nodo.hijos[2].clase.codigo;
                          let direccion0=Nodo.hijos[0].clase.direccion;
                          let direccion2=Nodo.hijos[2].clase.direccion;
                          let codigo="";
                          let tmpBool=this.nuevoTemp();
                          codigo+=tmpBool+"=0;\n";
                          let L0=this.nuevaLabel();
                          let L1=this.nuevaLabel();
                          codigo+="if("+direccion0+"=="+direccion2+") goto "+L0+";\n";
                          codigo+="goto "+L1+";\n";
                          codigo+=L0+":\n";
                          codigo+=tmpBool+"=1;\n";
                          codigo+=L1+":\n";
                          Nodo.clase.direccion=tmpBool;
                          Nodo.clase.tipo="boolean";
                          Nodo.clase.codigo=codigo0+codigo2+codigo;     

                    }
                    

                  }else if(Nodo.hijos[1].nombre=="difer"){
                    let codigo="";
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                    
                    if(Nodo.hijos[0].clase.tipo=="string"&&Nodo.hijos[2].clase.tipo=="string"){

                        let codigo1=Nodo.hijos[0].clase.codigo;
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        let direccion1=Nodo.hijos[0].clase.direccion;
                        let direccion2=Nodo.hijos[2].clase.direccion;
                        let tmpBool=this.nuevoTemp();
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        codigo+=tmpBool+"=0;\n";
                        codigo+=codigo1+codigo2+this.getIgualstring(L1,L0,direccion1,direccion2);
                        codigo+=L0+":\n";
                        codigo+=tmpBool+"=1;\n";
                        codigo+L1+":\n";
                        Nodo.clase.codigo=codigo;
                        Nodo.clase.tipo="boolean";  
                        Nodo.clase.direccion=tmpBool;

                    }else{
                        
                          this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                          this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                          let codigo0=Nodo.hijos[0].clase.codigo;
                          let codigo2=Nodo.hijos[2].clase.codigo;
                          let direccion0=Nodo.hijos[0].clase.direccion;
                          let direccion2=Nodo.hijos[2].clase.direccion;
                          let codigo="";
                          let tmpBool=this.nuevoTemp();
                          codigo+=tmpBool+"=0;\n";
                          let L0=this.nuevaLabel();
                          let L1=this.nuevaLabel();
                          codigo+="if("+direccion0+"!="+direccion2+") goto "+L0+";\n";
                          codigo+="goto "+L1+";\n";
                          codigo+=L0+":\n";
                          codigo+=tmpBool+"=1;\n";
                          codigo+=L1+":\n";
                          Nodo.clase.direccion=tmpBool;
                          Nodo.clase.tipo="boolean";
                          Nodo.clase.codigo=codigo0+codigo2+codigo;
                        

                    }

                  }else if(Nodo.hijos[1].nombre=="or"){
                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                      let codigo0=Nodo.hijos[0].clase.codigo;
                      let codigo2=Nodo.hijos[2].clase.codigo;
                      let direccion0=Nodo.hijos[0].clase.direccion;
                      let direccion2=Nodo.hijos[2].clase.direccion;
                      let codigo="";
                      let tmpBool=this.nuevoTemp();
                      
                      let L1=this.nuevaLabel();
                      let L2=this.nuevaLabel();
                      let L3=this.nuevaLabel();
                      let L4=this.nuevaLabel();
                      codigo+=tmpBool+"=0;\n";
                      codigo+="if("+direccion0+"==1) goto "+L1+";\n";
                      codigo+="goto "+L2+";\n";
                      codigo+=L1+":\n";
                      codigo+=tmpBool+"=1;\n";
                      codigo+="goto "+L4+";\n"
                      codigo+=L2+":\n";
                      codigo+="if("+direccion2+"==1) goto "+L3+";\n";
                      codigo+="goto "+L4+";\n";
                      codigo+=L3+":\n";
                      codigo+=tmpBool+"=1;\n";
                      codigo+=L4+":\n";
                      Nodo.clase.codigo=codigo0+codigo2+codigo;
                      Nodo.clase.tipo="boolean";
                      Nodo.clase.direccion=tmpBool;

                  }else if(Nodo.hijos[1].nombre=="and"){

                        let codigo="";
                        this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                        this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                        let codigo0=Nodo.hijos[0].clase.codigo;
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        let direccion0=Nodo.hijos[0].clase.direccion;
                        let direccion2=Nodo.hijos[2].clase.direccion;
                        
                        let tmpBool=this.nuevoTemp();
                        let L1=this.nuevaLabel();
                        let L2=this.nuevaLabel();
                        let L3=this.nuevaLabel();
                        codigo+="if("+direccion0+"==1) goto "+L1+";\n";
                        codigo+="goto "+L2+";\n";
                        codigo+=L1+":\n";
                        codigo+="if("+direccion2+"==1) goto "+L3+";\n";
                        codigo+="goto "+L2+";\n";
                        codigo+=L3+":\n";
                        codigo+=tmpBool+"=1;\n";
                        codigo+=L2+":\n";
                        
                        Nodo.clase.codigo=codigo0+codigo2+codigo;
                        Nodo.clase.tipo="boolean";
                        Nodo.clase.direccion=tmpBool;

                  }else if(Nodo.hijos[1].nombre=="pIzq"){
                      
                      let id=Nodo.hijos[0].valor.toLowerCase();
                      this.Recorre(this.getNodofuncion(id),tbs,ptr,lt,lf);
                      Nodo.clase.codigo=this.getNodofuncion(id).clase.codigo;
                      Nodo.clase.direccion=this.getNodofuncion(id).clase.direccion;
                      Nodo.clase.tipo=this.getTipofuncion(id);
                      
                  
                  }else if(Nodo.hijos[1].nombre=="Exp"){
                      Nodo.hijos[1].clase.Ltrue=Nodo.clase.Ltrue;
                      Nodo.hijos[1].clase.Lfalse=Nodo.clase.Lfalse;
                      Nodo.hijos[1].clase.condicion=Nodo.clase.condicion;
                      this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);  
                      Nodo.clase.codigo=Nodo.hijos[1].clase.codigo;
                      Nodo.clase.tipo=Nodo.hijos[1].clase.tipo;
                      Nodo.clase.direccion=Nodo.hijos[1].clase.direccion;
                  }else if(Nodo.hijos[1].nombre=="punto"){
                    
                    let codigo="";
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    let codigo0=Nodo.hijos[0].clase.codigo;
                    let direccion0=Nodo.hijos[0].clase.direccion;
                    let t1=this.nuevoTemp();
                    let t2=this.nuevoTemp();
                    let L0=this.nuevaLabel();
                    codigo+=codigo0+t1+"="+direccion0+";\n"
                    codigo+=t2+"=0;\n"
                    codigo+=L0+":\n"
                    codigo+=t1+"="+t1+"+1;\n";
                    codigo+=t2+"="+t2+"+1;\n";
                    codigo+="if(heap[(int)"+t1+"]!=-1) goto "+L0+";\n";
                    Nodo.clase.direccion=t2;
                    Nodo.clase.tipo="number";
                    Nodo.clase.codigo=codigo;
                  }

              }else if(Nodo.hijos.length==4){
                    let id=Nodo.hijos[0].valor.toLowerCase();
                    this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);

                    this.getNodofuncion(id).clase.valores=Nodo.hijos[2].valores;
                    this.getNodofuncion(id).clase.codigo=Nodo.hijos[2].clase.codigo;
                    this.Recorre(this.getNodofuncion(id),tbs,ptr,lt,lf);

                    console.log(this.getNodofuncion(id).clase.codigo);
                    console.log(this.getNodofuncion(id).clase.direccion);
                    console.log(this.getTipofuncion(id));
                    Nodo.clase.codigo=this.getNodofuncion(id).clase.codigo;
                    
                    Nodo.clase.direccion=this.getNodofuncion(id).clase.direccion;
                    Nodo.clase.tipo=this.getTipofuncion(id);
              }else if(Nodo.hijos.length==5){

                  if(Nodo.hijos[2].nombre=="Exp"){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    let codigo0=Nodo.hijos[0].clase.codigo;
                    let direccion0=Nodo.hijos[0].clase.direccion;
  
                    this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                    let codigo2=Nodo.hijos[2].clase.codigo;
                    let direccion2=Nodo.hijos[2].clase.direccion;
  
                    this.Recorre(Nodo.hijos[4],tbs,ptr,lt,lf);
                    let codigo4=Nodo.hijos[4].clase.codigo;
                    let direccion4=Nodo.hijos[4].clase.direccion;
  
                    let L0=this.nuevaLabel();
                    let L1=this.nuevaLabel();
                    let L2=this.nuevaLabel();
  
                    let codigo="";
                    let tmpRet=this.nuevoTemp();
                    codigo+=codigo0+"if("+direccion0+"==1) goto "+L0+";\n";
                    codigo+="goto "+L1+";\n";
                    codigo+=L0+":\n";
                    codigo+=codigo2;
                    codigo+=tmpRet+"="+direccion2+";\n";
                    codigo+="goto "+L2+";\n";
                    codigo+=L1+":\n";
                    codigo+=codigo4;
                    codigo+=tmpRet+"="+direccion4+";\n";
                    codigo+="goto "+L2+";\n";
                    codigo+=L2+":\n";
  
                    Nodo.clase.codigo=codigo;
                    Nodo.clase.tipo=Nodo.hijos[4].clase.tipo;
                    Nodo.clase.direccion=tmpRet;

                  }else if(Nodo.hijos[2].nombre=="Rtolowercase"){
                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      let codigo0=Nodo.hijos[0].clase.codigo;
                      let direccion0=Nodo.hijos[0].clase.direccion;
                      let t1=this.nuevoTemp();
                      let t2=this.nuevoTemp();
                      let t3=this.nuevoTemp();

                      let L0=this.nuevaLabel();
                      let L1=this.nuevaLabel();
                      let L2=this.nuevaLabel();
                      let L3=this.nuevaLabel();
                      let L4=this.nuevaLabel();

                      let codigo="";
                      codigo+=t3+"=h;\n";
                      codigo+=codigo0+t1+"="+direccion0+";\n";
                      codigo+=L0+":\n";
                      codigo+="if(heap[(int)"+t1+"]>=65) goto "+L1+";\n goto "+L3+";\n";
                      codigo+=L1+":\n"
                      codigo+="if(heap[(int)"+t1+"]<=90) goto "+L2+";\n goto "+L3+";\n";;  
                      codigo+=L2+":\n"
                      codigo+=t2+"=heap[(int)"+t1+"]+32;\n";
                      codigo+="goto "+L4+";\n";
                      codigo+=L3+":\n"
                      codigo+=t2+"=heap[(int)"+t1+"];\n";
                      codigo+="goto "+L4+";\n";
                      codigo+=L4+":\n";
                      codigo+="heap[(int)h]="+t2+";\n";
                      codigo+="h=h+1;\n";
                      codigo+=t1+"="+t1+"+1;\n";
                      codigo+="if(heap[(int)"+t1+"]!=-1) goto "+L0+";\n";
                      codigo+="heap[(int)h]=-1;\n"
                      codigo+="h=h+1;\n"
                      Nodo.clase.codigo=codigo;
                      Nodo.clase.tipo="string";
                      Nodo.clase.direccion=t3;

                  }else if(Nodo.hijos[2].nombre=="Rtouppercase"){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    let codigo0=Nodo.hijos[0].clase.codigo;
                    let direccion0=Nodo.hijos[0].clase.direccion;
                    let t1=this.nuevoTemp();
                    let t2=this.nuevoTemp();
                    let t3=this.nuevoTemp();

                    let L0=this.nuevaLabel();
                    let L1=this.nuevaLabel();
                    let L2=this.nuevaLabel();
                    let L3=this.nuevaLabel();
                    let L4=this.nuevaLabel();

                    let codigo="";
                    codigo+=t3+"=h;\n";
                    codigo+=codigo0+t1+"="+direccion0+";\n";
                    codigo+=L0+":\n";
                    codigo+="if(heap[(int)"+t1+"]>=97) goto "+L1+";\n goto "+L3+";\n";
                    codigo+=L1+":\n"
                    codigo+="if(heap[(int)"+t1+"]<=122) goto "+L2+";\n goto "+L3+";\n";;  
                    codigo+=L2+":\n"
                    codigo+=t2+"=heap[(int)"+t1+"]-32;\n";
                    codigo+="goto "+L4+";\n";
                    codigo+=L3+":\n"
                    codigo+=t2+"=heap[(int)"+t1+"];\n";
                    codigo+="goto "+L4+";\n";
                    codigo+=L4+":\n";
                    codigo+="heap[(int)h]="+t2+";\n";
                    codigo+="h=h+1;\n";
                    codigo+=t1+"="+t1+"+1;\n";
                    codigo+="if(heap[(int)"+t1+"]!=-1) goto "+L0+";\n";
                    codigo+="heap[(int)h]=-1;\n"
                    codigo+="h=h+1;\n"
                    Nodo.clase.codigo=codigo;
                    Nodo.clase.tipo="string";
                    Nodo.clase.direccion=t3;  
                  }



              }else if(Nodo.hijos.length==6){
                    if(Nodo.hijos[2].nombre=="Rcharat"){
                      let codigo="";
                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      let codigo0=Nodo.hijos[0].clase.codigo;
                      let direccion0=Nodo.hijos[0].clase.direccion;

                      this.Recorre(Nodo.hijos[4],tbs,ptr,lt,lf);
                      let codigo4=Nodo.hijos[4].clase.codigo;
                      let direccion4=Nodo.hijos[4].clase.direccion;

                      let L0=this.nuevaLabel();
                      let L1=this.nuevaLabel();
                     
                      let t1=this.nuevoTemp();
                      let t2=this.nuevoTemp();
                      let t3=this.nuevoTemp();
                      let t4=this.nuevoTemp();
                      let t5=this.nuevoTemp();

                      codigo+=codigo0+codigo4+t1+"="+direccion0+";\n";
                      codigo+=t2+"=0;\n";
                      codigo+=L0+":\n";
                      codigo+=t1+"="+t1+"+1;\n";
                      codigo+=t2+"="+t2+"+1;\n";
                      codigo+="if("+t2+"=="+direccion4+") goto "+L1+";\n";
                      codigo+="if(heap[(int)"+t1+"]!=-1) goto "+L0+";\n"+L1+":\n";
                      codigo+=t4+"="+t2+"+"+direccion0+";\n"
                      codigo+=t3+"=heap[(int)"+t4+"];\n";
                      codigo+="heap[(int)h]="+t3+";\n";                     
                      codigo+=t5+"=h;\n";
                      codigo+="h=h+1;\n";
                      codigo+="heap[(int)h]=-1;\n";
                      codigo+="h=h+1;\n";

                      Nodo.clase.codigo=codigo;
                      Nodo.clase.tipo="string";
                      Nodo.clase.direccion=t5;

                    }else if(Nodo.hijos[2].nombre=="Rconcat"){

                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      let codigo0=Nodo.hijos[0].clase.codigo;
                      let direccion0=Nodo.hijos[0].clase.direccion;

                      this.Recorre(Nodo.hijos[4],tbs,ptr,lt,lf);
                      let codigo4=Nodo.hijos[4].clase.codigo;
                      let direccion4=Nodo.hijos[4].clase.direccion;
                      
                      let t1=this.nuevoTemp();
                      let codigo="";
                      codigo+=codigo0+codigo4+this.getConcatenarCadenas(t1,direccion0,direccion4);
                      
                      Nodo.clase.codigo=codigo;
                      Nodo.clase.tipo="string";
                      Nodo.clase.direccion=t1;
                    }

              }
              break;

              case "DecLet":
                  this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                  Nodo.clase.codigo=Nodo.hijos[1].clase.codigo;
                break;

              case "Lasig":
                  if(Nodo.hijos.length==1){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    Nodo.clase.codigo=Nodo.hijos[0].clase.codigo;
                  }else if(Nodo.hijos.length==3){
                    this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                    this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                    Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo;
                  }
                break;

               case "IA":

                    if(Nodo.hijos.length==3){
                        this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                        let id=Nodo.hijos[0].valor;
                        let tipo=Nodo.hijos[2].valor;
                        let codigo="";
                        if(tipo=="number"){
                          let t1=this.nuevoTemp();
                          codigo+=t1+"=ptr+"+tbs.actual+";\n";
                          codigo+="stack[(int)"+t1+"]=0;\n";                          
                          this.declararSinExp(id,tipo,"let",tbs);
                          tbs.actual+=1;
                          Nodo.clase.codigo=codigo;  
                        }else if(tipo=="boolean"){
                          let t1=this.nuevoTemp();
                          codigo+=t1+"=ptr+"+tbs.actual+";\n";
                          codigo+="stack[(int)"+t1+"]=0;\n";                          
                          this.declararSinExp(id,tipo,"let",tbs);
                          tbs.actual+=1;
                          Nodo.clase.codigo=codigo;
                        }else if(tipo=="string"){
                          let temp1=this.nuevoTemp();
                          codigo+=temp1+"=h;\n";
                          codigo+="heap[(int)h]=0;\n";
                          codigo+="h=h+1;\n";
                          codigo+="heap[(int)h]=-1;\n";
                          codigo+="h=h+1;\n";
                          let t1=this.nuevoTemp();
                          codigo+=t1+"=ptr+"+tbs.actual+";\n";
                          codigo+="stack[(int)"+t1+"]="+temp1+";\n";                          
                          this.declararSinExp(id,tipo,"let",tbs);
                          tbs.actual+=1;
                          Nodo.clase.codigo=codigo;

                        }
                    }else if(Nodo.hijos.length==5){
                      //this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      Nodo.hijos[4].clase.condicion="";
                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                      this.Recorre(Nodo.hijos[4],tbs,ptr,lt,lf);
                      let id=Nodo.hijos[0].valor.toLowerCase();
                      let tipo=Nodo.hijos[2].valor.toLowerCase();
                      let codigo="";
                      if(tipo=="number"){
                        let codigo1=Nodo.hijos[4].clase.codigo;
                        let direccion1=Nodo.hijos[4].clase.direccion;
                        let t1=this.nuevoTemp();
                        codigo+=t1+"=ptr+"+tbs.actual+";\n";
                        codigo+="stack[(int)"+t1+"]="+direccion1+";\n";
                        //codigo+="stack[(int)ptr+"+tbs.actual+"]="+direccion1+";\n";                          
                        this.declararSinExp(id,tipo,"let",tbs);
                        tbs.actual+=1;
                        Nodo.clase.codigo=codigo1+codigo;  
                      }else if(tipo=="boolean"){
                        
                        let codigo4=Nodo.hijos[4].clase.codigo;
                        let direccion4=Nodo.hijos[4].clase.direccion;
                        
                        let t1=this.nuevoTemp();
                        codigo+=t1+"=ptr+"+tbs.actual+";\n";
                        codigo+="stack[(int)"+t1+"]="+direccion4+";\n";
                                                  
                        this.declararSinExp(id,tipo,"let",tbs);
                        tbs.actual+=1;
                        Nodo.clase.codigo=codigo4+codigo;

                      }else if(tipo=="string"){
                        let codigo1=Nodo.hijos[4].clase.codigo;
                        let direccion1=Nodo.hijos[4].clase.direccion;
                        let t1=this.nuevoTemp();
                        codigo+=t1+"=ptr+"+tbs.actual+";\n";
                        codigo+="stack[(int)"+t1+"]="+direccion1+";\n";
                        //codigo+="stack[(int)ptr+"+tbs.actual+"]="+direccion1+";\n";                          
                        this.declararSinExp(id,tipo,"let",tbs);
                        tbs.actual+=1;
                        Nodo.clase.codigo=codigo1+codigo; 
                      }  



                    }

                 break;

               case "Ntipo":
                      if(Nodo.hijos.length==1){

                        Nodo.valor=String(Nodo.hijos[0].valor).toLowerCase();
                      }else if(Nodo.hijos.length==3){
                        Nodo.valor="arr";
                      }

                 break;
              
               case "DecConst":
                    this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                    Nodo.clase.codigo=Nodo.hijos[1].clase.codigo;
                 break;
               case "Lconst":
                    if(Nodo.hijos.length==1){
                        this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                        Nodo.clase.codigo=Nodo.hijos[0].clase.codigo;
                    }else if(Nodo.hijos.length==3){
                      this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                      Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo;
                    }   
                 break;
               case "CA":
                    if(Nodo.hijos.length==5){

                      this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                      this.Recorre(Nodo.hijos[4],tbs,ptr,lt,lf);

                      let id=Nodo.hijos[0].valor.toLowerCase();
                      let tipo=Nodo.hijos[2].valor.toLowerCase();
                      let codigo="";

                      if(tipo=="number"){
                        let codigo1=Nodo.hijos[4].clase.codigo;
                        let direccion1=Nodo.hijos[4].clase.direccion;
                        let t1=this.nuevoTemp();
                        codigo+=t1+"=ptr+"+tbs.actual+";\n";
                        codigo+="stack[(int)"+t1+"]="+direccion1+";\n";                          
                        this.declararSinExp(id,tipo,"const",tbs);
                        tbs.actual+=1;
                        Nodo.clase.codigo=codigo1+codigo;  
                      }else if(tipo=="boolean"){

                        let codigo4=Nodo.hijos[4].clase.codigo;
                        let direccion4=Nodo.hijos[4].clase.direccion;  
                        let t1=this.nuevoTemp();
                        codigo+=t1+"=ptr+"+tbs.actual+";\n";
                        codigo+="stack[(int)"+t1+"]="+direccion4+";\n";                          
                        this.declararSinExp(id,tipo,"const",tbs);
                        tbs.actual+=1;
                        Nodo.clase.codigo=codigo4+codigo;
                      }else if(tipo=="string"){
                        let codigo1=Nodo.hijos[4].clase.codigo;
                        let direccion1=Nodo.hijos[4].clase.direccion;
                        let t1=this.nuevoTemp();
                        codigo+=t1+"=ptr+"+tbs.actual+";\n";
                        codigo+="stack[(int)"+t1+"]="+direccion1+";\n";                          
                        this.declararSinExp(id,tipo,"const",tbs);
                        tbs.actual+=1;
                        Nodo.clase.codigo=codigo1+codigo; 
                      }  
                    }
                    
                 break;
                 
              case "Condicion":
                    if(Nodo.hijos.length==3){
                      //console.log("paso condicion");
                        
                        //Nodo.hijos[1].clase.condicion="condicion";
                        
                        Nodo.clase.codigo=Nodo.hijos[1].codigo;
                        Nodo.hijos[1].clase.Ltrue=Nodo.clase.Ltrue;
                        Nodo.hijos[1].clase.Lfalse=Nodo.clase.Lfalse;
                        this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                        Nodo.clase.codigo=Nodo.hijos[1].clase.codigo;
                        Nodo.clase.direccion=Nodo.hijos[1].clase.direccion;
                        Nodo.clase.tipo=Nodo.hijos[1].clase.tipo;
                    }
                break;
              
                case "BloqueIns":
                    if(Nodo.hijos.length==3){

                      this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);

                      Nodo.clase.codigo=Nodo.hijos[1].clase.codigo;
                    }
                    
                  break;

               case "NelseIf":
                      if(Nodo.hijos.length==4){
                        let codigo="";        
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        //Nodo.hijos[2].clase.Ltrue=L0; 
                        //Nodo.hijos[2].clase.Lfalse=L1;
                        this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                        let direccion2=Nodo.hijos[2].clase.direccion;
                        let codigo2=Nodo.hijos[2].clase.codigo;
                          /** */
                          ptr=ptr+tbs.tamanio;
                          let tabla=[];
                          let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                          let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                          this.TamanioAmbito(Nodo.hijos[3],tbsLocal);
                          /** */
                          this.Recorre(Nodo.hijos[3],tbsLocal,ptr,lt,lf);
                          let codigo3=Nodo.hijos[3].clase.codigo;
                        /** */
                        let codigo10="ptr=ptr-"+tbs.tamanio+";\n";

                        ptr=ptr-tbs.tamanio;
                        /** */
                        //codigo+=Nodo.hijos[2].clase.codigo+L0+":\n"+codigo4+Nodo.hijos[3].clase.codigo+codigo5+"\n"+L1+":\n";
                        codigo+=Nodo.clase.Ltrue+":\n"+codigo2+"if("+direccion2+"==1) goto "+L0+";\n"+"goto "+L1+";\n";
                        codigo+=L0+":\n"+codigo9+codigo3+codigo10+"goto "+Nodo.clase.Lfalse+";\n";
                        Nodo.clase.Ltrue=L1;
                        Nodo.clase.codigo=codigo;

                      }else if(Nodo.hijos.length==5){
                        let codigo="";        
                        

                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();

                        Nodo.hijos[0].clase.Ltrue=Nodo.clase.Ltrue; 
                        Nodo.hijos[0].clase.Lfalse=Nodo.clase.Lfalse;
                        this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                        let codigo0=Nodo.hijos[0].clase.codigo;

                        this.Recorre(Nodo.hijos[3],tbs,ptr,lt,lf);
                        let direccion3=Nodo.hijos[3].clase.direccion;
                        let codigo3=Nodo.hijos[3].clase.codigo;
                        /** */
                        ptr=ptr+tbs.tamanio;
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                        let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                        this.TamanioAmbito(Nodo.hijos[4],tbsLocal);
                        /** */
                        
                        this.Recorre(Nodo.hijos[4],tbsLocal,ptr,lt,lf);
                        let codigo4=Nodo.hijos[4].clase.codigo;
                        /** */
                        let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                        ptr=ptr-tbs.tamanio;
                        /** */

                        //codigo+=Nodo.hijos[0].clase.codigo+Nodo.hijos[3].clase.codigo+L0+":\n"+codigo4+Nodo.hijos[4].clase.codigo+codigo5+"\n"+L1+":\n";
                        codigo+=Nodo.hijos[0].clase.Ltrue+":\n"+codigo3+"if("+direccion3+"==1) goto "+L0+";\ngoto "+L1+";\n";
                        codigo+=L0+":\n"+codigo9+codigo4+codigo10+"goto "+Nodo.clase.Lfalse+";\n";
                        Nodo.clase.Ltrue=L1;
                        Nodo.clase.codigo=codigo0+codigo;

                      }
                 break;

                 case "Nelse":
                      if(Nodo.hijos.length==2){
                          let codigo="";

                          /** */
                          ptr=ptr+tbs.tamanio;
                          let tabla=[];
                          let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                          let codigo4="ptr=ptr+"+tbs.tamanio+";\n";
                          this.TamanioAmbito(Nodo.hijos[1],tbsLocal);
                          /** */
                          this.Recorre(Nodo.hijos[1],tbsLocal,ptr,lt,lf);
                          /** */
                          let codigo5="ptr=ptr-"+tbs.tamanio+";\n";
                          ptr=ptr-tbs.tamanio;
                          /** */
                          let L0=this.nuevaLabel();
                          codigo+=Nodo.clase.Ltrue+":\n"+codigo4+Nodo.hijos[1].clase.codigo+codigo5;
                          Nodo.clase.codigo=codigo;
                          Nodo.clase.Ltrue=L0;
                      }
                   break;

                  case "Ncase":
                    if(Nodo.hijos.length==4){
                        let codigo="";
                        this.Recorre(Nodo.hijos[1],tbs,ptr,lt,lf);
                        let  direccion1=Nodo.hijos[1].clase.direccion;
                        let codigo1=Nodo.hijos[1].clase.codigo; 
                        /** */
                        ptr=ptr+tbs.tamanio;
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                        let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                        this.TamanioAmbito(Nodo.hijos[3],tbsLocal);
                        /** */
                        this.Recorre(Nodo.hijos[3],tbsLocal,ptr,lt,lf);
                        let codigo3=Nodo.hijos[3].clase.codigo;
                        /** */
                        let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                        ptr=ptr-tbs.tamanio;
                        /** */
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        let direccion=Nodo.clase.direccion;

                        codigo+=codigo1+"if ("+direccion+"=="+direccion1+") goto "+L0+";\n goto "+L1+";\n";
                        codigo+=L0+":\n"+codigo9+codigo3+codigo10; 

                        Nodo.clase.Ltrue=L1;
                        Nodo.clase.codigo=codigo;
                    }else if(Nodo.hijos.length==5){
                        let codigo="";
                        Nodo.hijos[0].clase.direccion=Nodo.clase.direccion;
                      //  Nodo.hijos[0].clase.Lfalse=Nodo.clase.Lfalse;
                        //Nodo.hijos[0].clase.tipo=Nodo.clase.tipo;
                        this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                        let codigo0=Nodo.hijos[0].clase.codigo;
                        this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                        let codigo2=Nodo.hijos[2].clase.codigo;
                        let direccion2=Nodo.hijos[2].clase.direccion;

                        /** */
                        ptr=ptr+tbs.tamanio;
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                        let codigo9="ptr=ptr+"+tbs.tamanio+";\n";
                        this.TamanioAmbito(Nodo.hijos[4],tbsLocal);
                        /** */
                        this.Recorre(Nodo.hijos[4],tbsLocal,ptr,lt,lf);
                        let codigo4=Nodo.hijos[4].clase.codigo;
                        /** */
                        let codigo10="ptr=ptr-"+tbs.tamanio+";\n";
                        ptr=ptr-tbs.tamanio;
                        /** */
                        let L0=this.nuevaLabel();
                        let L1=this.nuevaLabel();
                        let direccion=Nodo.clase.direccion;
                            codigo+=codigo0+Nodo.hijos[0].clase.Ltrue+":\n"+codigo2+"if ("+direccion+"=="+direccion2+") goto "+L0+";\n"+"goto "+L1+";\n";
                            codigo+=L0+":\n"+codigo9+codigo4+codigo10;
                        
                        Nodo.clase.Ltrue=L1;
                        Nodo.clase.codigo=codigo;
                    }
                    break;
                    case "Ndefault":
                        if(Nodo.hijos.length==3){

                              /** */
                        ptr=ptr+tbs.tamanio;
                        let tabla=[];
                        let tbsLocal={tabla:tabla,padre:tbs,tamanio:0,actual:0}
                        let codigo4="ptr=ptr+"+tbs.tamanio+";\n";
                        this.TamanioAmbito(Nodo.hijos[2],tbsLocal);
                        /** */
                        this.Recorre(Nodo.hijos[2],tbsLocal,ptr,lt,lf);
                        /** */
                        let codigo5="ptr=ptr-"+tbs.tamanio+";\n";
                        ptr=ptr-tbs.tamanio;
                        /** */
                        Nodo.clase.codigo=codigo4+Nodo.hijos[2].clase.codigo+codigo5;
                        }else{

                          Nodo.clase.codigo="";
                        }
                      break;
                  case "Aumento":
                      if(Nodo.hijos.length==3){
                          let codigo="";
                          let id=Nodo.hijos[0].valor.toLowerCase();
                          let dir=this.getDireccionId(id,tbs,ptr);
                          let t1=this.nuevoTemp();
                          codigo+=t1+"=stack["+dir+"];\n";
                          codigo+=t1+"="+t1+"+1;\n";
                          codigo+="stack["+dir+"]="+t1+";\n";
                          Nodo.clase.codigo=codigo;
                      }

                    break;
                  case "Decremento":
                    if(Nodo.hijos.length==3){
                      let codigo="";
                      let id=Nodo.hijos[0].valor.toLowerCase();
                      let dir=this.getDireccionId(id,tbs,ptr);
                      let t1=this.nuevoTemp();
                      codigo+=t1+"=stack["+dir+"];\n";
                      codigo+=t1+"="+t1+"-1;\n";
                      codigo+="stack["+dir+"]="+t1+";\n";
                      Nodo.clase.codigo=codigo;
                    }
                    break;
                  case "Param":
                        if(Nodo.hijos.length==3){
                            this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                            let id=Nodo.hijos[0].valor;
                            let tipo=Nodo.hijos[2].valor;
                            let codigo="";
                            if(tipo=="number"){
                              let t1=this.nuevoTemp();
                              codigo+=t1+"=ptr+"+tbs.actual+";\n";
                              codigo+="stack[(int)"+t1+"]=0;\n";                          
                              this.declararSinExp(id,tipo,"let",tbs);
                              tbs.actual+=1;
                              Nodo.clase.codigo=codigo;  
                            }else if(tipo=="boolean"){ 
                              let t1=this.nuevoTemp();
                              codigo+=t1+"=ptr+"+tbs.actual+";\n";
                              codigo+="stack[(int)"+t1+"]=0;\n";                          
                              this.declararSinExp(id,tipo,"let",tbs);
                              tbs.actual+=1;
                              Nodo.clase.codigo=codigo;
                            }else if(tipo=="string"){
                              let temp1=this.nuevoTemp();
                              codigo+=temp1+"=h;\n";
                              codigo+="heap[(int)h]=0;\n";
                              codigo+="h=h+1;\n";
                              codigo+="heap[(int)h]=-1;\n";
                              codigo+="h=h+1;\n";
                              let t1=this.nuevoTemp();
                              codigo+=t1+"=ptr+"+tbs.actual+";\n";
                              codigo+="stack[(int)"+t1+"]="+temp1+";\n";                          
                              this.declararSinExp(id,tipo,"let",tbs);
                              tbs.actual+=1;
                              Nodo.clase.codigo=codigo;

                            }
                        }else if(Nodo.hijos.length==5){

                          this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                          this.Recorre(Nodo.hijos[4],tbs,ptr,lt,lf);
                          let id=Nodo.hijos[2].valor;
                          let tipo=Nodo.hijos[4].valor;
                          let codigo="";
                          if(tipo=="number"){
                            let t1=this.nuevoTemp();
                            codigo+=t1+"=ptr+"+tbs.actual+";\n";
                            codigo+="stack[(int)"+t1+"]=0;\n";                          
                            this.declararSinExp(id,tipo,"let",tbs);
                            tbs.actual+=1;
                            Nodo.clase.codigo=codigo;  
                          }else if(tipo=="boolean"){
                            let t1=this.nuevoTemp();
                            codigo+=t1+"=ptr+"+tbs.actual+";\n";
                            codigo+="stack[(int)"+t1+"]=0;\n";                          
                            this.declararSinExp(id,tipo,"let",tbs);
                            tbs.actual+=1;
                            Nodo.clase.codigo=codigo;
                          }else if(tipo=="string"){
                            let temp1=this.nuevoTemp();
                            codigo+=temp1+"=h;\n";
                            codigo+="heap[(int)h]=0;\n";
                            codigo+="h=h+1;\n";
                            codigo+="heap[(int)h]=-1;\n";
                            codigo+="h=h+1;\n";
                            let t1=this.nuevoTemp();
                            codigo+=t1+"=ptr+"+tbs.actual+";\n";
                            codigo+="stack[(int)"+t1+"]="+temp1+";\n";                          
                            this.declararSinExp(id,tipo,"let",tbs);
                            tbs.actual+=1;
                            Nodo.clase.codigo=codigo;

                          }
                        }
                    break; 
                    
                  case "Lparam":
                        if(Nodo.hijos.length==1){
                            this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                            Nodo.valores=[];
                            Nodo.clase.codigo=Nodo.hijos[0].clase.codigo;
                            Nodo.valores.push(Nodo.hijos[0].clase.direccion);
                        }else if(Nodo.hijos.length==3){
                              Nodo.valores=[];
                              this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                              let codigo1=Nodo.hijos[0].clase.codigo;
                              for(let item of Nodo.hijos[0].valores){
                                    Nodo.valores.push(item);
                              }
                              this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                              Nodo.valores.push(Nodo.hijos[2].clase.direccion);
                              Nodo.clase.codigo=codigo1+Nodo.hijos[2].clase.codigo;  
                        }
                    break;  
                case "AsignaFor":
                        if(Nodo.hijos.length==3){
                          this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                          let codigo1=Nodo.hijos[2].clase.codigo;
                          let direccion1=Nodo.hijos[2].clase.direccion;
                          let codigo="";
                          let id=Nodo.hijos[0].valor.toLowerCase();
                          codigo+="stack[(int)"+this.getDireccionId(id,tbs,ptr)+"]="+direccion1+";\n";

                          Nodo.clase.codigo=codigo1+codigo;
                        }else if(Nodo.hijos.length==6){
                          //this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                          this.Recorre(Nodo.hijos[3],tbs,ptr,lt,lf);
                          this.Recorre(Nodo.hijos[5],tbs,ptr,lt,lf);
                          let id=Nodo.hijos[1].valor.toLowerCase();
                          let tipo=Nodo.hijos[3].valor.toLowerCase();
                          let codigo="";
                          if(tipo=="number"){
                            let codigo1=Nodo.hijos[5].clase.codigo;
                            let direccion1=Nodo.hijos[5].clase.direccion;
                            let t1=this.nuevoTemp();
                            codigo+=t1+"=ptr+"+tbs.actual+";\n";
                            codigo+="stack[(int)"+t1+"]="+direccion1+";\n";
                            //codigo+="stack[(int)ptr+"+tbs.actual+"]="+direccion1+";\n";                          
                            this.declararSinExp(id,tipo,"let",tbs);
                            tbs.actual+=1;
                            Nodo.clase.codigo=codigo1+codigo;  
                          }else if(tipo=="boolean"){
                            let codigo1=Nodo.hijos[5].clase.codigo;
                            let direccion1=Nodo.hijos[5].clase.direccion;
                            let t1=this.nuevoTemp();
                            codigo+=t1+"=ptr+"+tbs.actual+";\n";
                            codigo+="stack[(int)"+t1+"]="+direccion1+";\n";
                            //codigo+="stack[(int)ptr+"+tbs.actual+"]="+direccion1+";\n";                          
                            this.declararSinExp(id,tipo,"let",tbs);
                            tbs.actual+=1;
                            Nodo.clase.codigo=codigo1+codigo;
                          }else if(tipo=="string"){
                            let codigo1=Nodo.hijos[5].clase.codigo;
                            let direccion1=Nodo.hijos[5].clase.direccion;
                            let t1=this.nuevoTemp();
                            codigo+=t1+"=ptr+"+tbs.actual+";\n";
                            codigo+="stack[(int)"+t1+"]="+direccion1+";\n";
                            //codigo+="stack[(int)ptr+"+tbs.actual+"]="+direccion1+";\n";                          
                            this.declararSinExp(id,tipo,"let",tbs);
                            tbs.actual+=1;
                            Nodo.clase.codigo=codigo1+codigo; 
                          }  

                        }
                  break;
                case "insfor":
                        if(Nodo.hijos.length==1){
                            this.Recorre(Nodo.hijos[0],tbs,ptr,lt,lf);
                            Nodo.clase.codigo=Nodo.hijos[0].clase.codigo;
                        }else if(Nodo.hijos.length==3){
                          this.Recorre(Nodo.hijos[2],tbs,ptr,lt,lf);
                          let codigo1=Nodo.hijos[2].clase.codigo;
                          let direccion1=Nodo.hijos[2].clase.direccion;
                          let codigo="";
                          let id=Nodo.hijos[0].valor.toLowerCase();
                          codigo+="stack[(int)"+this.getDireccionId(id,tbs,ptr)+"]="+direccion1+";\n";

                          Nodo.clase.codigo=codigo1+codigo;
                        }
                  break;  
        }


  }


  getDireccionId(id,tbs,ptr):number{
    let temp=ptr;
    let posicion=0;
    let encontrado=false;
    let padre=tbs;
    while(padre!=null){
      for(let item of padre.tabla){
        if(id==item.nombre.toLowerCase()&&(item.rol=="let"||item.rol=="const")){
            encontrado=true;
            posicion=temp+item.direccion;
            break;
        }
      }
      if(encontrado){
          break;
      }
      padre=padre.padre;
      if(padre!=null){
        temp=temp-padre.tamanio;
      }  
    }
      
    return posicion;
  }


  getTipoId(id,tbs,ptr):string{
    let tipo="";
    let encontrado=false;
    let padre=tbs;
    while(padre!=null){
      for(let item of padre.tabla){
        if(id==item.nombre.toLowerCase()&&(item.rol=="let"||item.rol=="const")){
            encontrado=true;
            tipo=item.tipo;
            break;
        }
      }
      if(encontrado){
          break;
      }
      padre=padre.padre;
        
    }
      
    return tipo;
  }



 TamanioAmbito(Nodo,tbs){
      switch(Nodo.nombre){

          case "ini":
            this.TamanioAmbito(Nodo.hijos[0],tbs);
           
            break;

          case "BloqueIns":
              if(Nodo.hijos.length==3){
                  this.TamanioAmbito(Nodo.hijos[1],tbs);
              }
            break;

          case "instrucciones":

                if(Nodo.hijos.length==1){
                    this.TamanioAmbito(Nodo.hijos[0],tbs);
                    
                }else if(Nodo.hijos.length==2){
                    this.TamanioAmbito(Nodo.hijos[0],tbs);
                    this.TamanioAmbito(Nodo.hijos[1],tbs);
                    
                }

            break;
          case "instruccion":
                if(Nodo.hijos[0].nombre=="DecLet"){
                  this.TamanioAmbito(Nodo.hijos[0],tbs);
                 
                }else if(Nodo.hijos[0].nombre=="DecConst"){
                  
                  this.TamanioAmbito(Nodo.hijos[0],tbs);
                }else if(Nodo.hijos[0].nombre=="Rreturn"){
                    if(Nodo.hijos.length==2){

                    }else if(Nodo.hijos.length==3){
                        tbs.tamanio=tbs.tamanio+1;
                    }
                }

            break;
          
          case "DecLet":
                this.TamanioAmbito(Nodo.hijos[1],tbs);
                
            break;
          case "Lasig":
              if(Nodo.hijos.length==1){
                  this.TamanioAmbito(Nodo.hijos[0],tbs);
                  
              }else if(Nodo.hijos.length==3){
                  this.TamanioAmbito(Nodo.hijos[0],tbs);
                  this.TamanioAmbito(Nodo.hijos[2],tbs);
              }
            break;
          case "IA":
              if(Nodo.hijos.length==3){
                  tbs.tamanio=tbs.tamanio+1;
                  
              }else if(Nodo.hijos.length==5){
                  tbs.tamanio=tbs.tamanio+1;
                 
              }
            break;
          case "DecConst":
                this.TamanioAmbito(Nodo.hijos[1],tbs);
            break;
          case "Lconst":
              if(Nodo.hijos.length==1){
                this.TamanioAmbito(Nodo.hijos[0],tbs);
              }else if(Nodo.hijos.length==3){
                this.TamanioAmbito(Nodo.hijos[0],tbs);
                this.TamanioAmbito(Nodo.hijos[2],tbs);
              }
            break;
          
          case "CA":
              tbs.tamanio=tbs.tamanio+1;
            break; 

          case "AsignaFor":
              if(Nodo.hijos.length==6){
                tbs.tamanio=tbs.tamanio+1;
              }
            break;  
            
      }

 } 
        

nuevoTemp():string{
  this.contador++;
  return "t"+this.contador;
}

nuevaLabel():string{
  this.contador2++;
  return "L"+this.contador2;
}

getConcatenarCadenas(temp1,direccion1,direccion2):string{
  let codigo="";
  codigo+=temp1+"=h;\n";
  
  let temp2=this.nuevoTemp();
  let temp3=this.nuevoTemp();

  let l1= this.nuevaLabel();
  
  codigo+=temp2+"="+direccion1+";\n";
  codigo+=temp3+"="+direccion2+";\n";

  codigo+=l1+":\n";
  codigo+="heap[(int)h]=heap[(int)"+temp2+"];\n";
  codigo+=temp2+"="+temp2+"+1;\n";
  codigo+="h=h+1;\n";
  codigo+="if(heap[(int)"+temp2+"]!=-1) goto "+l1+";\n";
  let l2= this.nuevaLabel();
  codigo+=l2+":\n";
  codigo+="heap[(int)h]=heap[(int)"+temp3+"];\n";
  codigo+=temp3+"="+temp3+"+1;\n";
  codigo+="h=h+1;\n";
  codigo+="if(heap[(int)"+temp3+"]!=-1) goto "+l2+";\n";
  codigo+="heap[(int)h]=-1;\n";
  codigo+="h=h+1;\n";
  return codigo;
}


getCodigoCadena(temp1,cadena):string{
  let codigo="";
  codigo+=temp1+"=h;\n";  
  
  for(let item of cadena){
    let tmpActual=this.nuevoTemp();
    codigo+=tmpActual+"=h;\n";
    codigo+="heap[(int)"+tmpActual+"]="+item.charCodeAt(0)+";\n";
    codigo+="h=h+1;\n";
  }

  codigo+="heap[(int)h]=-1;\n";
  codigo+="h=h+1;\n";
  return codigo;
}


getIgualstring(ltrue,lfalse,dir1,dir2):string{
  let codigo="";
  let t0=this.nuevoTemp();
  codigo+=t0+"="+dir1+";\n";
  let tr=this.nuevoTemp();
  codigo+=tr+"=0;\n";
  let c0=this.nuevoTemp();
  codigo+=c0+"=0;\n"
  let L0=this.nuevaLabel();
  codigo+=L0+":\n";
  let t1=this.nuevoTemp();
  codigo+=t1+"="+t0+";\n";
  codigo+=t0+"="+t0+"+1;\n";
  codigo+=c0+"="+c0+"+1;\n";
  codigo+="if(heap[(int)"+t1+"]!=-1) goto "+L0+";\n";
  let t2=this.nuevoTemp();
  codigo+=t2+"="+dir2+";\n";
  let c1=this.nuevoTemp();
  codigo+=c1+"=0;\n"
  let L1=this.nuevaLabel();
  codigo+=L1+":\n";
  let t3=this.nuevoTemp();
  codigo+=t3+"="+t2+";\n";
  codigo+=t2+"="+t2+"+1;\n";
  codigo+=c1+"="+c1+"+1;\n";
  codigo+="if(heap[(int)"+t3+"]!=-1) goto "+L1+";\n";
  let L2=this.nuevaLabel();
  codigo+="if("+c0+"=="+c1+") goto "+L2+";\n";
  let L6=this.nuevaLabel();
  codigo+="goto "+L6+";\n";
  codigo+=L2+":\n"; 
  let t4=this.nuevoTemp();
  let t6=this.nuevoTemp();
  codigo+=t4+"="+dir1+";\n";
  codigo+=t6+"="+dir2+";\n";
  let L3=this.nuevaLabel();
  codigo+=L3+":\n";
  let t5=this.nuevoTemp();
  let t7=this.nuevoTemp();
  codigo+=t5+"="+t4+";\n";
  codigo+=t4+"="+t4+"+1;\n";
  codigo+=t7+"="+t6+";\n";
  codigo+=t6+"="+t6+"+1;\n";
  let L4=this.nuevaLabel();
  let L7=this.nuevaLabel();
  codigo+="if (heap[(int)"+t5+"]!=-1) goto "+L4+";\n";
  codigo+="goto "+L7+";\n";
  codigo+=L4+":\n";
  codigo+="if(heap[(int)"+t5+"]!=heap[(int)"+t7+"]) goto "+L6+";\n";
  codigo+="goto "+L3+";\n";
  codigo+=L6+":\n";
  codigo+=tr+"=1;\n";
  codigo+=L7+":\n";
  codigo+="if((int)"+tr+"==0) goto "+ltrue+";\n";
  codigo+="goto "+lfalse+";\n";

  return codigo;
}

getCodigoNumero(tmpReturn,tmpIni):string{
  let codigo="";
  let dato=this.nuevoTemp();
  let Lm=this.nuevaLabel();
  let Ln=this.nuevaLabel();
  let Ls=this.nuevaLabel();
  codigo+="if("+tmpIni+"<0) goto"+ Lm+";\n goto"+Ln+";\n";
  codigo+=Lm+":\n";
  let tr=this.nuevoTemp();
  codigo+=tr+"=-1;\n";
  let ts=this.nuevoTemp();
  codigo+=ts+"="+tmpIni+"*"+tr+";\n";
  codigo+=tmpIni+"="+ts+";\n";
  codigo+=tmpReturn+"=h;\n"
  codigo+="heap[(int)h]=45;\n";
  codigo+="h=h+1;\n goto"+Ls+";\n";
  codigo+=Ln+":\n";
  codigo+=tmpReturn+"=h;\n"
  codigo+=Ls+":\n";
  codigo+=dato+"=(int)"+tmpIni+";\n";
  let dato1=this.nuevoTemp();
  codigo+=dato1+"=fmod("+tmpIni+","+dato+")*1000;\n";
 // let t0=this.nuevoTemp();
  let t1=this.nuevoTemp();
  let t2=this.nuevoTemp();
  let t3=this.nuevoTemp();
  let t4=this.nuevoTemp();
  let t5=this.nuevoTemp();
  //let t6=this.nuevoTemp();
  let contador=this.nuevoTemp();

  let L0= this.nuevaLabel();
  let L1= this.nuevaLabel();
  let L2= this.nuevaLabel();
  let L3= this.nuevaLabel();
  let L4= this.nuevaLabel();
  let L5= this.nuevaLabel();

  let L10= this.nuevaLabel();
  let L11= this.nuevaLabel();
  let L12= this.nuevaLabel();
  let L13= this.nuevaLabel();
  let L14= this.nuevaLabel();
  let L15= this.nuevaLabel();
  
  codigo+=L0+":\n";
  codigo+=t5+"="+dato+";\n";
  codigo+=t2+"=0;\n";
  codigo+=t1+"=0;\n";
  codigo+=contador+"=0;\n";
  codigo+=t3+"=0;\n";
  codigo+=t4+"=0;\n";
  codigo+=L1+":\n";
  codigo+=t2+"="+t1+";\n";
  codigo+=t1+"=(int)"+t5+"/10;\n";
  codigo+="if((int)"+t1+"==0) goto "+L4+";\n";
  codigo+=L2+":\n";
  codigo+=t5+"="+t1+";\n";
  codigo+=contador+"="+contador+"+1;\n";
  codigo+="if((int)"+t1+"!=0) goto "+L1+";\n";
  codigo+=contador+"="+contador+"-1;\n";
  codigo+="if("+contador+"==0) goto "+L5+";\n";
  codigo+=L3+":\n";
  codigo+=contador+"="+contador+"-1;\n";
  codigo+=t3+"="+t2+"*10;\n";
  codigo+=t2+"="+t3+";\n";
  codigo+="if((int)"+contador+"!=0) goto "+L3+";\n";
  codigo+=t4+"=(int)"+dato+"-"+t3+";\n";
  codigo+=dato+"="+t4+";\n";
  codigo+="if((int)"+t4+"!=0) goto "+L0+";\n";
  codigo+=L4+":\n";
  codigo+="heap[(int)h]="+t5+"+48;\n";
  codigo+="h=h+1;\n";
  codigo+="goto "+L2+";\n";
  codigo+=L5+":\n";
  codigo+="heap[(int)h]=46;\n";
  codigo+="h=h+1;\n";

  codigo+=L10+":\n";
  codigo+=t5+"="+dato1+";\n";
  codigo+=t2+"=0;\n";
  codigo+=t1+"=0;\n";
  codigo+=contador+"=0;\n";
  codigo+=t3+"=0;\n";
  codigo+=t4+"=0;\n";
  codigo+=L11+":\n";
  codigo+=t2+"="+t1+";\n";
  codigo+=t1+"=(int)"+t5+"/10;\n";
  codigo+="if((int)"+t1+"==0) goto "+L14+";\n";
  codigo+=L12+":\n";
  codigo+=t5+"="+t1+";\n";
  codigo+=contador+"="+contador+"+1;\n";
  codigo+="if((int)"+t1+"!=0) goto "+L11+";\n";
  codigo+=contador+"="+contador+"-1;\n";
  codigo+="if("+contador+"==0) goto "+L15+";\n";
  codigo+=L13+":\n";
  codigo+=contador+"="+contador+"-1;\n";
  codigo+=t3+"="+t2+"*10;\n";
  codigo+=t2+"="+t3+";\n";
  codigo+="if((int)"+contador+"!=0) goto "+L13+";\n";
  codigo+=t4+"=(int)"+dato1+"-"+t3+";\n";
  codigo+=dato1+"="+t4+";\n";
  codigo+="if((int)"+t4+"!=0) goto "+L10+";\n";
  codigo+=L14+":\n";
  codigo+="heap[(int)h]="+t5+"+48;\n";
  codigo+="h=h+1;\n";
  codigo+="goto "+L12+";\n";
  codigo+=L15+":\n";
  codigo+="heap[(int)h]=-1;\n";
  codigo+="h=h+1;\n";


  return codigo;
}


declararSinExp(id,tipo,rol,tbs){

    tbs.tabla.push({nombre:id,tipo:tipo,rol:rol,direccion:tbs.actual});
}

getNodofuncion(id){
  let Nodo=null;
  
  for(let item of this.tbGlobal.tabla){
      if(item.nombre.toLowerCase()==id){
          Nodo=item.nodo;
          break;        
      }

  }
  return Nodo;
}


getTipofuncion(id){
  let tipo="";
  
  for(let item of this.tbGlobal.tabla){
      if(item.nombre.toLowerCase()==id){
          tipo=item.tipo;
          break;        
      }

  }
  return tipo;
}

NumParametros(Nodo){
  if(Nodo.hijos.length==3){

    return 1;
  }else if(Nodo.hijos.length==5){
    return this.NumParametros(Nodo.hijos[0])+1;

  }
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


}
