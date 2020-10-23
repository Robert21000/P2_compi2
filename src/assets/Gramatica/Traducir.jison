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

%}

%lex


%options case-insensitive

cadenar					\`([^\`]|[ntr])*\`;
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
/*
[0-9]+\b                				return 'entero';
[0-9]+("."[0-9]+)?\b    				return 'decimal';


[a-zA-Z]+("_"|[a-zA-AZ]|[0-9])*\b 		return 'id';

\"([^\"]|"\n"|"\t"|"\r")*\"				return 'cadena';

\'[^\']*\'								return 'cadenaSimple';
*/
{cadenar}								{yytext=yytext.substr(1,yyleng-2);return 'cadenar'}
{cadena}								{yytext=yytext.substr(1,yyleng-2);return 'cadena'}
{cadenaSimple}							{yytext=yytext.substr(1,yyleng-2);return 'cadenaSimple'}
{decimal}								return 'decimal';
{entero}								return 'entero';
{id}									return 'id';

<<EOF>>								return 'EOF';

.                       { 
	console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
	listaErrores.push({tipo:'Error Léxico',valor:yytext,linea:yylloc.first_line,columna:yylloc.first_column});
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
			hijos:lista
		}
		idg++;
		$$=instrucciones;
	}
	| error { 
		console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
		listaErrores.push({tipo:'Error Sintáctico ',valor:yytext,linea:this._$.first_line,columna:this._$.first_column});
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
					hijos:lista
				}
				idg++;
				$$=instruccion;	
		}

		|id igual Exp ptycoma											//id asignacion
			{
				var lista=[];
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push($3);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|id cIzq Exp cDer igual Exp ptycoma
		{							
			var lista=[];
			lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
			idg++;
			lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
			idg++;
			lista.push($3);
			lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
			idg++;
			lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
			idg++;
			lista.push($6);
			lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$7});
			idg++;
			var instruccion={
				nombre:"instruccion",
				tipo:"noterminal",
				nodo:"nodo"+idg,	
				hijos:lista
			}
			idg++;
			$$=instruccion;				
		}

		|Rfunction id pIzq Param pDer dosP Ntipo BloqueIns				//funciones
			{
				var lista=[];
				lista.push({nombre:"Rfunction",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
				idg++;
				lista.push($4);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
				idg++;
				lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$6});
				idg++;
				lista.push($7);
				lista.push($8);

				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rfunction id pIzq pDer dosP Ntipo BloqueIns					//funciones sin param
			{
				var lista=[];
				lista.push({nombre:"Rfunction",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
				idg++;
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
				idg++;
				lista.push($6);
				lista.push($7);

				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rreturn ptycoma												// return 
			{
				var lista=[];
				lista.push({nombre:"Rreturn",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rreturn Exp ptycoma											//return exp
			{
				var lista=[];
				lista.push({nombre:"Rreturn",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push($2);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rbreak ptycoma													//break
			{
				var lista=[];
				lista.push({nombre:"Rbreak",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rcontinue ptycoma												//continue
			{
				var lista=[];
				lista.push({nombre:"Rcontinue",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rif Condicion BloqueIns 										//if
			{
				var lista=[];
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push($2);
				lista.push($3);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rif Condicion BloqueIns NelseIf 								//if elseif
			{
				var lista=[];
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push($2);
				lista.push($3);
				lista.push($4);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rif Condicion BloqueIns  Nelse 								//if else
			{
				var lista=[];
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push($2);
				lista.push($3);
				lista.push($4);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rif Condicion BloqueIns NelseIf Nelse 							//if elseif else
			{
				var lista=[];
				lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push($2);
				lista.push($3);
				lista.push($4);
				lista.push($5);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rswitch pIzq Exp pDer llIzq Ncase Ndefault llDer				//switch
			{
				var lista=[];
				lista.push({nombre:"Rswitch",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push($3);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				lista.push({nombre:"llIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
				idg++;
				lista.push($6);
				lista.push($7);
				lista.push({nombre:"llDer",tipo:"terminal",nodo:"nodo"+idg,valor:$8});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;

			}
		|Rwhile Condicion BloqueIns										//while
			{
				var lista=[];
				lista.push({nombre:"Rwhile",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push($2);
				lista.push($3);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|Rdo BloqueIns Rwhile Condicion ptycoma							//do while
			{
				var lista=[];
				lista.push({nombre:"Rdo",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push($2);
				lista.push({nombre:"Rwhile",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
				idg++;
				lista.push($4);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;				

			}
		|Rfor pIzq AsignaFor ptycoma Exp ptycoma insfor pDer BloqueIns	//for
			{
				var lista=[];
				lista.push({nombre:"Rfor",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push($3);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				lista.push($5);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$6});
				idg++;
				lista.push($7);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$8});
				idg++;
				lista.push($9);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|Rfor pIzq Rlet id Rof id pDer BloqueIns						//for of
			{
				var lista=[];
				lista.push({nombre:"Rfor",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push({nombre:"Rlet",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				lista.push({nombre:"Rfor",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$6});
				idg++;
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$7});
				idg++;
				lista.push($8);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",
					nodo:"nodo"+idg,	
					hijos:lista
				}
				idg++;
				$$=instruccion;					

			}
		|Rfor pIzq Rlet id Rin id pDer BloqueIns						// for in
			{
				var lista=[];
				lista.push({nombre:"Rfor",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push({nombre:"Rlet",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				lista.push({nombre:"Rin",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
				idg++;
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$6});
				idg++;
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$7});
				idg++;
				lista.push($8);
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;				

			}
		|Rconsole punto Rlog pIzq Exp pDer ptycoma						//imprimir num
			{
				var lista=[];
				lista.push({nombre:"Rconsole",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"punto",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push({nombre:"Rlog",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				lista.push($5);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$6});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$7});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}

		|Aumento	ptycoma												//id++
			{
				var lista=[];
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|Decremento ptycoma												//id--
			{
				var lista=[];
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;
			}
		|SumaIgual ptycoma												//id+=
			{
				var lista=[];
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|RestaIgual ptycoma												//id-=
			{
				var lista=[];
				lista.push($1);
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;				
			}
		|id pIzq pDer ptycoma											//llamada funcion sin param
			{
				var lista=[];
				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
					hijos:lista
				}
				idg++;
				$$=instruccion;	
			}
		|id pIzq Lparam pDer ptycoma									//llamada funcion con param
			{
				var lista=[];

				lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
				idg++;
				lista.push($3);
				lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
				idg++;
				lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
				idg++;

				var instruccion={
					nombre:"instruccion",
					tipo:"noterminal",	
					nodo:"nodo"+idg,
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
				lista.push({nombre:"llIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
				idg++;
				lista.push($2);
				lista.push({nombre:"llDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
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
		lista.push({nombre:"Rlet",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		lista.push($4);
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$5});
		idg++;
		lista.push($6);

		var AsignaFor={
			nombre:"AsignaFor",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=AsignaFor;
	}
|id igual Exp
	{
		var lista=[];
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);

		var AsignaFor={
			nombre:"AsignaFor",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
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
		lista.push($1);
		lista.push($2);
		lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		lista.push($4);
		lista.push($5);

		var NelseIf={
			nombre:"NelseIf",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=NelseIf;			
	}
	|Relse Rif Condicion BloqueIns
	{
		var lista=[];
		lista.push({nombre:"Relse",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"Rif",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		lista.push($4);

		var NelseIf={
			nombre:"NelseIf",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
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
		lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push($2);
		lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		var Condicion={
			nombre:"Condicion",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
		lista.push({nombre:"Relse",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push($2);
		var Nelse={
			nombre:"Nelse",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
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
			lista.push($1);
			lista.push({nombre:"Rcase",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
			idg++;
			lista.push($3);
			lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
			idg++;
			lista.push($5);
			var Ncase={
				nombre:"Ncase",
				tipo:"noterminal",
				nodo:"nodo"+idg,	
				hijos:lista
			}
			idg++;
			$$=Ncase;				
		}
	|Rcase Exp dosP instrucciones
		{
			var lista=[];
			lista.push({nombre:"Rcase",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
			idg++;
			lista.push($2);
			lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
			idg++;
			lista.push($4);
			var Ncase={
				nombre:"Ncase",
				tipo:"noterminal",	
				nodo:"nodo"+idg,
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
			lista.push({nombre:"Rdefault",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
			idg++;
			lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
			idg++;
			lista.push($3);
			var Ndefault={
				nombre:"Ndefault",
				tipo:"noterminal",
				nodo:"nodo"+idg,	
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		var Aumento={
			nombre:"Aumento",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Aumento;		
	}
	;

Decremento: id menos menos
	{
		var lista=[];
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		var Decremento={
			nombre:"Decremento",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Decremento;			
	}
	;



SumaIgual: id mas igual Exp
	{
		var lista=[];
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		lista.push($4);
		
		var SumaIgual={
			nombre:"SumaIgual",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=SumaIgual;			
	};

RestaIgual: id menos igual Exp
	{
		var lista=[];
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		lista.push($4);
		var RestaIgual={
			nombre:"RestaIgual",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		var insfor={
			nombre:"insfor",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=insfor;	
	};

Param:
	Param coma id dosP Ntipo
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

		var Param={
			nombre:"Param",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Param;
	} 
	|id dosP Ntipo
	{
		var lista=[];
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);

		var Param={
			nombre:"Param",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
		lista.push({nombre:"Rlet",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push($2);
		lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		
		var DecLet={
			nombre:"DecLet",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);	
		var IA={
			nombre:"IA",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=IA;

	}
	|id dosP Ntipo igual Exp
	{
		var lista=[];
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
		idg++;
		lista.push($5);

		var IA={
			nombre:"IA",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=IA;
	};

DecConst:
	Rconst Lconst ptycoma
	{
		var lista=[];
		lista.push({nombre:"Rconst",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push($2);
		lista.push({nombre:"ptycoma",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		var DecConst={
			nombre:"DecConst",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		lista.push({nombre:"igual",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
		idg++;
		lista.push($5);
		var CA={
			nombre:"CA",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
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
		lista.push({nombre:"Rboolean",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
    |Rstring
	{
		var lista=[];
		lista.push({nombre:"Rstring",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Ntipo;
	}
    |Rnumber
	{
		var lista=[];
		lista.push({nombre:"Rnumber",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
    |Rvoid
	{
		var lista=[];
		lista.push({nombre:"Rvoid",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;		
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
    |Rboolean cIzq cDer
	{
		var lista=[];
		lista.push({nombre:"Rboolean",tipo:"terminal",nodo:"nodo"+idg,valor:$1});		
		idg++;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Ntipo;		
	}
	|Rstring cIzq cDer
	{
		var lista=[];
		lista.push({nombre:"Rstring",tipo:"terminal",nodo:"nodo"+idg,valor:$1});		
		idg++;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Ntipo;	
	}
	|Rnumber cIzq cDer
	{
		var lista=[];
		lista.push({nombre:"Rnumber",tipo:"terminal",nodo:"nodo"+idg,valor:$1});		
		idg++;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
		idg++;
		var Ntipo={
			nombre:"Ntipo",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
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
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			pila:null,
			hijos:lista
		}
		idg++;
		$$=LExp;		
	}
	|Exp
	{
		var lista=[];
		lista.push($1);		
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",	
			nodo:"nodo"+idg,
			pila:null,
			hijos:lista
		}
		idg++;
		$$=LExp;		
	}
	|{
		var lista=[];
		lista.push({nombre:"Epsilon",tipo:"terminal",nodo:"nodo"+idg,valor:"epsilon"});
		idg++;
		var LExp={
			nombre:"LExp",
			tipo:"noterminal",
			nodo:"nodo"+idg,
			pila:null,	
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
				
		var Lparam={
			nombre:"Lparam",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
			hijos:lista
		}
		idg++;
		$$=Lparam;		
	}
	|Exp
	{
		var lista=[];
		lista.push($1);				
		var Lparam={
			nombre:"Lparam",
			tipo:"noterminal",
			nodo:"nodo"+idg,	
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
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"neg",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push($2);
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
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
		var lista=[];
		lista.push($1);
		lista.push({nombre:"difer",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"dbigual",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"mas",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"menos",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"por",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"div",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"pot",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"mod",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"menor",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"mayor",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"mayorq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"menorq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"or",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push($1);
		lista.push({nombre:"and",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
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
		lista.push({nombre:"difer",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"decimal",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"Rfalse",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"Rnull",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"Rtrue",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"cadena",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"cadenaSimple",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});		
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
		lista.push($1);
		lista.push({nombre:"ternario",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		lista.push({nombre:"dosP",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
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
		lista.push({nombre:"llIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push($2);
		lista.push({nombre:"llDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
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
		lista.push({nombre:"pIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push($2);
		lista.push({nombre:"pDer",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"cIzq",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push($3);
		lista.push({nombre:"cDer",tipo:"terminal",nodo:"nodo"+idg,valor:$4});
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
		lista.push({nombre:"id",tipo:"terminal",nodo:"nodo"+idg,valor:$1});
		idg++;
		lista.push({nombre:"punto",tipo:"terminal",nodo:"nodo"+idg,valor:$2});
		idg++;
		lista.push({nombre:"Rlength",tipo:"terminal",nodo:"nodo"+idg,valor:$3});
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



