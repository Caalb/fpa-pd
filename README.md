# Análise de Subsequências Comuns - GPA2

**Trabalho de Programação Avançada 2**

## Descrição da Solução

Este projeto implementa uma solução completa para encontrar todas as subsequências comuns mais longas (LCS) entre duas sequências de eventos, utilizando as técnicas de **Programação Dinâmica** e **Backtracking**.

### Tecnologias Utilizadas

- Vue 3 + TypeScript + Vite
- Tailwind CSS para estilização moderna
- Algoritmos otimizados com código altamente legível
- Interface gráfica interativa com visualização do processo algorítmico

### Estrutura do Projeto

```
src/
├── algorithms/
│   ├── lcs-dynamic-programming.ts    # Implementação só com Programação Dinâmica
│   └── lcs-backtracking.ts           # Implementação com DP + Backtracking
├── components/
│   ├── LCSAnalyzer.vue              # Componente principal
│   ├── InputSection.vue             # Entrada de dados
│   ├── ResultsDisplay.vue           # Exibição de resultados
│   └── DPTableVisualization.vue     # Visualização da tabela DP
└── App.vue                          # Aplicação principal
```

## Respostas às Perguntas

### 1. Como a programação dinâmica foi aplicada na solução?

A programação dinâmica foi aplicada para resolver o problema de forma eficiente através dos seguintes passos:

1. **Definição do Subproblema**: `dp[i][j]` representa o comprimento da LCS entre os primeiros `i` caracteres da primeira string e os primeiros `j` caracteres da segunda string.

2. **Relação de Recorrência**:
   ```
   dp[i][j] = {
     0,                           se i = 0 ou j = 0
     dp[i-1][j-1] + 1,           se string1[i-1] = string2[j-1]
     max(dp[i-1][j], dp[i][j-1]), caso contrário
   }
   ```

3. **Construção Bottom-up**: A tabela é preenchida de forma iterativa, sempre baseando-se em subproblemas já resolvidos.

4. **Resultado Final**: O valor `dp[m][n]` (onde `m` e `n` são os comprimentos das strings) contém o comprimento da LCS.

### 2. Por que o uso de backtracking é necessário neste problema?

O backtracking é necessário porque:

1. **Programação Dinâmica Sozinha**: Encontra apenas o **comprimento** da LCS, não as subsequências em si.

2. **Múltiplas Soluções Ótimas**: Podem existir várias LCS diferentes com o mesmo comprimento máximo. O problema pede **todas** as LCS, não apenas uma.

3. **Reconstrução Completa**: O backtracking percorre a tabela DP de forma recursiva, explorando todos os caminhos possíveis que levam ao valor ótimo.

4. **Exploração Sistemática**: Quando `dp[i-1][j] = dp[i][j-1] = dp[i][j]`, ambos os caminhos devem ser explorados, pois ambos podem levar a LCS válidas diferentes.

### 3. Houve desafios na implementação? Quais? Como foram superados?

**Principais Desafios:**

1. **Evitar Duplicatas**: Durante o backtracking, o mesmo caminho pode ser encontrado múltiplas vezes.
   - **Solução**: Uso de `Set<string>` para armazenar apenas LCS únicas.

2. **Complexidade Exponencial**: O backtracking pode gerar muitas combinações.
   - **Solução**: Implementação eficiente que explora apenas caminhos válidos baseados na tabela DP.

3. **Ordenação Alfabética**: O problema exige que as LCS sejam apresentadas em ordem alfabética.
   - **Solução**: Conversão do Set para Array e aplicação de `.sort()`.

4. **Interface Responsiva**: Criar uma visualização clara para tabelas grandes.
   - **Solução**: Componente com scroll, zoom e controles interativos.

5. **Legibilidade do Código**: Manter o código compreensível mesmo com lógica complexa.
   - **Solução**: Documentação extensiva, funções bem nomeadas e separação de responsabilidades.

### 4. Qual é a complexidade da solução proposta?

#### Versão usando apenas Programação Dinâmica:

**Complexidade de Tempo**: `O(m × n)`
- Onde `m` é o comprimento da primeira string e `n` da segunda string
- Cada célula da tabela DP é preenchida exatamente uma vez
- Cada preenchimento envolve operações O(1)

**Complexidade de Espaço**: `O(m × n)`
- Armazenamento da tabela DP de dimensões `(m+1) × (n+1)`

**Cálculo passo a passo**:
```
Para strings de tamanho m e n:
- Criação da tabela: O(m × n)
- Preenchimento: O(m × n) operações
- Reconstrução de uma LCS: O(m + n)
- Total: O(m × n)
```

#### Versão que combina Programação Dinâmica com Backtracking:

**Complexidade de Tempo**: `O(m × n + S × L)`
- `O(m × n)`: Construção da tabela DP
- `S`: Número de subsequências LCS únicas
- `L`: Comprimento médio das LCS (no máximo `min(m, n)`)
- No **pior caso**: `O(m × n × 2^min(m,n))` quando há muitas LCS

**Complexidade de Espaço**: `O(m × n + S × L)`
- `O(m × n)`: Tabela DP
- `O(S × L)`: Armazenamento de todas as LCS

**Cálculo passo a passo**:
```
1. Construção da tabela DP: O(m × n)
2. Backtracking:
   - Cada célula pode gerar até 2 caminhos recursivos
   - Profundidade máxima: min(m, n)
   - Pior caso: O(2^min(m,n))
3. Armazenamento das LCS: O(S × L)
4. Ordenação final: O(S × L × log(S))
```

**Exemplo Prático** (com strings do roteiro):
- Helena: "ijkijkii" (8 caracteres)
- Marcus: "ikjikji" (7 caracteres)
- DP: 8 × 7 = 56 operações
- Backtracking: 7 LCS encontradas, cada uma com 5 caracteres
- Total: ~100 operações

### 5. O que o grupo aprendeu ao resolver esse problema?

**Aprendizados Técnicos:**

1. **Programação Dinâmica**: Compreensão profunda de como quebrar problemas complexos em subproblemas menores e reutilizar soluções.

2. **Backtracking**: Técnica poderosa para explorar sistematicamente todas as soluções possíveis.

3. **Análise de Complexidade**: Importância de entender as implicações de performance de diferentes abordagens.

4. **Estruturas de Dados**: Uso eficiente de Sets para evitar duplicatas e Arrays para ordenação.

**Aprendizados de Engenharia de Software:**

1. **Código Legível**: A importância de escrever código que outros desenvolvedores possam entender facilmente.

2. **Separação de Responsabilidades**: Dividir a lógica em módulos bem definidos (algoritmos, interface, visualização).

3. **Documentação**: Comentários detalhados são essenciais para explicar algoritmos complexos.

4. **Testes e Validação**: Implementação de funções para validar se as LCS encontradas são realmente válidas.

**Aprendizados de Interface e Experiência do Usuário:**

1. **Visualização de Algoritmos**: Como tornar conceitos abstratos visualmente compreensíveis.

2. **Design Responsivo**: Criar interfaces que funcionam bem em diferentes tamanhos de tela.

3. **Feedback Interativo**: Importância de fornecer feedback imediato ao usuário.

**Aprendizados sobre Resolução de Problemas:**

1. **Abordagem Incremental**: Resolver primeiro o problema básico (DP), depois estender para o problema completo (DP + Backtracking).

2. **Otimização Prematura**: Foco inicial na correção e clareza, otimização depois.

3. **Casos Extremos**: Considerar situações como strings vazias, caracteres repetidos, etc.

## Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Build para produção**:
   ```bash
   npm run build
   ```

4. **Verificar tipos TypeScript**:
   ```bash
   vue-tsc -b
   ```

## Funcionalidades Implementadas

✅ **Algoritmo de Programação Dinâmica** para calcular comprimento da LCS  
✅ **Algoritmo de Backtracking** para encontrar todas as LCS  
✅ **Interface gráfica moderna** com Vue 3 + TypeScript  
✅ **Visualização interativa** da tabela de programação dinâmica  
✅ **Validação de entradas** em tempo real  
✅ **Exportação de resultados** em formato JSON  
✅ **Análise de complexidade** e comparação de performance  
✅ **Código altamente legível** e bem documentado  
✅ **Responsividade** para diferentes tamanhos de tela  

## Arquivos Principais

- `src/algorithms/lcs-dynamic-programming.ts` - Implementação apenas com Programação Dinâmica
- `src/algorithms/lcs-backtracking.ts` - Implementação com Programação Dinâmica + Backtracking
- `README.md` - Este arquivo com descrição e respostas às perguntas
