/** * Componente para exibição dos resultados das análises * * Exibe de forma
clara e comparativa: * - Resultados da programação dinâmica * - Resultados do
backtracking * - Análise de complexidade * - Comparação entre as abordagens */

<script setup lang="ts">
import { computed } from "vue";

interface DPResults {
  table: number[][];
  maxLength: number;
  oneLCS: string;
  complexity: string;
}

interface BacktrackingResults {
  allLCS: string[];
  steps: any[];
  isValid: boolean;
  count: number;
  complexity: string;
}

interface Props {
  dpResults: DPResults;
  backtrackingResults: BacktrackingResults;
  helena: string;
  marcus: string;
}

interface Emits {
  (e: "export"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const performanceAnalysis = computed(() => {
  const dpComplexity = props.helena.length * props.marcus.length;
  const backtrackingWorstCase =
    dpComplexity *
    Math.pow(2, Math.min(props.helena.length, props.marcus.length));

  return {
    dpOperations: dpComplexity,
    backtrackingWorstCase,
    efficiency:
      dpComplexity < 1000
        ? "Excelente"
        : dpComplexity < 10000
        ? "Boa"
        : "Moderada",
    recommendation:
      props.backtrackingResults.count < 50
        ? "Backtracking é viável para este caso"
        : "Considere otimizações para casos maiores",
  };
});

// Função para destacar caracteres comuns
const highlightCommonChars = (sequence: string, lcs: string) => {
  let lcsIndex = 0;
  return sequence.split("").map((char) => {
    if (lcsIndex < lcs.length && char === lcs[lcsIndex]) {
      lcsIndex++;
      return { char, isCommon: true };
    }
    return { char, isCommon: false };
  });
};
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Resultados da Análise
      </h2>
      <p class="text-gray-600">
        Comparação entre Programação Dinâmica e Backtracking
      </p>
    </div>

    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 mb-1">
            {{ dpResults.maxLength }}
          </div>
          <div class="text-sm text-gray-600">Comprimento Máximo</div>
        </div>

        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 mb-1">
            {{ backtrackingResults.count }}
          </div>
          <div class="text-sm text-gray-600">Total de LCS</div>
        </div>

        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 mb-1">
            {{ performanceAnalysis.dpOperations }}
          </div>
          <div class="text-sm text-gray-600">Operações DP</div>
        </div>

        <div class="text-center">
          <div class="text-3xl font-bold text-orange-600 mb-1">
            {{ performanceAnalysis.efficiency }}
          </div>
          <div class="text-sm text-gray-600">Eficiência</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div
            class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Programação Dinâmica</h3>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-semibold text-blue-900 mb-2">Complexidade</h4>
            <code class="text-sm text-blue-800 font-mono">{{
              dpResults.complexity
            }}</code>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-3">
              Uma LCS encontrada:
            </h4>
            <div class="flex flex-wrap gap-1 p-3 bg-gray-50 rounded-lg">
              <span
                v-for="(char, index) in dpResults.oneLCS"
                :key="index"
                class="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded font-mono font-semibold text-sm"
              >
                {{ char }}
              </span>
            </div>
          </div>

          <div class="text-sm text-gray-600 space-y-2">
            <div class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Eficiente em tempo e espaço</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Encontra o comprimento ótimo</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Retorna apenas uma solução</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div
            class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">
            Programação Dinâmica + Backtracking
          </h3>
        </div>

        <div class="space-y-4">
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-semibold text-green-900 mb-2">Complexidade</h4>
            <code class="text-sm text-green-800 font-mono break-all">{{
              backtrackingResults.complexity
            }}</code>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-3">
              Todas as LCS ({{ backtrackingResults.count }}):
            </h4>
            <div class="max-h-64 overflow-y-auto space-y-2">
              <div
                v-for="(lcs, index) in backtrackingResults.allLCS"
                :key="index"
                class="flex items-center space-x-3 p-2 bg-gray-50 rounded"
              >
                <span class="text-xs text-gray-500 w-8">{{ index + 1 }}.</span>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(char, charIndex) in lcs"
                    :key="charIndex"
                    class="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded text-xs font-mono font-semibold"
                  >
                    {{ char }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-sm text-gray-600 space-y-2">
            <div class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Encontra todas as soluções</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Resultados ordenados alfabeticamente</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Complexidade exponencial no pior caso</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6">
        Visualização das Sequências
      </h3>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-blue-700 mb-3">
            Sequência de Helena ({{ helena.length }} caracteres)
          </h4>
          <div class="flex flex-wrap gap-1 p-4 bg-blue-50 rounded-lg">
            <span
              v-for="item in highlightCommonChars(helena, dpResults.oneLCS)"
              :key="`helena-${item.char}-${Math.random()}`"
              :class="[
                'inline-flex items-center justify-center w-8 h-8 rounded font-mono font-semibold text-sm',
                item.isCommon
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                  : 'bg-blue-100 text-blue-800',
              ]"
            >
              {{ item.char }}
            </span>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-green-700 mb-3">
            Sequência de Marcus ({{ marcus.length }} caracteres)
          </h4>
          <div class="flex flex-wrap gap-1 p-4 bg-green-50 rounded-lg">
            <span
              v-for="item in highlightCommonChars(marcus, dpResults.oneLCS)"
              :key="`marcus-${item.char}-${Math.random()}`"
              :class="[
                'inline-flex items-center justify-center w-8 h-8 rounded font-mono font-semibold text-sm',
                item.isCommon
                  ? 'bg-green-500 text-white ring-2 ring-green-300'
                  : 'bg-green-100 text-green-800',
              ]"
            >
              {{ item.char }}
            </span>
          </div>
        </div>

        <div class="flex justify-center space-x-6 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded ring-2 ring-blue-300"></div>
            <span>Parte da LCS</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Não faz parte da LCS</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-yellow-50 rounded-xl p-6">
      <h3 class="text-xl font-bold text-yellow-900 mb-4">
        📊 Análise de Performance
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-semibold text-yellow-800 mb-2">Eficiência Atual</h4>
          <p class="text-yellow-700">
            {{ performanceAnalysis.recommendation }}
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-yellow-800 mb-2">
            Operações Realizadas
          </h4>
          <ul class="text-yellow-700 text-sm space-y-1">
            <li>
              • DP:
              {{ performanceAnalysis.dpOperations.toLocaleString() }} operações
            </li>
            <li>
              • Backtracking: Até
              {{ performanceAnalysis.backtrackingWorstCase.toLocaleString() }}
              no pior caso
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <button
        @click="emit('export')"
        class="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Exportar Resultados</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-ring {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.ring-2 {
  animation: pulse-ring 2s infinite ease-in-out;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
