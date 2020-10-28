/**
 * Ejemplo mi primer proyecto con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
/*
function imprimir(nombre){
    console.log(nombre);
}*/
%{

var listaErrores=[];
var idg=0;
var linea=0;
var columna=0;


class Nodo{
	constructor(cod,direc,tip){
		this.codigo=cod;
		this.direccion=direc;
		this.tipo=tip;
	}
}


%}

%lex


%options case-insensitive



cadena					\"([^\"]|[ntr])*\";
cadenaSimple			\'([^\']|[ntr])*\';

entero					[0-9]+\b ;               	
decimal 				[0-9]+("."[0-9]+)?\b;
//id						[a-zA-Z]+("_"|[a-zA-AZ]|[0-9])*\b;
letra				[a-zñA-ZÑ_ñÑáéíóúÁÉÍÓÚâêîôûäëïöüÂÊÎÔÛÄËÏÖÜ]
id					({letra})({letra}|{decimal})*



%x string
%%



\s+								// se ignoran espacios en blanco
[ \r\t]+            {}
\n                  {}
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

//[^"`"]* 							return 'todo';



";"                 return 'ptycoma';
":"					return 'dosP';
"=="				return 'dbigual';
"**"                return 'pot';
"="					return 'igual';
"."					return 'punto';
","					return 'coma';
"("                 return 'pIzq';
")"                 return 'pDer';
"["                 return 'cIzq';
"]"                 return 'cDer';
"{"					return 'llIzq';
"}"					return 'llDer';
"+"                 return 'mas';
"-"                 return 'menos';
"*"                 return 'por';
"/"                 return 'div';
"%"					return 'mod';
"<="				return 'menorq';
">="				return 'mayorq';
"<"					return 'menor';
">"					return 'mayor';
"`"					return 'agudo';



"?"					return 'ternario';

"$"					return 'dolar';

"!="				return 'difer';
"!"					return 'neg';
"||"				return 'or';
"&&"				return 'and';


//'console.log'		return 'miconsole';
"null"				return 'Rnull';
"break"				return 'Rbreak';
"return"			return 'Rreturn';
"if"				return 'Rif';
"else"				return 'Relse';
"for"				return 'Rfor';
"of"				return 'Rof';
"in"				return 'Rin';
"while"				return 'Rwhile';
"do"				return 'Rdo';
"continue"			return 'Rcontinue';
"function"			return 'Rfunction';
"string"			return 'Rstring';
"boolean"			return 'Rboolean';
"number"			return 'Rnumber';
"type"				return 'Rtype';
"void"				return 'Rvoid';
"true"				return 'Rtrue';
"false"				return 'Rfalse';
"default"			return 'Rdefault';
"switch"			return 'Rswitch';
"case"				return 'Rcase';
"let"				return 'Rlet';
"const"				return 'Rconst';
"console"			return 'Rconsole';
"log"				return 'Rlog';
'push'				return 'Rpush';
'pop'				return 'Rpop';
'length'			return 'Rlength';
'graficar_ts'		return 'Rgraficar';


/* Espacios en blanco */


{cadenar}								{yytext=yytext.substr(1,yyleng-2);return 'cadenar'}
{cadena}								{yytext=yytext.substr(1,yyleng-2);return 'cadena'}
{cadenaSimple}							{yytext=yytext.substr(1,yyleng-2);return 'cadenaSimple'}
{decimal}								return 'decimal';
{entero}								return 'entero';
{id}									return 'id';

<<EOF>>								return 'EOF';

.                       { 
	console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
	listaErrores.push({tipo:'Error Léxico',valor:yytext,descripcion:"Token no reconocido en la gramatica",linea:yylloc.first_line,columna:yylloc.first_column});
	return {nombre:"error",lista:listaErrores};
	}
/lex

/* Asociación de operadores y precedencia */





%left 'Relse'
%left 'or'
%left 'and'
%left ternario
%left 'difer' ,'dbigual'
%left 'menor' ,'mayor' ,'menorq' ,'mayorq' 

%left 'mas', 'menos'
%left 'por', 'div' ,'mod'
%left 'pot'
%right 'neg'
%left UMENOS







%start ini

%% /* Definición de la gramática */



ini: instrucciones EOF 	
	{
		var lista=[];
		lista.push($1);
		let n1=new Nodo();	
		var ini={
				nombre:"ini",
				tipo:"noterminal",
				nodo:"nodo"+idg,clase:n1,
				linea:this._$.first_line,
				columna:this._$.first_column,
				hijos:lista
		}
		idg++;
		$$=ini;
		return $$;
	};

instrucciones:  instruccion instrucciones
	{ 
		var lista=[];
		lista.push($1);
		lista.push($2);
		let n2=new Nodo();	
		var instrucciones={
			nombre:"instrucciones",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n2,
			return:"",
			linea:this._$.first_line,
			columna:this._$.first_column,
			hijos:lista
		}
		idg++;
		$$=instrucciones;
	
	}  
|instruccion
	{
		var lista=[];
		lista.push($1);
		let n3=new Nodo();	
		var instrucciones={
			nombre:"instrucciones",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n3,
			linea:this._$.first_line,
			columna:this._$.first_column,
			hijos:lista
		}
		idg++;
		$$=instrucciones;
	}
	| error { 
		console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
		listaErrores.push({tipo:'Error Sintáctico ',valor:yytext,descripcion:"Token no esperado",linea:this._$.first_line,columna:this._$.first_column});
		return {nombre:"error",lista:listaErrores};
		 }
	;	




instruccion:
		DecLet
			{
			var lista=[];
			let n4=new Nodo();	
				lista.push($1);
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n4,
					linea:this._$.first_line,
					columna:this._$.first_column,	
					hijos:lista
				}
				idg++;
				$$=instruccion;	
			}
		|DecConst
			{
			var lista=[];
			let n5=new Nodo();	
				lista.push($1);
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n5,
					linea:this._$.first_line,
					columna:this._$.first_column,	
					hijos:lista
				}
				idg++;
				$$=instruccion;	
			}

		|id igual Exp ptycoma											//id asignacion

			{
				var lista=[];
				let n6=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;


				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push($3);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n6,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|id cIzq Exp cDer igual Exp ptycoma
			{							
				var lista=[];
				let n7=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;

				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push($3);
				lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
				idg++;
				lista.push($6);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$7,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n7,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|Rfunction id pIzq Param pDer dosP Ntipo BloqueIns				//funciones
			{
				var lista=[];
				let n8=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;

				lista.push({nombre:"Rfunction",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				lista.push($4);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$6,linea:linea,columna:columna});
				idg++;
				lista.push($7);
				lista.push($8);

				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n8,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rfunction id pIzq pDer dosP Ntipo BloqueIns					//funciones sin param
			{
				var lista=[];
				let n9=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rfunction",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
				idg++;
				lista.push($6);
				lista.push($7);

				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n9,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		
		|Rreturn ptycoma												// return 
			{
				var lista=[];
				let n10=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rreturn",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n10,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rreturn Exp ptycoma											//return exp
			{
				var lista=[];
				let n11=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rreturn",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n11,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rbreak ptycoma													//break
			{
				var lista=[];
				let n12=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				
				lista.push({nombre:"Rbreak",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n12,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rcontinue ptycoma												//continue
			{
				var lista=[];
				let n13=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rcontinue",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n13,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rif Condicion BloqueIns 										//if
			{
				var lista=[];
				let n14=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push($3);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n14,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rif Condicion BloqueIns NelseIf 								//if elseif
			{
				var lista=[];
				let n15=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push($3);
				lista.push($4);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n15,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rif Condicion BloqueIns  Nelse 								//if else
			{
				var lista=[];
				let n16=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push($3);
				lista.push($4);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n16,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rif Condicion BloqueIns NelseIf Nelse 							//if elseif else
			{
				var lista=[];
				let n17=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push($3);
				lista.push($4);
				lista.push($5);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n17,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rswitch pIzq Exp pDer llIzq Ncase Ndefault llDer				//switch
			{
				var lista=[];
				let n18=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rswitch",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push($3);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"llIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
				idg++;
				lista.push($6);
				lista.push($7);
				lista.push({nombre:"llDer",tipo:"terminal",nodo:"nodo"+idg,valor:$8,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n18,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rwhile Condicion BloqueIns										//while
			{
				var lista=[];
				let n19=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rwhile",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push($3);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n19,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rdo BloqueIns Rwhile Condicion ptycoma							//do while
			{
				var lista=[];
				let n20=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rdo",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push({nombre:"Rwhile",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				lista.push($4);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n20,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;				

			}
		|Rfor pIzq AsignaFor ptycoma Exp ptycoma insfor pDer BloqueIns	//for
			{
				var lista=[];
				let n21=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rfor",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push($3);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				lista.push($5);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$6,linea:linea,columna:columna});
				idg++;
				lista.push($7);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$8,linea:linea,columna:columna});
				idg++;
				lista.push($9);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n21,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|Rfor pIzq Rlet id Rof id pDer BloqueIns						//for of
			{
				var lista=[];
				let n22=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rfor",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"Rlet",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"Rfor",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$6,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$7,linea:linea,columna:columna});
				idg++;
				lista.push($8);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,clase:n22,
					linea:linea,
					columna:columna,	
					hijos:lista
				}
				idg++;
				$$=instruccion;					

			}
		|Rfor pIzq Rlet id Rin id pDer BloqueIns						// for in
			{
				var lista=[];
				let n23=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rfor",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"Rlet",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"Rin",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$6,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$7,linea:linea,columna:columna});
				idg++;
				lista.push($8);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n23,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;				

			}
		|Rconsole punto Rlog pIzq Exp pDer ptycoma						//imprimir num
			{
				var lista=[];
				let n24=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rconsole",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"punto",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"Rlog",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				lista.push($5);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$6,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$7,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n24,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		
		|Aumento	ptycoma												//id++
			{
				var lista=[];
				let n25=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n25,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|Decremento ptycoma												//id--
			{
				var lista=[];
				let n26=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n26,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|SumaIgual ptycoma												//id+=
			{
				var lista=[];
				let n27=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n27,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|RestaIgual ptycoma												//id-=
			{
				var lista=[];
				let n28=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n28,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|id pIzq pDer ptycoma											//llamada funcion sin param
			{
				var lista=[];
				let n29=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n29,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;	
			}
		|id pIzq Lparam pDer ptycoma									//llamada funcion con param
			{
				var lista=[];
				let n30=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				lista.push($3);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
				idg++;

				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n30,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=instruccion;					
			}
			;




BloqueIns: 
		llIzq instrucciones llDer
			{
				var lista=[];
				let n31=new Nodo();	
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"llIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push({nombre:"llDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
				idg++;
				var BloqueIns={
					nombre:"BloqueIns",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n31,
					linea:linea,
					columna:columna,
					hijos:lista
				}
				idg++;
				$$=BloqueIns;

			}
		|llIzq llDer
			{
				var lista=[];
				let n32=new Nodo();	
				lista.push({nombre:"llIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"llDer",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				var BloqueIns={
					nombre:"BloqueIns",
					tipo:"noterminal",	
					nodo:"nodo"+idg,clase:n32,
					hijos:lista
				}
				idg++;
				$$=BloqueIns;				
			}
		;






AsignaFor: Rlet id dosP Ntipo igual Exp
	{
		var lista=[];
		let n33=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rlet",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		lista.push($4);
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$5,linea:linea,columna:columna});
		idg++;
		lista.push($6);

		var AsignaFor={
			nombre:"AsignaFor",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n33,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=AsignaFor;
	}
	|id igual Exp
	{
		var lista=[];
		let n34=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);

		var AsignaFor={
			nombre:"AsignaFor",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n34,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=AsignaFor;		
	}
;

NelseIf:
	NelseIf Relse Rif Condicion BloqueIns
	{
		var lista=[];
		let n35=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		//lista.push($2);
		lista.push({nombre:"Relse",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		lista.push($4);
		lista.push($5);

		var NelseIf={
			nombre:"NelseIf",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n35,
			res:"",
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=NelseIf;			
	}
	|Relse Rif Condicion BloqueIns
	{
		var lista=[];
		let n36=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Relse",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);
		lista.push($4);

		var NelseIf={
			nombre:"NelseIf",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n36,
			res:"",
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=NelseIf;			
	}
	;


Condicion:
	pIzq Exp pDer
	{
		var lista=[];
		let n37=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);
		lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		var Condicion={
			nombre:"Condicion",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n37,
			res:"",
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=Condicion;
	}
	;

Nelse:
	Relse BloqueIns
	{
		var lista=[];
		let n38=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Relse",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);
		var Nelse={
			nombre:"Nelse",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n38,
			res:"",
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=Nelse;		
	}
	;

Ncase:
	Ncase Rcase Exp dosP instrucciones
		{
			var lista=[];
			let n39=new Nodo();	
			linea=this._$.first_line;
			columna=this._$.first_column;
			lista.push($1);
			lista.push({nombre:"Rcase",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
			idg++;
			lista.push($3);
			lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
			idg++;
			lista.push($5);
			var Ncase={
				nombre:"Ncase",
				tipo:"noterminal",
				nodo:"nodo"+idg,clase:n39,
				valor:"",
				exp:{valor:"",tipo:""},	
				linea:linea,
				columna:columna,
				hijos:lista
			}
			idg++;
			$$=Ncase;				
		}
	|Rcase Exp dosP instrucciones
		{
			var lista=[];
			let n40=new Nodo();	
			linea=this._$.first_line;
			columna=this._$.first_column;
			lista.push({nombre:"Rcase",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
			idg++;
			lista.push($2);
			lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
			idg++;
			lista.push($4);
			var Ncase={
				nombre:"Ncase",
				tipo:"noterminal",	
				nodo:"nodo"+idg,clase:n40,
				exp:{valor:"",tipo:""},
				linea:linea,
				columna:columna,	
				hijos:lista
			}
			idg++;
			$$=Ncase;
		}
		;

Ndefault: 
	Rdefault dosP instrucciones
		{
			var lista=[];
			let n41=new Nodo();	
			linea=this._$.first_line;
			columna=this._$.first_column;
			lista.push({nombre:"Rdefault",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
			idg++;
			lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
			idg++;
			lista.push($3);
			var Ndefault={
				nombre:"Ndefault",
				tipo:"noterminal",
				nodo:"nodo"+idg,clase:n41,
				linea:linea,
				columna:columna,	
				hijos:lista
			}
			idg++;
			$$=Ndefault;
		}
	|
	{
		var lista=[];
		let n42=new Nodo();	
		lista.push({nombre:"Epsilon",tipo:"terminal",nodo:"nodo"+idg,valor:"epsilon"});
		idg++;
		var Ndefault={
			nombre:"Ndefault",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n42,	
			hijos:lista
		}
		idg++;
		$$=Ndefault;
	}
	;
	


Aumento:
	id mas mas
	{
		var lista=[];
		let n43=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		var Aumento={
			nombre:"Aumento",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n43,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=Aumento;		
	}
	;

Decremento: id menos menos
	{
		var lista=[];
		let n44=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		var Decremento={
			nombre:"Decremento",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n44,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=Decremento;			
	}
	;



SumaIgual: id mas igual Exp
	{
		var lista=[];
		let n45=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		lista.push($4);
		
		var SumaIgual={
			nombre:"SumaIgual",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n45,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=SumaIgual;			
	};

RestaIgual: id menos igual Exp
	{
		var lista=[];
		let n46=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		lista.push($4);
		var RestaIgual={
			nombre:"RestaIgual",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n46,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=RestaIgual;		
	}
	;

insfor: Aumento
	{
		var lista=[];
		let n47=new Nodo();	
		lista.push($1);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n47,	
			hijos:lista
		}
		idg++;
		$$=insfor;					
	}
	|Decremento
	{
		var lista=[];
		let n48=new Nodo();	
		lista.push($1);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n48,	
			hijos:lista
		}
		idg++;
		$$=insfor;		
	}
	|SumaIgual
	{
		var lista=[];
		let n49=new Nodo();	
		lista.push($1);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n49,	
			hijos:lista
		}
		idg++;
		$$=insfor;			
	}
	|RestaIgual
	{
		var lista=[];
		let n50=new Nodo();	
		lista.push($1);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n50,	
			hijos:lista
		}
		idg++;
		$$=insfor;			
	}
	|id igual Exp
	{
		var lista=[];
		let n51=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n51,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=insfor;	
	};

Param:
	Param coma id dosP Ntipo
	{
		var lista=[];
		let n52=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
		idg++;
		lista.push($5);
		var parametros=[];
		var Param={
			nombre:"Param",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n52,
			parametros:parametros,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=Param;
	} 
	|id dosP Ntipo
	{
		var lista=[];
		let n53=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);
		var parametros=[];
		var Param={
			nombre:"Param",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n53,
			parametros:parametros,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=Param;		
	}
	;


DecLet:
	Rlet Lasig ptycoma
	{
		var lista=[];
		let n54=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rlet",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);
		lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		
		var DecLet={
			nombre:"DecLet",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n54,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=DecLet;

	};

Lasig: Lasig coma IA
	{
		var lista=[];
		let n55=new Nodo();	
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);	
		var Lasig={
			nombre:"Lasig",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n55,
			hijos:lista
		}
		idg++;
		$$=Lasig;
	}
	|IA
	{
		var lista=[];
		let n56=new Nodo();	
		lista.push($1);
		var Lasig={
			nombre:"Lasig",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n56,
			hijos:lista
		}
		idg++;
		$$=Lasig;
	};

IA: id dosP Ntipo
	{
		var lista=[];
		let n57=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);	
		var IA={
			nombre:"IA",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n57,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=IA;

	}
	|id dosP Ntipo igual Exp
	{
		var lista=[];
		let n58=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
		idg++;
		lista.push($5);
		var IA={
			nombre:"IA",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n58,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=IA;
	}
	;

DecConst:
	Rconst Lconst ptycoma
	{
		var lista=[];
		let n59=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rconst",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);
		lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		var DecConst={
			nombre:"DecConst",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n59,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=DecConst;
	}
	;

Lconst:
	Lconst coma CA
	{
		var lista=[];
		let n60=new Nodo();	
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		var Lconst={
			nombre:"Lconst",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n60,
			hijos:lista
		}
		idg++;
		$$=Lconst;
	}
	|CA
	{
		var lista=[];
		let n61=new Nodo();	
		lista.push($1);
		var Lconst={
			nombre:"Lconst",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n61,
			hijos:lista
		}
		idg++;
		$$=Lconst;	
	}	
	;

CA: id dosP Ntipo igual Exp
	{
		var lista=[];
		let n62=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
		idg++;
		lista.push($5);
		var CA={
			nombre:"CA",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n62,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=CA;	
	}
	;




Ntipo:
	Rboolean
	{
		var lista=[];
		let n63=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"Rboolean",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n63,
			valor:"",
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
    |Rstring
	{
		var lista=[];
		let n64=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rstring",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n64,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=Ntipo;
	}
    |Rnumber
	{
		var lista=[];
		let n65=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rnumber",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n65,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
    |Rvoid
	{
		var lista=[];
		let n66=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"Rvoid",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n66,
			linea:linea,
			columna:columna,
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
    |Rboolean cIzq cDer
	{
		var lista=[];
		let n67=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rboolean",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});		
		idg++;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n67,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
	|Rstring cIzq cDer
	{
		var lista=[];
		let n68=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rstring",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});		
		idg++;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n68,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=Ntipo;	
	}
	|Rnumber cIzq cDer
	{
		var lista=[];
		let n69=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"Rnumber",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});		
		idg++;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n69,
			linea:linea,
			columna:columna,	
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
	;


LExp:
	Exp coma LExp
	{
		var lista=[];
		let n70=new Nodo();	
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		var pila=[];		
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n70,
			pila:pila,
			hijos:lista
		}
		idg++;
		$$=LExp;		
	}
	|Exp
	{
		var lista=[];
		let n71=new Nodo();	
		lista.push($1);		
		var pila=[];
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n71,
			pila:pila,
			hijos:lista
		}
		idg++;
		$$=LExp;		
	}
	|{
		var lista=[];
		let n72=new Nodo();	
		lista.push({nombre:"Epsilon",tipo:"terminal",nodo:"nodo"+idg,valor:"epsilon"});
		idg++;
		var pila=[];
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n72,
			pila:pila,	
			hijos:lista
		}
		idg++;
		$$=LExp;

	}
	;





	Par: Par coma id dosP Exp
	{
		var lista=[];
		let n73=new Nodo();	
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
		idg++;
		lista.push($5);
				
		var Par={
			nombre:"Par",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n73,	
			hijos:lista
		}
		idg++;
		$$=Par;			
	}
	|id dosP Exp
	{
		var lista=[];
		let n74=new Nodo();	
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
				
		var Par={
			nombre:"Par",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n74,	
			hijos:lista
		}
		idg++;
		$$=Par;				
	}
	;


	Lparam:	Lparam coma Exp
	{
		var lista=[];
		let n75=new Nodo();	
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		var valores=[];
		var Lparam={
			nombre:"Lparam",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n75,
			valores:valores,	
			hijos:lista
		}
		idg++;
		$$=Lparam;		
	}
	|Exp
	{
		var lista=[];
		let n76=new Nodo();	
		lista.push($1);
		var valores=[];				
		var Lparam={
			nombre:"Lparam",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n76,
			valores:valores,	
			hijos:lista
		}
		idg++;
		$$=Lparam;		
	}
	;


Exp:
	 menos Exp %prec UMENOS
	 {
		var lista=[];
		let n77=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n77,
			hijos:lista
		}
		idg++;
		$$=Exp;		 
	 }
	|neg Exp
	{
		var lista=[];
		let n78=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"neg",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n78,
			hijos:lista
		}
		idg++;
		$$=Exp;		 	 		
	}
	|cIzq LExp cDer
	{
		var lista=[];
		let n79=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n79,	
			hijos:lista
		}
		idg++;
		$$=Exp;	
	}
	|Exp difer Exp
	{
		linea=this._$.first_line;
		columna=this._$.first_column;
		var lista=[];
		let n80=new Nodo();	
		lista.push($1);
		lista.push({nombre:"difer",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n80,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp dbigual Exp
	{

		var lista=[];
		let n81=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push($1);
		lista.push({nombre:"dbigual",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n81,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp mas Exp
	{
		var lista=[];
		let n82=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n82,
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp menos Exp
	{
		var lista=[];
		let n83=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n83,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp por Exp
	{
		var lista=[];
		let n84=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"por",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n84,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp div Exp
	{
		var lista=[];
		let n85=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"div",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n85,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp pot Exp
	{
		var lista=[];
		let n86=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push($1);
		lista.push({nombre:"pot",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n86,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp mod Exp
	{
		var lista=[];
		let n87=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"mod",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n87,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp menor Exp
	{
		var lista=[];
		let n88=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"menor",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n88,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp mayor Exp
	{
		var lista=[];
		let n89=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"mayor",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n89,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp mayorq Exp
	{
		var lista=[];
		let n90=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"mayorq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n90,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp menorq Exp
	{
		var lista=[];
		let n91=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"menorq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n91,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}	
	|Exp or Exp
	{
		var lista=[];
		let n92=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"or",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n92,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp and Exp
	{
		var lista=[];
		let n93=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"and",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n93,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|entero
	{
		var lista=[];
		let n94=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"number",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n94,
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|decimal
	{
		var lista=[];
		let n95=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"decimal",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n95,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Rfalse
	{
		var lista=[];
		let n96=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rfalse",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n96,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Rnull
	{
		var lista=[];
		let n97=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rnull",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n97,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Rtrue
	{
		var lista=[];
		let n98=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rtrue",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n98,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|cadena
	{
		var lista=[];
		let n99=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		if($1.includes("\\n")){
			$1=$1.replace("\\n","\n");
		}
		if($1.includes("\\r")){
			$1=$1.replace("\\r","\r");
		}
		if($1.includes("\\t")){
			$1=$1.replace("\\t","\t");
		}
		lista.push({nombre:"cadena",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,clase:n99,
			hijos:lista
		}
		idg++;
		$$=Exp;	
	}
	|cadenaSimple
	{
		var lista=[];
		let n100=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		if($1.includes('\\n')){
			$1=$1.replace('\\n','\n');
		}
		if($1.includes('\\r')){
			$1=$1.replace('\\r','\r');
		}
		if($1.includes('\\t')){
			$1=$1.replace('\\t','\t');
		}
		lista.push({nombre:"cadenaSimple",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n100,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|id
	{
		var lista=[];
		let n101=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});		
		idg++;
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n101,	
			hijos:lista
		}
		idg++;
		$$=Exp;			
	}
	|Exp ternario Exp dosP Exp
	{
		var lista=[];
		let n102=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"ternario",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
		idg++;
		lista.push($5);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n102,	
			hijos:lista
		}
		idg++;
		$$=Exp;				
	}
	|id pIzq pDer
	{
		var lista=[];
		let n103=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n103,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|id pIzq Lparam pDer
	{
		var lista=[];
		let n104=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);
		lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n104,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}					
	|llIzq Par llDer
	{
		var lista=[];
		let n105=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"llIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);
		lista.push({nombre:"llDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n105,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|pIzq Exp pDer
	{
		var lista=[];
		let n106=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);
		lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n106,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|id cIzq Exp cDer
	{
		var lista=[];
		let n107=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n107,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|id punto Rlength
	{
		var lista=[];
		let n108=new Nodo();	
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"punto",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push({nombre:"Rlength",tipo:"terminal",nodo:"nodo"+idg,valor:$3,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,clase:n108,	
			hijos:lista
		}
		idg++;
		$$=Exp;
	}
	;

