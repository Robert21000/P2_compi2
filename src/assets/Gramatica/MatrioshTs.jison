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

		var ini={
				nombre:"ini",
				tipo:"noterminal",
				nodo:"nodo"+idg,
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
	
		var instrucciones={
			nombre:"instrucciones",
			tipo:"noterminal",
			nodo:"nodo"+idg,
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
		var instrucciones={
			nombre:"instrucciones",
			tipo:"noterminal",
			nodo:"nodo"+idg,
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
				lista.push($1);
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,
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
				lista.push($1);
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rreturn",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				
				lista.push({nombre:"Rbreak",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rcontinue",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push($3);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push({nombre:"Rwhile",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
				idg++;
				lista.push($2);
				lista.push($3);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
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
				linea=this._$.first_line;
				columna=this._$.first_column;
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
					nodo:"nodo"+idg,
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
				lista.push({nombre:"llIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"llDer",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				var BloqueIns={
					nombre:"BloqueIns",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=BloqueIns;				
			}
		;






AsignaFor: Rlet id dosP Ntipo igual Exp
	{
		var lista=[];
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Relse",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);
		var Nelse={
			nombre:"Nelse",
			tipo:"noterminal",
			nodo:"nodo"+idg,
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
				nodo:"nodo"+idg,
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
				nodo:"nodo"+idg,
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
				nodo:"nodo"+idg,
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
		lista.push({nombre:"Epsilon",tipo:"terminal",nodo:"nodo"+idg,valor:"epsilon"});
		idg++;
		var Ndefault={
			nombre:"Ndefault",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
		lista.push($1);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=insfor;					
	}
	|Decremento
	{
		var lista=[];
		lista.push($1);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=insfor;		
	}
	|SumaIgual
	{
		var lista=[];
		lista.push($1);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=insfor;			
	}
	|RestaIgual
	{
		var lista=[];
		lista.push($1);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=insfor;			
	}
	|id igual Exp
	{
		var lista=[];
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);	
		var Lasig={
			nombre:"Lasig",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Lasig;
	}
	|IA
	{
		var lista=[];
		lista.push($1);
		var Lasig={
			nombre:"Lasig",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Lasig;
	};

IA: id dosP Ntipo
	{
		var lista=[];
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		var Lconst={
			nombre:"Lconst",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Lconst;
	}
	|CA
	{
		var lista=[];
		lista.push($1);
		var Lconst={
			nombre:"Lconst",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Lconst;	
	}	
	;

CA: id dosP Ntipo igual Exp
	{
		var lista=[];
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
			nodo:"nodo"+idg,
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
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"Rboolean",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rstring",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rnumber",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"Rvoid",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,
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
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		var pila=[];		
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			pila:pila,
			hijos:lista
		}
		idg++;
		$$=LExp;		
	}
	|Exp
	{
		var lista=[];
		lista.push($1);		
		var pila=[];
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			pila:pila,
			hijos:lista
		}
		idg++;
		$$=LExp;		
	}
	|{
		var lista=[];
		lista.push({nombre:"Epsilon",tipo:"terminal",nodo:"nodo"+idg,valor:"epsilon"});
		idg++;
		var pila=[];
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",
			nodo:"nodo"+idg,
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Par;			
	}
	|id dosP Exp
	{
		var lista=[];
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
				
		var Par={
			nombre:"Par",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Par;				
	}
	;


	Lparam:	Lparam coma Exp
	{
		var lista=[];
		lista.push($1);
		lista.push({nombre:"coma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		var valores=[];
		var Lparam={
			nombre:"Lparam",
			tipo:"noterminal",
			nodo:"nodo"+idg,
			valores:valores,	
			hijos:lista
		}
		idg++;
		$$=Lparam;		
	}
	|Exp
	{
		var lista=[];
		lista.push($1);
		var valores=[];				
		var Lparam={
			nombre:"Lparam",
			tipo:"noterminal",
			nodo:"nodo"+idg,
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
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Exp;		 
	 }
	|neg Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push({nombre:"neg",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		lista.push($2);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Exp;		 	 		
	}
	|cIzq LExp cDer
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
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
		lista.push($1);
		lista.push({nombre:"difer",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp dbigual Exp
	{

		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push($1);
		lista.push({nombre:"dbigual",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp mas Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp menos Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp por Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"por",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp div Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"div",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp pot Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		
		lista.push($1);
		lista.push({nombre:"pot",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp mod Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"mod",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp menor Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"menor",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp mayor Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"mayor",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp mayorq Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"mayorq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp menorq Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"menorq",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}	
	|Exp or Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"or",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Exp and Exp
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push($1);
		lista.push({nombre:"and",tipo:"terminal",nodo:"nodo"+idg,valor:$2,linea:linea,columna:columna});
		idg++;
		lista.push($3);		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|entero
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"difer",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|decimal
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"decimal",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Rfalse
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rfalse",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Rnull
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rnull",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;		
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|Rtrue
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"Rtrue",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});
		idg++;
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|cadena
	{
		var lista=[];
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
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Exp;	
	}
	|cadenaSimple
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|id
	{
		var lista=[];
		linea=this._$.first_line;
		columna=this._$.first_column;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1,linea:linea,columna:columna});		
		idg++;
		var Exp={
			nombre:"Exp",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;			
	}
	|Exp ternario Exp dosP Exp
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;				
	}
	|id pIzq pDer
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|id pIzq Lparam pDer
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}					
	|llIzq Par llDer
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|pIzq Exp pDer
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|id cIzq Exp cDer
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;		
	}
	|id punto Rlength
	{
		var lista=[];
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
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Exp;
	}
	;

