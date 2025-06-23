/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📚 SUBSEQUÊNCIA COMUM MAIS LONGA (LCS) - PROGRAMAÇÃO DINÂMICA + BACKTRACKING
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 👥 AUTORES DO GRUPO:
 * - Carlos Ferreira

 *
 * 📋 INFORMAÇÕES DO PROJETO:
 * - Disciplina: Fundamentos de Projeto e Análise de Algoritmos
 * - Versão: 1.0
 * - Data: 2025-06-23
 * - Linguagem: TypeScript
 * - Framework: Vue 3
 *
 * 🎯 OBJETIVO:
 * Este arquivo implementa a versão completa que combina programação dinâmica
 * com backtracking para encontrar TODAS as subsequências comuns mais longas.
 *
 * 🔄 POR QUE O BACKTRACKING É NECESSÁRIO:
 * A programação dinâmica sozinha só nos dá o COMPRIMENTO da LCS.
 * Para encontrar TODAS as strings LCS possíveis, precisamos explorar todos os
 * caminhos válidos pela tabela DP que levam à solução ótima.
 */

import { buildDPTable } from "./lcs-dynamic-programming";

/**
 * 🔍 FUNÇÃO PRINCIPAL: Encontra todas as subsequências comuns mais longas entre duas strings
 *
 * 📝 COMO FUNCIONA EM DUAS FASES:
 *
 * FASE 1 - Programação Dinâmica:
 * - Constrói a tabela DP com comprimentos de LCS para todos os subproblemas
 * - Isso nos dá o "mapa" das soluções ótimas
 *
 * FASE 2 - Backtracking:
 * - Explora todos os caminhos pela tabela DP que levam a LCS ótimas
 * - Quando caracteres combinam: sempre os inclui (apenas um caminho)
 * - Quando caracteres diferem: explora AMBAS as direções se levam ao valor ótimo
 *
 * 💡 EXEMPLO:
 * Para "ijkijkii" e "ikjikji", existem múltiplas LCS de comprimento 5:
 * "ijiji", "ijiki", "ijkji", "ikiji", "ikiki", "ikjii", "ikjki"
 *
 * @param string1 - Primeira sequência (eventos de Helena)
 * @param string2 - Segunda sequência (eventos de Marcus)
 * @returns Array com todas as LCS únicas em ordem alfabética
 */
export function findAllLCS(string1: string, string2: string): string[] {
  // 📊 Fase 1: Construir a tabela de programação dinâmica
  const dpTable = buildDPTable(string1, string2);

  // 📦 Fase 2: Usar backtracking para encontrar todas as LCS
  const allLCSSet = new Set<string>(); // Set automaticamente previne duplicatas

  /**
   * 🔄 FUNÇÃO RECURSIVA DE BACKTRACKING
   *
   * Esta função explora todos os caminhos válidos pela tabela DP.
   * É como resolver um labirinto onde múltiplos caminhos podem levar ao tesouro!
   *
   * @param i - Posição atual na string1 (linha na tabela DP)
   * @param j - Posição atual na string2 (coluna na tabela DP)
   * @param currentLCS - LCS construída até agora (construímos de trás para frente)
   */
  function exploreAllPaths(i: number, j: number, currentLCS: string): void {
    // 🏁 CASO BASE: Chegamos ao início de uma ou ambas as strings
    if (i === 0 || j === 0) {
      // Construímos a LCS de trás para frente, então reverter antes de adicionar
      const completeLCS = currentLCS.split("").reverse().join("");
      allLCSSet.add(completeLCS);
      return;
    }

    // Pegar os caracteres atuais
    const char1 = string1[i - 1];
    const char2 = string2[j - 1];

    if (char1 === char2) {
      // ✅ CARACTERES COMBINAM!
      // Este caractere DEVE fazer parte da LCS
      // Apenas um caminho a explorar: ir diagonal
      exploreAllPaths(i - 1, j - 1, currentLCS + char1);
    } else {
      // ❌ CARACTERES SÃO DIFERENTES
      // Precisamos explorar todas as direções que mantêm o comprimento ótimo da LCS

      const valueFromAbove = dpTable[i - 1][j]; // Vindo de cima (ignorar char1)
      const valueFromLeft = dpTable[i][j - 1]; // Vindo da esquerda (ignorar char2)
      const currentValue = dpTable[i][j]; // Valor da célula atual

      // 🔍 Explorar caminho de cima se leva à solução ótima
      if (valueFromAbove === currentValue) {
        exploreAllPaths(i - 1, j, currentLCS);
      }

      // 🔍 Explorar caminho da esquerda se leva à solução ótima
      if (valueFromLeft === currentValue) {
        exploreAllPaths(i, j - 1, currentLCS);
      }

      // Nota: Ambos os caminhos podem ser válidos! É por isso que podemos ter múltiplas LCS.
    }
  }

  // 🚀 Iniciar o backtracking do canto inferior direito da tabela DP
  exploreAllPaths(string1.length, string2.length, "");

  // 📋 Converter Set para Array e ordenar alfabeticamente (como exigido pelo problema)
  return Array.from(allLCSSet).sort();
}

/**
 * Interface para representar um passo do algoritmo de backtracking.
 * Útil para visualização do processo.
 */
export interface BacktrackStep {
  i: number;
  j: number;
  currentLCS: string;
  decision: "match" | "up" | "left" | "both";
  char1?: string;
  char2?: string;
}

/**
 * Versão detalhada que retorna todos os passos do backtracking.
 * Útil para visualização e compreensão do algoritmo.
 *
 * @param string1 - Primeira string
 * @param string2 - Segunda string
 * @returns Objeto contendo as LCS encontradas e os passos do algoritmo
 */
export function findAllLCSWithSteps(
  string1: string,
  string2: string
): {
  lcs: string[];
  steps: BacktrackStep[];
} {
  const dp = buildDPTable(string1, string2);
  const allLCS = new Set<string>();
  const steps: BacktrackStep[] = [];

  function backtrackWithSteps(i: number, j: number, currentLCS: string): void {
    if (i === 0 || j === 0) {
      const finalLCS = currentLCS.split("").reverse().join("");
      allLCS.add(finalLCS);

      steps.push({
        i,
        j,
        currentLCS: finalLCS,
        decision: "match",
      });
      return;
    }

    const char1 = string1[i - 1];
    const char2 = string2[j - 1];

    if (char1 === char2) {
      steps.push({
        i,
        j,
        currentLCS: currentLCS + char1,
        decision: "match",
        char1,
        char2,
      });

      backtrackWithSteps(i - 1, j - 1, currentLCS + char1);
    } else {
      const fromTop = dp[i - 1][j];
      const fromLeft = dp[i][j - 1];
      const currentValue = dp[i][j];

      let decision: "up" | "left" | "both" = "up";

      const canGoUp = fromTop === currentValue;
      const canGoLeft = fromLeft === currentValue;

      if (canGoUp && canGoLeft) {
        decision = "both";
      } else if (canGoLeft) {
        decision = "left";
      }

      steps.push({
        i,
        j,
        currentLCS,
        decision,
        char1,
        char2,
      });

      if (canGoUp) {
        backtrackWithSteps(i - 1, j, currentLCS);
      }

      if (canGoLeft) {
        backtrackWithSteps(i, j - 1, currentLCS);
      }
    }
  }

  backtrackWithSteps(string1.length, string2.length, "");

  return {
    lcs: Array.from(allLCS).sort(),
    steps,
  };
}

/**
 * Função utilitária para validar se uma string é uma subsequência de outra.
 * Útil para verificar se nossas LCS são válidas.
 *
 * @param subsequence - String que pode ser subsequência
 * @param sequence - String original
 * @returns true se subsequence é subsequência de sequence
 */
export function isSubsequence(subsequence: string, sequence: string): boolean {
  let i = 0; // Índice para subsequence
  let j = 0; // Índice para sequence

  while (i < subsequence.length && j < sequence.length) {
    if (subsequence[i] === sequence[j]) {
      i++; // Encontrou o caractere, avança na subsequência
    }
    j++; // Sempre avança na sequência original
  }

  // Se percorremos toda a subsequência, ela é válida
  return i === subsequence.length;
}

/**
 * Valida se todas as LCS encontradas são realmente subsequências das strings originais.
 *
 * @param lcsArray - Array de LCS encontradas
 * @param string1 - Primeira string original
 * @param string2 - Segunda string original
 * @returns true se todas as LCS são válidas
 */
export function validateAllLCS(
  lcsArray: string[],
  string1: string,
  string2: string
): boolean {
  return lcsArray.every(
    (lcs) => isSubsequence(lcs, string1) && isSubsequence(lcs, string2)
  );
}

/**
 * 📋 FUNÇÃO OBRIGATÓRIA: Processa múltiplos conjuntos de dados conforme especificação
 *
 * 📝 FORMATO DE ENTRADA:
 * - Primeira linha: número D (≤ 10) de conjuntos de dados
 * - Para cada conjunto: duas linhas (Helena e Marcus)
 *
 * 📤 FORMATO DE SAÍDA:
 * - Para cada conjunto: todas as LCS em ordem alfabética
 * - Linha em branco entre conjuntos diferentes
 *
 * 💡 EXEMPLO:
 * Entrada:
 * "1\nijkijkii\nikjikji"
 *
 * Saída:
 * "ijiji\nijiki\nijkji\nikiji\nikiki\nikjii\nikjki"
 *
 * @param input - String com formato de entrada conforme roteiro
 * @returns String formatada conforme especificação de saída
 */
export function processMultipleDatasets(input: string): string {
  // 📏 Passo 1: Dividir a entrada em linhas e validar
  const lines = input.trim().split("\n");

  if (lines.length < 1) {
    throw new Error("Entrada inválida: deve conter pelo menos uma linha com D");
  }

  // 🔢 Passo 2: Extrair número de conjuntos de dados
  const D = parseInt(lines[0]);

  if (isNaN(D) || D <= 0 || D > 10) {
    throw new Error(
      `Número de conjuntos inválido: ${lines[0]}. Deve estar entre 1 e 10.`
    );
  }

  // ✅ Passo 3: Validar se há linhas suficientes
  const expectedLines = 1 + D * 2; // 1 linha para D + 2 linhas por conjunto
  if (lines.length < expectedLines) {
    throw new Error(
      `Entrada incompleta: esperado ${expectedLines} linhas, encontrado ${lines.length}`
    );
  }

  // 📊 Passo 4: Processar cada conjunto de dados
  const results: string[] = [];

  for (let i = 0; i < D; i++) {
    // Calcular índices das linhas para este conjunto
    const helenaIndex = 1 + i * 2;
    const marcusIndex = 2 + i * 2;

    // Extrair sequências
    const helenaSequence = lines[helenaIndex]?.trim() || "";
    const marcusSequence = lines[marcusIndex]?.trim() || "";

    // Validar sequências
    if (!helenaSequence || !marcusSequence) {
      throw new Error(
        `Conjunto ${i + 1}: sequências vazias não são permitidas`
      );
    }

    if (helenaSequence.length > 80 || marcusSequence.length > 80) {
      throw new Error(
        `Conjunto ${i + 1}: sequências devem ter no máximo 80 caracteres`
      );
    }

    const validChars = /^[a-z]+$/;
    if (!validChars.test(helenaSequence) || !validChars.test(marcusSequence)) {
      throw new Error(
        `Conjunto ${
          i + 1
        }: apenas letras minúsculas de 'a' a 'z' são permitidas`
      );
    }

    // 🔍 Passo 5: Encontrar todas as LCS para este conjunto
    const allLCS = findAllLCS(helenaSequence, marcusSequence);

    // Validar que encontramos pelo menos uma LCS
    if (allLCS.length === 0) {
      throw new Error(`Conjunto ${i + 1}: nenhuma LCS encontrada`);
    }

    // 📝 Passo 6: Formatar resultado (já em ordem alfabética)
    results.push(allLCS.join("\n"));
  }

  // 🎯 Passo 7: Juntar resultados com linha em branco entre conjuntos
  return results.join("\n\n");
}

/**
 * 🧪 FUNÇÃO DE TESTE: Valida o processamento com exemplos do roteiro
 *
 * @returns Objeto com resultados dos testes
 */
export function testProcessMultipleDatasets(): {
  success: boolean;
  results: Array<{
    test: string;
    passed: boolean;
    output?: string;
    error?: string;
  }>;
} {
  const tests = [
    {
      test: "Exemplo do roteiro",
      input: "1\nijkijkii\nikjikji",
      expected: ["ijiji", "ijiki", "ijkji", "ikiji", "ikiki", "ikjii", "ikjki"],
    },
    {
      test: "Dois conjuntos simples",
      input: "2\nabc\nac\nxyz\nxz",
      expected: null, // Vamos apenas verificar se executa sem erro
    },
  ];

  const results = tests.map((testCase) => {
    try {
      const output = processMultipleDatasets(testCase.input);

      if (testCase.expected) {
        const outputLines = output.split("\n").filter((line) => line.trim());
        const matches = testCase.expected.every((expected) =>
          outputLines.includes(expected)
        );

        return {
          test: testCase.test,
          passed: matches && outputLines.length === testCase.expected.length,
          output,
        };
      } else {
        return {
          test: testCase.test,
          passed: output.length > 0,
          output,
        };
      }
    } catch (error) {
      return {
        test: testCase.test,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

  return {
    success: results.every((r) => r.passed),
    results,
  };
}
