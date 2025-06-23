# 🔍 Explicação Detalhada dos Algoritmos - LCS (Longest Common Subsequence)

**Trabalho de Programação Avançada 2**

## 👥 Informações do Grupo

**Autores:**

- Carlos Ferreira
- [Nome do Integrante 2]
- [Nome do Integrante 3]
- [Nome do Integrante 4]
- [Nome do Integrante 5]
- [Nome do Integrante 6]
- [Nome do Integrante 7]
- [Nome do Integrante 8] (se aplicável)

**📚 Disciplina:** Programação Avançada 2
**📅 Data:** 2025-06-23
**🔧 Versão:** 1.0
**💻 Linguagem:** TypeScript

---

## 🎯 Problema: Descobrindo Padrões - A Jornada para Sincronizar Dados Complexos

Em ambientes de análise de dados, Helena e Marcus são analistas responsáveis por interpretar grandes volumes de dados gerados por sistemas complexos. Cada um possui uma sequência cronológica de eventos, que podem variar em detalhes e quantidade, mas que, em essência, refletem a mesma operação ou fenômeno.

O desafio surge quando eles precisam sincronizar esses dados, ou seja, encontrar **todas** as subsequências comuns que se repetem nas duas fontes, respeitando a ordem dos eventos.

**Exemplo Concreto:**

- Helena coletou: `"ijkijkii"` (8 eventos)
- Marcus coletou: `"ikjikji"` (7 eventos)
- Objetivo: Encontrar todas as subsequências comuns mais longas

---

## 🧠 Como a Aplicação Funciona - Visão Geral

### 🔄 Fluxo Principal

1. **📥 Entrada de Dados**

   - Usuário insere as duas sequências de eventos
   - Validação automática dos dados (1-80 caracteres, apenas 'a'-'z')

2. **⚙️ Processamento em Duas Fases**

   - **Fase 1 - Programação Dinâmica**: Constrói tabela com comprimentos ótimos
   - **Fase 2 - Backtracking**: Explora todos os caminhos para encontrar todas as LCS

3. **📊 Visualização**

   - Exibe resultados com tabela DP interativa
   - Mostra processo de backtracking com animações

4. **✅ Validação**
   - Verifica se todas as LCS encontradas são válidas
   - Confirma ordenação alfabética

---

## 🔬 Algoritmo 1: Programação Dinâmica (DP) - Apenas o Comprimento

### 🎯 Objetivo

Encontrar o **comprimento** da maior subsequência comum e **UMA** das LCS possíveis (não todas).

### 📋 Estratégia Principal

A programação dinâmica quebra o problema em subproblemas menores:

- `dp[i][j]` = comprimento da LCS entre os primeiros `i` caracteres de Helena e os primeiros `j` caracteres de Marcus

### 📝 Implementação Passo a Passo

#### Passo 1: Criação da Tabela DP

```typescript
function buildDPTable(string1: string, string2: string): number[][] {
  const m = string1.length;
  const n = string2.length;

  // Criar tabela (m+1) × (n+1) inicializada com zeros
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      dp[i][j] = 0;
    }
  }

  return dp;
}
```

**Por que (m+1) × (n+1)?**

- A primeira linha e coluna representam "string vazia"
- Isso simplifica a lógica evitando casos especiais

#### Passo 2: Preenchimento da Tabela

```typescript
for (let i = 1; i <= m; i++) {
  for (let j = 1; j <= n; j++) {
    const char1 = string1[i - 1]; // Caractere atual de Helena
    const char2 = string2[j - 1]; // Caractere atual de Marcus

    if (char1 === char2) {
      // ✅ MATCH! Este caractere faz parte da LCS
      dp[i][j] = dp[i - 1][j - 1] + 1;
    } else {
      // ❌ SEM MATCH: Pegar o melhor dos dois caminhos
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
}
```

**Lógica da Recorrência:**

- **Se caracteres são iguais**: Somamos 1 à LCS dos prefixos anteriores
- **Se caracteres são diferentes**: Pegamos o máximo entre "ignorar char1" ou "ignorar char2"

#### Passo 3: Reconstrução de UMA LCS

```typescript
function reconstructOneLCS(
  string1: string,
  string2: string,
  dp: number[][]
): string {
  let i = string1.length;
  let j = string2.length;
  const result: string[] = [];

  // Navegar de trás para frente na tabela
  while (i > 0 && j > 0) {
    const char1 = string1[i - 1];
    const char2 = string2[j - 1];

    if (char1 === char2) {
      // Este caractere faz parte da LCS
      result.unshift(char1); // Adiciona no início
      i--;
      j--; // Move diagonalmente
    } else {
      // Seguir o caminho que gerou o valor maior
      if (dp[i - 1][j] > dp[i][j - 1]) {
        i--; // Mover para cima
      } else {
        j--; // Mover para esquerda
      }
    }
  }

  return result.join("");
}
```

### 🔍 Exemplo Detalhado: "abc" vs "ac"

**Tabela DP construída:**

```
       ""  a  c
    "" 0   0  0
    a  0   1  1
    b  0   1  1
    c  0   1  2
```

**Reconstrução:**

1. Começar em dp[3][2] = 2
2. char1='c', char2='c' → MATCH! → "c" faz parte da LCS
3. Ir para dp[2][1] = 1
4. char1='b', char2='a' → SEM MATCH → dp[1][1]=1 > dp[2][0]=0 → ir para dp[1][1]
5. char1='a', char2='a' → MATCH! → "a" faz parte da LCS
6. Resultado: "ac"

### ⚠️ Limitação

Esta versão encontra apenas **UMA** LCS, não todas as possíveis.

---

## 🔄 Algoritmo 2: Programação Dinâmica + Backtracking - Todas as LCS

### 🎯 Objetivo

Encontrar **TODAS** as subsequências comuns mais longas possíveis.

### 🧩 Por Que Backtracking é Necessário?

1. **DP sozinha**: Só nos dá o comprimento, não as strings
2. **Múltiplas soluções**: Podem existir várias LCS com o mesmo comprimento máximo
3. **Exploração completa**: Precisamos explorar todos os caminhos válidos na tabela DP

### 📝 Implementação Passo a Passo

#### Fase 1: Construção da Tabela DP

```typescript
function findAllLCS(string1: string, string2: string): string[] {
  // Usar a mesma função de DP do algoritmo anterior
  const dp = buildDPTable(string1, string2);

  // Set para evitar duplicatas automaticamente
  const allLCS = new Set<string>();

  // ... backtracking será implementado aqui
}
```

#### Fase 2: Backtracking Recursivo

```typescript
function exploreAllPaths(i: number, j: number, currentLCS: string): void {
  // 🏁 CASO BASE: Chegamos ao início
  if (i === 0 || j === 0) {
    // Construímos de trás para frente, então reverter
    const completeLCS = currentLCS.split("").reverse().join("");
    allLCS.add(completeLCS);
    return;
  }

  const char1 = string1[i - 1];
  const char2 = string2[j - 1];

  if (char1 === char2) {
    // ✅ MATCH: Este caractere DEVE estar na LCS
    exploreAllPaths(i - 1, j - 1, currentLCS + char1);
  } else {
    // ❌ SEM MATCH: Explorar AMBOS os caminhos se levam ao ótimo
    const fromTop = dp[i - 1][j];
    const fromLeft = dp[i][j - 1];
    const current = dp[i][j];

    // Explorar caminho de cima se é ótimo
    if (fromTop === current) {
      exploreAllPaths(i - 1, j, currentLCS);
    }

    // Explorar caminho da esquerda se é ótimo
    if (fromLeft === current) {
      exploreAllPaths(i, j - 1, currentLCS);
    }
  }
}
```

#### Diferença Crucial: Exploração de Múltiplos Caminhos

**Na Reconstrução Simples:**

```typescript
// Pega apenas UM caminho
if (dp[i - 1][j] > dp[i][j - 1]) {
  i--; // SÓ vai para cima
} else {
  j--; // SÓ vai para esquerda
}
```

**No Backtracking:**

```typescript
// Explora TODOS os caminhos ótimos
if (fromTop === current) {
  exploreAllPaths(i - 1, j, currentLCS); // Explora caminho de cima
}

if (fromLeft === current) {
  exploreAllPaths(i, j - 1, currentLCS); // Explora caminho da esquerda
}
```

### 🔍 Exemplo Detalhado: "ijkijkii" vs "ikjikji"

**Construção da Tabela DP:**

```
      ""  i  k  j  i  k  j  i
  ""   0  0  0  0  0  0  0  0
  i    0  1  1  1  1  1  1  1
  j    0  1  1  2  2  2  2  2
  k    0  1  2  2  2  3  3  3
  i    0  1  2  2  3  3  3  4
  j    0  1  2  3  3  3  4  4
  k    0  1  2  3  3  4  4  4
  i    0  1  2  3  4  4  4  5
  i    0  1  2  3  4  4  4  5
```

**Backtracking a partir de dp[8][7] = 5:**

O algoritmo explora todos os caminhos que mantêm o valor ótimo 5, gerando:

- "ijiji"
- "ijiki"
- "ijkji"
- "ikiji"
- "ikiki"
- "ikjii"
- "ikjki"

### 🎨 Visualização do Processo

```
Caminho 1: dp[8][7] → dp[7][6] → dp[6][5] → ... → "ijiji"
Caminho 2: dp[8][7] → dp[7][6] → dp[6][4] → ... → "ijiki"
...e assim por diante
```

Cada "bifurcação" na árvore de decisão gera uma nova LCS possível.

---

## 📊 Análise de Complexidade Detalhada

### Algoritmo 1: Apenas Programação Dinâmica

**⏱️ Complexidade de Tempo: O(m × n)**

```
Operações realizadas:
1. Inicialização da tabela: O(m × n)
2. Preenchimento da tabela: O(m × n)
   - Dois loops aninhados
   - Operação O(1) por célula
3. Reconstrução: O(m + n)
   - No máximo m + n passos de volta

Total: O(m × n) + O(m × n) + O(m + n) = O(m × n)
```

**💾 Complexidade de Espaço: O(m × n)**

- Tabela DP: (m+1) × (n+1)
- Variáveis auxiliares: O(1)

### Algoritmo 2: DP + Backtracking

**⏱️ Complexidade de Tempo: O(m × n + S × L) a O(m × n × 2^min(m,n))**

```
Componentes:
1. Construção da tabela DP: O(m × n)
2. Backtracking:
   - Melhor caso: O(S × L) onde S = número de LCS, L = comprimento
   - Pior caso: O(2^min(m,n)) quando há muitos "empates"
3. Processamento final: O(S × L × log(S))

Pior caso ocorre quando:
- Muitas células têm dp[i-1][j] = dp[i][j-1]
- Cada "empate" dobra o número de caminhos a explorar
```

**💾 Complexidade de Espaço: O(m × n + S × L)**

- Tabela DP: O(m × n)
- Armazenamento das LCS: O(S × L)
- Stack de recursão: O(min(m, n))

### 📈 Exemplo Prático de Performance

**Input do roteiro:**

- Helena: "ijkijkii" (8 caracteres)
- Marcus: "ikjikji" (7 caracteres)

**Algoritmo 1:**

```
Tabela DP: 9 × 8 = 72 células
Operações: ≈ 130 total
Resultado: 1 LCS
```

**Algoritmo 2:**

```
Tabela DP: 72 células (mesmo)
Backtracking: 7 LCS × 5 chars = 35 strings processadas
Operações: ≈ 200 total
Resultado: 7 LCS
```

---

## 🛠️ Implementação e Validação

### Validação de Entrada

```typescript
function validateInput(helena: string, marcus: string): void {
  // Comprimento
  if (helena.length > 80 || marcus.length > 80) {
    throw new Error("Sequências devem ter no máximo 80 caracteres");
  }

  // Caracteres válidos
  if (!/^[a-z]+$/.test(helena) || !/^[a-z]+$/.test(marcus)) {
    throw new Error("Apenas letras minúsculas de 'a' a 'z' são permitidas");
  }
}
```

### Validação de Resultado

```typescript
function validateLCS(lcs: string, string1: string, string2: string): boolean {
  return isSubsequence(lcs, string1) && isSubsequence(lcs, string2);
}

function isSubsequence(sub: string, str: string): boolean {
  let i = 0,
    j = 0;
  while (i < sub.length && j < str.length) {
    if (sub[i] === str[j]) i++;
    j++;
  }
  return i === sub.length;
}
```

---

## 🎓 Principais Aprendizados

### Técnicos

1. **Programação Dinâmica**: Como quebrar problemas complexos em subproblemas
2. **Backtracking**: Exploração sistemática de todas as soluções
3. **Estruturas de Dados**: Uso eficiente de Set para evitar duplicatas

### Engenharia de Software

1. **Código Legível**: Importância de comentários e nomes descritivos
2. **Modularização**: Separação clara de responsabilidades
3. **Testes**: Validação automatizada de resultados

### Resolução de Problemas

1. **Abordagem Incremental**: Resolver problema básico primeiro, depois estender
2. **Casos Extremos**: Considerar strings vazias, caracteres repetidos
3. **Otimização**: Foco na correção primeiro, performance depois

---

## 🚀 Execução e Testes

### Executar Soluções

```bash
# Solução apenas com DP
npx tsx lcs-only-dp.ts

# Solução completa (DP + Backtracking)
npx tsx lcs-dp-backtracking.ts

# Interface gráfica
npm run dev
```

### Entrada de Teste (Roteiro)

```
1
ijkijkii
ikjikji
```

### Saída Esperada

```
ijiji
ijiki
ijkji
ikiji
ikiki
ikjii
ikjki
```

---

## 📝 Conclusão

A implementação demonstra como duas técnicas clássicas de programação podem ser combinadas:

1. **Programação Dinâmica** resolve eficientemente o problema de otimização
2. **Backtracking** explora sistematicamente todas as soluções ótimas

A solução atende completamente aos requisitos do roteiro, fornecendo tanto a versão simples (apenas DP) quanto a versão completa (DP + Backtracking), com interface gráfica adicional para visualização do processo algorítmico.

**Arquivos entregues:**

- ✅ `lcs-only-dp.ts` - Solução apenas com Programação Dinâmica
- ✅ `lcs-dp-backtracking.ts` - Solução com DP + Backtracking
- ✅ `README.md` - Descrição e respostas às perguntas
- ✅ `apresentacao-slides.md` - Slides para apresentação
- 🎁 Interface gráfica completa (bônus +3 pontos)
