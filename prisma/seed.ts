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
      hpPorNivel: 6,      // 1d10 ou 6 por nível (N1: 12 + VIG)
      energiaPorNivel: 4, // 4 PE por nível
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Fortitude', 'Luta'],
      // Também recebe Atletismo OU Acrobacia (escolha) + 2 quaisquer → player adiciona
      abilities: [],
    },
    {
      nome: 'Especialista em Combate',
      hpPorNivel: 6,      // 1d10 ou 6 por nível (N1: 12 + VIG)
      energiaPorNivel: 4, // 4 PE por nível
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Luta', 'Pontaria', 'Fortitude'],
      // Também recebe Atletismo OU Acrobacia + 3 quaisquer → player adiciona
      abilities: [],
    },
    {
      nome: 'Especialista em Técnica',
      hpPorNivel: 5,      // 1d8 ou 5 por nível (N1: 10 + VIG)
      energiaPorNivel: 6, // 6 PE por nível + soma mod. de atributo de técnica no máximo
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Feitiçaria', 'Ocultismo', 'Vontade'],
      // Também recebe 3 quaisquer → player adiciona
      abilities: [],
    },
    {
      nome: 'Controlador',
      hpPorNivel: 5,      // 1d8 ou 5 por nível (N1: 10 + VIG)
      energiaPorNivel: 5, // 5 PE por nível + soma mod. de atributo de técnica no máximo
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Percepção', 'Intuição', 'Vontade'],
      // Também recebe 2 quaisquer → player adiciona
      abilities: [],
    },
    {
      nome: 'Suporte',
      hpPorNivel: 5,      // 1d8 ou 5 por nível (N1: 10 + VIG)
      energiaPorNivel: 5, // 5 PE por nível + soma mod. de atributo de técnica no máximo
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Medicina', 'Vontade'],
      // Também recebe 3 quaisquer → player adiciona
      abilities: [],
    },
    {
      nome: 'Restringido',
      hpPorNivel: 7,      // 1d12 ou 7 por nível (N1: 16 + VIG)
      energiaPorNivel: 0, // Sem energia amaldiçoada — usa Pontos de Vigor (4 por nível, gerenciados manualmente)
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Fortitude', 'Luta', 'Pontaria'],
      // Também recebe 4 quaisquer (exceto Feitiçaria) → player adiciona
      abilities: [],
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
      descricao: 'Espada japonesa de lâmina curva, símbolo dos feiticeiros de clã.',
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
      regraEspecial: 'Disparo em cone: pode atacar todos em linha de 3m à frente.',
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
      descricao: 'Arma ritual de cerimônia, forjada para purificação espiritual.',
    },
  ];

  // ===== LÓGICA DE EXECUÇÃO =====
  // Limpeza de tabelas (ordem respeita foreign keys)
  await prisma.specializationAbility.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.characterSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.origem.deleteMany();
  await prisma.weaponTemplate.deleteMany();

  for (const s of skills) {
    await prisma.skill.create({ data: s });
  }

  for (const spec of specializations) {
    await prisma.specialization.create({
      data: {
        nome: spec.nome,
        hpPorNivel: spec.hpPorNivel,
        energiaPorNivel: spec.energiaPorNivel,
        bonusAtributos: spec.bonusAtributos,
        habilidadesTreinadas: spec.habilidadesTreinadas,
        abilities: {
          create: spec.abilities,
        },
      },
    });
  }

  for (const o of origens) {
    await prisma.origem.create({ data: o });
  }

  for (const w of weaponTemplates) {
    await prisma.weaponTemplate.create({ data: w });
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
