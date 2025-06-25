/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ALGORITMO DE SUBSEQUÊNCIA COMUM MAIS LONGA (LCS) - PROGRAMAÇÃO DINÂMICA
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * AUTORES DO GRUPO:
 * - Carlos Alberto
 * - Gabriela Maria
 * - Gabriel Assunção
 * - Gabriel Botini
 * - Guilherme Saliba
 * - Gustavo Souza
 * - Marcelo Ferreira
 * - Vinícus do Amaral

 *
 * INFORMAÇÕES DO PROJETO:
 * - Disciplina: Fundamentos de Projeto e Análise de Algoritmos
 * - Versão: 1.0
 * - Data: 2025-06-23
 * - Linguagem: TypeScript
 *
 * OBJETIVO:
 * Encontrar o comprimento da maior subsequência que aparece em ambas as strings,
 * mantendo a ordem relativa dos caracteres (mas não precisa ser contígua).
 *
 * EXEMPLO PRÁTICO:
 * Helena: "ijkijkii"
 * Marcus: "ikjikji"
 * LCS possível: "ijkji" (comprimento = 5)
 *
 * ESTRATÉGIA:
 * Usar uma tabela para armazenar soluções de subproblemas menores,
 * evitando recalcular as mesmas comparações múltiplas vezes.
 */

/**
 * FUNÇÃO PRINCIPAL: Calcula o comprimento da maior subsequência comum
 *
 * COMO FUNCIONA:
 * 1. Cria uma tabela onde cada célula [i,j] guarda o comprimento da LCS
 *    entre os primeiros 'i' caracteres de Helena e 'j' caracteres de Marcus
 * 2. Preenche a tabela linha por linha, comparando caractere por caractere
 * 3. Usa a lógica: se caracteres são iguais, soma 1; senão, pega o máximo
 *
 * @param string1 - Sequência de eventos de Helena (ex: "abc")
 * @param string2 - Sequência de eventos de Marcus (ex: "ac")
 * @returns Comprimento da maior subsequência comum (ex: 2 para "ac")
 */
export function calculateLCSLength(string1: string, string2: string): number {
  // Passo 1: Descobrir os tamanhos das duas sequências
  const length1 = string1.length;
  const length2 = string2.length;

  // Passo 2: Criar a tabela de programação dinâmica
  // Adiciona +1 para incluir o caso "string vazia" (linha/coluna 0)
  const dpTable: number[][] = [];

  // Inicializar todas as células com 0
  for (let row = 0; row <= length1; row++) {
    dpTable[row] = [];
    for (let col = 0; col <= length2; col++) {
      dpTable[row][col] = 0;
    }
  }

  // Passo 3: Preencher a tabela seguindo a lógica da programação dinâmica
  for (let i = 1; i <= length1; i++) {
    for (let j = 1; j <= length2; j++) {
      // Pegar os caracteres atuais (lembrar que array começa em 0, mas tabela em 1)
      const char1 = string1[i - 1];
      const char2 = string2[j - 1];

      if (char1 === char2) {
        // CASO 1: Caracteres são iguais!
        // Pegamos a LCS dos caracteres anteriores e somamos 1
        dpTable[i][j] = dpTable[i - 1][j - 1] + 1;
      } else {
        // CASO 2: Caracteres são diferentes
        // Pegamos o melhor resultado entre "ignorar char1" ou "ignorar char2"
        const fromAbove = dpTable[i - 1][j]; // LCS sem este char da string1
        const fromLeft = dpTable[i][j - 1]; // LCS sem este char da string2

        dpTable[i][j] = Math.max(fromAbove, fromLeft);
      }
    }
  }

  // Passo 4: O resultado final está no canto inferior direito da tabela
  const lcsLength = dpTable[length1][length2];

  return lcsLength;
}

/**
 * FUNÇÃO DE RECONSTRUÇÃO: Encontra UMA das subsequências comuns mais longas
 *
 * COMO FUNCIONA:
 * Agora que temos a tabela preenchida, precisamos descobrir QUAL é a subsequência.
 * Fazemos isso "voltando" pela tabela, seguindo o caminho que gerou os valores.
 *
 * ESTRATÉGIA DE NAVEGAÇÃO:
 * - Se caracteres são iguais: esse char está na LCS, vai diagonal
 * - Se diferentes: vai para o lado que tem maior valor
 *
 * EXEMPLO:
 * Para string1="abc" e string2="ac", a tabela mostra que LCS tem tamanho 2.
 * Navegando de volta, descobrimos que a LCS é "ac".
 *
 * @param string1 - Primeira sequência original
 * @param string2 - Segunda sequência original
 * @param dpTable - Tabela já preenchida pela função anterior
 * @returns Uma string representando a LCS (ex: "ac")
 */

export function reconstructOneLCS(
  string1: string,
  string2: string,
  dpTable: number[][]
): string {
  // Começar do canto inferior direito da tabela (onde está o resultado final)
  let i = string1.length;
  let j = string2.length;

  // Array para guardar os caracteres da LCS (vamos construir de trás para frente)
  const lcsChars: string[] = [];

  // Caminhar pela tabela até chegar no início
  while (i > 0 && j > 0) {
    // Pegar os caracteres atuais
    const char1 = string1[i - 1];
    const char2 = string2[j - 1];

    if (char1 === char2) {
      // ENCONTROU UM MATCH!
      // Este caractere faz parte da LCS
      lcsChars.unshift(char1); // Adiciona no início (porque estamos indo de trás pra frente)

      // Move diagonalmente (ambos diminuem)
      i--;
      j--;
    } else {
      // NÃO HÁ MATCH
      // Precisa decidir qual caminho seguir

      const valueFromAbove = dpTable[i - 1][j];
      const valueFromLeft = dpTable[i][j - 1];

      if (valueFromAbove > valueFromLeft) {
        // Ir para cima (ignorar caractere atual da string1)
        i--;
      } else {
        // Ir para esquerda (ignorar caractere atual da string2)
        j--;
      }
    }
  }

  // Juntar todos os caracteres encontrados numa string
  const lcsResult = lcsChars.join("");

  return lcsResult;
}

/**
 * FUNÇÃO AUXILIAR: Constrói a tabela de programação dinâmica completa para visualização
 *
 * PROPÓSITO:
 * Esta função é idêntica à anterior, mas retorna a tabela completa ao invés
 * de apenas o resultado final. Isso é útil para:
 * - Exibir na interface gráfica
 * - Debugar o algoritmo
 * - Entender como a tabela é preenchida
 *
 * @param string1 - Primeira sequência
 * @param string2 - Segunda sequência
 * @returns A tabela DP completa (matriz de números)
 */
export function buildDPTable(string1: string, string2: string): number[][] {
  // Usar a mesma lógica da função anterior, otimizada para performance
  const length1 = string1.length;
  const length2 = string2.length;

  // Criar tabela preenchida com zeros
  const dpTable: number[][] = [];
  for (let row = 0; row <= length1; row++) {
    dpTable[row] = [];
    for (let col = 0; col <= length2; col++) {
      dpTable[row][col] = 0;
    }
  }

  // Preencher tabela com a mesma lógica
  for (let i = 1; i <= length1; i++) {
    for (let j = 1; j <= length2; j++) {
      if (string1[i - 1] === string2[j - 1]) {
        dpTable[i][j] = dpTable[i - 1][j - 1] + 1;
      } else {
        dpTable[i][j] = Math.max(dpTable[i - 1][j], dpTable[i][j - 1]);
      }
    }
  }

  return dpTable;
}
