/**
 * Web Worker para processamento de LCS em background
 * Evita travamento da interface principal durante cálculos complexos
 */

// Algoritmo de Programação Dinâmica
function buildDPTable(string1, string2) {
  const length1 = string1.length;
  const length2 = string2.length;

  const dpTable = [];
  for (let row = 0; row <= length1; row++) {
    dpTable[row] = [];
    for (let col = 0; col <= length2; col++) {
      dpTable[row][col] = 0;
    }
  }

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

function calculateLCSLength(string1, string2) {
  const dpTable = buildDPTable(string1, string2);
  return dpTable[string1.length][string2.length];
}

function reconstructOneLCS(string1, string2, dpTable) {
  let i = string1.length;
  let j = string2.length;
  const lcsChars = [];

  while (i > 0 && j > 0) {
    const char1 = string1[i - 1];
    const char2 = string2[j - 1];

    if (char1 === char2) {
      lcsChars.unshift(char1);
      i--;
      j--;
    } else {
      const valueFromAbove = dpTable[i - 1][j];
      const valueFromLeft = dpTable[i][j - 1];

      if (valueFromAbove > valueFromLeft) {
        i--;
      } else {
        j--;
      }
    }
  }

  return lcsChars.join("");
}

function findAllLCS(string1, string2) {
  const dpTable = buildDPTable(string1, string2);
  const allLCSSet = new Set();

  const MAX_LCS_COUNT = 50;
  const MAX_EXECUTION_TIME = 2000;
  const MAX_STACK_SIZE = 10000; // Limitar tamanho da pilha
  const startTime = Date.now();

  let shouldStop = false;
  let iterationCount = 0;

  // Verificação de limites a cada iteração
  function shouldStopExecution() {
    iterationCount++;

    if (shouldStop) return true;

    if (allLCSSet.size >= MAX_LCS_COUNT) {
      shouldStop = true;
      self.postMessage({
        type: 'backtrackingProgress',
        message: `Limite de ${MAX_LCS_COUNT} LCS atingido`
      });
      return true;
    }

    if (Date.now() - startTime > MAX_EXECUTION_TIME) {
      shouldStop = true;
      self.postMessage({
        type: 'backtrackingProgress',
        message: 'Timeout - retornando resultados parciais'
      });
      return true;
    }

    // Progresso a cada 500 iterações
    if (iterationCount % 500 === 0) {
      self.postMessage({
        type: 'backtrackingProgress',
        message: `${allLCSSet.size} LCS encontradas...`
      });
    }

    return false;
  }

  // Versão ITERATIVA usando stack para evitar recursão
  function exploreAllPathsIterative() {
    // Stack para simular recursão: [i, j, currentLCS]
    const stack = [[string1.length, string2.length, ""]];

    while (stack.length > 0 && !shouldStopExecution()) {
      // Limitar tamanho da stack para evitar uso excessivo de memória
      if (stack.length > MAX_STACK_SIZE) {
        self.postMessage({
          type: 'backtrackingProgress',
          message: 'Stack muito grande - interrompendo busca'
        });
        break;
      }

      const [i, j, currentLCS] = stack.pop();

      // Caso base: chegou ao início
      if (i === 0 || j === 0) {
        const completeLCS = currentLCS.split("").reverse().join("");
        allLCSSet.add(completeLCS);
        continue;
      }

      const char1 = string1[i - 1];
      const char2 = string2[j - 1];

      if (char1 === char2) {
        // Caracteres iguais: adicionar à LCS e ir diagonal
        stack.push([i - 1, j - 1, currentLCS + char1]);
      } else {
        // Caracteres diferentes: explorar ambos caminhos se válidos
        const valueFromAbove = dpTable[i - 1][j];
        const valueFromLeft = dpTable[i][j - 1];
        const currentValue = dpTable[i][j];

        // Adicionar caminhos válidos à stack
        if (valueFromLeft === currentValue) {
          stack.push([i, j - 1, currentLCS]);
        }

        if (valueFromAbove === currentValue) {
          stack.push([i - 1, j, currentLCS]);
        }
      }
    }
  }

  try {
    self.postMessage({
      type: 'backtrackingProgress',
      message: 'Iniciando busca iterativa...'
    });

    exploreAllPathsIterative();

    if (shouldStop) {
      self.postMessage({
        type: 'backtrackingProgress',
        message: `Busca interrompida. ${allLCSSet.size} LCS encontradas`
      });
    } else {
      self.postMessage({
        type: 'backtrackingProgress',
        message: `Busca completa. ${allLCSSet.size} LCS encontradas`
      });
    }

  } catch (error) {
    self.postMessage({
      type: 'backtrackingProgress',
      message: 'Erro: ' + error.message
    });
    console.error('Erro no worker:', error);
  }

  return Array.from(allLCSSet).sort();
}

self.onmessage = function(e) {
  const { type, string1, string2 } = e.data;

  try {
    if (type === 'calculateDP') {
      const dpTable = buildDPTable(string1, string2);
      const maxLength = calculateLCSLength(string1, string2);
      const oneLCS = reconstructOneLCS(string1, string2, dpTable);

      self.postMessage({
        type: 'dpResult',
        result: {
          table: dpTable,
          maxLength,
          oneLCS,
          complexity: `O(${string1.length} × ${string2.length}) = O(${string1.length * string2.length})`
        }
      });
    } else if (type === 'calculateBacktracking') {
      const len1 = string1.length;
      const len2 = string2.length;
      const minLen = Math.min(len1, len2);

      if (len1 > 20 || len2 > 20) {
        self.postMessage({
          type: 'backtrackingProgress',
          message: `⚠️ Sequências longas detectadas (${len1}×${len2}). Limitando resultados...`
        });
      }

      if (minLen > 15) {
        self.postMessage({
          type: 'backtrackingProgress',
          message: '⚠️ Alto risco de muitas LCS. Aplicando limites rigorosos...'
        });
      }

      self.postMessage({
        type: 'backtrackingProgress',
        message: 'Iniciando busca de todas as LCS...'
      });

      const allLCS = findAllLCS(string1, string2);

      self.postMessage({
        type: 'backtrackingResult',
        result: {
          allLCS,
          count: allLCS.length,
          complexity: `O(${len1} × ${len2} × 2^min(${len1}, ${len2}))`
        }
      });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message
    });
  }
};