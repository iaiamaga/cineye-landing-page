const todasImagens = document.querySelectorAll('.imagem-painel');
const setaAvancar = document.getElementById('btn-avancar');
const setaVoltar = document.getElementById('btn-voltar');

let imagemAtual = 0;

function atualizarOpacidadeDasSetas(){
    if(imagemAtual === 0){
        setaVoltar.classList.add("opacidade");
        setaAvancar.classList.remove("opacidade");
    }else if(imagemAtual === todasImagens.length - 1){
        setaVoltar.classList.remove("opacidade");
        setaAvancar.classList.add("opacidade");
    }else{
        setaVoltar.classList.remove("opacidade");
        setaAvancar.classList.remove("opacidade");
    }
}

function atualizarImagem() {

  todasImagens.forEach(imagem => {
    imagem.classList.remove("mostrar");
  });
  
  todasImagens[imagemAtual].classList.add("mostrar");

  atualizarOpacidadeDasSetas()
}

setaAvancar.addEventListener('click', function(e) {
  e.preventDefault(); // evitar comportamento padrão do <a>

  if (imagemAtual < todasImagens.length - 1) {
    imagemAtual++;
    atualizarImagem();
  }

});

setaVoltar.addEventListener('click', function(e) {
  e.preventDefault();

  if (imagemAtual > 0) {
    imagemAtual--;
    atualizarImagem();
  }

});

function atualizaOpacidade(setaVoltar){

}

