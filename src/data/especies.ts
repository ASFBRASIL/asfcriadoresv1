// Dados completos das espécies de abelhas sem ferrão do Brasil
// Fontes: Embrapa, Moure's Catalogue, ICMBio

export interface Especie {
  id: string;
  nomeCientifico: string;
  nomesPopulares: string[];
  nomesAlternativos?: string[];
  familia: string;
  genero?: string;
  subgenero?: string;
  tamanho: 'pequena' | 'média' | 'grande';
  producaoMel: 'baixa' | 'média' | 'alta' | 'muito alta';
  distribuicao: string[];
  biomas: string[];
  caracteristicas: string[];
  comportamento: string;
  mel: {
    descricao: string;
    propriedades: string[];
    sabor: string;
    cor?: string;
    producaoAnual?: string;
  };
  manejo: {
    dificuldade: 'iniciante' | 'intermediário' | 'avançado';
    caixaIdeal: string;
    temperamento: string;
    cuidadosEspeciais: string[];
  };
  conservacao: {
    status: 'comum' | 'vulnerável' | 'ameaçada' | 'rara';
    ameacas: string[];
  };
  imagem?: string;
  fontes: string[];
  statusPesquisa?: string;
}

export const especies: Especie[] = [
  {
    id: 'tetragonisca-angustula',
    nomeCientifico: 'Tetragonisca angustula',
    nomesPopulares: ['Jataí', 'Abelha-ouro', 'Mariola'],
    nomesAlternativos: ['Moça-branca', 'Jaty', 'Maria-seca', 'Mosquito-amarelo'],
    familia: 'Apidae',
    genero: 'Tetragonisca',
    tamanho: 'pequena',
    producaoMel: 'média',
    distribuicao: ['Nacional'],
    biomas: ['Amazônia', 'Cerrado', 'Mata Atlântica', 'Caatinga', 'Pantanal', 'Pampa'],
    caracteristicas: [
      'Corpo escuro com faixas amarelas no abdômen',
      'Entrada do ninho em forma de tubo de cerume',
      'Colônias com 3.000 a 5.000 indivíduos',
      'Uma das espécies mais dóceis',
      'Muito comum em áreas urbanas'
    ],
    comportamento: 'Extremamente dócil, não ataca humanos. Constrói ninhos em cavidades de árvores, paredes e caixas racionais. É a espécie mais criada no Brasil devido à facilidade de manejo.',
    mel: {
      descricao: 'Mel claro a âmbar, de consistência fluida',
      propriedades: ['Alto teor de água', 'Propriedades antibacterianas', 'Rico em minerais'],
      sabor: 'Doce suave, levemente ácido, com notas florais',
      cor: 'Claro a âmbar',
      producaoAnual: '1-2 litros por colônia'
    },
    manejo: {
      dificuldade: 'iniciante',
      caixaIdeal: 'Caixa INPA ou modelo Fernando Oliveira',
      temperamento: 'Muito dócil, ideal para iniciantes',
      cuidadosEspeciais: ['Proteger do vento', 'Manter sombreamento parcial', 'Evitar excesso de umidade']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Uso de agrotóxicos', 'Perda de habitat']
    },
    imagem: '/images/especies/jatai.jpg',
    fontes: ['Embrapa', 'Moure\'s Catalogue', 'ICMBio']
  },
  {
    id: 'melipona-scutellaris',
    nomeCientifico: 'Melipona scutellaris',
    nomesPopulares: ['Uruçu-verdadeira', 'Uruçu-nordestina'],
    nomesAlternativos: ['Uruçu', 'Uruçu-do-nordeste'],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'grande',
    producaoMel: 'muito alta',
    distribuicao: ['Nordeste', 'Bahia', 'Sergipe', 'Alagoas', 'Pernambuco', 'Paraíba', 'Rio Grande do Norte'],
    biomas: ['Caatinga', 'Mata Atlântica'],
    caracteristicas: [
      'Corpo robusto e escuro',
      'Uma das maiores espécies de meliponas',
      'Colônias com até 5.000 indivíduos',
      'Excelente produtora de mel',
      'Altamente adaptada ao semiárido'
    ],
    comportamento: 'Espécie mansa quando bem manejada. Constrói ninhos em cavidades de árvores grandes. Rainha longeva, colônias podem durar décadas.',
    mel: {
      descricao: 'Mel âmbar escuro, de alta qualidade',
      propriedades: ['Alto teor de açúcares', 'Propriedades cicatrizantes', 'Rico em antioxidantes'],
      sabor: 'Doce intenso, sabor marcante e persistente',
      cor: 'Âmbar escuro',
      producaoAnual: '3-8 litros por colônia'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa de maior porte, modelo INPA grande',
      temperamento: 'Mansa quando adaptada',
      cuidadosEspeciais: ['Requer caixa espaçosa', 'Boa ventilação', 'Proteção térmica no verão']
    },
    conservacao: {
      status: 'vulnerável',
      ameacas: ['Exploração predatória', 'Desmatamento', 'Mudanças climáticas']
    },
    imagem: '/images/especies/urucu.jpg',
    fontes: ['Embrapa', 'ICMBio', 'Universidade Federal da Bahia']
  },
  {
    id: 'melipona-mandacaia',
    nomeCientifico: 'Melipona quadrifasciata',
    nomesPopulares: ['Mandaçaia', 'Mandaçaia-grande'],
    nomesAlternativos: ['Uruçu-amarela'],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'grande',
    producaoMel: 'alta',
    distribuicao: ['Sul', 'Sudeste', 'Centro-Oeste', 'Minas Gerais', 'São Paulo', 'Paraná', 'Santa Catarina', 'Rio Grande do Sul'],
    biomas: ['Mata Atlântica', 'Cerrado', 'Pampa'],
    caracteristicas: [
      'Abdômen com quatro faixas amarelas',
      'Corpo robusto e peludo',
      'Colônias com 3.000 a 4.000 indivíduos',
      'Boa produtora de mel e própolis',
      'Adaptada a climas temperados'
    ],
    comportamento: 'Espécie dócil e produtiva. Constrói ninhos em troncos ocos e caixas racionais. Boa para polinização de culturas.',
    mel: {
      descricao: 'Mel claro a âmbar, de boa qualidade',
      propriedades: ['Bom teor de açúcares', 'Propriedades antimicrobianas'],
      sabor: 'Doce equilibrado, levemente floral',
      cor: 'Claro a âmbar',
      producaoAnual: '2-5 litros por colônia'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa INPA ou Paulo Nogueira-Neto',
      temperamento: 'Dócil',
      cuidadosEspeciais: ['Proteger do frio intenso', 'Boa ventilação', 'Divisões periódicas']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Perda de habitat', 'Uso de agrotóxicos']
    },
    imagem: '/images/especies/mandacaia.jpg',
    fontes: ['Embrapa', 'EPAGRI']
  },
  {
    id: 'melipona-subnitida',
    nomeCientifico: 'Melipona subnitida',
    nomesPopulares: ['Jandaíra'],
    nomesAlternativos: ['Jandaíra-do-nordeste'],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'média',
    producaoMel: 'média',
    distribuicao: ['Nordeste', 'Ceará', 'Rio Grande do Norte', 'Paraíba', 'Pernambuco', 'Alagoas', 'Sergipe'],
    biomas: ['Caatinga'],
    caracteristicas: [
      'Corpo escuro com reflexos azulados',
      'Altamente resistente à seca',
      'Colônias com 2.000 a 3.000 indivíduos',
      'Entrada do ninho com cera ondulada',
      'Mel com propriedades medicinais'
    ],
    comportamento: 'Espécie xerófila, muito resistente às condições áridas da Caatinga. Constrói ninhos em cavidades de árvores do semiárido.',
    mel: {
      descricao: 'Mel âmbar, muito valorizado medicinalmente',
      propriedades: ['Propriedades cicatrizantes comprovadas', 'Ação antibacteriana', 'Usado em tratamentos de feridas'],
      sabor: 'Doce intenso, com notas de flores do caatinga',
      cor: 'Âmbar',
      producaoAnual: '1-3 litros por colônia'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa INPA média',
      temperamento: 'Mansa',
      cuidadosEspeciais: ['Adaptada ao calor', 'Não tolera frio intenso', 'Requer flora do semiárido']
    },
    conservacao: {
      status: 'vulnerável',
      ameacas: ['Desertificação', 'Desmatamento da Caatinga', 'Mudanças climáticas']
    },
    imagem: '/images/especies/jandaira.jpg',
    fontes: ['UFPB', 'Embrapa Semiárido']
  },
  {
    id: 'melipona-bicolor',
    nomeCientifico: 'Melipona bicolor',
    nomesPopulares: ['Guaraipo', 'Guarupu'],
    nomesAlternativos: ['Guaráipo'],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'grande',
    producaoMel: 'média',
    distribuicao: ['Sul', 'Sudeste', 'Paraná', 'Santa Catarina', 'Rio Grande do Sul', 'São Paulo', 'Rio de Janeiro'],
    biomas: ['Mata Atlântica', 'Pampa'],
    caracteristicas: [
      'Corpo escuro com pelos claros',
      'Pode ter mais de uma rainha (poliginia)',
      'Colônias muito populosas',
      'Boa produtora de própolis',
      'Adaptada ao clima subtropical'
    ],
    comportamento: 'Espécie única por permitir poliginia (múltiplas rainhas). Constrói ninhos em cavidades de árvores de grande porte.',
    mel: {
      descricao: 'Mel claro, de boa qualidade',
      propriedades: ['Propriedades antimicrobianas', 'Rico em enzymes'],
      sabor: 'Doce suave, sabor delicado'
    },
    manejo: {
      dificuldade: 'avançado',
      caixaIdeal: 'Caixa de grande porte, modelo INPA grande',
      temperamento: 'Moderadamente defensiva',
      cuidadosEspeciais: ['Requer caixa muito espaçosa', 'Bom manejo para evitar enxameação', 'Proteção do frio']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Desmatamento', 'Urbanização']
    },
    imagem: '/images/especies/guaraipo.jpg',
    fontes: ['UFPR', 'Embrapa Florestas']
  },
  {
    id: 'scaptotrigona-postica',
    nomeCientifico: 'Scaptotrigona postica',
    nomesPopulares: ['Mandaguari', 'Mandaguari-comum'],
    nomesAlternativos: [],
    familia: 'Apidae',
    genero: 'Scaptotrigona',
    tamanho: 'média',
    producaoMel: 'média',
    distribuicao: ['Nacional'],
    biomas: ['Amazônia', 'Cerrado', 'Mata Atlântica'],
    caracteristicas: [
      'Corpo escuro com pelos avermelhados',
      'Colônias vigorosas e produtivas',
      'Boa produtora de mel e própolis',
      'Entrada do ninho sem tubo',
      'Muito resistente'
    ],
    comportamento: 'Espécie rústica e resistente. Constrói ninhos em diversos tipos de cavidades. Excelente para iniciantes em regiões úmidas.',
    mel: {
      descricao: 'Mel âmbar, consistente',
      propriedades: ['Alto teor de açúcares', 'Propriedades medicinais'],
      sabor: 'Doce intenso, sabor característico'
    },
    manejo: {
      dificuldade: 'iniciante',
      caixaIdeal: 'Caixa INPA ou modelo simples',
      temperamento: 'Dócil',
      cuidadosEspeciais: ['Muito resistente', 'Tolera diferentes condições', 'Produção regular']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Uso de agrotóxicos']
    },
    imagem: '/images/especies/mandaguari.jpg',
    fontes: ['Embrapa', 'USP']
  },
  {
    id: 'scaptotrigona-bipunctata',
    nomeCientifico: 'Scaptotrigona bipunctata',
    nomesPopulares: ['Tubuna', 'Canudo'],
    nomesAlternativos: ['Tapesuá'],
    familia: 'Apidae',
    genero: 'Scaptotrigona',
    tamanho: 'média',
    producaoMel: 'média',
    distribuicao: ['Norte', 'Nordeste', 'Centro-Oeste', 'Pará', 'Maranhão', 'Piauí', 'Ceará', 'Mato Grosso'],
    biomas: ['Amazônia', 'Cerrado', 'Caatinga'],
    caracteristicas: [
      'Dois pontos claros no tórax',
      'Corpo escuro e peludo',
      'Colônias muito ativas',
      'Boa produtora de própolis',
      'Resistente'
    ],
    comportamento: 'Espécie muito ativa e resistente. Constrói ninhos em cavidades de árvores e caixas. Excelente produtora de própolis.',
    mel: {
      descricao: 'Mel âmbar escuro',
      propriedades: ['Alto teor de açúcares', 'Propriedades antimicrobianas'],
      sabor: 'Doce marcante, sabor intenso'
    },
    manejo: {
      dificuldade: 'iniciante',
      caixaIdeal: 'Caixa INPA',
      temperamento: 'Dócil a moderada',
      cuidadosEspeciais: ['Colônia muito ativa', 'Boa ventilação necessária', 'Produção constante']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Desmatamento']
    },
    imagem: '/images/especies/tubuna.jpg',
    fontes: ['Museu Paraense Emílio Goeldi']
  },
  {
    id: 'melipona-marginata',
    nomeCientifico: 'Melipona marginata',
    nomesPopulares: ['Manduri', 'Manduri-carioca'],
    nomesAlternativos: ['Manduri-amarelo'],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'média',
    producaoMel: 'média',
    distribuicao: ['Sudeste', 'Sul', 'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná', 'Santa Catarina'],
    biomas: ['Mata Atlântica'],
    caracteristicas: [
      'Abdômen com margens amarelas',
      'Corpo escuro e brilhante',
      'Colônias moderadas',
      'Mel de excelente qualidade',
      'Endêmica da Mata Atlântica'
    ],
    comportamento: 'Espécie endêmica da Mata Atlântica. Constrói ninhos em cavidades de árvores. Muito valorizada pela qualidade do mel.',
    mel: {
      descricao: 'Mel claro de alta qualidade',
      propriedades: ['Excelente qualidade', 'Propriedades medicinais'],
      sabor: 'Doce refinado, sabor suave e floral'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa INPA média',
      temperamento: 'Dócil',
      cuidadosEspeciais: ['Requer flora da Mata Atlântica', 'Proteção do habitat', 'Manejo cuidadoso']
    },
    conservacao: {
      status: 'vulnerável',
      ameacas: ['Desmatamento da Mata Atlântica', 'Fragmentação de habitat']
    },
    imagem: '/images/especies/manduri.jpg',
    fontes: ['ICMBio', 'Jardim Botânico do Rio de Janeiro']
  },
  {
    id: 'melipona-seminigra',
    nomeCientifico: 'Melipona seminigra',
    nomesPopulares: ['Uruçu-boca-de-renda', 'Uruçu-cinzenta'],
    nomesAlternativos: [],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'grande',
    producaoMel: 'alta',
    distribuicao: ['Norte', 'Amazônia', 'Pará', 'Amazonas', 'Amapá', 'Roraima'],
    biomas: ['Amazônia'],
    caracteristicas: [
      'Entrada do ninho com cera em forma de renda',
      'Corpo escuro com pelos cinzentos',
      'Uma das maiores produtoras de mel',
      'Colônias grandes',
      'Espécie amazônica'
    ],
    comportamento: 'Espécie típica da Amazônia. Constrói ninhos em cavidades de árvores grandes. A entrada do ninho é característica, com cera em forma de renda.',
    mel: {
      descricao: 'Mel claro a âmbar, produção abundante',
      propriedades: ['Alta produção', 'Propriedades medicinais'],
      sabor: 'Doce suave, sabor floral da Amazônia'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa de grande porte',
      temperamento: 'Mansa',
      cuidadosEspeciais: ['Requer calor e umidade', 'Caixa espaçosa', 'Flora amazônica']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Desmatamento amazônico']
    },
    imagem: '/images/especies/urucu-boca-de-renda.jpg',
    fontes: ['INPA', 'Museu Paraense Emílio Goeldi']
  },
  {
    id: 'melipona-rufiventris',
    nomeCientifico: 'Melipona rufiventris',
    nomesPopulares: ['Uruçu-amarela', 'Tujuba'],
    nomesAlternativos: ['Tuiuva', 'Tujuva'],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'grande',
    producaoMel: 'alta',
    distribuicao: ['Centro-Oeste', 'Sudeste', 'Mato Grosso', 'Mato Grosso do Sul', 'Goiás', 'Distrito Federal', 'Minas Gerais'],
    biomas: ['Cerrado'],
    caracteristicas: [
      'Abdômen avermelhado ou amarelado',
      'Corpo robusto',
      'Boa produtora de mel',
      'Adaptada ao Cerrado',
      'Colônias grandes'
    ],
    comportamento: 'Espécie típica do Cerrado. Constrói ninhos em cavidades de árvores e buracos de cupim. Boa produtora de mel.',
    mel: {
      descricao: 'Mel âmbar de boa qualidade',
      propriedades: ['Boa produção', 'Propriedades nutricionais'],
      sabor: 'Doce equilibrado, sabor característico do Cerrado'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa INPA grande',
      temperamento: 'Mansa',
      cuidadosEspeciais: ['Adaptada ao calor', 'Proteção do frio intenso', 'Flora do Cerrado']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Desmatamento do Cerrado', 'Queimadas']
    },
    imagem: '/images/especies/urucu-amarela.jpg',
    fontes: ['Embrapa Cerrados']
  },
  {
    id: 'melipona-fasciculata',
    nomeCientifico: 'Melipona fasciculata',
    nomesPopulares: ['Tiúba', 'Uruçu-cinzenta'],
    nomesAlternativos: [],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'grande',
    producaoMel: 'muito alta',
    distribuicao: ['Norte', 'Nordeste', 'Maranhão', 'Piauí', 'Ceará', 'Pará', 'Tocantins'],
    biomas: ['Amazônia', 'Cerrado', 'Caatinga'],
    caracteristicas: [
      'Corpo escuro com pelos cinzentos',
      'Uma das maiores produtoras de mel',
      'Colônias muito populosas',
      'Constrói ninhos em troncos',
      'Espécie versátil'
    ],
    comportamento: 'Espécie muito produtiva. Constrói ninhos em troncos de árvores e caixas racionais. Excelente para polinização de culturas.',
    mel: {
      descricao: 'Mel claro a âmbar, produção muito alta',
      propriedades: ['Alta produção', 'Excelente qualidade', 'Propriedades medicinais'],
      sabor: 'Doce suave, sabor floral marcante'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa de grande porte',
      temperamento: 'Mansa',
      cuidadosEspeciais: ['Requer espaço', 'Boa produção de mel', 'Manejo regular']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Desmatamento']
    },
    imagem: '/images/especies/tiuba.jpg',
    fontes: ['Embrapa', 'UFMA']
  },
  {
    id: 'frieseomelitta-varia',
    nomeCientifico: 'Frieseomelitta varia',
    nomesPopulares: ['Marmelada', 'Marmelada-amarela'],
    nomesAlternativos: ['Moça-branca'],
    familia: 'Apidae',
    genero: 'Frieseomelitta',
    tamanho: 'pequena',
    producaoMel: 'baixa',
    distribuicao: ['Nordeste', 'Sergipe', 'Bahia', 'Alagoas', 'Pernambuco'],
    biomas: ['Caatinga', 'Mata Atlântica'],
    caracteristicas: [
      'Corpo pequeno e escuro',
      'Pelos claros no tórax',
      'Colônias pequenas',
      'Mel de qualidade especial',
      'Ideal para iniciantes'
    ],
    comportamento: 'Espécie pequena e dócil. Constrói ninhos em cavidades pequenas. Excelente para iniciantes no Nordeste.',
    mel: {
      descricao: 'Mel claro, valorizado',
      propriedades: ['Propriedades medicinais', 'Sabor especial'],
      sabor: 'Doce delicado, sabor único'
    },
    manejo: {
      dificuldade: 'iniciante',
      caixaIdeal: 'Caixa pequena',
      temperamento: 'Muito dócil',
      cuidadosEspeciais: ['Ideal para iniciantes', 'Manejo simples', 'Produção modesta']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Desmatamento']
    },
    imagem: '/images/especies/marmelada.jpg',
    fontes: ['UFPB', 'Embrapa Semiárido']
  },
  {
    id: 'melipona-mondury',
    nomeCientifico: 'Melipona mondury',
    nomesPopulares: ['Bugia', 'Tujuba'],
    nomesAlternativos: [],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'grande',
    producaoMel: 'média',
    distribuicao: ['Sul', 'Sudeste', 'Paraná', 'Santa Catarina', 'São Paulo', 'Rio de Janeiro'],
    biomas: ['Mata Atlântica'],
    caracteristicas: [
      'Corpo escuro e robusto',
      'Abdômen com faixas amarelas',
      'Colônias grandes',
      'Adaptada ao clima subtropical',
      'Boa produtora'
    ],
    comportamento: 'Espécie da Mata Atlântica. Constrói ninhos em cavidades de árvores. Boa produtora de mel e própolis.',
    mel: {
      descricao: 'Mel âmbar de boa qualidade',
      propriedades: ['Propriedades medicinais', 'Boa produção'],
      sabor: 'Doce equilibrado'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa INPA grande',
      temperamento: 'Dócil',
      cuidadosEspeciais: ['Proteção do frio', 'Flora da Mata Atlântica', 'Manejo cuidadoso']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Desmatamento']
    },
    imagem: '/images/especies/bugia.jpg',
    fontes: ['UFPR']
  },
  {
    id: 'scaptotrigona-depilis',
    nomeCientifico: 'Scaptotrigona depilis',
    nomesPopulares: ['Tombuna', 'Canudo'],
    nomesAlternativos: ['Mandaguari', 'Tubiba'],
    familia: 'Apidae',
    genero: 'Scaptotrigona',
    tamanho: 'média',
    producaoMel: 'média',
    distribuicao: ['Centro-Oeste', 'Sudeste', 'Sul', 'Mato Grosso do Sul', 'São Paulo', 'Paraná', 'Santa Catarina'],
    biomas: ['Cerrado', 'Mata Atlântica', 'Pampa'],
    caracteristicas: [
      'Corpo escuro com pelos claros',
      'Colônias ativas',
      'Boa produtora de mel',
      'Resistente',
      'Versátil'
    ],
    comportamento: 'Espécie rústica e versátil. Constrói ninhos em diversas cavidades. Boa para iniciantes em regiões do Centro-Oeste e Sul.',
    mel: {
      descricao: 'Mel âmbar consistente',
      propriedades: ['Propriedades antimicrobianas', 'Boa produção'],
      sabor: 'Doce intenso'
    },
    manejo: {
      dificuldade: 'iniciante',
      caixaIdeal: 'Caixa INPA',
      temperamento: 'Dócil',
      cuidadosEspeciais: ['Muito resistente', 'Adaptável', 'Produção regular']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Uso de agrotóxicos']
    },
    imagem: '/images/especies/tombuna.jpg',
    fontes: ['Embrapa']
  },
  {
    id: 'plebeia-remota',
    nomeCientifico: 'Plebeia remota',
    nomesPopulares: ['Mirim-guaçu', 'Mirim-guaçu-amarela'],
    nomesAlternativos: [],
    familia: 'Apidae',
    genero: 'Plebeia',
    tamanho: 'pequena',
    producaoMel: 'baixa',
    distribuicao: ['Sul', 'Sudeste', 'Paraná', 'Santa Catarina', 'Rio Grande do Sul', 'São Paulo'],
    biomas: ['Mata Atlântica', 'Pampa'],
    caracteristicas: [
      'Corpo muito pequeno',
      'Pelos amarelos no tórax',
      'Colônias pequenas',
      'Resistente ao frio',
      'Adaptada ao clima subtropical'
    ],
    comportamento: 'Espécie pequena resistente ao frio. Constrói ninhos em cavidades pequenas. Ideal para regiões de clima temperado.',
    mel: {
      descricao: 'Mel claro em quantidade modesta',
      propriedades: ['Propriedades medicinais'],
      sabor: 'Doce delicado'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa pequena',
      temperamento: 'Dócil',
      cuidadosEspeciais: ['Resistente ao frio', 'Caixa pequena', 'Manejo delicado']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Urbanização']
    },
    imagem: '/images/especies/mirim-guacu.jpg',
    fontes: ['UFPR']
  },
  {
    id: 'melipona-asilvai',
    nomeCientifico: 'Melipona asilvai',
    nomesPopulares: ['Rajada', 'Manduri'],
    nomesAlternativos: [],
    familia: 'Apidae',
    genero: 'Melipona',
    tamanho: 'média',
    producaoMel: 'média',
    distribuicao: ['Nordeste', 'Bahia', 'Sergipe', 'Alagoas', 'Pernambuco'],
    biomas: ['Caatinga', 'Mata Atlântica'],
    caracteristicas: [
      'Abdômen com faixas claras',
      'Corpo escuro',
      'Colônias moderadas',
      'Boa produtora',
      'Adaptada ao Nordeste'
    ],
    comportamento: 'Espécie do Nordeste brasileiro. Constrói ninhos em cavidades de árvores. Boa produtora de mel.',
    mel: {
      descricao: 'Mel âmbar de boa qualidade',
      propriedades: ['Propriedades medicinais'],
      sabor: 'Doce equilibrado'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa INPA média',
      temperamento: 'Dócil',
      cuidadosEspeciais: ['Adaptada ao calor', 'Flora do Nordeste', 'Proteção da seca']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Desmatamento']
    },
    imagem: '/images/especies/rajada.jpg',
    fontes: ['UFPB']
  },
  {
    id: 'trigona-spinipes',
    nomeCientifico: 'Trigona spinipes',
    nomesPopulares: ['Irapuá', 'Arapuá'],
    nomesAlternativos: ['Abelha-cachorro'],
    familia: 'Apidae',
    genero: 'Trigona',
    tamanho: 'média',
    producaoMel: 'média',
    distribuicao: ['Nacional'],
    biomas: ['Amazônia', 'Cerrado', 'Mata Atlântica', 'Caatinga'],
    caracteristicas: [
      'Corpo escuro com pelos',
      'Colônias muito populosas',
      'Constrói ninhos expostos',
      'Às vezes considerada praga',
      'Muito resistente'
    ],
    comportamento: 'Espécie muito comum que constrói ninhos expostos em galhos. Pode ser considerada praga em pomares devido ao hábito de morder frutas. Não é ideal para meliponicultura.',
    mel: {
      descricao: 'Mel escuro, usado principalmente pela colônia',
      propriedades: ['Produção para autoconsumo'],
      sabor: 'Azedo, não comercializado'
    },
    manejo: {
      dificuldade: 'avançado',
      caixaIdeal: 'Não recomendada para criação',
      temperamento: 'Defensiva',
      cuidadosEspeciais: ['Não recomendada para iniciantes', 'Pode ser praga', 'Manejo complexo']
    },
    conservacao: {
      status: 'comum',
      ameacas: []
    },
    imagem: '/images/especies/irapua.jpg',
    fontes: ['USP']
  },
  {
    id: 'partamona-helleri',
    nomeCientifico: 'Partamona helleri',
    nomesPopulares: ['Boca-de-sapo', 'Cupira'],
    nomesAlternativos: [],
    familia: 'Apidae',
    genero: 'Partamona',
    tamanho: 'média',
    producaoMel: 'baixa',
    distribuicao: ['Sudeste', 'Sul', 'São Paulo', 'Rio de Janeiro', 'Paraná', 'Santa Catarina'],
    biomas: ['Mata Atlântica'],
    caracteristicas: [
      'Corpo escuro e robusto',
      'Entrada do ninho característica',
      'Colônias moderadas',
      'Constrói ninhos em muros e barrancos',
      'Endêmica da Mata Atlântica'
    ],
    comportamento: 'Espécie que constrói ninhos em muros, barrancos e cavidades de rochas. Endêmica da Mata Atlântica.',
    mel: {
      descricao: 'Mel escuro em quantidade modesta',
      propriedades: ['Propriedades medicinais'],
      sabor: 'Doce intenso'
    },
    manejo: {
      dificuldade: 'avançado',
      caixaIdeal: 'Caixa especial para espécies de ninho exposto',
      temperamento: 'Moderadamente defensiva',
      cuidadosEspeciais: ['Requer caixa especial', 'Manejo específico', 'Proteção do habitat']
    },
    conservacao: {
      status: 'vulnerável',
      ameacas: ['Desmatamento da Mata Atlântica']
    },
    imagem: '/images/especies/boca-de-sapo.jpg',
    fontes: ['ICMBio']
  },
  {
    id: 'nannotrigona-testaceicornis',
    nomeCientifico: 'Nannotrigona testaceicornis',
    nomesPopulares: ['Iraí', 'Irai'],
    nomesAlternativos: [],
    familia: 'Apidae',
    genero: 'Nannotrigona',
    tamanho: 'pequena',
    producaoMel: 'baixa',
    distribuicao: ['Sudeste', 'Sul', 'São Paulo', 'Rio de Janeiro', 'Paraná', 'Santa Catarina'],
    biomas: ['Mata Atlântica'],
    caracteristicas: [
      'Corpo muito pequeno',
      'Antenas claras',
      'Colônias pequenas',
      'Adaptada a áreas urbanas',
      'Dócil'
    ],
    comportamento: 'Espécie pequena dócil que se adapta bem a áreas urbanas. Constrói ninhos em cavidades pequenas.',
    mel: {
      descricao: 'Mel claro em pequena quantidade',
      propriedades: ['Propriedades medicinais'],
      sabor: 'Doce delicado'
    },
    manejo: {
      dificuldade: 'intermediário',
      caixaIdeal: 'Caixa pequena',
      temperamento: 'Muito dócil',
      cuidadosEspeciais: ['Adaptada a áreas urbanas', 'Caixa pequena', 'Manejo delicado']
    },
    conservacao: {
      status: 'comum',
      ameacas: ['Urbanização']
    },
    imagem: '/images/especies/irai.jpg',
    fontes: ['USP']
  }
];

// Função para buscar espécies por nome (científico ou popular)
export function buscarEspecies(termo: string): Especie[] {
  const termoLower = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  return especies.filter(especie => {
    const nomeCientificoMatch = especie.nomeCientifico.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .includes(termoLower);
    
    const nomesPopularesMatch = especie.nomesPopulares.some(nome => 
      nome.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(termoLower)
    );
    
    return nomeCientificoMatch || nomesPopularesMatch;
  });
}

// Função para obter todas as espécies para o filtro
export function getTodasEspeciesParaFiltro(): { id: string; nome: string; nomeCientifico: string }[] {
  return especies.map(e => ({
    id: e.id,
    nome: e.nomesPopulares[0],
    nomeCientifico: e.nomeCientifico
  }));
}

// Função para obter espécie por ID
export function getEspeciePorId(id: string): Especie | undefined {
  return especies.find(e => e.id === id);
}

// Estatísticas
export const estatisticasEspecies = {
  total: especies.length,
  porBioma: {
    'Amazônia': especies.filter(e => e.biomas.includes('Amazônia')).length,
    'Mata Atlântica': especies.filter(e => e.biomas.includes('Mata Atlântica')).length,
    'Cerrado': especies.filter(e => e.biomas.includes('Cerrado')).length,
    'Caatinga': especies.filter(e => e.biomas.includes('Caatinga')).length,
    'Pantanal': especies.filter(e => e.biomas.includes('Pantanal')).length,
    'Pampa': especies.filter(e => e.biomas.includes('Pampa')).length,
  },
  porTamanho: {
    pequena: especies.filter(e => e.tamanho === 'pequena').length,
    média: especies.filter(e => e.tamanho === 'média').length,
    grande: especies.filter(e => e.tamanho === 'grande').length,
  },
  porDificuldade: {
    iniciante: especies.filter(e => e.manejo.dificuldade === 'iniciante').length,
    intermediário: especies.filter(e => e.manejo.dificuldade === 'intermediário').length,
    avançado: especies.filter(e => e.manejo.dificuldade === 'avançado').length,
  }
};
