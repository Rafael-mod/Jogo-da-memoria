const loadbutton = document.getElementById('loadbttn');
let gamecartas = document.querySelectorAll('.card')
let pontos = document.getElementById('pontos')
let contador = document.getElementById('contador')
const toggleTema = document.getElementById('toggle-tema');
let tempo = 0
let intervalo = null;
let cartaVirada = null;
let CartaVirada2 = null;
let pontuação = 0;
let bloqueado = false;
let cartas = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
cartas = [...cartas, ...cartas]; 
let mensagem= document.getElementById('mensagem');
//variaveis

// função para bloquear as cartas enquanto o jogo não começa //
gamecartas.forEach(carta =>{
    carta.style.pointerEvents = 'none' ;
})


// função de virar as cartas //
function startGame(card){
    let cartasEmbaralhadas = shuffle([...cartas]);

    gamecartas.forEach((carta, index) => {
    carta.innerHTML = cartasEmbaralhadas[index];
    carta.dataset.emoji = cartasEmbaralhadas[index];
    carta.classList.remove('virado');
    pontuação = 0;
    pontos.innerText = "Pontuação:" + pontuação;
    carta.style.pointerEvents = 'auto';
    })
    //resetar o tempo //
    let tempo = 0;
    contador.innerText = "Tempo: " + tempo + "s";
    if(intervalo) clearInterval(intervalo);

    // inicia o timer //
    intervalo = setInterval(() =>{
        tempo++;
        contador.innerText = "Tempo: " + tempo + "s";
    },1000)

    setTimeout(() =>{
        gamecartas.forEach((carta) =>{
        carta.classList.add('virado');
        carta.innerHTML = '';
    })},2000)
}


//função de desvirar as cartas, comparar e ver se está certo! //
function desvirarCarta(card){
    if(card === cartaVirada) return;
    if(bloqueado) return
    if(card.classList.contains('acertou')) return;
    card.classList.remove('virado');
    card.innerHTML = card.dataset.emoji;
    if(!cartaVirada){
        cartaVirada = card;
    } else{
        cartaVirada2 = card;
        bloqueado = true;
    }

        if(cartaVirada.dataset.emoji === cartaVirada2.dataset.emoji){
            cartaVirada.classList.add('acertou');
            cartaVirada2.classList.add('acertou');

            cartaVirada = null;
            cartaVirada2 = null;
            pontuação++;
            pontos.innerText = "Pontuação:" + pontuação;
            if(pontuação === cartas.length / 2){
                clearInterval(intervalo); // Para o timer //
                const mensagemResultado = document.getElementById('mensagem-resultado');
                const audio = new Audio('audio/crowd_small_chil_ec049202_9klCwI6.mp3');
                mensagemResultado.style.display = 'block';
                audio.play();
                setTimeout(() =>{
                    mensagemResultado.style.display = 'none';
                }, 10000)
            }
            bloqueado = false;
            } else{
        setTimeout(() =>{
                    cartaVirada.classList.add('virado');
                    cartaVirada.innerHTML = '';
                    cartaVirada2.classList.add('virado');
                    cartaVirada2.innerHTML = '';
                    cartaVirada= null;
                    cartaVirada2= null;
                    bloqueado = false; 
                    }, 900)
            }
    }




// função para embaralhar as cartas utilizando o algoritmo fisher-yates //
function shuffle(array){
    //loop de trás pra frente
    for(let i = array.length -1; i > 0; i--){
        //escolhe um indice aleatorio
        const j = Math.floor(Math.random() * (i+1));
        //Troca o elemento da posição i com o elemento da posição j
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array;
}

toggleTema.addEventListener('change', () => {
    document.body.classList.toggle('tema-azul');
});

loadbutton.addEventListener('click', () =>{
    startGame(gamecartas);
})


gamecartas.forEach((carta) => {
    carta.addEventListener('click', () => {
        desvirarCarta(carta); // passa a carta clicada
    });
});