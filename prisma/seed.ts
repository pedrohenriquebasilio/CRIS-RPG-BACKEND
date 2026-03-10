import 'dotenv/config';
import { PrismaClient, Atributo } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando Seed: Feiticeiros & Maldições v2.0 (Custom Attrs)');

  // ===== ESPECIALIZAÇÕES (CLASSES) =====
  // hpPorNivel = valor fixo por nível (opção sem rolar dados, conforme livro base)
  // energiaPorNivel = PE ganhos por nível (Especialista em Técnica/Controlador/Suporte somam mod. de atributo ao máximo — gerenciado pelo Mestre)
  // bonusAtributos = especializações não concedem bônus fixos de atributo no livro
  // habilidadesTreinadas = apenas as perícias FIXAS da especialização (as "a sua escolha" o player adiciona)
  // abilities = vazio — o player cria/adiciona as habilidades manualmente
  const specializations = [
    {
      nome: 'Lutador',
      hpBase: 12,
      hpPorNivel: 6,
      energiaPorNivel: 4,
      maestriaInicial: 3,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Fortitude', 'Luta'],
      abilities: [
        {
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Mestre da Luta',
          descricao:
            'Você é um mestre da luta, dedicando-se ao desenvolvimento do seu corpo e ao manejo de armas marciais. Desferir golpes rápidos com o seu corpo. Quando realizar um ataque desarmado ou com uma arma marcial, você pode realizar um ataque desarmado como uma ação bônus.',
        },
        {
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Empolgação',
          descricao:
            'Uma boa luta é empolgante e te motiva a se arriscar mais e mais. Você começa um combate com Nível de Empolgação 1 e, caso acerte pelo menos um ataque durante seu turno, no começo do seu próximo turno você sobe um nível de empolgação, até um máximo de 5 níveis.',
        },
      ],
    },
    {
      nome: 'Especialista em Combate',
      hpBase: 12,
      hpPorNivel: 6,
      energiaPorNivel: 4,
      maestriaInicial: 4,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Luta', 'Pontaria', 'Fortitude'],
      abilities: [
        {
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Repertório do Especialista',
          descricao:
            'Como um Especialista em Combate, você pode escolher um estilo principal para seguir em sua especialização. Estilos incluem: Defensivo, Arremessador, Duelista, Interceptador, Protetor, Distante, Duplo e Massivo.',
        },
      ],
    },
    {
      nome: 'Especialista em Técnica',
      hpBase: 10,
      hpPorNivel: 5,
      energiaPorNivel: 6,
      maestriaInicial: 3,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Feitiçaria', 'Ocultismo', 'Vontade'],
      abilities: [
        {
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Domínio dos Fundamentos',
          descricao:
            'Como um especialista em técnicas, você tem uma maior dominância sobre os fundamentos da energia amaldiçoada e das suas habilidades. Aprenda mudanças de fundamento como Técnica Cruel, Cuidadosa, Distante, Duplicada, Potente, Precisa e Rápida.',
        },
      ],
    },
    {
      nome: 'Controlador',
      hpBase: 10,
      hpPorNivel: 5,
      energiaPorNivel: 5,
      maestriaInicial: 2,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Percepção', 'Intuição', 'Vontade'],
      abilities: [
        {
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Treinamento em Controle',
          descricao:
            'Você é treinado para controlar maldições - shikigamis - ou criações em combate. Você começa com dois shikigamis ou corpos amaldiçoados à sua escolha. Você pode manter até duas invocações ativas em campo ao mesmo tempo.',
        },
      ],
    },
    {
      nome: 'Suporte',
      hpBase: 10,
      hpPorNivel: 5,
      energiaPorNivel: 5,
      maestriaInicial: 3,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Medicina', 'Vontade'],
      abilities: [
        {
          nivelRequerido: 1,
          tipo: 'ativa',
          custo: 'ação bônus',
          alcance: 'toque',
          duracao: 'imediato',
          nome: 'Cura',
          descricao:
            'Você pode, como uma ação bônus, curar uma criatura em alcance de toque em um valor igual a 2d6 + seu modificador de Carisma ou Sabedoria, uma quantidade de vezes igual ao seu modificador, por descanso curto ou longo.',
        },
        {
          nivelRequerido: 3,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Presença Inspiradora',
          descricao:
            'Sua presença inspira aqueles ao seu redor a tentarem seu máximo. Você pode pagar 2 pontos de energia amaldiçoada para fazer com que, durante uma cena, todo aliado dentro de 9 metros de você fique inspirado, recebendo um bônus de +1 em toda rolagem de perícia.',
        },
      ],
    },
    {
      nome: 'Restringido',
      hpBase: 16,
      hpPorNivel: 7,
      energiaPorNivel: 0,
      maestriaInicial: 4,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Fortitude', 'Luta', 'Pontaria', 'Reflexos'],
      abilities: [
        {
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Restrito pelos Céus',
          descricao:
            'Para compensar sua falta de energia amaldiçoada, você recebe vários benefícios atrelados ao seu físico maior e aptidão ao combate. Você pode adicionar seu modificador de Força ou de Constituição na sua Classe de Armadura. Você possui Pontos de Vigor em vez de Energia, iniciando com 4 por nível.',
        },
        {
          nivelRequerido: 2,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Ataque Furtivo',
          descricao:
            'Uma vez por turno, ao realizar um ataque surpresa você pode adicionar 1d8 ao dano dele. Caso você possua um ou mais aliados em 1,5 metros de você e do alvo, não é necessário ser um ataque surpresa.',
        },
        {
          nivelRequerido: 3,
          tipo: 'passiva',
          custo: 'nenhum',
          alcance: 'pessoal',
          duracao: 'passiva',
          nome: 'Esquiva Sobre-humana',
          descricao:
            'Você recebe +1 em sua classe de armadura e em rolagens de Reflexos. No nível 9 e 16, esse bônus aumenta em +1.',
        },
      ],
    },
  ];

  // ===== PERÍCIAS (SKILLS) v2.0 =====
  // Mapeadas para FOR, AGI, VIG, INT, PRE conforme solicitado
  const skills = [
    {
      nome: 'Atletismo',
      atributoBase: Atributo.FOR,
      permiteMaestria: true,
      descricao: 'Esforço físico bruto: escalar, nadar, saltar.',
    },
    {
      nome: 'Luta',
      atributoBase: Atributo.FOR,
      permiteMaestria: true,
      descricao: 'Ataques corpo a corpo e manobras físicas.',
    },
    {
      nome: 'Acrobacia',
      atributoBase: Atributo.AGI,
      permiteMaestria: true,
      descricao: 'Equilíbrio e coordenação.',
    },
    {
      nome: 'Furtividade',
      atributoBase: Atributo.AGI,
      permiteMaestria: true,
      descricao: 'Esconder-se e mover-se silenciosamente.',
    },
    {
      nome: 'Pontaria',
      atributoBase: Atributo.AGI,
      permiteMaestria: true,
      descricao: 'Ataques com armas à distância e arremessos.',
    },
    {
      nome: 'Iniciativa',
      atributoBase: Atributo.AGI,
      permiteMaestria: true,
      descricao: 'Velocidade de reação no início do combate.',
    },
    {
      nome: 'Reflexos',
      atributoBase: Atributo.AGI,
      permiteMaestria: true,
      descricao: 'Capacidade de reagir rapidamente a situações inesperadas.',
    },
    {
      nome: 'Fortitude',
      atributoBase: Atributo.VIG,
      permiteMaestria: true,
      descricao: 'Resistência biológica e vigor físico.',
    },
    {
      nome: 'Vontade',
      atributoBase: Atributo.VIG,
      permiteMaestria: true,
      descricao: 'Resistência mental e determinação espiritual.',
    },
    {
      nome: 'Feitiçaria',
      atributoBase: Atributo.INT,
      permiteMaestria: true,
      descricao: 'Manipulação ativa de energia amaldiçoada.',
    },
    {
      nome: 'Ocultismo',
      atributoBase: Atributo.INT,
      permiteMaestria: true,
      descricao: 'Conhecimento teórico sobre maldições e o mundo jujutsu.',
    },
    {
      nome: 'Investigação',
      atributoBase: Atributo.INT,
      permiteMaestria: true,
      descricao: 'Análise de pistas e dedução lógica.',
    },
    {
      nome: 'Medicina',
      atributoBase: Atributo.INT,
      permiteMaestria: true,
      descricao: 'Tratamento de ferimentos e doenças.',
    },
    {
      nome: 'Percepção',
      atributoBase: Atributo.PRE,
      permiteMaestria: true,
      descricao: 'Notar presenças e detalhes no ambiente.',
    },
    {
      nome: 'Intuição',
      atributoBase: Atributo.PRE,
      permiteMaestria: true,
      descricao: 'Ler intenções e linguagem corporal.',
    },
    {
      nome: 'Diplomacia',
      atributoBase: Atributo.PRE,
      permiteMaestria: true,
      descricao: 'Persuasão e interação social positiva.',
    },
    {
      nome: 'Intimidação',
      atributoBase: Atributo.PRE,
      permiteMaestria: true,
      descricao: 'Influenciar outros através do medo ou autoridade.',
    },
    {
      nome: 'Enganação',
      atributoBase: Atributo.PRE,
      permiteMaestria: true,
      descricao: 'Mentiras e disfarces.',
    },
  ];

  // ===== ORIGENS =====
  const origens = [
    {
      nome: 'Inato',
      descricao:
        'Sua técnica amaldiçoada é natural e exclusiva. Distribua +2 em um atributo e +1 em outro à sua escolha. ' +
        'Recebe 1 Habilidade de Técnica extra com custo reduzido em 1 energia (não conta para o máximo de habilidades). ' +
        'Recebe 1 Talento no nível 1; a partir do nível 4, pode escolher 1 Talento adicional ao subir de nível (apenas uma vez).',
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: [],
    },
    {
      nome: 'Derivado',
      descricao:
        'Energia amaldiçoada de origem anormal com traços únicos. Distribua +2 em um atributo e +1 em outro à sua escolha. ' +
        'Recebe 1 Aptidão Amaldiçoada de Aura (deve atender os requisitos). ' +
        'Como ação bônus em combate, pode recuperar energia igual ao dobro do bônus de maestria (1x por dia). ' +
        'A cada 4 níveis, pode aumentar em 2 o máximo natural de um atributo (limite 30).',
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: [],
    },
    {
      nome: 'Herdado',
      descricao:
        'Pertence a um dos grandes clãs de feiticeiros. Bônus de atributo, maestrias de clã e técnicas hereditárias dependem do clã escolhido — configurados manualmente pelo Mestre. ' +
        'Clãs disponíveis: Gojo (Potencial Lendário: +1 energia/nível par, +1 habilidade de técnica extra nos níveis 1/5/10/15/20), ' +
        'Inumaki (Olhos de Cobra e Presas: comando de aliado como ação bônus, usos = maestria), ' +
        'Kamo (Valor do Sangue: +1 HP por nível ao subir; a partir do nível 10 +2 HP por nível), ' +
        'Zenin (Foco no Poder: escolha habilidades focadas nos níveis 1/5/10/15/20 — cada uma pode causar +1 dado de dano, curar +1 dado, ter o dobro do alcance ou ter a CD aumentada em maestria).',
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: [],
    },
    {
      nome: 'Restringido',
      descricao:
        'Energia amaldiçoada completamente suprimida — em troca, corpo desenvolvido além do limite humano. ' +
        'Recebe +1 em FOR, AGI e VIG, mais 2 pontos livres para distribuir entre atributos físicos (FOR, AGI ou VIG). ' +
        'Acessa a especialização Restringido. Movimento aumenta em 3m. ' +
        'Em descanso curto, adiciona metade do bônus de maestria à quantidade de dados curados.',
      bonusAtributos: { FOR: 1, AGI: 1, VIG: 1, INT: 0, PRE: 0 },
      habilidadesTreinadas: [],
    },
    {
      nome: 'Sem Técnica',
      descricao:
        'Nenhuma técnica amaldiçoada — compensado por dedicação extrema. ' +
        'Recebe 4 pontos para distribuir nos atributos (máx 3 no mesmo). Recebe maestria em 2 perícias à escolha. ' +
        'Acesso ao Novo Estilo da Sombra. ' +
        'Empenho Implacável: N3 → +1 em 3 perícias; N6 → 1 habilidade de especialização extra; N10 → 1 talento ou aptidão; ' +
        'N13 → +2 em 2 perícias; N15 → 1 habilidade de especialização extra; N17 → +3 em 2 perícias; N19 → 1 habilidade de especialização + 1 talento.',
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: [],
    },
  ];

  // ===== ARMAS (WEAPON TEMPLATES) =====
  const weaponTemplates = [
    // ── Corpo a Corpo ─────────────────────────────────────────────────────────
    {
      nome: 'Soco Desarmado',
      categoria: 'Corpo a Corpo',
      damageDice: '1d4',
      tipoDano: 'FISICO',
      distancia: 'Corpo a Corpo (1,5m)',
      duasMaos: false,
      requiresMarcial: false,
      descricao: 'Ataque desarmado básico.',
    },
    {
      nome: 'Faca',
      categoria: 'Corpo a Corpo',
      damageDice: '1d4',
      tipoDano: 'FISICO',
      distancia: 'Corpo a Corpo (1,5m)',
      duasMaos: false,
      requiresMarcial: false,
      threatRange: 19,
      descricao: 'Lâmina curta de fácil ocultação.',
    },
    {
      nome: 'Clava / Cacetete',
      categoria: 'Corpo a Corpo',
      damageDice: '1d6',
      tipoDano: 'FISICO',
      distancia: 'Corpo a Corpo (1,5m)',
      duasMaos: false,
      requiresMarcial: false,
      descricao: 'Arma contundente improvisada ou simples.',
    },
    {
      nome: 'Espada Curta',
      categoria: 'Corpo a Corpo',
      damageDice: '1d6',
      tipoDano: 'FISICO',
      distancia: 'Corpo a Corpo (1,5m)',
      duasMaos: false,
      requiresMarcial: true,
      threatRange: 19,
      descricao: 'Lâmina versátil de uso único.',
    },
    {
      nome: 'Katana',
      categoria: 'Corpo a Corpo',
      damageDice: '1d8',
      tipoDano: 'FISICO',
      distancia: 'Corpo a Corpo (1,5m)',
      duasMaos: false,
      requiresMarcial: true,
      threatRange: 19,
      criticalMultiplier: 3,
      descricao:
        'Espada japonesa de lâmina curva, símbolo dos feiticeiros de clã.',
    },
    {
      nome: 'Lança',
      categoria: 'Corpo a Corpo',
      damageDice: '1d8',
      tipoDano: 'FISICO',
      distancia: 'Corpo a Corpo (3m)',
      duasMaos: true,
      requiresMarcial: false,
      descricao: 'Haste de combate com alcance estendido.',
    },
    {
      nome: 'Espada Bastarda',
      categoria: 'Corpo a Corpo',
      damageDice: '1d10',
      tipoDano: 'FISICO',
      distancia: 'Corpo a Corpo (1,5m)',
      duasMaos: true,
      requiresMarcial: true,
      threatRange: 19,
      criticalMultiplier: 3,
      descricao: 'Espada de duas mãos de alto impacto.',
    },
    // ── Armas à Distância ─────────────────────────────────────────────────────
    {
      nome: 'Pistola',
      categoria: 'Arma de Fogo',
      damageDice: '1d8',
      tipoDano: 'FISICO',
      distancia: 'Curto (18m)',
      duasMaos: false,
      requiresMarcial: false,
      descricao: 'Arma de fogo de porte individual.',
    },
    {
      nome: 'Espingarda',
      categoria: 'Arma de Fogo',
      damageDice: '2d6',
      tipoDano: 'FISICO',
      distancia: 'Curto (9m)',
      duasMaos: true,
      requiresMarcial: true,
      regraEspecial:
        'Disparo em cone: pode atacar todos em linha de 3m à frente.',
      descricao: 'Alta potência a curta distância.',
    },
    {
      nome: 'Fuzil de Assalto',
      categoria: 'Arma de Fogo',
      damageDice: '1d10',
      tipoDano: 'FISICO',
      distancia: 'Médio (90m)',
      duasMaos: true,
      requiresMarcial: true,
      descricao: 'Rifle automático de uso militar.',
    },
    {
      nome: 'Arco',
      categoria: 'Arco e Flecha',
      damageDice: '1d6',
      tipoDano: 'FISICO',
      distancia: 'Médio (60m)',
      duasMaos: true,
      requiresMarcial: false,
      descricao: 'Silencioso e preciso.',
    },
    // ── Armas Amaldiçoadas ─────────────────────────────────────────────────────
    {
      nome: 'Ferramenta Amaldiçoada',
      categoria: 'Arma Amaldiçoada',
      damageDice: '1d6',
      tipoDano: 'ENERGETICO',
      distancia: 'Corpo a Corpo (1,5m)',
      duasMaos: false,
      requiresMarcial: false,
      regraEspecial: 'Dano de Energia Amaldiçoada — ignora armaduras físicas.',
      descricao: 'Objeto imbuído com energia maldita, eficaz contra maldições.',
    },
    {
      nome: 'Instrumento Ritual',
      categoria: 'Arma Amaldiçoada',
      damageDice: '1d8',
      tipoDano: 'ESPIRITUAL',
      distancia: 'Corpo a Corpo (1,5m)',
      duasMaos: true,
      requiresMarcial: false,
      regraEspecial: 'Dano Espiritual — afeta entidades imateriais plenamente.',
      descricao:
        'Arma ritual de cerimônia, forjada para purificação espiritual.',
    },
  ];

  // ===== PROGRESSÃO DE NÍVEL =====
  // xpRequired = XP total acumulado para atingir aquele nível
  // Alinhado com XP_TABLE do frontend: nível X → precisa de XP_TABLE[X-1] acumulado
  const levelProgressions = [
    { level: 2,  xpRequired: 300,    ganhoAtributo: false, ganhoMaestria: false },
    { level: 3,  xpRequired: 900,    ganhoAtributo: false, ganhoMaestria: false },
    { level: 4,  xpRequired: 2700,   ganhoAtributo: true,  ganhoMaestria: false },
    { level: 5,  xpRequired: 6500,   ganhoAtributo: false, ganhoMaestria: true  },
    { level: 6,  xpRequired: 14000,  ganhoAtributo: false, ganhoMaestria: false },
    { level: 7,  xpRequired: 23000,  ganhoAtributo: false, ganhoMaestria: false },
    { level: 8,  xpRequired: 34000,  ganhoAtributo: true,  ganhoMaestria: false },
    { level: 9,  xpRequired: 48000,  ganhoAtributo: false, ganhoMaestria: true  },
    { level: 10, xpRequired: 64000,  ganhoAtributo: false, ganhoMaestria: false },
    { level: 11, xpRequired: 85000,  ganhoAtributo: false, ganhoMaestria: false },
    { level: 12, xpRequired: 100000, ganhoAtributo: true,  ganhoMaestria: false },
    { level: 13, xpRequired: 120000, ganhoAtributo: false, ganhoMaestria: true  },
    { level: 14, xpRequired: 140000, ganhoAtributo: false, ganhoMaestria: false },
    { level: 15, xpRequired: 165000, ganhoAtributo: false, ganhoMaestria: false },
    { level: 16, xpRequired: 195000, ganhoAtributo: true,  ganhoMaestria: false },
    { level: 17, xpRequired: 225000, ganhoAtributo: false, ganhoMaestria: true  },
    { level: 18, xpRequired: 265000, ganhoAtributo: false, ganhoMaestria: false },
    { level: 19, xpRequired: 305000, ganhoAtributo: true,  ganhoMaestria: false },
    { level: 20, xpRequired: 355000, ganhoAtributo: false, ganhoMaestria: false },
  ];

  // ===== LÓGICA DE EXECUÇÃO (idempotente — nunca apaga dados de jogadores) =====

  // Skills: upsert manual por nome (não tem @unique no schema)
  for (const s of skills) {
    const existing = await prisma.skill.findFirst({ where: { nome: s.nome } });
    if (existing) {
      await prisma.skill.update({
        where: { id: existing.id },
        data: {
          atributoBase: s.atributoBase,
          permiteMaestria: s.permiteMaestria,
          descricao: s.descricao ?? '',
        },
      });
    } else {
      await prisma.skill.create({ data: s });
    }
  }

  // Especializações: upsert + recriar abilities (nunca toca em characterSkill)
  for (const spec of specializations) {
    const existing = await prisma.specialization.findFirst({
      where: { nome: spec.nome },
    });
    if (existing) {
      await prisma.specializationAbility.deleteMany({
        where: { specializationId: existing.id },
      });
      await prisma.specialization.update({
        where: { id: existing.id },
        data: {
          hpBase: spec.hpBase ?? 0,
          hpPorNivel: spec.hpPorNivel,
          energiaPorNivel: spec.energiaPorNivel,
          maestriaInicial: spec.maestriaInicial ?? 2,
          bonusAtributos: spec.bonusAtributos,
          habilidadesTreinadas: spec.habilidadesTreinadas,
          abilities: { create: spec.abilities },
        },
      });
    } else {
      await prisma.specialization.create({
        data: {
          nome: spec.nome,
          hpBase: spec.hpBase ?? 0,
          hpPorNivel: spec.hpPorNivel,
          energiaPorNivel: spec.energiaPorNivel,
          maestriaInicial: spec.maestriaInicial ?? 2,
          bonusAtributos: spec.bonusAtributos,
          habilidadesTreinadas: spec.habilidadesTreinadas,
          abilities: { create: spec.abilities },
        },
      });
    }
  }

  // Origens: upsert por nome (campo @unique)
  for (const o of origens) {
    await prisma.origem.upsert({
      where: { nome: o.nome },
      update: {
        descricao: o.descricao,
        bonusAtributos: o.bonusAtributos,
        habilidadesTreinadas: o.habilidadesTreinadas,
      },
      create: o,
    });
  }

  // WeaponTemplates: upsert por nome (campo @unique)
  for (const w of weaponTemplates) {
    await prisma.weaponTemplate.upsert({
      where: { nome: w.nome },
      update: w,
      create: w,
    });
  }

  // LevelProgression: upsert por level (campo @unique)
  for (const lp of levelProgressions) {
    await prisma.levelProgression.upsert({
      where: { level: lp.level },
      update: { xpRequired: lp.xpRequired, ganhoAtributo: lp.ganhoAtributo, ganhoMaestria: lp.ganhoMaestria },
      create: lp,
    });
  }

  // ===== TALENTOS (sistema) =====
  const talentos = [
    {
      nome: 'Adepto de Combate',
      tipo: 'passiva',
      descricao: 'Você se torna adepto a um estilo de combate específico. Ao obter esse talento você aprende um dos estilos de combate da especialização Especialista em Combate.',
    },
    {
      nome: 'Afinidade com Técnica',
      tipo: 'passiva',
      descricao: 'Com uma afinidade superior com a sua técnica amaldiçoada, você consegue a desenvolver melhor, criando mais extensões dela. Ao obter esse talento, você recebe uma habilidade de técnica a mais e tem o seu máximo aumentado em uma quantidade igual a metade do seu bônus de maestria. No nível 10, você recebe outra habilidade de técnica a mais.',
    },
    {
      nome: 'Arremessos Debilitantes',
      tipo: 'ativa',
      descricao: 'Ao arremessar armas, você sabe focar exatamente nos lugares em que é capaz de debilitar o alvo. Sempre que realizar um ataque com arma de arremesso, você pode optar por focar em debilitar o alvo, recebendo -5 no acerto, mas caso acerte, o inimigo receberá -5 na próxima rolagem que realizar.',
    },
    {
      nome: 'Artesão Amaldiçoado',
      tipo: 'passiva',
      descricao: 'A criação de ferramentas amaldiçoadas é um ofício no qual você busca se especializar por completo. Sempre que for realizar uma rolagem para criar ou melhorar uma ferramenta amaldiçoada, você a realiza com vantagem. Além disso, você recebe maestria em Ofício (Ferreiro) ou Feitiçaria, caso não possua; caso já possua em ambas, você se torna especialista em uma delas, a sua escolha.',
    },
    {
      nome: 'Ataque Infalível',
      tipo: 'passiva',
      descricao: 'Ao rolar o dano de um ataque com arma, quando rolar 1 ou 2, você pode rolar novamente, ficando com o novo resultado, mesmo se for igual. Você também não pode ter os níveis de dano da sua arma reduzidos.',
    },
    {
      nome: 'Atenção Infalível',
      tipo: 'passiva',
      descricao: 'Você não pode ser surpreendido, se consciente, e ataques de inimigos que você não possa ver não te deixam desprevenido. Você recebe um bônus de +5 em Atenção.',
    },
    {
      nome: 'Atirador Preciso',
      tipo: 'ativa',
      descricao: 'Atacar a uma distância grande não impõe desvantagem no seu ataque a distância. Sua arma a distância ignora meia cobertura e 3/4 de cobertura. Antes de fazer um ataque com uma arma a distância você pode escolher receber uma penalidade de -5 para acertar em troca de infligir +10 de dano.',
    },
    {
      nome: 'Dedicação Recompensadora',
      tipo: 'passiva',
      descricao: 'Você se dedica mais do que o normal em suas missões e recebe melhores recompensas em troca. No quarto grau, recebe dois itens de custo 1 a mais; no terceiro grau, dois itens de custo 2 a mais; no segundo grau, um item de custo 2 e dois de custo 3 a mais; no primeiro grau, dois itens de custo 3, um de custo 4 a mais e, no grau especial, dois itens de custo 4 a mais. Os aumentos não são cumulativos.',
    },
    {
      nome: 'Favorecido pela Sorte',
      tipo: 'ativa',
      descricao: 'Você tem 3 pontos de sorte. Sempre que fizer uma rolagem, pode gastar um ponto para rolar outro d20, escolhendo qualquer um dos dois resultados. Pode escolher rolar após ver o resultado, mas antes das consequências. Também pode gastar 1 ponto quando é atacado, rolando um d20 e escolhendo se o inimigo usa o seu resultado ou o dele. Recupera os pontos após um descanso longo.',
    },
    {
      nome: 'Feiticeiro Companheiro',
      tipo: 'passiva',
      descricao: 'Em busca de garantir o sucesso, você recruta um feiticeiro para ser seu companheiro. Você recebe um aliado de um tipo a sua escolha: entre o nível 1 a 5, ele é iniciante; entre o nível 6 e 10, ele é veterano e, a partir do nível 11, ele se torna um mestre.',
    },
    {
      nome: 'Guarda Infalível',
      tipo: 'reacao',
      descricao: 'Você nunca baixa a sua guarda. Em caso de um desastre em um teste de ataque, você não causa um ataque como reação. Caso um efeito tente reduzir sua classe de armadura ou impor modificadores negativos em testes de resistência, você terá +4 para resistir.',
    },
    {
      nome: 'Incremento de Atributo',
      tipo: 'passiva',
      descricao: 'Ao obter esse talento, você aumenta o valor de um atributo em 2, podendo superar até mesmo o limite natural. Você pode pegar este talento várias vezes, mas apenas uma vez para cada atributo.',
    },
    {
      nome: 'Investida Aprimorada',
      tipo: 'ativa',
      descricao: 'Você domina a arte de realizar uma investida. Ao realizá-la, seu movimento aumenta em 3 metros; o bônus de acerto aumenta de +2 para um valor igual ao seu bônus de maestria e, caso acerte, o alvo deve realizar um teste de Atletismo contra o seu, sendo derrubado em uma falha.',
    },
    {
      nome: 'Maldição de Bolso',
      tipo: 'passiva',
      descricao: 'Você possui uma maldição pequena capaz de armazenar itens para você. O inventário da maldição de bolso possui 8 espaços. Retirar um item dela conta como uma ação livre. Itens com energia amaldiçoada armazenados no interior dela não são detectáveis.',
    },
    {
      nome: 'Mestre das Armas',
      tipo: 'passiva',
      descricao: 'Aumenta a Força ou Destreza em 1. Você recebe maestria em quatro armas quaisquer a sua escolha.',
    },
    {
      nome: 'Mestre Defensivo',
      tipo: 'passiva',
      descricao: 'Aumenta a Força ou Constituição em 1. Você recebe maestria em escudos.',
    },
    {
      nome: 'Provocação Desafiadora',
      tipo: 'ativa',
      descricao: 'Uma criatura afetada por uma ação de Provocar sua, ao invés de receber desvantagem para atacar outras criaturas, só pode realizar ataques contra você, até que suceda em um teste para escapar da provocação.',
    },
    {
      nome: 'Resiliência Melhorada',
      tipo: 'passiva',
      descricao: 'Ao obter este talento, escolha uma perícia de teste de resistência: você recebe maestria nela ou, caso já possua, se torna especialista. O valor do atributo usado na perícia escolhida aumenta em 1.',
    },
    {
      nome: 'Técnicas Agressivas de Escudo',
      tipo: 'ativa',
      descricao: 'Ao atacar no seu turno, você pode usar sua ação bônus para empurrar o alvo usando seu escudo. Caso empurrado com sucesso, ele recebe Xd4 (X = modificador de força) de dano de impacto, pode ser empurrado até 4,5 metros e fica caído.',
    },
    {
      nome: 'Técnicas de Arremesso',
      tipo: 'passiva',
      descricao: 'Sempre que atacar com uma arma de arremesso, você recebe +2 para acertar e +3 no dano. Caso erre, a arma imediatamente volta para a sua mão, a menos que algo na trajetória impeça.',
    },
    {
      nome: 'Técnicas de Reação Rápida',
      tipo: 'passiva',
      descricao: 'Você recebe +5 de Iniciativa. Após a rolagem de iniciativa, caso você não seja o primeiro, você pode rolar novamente, ficando com o melhor resultado.',
    },
    {
      nome: 'Técnicas Defensivas de Escudo',
      tipo: 'reacao',
      descricao: 'Você passa a adicionar o bônus do escudo em testes de resistência de reflexos. Caso seja submetido a um efeito que permita um teste de resistência para receber metade do dano e suceda, você pode usar sua reação para transformar o resultado em um sucesso crítico, anulando os efeitos do ataque em você.',
    },
    {
      nome: 'Tempestade de Ideias',
      tipo: 'passiva',
      descricao: 'Aumenta um atributo a sua escolha em 1. Você recebe maestria em duas perícias e duas ferramentas a sua escolha. Escolha uma das suas maestrias, exceto Luta e Pontaria, para ter o bônus de maestria adicionado em toda rolagem que a utilize, desde que não seja para ataques.',
    },
    {
      nome: 'Técnicas de Empunhadura Dupla',
      tipo: 'passiva',
      descricao: 'Você recebe +1 na classe de armadura empunhando uma arma em cada mão. Pode lutar com duas armas mesmo que não sejam leves, desde que não possuam a propriedade pesada ou duas mãos. Pode sacar ou guardar duas armas ao invés de uma como parte de um mesmo saque. [Pré-Requisito: Força ou Destreza 14]',
    },
    {
      nome: 'Técnicas de Imobilização',
      tipo: 'ativa',
      descricao: 'Você tem vantagem para atacar uma criatura que estiver agarrando e causa 1d6 de dano adicional (aumenta nos níveis 6, 12 e 18). Pode usar uma ação para imobilizar uma criatura agarrada: em sucesso ela fica Incapacitada e tem a CA reduzida pelo seu bônus de maestria, mas você também fica Incapacitado. [Pré-Requisito: Força ou Constituição 16]',
    },
    {
      nome: 'Alma Inquebrável',
      tipo: 'passiva',
      descricao: 'Você recebe +5 em rolagens de Integridade e redução de dano na alma igual a metade do seu nível de personagem. [Pré-Requisito: Constituição 14]',
    },
    {
      nome: 'Robustez Aprimorada',
      tipo: 'passiva',
      descricao: 'Seus pontos de vida máximos aumentam em um valor igual ao dobro do seu nível ao obter esse talento. Sempre que subir de nível, você recebe +2 pontos de vida máximos. [Pré-Requisito: Constituição 14]',
    },
    {
      nome: 'Determinado a Viver',
      tipo: 'passiva',
      descricao: 'Uma vez por dia, na primeira vez que fosse para os testes de morte, você pode escolher ficar com 1 de vida ao invés disso. Todo teste de morte a partir do segundo possui vantagem. [Pré-Requisito: Constituição 18 ou Nível 10]',
    },
    {
      nome: 'Correr e Atirar',
      tipo: 'ativa',
      descricao: 'Ao realizar a ação Disparar enquanto maneja uma arma de fogo, você recebe RD igual ao seu modificador de Destreza e todos os seus ataques com armas de fogo causam um dado de dano adicional até o final do turno. [Pré-Requisito: Destreza 14]',
    },
    {
      nome: 'Técnicas de Esquiva',
      tipo: 'ativa',
      descricao: 'Você recebe +2 na Classe de Armadura e em Testes de Reflexos. Uma quantidade de vezes por descanso longo, igual ao seu modificador de Destreza, você pode usar Esquivar como uma ação bônus. [Pré-Requisito: Destreza 14]',
    },
    {
      nome: 'Técnicas de Mobilidade',
      tipo: 'passiva',
      descricao: 'Seu movimento aumenta em 3 metros. Quando usar Disparar, terreno difícil não te custa movimento adicional. Ao atacar uma criatura, você não causa ataques de oportunidade para ela pelo resto do seu turno. [Pré-Requisito: Destreza 14]',
    },
    {
      nome: 'Discurso Motivador',
      tipo: 'ativa',
      descricao: 'Gaste 10 minutos inspirando aliados: todas as criaturas amigáveis próximas recebem HP temporário igual ao dobro do seu nível + seu modificador de carisma multiplicado pela metade do bônus de maestria. Uma criatura só pode receber esse bônus uma vez por descanso. [Pré-Requisito: Maestria em alguma perícia de Carisma]',
    },
    {
      nome: 'Técnicas de Ocultamento',
      tipo: 'passiva',
      descricao: 'Você aplica o dobro do bônus de maestria em rolagens de furtividade. O alvo de um ataque surpresa recebe -5 em todos os testes de resistência contra você enquanto desprevenido. [Pré-Requisito: Maestria em Furtividade]',
    },
    {
      nome: 'Aptidão Desenvolvida',
      tipo: 'passiva',
      descricao: 'Escolha uma aptidão amaldiçoada para ter o seu nível de aptidão aumentado em 1. Você pode pegar esse talento múltiplas vezes, mas apenas uma vez para cada Aptidão. [Pré-Requisito: Nível 4]',
    },
    {
      nome: 'Disparos Perfurantes',
      tipo: 'passiva',
      descricao: 'Ao realizar um ataque com arma de fogo contra um alvo com uma criatura adjacente, a criatura adjacente deve realizar um TR de Reflexos e, caso falhe, recebe metade do dano causado ao alvo. [Pré-Requisito: Nível 4]',
    },
    {
      nome: 'Mestre da Criação',
      tipo: 'passiva',
      descricao: 'Quando escolher o foco Criação de Itens durante um interlúdio, você pode criar 2 itens adicionais. Caso escolha esse foco mais de uma vez, recebe as oportunidades adicionais para cada foco. Além disso, recebe +3 em duas perícias de ofício a sua escolha. [Pré-Requisitos: Nível 4 e Maestria em dois Ofícios]',
    },
    {
      nome: 'Mestre dos Chicotes',
      tipo: 'passiva',
      descricao: 'Suas rolagens de ataque com chicotes causam +4 de dano e o alcance aumenta em 1,5 metros. Uma vez ao turno, ao acertar uma criatura com chicote, você pode forçá-la a realizar um TR de Fortitude e, caso falhe, puxá-la até 3 metros para sua direção. [Pré-Requisito: Nível 5]',
    },
    {
      nome: 'Técnicas do Sentinela',
      tipo: 'reacao',
      descricao: 'Ao acertar uma criatura com um ataque de oportunidade, o movimento dela se torna 0. Criaturas provocam ataques de oportunidade para você mesmo ao usar Desengajar. Quando uma criatura a 1,5 metros faz um ataque contra alguém além de você, você pode como reação realizar um ataque contra essa criatura. [Pré-Requisito: Nível 5]',
    },
    {
      nome: 'Rápido no Gatilho',
      tipo: 'passiva',
      descricao: 'Você ignora a propriedade Recarga de armas a distância cujo custo seja ação bônus. Estar corpo-a-corpo com uma criatura não faz você receber desvantagem em ataques a distância. [Pré-Requisito: Destreza 16 e Nível 6]',
    },
    {
      nome: 'Especialista em Concussão',
      tipo: 'passiva',
      descricao: 'Seu valor de força ou constituição aumenta em 1. Ao usar arma de dano de impacto, considere o dano um nível superior. Uma vez por turno, ao acertar, você pode mover o alvo até 3 metros. Ao acertar um crítico, ataques contra o alvo recebem +3 até o começo do seu próximo turno. [Pré-Requisito: Nível 8]',
    },
    {
      nome: 'Especialista em Cortes',
      tipo: 'passiva',
      descricao: 'Seu valor de força ou destreza aumenta em 1. Ao usar arma cortante, considere o dano um nível superior. Uma vez por turno, ao acertar, você pode reduzir o movimento do alvo em 4,5 metros. Ao acertar um crítico, o alvo recebe -3 em todas as rolagens de ataque até o próximo turno. [Pré-Requisito: Nível 8]',
    },
    {
      nome: 'Especialista em Perfuração',
      tipo: 'passiva',
      descricao: 'Seu valor de força ou destreza aumenta em 1. Ao usar arma perfurante, considere o dano um nível superior. Uma vez por turno, ao acertar, você pode rolar novamente os dados de dano, usando o melhor resultado. Ao acertar um crítico, adiciona mais um dado de dano da arma. [Pré-Requisito: Nível 8]',
    },
    {
      nome: 'Mestre do Arremesso',
      tipo: 'passiva',
      descricao: 'Toda arma de arremesso que você utilizar tem o dano aumentado em um dado; seu bônus em ataques com arremesso se torna +4 para acertar e +6 no dano, e o alcance aumenta em 6 metros. [Pré-Requisito: Nível 8, Técnicas de Arremesso]',
    },
    {
      nome: 'Segredos do Artesão da Alma',
      tipo: 'passiva',
      descricao: 'Você adiciona o dobro do bônus de maestria em rolagens de Integridade, recebe 5 de RD a dano na alma e se torna capaz de reparar um núcleo destruído de um Corpo Amaldiçoado Mutante (requer teste de Ofício (Canalizador) e Integridade, CD = 20 + nível do corpo + 2 por dia desde a destruição). [Pré-Requisito: Nível 10 e Maestria em Integridade]',
    },
  ];

  const existingTalentos = await prisma.talento.count({ where: { isSystem: true } });
  if (existingTalentos === 0) {
    await prisma.talento.createMany({
      data: talentos.map(t => ({ ...t, isSystem: true })),
    });
    console.log(`  ${talentos.length} talentos de sistema criados.`);
  } else {
    console.log(`  Talentos já existem (${existingTalentos}), pulando.`);
  }

  console.log('Seed finalizada com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
