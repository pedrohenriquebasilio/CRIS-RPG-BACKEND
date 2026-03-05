import 'dotenv/config';
import { PrismaClient, Atributo } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando Seed: Feiticeiros & Maldições v2.0 (Custom Attrs)');

  // ===== ESPECIALIZAÇÕES (CLASSES) =====
  // HP e PE baseados na progressão do sistema v2.0
  const specializations = [
    {
      nome: 'Lutador',
      hpPorNivel: 12,
      energiaPorNivel: 3,
      bonusAtributos: { FOR: 2, AGI: 0, VIG: 1, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Atletismo', 'Luta', 'Fortitude'],
      abilities: [
        {
          nome: 'Briga',
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: '0',
          alcance: 'pessoal',
          duracao: 'permanente',
          descricao:
            'Seus ataques desarmados causam 1d6 de dano e escalam com nível.',
        },
        {
          nome: 'Técnica de Luta',
          nivelRequerido: 2,
          tipo: 'passiva',
          custo: '0',
          alcance: 'pessoal',
          duracao: 'permanente',
          descricao:
            'Recebe um Estilo de Luta (ex: Focado em Potência ou Agilidade).',
        },
      ],
    },
    {
      nome: 'Especialista em Combate',
      hpPorNivel: 10,
      energiaPorNivel: 4,
      bonusAtributos: { FOR: 1, AGI: 2, VIG: 0, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Luta', 'Pontaria', 'Iniciativa'],
      abilities: [
        {
          nome: 'Maestria Marcial',
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: '0',
          alcance: 'pessoal',
          duracao: 'permanente',
          descricao:
            'Você é proficiente com todas as armas marciais e recebe +2 em rolagens de dano com armas.',
        },
      ],
    },
    {
      nome: 'Especialista em Técnica',
      hpPorNivel: 8,
      energiaPorNivel: 6,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 2, PRE: 1 },
      habilidadesTreinadas: ['Feitiçaria', 'Ocultismo', 'Vontade'],
      abilities: [
        {
          nome: 'Eficiência Amaldiçoada',
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: '0',
          alcance: 'pessoal',
          duracao: 'permanente',
          descricao:
            'O custo de energia de suas Técnicas Inatas é reduzido em 1 (mínimo 1).',
        },
      ],
    },
    {
      nome: 'Controlador',
      hpPorNivel: 8,
      energiaPorNivel: 5,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 1, PRE: 2 },
      habilidadesTreinadas: ['Feitiçaria', 'Percepção', 'Intuição'],
      abilities: [
        {
          nome: 'Comando de Invocação',
          nivelRequerido: 1,
          tipo: 'ativa',
          custo: 'Ação Bônus',
          alcance: '9m',
          duracao: 'imediato',
          descricao:
            'Gasta uma ação bônus para comandar um Shikigami ou criatura sob seu controle.',
        },
      ],
    },
    {
      nome: 'Suporte',
      hpPorNivel: 8,
      energiaPorNivel: 5,
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 1, INT: 0, PRE: 2 },
      habilidadesTreinadas: ['Medicina', 'Diplomacia', 'Vontade'],
      abilities: [
        {
          nome: 'Auxílio Amaldiçoado',
          nivelRequerido: 1,
          tipo: 'ativa',
          custo: '2 PE',
          alcance: '9m',
          duracao: 'imediato',
          descricao: 'Concede bônus de +d4 em um teste de um aliado.',
        },
      ],
    },
    {
      nome: 'Restringido',
      hpPorNivel: 14,
      energiaPorNivel: 0,
      bonusAtributos: { FOR: 2, AGI: 2, VIG: 2, INT: 0, PRE: 0 },
      habilidadesTreinadas: [
        'Atletismo',
        'Acrobacia',
        'Percepção',
        'Furtividade',
      ],
      abilities: [
        {
          nome: 'Restrição Celestial',
          nivelRequerido: 1,
          tipo: 'passiva',
          custo: '0',
          alcance: 'pessoal',
          duracao: 'permanente',
          descricao:
            'Você não possui energia amaldiçoada, mas recebe bônus massivos em atributos físicos e sentidos.',
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

  // ===== ORIGENS (v2.0) =====
  const origens = [
    {
      nome: 'Estudante de Jujutsu',
      descricao: 'Você frequenta uma das escolas técnicas de Tokyo ou Kyoto.',
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 1, PRE: 1 },
      habilidadesTreinadas: ['Feitiçaria', 'Ocultismo'],
    },
    {
      nome: 'Membro de Clã',
      descricao: 'Nascido em uma das grandes famílias de feiticeiros.',
      bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 2 },
      habilidadesTreinadas: ['História', 'Diplomacia'],
    },
    {
      nome: 'Ex-Militar',
      descricao:
        'Treinamento tático e físico rigoroso antes de descobrir o jujutsu.',
      bonusAtributos: { FOR: 1, AGI: 0, VIG: 1, INT: 0, PRE: 0 },
      habilidadesTreinadas: ['Luta', 'Atletismo'],
    },
  ];

  // ===== LÓGICA DE EXECUÇÃO =====
  // Limpeza de tabelas (Opcional, mas recomendado para seed limpa)
  await prisma.specializationAbility.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.origem.deleteMany();

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
