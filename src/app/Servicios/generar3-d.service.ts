import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Generar3DService {

  constructor() { }

  generado:string;
  encabezado:string;
  contador:number=-1;
  contador2:number=-1;

  generar3D(Nodo):string{
    this.contador=-1;
    this.contador2=-1;
    this.generado="";
    this.Recorre(Nodo);
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

    this.encabezado+="double heap[1000];\n";
    this.encabezado+="double stack[1000];\n";
    this.encabezado+="double h;\n";
    this.encabezado+="double ptr;\n";
    this.encabezado+="int main(){\nh=0;\n ptr=0;\n";
    this.encabezado+=this.generado+"\n";
    this.encabezado+="return 0;\n}"
    return this.encabezado;
  }


  Recorre(Nodo){
        switch(Nodo.nombre){
            case "ini":
              this.Recorre(Nodo.hijos[0]);
              break;
            case "instrucciones":
                if(Nodo.hijos.length==1){
                    this.Recorre(Nodo.hijos[0]);
                }else if(Nodo.hijos.length==2){
                    this.Recorre(Nodo.hijos[0]);
                    this.Recorre(Nodo.hijos[1]);
                }
              break;
            case "instruccion":

              if(Nodo.hijos[0].nombre=="Rconsole"){
                  this.Recorre(Nodo.hijos[4]);
                  if(Nodo.hijos[4].clase.tipo=="number"){
                    let codigo="";
                    codigo+=Nodo.hijos[4].clase.codigo;
                    codigo+="printf(\"%lf\", (double)"+Nodo.hijos[4].clase.direccion+");\n";
                    codigo+="printf(\"\\n\");\n";
                    this.generado=codigo;
                  }else if(Nodo.hijos[4].clase.tipo=="string"){

                    let codigo="";
                    let temp1=this.nuevoTemp();
                    codigo+=temp1+"=(int)"+Nodo.hijos[4].clase.direccion+";\n"
                    let l1=this.nuevaLabel();
                    codigo+=l1+":\n";
                    let temp2=this.nuevoTemp();
                    codigo+=temp2+"=(int)heap[(int)"+temp1+"];\n"
                    codigo+="printf(\"%c\",(int)"+temp2+");\n";
                    codigo+=temp1+"="+temp1+"+1;\n";
                    codigo+="if(heap[(int)"+temp1+"]!=-1) goto "+l1+";\n";
                    codigo+="printf(\"\\n\");\n";
                    this.generado+=Nodo.hijos[4].clase.codigo+codigo;

                  }else if(Nodo.clase.tipo=="boolean"){

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
                  Nodo.clase.direccion=Nodo.hijos[0].valor;
                  Nodo.clase.tipo="boolean";  
                }else if(Nodo.hijos[0].nombre=="Rfalse"){
                  Nodo.clase.codigo="";
                  Nodo.clase.direccion=Nodo.hijos[0].valor;
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

                }
                
              }else if(Nodo.hijos.length==2){
                  
              }else if(Nodo.hijos.length==3){
                  if(Nodo.hijos[1].nombre=="mas"){

                      this.Recorre(Nodo.hijos[0]);
                      this.Recorre(Nodo.hijos[2]);


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
                            direccion2=temp2;
                            let codigo2=this.getCodigoCadena(temp2,cadena2);

                            let direccion="";
                            let tempres=this.nuevoTemp();
                            direccion=tempres;
                            
                            Nodo.clase.codigo=codigo1+codigo2+this.getConcatenarCadenas(tempres,direccion1,direccion2);
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

                              let direccion="";
                              let temp1=this.nuevoTemp();
                              direccion=temp1;

                              let cadena2=String(Nodo.hijos[2].clase.direccion);
                              let temp2=this.nuevoTemp();
                              let direccion2=temp2;
                              let codigo2= this.getCodigoCadena(temp2,cadena2);

                              
                              Nodo.clase.codigo=codigo1+codigo2+this.getConcatenarCadenas(temp1,direccion1,direccion2);
                              Nodo.clase.direccion=direccion;
                              Nodo.clase.tipo="string";


                      }
                      else if(Nodo.hijos[0].clase.tipo=="boolean"&&Nodo.hijos[2].clase.tipo=="string"){

                              let cadena1 = String(Nodo.hijos[0].clase.direccion);
                              let temp1=this.nuevoTemp();
                              let codigo1=  this.getCodigoCadena(temp1,cadena1);;
                              let direccion1=temp1;
                              
                              let codigo2= Nodo.hijos[2].clase.codigo;
                              let direccion2=Nodo.hijos[2].clase.direccion;
                              
                              let direccion="";
                              let temp2=this.nuevoTemp();
                              direccion=temp2;
                              
                              Nodo.clase.codigo=codigo1+codigo2+this.getConcatenarCadenas(temp2,direccion1,direccion2);
                              Nodo.clase.direccion=direccion;
                              Nodo.clase.tipo="string";



                      }else{

                        let temp1=this.nuevoTemp();
                        let codigo1=  Nodo.hijos[0].clase.codigo;
                        let codigo2= Nodo.hijos[2].clase.codigo;
                        let direccion1=Nodo.hijos[0].clase.direccion;
                        let direccion2=Nodo.hijos[2].clase.direccion;

                       if(Nodo.hijos[0].clase.tipo=="boolean"){
                            if(String(direccion1).toLowerCase()=="true"){
                                direccion1="1";
                            }else if(String(direccion1).toLowerCase()=="false"){
                                direccion1="0";
                            }
                        }
                        if(Nodo.hijos[2].clase.tipo=="boolean"){
                          if(String(direccion2).toLowerCase()=="true"){
                            direccion2="1";
                        }else if(String(direccion2).toLowerCase()=="false"){
                            direccion2="0";
                        }
                        }  

                        
                        Nodo.clase.codigo=codigo1+codigo2+temp1+"="+direccion1+"+"+direccion2+";\n";
                        Nodo.clase.direccion=temp1;
                        Nodo.clase.tipo="number";
                      }
                      
                  
                    }else if(Nodo.hijos[1].nombre=="menos"){
                    this.Recorre(Nodo.hijos[0]);
                    this.Recorre(Nodo.hijos[2]);
                    Nodo.clase.direccion=this.nuevoTemp();  
                    Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo+Nodo.clase.direccion+"="+Nodo.hijos[0].clase.direccion+"-"+Nodo.hijos[2].clase.direccion+";\n";
                    Nodo.clase.tipo="number";  
                  }else if(Nodo.hijos[1].nombre=="por"){
                    this.Recorre(Nodo.hijos[0]);
                    this.Recorre(Nodo.hijos[2]);
                    Nodo.clase.direccion=this.nuevoTemp();  
                    Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo+Nodo.clase.direccion+"="+Nodo.hijos[0].clase.direccion+"*"+Nodo.hijos[2].clase.direccion+";\n";
                    Nodo.clase.tipo="number";
                  }else if(Nodo.hijos[1].nombre=="div"){
                  this.Recorre(Nodo.hijos[0]);
                  this.Recorre(Nodo.hijos[2]);
                  Nodo.clase.direccion=this.nuevoTemp();  
                  Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo+Nodo.clase.direccion+"="+Nodo.hijos[0].clase.direccion+"/"+Nodo.hijos[2].clase.direccion+";\n";
                  Nodo.clase.tipo="number";  
                }else if(Nodo.hijos[1].nombre=="mod"){
                  this.Recorre(Nodo.hijos[0]);
                  this.Recorre(Nodo.hijos[2]);
                  Nodo.clase.direccion=this.nuevoTemp();  
                  Nodo.clase.codigo=Nodo.hijos[0].clase.codigo+Nodo.hijos[2].clase.codigo+Nodo.clase.direccion+"=fmod("+Nodo.hijos[0].clase.direccion+","+Nodo.hijos[2].clase.direccion+");\n";
                  Nodo.clase.tipo="number";  
                }else if(Nodo.hijos[1].nombre=="pot"){
                      let codigo="";
                      this.Recorre(Nodo.hijos[0]);
                      this.Recorre(Nodo.hijos[2]);
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
                  }
              }else if(Nodo.hijos.length==4){

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


getCodigoNumero(tmpReturn,tmpIni):string{
  let codigo="";
  let dato=this.nuevoTemp();
  codigo+=tmpReturn+"=h;\n"
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
  codigo+="heap[(int)h]="+t5+"+'0';\n";
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
  codigo+="heap[(int)h]="+t5+"+'0';\n";
  codigo+="h=h+1;\n";
  codigo+="goto "+L12+";\n";
  codigo+=L15+":\n";
  codigo+="heap[(int)h]=-1;\n";
  codigo+="h=h+1;\n";


  return codigo;
}





}
