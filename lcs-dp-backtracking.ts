/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📚 SOLUÇÃO COMPLETA - PROGRAMAÇÃO DINÂMICA + BACKTRACKING
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 👥 AUTORES DO GRUPO:
 * - Carlos Ferreira

 *
 * 📋 INFORMAÇÕES DO PROJETO:
 * - Disciplina: Programação Avançada 2
 * - Versão: 1.0
 * - Data: 2025-06-23
 * - Linguagem: TypeScript
 *
 * 🎯 OBJETIVO:
 * Implementa a solução COMPLETA que encontra TODAS as subsequências comuns
 * mais longas usando programação dinâmica + backtracking.
 *
 * ✅ VANTAGEM:
 * Esta versão encontra TODAS as LCS possíveis, não apenas uma.
 */

/**
 * 🧮 Constrói tabela de programação dinâmica
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
 * 🔍 Encontra TODAS as LCS usando backtracking na tabela DP
 */
function findAllLCS(string1: string, string2: string): string[] {
  const dp = buildDPTable(string1, string2);
  const allLCS = new Set<string>();

  function backtrack(i: number, j: number, currentLCS: string): void {
    if (i === 0 || j === 0) {
      allLCS.add(currentLCS.split("").reverse().join(""));
      return;
    }

    const char1 = string1[i - 1];
    const char2 = string2[j - 1];

    if (char1 === char2) {
      backtrack(i - 1, j - 1, currentLCS + char1);
    } else {
      const fromTop = dp[i - 1][j];
      const fromLeft = dp[i][j - 1];
      const current = dp[i][j];

      if (fromTop === current) {
        backtrack(i - 1, j, currentLCS);
      }

      if (fromLeft === current) {
        backtrack(i, j - 1, currentLCS);
      }
    }
  }

  backtrack(string1.length, string2.length, "");
  return Array.from(allLCS).sort();
}

/**
 * 📋 FUNÇÃO PRINCIPAL: Processa entrada completa conforme roteiro
 */
function processCompleteWithBacktracking(input: string): string {
  const lines = input.trim().split("\n");
  const D = parseInt(lines[0]);

  if (isNaN(D) || D <= 0 || D > 10) {
    throw new Error(`Número de conjuntos inválido: ${lines[0]}`);
  }

  const expectedLines = 1 + D * 2;
  if (lines.length < expectedLines) {
    throw new Error(`Entrada incompleta: esperado ${expectedLines} linhas`);
  }

  const results: string[] = [];

  for (let i = 0; i < D; i++) {
    const helena = lines[1 + i * 2]?.trim();
    const marcus = lines[2 + i * 2]?.trim();

    if (!helena || !marcus) {
      throw new Error(`Conjunto ${i + 1}: sequências vazias`);
    }

    if (helena.length > 80 || marcus.length > 80) {
      throw new Error(`Conjunto ${i + 1}: sequências muito longas`);
    }

    if (!/^[a-z]+$/.test(helena) || !/^[a-z]+$/.test(marcus)) {
      throw new Error(`Conjunto ${i + 1}: apenas letras minúsculas`);
    }

    // Processar com DP + Backtracking
    const allLCS = findAllLCS(helena, marcus);

    if (allLCS.length === 0) {
      throw new Error(`Conjunto ${i + 1}: nenhuma LCS encontrada`);
    }

    results.push(allLCS.join("\n"));
  }

  return results.join("\n\n");
}

/**
 * 🧪 Função para testar a solução completa
 */
function testCompleteBacktracking(): void {
  console.log("🧪 TESTANDO SOLUÇÃO COMPLETA COM BACKTRACKING");
  console.log("✅ Esta versão encontra TODAS as LCS possíveis");
  console.log();

  const testInput = "1\nijkijkii\nikjikji";
  const expectedOutput = [
    "ijiji",
    "ijiki",
    "ijkji",
    "ikiji",
    "ikiki",
    "ikjii",
    "ikjki",
  ];

  try {
    const result = processCompleteWithBacktracking(testInput);
    const resultLines = result.split("\n").filter((line) => line.trim());

    console.log("📥 ENTRADA:");
    console.log(testInput);
    console.log();
    console.log("📤 SAÍDA (todas as LCS):");
    console.log(result);
    console.log();

    // Verificar se todas as LCS esperadas foram encontradas
    const allFound = expectedOutput.every((expected) =>
      resultLines.includes(expected)
    );
    const exactMatch = resultLines.length === expectedOutput.length && allFound;

    if (exactMatch) {
      console.log("✅ Teste PASSOU! Todas as LCS corretas foram encontradas.");
    } else {
      console.log("⚠️  Resultado diferente do esperado:");
      console.log("Esperado:", expectedOutput);
      console.log("Encontrado:", resultLines);
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

/**
 * 🧪 Teste com múltiplos conjuntos
 */
function testMultipleDatasets(): void {
  console.log("\n🧪 TESTANDO COM MÚLTIPLOS CONJUNTOS");

  const testInput = `2
abc
ac
xyz
xz`;

  try {
    const result = processCompleteWithBacktracking(testInput);
    console.log("📥 ENTRADA:");
    console.log(testInput);
    console.log();
    console.log("📤 SAÍDA:");
    console.log(result);
    console.log();
    console.log("✅ Teste com múltiplos conjuntos passou!");
  } catch (error) {
    console.error("❌ Erro no teste múltiplo:", error);
  }
}

// 🚀 Executar testes se arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testCompleteBacktracking();
  testMultipleDatasets();
}

// Exportar funções
export {
  buildDPTable,
  findAllLCS,
  processCompleteWithBacktracking,
  testCompleteBacktracking,
  testMultipleDatasets,
};
