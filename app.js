const loadbutton = document.getElementById('loadbttn');
let gamecartas = document.querySelectorAll('.card')
let pontos = document.getElementById('pontos')
let cartaVirada = null;
let CartaVirada2 = null;
let pontuação = 0;
let bloqueado = false;
let cartas = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
cartas = [...cartas, ...cartas]; 
//variaveis


// função de virar as cartas //
function startGame(card){
    let cartasEmbaralhadas = shuffle([...cartas]);

    gamecartas.forEach((carta, index) => {
    carta.innerHTML = cartasEmbaralhadas[index];
    carta.dataset.emoji = cartasEmbaralhadas[index];
    carta.classList.remove('virado');
    }) 

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
    card.classList.remove('virado');
    card.innerHTML = card.dataset.emoji;
    if(!cartaVirada){
        cartaVirada = card;
    } else{
        cartaVirada2 = card;
        bloqueado = true;
    }

    if(cartaVirada && cartaVirada2){
        if(cartaVirada.dataset.emoji === cartaVirada2.dataset.emoji){
            cartaVirada = null;
            cartaVirada2 = null;
            pontuação++;
            pontos.innerText = "Pontuação:" + pontuação;
            bloqueado = false;
        } else {
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


loadbutton.addEventListener('click', () =>{
    startGame(gamecartas);
})


gamecartas.forEach((carta) => {
    carta.addEventListener('click', () => {
        desvirarCarta(carta); // passa a carta clicada
    });
});