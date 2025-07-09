let tempoEsgotado = false;
let usosPular = 0;
let usosCartas = 0;
let usosUniversitarios = 0;


// Variáveis para o piscar da resposta correta
let piscarResposta = false;
let respostaPiscarId = -1;
let tempoPiscarInicio = 0;
const DURACAO_PISCAR = 3000; // 3 segundos
const INTERVALO_PISCAR = 500; // 0.5 segundo

function keyPressed() {
  if (key === 'i' || key === 'I') {
    tela = "instrucoes";
  } else if (keyCode === ENTER) {
    // Resetar ajudas
    usosPular = 0;
    usosCartas = 0;
    usosUniversitarios = 0;

    // Reiniciar perguntas e jogo
    initPerguntas();  // Reembaralha perguntas e respostas
    iniciarJogo();    // Reinicia contadores e estado

    // Voltar para o menu
    tela = "menu";
  }
}


function jogar() {
  background(240);


  // Para cada resposta
  for (let i = 0; i < 4; i++) {
    let opTexto = questoes[qIndex].ops[i];
    let desabilitado = cartasEliminadas.includes(i);

    // Verifica o estado da resposta
    if (!podeResponder && respSel === i) {
      // Após responder, mostra verde/vermelho
      if (respSel === questoes[qIndex].cor) fill(0, 200, 0);
      else fill(200, 0, 0);
    }
    else if (desabilitado) {
      fill(180);
    }
    else {
      fill(220);
    }

    // Se ajuda dos universitários ativada, piscar a resposta correta
    if (piscarResposta && i === respostaPiscarId) {
      let tempoDecorrido = millis() - tempoPiscarInicio;
      if (tempoDecorrido > DURACAO_PISCAR) {
        // Termina o piscar
        piscarResposta = false;
      } else {
        // Pisca alternando fill entre amarelo e transparente
        if (floor(tempoDecorrido / INTERVALO_PISCAR) % 2 === 0) {
          fill(255, 255, 0); // amarelo
        } else {
          fill(220);
        }
      }
    }

    stroke(0);
    rect(width / 2 - 200, 200 + i * 60, 400, 50, 8);

    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(18);
    text(opTexto, width / 2 - 180, 200 + 25 + i * 60);
  }
}




// PRIMEIRA PARTE

let tela = "menu";
let botaoIniciar;
let fade = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");
  botaoIniciar = new Botao("🌱 Começar Jogo", width / 2 - 100, height / 2 + 60, 200, 50);

  // Inicialização das perguntas e início do jogo (segunda parte)
  initPerguntas();
  iniciarJogo();
}

function draw() {
  background(135, 206, 235); // Céu claro (campo)
  
  

  if (tela === "menu") {
    // Restaura o texto original se necessário
    if (botaoIniciar.txt !== "🌱 Começar Jogo") {
      botaoIniciar.txt = "🌱 Começar Jogo";
    }
    desenharMenu();
  }
  else if (tela === "instrucoes") desenharInstrucoes();
  else if (tela === "jogo") jogar(); // será definido depois
  else if (tela === "fim") telaFinal();
}


// =======================
// TELAS PRINCIPAIS
// =======================

function desenharMenu() {
  // Sol e grama para tema campo-cidade
  desenharCenarioCampoCidade();

  fill(255, fade);
  rect(0, 0, width, height); // Efeito de transição suave

  fill("black");
  textAlign(CENTER);
  textSize(40);
  text("🌾 Show do Milhão – Campo x Cidade 🏙️", width / 2, height / 3 - 40);

  textSize(20);
  fill(20);
  text("Festejando a conexão entre o campo e a cidade", width / 2, height / 3 + 10);

  botaoIniciar.mostrar();

  fill(0);
  textSize(16);
  text("Pressione 'I' para instruções", width / 2, height / 2 + 130);
}

function desenharInstrucoes() {
  background(200, 240, 200); // Verde claro

  fill(20, 90, 40);
  textAlign(LEFT);
  textSize(24);
  text("📘 Instruções:", 50, 60);

  textSize(17);
  text("🎯 Objetivo:\nResponda às perguntas corretamente para conquistar a vitória!", 50, 185);
  text("🌿 Tema:\nConexão entre o campo e a cidade, sustentabilidade e inovação.", 50, 125);
  text("🕹️ Controles:\nUse o mouse para clicar nas respostas.\nPressione ENTER para voltar ao menu.", 50, 255);
  text("🆘 Ajuda:\nAo decorrer você poderá utilizar as ajudas.\nSerão utilizados até: Pular = 10; Cartas = 5; Universitarios = 3. ", 50, 335);
  text("🏆 Pontos:\nCada pergunta correta equivale a +10, e incorreta -5.\nCaso o tempo acabe será descontado 5 pontos.", 50, 415);
}

function telaFinal() {
  background(30, 30, 30);
  fill(255);
  textAlign(CENTER);
  
  textSize(36);
  text("🎉 Parabéns por jogar!", width / 2, height / 2 - 60);
  
  if (pontos == 0) fill("black");
  if (pontos < 0) fill("red");
  if (pontos > 0) fill("green");
  textSize(24);
  text(`🏆 Sua pontuação final foi: ${pontos} pontos`, width / 2, height / 2);

  fill(255);
  textSize(18);
  text("Pressione ENTER para voltar ao menu", width / 2, height / 2 + 50);
}


// =======================
// INTERAÇÕES
// =======================

function mousePressed() {
  if (tela === "menu" && botaoIniciar.verificarClique()) {
    fade = 0;

    // Opcional: mudar o texto do botão ou mostrar "Carregando..."
    botaoIniciar.txt = "Carregando...";

    setTimeout(() => {
      iniciarJogo(); // inicialização do jogo (próxima parte)
      tela = "jogo";
    }, 1000);
  }
}

// =======================
// ELEMENTO VISUAL: BOTÃO
// =======================

class Botao {
  constructor(txt, x, y, w, h) {
    this.txt = txt;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  mostrar() {
    if (this.verificarHover()) {
      fill(255, 255, 200);
      cursor(HAND);
    } else {
      fill(255);
      cursor(ARROW);
    }

    stroke(0);
    strokeWeight(1.5);
    rect(this.x, this.y, this.w, this.h, 12);

    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.txt, this.x + this.w / 2, this.y + this.h / 2);
  }

  verificarClique() {
    return this.verificarHover();
  }

  verificarHover() {
    return mouseX > this.x && mouseX < this.x + this.w &&
           mouseY > this.y && mouseY < this.y + this.h;
  }
}

// =======================
// CENÁRIO VISUAL INICIAL
// =======================

function desenharCenarioCampoCidade() {
  // Sol
  noStroke();
  fill(255, 204, 0);
  ellipse(100, 100, 100);

  // Grama
  fill(34, 139, 34);
  rect(0, height - 100, width, 100);

  // Cidade (prédios)
  fill(80);
  rect(width - 150, height - 200, 40, 100);
  rect(width - 100, height - 180, 30, 80);
  rect(width - 60, height - 220, 35, 120);

  // Campo (silo e árvore)
  fill(160, 82, 45);
  rect(60, height - 170, 30, 70); // silo
  fill(34, 139, 34);
  ellipse(150, height - 110, 60); // copa
  fill(139, 69, 19);
  rect(140, height - 110, 20, 40); // tronco
}

// SEGUNDA PARTE

let perguntas = [];
let questoes = [];
let pergunta;
let qIndex = 0;
let pontos = 0;
let podeResponder = true;
let respSel = -1;
let tempoInicio = 0;
const TEMPO_MAX = 5;  // Tempo para responder (12s)
let modos = { NONE:0, INTRO:1, OUTRO:2 };
let modo = modos.NONE;
let trans = 0;


let ajudas = { pular:true, cartas:true, uni:true };
let cartasEliminadas = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function embaralharRespostas(pergunta) {
  let opcoes = pergunta.ops.map((op, index) => ({ texto: op, originalIndex: index }));
  opcoes = opcoes.sort(() => 0.5 - random());
  pergunta.ops = opcoes.map(op => op.texto);
  pergunta.cor = opcoes.findIndex(op => op.originalIndex === pergunta.cor);
  return pergunta;
}

function initPerguntas() {
  perguntas = [
    
  {
    en: "Qual a principal vantagem da energia solar em áreas urbanas?",
    ops: ["É limpa e renovável", "Polui o ambiente", "Depende do vento", "É cara demais"],
    cor: 0
  },
  {
    en: "O que é agricultura sustentável?",
    ops: ["Produzir alimentos com preservação ambiental.", "Usar muitos agrotóxicos", "Desmatar para plantar", "Cultivar só plantas exóticas"],
    cor: 0
  },
  {
    en: "Qual fonte de energia utiliza o vento para gerar eletricidade?",
    ops: ["Eólica", "Solar", "Hidráulica", "Fóssil"],
    cor: 0
  },
  {
    en: "Qual a importância da água da chuva nas zonas urbanas?",
    ops: ["Pode ser captada para uso", "Não serve para nada", "É poluída sempre", "Só molha o chão"],
    cor: 0
  },
  {
    en: "O que é compostagem?",
    ops: ["Transformar resíduos orgânicos em adubo", "Jogar lixo no rio", "Queimar lixo na rua", "Enterrar plástico"],
    cor: 0
  },
  {
    en: "Qual o benefício de ter áreas verdes nas cidades?",
    ops: ["Melhora a qualidade do ar", "Aumenta a poluição", "Tira espaço das pessoas", "Atrai insetos perigosos"],
    cor: 0
  },
  {
    en: "Como a energia hidráulica é gerada?",
    ops: ["Com o movimento da água", "Com o sol", "Com o vento", "Com combustíveis fósseis"],
    cor: 0
  },
  {
    en: "Por que é importante economizar água em casa?",
    ops: ["Para não faltar e preservar o recurso", "Para deixar a conta mais cara", "Porque água é infinita", "Para usar menos energia"],
    cor: 0
  },
  {
    en: "Qual destes é um benefício da agricultura urbana?",
    ops: ["Produzir alimentos frescos perto de casa", "Poluir o solo", "Aumentar o trânsito", "Derrubar árvores"],
    cor: 0
  },
  {
    en: "O que são energias renováveis?",
    ops: ["Fontes que não se esgotam", "Carvão e petróleo", "Usinas nucleares", "Gás natural"],
    cor: 0
  },
  {
    en: "Qual a função das placas solares?",
    ops: ["Converter luz em energia elétrica", "Produzir calor para aquecer água", "Gerar vento", "Armazenar água"],
    cor: 0
  },
  {
    en: "Qual destas ações ajuda a reduzir o lixo nas cidades?",
    ops: ["Reciclar materiais", "Jogar tudo no lixo comum", "Queimar lixo na rua", "Despejar lixo em rios"],
    cor: 0
  },
  {
    en: "O que é um sistema de irrigação inteligente?",
    ops: ["Irriga plantas só quando necessário", "Regar plantas todo dia igual", "Não usa sensores", "Molha as ruas"],
    cor: 0
  },
  {
    en: "Qual o impacto do desmatamento?",
    ops: ["Perda de biodiversidade", "Mais áreas verdes", "Mais água limpa", "Mais oxigênio"],
    cor: 0
  },
  {
    en: "Como a cidade pode ajudar o campo?",
    ops: ["Comprando produtos locais", "Ignorando os agricultores", "Construindo fábricas poluentes", "Jogando lixo no campo"],
    cor: 0
  },
  {
    en: "Qual destas não é uma fonte de energia renovável?",
    ops: ["Petróleo", "Solar", "Eólica", "Hidráulica"],
    cor: 0
  },
  {
    en: "O que significa sustentabilidade?",
    ops: ["Uso responsável dos recursos", "Consumir tudo sem pensar", "Poluir mais para crescer", "Destruir a natureza"],
    cor: 0
  },
  {
    en: "Qual a função dos sensores em casas inteligentes?",
    ops: ["Controlar luz, clima e segurança", "Fazer barulho", "Consumir muita energia", "Queimar comida"],
    cor: 0
  },
  {
    en: "Como podemos reduzir a poluição nas cidades?",
    ops: ["Usando transporte público", "Andando só de carro", "Queimando lixo", "Jogando lixo na rua"],
    cor: 0
  },
  {
    en: "O que é compostagem urbana?",
    ops: ["Transformar restos de comida em adubo", "Queimar lixo na rua", "Jogar lixo no rio", "Enterrar plástico"],
    cor: 0
  },
  {
    en: "Qual destas é uma prática de agricultura orgânica?",
    ops: ["Não usar agrotóxicos", "Usar muitos fertilizantes químicos", "Desmatar áreas naturais", "Queimar resíduos"],
    cor: 0
  },
  {
    en: "Qual a vantagem de usar bicicletas na cidade?",
    ops: ["Reduz poluição e trânsito", "Polui mais o ar", "Dá mais trânsito", "Custa muito caro"],
    cor: 0
  },
  {
    en: "O que é o ciclo da água?",
    ops: ["Evaporação, condensação e precipitação", "Só chuva", "Apenas rios", "Usar água da torneira"],
    cor: 0
  },
  {
    en: "Qual destas é uma fonte de energia limpa?",
    ops: ["Solar", "Carvão", "Óleo diesel", "Gasolina"],
    cor: 0
  },
  {
    en: "O que é uma área de preservação permanente?",
    ops: ["Lugar protegido para conservar a natureza", "Lugar para construir casas", "Área de lixo", "Fábrica poluente"],
    cor: 0
  },
  {
    en: "Por que plantar árvores nas cidades?",
    ops: ["Melhora o clima e o ar", "Só ocupa espaço", "Aumenta o trânsito", "Polui mais"],
    cor: 0
  },
  {
    en: "Qual a função do painel fotovoltaico?",
    ops: ["Gerar energia elétrica do sol", "Produzir vento", "Armazenar água", "Gerar calor"],
    cor: 0
  },
  {
    en: "O que é reutilização de água?",
    ops: ["Usar água usada para outra finalidade", "Jogar água fora", "Beber água suja", "Poluir rios"],
    cor: 0
  },
  {
    en: "Como a agricultura familiar ajuda a cidade?",
    ops: ["Produz alimentos frescos e saudáveis", "Polui o solo", "Derruba árvores", "Aumenta trânsito"],
    cor: 0
  },
  {
    en: "Qual o benefício da compostagem?",
    ops: ["Enriquece o solo com nutrientes", "Polui o ambiente", "Aumenta lixo", "Derruba árvores"],
    cor: 0
  },
  {
    en: "O que é energias não renováveis?",
    ops: ["Fontes que se esgotam, como petróleo", "Fontes infinitas", "Energia solar", "Energia eólica"],
    cor: 0
  },
  {
    en: "Qual o efeito da poluição sonora?",
    ops: ["Prejudica a saúde e o bem-estar", "Deixa o ambiente silencioso", "Ajuda a concentração", "Não existe poluição sonora"],
    cor: 0
  },
  {
    en: "Como reduzir o consumo de energia elétrica?",
    ops: ["Desligando aparelhos quando não usados", "Deixando tudo ligado", "Usando lâmpadas antigas", "Abrindo janelas à noite"],
    cor: 0
  },
  {
    en: "O que é agricultura urbana sustentável?",
    ops: ["Plantações sem agrotóxicos na cidade", "Usar muito veneno", "Queimar lixo", "Construir prédios no campo"],
    cor: 0
  },
  {
    en: "Qual a importância da reciclagem?",
    ops: ["Reduz lixo e poluição", "Aumenta lixo", "Jogar lixo em rios", "Queimar tudo"],
    cor: 0
  },
  {
    en: "O que é um recurso natural renovável?",
    ops: ["Que se regenera naturalmente, como água", "Que se esgota rápido", "Petróleo", "Carvão"],
    cor: 0
  },
  {
    en: "Qual destes é um benefício das hortas comunitárias?",
    ops: ["Fortalecer a comunidade e fornecer alimentos", "Aumentar poluição", "Destruir áreas verdes", "Derrubar árvores"],
    cor: 0
  },
  {
    en: "Como podemos ajudar a conservar o solo?",
    ops: ["Plantando árvores e evitando erosão", "Desmatando", "Jogando lixo no chão", "Usando muitos agrotóxicos"],
    cor: 0
  },
  {
    en: "Qual o papel das áreas verdes urbanas?",
    ops: ["Proporcionar lazer e qualidade de vida", "Aumentar poluição", "Ocultar lixo", "Fechar ruas"],
    cor: 0
  },
  {
    en: "Qual é o principal benefício da energia eólica?",
    ops: ["Não polui e é renovável", "Polui muito", "É cara demais", "Depende de petróleo"],
    cor: 0
  },
  {
    en: "O que é captação de água da chuva?",
    ops: ["Coletar água da chuva para uso", "Desperdiçar água", "Molhar a rua", "Poluir rios"],
    cor: 0
  },
  {
    en: "Por que conservar o meio ambiente é importante?",
    ops: ["Garantir recursos para as futuras gerações", "Não é importante", "Destruir a natureza", "Poluir tudo"],
    cor: 0
  },
  {
    en: "O que é consumo consciente?",
    ops: ["Comprar e usar com responsabilidade", "Comprar sem pensar", "Jogar lixo na rua", "Desperdiçar água"],
    cor: 0
  },
  {
    en: "Como a coleta seletiva ajuda o meio ambiente?",
    ops: ["Facilita a reciclagem e reduz o lixo", "Aumenta o lixo", "Deixa a cidade suja", "Não faz diferença"],
    cor: 0
  },
  {
    en: "O que são cidades sustentáveis?",
    ops: ["Cidades com desenvolvimento sustentável", "Cidades com muitos carros", "Cidades que desmatam", "Cidades sem áreas verdes"],
    cor: 0
  },
  {
    en: "Por que devemos proteger as nascentes dos rios?",
    ops: ["Elas garantem a água dos rios", "São inúteis", "Podem ser aterradas", "Servem para construção civil"],
    cor: 0
  },
  {
    en: "Qual atitude ajuda no uso racional da água?",
    ops: ["Fechar a torneira ao escovar os dentes", "Lavar calçada com mangueira", "Deixar o chuveiro ligado", "Jogar água fora"],
    cor: 0
  },
  {
    en: "Qual o papel da educação ambiental?",
    ops: ["Ensinar a cuidar do planeta", "Incentivar o consumo excessivo", "Promover a poluição", "Desvalorizar a natureza"],
    cor: 0
  },
  {
    en: "Como a tecnologia pode ajudar a sustentabilidade?",
    ops: ["Com sensores e energia limpa", "Gastando mais recursos", "Aumentando a poluição", "Destruindo o meio ambiente"],
    cor: 0
  }
  ];

  // Embaralhar perguntas
perguntas = perguntas.sort(() => 0.5 - random());

// Embaralhar as alternativas de cada pergunta
perguntas = perguntas.map(p => embaralharRespostas(p));

// Selecionar as primeiras 50 perguntas
questoes = perguntas.slice(0, 50);
}

function iniciarJogo() {
  qIndex = 0;
  pontos = 0;
  respSel = -1;
  podeResponder = true;
  tempoInicio = millis();
  tempoEsgotado = false;
  cartasEliminadas = [];

  // ZERA OS USOS DAS AJUDAS
  usosPular = 0;
  usosCartas = 0;
  usosUniversitarios = 0;

  // REATIVA AS AJUDAS
  ajudas = {
    cartas: true,
    uni: true
  };
}


function jogar() {
  background(240);
  
  // Mostrar pergunta
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(`Pergunta ${qIndex + 1} de 50`, width / 2, 60);
  textSize(26);
  text(questoes[qIndex].en, width / 10, 120, width * 0.8);

  // Mostrar opções
  let opY = 200;
  for (let i = 0; i < 4; i++) {
    let opTexto = questoes[qIndex].ops[i];
    let desabilitado = cartasEliminadas.includes(i);

    // Cor padrão
    let corFill = 220; // cinza claro

    if (!podeResponder && respSel === i) {
      corFill = (respSel === questoes[qIndex].cor) ? color(0, 200, 0) : color(200, 0, 0);
    } else if (desabilitado) {
      corFill = 180;
    } else {
      corFill = 220;
    }

    // Se o piscar estiver ativo e esta é a resposta correta, alterna a cor
    if (piscarResposta && i === respostaPiscarId) {
      let tempoDecorrido = millis() - tempoPiscarInicio;
      if (tempoDecorrido > DURACAO_PISCAR) {
        piscarResposta = false; // desliga piscar após tempo
      } else {
        // alterna entre amarelo e cinza claro a cada INTERVALO_PISCAR
        if (floor(tempoDecorrido / INTERVALO_PISCAR) % 2 === 0) {
          corFill = color(255, 255, 0); // amarelo
        } else {
          corFill = color(220);
        }
      }
    }

    fill(corFill);
    stroke(0);
    rect(width / 2 - 220, opY + i * 60, 440, 50, 8);

    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(18);
    text(opTexto, width / 2 - 180, opY + 25 + i * 60);
  }

  // Mostrar tempo restante
  let tempoPassado = (millis() - tempoInicio) / 1000;
  let tempoRestante = max(0, TEMPO_MAX - tempoPassado);
  

  if (tempoRestante <= 0 && podeResponder) {
    podeResponder = false;
    respSel = -1;
    setTimeout(proximaPergunta, 1500);
    tempoEsgotado = true;
    pontos -= 5;
  }
  

  // Barra de tempo visual
  let barraLarguraMax = 600;
  let barraAltura = 25
  let barraX = width / 2 - barraLarguraMax / 2;
  let barraY = height - 285;

  let proporcao = tempoRestante / TEMPO_MAX;
  let barraLarguraAtual = proporcao * barraLarguraMax;

  // Cor da barra muda conforme o tempo
  let r = map(proporcao, 0, 1, 255, 0);     // Vermelho aumenta
  let g = map(proporcao, 0, 1, 0, 200);     // Verde diminui
  fill(r, g, 0);
  noStroke();
  rect(barraX, barraY, barraLarguraAtual, barraAltura, 10);

  // Borda da barra
  noFill();
  stroke(0);
  rect(barraX, barraY, barraLarguraMax, barraAltura, 10);

  // Mostrar pontos
  if (pontos == 0) fill("black");
  if (pontos < 0) fill("red");
  if (pontos > 0) fill("green");
  textAlign(LEFT);
  textSize(18);
  text(`Pontos: ${pontos}`, 20, 30);
  

  // Mostrar ajudas
  mostrarAjudas();

  // Finalizar o jogo ao chegar na última pergunta
  if (qIndex >= questoes.length) {
    tela = "fim";
  }
}

function mostrarAjudas() {
  let xBase = width / 2 - 165;
  let yBase = height - 50;


  // Botão pular pergunta
  fill(usosPular < 10 ? 'green' : 'gray');
  rect(xBase, yBase, 100, 30, 5);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Pular", xBase + 50, yBase + 15);

  // Botão cartas
  fill(usosCartas < 5 ? 'blue' : 'gray');
  rect(xBase + 110, yBase, 100, 30, 5);
  fill(255);
  text("Cartas", xBase + 160, yBase + 15);

  // Botão universitários
  fill(usosUniversitarios < 3 ? 'purple' : 'gray');
  rect(xBase + 220, yBase, 120, 30, 5);
  fill(255);
  text("Universitários", xBase + 280, yBase + 15);
}


function mouseClicked() {
  if (tela !== "jogo" || !podeResponder) return;

  // Verificar clique nas opções
  let opY = 200;
  for (let i = 0; i < 4; i++) {
    if (
      mouseX > width / 2 - 200 && mouseX < width / 2 + 200 &&
      mouseY > opY + i * 60 && mouseY < opY + i * 60 + 50
    ) {
      if (cartasEliminadas.includes(i)) {
        // Não pode clicar em opções eliminadas
        return;
      }
      respSel = i;
      podeResponder = false;
      verificarResposta();
      break;
    }
  }

  // Verificar clique nas ajudas
  let xBase = width / 2 - 165;
  let yBase = height - 50;

 if (
  mouseX > xBase && mouseX < xBase + 100 &&
  mouseY > yBase && mouseY < yBase + 30 &&
  usosPular < 10
) {
  usosPular++;
  podeResponder = false;
  proximaPergunta();
}


  if (
    mouseX > xBase + 110 && mouseX < xBase + 210 &&
    mouseY > yBase && mouseY < yBase + 30 &&
    ajudas.cartas
  ) {
    usarCartas();
  }

  if (
    mouseX > xBase + 220 && mouseX < xBase + 340 &&
    mouseY > yBase && mouseY < yBase + 30 &&
    ajudas.uni
  ) {
    usarUniversitarios();
  }
}


function verificarResposta() {
  let correta = questoes[qIndex].cor;

  if (tempoEsgotado === true) {
    pontos -= 5;
  } else if (respSel === correta) {
    pontos += 10;
  } else {
    pontos -= 5;
  }

  setTimeout(proximaPergunta, 1500);
}


function proximaPergunta() {
  qIndex++;
  if (qIndex >= questoes.length) {
    tela = "fim";
  } else {
    respSel = -1;
    podeResponder = true;
    tempoInicio = millis();
    cartasEliminadas = [];
  }
}

// Defina esta variável no início do código:


function usarCartas() {
  if (usosCartas >= 5 || cartasEliminadas.length > 0) return; // bloqueia se usar demais ou já eliminou cartas

  let correta = questoes[qIndex].cor;
  let opcoes = [0, 1, 2, 3].filter(i => i !== correta);

  cartasEliminadas = [];
  while (cartasEliminadas.length < 2) {
    let idx = floor(random(opcoes));
    if (!cartasEliminadas.includes(idx)) {
      cartasEliminadas.push(idx);
    }
  }

  usosCartas++;

  if (usosCartas >= 5) {
    ajudas.cartas = false; // desativa a ajuda após 5 usos
  }
}


function desenharOpcoes() {
  let opY = 200;

  for (let i = 0; i < 4; i++) {
    let pintarAmarelo = false;

    if (piscarResposta && i === respostaPiscarId) {
      let tempoPassado = millis() - tempoPiscarInicio;
      let ciclo = floor(tempoPassado / INTERVALO_PISCAR);
      
      // alterna a cor a cada 0.5s: ligado nos ciclos pares
      pintarAmarelo = (ciclo % 2 === 0);

      // termina o piscar após 3 segundos
      if (tempoPassado > DURACAO_PISCAR) {
        piscarResposta = false;
      }
    }

    if (cartasEliminadas.includes(i)) {
      fill('black');
    } else if (pintarAmarelo) {
      fill('yellow');
    } else {
      fill('white');
    }

    rect(width / 2 - 200, opY + i * 60, 500, 50, 5);

    fill(0);
    textAlign(LEFT, CENTER);
    text(questoes[qIndex].opcoes[i], width / 2 - 190, opY + i * 60 + 25);
  }
}

function usarUniversitarios() {
  if (!ajudas.uni || piscarResposta || usosUniversitarios >= 3) return; // bloqueia se já estiver piscando ou ultrapassou 3 usos

  respostaPiscarId = questoes[qIndex].cor;
  piscarResposta = true;
  tempoPiscarInicio = millis();

  usosUniversitarios++; // conta o uso

  if (usosUniversitarios >= 3) {
    ajudas.uni = false; // desativa ajuda após 3 usos
  }
}
