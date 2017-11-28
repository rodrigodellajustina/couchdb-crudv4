const const_url      = "http://localhost:5984"
const const_colecao  = "projetocrud"
var jsonAluno = {}
var jsonResultSearch = {}
var i=0;
var nretorno = -1;

function couchRest(pmetodo, ptype, pchavedoc){

// Responsável para comunicação do REST com JavaScript.
// JavaScript + AJAX.

var curl = ""

if(pmetodo == ""){
    curl = const_url+"/"+const_colecao;
}else{
    curl = const_url+"/"+const_colecao+"/"+pmetodo;
}

if (pchavedoc == ""){
    
}else{
    curl = curl + "/"+pchavedoc
}


$.ajax({
        url : curl,
        type : ptype,
        data : JSON.stringify(jsonAluno),
        contentType : "application/json",
        success : function(jsonResultSearch){
            if(ptype == "POST"){
                alert("Aluno Inserido com sucesso");
            }else{
                alert("Aluno Alterado com sucesso");
            }
            
        },
        error : function(error){
            alert(error.error);
        }
       })

return;

}


function AlunoInserir(){      
    
    /* busca na coleção projetocrud para saber se aluno_nome e aluno_sobre 
       estão incluídos na minha coleção do couchdb.
    */
    jsonAluno = {};
    jsonAluno.selector = {"$and" : [{"nome":document.getElementById("aluno_nome").value}, {"sobrenome" :document.getElementById("aluno_sobrenome").value}]};
    jsonAluno.fields   = ["nome", "sobrenome"];
    
    $.ajax({
        url : "http://127.0.0.1:5984/projetocrud/_find",
        type : "POST",
        data : JSON.stringify(jsonAluno),
        contentType : "application/json",
        success : function(jsonResultSearch){
            if(jsonResultSearch.docs.length > 0){
                // mostrar mensagem
                alert("Aluno [nome,sobrenome] já existentes");
            }else{
                // inserir
                jsonAluno.nome         = document.getElementById("aluno_nome").value;
                jsonAluno.sobrenome    = document.getElementById("aluno_sobrenome").value;
                jsonAluno.cidade       = document.getElementById("aluno_cidade").value;
                jsonAluno.dtnascimento = document.getElementById("aluno_nascimento").value;
                couchRest("", "POST", "");
            }
        },
        error : function(error){
            alert(error.error);
        }
       })



    jsonAluno = {};
    return 1;
}


function RedirecionarRelacionarLivro(){
    
    document.location.href = "livro.html";

}

function RedirecionarCadastro(){
    
    document.location.href = "index.html";

}

function AlunoBuscar(){
    
    pnome = prompt("Informe um nome", "Busca de nome");

    jsonAluno.selector = {"nome":pnome};
    jsonAluno.fields = ["nome", "sobrenome"];
    pmetodo = "_find";

    curl = const_url+"/"+const_colecao+"/"+pmetodo;

    $.ajax({
        url : curl,
        type : "POST",
        data : JSON.stringify(jsonAluno),
        contentType : "application/json",
        success : function(result){
            //alert(JSON.stringify(result));
            //alert("fez o acesso");
            jsonResultSearch = result;
            if (jsonResultSearch.docs.length > 0) {

                for (var j=0; j <= jsonResultSearch.docs.length; j++){
                
                    $('#addr'+i).html("<td>"+ (i+1) +"</td><td><input name='nome"       +i+"' type='text' placeholder='Nome'  value='"+jsonResultSearch.docs[j].nome+"'     class='form-control input-md' readonly/> </td>" + 
                                                     "     <td><input name='sobrenome"  +i+"' type='text' placeholder='Sobrenome' value='"+jsonResultSearch.docs[j].sobrenome +"' class='form-control input-md' readonly></td> " +
                                                    "     <td><input list='livrog1' class='form-control input-list'><datalist id='livrog1'> <option value='Livro A'><option value='Livro B'><option value='Livro C'> <option value='Livro D'><option value='Livro E'></datalist></td>" + 
                                                    "     <td><input list='livrog1' class='form-control input-list'><datalist id='livrog2'> <option value='Livro A'><option value='Livro B'><option value='Livro C'> <option value='Livro D'><option value='Livro E'></datalist></td>" );
                    $('#tab_alunos').append('<tr id="addr'+(i+1)+'"></tr>');
                    i++;
                }
        
            }else{
                alert("Aluno não encontrado");
            }
        
            jsonResultSearch = {}
        },
        error : function(error){
            alert(error.error);
        }
       })


    jsonAluno = {};
    return 1;

}

function AlunoRelacionarLivro(){

    var tbr_aluno = document.getElementById('tab_alunos').rows;
    var array_todos = null;
    
    // percorrendo os registros da minha tabela.
    for(var i = 0 ; i < tbr_aluno.length ; i++){
        array_todos = tbr_aluno[i].cells;

        if (i > 0){

            cNome = array_todos[1].getElementsByTagName("input")[0].value;
            alert(cNome);

            cSobrenome =  array_todos[2].getElementsByTagName("input")[0].value;
            alert(cSobrenome);

            cLivroG1 = array_todos[3].getElementsByTagName("input")[0].value;
            alert(cLivroG1);

            cLivroG2 = array_todos[4].getElementsByTagName("input")[0].value;
            alert(cLivroG2);   
            
            jsonAluno = {};
            jsonAluno.selector = {"$and" : [{"nome":cNome}, {"sobrenome":cSobrenome}]};
            jsonAluno.fields = ["_id", "_rev", "nome", "sobrenome", "cidade", "dtnascimento"  ];
           
            // enviar o parametro JSON via REST
            $.ajax({
                url : "http://127.0.0.1:5984/projetocrud/_find",
                type : "POST",
                data : JSON.stringify(jsonAluno),
                contentType : "application/json",
                success : function(jsonResultSearch){
                    // o retorno do json (jsonResultSearch)
                    if(jsonResultSearch.docs.length > 0){
                        // se ele encontrar o documento 
                        jsonAluno = {};
                        jsonAluno.nome         = jsonResultSearch.docs[0].nome;
                        jsonAluno.sobrenome    = jsonResultSearch.docs[0].sobrenome;
                        jsonAluno.cidade       = jsonResultSearch.docs[0].cidade;
                        jsonAluno.dtnascimento = jsonResultSearch.docs[0].dtnascimento;
                        jsonAluno.livrog1      = cLivroG1;
                        jsonAluno.livroG2      = cLivroG2;
                        jsonAluno.livros       = {"g1":cLivroG1, "g2":cLivroG2};
                        jsonAluno._rev         = jsonResultSearch.docs[0]._rev;
                        couchRest("", "PUT", jsonResultSearch.docs[0]._id);
                    }

                    
                },
                error : function(error){
                    alert(error.error);
                }
               });



            // o retorno deverá retornar o ID e o _rev
            
            // alterar o documento e incluir as 2 colunas
            // livrog1 e livrog2.
            // enviar novamente via REST
            // couchrest("","PUT", "");

            

        }


    }


}
