"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');
    const specializations = [
        {
            nome: 'Lutador',
            hpPorNivel: 12,
            energiaPorNivel: 4,
            bonusAtributos: { FOR: 2, AGI: 0, VIG: 1, INT: 0, PRE: 0 },
            habilidadesTreinadas: ['Atletismo', 'Intimidação', 'Determinação'],
            abilities: [
                { nome: 'Combate Corpo a Corpo', nivelRequerido: 1, tipo: 'passiva', custo: 'nenhum', alcance: 'corpo a corpo', duracao: 'permanente', descricao: 'Proficiência em armas corpo a corpo. Pode realizar um ataque adicional por turno com -2 no total.' },
                { nome: 'Resistência Brutal', nivelRequerido: 3, tipo: 'reação', custo: 'nenhum', alcance: 'pessoal', duracao: 'imediato', descricao: 'Quando receber dano, pode rolar VIG + Maestria. Se o resultado for maior que o dano, reduz o dano à metade.' },
                { nome: 'Fúria', nivelRequerido: 5, tipo: 'ativa', custo: 'ação bônus', alcance: 'pessoal', duracao: '3 rodadas', descricao: 'Uma vez por combate, pode entrar em Fúria. +4 em ataques físicos, -2 na CD de defesa.' },
                { nome: 'Campeão', nivelRequerido: 7, tipo: 'passiva', custo: 'nenhum', alcance: 'conforme arma', duracao: 'permanente', descricao: 'Ataques críticos (d20 = 20) causam dano duplo e impõem condição de Atordoado no alvo por 1 rodada.' },
            ],
        },
        {
            nome: 'Especialista em Combate',
            hpPorNivel: 10,
            energiaPorNivel: 6,
            bonusAtributos: { FOR: 1, AGI: 2, VIG: 0, INT: 0, PRE: 0 },
            habilidadesTreinadas: ['Acrobacia', 'Furtividade', 'Atletismo'],
            abilities: [
                { nome: 'Precisão', nivelRequerido: 1, tipo: 'passiva', custo: 'nenhum', alcance: 'à distância', duracao: 'permanente', descricao: '+2 no total de ataques à distância. Pode ignorar cobertura parcial.' },
                { nome: 'Esquiva Ágil', nivelRequerido: 3, tipo: 'reação', custo: 'reação', alcance: 'pessoal', duracao: 'imediato', descricao: 'Uma vez por rodada, pode rolar AGI vs ataque para negar dano completamente.' },
                { nome: 'Tiro Certeiro', nivelRequerido: 5, tipo: 'ativa', custo: '2 pontos de Energia', alcance: 'conforme arma', duracao: 'imediato', descricao: 'Pode gastar 2 de energia para obter +5 em um ataque, declarado antes da rolagem.' },
                { nome: 'Mestre do Campo', nivelRequerido: 7, tipo: 'passiva', custo: 'nenhum', alcance: 'pessoal', duracao: 'permanente', descricao: 'Pode realizar duas ações de movimento por turno sem penalidade.' },
            ],
        },
        {
            nome: 'Especialista em Técnica',
            hpPorNivel: 8,
            energiaPorNivel: 10,
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 2, PRE: 1 },
            habilidadesTreinadas: ['Arcana', 'Investigação', 'História'],
            abilities: [
                { nome: 'Canalização', nivelRequerido: 1, tipo: 'passiva', custo: 'nenhum', alcance: 'pessoal', duracao: 'permanente', descricao: 'Reduz o custo de energia de todas as técnicas em 1 (mínimo 1).' },
                { nome: 'Potência Mágica', nivelRequerido: 3, tipo: 'passiva', custo: 'nenhum', alcance: 'pessoal', duracao: 'permanente', descricao: '+2 no total de rolagens de técnicas.' },
                { nome: 'Sobrecarga', nivelRequerido: 5, tipo: 'ativa', custo: 'HP (máx 5)', alcance: 'pessoal', duracao: 'imediato', descricao: 'Pode gastar HP extra (máx 5) para aumentar o total de uma técnica em igual quantidade.' },
                { nome: 'Domínio', nivelRequerido: 7, tipo: 'passiva', custo: 'nenhum', alcance: 'pessoal', duracao: 'permanente', descricao: 'Técnicas de nível 3+ custam metade da energia (arredondado para cima).' },
            ],
        },
        {
            nome: 'Controlador',
            hpPorNivel: 9,
            energiaPorNivel: 8,
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 1, PRE: 2 },
            habilidadesTreinadas: ['Persuasão', 'Intuição', 'Intimidação'],
            abilities: [
                { nome: 'Imposição de Condição', nivelRequerido: 1, tipo: 'passiva', custo: 'nenhum', alcance: 'conforme técnica', duracao: 'permanente', descricao: 'Condições aplicadas por suas técnicas duram 1 rodada a mais.' },
                { nome: 'Campo de Força', nivelRequerido: 3, tipo: 'ativa', custo: 'ação', alcance: 'todos os aliados', duracao: '2 rodadas', descricao: 'Uma vez por combate, cria uma barreira que absorve 10 de dano para todos os aliados.' },
                { nome: 'Dominação', nivelRequerido: 5, tipo: 'ativa', custo: 'ação', alcance: 'conforme técnica', duracao: 'imediato', descricao: 'Pode forçar um alvo a repetir um teste que já realizou (uma vez por combate).' },
                { nome: 'Mestre do Caos', nivelRequerido: 7, tipo: 'passiva', custo: 'nenhum', alcance: 'pessoal', duracao: 'permanente', descricao: 'Pode aplicar duas condições diferentes em um único alvo com uma técnica.' },
            ],
        },
        {
            nome: 'Suporte',
            hpPorNivel: 8,
            energiaPorNivel: 8,
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 1, INT: 0, PRE: 2 },
            habilidadesTreinadas: ['Medicina', 'Persuasão', 'Intuição'],
            abilities: [
                { nome: 'Cura Menor', nivelRequerido: 1, tipo: 'ativa', custo: '3 pontos de Energia', alcance: 'aliado adjacente', duracao: 'imediato', descricao: 'Restaura 1d6 + PRE HP em um aliado adjacente.' },
                { nome: 'Escudo Mental', nivelRequerido: 3, tipo: 'reação', custo: 'reação', alcance: 'aliado adjacente', duracao: 'imediato', descricao: 'Uma vez por combate, pode absorver dano destinado a um aliado (até seu nível + PRE).' },
                { nome: 'Bênção', nivelRequerido: 5, tipo: 'ativa', custo: '4 pontos de Energia', alcance: 'aliado até 9m', duracao: '3 rodadas', descricao: 'Concede +2 em todos os testes a um aliado.' },
                { nome: 'Ressurgimento', nivelRequerido: 7, tipo: 'especial', custo: 'nenhum', alcance: 'aliado em visão', duracao: 'permanente (por campanha)', descricao: 'Uma vez por campanha, impede que um aliado chegue a 0 HP, mantendo-o com 1 HP.' },
            ],
        },
        {
            nome: 'Restringido',
            hpPorNivel: 6,
            energiaPorNivel: 3,
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
            habilidadesTreinadas: [],
            abilities: [
                { nome: 'Limitado', nivelRequerido: 1, tipo: 'especial', custo: 'nenhum', alcance: 'pessoal', duracao: 'permanente', descricao: 'Personagem possui restrições especiais que limitam suas capacidades. Consultar Mestre.' },
                { nome: 'Superação', nivelRequerido: 3, tipo: 'especial', custo: 'XP extra', alcance: 'pessoal', duracao: '1 combate', descricao: 'Pode gastar XP extra para superar temporariamente uma restrição por 1 combate.' },
            ],
        },
        {
            nome: 'Feiticeiro',
            hpPorNivel: 8,
            energiaPorNivel: 12,
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 1, PRE: 2 },
            habilidadesTreinadas: ['Arcana', 'Intuição', 'Persuasão'],
            abilities: [
                {
                    nome: 'Manipulação de Energia',
                    nivelRequerido: 1,
                    tipo: 'ativa',
                    custo: 'variável (mínimo 1 ponto de Energia)',
                    alcance: 'conforme técnica utilizada',
                    duracao: 'variável',
                    descricao: 'Permite canalizar energia amaldiçoada para executar técnicas e habilidades sobrenaturais.',
                },
                {
                    nome: 'Reforço Amaldiçoado',
                    nivelRequerido: 1,
                    tipo: 'ativa',
                    custo: '1 ponto de Energia',
                    alcance: 'pessoal',
                    duracao: '3 rodadas',
                    descricao: 'Adiciona bônus em dano corpo a corpo igual ao atributo espiritual.',
                },
                {
                    nome: 'Técnica Inata',
                    nivelRequerido: 1,
                    tipo: 'especial',
                    custo: 'variável',
                    alcance: 'variável',
                    duracao: 'variável',
                    descricao: 'Habilidade única do personagem, definida na criação. Evolui com o nível.',
                },
                {
                    nome: 'Expansão de Domínio',
                    nivelRequerido: 5,
                    tipo: 'ativa',
                    custo: 'alto (mínimo 4 pontos de Energia)',
                    alcance: 'área de 9m',
                    duracao: '3 rodadas',
                    descricao: 'Cria uma área onde suas técnicas recebem bônus e inimigos sofrem penalidades defensivas.',
                },
            ],
        },
        {
            nome: 'Caçador de Maldições',
            hpPorNivel: 10,
            energiaPorNivel: 8,
            abilities: [
                {
                    nome: 'Sentir Presença',
                    nivelRequerido: 1,
                    tipo: 'passiva',
                    custo: 'nenhum',
                    alcance: '9m',
                    duracao: 'permanente',
                    descricao: 'Detecta automaticamente presenças amaldiçoadas próximas.',
                },
                {
                    nome: 'Marca do Exorcista',
                    nivelRequerido: 1,
                    tipo: 'ativa',
                    custo: '1 ponto de Energia',
                    alcance: '12m',
                    duracao: 'até o fim do combate',
                    descricao: 'Alvo marcado sofre bônus de dano adicional quando atingido pelo caçador.',
                },
                {
                    nome: 'Golpe Purificador',
                    nivelRequerido: 3,
                    tipo: 'ativa',
                    custo: '2 pontos de Energia',
                    alcance: 'corpo a corpo',
                    duracao: 'imediato',
                    descricao: 'Adiciona 2d6 de dano espiritual contra maldições.',
                },
                {
                    nome: 'Resistência Espiritual',
                    nivelRequerido: 5,
                    tipo: 'passiva',
                    custo: 'nenhum',
                    alcance: 'pessoal',
                    duracao: 'permanente',
                    descricao: 'Recebe redução de dano contra efeitos espirituais.',
                },
            ],
        },
        {
            nome: 'Hospedeiro',
            hpPorNivel: 11,
            energiaPorNivel: 9,
            abilities: [
                {
                    nome: 'Vínculo com Entidade',
                    nivelRequerido: 1,
                    tipo: 'passiva',
                    custo: 'nenhum',
                    alcance: 'pessoal',
                    duracao: 'permanente',
                    descricao: 'Abriga uma entidade amaldiçoada que concede bônus específicos.',
                },
                {
                    nome: 'Manifestação Parcial',
                    nivelRequerido: 1,
                    tipo: 'ativa',
                    custo: '2 pontos de Energia',
                    alcance: 'pessoal',
                    duracao: '2 rodadas',
                    descricao: 'Manifesta parte do poder da entidade, recebendo bônus físicos e espirituais.',
                },
                {
                    nome: 'Influência Interna',
                    nivelRequerido: 3,
                    tipo: 'especial',
                    custo: 'variável',
                    alcance: 'pessoal',
                    duracao: 'variável',
                    descricao: 'Pode permitir que a entidade interfira para alterar testes ou efeitos, com risco narrativo.',
                },
                {
                    nome: 'Manifestação Completa',
                    nivelRequerido: 5,
                    tipo: 'ativa',
                    custo: 'alto (mínimo 4 pontos de Energia)',
                    alcance: 'pessoal',
                    duracao: '3 rodadas',
                    descricao: 'Libera completamente o poder da entidade, aumentando significativamente atributos e dano, com possíveis consequências após o uso.',
                },
            ],
        },
    ];
    for (const spec of specializations) {
        const existing = await prisma.specialization.findFirst({ where: { nome: spec.nome } });
        if (!existing) {
            await prisma.specialization.create({
                data: {
                    nome: spec.nome,
                    hpPorNivel: spec.hpPorNivel,
                    energiaPorNivel: spec.energiaPorNivel,
                    bonusAtributos: spec.bonusAtributos ?? { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
                    habilidadesTreinadas: spec.habilidadesTreinadas ?? [],
                    abilities: {
                        create: spec.abilities.map((a) => ({
                            nome: a.nome,
                            nivelRequerido: a.nivelRequerido,
                            tipo: a.tipo,
                            custo: a.custo,
                            alcance: a.alcance,
                            duracao: a.duracao,
                            descricao: a.descricao,
                        })),
                    },
                },
            });
            console.log(`Created specialization: ${spec.nome}`);
        }
        else {
            await prisma.specialization.update({
                where: { id: existing.id },
                data: {
                    bonusAtributos: spec.bonusAtributos ?? { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 },
                    habilidadesTreinadas: spec.habilidadesTreinadas ?? [],
                },
            });
            for (const a of spec.abilities) {
                const existingAbility = await prisma.specializationAbility.findFirst({
                    where: { specializationId: existing.id, nome: a.nome },
                });
                if (!existingAbility) {
                    await prisma.specializationAbility.create({
                        data: {
                            specializationId: existing.id,
                            nome: a.nome,
                            nivelRequerido: a.nivelRequerido,
                            tipo: a.tipo,
                            custo: a.custo,
                            alcance: a.alcance,
                            duracao: a.duracao,
                            descricao: a.descricao,
                        },
                    });
                    console.log(`  Added ability "${a.nome}" to ${spec.nome}`);
                }
            }
        }
    }
    const skills = [
        { nome: 'Atletismo', atributoBase: client_1.Atributo.FOR, permiteMaestria: true, descricao: 'Escalada, natação, corrida e saltos. Usado para superar obstáculos físicos.' },
        { nome: 'Intimidação', atributoBase: client_1.Atributo.FOR, permiteMaestria: true, descricao: 'Coagir alguém com força física ou presença ameaçadora.' },
        { nome: 'Acrobacia', atributoBase: client_1.Atributo.AGI, permiteMaestria: true, descricao: 'Equilíbrio, cambalhotas, manobras em combate. Evitar quedas e armadilhas.' },
        { nome: 'Furtividade', atributoBase: client_1.Atributo.AGI, permiteMaestria: true, descricao: 'Mover-se silenciosamente e passar despercebido.' },
        { nome: 'Destreza Manual', atributoBase: client_1.Atributo.AGI, permiteMaestria: true, descricao: 'Bater carteiras, abrir fechaduras, desativar armadilhas.' },
        { nome: 'Fortitude', atributoBase: client_1.Atributo.VIG, permiteMaestria: true, descricao: 'Resistir a venenos, doenças, fadiga e condições físicas adversas.' },
        { nome: 'Determinação', atributoBase: client_1.Atributo.VIG, permiteMaestria: true, descricao: 'Manter-se de pé sob condições extremas de dor ou exaustão.' },
        { nome: 'Arcana', atributoBase: client_1.Atributo.INT, permiteMaestria: true, descricao: 'Conhecimento sobre magia, rituais, criaturas mágicas e artefatos.' },
        { nome: 'História', atributoBase: client_1.Atributo.INT, permiteMaestria: true, descricao: 'Eventos históricos, linhagens nobres, guerras passadas.' },
        { nome: 'Investigação', atributoBase: client_1.Atributo.INT, permiteMaestria: true, descricao: 'Encontrar pistas, decifrar códigos, analisar evidências.' },
        { nome: 'Medicina', atributoBase: client_1.Atributo.INT, permiteMaestria: true, descricao: 'Estabilizar personagens moribundos, diagnosticar doenças.' },
        { nome: 'Natureza', atributoBase: client_1.Atributo.INT, permiteMaestria: true, descricao: 'Conhecimento sobre fauna, flora, terrenos e fenômenos naturais.' },
        { nome: 'Religião', atributoBase: client_1.Atributo.INT, permiteMaestria: true, descricao: 'Deuses, rituais sagrados, mortos-vivos e planos espirituais.' },
        { nome: 'Enganação', atributoBase: client_1.Atributo.PRE, permiteMaestria: true, descricao: 'Mentir de forma convincente, criar disfarces, manipular.' },
        { nome: 'Persuasão', atributoBase: client_1.Atributo.PRE, permiteMaestria: true, descricao: 'Influenciar alguém através de argumentos, charme ou diplomacia.' },
        { nome: 'Performance', atributoBase: client_1.Atributo.PRE, permiteMaestria: true, descricao: 'Atuar, cantar, dançar ou entreter uma audiência.' },
        { nome: 'Intuição', atributoBase: client_1.Atributo.PRE, permiteMaestria: true, descricao: 'Detectar mentiras, sentir intenções ocultas, perceber o humor de alguém.' },
        { nome: 'Percepção', atributoBase: client_1.Atributo.PRE, permiteMaestria: true, descricao: 'Notar detalhes do ambiente, detectar presença de criaturas ocultas.' },
    ];
    for (const skill of skills) {
        const existing = await prisma.skill.findFirst({ where: { nome: skill.nome } });
        if (!existing) {
            await prisma.skill.create({ data: skill });
            console.log(`Created skill: ${skill.nome}`);
        }
    }
    const aptitudes = [
        {
            nome: 'Ataque Poderoso',
            descricao: 'Pode sofrer –2 na rolagem de ataque para causar +2 no dano.',
            prerequisitos: [],
            modificadores: [{ type: 'attackPenalty', value: -2 }, { type: 'damageBonus', value: 2 }, { tipo: 'geral', custo: 'nenhum', alcance: 'corpo a corpo', duracao: 'imediato', requisito: 'Força 2+' }],
        },
        {
            nome: 'Defesa Total',
            descricao: 'Gasta uma ação para receber +2 na Defesa até o próximo turno.',
            prerequisitos: [],
            modificadores: [{ type: 'defenseBonus', value: 2, condition: 'fullDefenseAction' }, { tipo: 'geral', custo: 'ação', alcance: 'pessoal', duracao: '1 rodada' }],
        },
        {
            nome: 'Desarme',
            descricao: 'Teste oposto contra o alvo; em caso de sucesso, o alvo derruba a arma.',
            prerequisitos: [],
            modificadores: [{ type: 'maneuver', name: 'disarm' }, { tipo: 'geral', custo: 'ação', alcance: 'corpo a corpo', duracao: 'imediato' }],
        },
        {
            nome: 'Agarrar',
            descricao: 'Impede movimentação do alvo até que ele vença teste oposto de Força ou Destreza.',
            prerequisitos: [],
            modificadores: [{ type: 'maneuver', name: 'grapple' }, { tipo: 'geral', custo: 'ação', alcance: 'corpo a corpo', duracao: 'sustentado' }],
        },
        {
            nome: 'Investida',
            descricao: 'Move até o dobro do deslocamento em linha reta e realiza um ataque com –2 na Defesa até o próximo turno.',
            prerequisitos: [],
            modificadores: [{ type: 'maneuver', name: 'charge' }, { tipo: 'geral', custo: 'ação completa', alcance: 'deslocamento + corpo a corpo', duracao: 'imediato' }],
        },
        {
            nome: 'Ataque Giratório',
            descricao: 'Realiza um ataque contra todos os inimigos adjacentes.',
            prerequisitos: [],
            modificadores: [{ type: 'maneuver', name: 'whirlwind' }, { tipo: 'combate avançado', custo: 'ação completa', alcance: 'corpo a corpo', duracao: 'imediato', requisito: 'Proficiência Marcial' }],
        },
        {
            nome: 'Postura Defensiva',
            descricao: 'Recebe redução de dano 2 contra ataques físicos por 3 rodadas.',
            prerequisitos: [],
            modificadores: [{ type: 'damageReduction', value: 2, damageType: 'FISICO' }, { tipo: 'combate avançado', custo: 'ação bônus', alcance: 'pessoal', duracao: '3 rodadas', requisito: 'Constituição 2+' }],
        },
        {
            nome: 'Crítico Aprimorado',
            descricao: 'Amplia a margem de ameaça crítica em 1 (passivo).',
            prerequisitos: [],
            modificadores: [{ type: 'threatRangeBonus', value: -1 }, { tipo: 'combate avançado', custo: 'passivo', alcance: 'conforme arma', duracao: 'permanente', requisito: 'Proficiência Marcial' }],
        },
        {
            nome: 'Percepção Amaldiçoada',
            descricao: 'Detecta presenças amaldiçoadas e energia espiritual ativa em área de 9m.',
            prerequisitos: [],
            modificadores: [{ type: 'sobrenatural', name: 'detectionAura' }, { tipo: 'sobrenatural', custo: '1 ponto de Energia', alcance: '9m', duracao: 'concentração', requisito: 'Afinidade Espiritual' }],
        },
        {
            nome: 'Explosão Espiritual',
            descricao: 'Causa 2d6 de dano espiritual em área de 3m de raio a 12m de alcance.',
            prerequisitos: [],
            modificadores: [{ type: 'sobrenatural', name: 'spiritBlast', damageDice: '2d6', damageType: 'ESPIRITUAL' }, { tipo: 'sobrenatural', custo: '2 pontos de Energia', alcance: '12m (área 3m)', duracao: 'imediato', requisito: 'Afinidade Espiritual 2+' }],
        },
        {
            nome: 'Reforço Corporal',
            descricao: '+2 em testes físicos e +2 no dano corpo a corpo por 3 rodadas.',
            prerequisitos: [],
            modificadores: [{ type: 'physicalBonus', value: 2 }, { type: 'meleeDamageBonus', value: 2 }, { tipo: 'sobrenatural', custo: '1 ponto de Energia', alcance: 'pessoal', duracao: '3 rodadas', requisito: 'Afinidade Espiritual' }],
        },
        {
            nome: 'Barreira Espiritual',
            descricao: 'Concede +2 na Defesa contra ataques físicos e espirituais por 2 rodadas.',
            prerequisitos: [],
            modificadores: [{ type: 'defenseBonus', value: 2 }, { tipo: 'sobrenatural', custo: '2 pontos de Energia', alcance: 'pessoal ou aliado até 6m', duracao: '2 rodadas', requisito: 'Afinidade Espiritual 2+' }],
        },
        {
            nome: 'Foco Intenso',
            descricao: 'Recebe +2 no próximo teste de habilidade após gastar uma ação bônus.',
            prerequisitos: [],
            modificadores: [{ type: 'nextTestBonus', value: 2 }, { tipo: 'técnica', custo: 'ação bônus', alcance: 'pessoal', duracao: '1 rodada', requisito: 'Vontade 2+' }],
        },
        {
            nome: 'Leitura de Combate',
            descricao: '+2 na Defesa contra um ataque após ver o movimento do oponente (reação).',
            prerequisitos: [],
            modificadores: [{ type: 'defenseBonus', value: 2, trigger: 'reaction' }, { tipo: 'técnica', custo: 'reação', alcance: '6m', duracao: 'imediato', requisito: 'Percepção 2+' }],
        },
        {
            nome: 'Movimento Ágil',
            descricao: 'Deslocamento base aumenta em +3m (passivo permanente).',
            prerequisitos: [],
            modificadores: [{ type: 'movementBonus', value: 3 }, { tipo: 'técnica', custo: 'passivo', alcance: 'pessoal', duracao: 'permanente', requisito: 'Destreza 2+' }],
        },
        {
            nome: 'Golpe Poderoso',
            descricao: 'Seus ataques físicos ignoram 2 pontos de defesa do alvo.',
            prerequisitos: [],
            modificadores: [{ type: 'defenseIgnore', value: 2 }],
        },
        {
            nome: 'Reflexos Aguçados',
            descricao: '+2 em iniciativa e em testes de Acrobacia defensivos.',
            prerequisitos: [],
            modificadores: [{ type: 'initiativeBonus', value: 2 }, { type: 'skillBonus', skill: 'Acrobacia', value: 2 }],
        },
        {
            nome: 'Foco em Técnicas',
            descricao: 'Reduz o custo de energia de técnicas em 1 (mínimo 1).',
            prerequisitos: [],
            modificadores: [{ type: 'energyCostReduction', value: 1 }],
        },
        {
            nome: 'Pele de Ferro',
            descricao: 'Aumenta o HP máximo em 5.',
            prerequisitos: [],
            modificadores: [{ type: 'hpBonus', value: 5 }],
        },
        {
            nome: 'Reserva de Energia',
            descricao: 'Aumenta a energia máxima em 3.',
            prerequisitos: [],
            modificadores: [{ type: 'energyBonus', value: 3 }],
        },
        {
            nome: 'Mestre das Sombras',
            descricao: '+3 em testes de Furtividade. Pode se mover furtivamente sem penalidade de velocidade.',
            prerequisitos: [],
            modificadores: [{ type: 'skillBonus', skill: 'Furtividade', value: 3 }],
        },
        {
            nome: 'Leitor de Almas',
            descricao: '+2 em Intuição. Uma vez por cena, pode detectar automaticamente se alguém está mentindo.',
            prerequisitos: [],
            modificadores: [{ type: 'skillBonus', skill: 'Intuição', value: 2 }],
        },
        {
            nome: 'Erudito',
            descricao: '+2 em duas perícias de INT à sua escolha (definidas ao adquirir).',
            prerequisitos: [],
            modificadores: [{ type: 'skillBonus', skill: 'INT', value: 2 }],
        },
        {
            nome: 'Durabilidade',
            descricao: 'Reduz o dano recebido em 1 (mínimo 1 de dano).',
            prerequisitos: ['Pele de Ferro'],
            modificadores: [{ type: 'damageReduction', value: 1 }],
        },
        {
            nome: 'Maestria Arcana',
            descricao: '+2 em todas as rolagens de técnicas. Requer Especialista em Técnica.',
            prerequisitos: ['Foco em Técnicas'],
            modificadores: [{ type: 'techniqueBonus', value: 2 }],
        },
        {
            nome: 'Velocidade Sobrenatural',
            descricao: 'Pode realizar uma ação de movimento extra por turno sem penalidade.',
            prerequisitos: ['Reflexos Aguçados'],
            modificadores: [{ type: 'extraMovement', value: 1 }],
        },
        {
            nome: 'Resistência à Magia',
            descricao: '+3 na CD contra técnicas mágicas que visem você.',
            prerequisitos: [],
            modificadores: [{ type: 'cdBonus', damageType: 'ENERGETICO', value: 3 }],
        },
    ];
    const aptitudeMap = new Map();
    for (const apt of aptitudes) {
        const existing = await prisma.aptitude.findFirst({ where: { nome: apt.nome } });
        if (existing) {
            aptitudeMap.set(apt.nome, existing.id);
        }
        else {
            const created = await prisma.aptitude.create({
                data: {
                    nome: apt.nome,
                    descricao: apt.descricao,
                    prerequisitos: [],
                    modificadores: apt.modificadores,
                },
            });
            aptitudeMap.set(apt.nome, created.id);
            console.log(`Created aptitude: ${apt.nome}`);
        }
    }
    for (const apt of aptitudes) {
        if (apt.prerequisitos.length > 0) {
            const prereqIds = apt.prerequisitos
                .map((name) => aptitudeMap.get(name))
                .filter(Boolean);
            const aptId = aptitudeMap.get(apt.nome);
            if (aptId && prereqIds.length > 0) {
                await prisma.aptitude.update({
                    where: { id: aptId },
                    data: { prerequisitos: prereqIds },
                });
            }
        }
    }
    const levelProgression = [
        { level: 1, xpRequired: 0, ganhoAtributo: false, ganhoMaestria: false },
        { level: 2, xpRequired: 300, ganhoAtributo: true, ganhoMaestria: false },
        { level: 3, xpRequired: 900, ganhoAtributo: false, ganhoMaestria: true },
        { level: 4, xpRequired: 2700, ganhoAtributo: true, ganhoMaestria: false },
        { level: 5, xpRequired: 6500, ganhoAtributo: false, ganhoMaestria: false },
        { level: 6, xpRequired: 14000, ganhoAtributo: true, ganhoMaestria: true },
        { level: 7, xpRequired: 23000, ganhoAtributo: false, ganhoMaestria: false },
        { level: 8, xpRequired: 34000, ganhoAtributo: true, ganhoMaestria: false },
        { level: 9, xpRequired: 48000, ganhoAtributo: false, ganhoMaestria: true },
        { level: 10, xpRequired: 64000, ganhoAtributo: true, ganhoMaestria: false },
        { level: 11, xpRequired: 85000, ganhoAtributo: false, ganhoMaestria: false },
        { level: 12, xpRequired: 100000, ganhoAtributo: true, ganhoMaestria: true },
        { level: 13, xpRequired: 120000, ganhoAtributo: false, ganhoMaestria: false },
        { level: 14, xpRequired: 140000, ganhoAtributo: true, ganhoMaestria: false },
        { level: 15, xpRequired: 165000, ganhoAtributo: false, ganhoMaestria: true },
        { level: 16, xpRequired: 195000, ganhoAtributo: true, ganhoMaestria: false },
        { level: 17, xpRequired: 225000, ganhoAtributo: false, ganhoMaestria: false },
        { level: 18, xpRequired: 265000, ganhoAtributo: true, ganhoMaestria: true },
        { level: 19, xpRequired: 305000, ganhoAtributo: false, ganhoMaestria: false },
        { level: 20, xpRequired: 355000, ganhoAtributo: true, ganhoMaestria: false },
    ];
    for (const prog of levelProgression) {
        await prisma.levelProgression.upsert({
            where: { level: prog.level },
            update: prog,
            create: prog,
        });
    }
    console.log('Level progression seeded');
    const conditions = [
        {
            nome: 'Atordoado',
            descricao: 'Personagem não pode agir. Perde seu turno.',
            duracaoRodadas: 1,
            efeitoMecanico: [{ type: 'skipTurn', value: true }],
        },
        {
            nome: 'Envenenado',
            descricao: 'Sofre 1d4 de dano no início de cada turno.',
            duracaoRodadas: 3,
            efeitoMecanico: [{ type: 'dotDamage', diceType: 'd4', value: 1 }],
        },
        {
            nome: 'Assustado',
            descricao: '-2 em todos os testes enquanto a fonte do medo estiver visível.',
            duracaoRodadas: 2,
            efeitoMecanico: [{ type: 'allTestsPenalty', value: -2 }],
        },
        {
            nome: 'Paralisado',
            descricao: 'Não pode mover nem agir. CD de defesa é 5 (muito vulnerável).',
            duracaoRodadas: 2,
            efeitoMecanico: [{ type: 'skipTurn', value: true }, { type: 'cdOverride', value: 5 }],
        },
        {
            nome: 'Cego',
            descricao: '-4 em ataques. Alvos têm +2 na CD contra ataques cegos.',
            duracaoRodadas: 2,
            efeitoMecanico: [{ type: 'attackPenalty', value: -4 }],
        },
        {
            nome: 'Desarmado',
            descricao: 'Não pode usar técnicas de nível 2+. Ataques físicos com -2.',
            duracaoRodadas: 2,
            efeitoMecanico: [{ type: 'techniqueLevelLimit', value: 1 }, { type: 'attackPenalty', value: -2 }],
        },
        {
            nome: 'Queimando',
            descricao: 'Sofre 2 de dano Energético no início de cada turno.',
            duracaoRodadas: 3,
            efeitoMecanico: [{ type: 'dotDamage', damageType: 'ENERGETICO', value: 2 }],
        },
        {
            nome: 'Lento',
            descricao: 'Só pode se mover ou agir em cada turno, não ambos.',
            duracaoRodadas: 2,
            efeitoMecanico: [{ type: 'halfActions', value: true }],
        },
        {
            nome: 'Imobilizado',
            descricao: 'Não pode se mover, mas ainda pode agir.',
            duracaoRodadas: 2,
            efeitoMecanico: [{ type: 'noMovement', value: true }],
        },
        {
            nome: 'Vulnerável',
            descricao: 'Recebe +2 de dano de todos os ataques.',
            duracaoRodadas: 2,
            efeitoMecanico: [{ type: 'incomingDamageBonus', value: 2 }],
        },
    ];
    for (const cond of conditions) {
        const existing = await prisma.condition.findFirst({ where: { nome: cond.nome } });
        if (!existing) {
            await prisma.condition.create({ data: cond });
            console.log(`Created condition: ${cond.nome}`);
        }
    }
    const weaponTemplates = [
        {
            nome: 'Adaga',
            categoria: 'SIMPLES',
            damageDice: '1d4',
            tipoDano: 'perfurante',
            distancia: 'corpo a corpo; arremesso 6m',
            duasMaos: false,
            requiresMarcial: false,
            regraEspecial: null,
        },
        {
            nome: 'Clava',
            categoria: 'SIMPLES',
            damageDice: '1d6',
            tipoDano: 'contundente',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: false,
            regraEspecial: null,
        },
        {
            nome: 'Foice',
            categoria: 'SIMPLES',
            damageDice: '1d6',
            tipoDano: 'cortante',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: false,
            regraEspecial: null,
        },
        {
            nome: 'Lança',
            categoria: 'SIMPLES',
            damageDice: '1d6',
            tipoDano: 'perfurante',
            distancia: 'corpo a corpo; arremesso 9m',
            duasMaos: false,
            requiresMarcial: false,
            regraEspecial: null,
        },
        {
            nome: 'Maça',
            categoria: 'SIMPLES',
            damageDice: '1d6',
            tipoDano: 'contundente',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: false,
            regraEspecial: null,
        },
        {
            nome: 'Porrete',
            categoria: 'SIMPLES',
            damageDice: '1d4',
            tipoDano: 'contundente',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: false,
            regraEspecial: null,
        },
        {
            nome: 'Espada Curta',
            categoria: 'MARCIAL',
            damageDice: '1d6',
            tipoDano: 'cortante',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Espada Longa',
            categoria: 'MARCIAL',
            damageDice: '1d8',
            tipoDano: 'cortante',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Montante',
            categoria: 'MARCIAL',
            damageDice: '2d6',
            tipoDano: 'cortante',
            distancia: 'corpo a corpo',
            duasMaos: true,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Machado de Batalha',
            categoria: 'MARCIAL',
            damageDice: '1d8',
            tipoDano: 'cortante',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Martelo de Guerra',
            categoria: 'MARCIAL',
            damageDice: '1d8',
            tipoDano: 'contundente',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Alabarda',
            categoria: 'MARCIAL',
            damageDice: '1d10',
            tipoDano: 'cortante',
            distancia: 'corpo a corpo; alcance 3m',
            duasMaos: true,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Arco Curto',
            categoria: 'DISTANCIA',
            damageDice: '1d6',
            tipoDano: 'perfurante',
            distancia: '24m',
            duasMaos: false,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Arco Longo',
            categoria: 'DISTANCIA',
            damageDice: '1d8',
            tipoDano: 'perfurante',
            distancia: '45m',
            duasMaos: true,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Besta Leve',
            categoria: 'DISTANCIA',
            damageDice: '1d8',
            tipoDano: 'perfurante',
            distancia: '24m',
            duasMaos: true,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Besta Pesada',
            categoria: 'DISTANCIA',
            damageDice: '1d10',
            tipoDano: 'perfurante',
            distancia: '30m',
            duasMaos: true,
            requiresMarcial: true,
            regraEspecial: null,
        },
        {
            nome: 'Chicote',
            categoria: 'ESPECIAL',
            damageDice: '1d4',
            tipoDano: 'cortante',
            distancia: 'corpo a corpo; alcance 3m',
            duasMaos: false,
            requiresMarcial: true,
            regraEspecial: 'Pode realizar tentativa de desarme ou agarrar à distância (3m), usando teste oposto conforme regra de manobras.',
        },
        {
            nome: 'Rede',
            categoria: 'ESPECIAL',
            damageDice: '0',
            tipoDano: 'nenhum',
            distancia: 'arremesso 6m',
            duasMaos: false,
            requiresMarcial: false,
            regraEspecial: 'Alvo atingido fica Restrito até se libertar (teste de Força ou ação para se soltar). Não causa dano, é arma de controle.',
        },
        {
            nome: 'Corrente',
            categoria: 'ESPECIAL',
            damageDice: '1d6',
            tipoDano: 'contundente',
            distancia: 'corpo a corpo; alcance 3m',
            duasMaos: false,
            requiresMarcial: true,
            regraEspecial: 'Pode tentar agarrar como ação adicional após atingir o alvo.',
        },
        {
            nome: 'Lâmina Dupla',
            categoria: 'ESPECIAL',
            damageDice: '1d8',
            tipoDano: 'cortante',
            distancia: 'corpo a corpo',
            duasMaos: true,
            requiresMarcial: true,
            regraEspecial: 'Permite ataque adicional com a outra extremidade causando 1d4 (sem adicionar modificador de atributo no dano).',
        },
        {
            nome: 'Manopla',
            categoria: 'ESPECIAL',
            damageDice: '1d4',
            tipoDano: 'contundente',
            distancia: 'corpo a corpo',
            duasMaos: false,
            requiresMarcial: false,
            regraEspecial: 'Considerada ataque desarmado aprimorado; pode ser usada mesmo quando o personagem está desarmado formalmente.',
        },
    ];
    for (const wt of weaponTemplates) {
        const existing = await prisma.weaponTemplate.findFirst({ where: { nome: wt.nome } });
        if (!existing) {
            await prisma.weaponTemplate.create({ data: wt });
            console.log(`Created weapon template: ${wt.nome}`);
        }
    }
    const origens = [
        {
            nome: 'Nobre',
            descricao: 'Criado entre privilégios e intrigas políticas. Domina a arte da palavra e conhece os segredos das famílias poderosas.',
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 1, PRE: 2 },
            habilidadesTreinadas: ['Persuasão', 'História', 'Enganação'],
        },
        {
            nome: 'Criminoso',
            descricao: 'Cresceu nas sombras, aprendendo a sobreviver por meios duvidosos. Conhece cada beco e cada face oculta da cidade.',
            bonusAtributos: { FOR: 0, AGI: 2, VIG: 0, INT: 1, PRE: 0 },
            habilidadesTreinadas: ['Furtividade', 'Destreza Manual', 'Enganação'],
        },
        {
            nome: 'Eremita',
            descricao: 'Viveu isolado, em contato com a natureza ou o espiritual. Possui resiliência incomum e sabedoria adquirida na solidão.',
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 2, INT: 1, PRE: 0 },
            habilidadesTreinadas: ['Natureza', 'Medicina', 'Percepção'],
        },
        {
            nome: 'Militar',
            descricao: 'Forjado em campos de batalha. Disciplinado, fisicamente robusto e treinado para suportar o peso da guerra.',
            bonusAtributos: { FOR: 2, AGI: 0, VIG: 1, INT: 0, PRE: 0 },
            habilidadesTreinadas: ['Atletismo', 'Determinação', 'Intimidação'],
        },
        {
            nome: 'Erudito',
            descricao: 'Passou anos em bibliotecas e academias. Sua mente é uma enciclopédia de conhecimentos arcanos e históricos.',
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 2, PRE: 1 },
            habilidadesTreinadas: ['Arcana', 'História', 'Investigação'],
        },
        {
            nome: 'Mercenário',
            descricao: 'Lutou por quem pagasse melhor. Ágil, forte e pragmático — sabe que sobreviver vale mais do que qualquer causa.',
            bonusAtributos: { FOR: 1, AGI: 2, VIG: 0, INT: 0, PRE: 0 },
            habilidadesTreinadas: ['Atletismo', 'Acrobacia', 'Intimidação'],
        },
        {
            nome: 'Místico',
            descricao: 'Ligado a forças além da compreensão comum. Sua intuição beira o sobrenatural e sua presença inspira respeito e temor.',
            bonusAtributos: { FOR: 0, AGI: 0, VIG: 0, INT: 1, PRE: 2 },
            habilidadesTreinadas: ['Arcana', 'Intuição', 'Religião'],
        },
        {
            nome: 'Viajante',
            descricao: 'Percorreu terras distantes e culturas diversas. Adaptável e perspicaz, sabe ler pessoas e ambientes com facilidade.',
            bonusAtributos: { FOR: 0, AGI: 1, VIG: 1, INT: 0, PRE: 1 },
            habilidadesTreinadas: ['Percepção', 'Furtividade', 'Natureza'],
        },
    ];
    for (const origem of origens) {
        const existing = await prisma.origem.findFirst({ where: { nome: origem.nome } });
        if (!existing) {
            await prisma.origem.create({ data: origem });
            console.log(`Created origem: ${origem.nome}`);
        }
        else {
            await prisma.origem.update({
                where: { id: existing.id },
                data: {
                    descricao: origem.descricao,
                    bonusAtributos: origem.bonusAtributos,
                    habilidadesTreinadas: origem.habilidadesTreinadas,
                },
            });
        }
    }
    console.log('Seeding complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map