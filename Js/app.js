// SELETORES DO DOM 

const btnJogar = document.getElementById('loadbttn');
const spanPontos = document.getElementById('pontos')
const containerCartas = document.getElementById('container-cartas');
const spanContador = document.getElementById('contador')
const toggleTema = document.getElementById('toggle-tema');
const mensagemResultado = document.getElementById('mensagem-resultado');

// CONSTANTES E ESTADOS DO JOGO 

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const Tempo_Virar_Cartas_Inicio = 1500; // Tempo em milissegundos para virar as cartas no início do jogo
const Tempo_Esconder_Cartas_Erradas = 900; // Tempo em milissegundos para esconder as cartas erradas

// OBJETO QUE CENTRALIZA O ESTADO DO JOGO 

const gameState = {
    tempo: 0,
    intervalo: null,
    primeiraCarta: null,
    segundaCarta: null,
    pontuacao: 0,
    paresEncontrados: 0,
    tabuleiroBloqueado: false,
}

// FUNÇÕES PRINCIPAIS DO JOGO //

// FUNÇÃO PARA INICIAR O JOGO //

function iniciarJogo() {
   // RESETA O ESTADO E GERA UM NOVO TABULEIRO
    resetarEstado();
    gerarTabuleiro();

    // DESABILITA O CLIQUE
    btnJogar.disabled = true;

    const todasAsCartas = document.querySelectorAll('.card');

    //  VIRA AS CARTAS PARA CIMA
    todasAsCartas.forEach(carta => {
        carta.classList.remove('virado');
        carta.innerHTML = carta.dataset.emoji;
    });

    //  VIRA AS CARTAS PARA BAIXO 
    setTimeout(() => {
        todasAsCartas.forEach(carta => {
            carta.classList.add('virado');
            carta.innerHTML = '';
            carta.style.pointerEvents = 'auto'; 
        });

        iniciarTimer();

        // Reabilita o botão, que agora pode servir para reiniciar.
        btnJogar.disabled = false;
        
    }, Tempo_Virar_Cartas_Inicio);
}

/** <-- 1. Início do Bloco JSDoc
 * * Lida com o clique em uma carta.  <-- 2. Descrição da Função
 * * @param {HTMLElement} cartaClicada - O elemento da carta que foi clicada.  <-- 3. Descrição do Parâmetro
 * */ // <-- Fim do Bloco JSDoc

function handleCliqueCarta(cartaClicada) {
    // Ignora o clique se o tabuleiro estiver bloqueado, a carta já foi clicada ou já formou par.
    if (gameState.tabuleiroBloqueado || cartaClicada === gameState.primeiraCarta || cartaClicada.classList.contains('acertou')) {
        return;
    }
    revelarCarta(cartaClicada);
    if (!gameState.primeiraCarta) {
        gameState.primeiraCarta = cartaClicada;
    } else {
        gameState.segundaCarta = cartaClicada;
        gameState.tabuleiroBloqueado = true; // Bloqueia o tabuleiro enquanto verifica o par.
        verificarPar();
    }
}

/**
 * Verifica se as duas cartas viradas formam um par.
 */

function verificarPar() {
    const ehPar = gameState.primeiraCarta.dataset.emoji === gameState.segundaCarta.dataset.emoji;

    if (ehPar) {
        processarParCorreto();
    } else {
        processarParErrado();
    }
}

// FUNÇÕES AUXILIARES //

/**
 * Gera as cartas dinamicamente e as insere no DOM.
 */

function gerarTabuleiro() {
    containerCartas.innerHTML = ''; // Limpa o tabuleiro antes de gerar um novo.
    const baralho = embaralhar([...EMOJIS, ...EMOJIS]);
    
    baralho.forEach(emoji => {
        const carta = document.createElement('div');
        carta.className = 'card virado'; // Cria a carta já virada
        carta.dataset.emoji = emoji;
        carta.style.pointerEvents = 'none'; // Impede o clique antes do jogo começar
        containerCartas.appendChild(carta);
    });
}

/**
 * Vira a carta para mostrar o emoji.
 * @param {HTMLElement} carta - A carta a ser revelada.
 */
function revelarCarta(carta) {
    carta.classList.remove('virado');
    carta.innerHTML = carta.dataset.emoji;
}

/**
 * Esconde o emoji de uma carta.
 * @param {HTMLElement} carta - A carta a ser escondida.
 */
function esconderCarta(carta) {
    carta.classList.add('virado');
    carta.innerHTML = '';
}


/**
 * Ações a serem tomadas quando um par correto é encontrado.
 */
function processarParCorreto() {
    gameState.primeiraCarta.classList.add('acertou');
    gameState.segundaCarta.classList.add('acertou');
    
    gameState.pontuacao++;
    gameState.paresEncontrados++;
    spanPontos.innerText = "Pontuação: " + gameState.pontuacao;
    
    resetarSelecao();
    checarVitoria();
}

/**
 * Ações a serem tomadas quando um par incorreto é encontrado.
 */
function processarParErrado() {
    setTimeout(() => {
        esconderCarta(gameState.primeiraCarta);
        esconderCarta(gameState.segundaCarta);
        resetarSelecao();
    }, Tempo_Esconder_Cartas_Erradas);
}

/**
 * Verifica se todas as cartas já foram encontradas.
 */
function checarVitoria() {
    if (gameState.paresEncontrados === EMOJIS.length) {
        pararTimer();
        mensagemResultado.style.display = 'block';

        const audio = new Audio('Assets/audio/crowd_small_chil_ec049202_9klCwI6.mp3');
        audio.play();
        
        setTimeout(() => {
            mensagemResultado.style.display = 'none';
        }, 10000);
    }
}

/**
 * Reseta o estado das variáveis de seleção e desbloqueia o tabuleiro.
 */
function resetarSelecao() {
    gameState.primeiraCarta = null;
    gameState.segundaCarta = null;
    gameState.tabuleiroBloqueado = false;
}

/**
 * Reseta todas as variáveis de estado para o início.
 */
function resetarEstado() {
    pararTimer();
    gameState.tempo = 0;
    gameState.pontuacao = 0;
    gameState.paresEncontrados = 0;
    resetarSelecao();
    spanContador.innerText = "Tempo: 0s";
    spanPontos.innerText = "Pontuação: 0";
    mensagemResultado.style.display = 'none';
}

/**
 * Algoritmo Fisher-Yates para embaralhar um array.
 * @param {Array} array - O array a ser embaralhado.
 * @returns {Array} - O array embaralhado.
 */
function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Inicia o cronômetro do jogo.
 */
function iniciarTimer() {
    gameState.intervalo = setInterval(() => {
        gameState.tempo++;
        spanContador.innerText = "Tempo: " + gameState.tempo + "s";
    }, 1000);
}

/**
 * Para o cronômetro do jogo.
 */
function pararTimer() {
    clearInterval(gameState.intervalo);
    gameState.intervalo = null;
}

// EVENT LISTENERS //

// Inicia o jogo ao clicar no botão "Jogar!".
btnJogar.addEventListener('click', iniciarJogo);

// Muda o tema ao clicar no toggle.
toggleTema.addEventListener('change', () => {
    document.body.classList.toggle('tema-azul');
});

// Event Delegation: um único listener no container para lidar com todos os cliques nas cartas.
containerCartas.addEventListener('click', (event) => {
    const cartaClicada = event.target.closest('.card');
    if (cartaClicada) {
        handleCliqueCarta(cartaClicada);
    }
}); 

// GERAR TABULEIRO INICIAL //
gerarTabuleiro();