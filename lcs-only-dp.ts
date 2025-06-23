/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📚 SOLUÇÃO APENAS COM PROGRAMAÇÃO DINÂMICA - LCS (Longest Common Subsequence)
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
 *
 * 🎯 OBJETIVO:
 * Este arquivo implementa APENAS a solução com programação dinâmica,
 * encontrando o comprimento da LCS e UMA das subsequências possíveis.
 *
 * ⚠️ LIMITAÇÃO:
 * Esta versão NÃO encontra TODAS as LCS, apenas uma delas.
 * Para encontrar todas, é necessário o backtracking (arquivo separado).
 */

/**
 * 🧮 Calcula o comprimento da maior subsequência comum usando programação dinâmica
 *
 * @param string1 - Primeira sequência
 * @param string2 - Segunda sequência
 * @returns Comprimento da LCS
 */
function calculateLCSLength(string1: string, string2: string): number {
  const m = string1.length;
  const n = string2.length;

  // Criar tabela DP
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Preencher tabela
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (string1[i - 1] === string2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * 🏗️ Constrói a tabela DP completa
 *
 * @param string1 - Primeira sequência
 * @param string2 - Segunda sequência
 * @returns Tabela DP preenchida
 */
function buildDPTable(string1: string, string2: string): number[][] {
  const m = string1.length;
  const n = string2.length;

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (string1[i - 1] === string2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

/**
 * 🔄 Reconstrói UMA das LCS possíveis (não todas)
 *
 * @param string1 - Primeira sequência
 * @param string2 - Segunda sequência
 * @param dp - Tabela DP já construída
 * @returns Uma das LCS possíveis
 */
function reconstructOneLCS(
  string1: string,
  string2: string,
  dp: number[][]
): string {
  let i = string1.length;
  let j = string2.length;
  const result: string[] = [];

  while (i > 0 && j > 0) {
    if (string1[i - 1] === string2[j - 1]) {
      result.unshift(string1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result.join("");
}

/**
 * 📋 FUNÇÃO PRINCIPAL: Processa entrada no formato do roteiro APENAS COM DP
 *
 * ⚠️ LIMITAÇÃO IMPORTANTE:
 * Esta versão retorna apenas UMA LCS por conjunto, não todas.
 * Isso é uma limitação da programação dinâmica pura.
 *
 * @param input - Entrada no formato: D\nstring1\nstring2\n...
 * @returns Saída formatada (mas com apenas uma LCS por conjunto)
 */
function processWithDynamicProgrammingOnly(input: string): string {
  const lines = input.trim().split("\n");
  const D = parseInt(lines[0]);

  if (isNaN(D) || D <= 0 || D > 10) {
    throw new Error(`Número de conjuntos inválido: ${lines[0]}`);
  }

  const results: string[] = [];

  for (let i = 0; i < D; i++) {
    const helena = lines[1 + i * 2]?.trim();
    const marcus = lines[2 + i * 2]?.trim();

    if (!helena || !marcus) {
      throw new Error(`Conjunto ${i + 1}: sequências inválidas`);
    }

    // Validar entrada
    if (helena.length > 80 || marcus.length > 80) {
      throw new Error(`Conjunto ${i + 1}: sequências muito longas`);
    }

    if (!/^[a-z]+$/.test(helena) || !/^[a-z]+$/.test(marcus)) {
      throw new Error(`Conjunto ${i + 1}: apenas letras minúsculas permitidas`);
    }

    // Processar com DP
    const dp = buildDPTable(helena, marcus);
    const oneLCS = reconstructOneLCS(helena, marcus, dp);

    // ⚠️ LIMITAÇÃO: Apenas uma LCS, não todas
    if (oneLCS) {
      results.push(oneLCS);
    }
  }

  return results.join("\n\n");
}

/**
 * 🧪 Função para testar a solução apenas com DP
 */
function testDynamicProgrammingOnly(): void {
  console.log("🧪 TESTANDO SOLUÇÃO APENAS COM PROGRAMAÇÃO DINÂMICA");
  console.log("⚠️  LIMITAÇÃO: Esta versão encontra apenas UMA LCS, não todas");
  console.log();

  const testInput = "1\nijkijkii\nikjikji";

  try {
    const result = processWithDynamicProgrammingOnly(testInput);
    console.log("📥 ENTRADA:");
    console.log(testInput);
    console.log();
    console.log("📤 SAÍDA (apenas uma LCS):");
    console.log(result);
    console.log();
    console.log("✅ Teste executado com sucesso!");
    console.log(
      "📝 Nota: Para encontrar TODAS as LCS, use o arquivo com backtracking."
    );
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

// 🚀 Executar teste se arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testDynamicProgrammingOnly();
}

// Exportar funções para uso em outros módulos
export {
  calculateLCSLength,
  buildDPTable,
  reconstructOneLCS,
  processWithDynamicProgrammingOnly,
  testDynamicProgrammingOnly,
};
