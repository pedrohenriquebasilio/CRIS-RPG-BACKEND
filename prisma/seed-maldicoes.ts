/**
 * Seed: Maldições Grau 4 e Grau 3
 *
 * 12 fichas de maldições prontas para uso em combate.
 * Executar via: npx ts-node prisma/seed-maldicoes.ts
 *
 * Pré-requisito: seed principal já executado (especializações, skills, aptidões existem).
 */
import 'dotenv/config';
import { PrismaClient, Atributo, TipoDano } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// DEFINIÇÕES DAS MALDIÇÕES
// ============================================================

interface MaldicaoTechnique {
  nome: string;
  nivel: number;
  custoEnergia: number;
  atributoBase: Atributo;
  tipoDano?: TipoDano;
  damageDice?: string;
  descricaoLivre: string;
  skillNome?: string;
}

interface MaldicaoDefinition {
  nome: string;
  grau: '4' | '3';
  nivel: number;
  specializationNome: string;
  hpMax: number;
  energiaMax: number;
  maestriaBonus: number;
  attributes: { FOR: number; AGI: number; VIG: number; INT: number; PRE: number };
  skillsTreinadas: string[];
  techniques: MaldicaoTechnique[];
  aptitudesNomes: string[];
  descricao: string; // flavor — armazenada em notas/log, não em campo do modelo
}

const maldicoes: MaldicaoDefinition[] = [
  // ================================================================
  //  GRAU 4 — Maldições menores (nível 2-4, stats modestos)
  // ================================================================
  {
    nome: 'Sombra Faminta',
    grau: '4',
    nivel: 2,
    specializationNome: 'Lutador',
    hpMax: 24,
    energiaMax: 8,
    maestriaBonus: 3,
    attributes: { FOR: 3, AGI: 4, VIG: 2, INT: 0, PRE: 1 },
    skillsTreinadas: ['Furtividade', 'Luta', 'Iniciativa'],
    techniques: [
      {
        nome: 'Mordida Sombria',
        nivel: 1,
        custoEnergia: 2,
        atributoBase: Atributo.FOR,
        tipoDano: TipoDano.FISICO,
        damageDice: '1d8+3',
        descricaoLivre:
          'A sombra abre uma boca disforme no peito e avança com uma mordida que drena calor. O alvo sente o ponto de impacto gelar instantaneamente.',
      },
      {
        nome: 'Passo Etéreo',
        nivel: 1,
        custoEnergia: 3,
        atributoBase: Atributo.AGI,
        descricaoLivre:
          'Dissolve-se em fumaça negra e reaparece até 6 metros de distância, ignorando terreno difícil. Não provoca ataques de oportunidade.',
      },
    ],
    aptitudesNomes: ['Furtividade Sobrenatural'],
    descricao:
      'Resíduo de uma maldição de assassinato. Uma silhueta bidimensional que rasteja pelas paredes, alimentando-se do medo de quem a percebe. Ataca com mordidas que sugam calor corporal.',
  },
  {
    nome: 'Boneco de Pano Amaldiçoado',
    grau: '4',
    nivel: 3,
    specializationNome: 'Controlador',
    hpMax: 20,
    energiaMax: 15,
    maestriaBonus: 2,
    attributes: { FOR: 1, AGI: 3, VIG: 2, INT: 3, PRE: 4 },
    skillsTreinadas: ['Enganação', 'Intimidação', 'Ocultismo'],
    techniques: [
      {
        nome: 'Fios Invisíveis',
        nivel: 2,
        custoEnergia: 4,
        atributoBase: Atributo.PRE,
        tipoDano: TipoDano.MENTAL,
        damageDice: '1d6+2',
        descricaoLivre:
          'Lança fios de energia amaldiçoada invisíveis que se conectam ao sistema nervoso do alvo. Em caso de sucesso, o alvo sofre desvantagem em ações físicas por 1 rodada enquanto seus membros se movem contra a própria vontade.',
        skillNome: 'Ocultismo',
      },
      {
        nome: 'Riso Enlouquecedor',
        nivel: 1,
        custoEnergia: 3,
        atributoBase: Atributo.PRE,
        tipoDano: TipoDano.MENTAL,
        damageDice: '1d4',
        descricaoLivre:
          'Emite uma gargalhada estridente e sobrenatural. Todos num raio de 4 metros devem fazer teste de Vontade (CD 13) ou ficam Atordoados até o início do próximo turno do boneco.',
      },
      {
        nome: 'Troca de Corpos',
        nivel: 2,
        custoEnergia: 5,
        atributoBase: Atributo.INT,
        descricaoLivre:
          'Tenta projetar sua consciência para o corpo de um alvo em até 9 metros. O alvo faz teste de Vontade (CD 14). Em falha, o boneco controla o corpo do alvo por 1 turno enquanto seu corpo de pano fica inerte.',
        skillNome: 'Feitiçaria',
      },
    ],
    aptitudesNomes: ['Domínio Simples'],
    descricao:
      'Um brinquedo de criança imbuído com energia amaldiçoada residual. Mede 40cm mas se move com agilidade perturbadora. Seus olhos de botão brilham em roxo quando manipula fios de energia para controlar adversários como marionetes.',
  },
  {
    nome: 'Enxame de Mariposas Cinzentas',
    grau: '4',
    nivel: 2,
    specializationNome: 'Especialista em Técnica',
    hpMax: 15,
    energiaMax: 16,
    maestriaBonus: 3,
    attributes: { FOR: 0, AGI: 5, VIG: 1, INT: 2, PRE: 2 },
    skillsTreinadas: ['Furtividade', 'Feitiçaria', 'Acrobacia'],
    techniques: [
      {
        nome: 'Nuvem Sufocante',
        nivel: 1,
        custoEnergia: 3,
        atributoBase: Atributo.INT,
        tipoDano: TipoDano.ENERGETICO,
        damageDice: '2d4',
        descricaoLivre:
          'O enxame converge sobre um alvo, enchendo boca e narinas com mariposas. O alvo sofre dano e deve fazer teste de Fortitude (CD 12) ou fica Sufocando (perde ação bônus no próximo turno).',
        skillNome: 'Feitiçaria',
      },
      {
        nome: 'Dispersão',
        nivel: 1,
        custoEnergia: 2,
        atributoBase: Atributo.AGI,
        descricaoLivre:
          'O enxame se espalha explosivamente. Até o início do próximo turno, ataques corpo a corpo contra o enxame têm desvantagem. O enxame não pode atacar enquanto disperso.',
      },
    ],
    aptitudesNomes: ['Aura Elemental'],
    descricao:
      'Centenas de mariposas cinzentas que se movem como uma mente única. Nasceram de uma maldição de solidão — cada mariposa carrega um fragmento de memória roubada. Juntas formam silhuetas vagamente humanoides antes de atacar.',
  },
  {
    nome: 'Espelho Ambulante',
    grau: '4',
    nivel: 3,
    specializationNome: 'Suporte',
    hpMax: 22,
    energiaMax: 15,
    maestriaBonus: 3,
    attributes: { FOR: 2, AGI: 2, VIG: 3, INT: 4, PRE: 2 },
    skillsTreinadas: ['Percepção', 'Intuição', 'Enganação', 'Vontade'],
    techniques: [
      {
        nome: 'Reflexo Distorcido',
        nivel: 2,
        custoEnergia: 4,
        atributoBase: Atributo.INT,
        tipoDano: TipoDano.MENTAL,
        damageDice: '1d8+2',
        descricaoLivre:
          'Mostra ao alvo uma versão distorcida e horrível de si mesmo na superfície espelhada. Teste de Vontade (CD 14). Falha: o alvo sofre dano mental e fica Abalado (-2 em testes de PRE) por 2 rodadas.',
        skillNome: 'Intimidação',
      },
      {
        nome: 'Copiar Técnica',
        nivel: 2,
        custoEnergia: 5,
        atributoBase: Atributo.INT,
        descricaoLivre:
          'Após observar uma técnica sendo usada, o Espelho pode replicá-la uma vez com seus próprios atributos. A cópia tem -2 no teste de acerto. Funciona apenas com técnicas de nível 1-2.',
        skillNome: 'Feitiçaria',
      },
      {
        nome: 'Superfície Cortante',
        nivel: 1,
        custoEnergia: 2,
        atributoBase: Atributo.FOR,
        tipoDano: TipoDano.FISICO,
        damageDice: '1d6+2',
        descricaoLivre:
          'Fragmentos da superfície espelhada se projetam como lâminas contra um alvo adjacente. Se causar dano, o alvo sangra (1d4 de dano no início de seus próximos 2 turnos).',
      },
    ],
    aptitudesNomes: ['Cobrir-se'],
    descricao:
      'Um espelho de corpo inteiro com moldura de ferro retorcido que flutua a poucos centímetros do chão. Sua superfície mostra versões distorcidas da realidade. Nasceu da vaidade obsessiva de um feiticeiro que não aceitava envelhecer.',
  },
  {
    nome: 'Cão de Cinzas',
    grau: '4',
    nivel: 2,
    specializationNome: 'Lutador',
    hpMax: 26,
    energiaMax: 6,
    maestriaBonus: 3,
    attributes: { FOR: 4, AGI: 3, VIG: 3, INT: 0, PRE: 1 },
    skillsTreinadas: ['Atletismo', 'Luta', 'Fortitude', 'Percepção'],
    techniques: [
      {
        nome: 'Investida Incandescente',
        nivel: 1,
        custoEnergia: 3,
        atributoBase: Atributo.FOR,
        tipoDano: TipoDano.FISICO,
        damageDice: '1d10+4',
        descricaoLivre:
          'Avança em linha reta até 9 metros e ataca com uma mordida que inflama em cinzas vivas. Se o ataque acertar, o alvo pega fogo (1d4 de dano de energia no início dos próximos 2 turnos, pode apagar com ação).',
      },
      {
        nome: 'Uivo Abrasador',
        nivel: 1,
        custoEnergia: 3,
        atributoBase: Atributo.PRE,
        tipoDano: TipoDano.ENERGETICO,
        damageDice: '1d6',
        descricaoLivre:
          'Solta um uivo que libera uma onda de calor em cone de 4 metros. Todos na área devem fazer teste de Fortitude (CD 12) ou sofrem dano e ficam Cegos por fumaça até o fim do próximo turno.',
      },
    ],
    aptitudesNomes: ['Estímulo Muscular'],
    descricao:
      'Um mastim enorme feito de brasas vivas e ossos carbonizados. Onde pisa, a grama queima. Nasceu do ódio de um cão que foi queimado vivo pelo próprio dono — agora caça qualquer coisa que cheire a traição.',
  },
  {
    nome: 'Lágrima Congelada',
    grau: '4',
    nivel: 3,
    specializationNome: 'Especialista em Técnica',
    hpMax: 18,
    energiaMax: 20,
    maestriaBonus: 3,
    attributes: { FOR: 1, AGI: 2, VIG: 2, INT: 5, PRE: 3 },
    skillsTreinadas: ['Feitiçaria', 'Ocultismo', 'Vontade', 'Medicina'],
    techniques: [
      {
        nome: 'Toque Gélido',
        nivel: 1,
        custoEnergia: 2,
        atributoBase: Atributo.INT,
        tipoDano: TipoDano.ENERGETICO,
        damageDice: '1d6+3',
        descricaoLivre:
          'Toca o alvo com dedos translúcidos, congelando o ponto de contato. O alvo deve fazer teste de Fortitude (CD 13) ou tem sua velocidade reduzida pela metade por 1 rodada.',
        skillNome: 'Feitiçaria',
      },
      {
        nome: 'Prisão de Gelo',
        nivel: 2,
        custoEnergia: 5,
        atributoBase: Atributo.INT,
        tipoDano: TipoDano.ENERGETICO,
        damageDice: '2d6+3',
        descricaoLivre:
          'Cristais de gelo amaldiçoado brotam do chão ao redor do alvo num raio de 1,5m. Teste de Reflexos (CD 14). Falha: o alvo fica Imobilizado por 1 rodada e sofre dano. Sucesso: metade do dano, sem imobilização.',
        skillNome: 'Feitiçaria',
      },
      {
        nome: 'Lamento Glacial',
        nivel: 2,
        custoEnergia: 4,
        atributoBase: Atributo.PRE,
        tipoDano: TipoDano.MENTAL,
        damageDice: '1d8',
        descricaoLivre:
          'Emite um choro fantasmagórico que evoca memórias tristes. Todos num raio de 6 metros fazem teste de Vontade (CD 14). Falha: Abalado por 2 rodadas. Se já estiver Abalado, fica Paralisado por 1 rodada em vez disso.',
      },
    ],
    aptitudesNomes: ['Aura Elemental', 'Projetar Energia'],
    descricao:
      'O espectro de uma criança que morreu de frio, preservada eternamente numa lágrima congelada do tamanho de um punho que flutua onde seria o coração. Seu corpo translúcido emite um brilho azulado e tudo ao redor congela lentamente.',
  },

  // ================================================================
  //  GRAU 3 — Maldições intermediárias (nível 5-7, stats superiores)
  // ================================================================
  {
    nome: 'Carniçal do Pacto Quebrado',
    grau: '3',
    nivel: 5,
    specializationNome: 'Restringido',
    hpMax: 51,
    energiaMax: 0,
    maestriaBonus: 5,
    attributes: { FOR: 6, AGI: 3, VIG: 7, INT: 1, PRE: 2 },
    skillsTreinadas: ['Atletismo', 'Luta', 'Fortitude', 'Intimidação'],
    techniques: [
      {
        nome: 'Garra do Pacto',
        nivel: 3,
        custoEnergia: 0,
        atributoBase: Atributo.FOR,
        tipoDano: TipoDano.FISICO,
        damageDice: '2d8+6',
        descricaoLivre:
          'Garras enormes que rasgam carne e armadura. Em acerto crítico, além do dano multiplicado, o alvo faz teste de Fortitude (CD 16) ou sofre Sangramento Grave (2d4 por turno, precisa de Medicina CD 14 para estancar).',
      },
      {
        nome: 'Devorar',
        nivel: 3,
        custoEnergia: 0,
        atributoBase: Atributo.FOR,
        tipoDano: TipoDano.FISICO,
        damageDice: '3d6+6',
        descricaoLivre:
          'Só pode ser usado contra alvos Imobilizados, Derrubados ou Paralisados. O Carniçal morde e rasga, recuperando HP igual a metade do dano causado.',
      },
      {
        nome: 'Rugido Territorial',
        nivel: 2,
        custoEnergia: 0,
        atributoBase: Atributo.PRE,
        descricaoLivre:
          'Solta um rugido que faz o chão tremer. Todos num raio de 6m fazem teste de Vontade (CD 15). Falha: Amedrontado por 2 rodadas (desvantagem em ataques contra o Carniçal). Funciona 1x por combate.',
      },
    ],
    aptitudesNomes: ['Estímulo Muscular'],
    descricao:
      'Um feiticeiro que fez um pacto com uma entidade e o quebrou. Seu corpo se deformou numa massa de músculo, osso exposto e carne escurecida. Não usa energia — toda sua maldição se manifesta em regeneração física e força bruta absurda. Mede 2,5 metros e caminha de quatro.',
  },
  {
    nome: 'Tecelã da Agonia',
    grau: '3',
    nivel: 6,
    specializationNome: 'Controlador',
    hpMax: 35,
    energiaMax: 30,
    maestriaBonus: 3,
    attributes: { FOR: 2, AGI: 4, VIG: 3, INT: 6, PRE: 5 },
    skillsTreinadas: ['Feitiçaria', 'Ocultismo', 'Percepção', 'Vontade', 'Intuição'],
    techniques: [
      {
        nome: 'Teia de Nervos',
        nivel: 3,
        custoEnergia: 6,
        atributoBase: Atributo.INT,
        tipoDano: TipoDano.MENTAL,
        damageDice: '2d6+4',
        descricaoLivre:
          'Conecta-se ao sistema nervoso de até 2 alvos em 9m. Teste de Vontade (CD 16). Falha: o alvo sofre dano e toda dor sentida por um é espelhada no outro por 3 rodadas. Se um alvo sofrer dano, o outro sofre metade.',
        skillNome: 'Feitiçaria',
      },
      {
        nome: 'Agulhas de Sofrimento',
        nivel: 2,
        custoEnergia: 4,
        atributoBase: Atributo.INT,
        tipoDano: TipoDano.ENERGETICO,
        damageDice: '3d4+3',
        descricaoLivre:
          'Projeta agulhas invisíveis de energia amaldiçoada. Atingem automaticamente (sem teste de acerto) mas o dano é reduzido pela VIG do alvo. O alvo fica com Dor Intensa (-1 em todos os testes) por 1 rodada.',
        skillNome: 'Ocultismo',
      },
      {
        nome: 'Domínio da Dor',
        nivel: 3,
        custoEnergia: 8,
        atributoBase: Atributo.PRE,
        descricaoLivre:
          'A Tecelã assume controle total de um alvo que esteja sob efeito de Dor Intensa ou Abalado. Teste oposto PRE vs VIG. Sucesso: controla as ações do alvo por 1 turno completo. Falha: o alvo fica Atordoado em vez disso. Uso: 1x por combate.',
        skillNome: 'Intimidação',
      },
      {
        nome: 'Escudo de Agonia Alheia',
        nivel: 2,
        custoEnergia: 5,
        atributoBase: Atributo.INT,
        descricaoLivre:
          'Reação. Quando a Tecelã receberia dano, redireciona metade do dano para um alvo que esteja conectado via Teia de Nervos.',
      },
    ],
    aptitudesNomes: ['Domínio Simples', 'Expansão de Domínio Incompleta'],
    descricao:
      'Uma mulher alta e magra vestida de fios negros vivos que se movem como tentáculos. Cada fio é um canal de dor. Foi uma curandeira que, ao tentar absorver o sofrimento dos pacientes, foi consumida por ele. Agora tece dor como um artesão tece seda.',
  },
  {
    nome: 'Relógio Vivo',
    grau: '3',
    nivel: 5,
    specializationNome: 'Suporte',
    hpMax: 30,
    energiaMax: 25,
    maestriaBonus: 4,
    attributes: { FOR: 2, AGI: 5, VIG: 3, INT: 5, PRE: 3 },
    skillsTreinadas: ['Percepção', 'Intuição', 'Reflexos', 'Feitiçaria', 'Vontade'],
    techniques: [
      {
        nome: 'Distorção Temporal',
        nivel: 3,
        custoEnergia: 6,
        atributoBase: Atributo.INT,
        descricaoLivre:
          'Cria uma zona de 4m de raio onde o tempo flui diferente por 2 rodadas. Aliados da maldição dentro da zona ganham +2 em Iniciativa e uma ação bônus extra. Inimigos fazem teste de Vontade (CD 15) ou perdem a ação bônus.',
        skillNome: 'Feitiçaria',
      },
      {
        nome: 'Rebobinar',
        nivel: 3,
        custoEnergia: 7,
        atributoBase: Atributo.INT,
        descricaoLivre:
          'Reação. Quando um aliado em até 6m receberia dano letal, o Relógio rebobina 6 segundos. O aliado retorna à posição e HP de 1 rodada atrás. Uso: 1x por combate.',
        skillNome: 'Ocultismo',
      },
      {
        nome: 'Envelhecimento Acelerado',
        nivel: 2,
        custoEnergia: 5,
        atributoBase: Atributo.INT,
        tipoDano: TipoDano.ESPIRITUAL,
        damageDice: '2d6+3',
        descricaoLivre:
          'Toca o alvo e acelera seu envelhecimento celular. Dano espiritual. Em caso de sucesso, o alvo tem FOR e AGI reduzidos em 1 (mínimo 0) por 3 rodadas.',
        skillNome: 'Feitiçaria',
      },
      {
        nome: 'Pausa',
        nivel: 2,
        custoEnergia: 4,
        atributoBase: Atributo.AGI,
        descricaoLivre:
          'O Relógio para o próprio tempo por um instante. Fica intangível até o início do próximo turno (imune a dano, mas não pode agir). Não conta como turno pulado para fins de efeitos de duração.',
      },
    ],
    aptitudesNomes: ['Aura Elemental', 'Rastreio Avançado'],
    descricao:
      'Um humanoide cujo corpo é feito de engrenagens douradas e ponteiros que giram em velocidades impossíveis. No peito, um relógio sem números marca algo que não é hora. Nasceu da obsessão de um feiticeiro com a imortalidade — ele não queria morrer, então se fundiu com o tempo. Agora o tempo não passa para ele, mas também não para.',
  },
  {
    nome: 'Orquestra Putrefata',
    grau: '3',
    nivel: 6,
    specializationNome: 'Especialista em Técnica',
    hpMax: 28,
    energiaMax: 36,
    maestriaBonus: 4,
    attributes: { FOR: 1, AGI: 3, VIG: 3, INT: 6, PRE: 6 },
    skillsTreinadas: ['Feitiçaria', 'Ocultismo', 'Intimidação', 'Enganação', 'Percepção'],
    techniques: [
      {
        nome: 'Sinfonia do Desespero',
        nivel: 3,
        custoEnergia: 7,
        atributoBase: Atributo.PRE,
        tipoDano: TipoDano.MENTAL,
        damageDice: '2d8+4',
        descricaoLivre:
          'Uma melodia impossível ecoa de instrumentos feitos de osso e cordas de tendão. Todos os inimigos num raio de 9m fazem teste de Vontade (CD 17). Falha: sofrem dano mental e ficam Amedrontados por 2 rodadas. Sucesso: metade do dano.',
        skillNome: 'Intimidação',
      },
      {
        nome: 'Solo Dissonante',
        nivel: 2,
        custoEnergia: 4,
        atributoBase: Atributo.INT,
        tipoDano: TipoDano.ENERGETICO,
        damageDice: '3d6+3',
        descricaoLivre:
          'Uma nota aguda e distorcida é direcionada a um único alvo. O som vibra na frequência dos ossos. Dano energético. Se causar mais de 10 de dano, o alvo fica Atordoado por 1 rodada.',
        skillNome: 'Feitiçaria',
      },
      {
        nome: 'Encore Macabro',
        nivel: 3,
        custoEnergia: 8,
        atributoBase: Atributo.PRE,
        descricaoLivre:
          'Reanima um inimigo derrotado como fantoche musical. O cadáver se levanta com metade do HP máximo e luta pela Orquestra por 3 rodadas. Usa os mesmos atributos do original, mas sem técnicas. 1x por combate.',
        skillNome: 'Ocultismo',
      },
      {
        nome: 'Contratempo',
        nivel: 1,
        custoEnergia: 3,
        atributoBase: Atributo.AGI,
        descricaoLivre:
          'Reação. Quando um aliado é atacado, a Orquestra toca um acorde dissonante. O atacante faz teste de Reflexos (CD 14) ou erra o ataque automaticamente.',
      },
    ],
    aptitudesNomes: ['Domínio Simples', 'Aura Elemental', 'Projetar Energia'],
    descricao:
      'Não é uma criatura, mas cinco. Os restos de um quinteto de músicos amaldiçoados durante uma apresentação proibida. Esqueletos em trajes de gala deteriorados, cada um empunhando seu instrumento — violino de osso, harpa de tendões, flauta de fêmur, tambor de pele humana e um regente sem cabeça. Agem como uma mente única.',
  },
  {
    nome: 'Mãe de Vermes',
    grau: '3',
    nivel: 5,
    specializationNome: 'Lutador',
    hpMax: 46,
    energiaMax: 15,
    maestriaBonus: 4,
    attributes: { FOR: 6, AGI: 2, VIG: 6, INT: 2, PRE: 3 },
    skillsTreinadas: ['Luta', 'Atletismo', 'Fortitude', 'Intimidação', 'Vontade'],
    techniques: [
      {
        nome: 'Abraço Parasitário',
        nivel: 3,
        custoEnergia: 5,
        atributoBase: Atributo.FOR,
        tipoDano: TipoDano.FISICO,
        damageDice: '2d8+6',
        descricaoLivre:
          'Agarra o alvo com braços alongados e viscosos. Teste oposto FOR vs FOR. Sucesso: o alvo fica Agarrado e sofre dano. No início de cada turno agarrado, sofre 1d6 adicional enquanto vermes se infiltram pela armadura.',
      },
      {
        nome: 'Erupção Larval',
        nivel: 2,
        custoEnergia: 4,
        atributoBase: Atributo.VIG,
        tipoDano: TipoDano.ENERGETICO,
        damageDice: '2d6',
        descricaoLivre:
          'A Mãe explode parte do próprio corpo, liberando uma chuva de larvas em área de 3m. Todos na área fazem teste de Reflexos (CD 14). Falha: dano e Nauseado (-2 em ataques) por 1 rodada. A Mãe sofre 5 de dano ao usar.',
      },
      {
        nome: 'Regeneração Voraz',
        nivel: 2,
        custoEnergia: 3,
        atributoBase: Atributo.VIG,
        descricaoLivre:
          'Ação bônus. Vermes preenchem ferimentos abertos, regenerando 2d6+3 HP. Se a Mãe estiver abaixo de metade do HP, regenera 2d6+6 em vez disso.',
      },
    ],
    aptitudesNomes: ['Estímulo Muscular', 'Casulo de Energia'],
    descricao:
      'Uma massa de carne inchada com forma vagamente feminina, da qual vermes brancos e luminosos constantemente entram e saem. O chão à sua volta apodrece e adoece. Era uma parteira que, ao perder todas as crianças numa epidemia, amaldiçoou a si mesma para que nunca mais nada morresse dentro dela — agora tudo vive e se reproduz infinitamente em seu interior.',
  },
  {
    nome: 'O Juiz de Porcelana',
    grau: '3',
    nivel: 7,
    specializationNome: 'Especialista em Combate',
    hpMax: 54,
    energiaMax: 24,
    maestriaBonus: 6,
    attributes: { FOR: 5, AGI: 5, VIG: 4, INT: 3, PRE: 6 },
    skillsTreinadas: ['Luta', 'Pontaria', 'Intimidação', 'Percepção', 'Reflexos', 'Fortitude'],
    techniques: [
      {
        nome: 'Veredicto',
        nivel: 4,
        custoEnergia: 6,
        atributoBase: Atributo.FOR,
        tipoDano: TipoDano.FISICO,
        damageDice: '2d10+5',
        descricaoLivre:
          'Um golpe devastador com o martelo de porcelana. Se o alvo estiver sob qualquer condição negativa, o dano é dobrado (antes de multiplicadores de crítico). Representa a "sentença" sendo executada.',
      },
      {
        nome: 'Acusação',
        nivel: 3,
        custoEnergia: 4,
        atributoBase: Atributo.PRE,
        tipoDano: TipoDano.MENTAL,
        damageDice: '1d8+4',
        descricaoLivre:
          'Aponta para o alvo e declara uma "acusação" com voz que ecoa. Teste de Vontade (CD 17). Falha: Marcado por 3 rodadas — enquanto Marcado, o alvo sofre +2 de dano de todas as fontes e não pode se esconder do Juiz.',
        skillNome: 'Intimidação',
      },
      {
        nome: 'Objection',
        nivel: 2,
        custoEnergia: 3,
        atributoBase: Atributo.AGI,
        descricaoLivre:
          'Reação. Quando um aliado receberia um ataque, o Juiz pode interceptar e receber o ataque em seu lugar. Se o ataque causar menos que 10 de dano, o Juiz não sofre dano (porcelana absorve o impacto).',
      },
      {
        nome: 'Ordem no Tribunal',
        nivel: 3,
        custoEnergia: 5,
        atributoBase: Atributo.PRE,
        descricaoLivre:
          'Bate o martelo no chão. Todos num raio de 6m que não sejam aliados fazem teste de Vontade (CD 16). Falha: perdem a ação de movimento no próximo turno. Se 3 ou mais alvos falharem, também perdem reações por 1 rodada.',
        skillNome: 'Intimidação',
      },
    ],
    aptitudesNomes: ['Estímulo Muscular', 'Cobrir-se'],
    descricao:
      'Uma figura de 2 metros de porcelana branca impecável, vestindo uma toga preta rachada. Empunha um martelo de juiz gigante, também de porcelana. Seu rosto é uma máscara sem expressão com olhos que choram tinta preta. Nasceu da maldição de um juiz corrupto que condenou inocentes — agora julga tudo ao redor com sentenças brutais e imparciais.',
  },
];

// ============================================================
// EXECUÇÃO DO SEED
// ============================================================

async function seedMaldicoes(campaignId: string, masterUserId: string) {
  console.log('=== Seed de Maldições: Grau 4 e Grau 3 ===\n');

  // Buscar dados de referência
  const allSpecs = await prisma.specialization.findMany();
  const allSkills = await prisma.skill.findMany();
  const allAptitudes = await prisma.aptitude.findMany();

  const specMap = new Map(allSpecs.map((s) => [s.nome, s.id]));
  const skillMap = new Map(allSkills.map((s) => [s.nome, s.id]));
  const aptMap = new Map(allAptitudes.map((a) => [a.nome, a.id]));

  for (const m of maldicoes) {
    console.log(`Criando: ${m.nome} (Grau ${m.grau}, Nível ${m.nivel})`);

    const specId = specMap.get(m.specializationNome);
    if (!specId) {
      console.warn(`  ⚠ Especialização "${m.specializationNome}" não encontrada, pulando.`);
      continue;
    }

    // 1. Criar personagem (mob)
    const character = await prisma.character.create({
      data: {
        campaignId,
        userId: masterUserId,
        nome: m.nome,
        isMob: true,
        isApproved: true,
        nivel: m.nivel,
        grau: m.grau,
        hpMax: m.hpMax,
        hpAtual: m.hpMax,
        energiaMax: m.energiaMax,
        energiaAtual: m.energiaMax,
        maestriaBonus: m.maestriaBonus,
        specializationId: specId,
        attributes: {
          create: m.attributes,
        },
      },
    });

    // 2. Adicionar skills treinadas
    for (const skillNome of m.skillsTreinadas) {
      const skillId = skillMap.get(skillNome);
      if (!skillId) {
        console.warn(`  ⚠ Skill "${skillNome}" não encontrada.`);
        continue;
      }
      await prisma.characterSkill.create({
        data: {
          characterId: character.id,
          skillId,
          treinada: true,
          pontosInvestidos: m.grau === '3' ? 10 : 5,
        },
      });
    }

    // 3. Adicionar técnicas
    for (const tech of m.techniques) {
      await prisma.technique.create({
        data: {
          characterId: character.id,
          nome: tech.nome,
          nivel: tech.nivel,
          custoEnergia: tech.custoEnergia,
          atributoBase: tech.atributoBase,
          tipoDano: tech.tipoDano,
          damageDice: tech.damageDice,
          descricaoLivre: tech.descricaoLivre,
          skillNome: tech.skillNome,
        },
      });
    }

    // 4. Adicionar aptidões
    for (const aptNome of m.aptitudesNomes) {
      const aptId = aptMap.get(aptNome);
      if (!aptId) {
        console.warn(`  ⚠ Aptidão "${aptNome}" não encontrada.`);
        continue;
      }
      await prisma.characterAptitude.create({
        data: {
          characterId: character.id,
          aptitudeId: aptId,
          adquiridaNoNivel: 1,
          ativo: true,
        },
      });
    }

    console.log(`  ✓ ${m.nome} criado (ID: ${character.id})\n`);
  }

  console.log('=== Seed de Maldições concluído! ===');
}

// Para executar diretamente:
// npx ts-node prisma/seed-maldicoes.ts <campaignId> <masterUserId>
async function main() {
  const campaignId = process.argv[2];
  const masterUserId = process.argv[3];

  if (!campaignId || !masterUserId) {
    console.log('Uso: npx ts-node prisma/seed-maldicoes.ts <campaignId> <masterUserId>');
    console.log('\nOu importe a função seedMaldicoes() no seed principal.');
    console.log('\n--- CATÁLOGO DE MALDIÇÕES ---\n');

    for (const m of maldicoes) {
      console.log(`【${m.nome}】 Grau ${m.grau} | Nível ${m.nivel} | ${m.specializationNome}`);
      console.log(`  HP: ${m.hpMax} | EN: ${m.energiaMax} | Maestria: +${m.maestriaBonus}`);
      console.log(
        `  ATR: FOR ${m.attributes.FOR} AGI ${m.attributes.AGI} VIG ${m.attributes.VIG} INT ${m.attributes.INT} PRE ${m.attributes.PRE}`,
      );
      console.log(`  Técnicas: ${m.techniques.map((t) => t.nome).join(', ')}`);
      console.log(`  ${m.descricao}\n`);
    }
    return;
  }

  await seedMaldicoes(campaignId, masterUserId);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

export { maldicoes, seedMaldicoes };
