import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptimizarService {

  constructor() { }


  listaOpt=[];
txtOptmizado:string="";


  Optimizar(codigo:string){

   let  linea =codigo.split("\n");
    
   for(let i=0;i<linea.length;i++){
    
      this.txtOptmizado+=this.OptimizarLinea(linea[i],i);
      

   }
   return this.txtOptmizado;
  }


  getListOpt(){

    return this.listaOpt;
  }

  



  
  OptimizarLinea(linea,fila):string{
    let txtlinea="";

    if(linea.includes("=")){
      
      let arrLinea=linea.split("=");
      let dir=arrLinea[0];
      let inst=arrLinea[1];
      if(inst.includes("+")){
        
        let operacion=inst.split("+");
        let op1=operacion[0];
        let op2=operacion[1].replace(";","");
        if(op1==dir){
        
          
            if(op2=="0"){
             
              txtlinea="";
              this.listaOpt.push({tipo:"bloque",regla:"regla 6",ce:linea,ca:"vacio",fila:fila});
            }else{

                txtlinea=linea+"\n";
            }
        }else{
         
          if(op2=="0"){
             
            txtlinea=arrLinea[0]+"="+op1+";\n";
            this.listaOpt.push({tipo:"bloque",regla:"regla 10",ce:linea,ca:txtlinea,fila:fila});
          }else{

              txtlinea=linea+"\n";
          }         
      
        }
      }else if(inst.includes("-")){
        
        let operacion=inst.split("-");
        let op1=operacion[0];
        let op2=operacion[1].replace(";","");
        if(op1==dir){
        
            if(op2=="0"){
              this.listaOpt.push({tipo:"bloque",regla:"regla 7",ce:linea,ca:"vacio",fila:fila});
              txtlinea="";
            }else{

                txtlinea=linea+"\n";
            }
        }else{
         
          if(op2=="0"){
             
            txtlinea=arrLinea[0]+"="+op1+";\n";
            this.listaOpt.push({tipo:"bloque",regla:"regla 11",ce:linea,ca:txtlinea,fila:fila});
          }else{

              txtlinea=linea+"\n";
          }         
      
        }
      }else if(inst.includes("*")){
        let operacion=inst.split("*");
        let op1=operacion[0];
        let op2=operacion[1].replace(";","");
        if(op1==dir){
            if(op2=="1"){
              txtlinea="";
              this.listaOpt.push({tipo:"bloque",regla:"regla 8",ce:linea,ca:"vacio",fila:fila});
            }else{

                txtlinea=linea+"\n";
            }
        }else{
          if(op2=="1"){
             
            txtlinea=arrLinea[0]+"="+op1+";\n";
            this.listaOpt.push({tipo:"bloque",regla:"regla 12",ce:linea,ca:txtlinea,fila:fila});
          }else if(op2=="2"){

            txtlinea=arrLinea[0]+"="+op1+"+"+op1+";\n";
            this.listaOpt.push({tipo:"bloque",regla:"regla 14",ce:linea,ca:txtlinea,fila:fila});
          }else if(op2=="0"){

            txtlinea=arrLinea[0]+"=0;\n";
            this.listaOpt.push({tipo:"bloque",regla:"regla 15",ce:linea,ca:txtlinea,fila:fila});

          }else{

            txtlinea=linea+"\n";
          }   
        }
      }else if(inst.includes("/")){
        let operacion=inst.split("/");
        let op1=operacion[0];
        let op2=operacion[1].replace(";","");
        if(op1==dir){
            if(op2=="1"){
              txtlinea="";
              this.listaOpt.push({tipo:"bloque",regla:"regla 9",ce:linea,ca:"vacio",fila:fila});
            }else{

                txtlinea=linea+"\n";
            }
        }else{
                //txtlinea=linea+"\n";
                if(op2=="1"){
             
                  txtlinea=arrLinea[0]+"="+op1+";\n";
                  this.listaOpt.push({tipo:"bloque",regla:"regla 13",ce:linea,ca:txtlinea,fila:fila});
                }else if(op1=="0"){
      
                  txtlinea=arrLinea[0]+"=0;\n";
                  this.listaOpt.push({tipo:"bloque",regla:"regla 16",ce:linea,ca:txtlinea,fila:fila});
                }else{
                  txtlinea=linea+"\n";
                } 
        }
      }else{

        txtlinea=linea+"\n";  
      }

    }else{
      txtlinea=linea+"\n";
    }

    return txtlinea;
  }

}



