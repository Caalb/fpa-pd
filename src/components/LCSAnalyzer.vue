/** * Componente principal para análise de subsequências comuns * * Este
componente oferece uma interface moderna e intuitiva para: * - Inserir
sequências de dados (Helena e Marcus) * - Visualizar o processo algorítmico * -
Comparar resultados entre as duas abordagens * - Exportar resultados em
diferentes formatos */

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  findAllLCSWithSteps,
  validateAllLCS,
  processMultipleDatasets,
  testProcessMultipleDatasets,
} from "../algorithms/lcs-backtracking";
import DPTableVisualization from "./DPTableVisualization.vue";
import ResultsDisplay from "./ResultsDisplay.vue";
import InputSection from "./InputSection.vue";
import {
  useLCSWorker,
  type DPResults,
  type BacktrackingResults,
} from "../composables/useLCSWorker";

const helenaSequence = ref("ijkijkii");
const marcusSequence = ref("ikjikji");
const activeTab = ref<"input" | "analysis" | "visualization" | "multiple">(
  "input"
);

const multipleInput = ref("1\nijkijkii\nikjikji");
const multipleResults = ref<string>("");
const multipleError = ref<string>("");

const {
  isProcessing,
  processingMessage,
  error,
  calculateDP,
  calculateBacktracking,
  cancelProcessing,
} = useLCSWorker();

const dpResults = ref<DPResults | null>(null);
const backtrackingResults = ref<BacktrackingResults | null>(null);

const processResults = () => {
  if (!helenaSequence.value || !marcusSequence.value) {
    dpResults.value = null;
    backtrackingResults.value = null;
    return;
  }

  calculateDP(helenaSequence.value, marcusSequence.value, (result) => {
    dpResults.value = result;
  });

  calculateBacktracking(
    helenaSequence.value,
    marcusSequence.value,
    (result) => {
      const isValid = validateAllLCS(
        result.allLCS,
        helenaSequence.value,
        marcusSequence.value
      );

      const withSteps = findAllLCSWithSteps(
        helenaSequence.value,
        marcusSequence.value
      );

      backtrackingResults.value = {
        allLCS: result.allLCS,
        count: result.count,
        complexity: result.complexity,
        steps: withSteps.steps,
        isValid,
      };
    }
  );
};

const inputValidation = computed(() => {
  const helena = helenaSequence.value;
  const marcus = marcusSequence.value;

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!helena || !marcus) {
    errors.push("Ambas as sequências devem ser preenchidas");
  }

  if (helena.length > 80 || marcus.length > 80) {
    errors.push("Sequências devem ter no máximo 80 caracteres");
  }

  if (helena.length > 20 || marcus.length > 20) {
    warnings.push("⚠️ Sequências longas podem demorar para processar");
  }

  if (helena.length > 30 || marcus.length > 30) {
    warnings.push(
      "⚠️ Sequências muito longas - resultados podem ser limitados"
    );
  }

  const validChars = /^[a-z]*$/;
  if (!validChars.test(helena) || !validChars.test(marcus)) {
    errors.push("Apenas letras minúsculas (a-z) são permitidas");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
});

const processMultipleDatasetsInput = () => {
  try {
    multipleError.value = "";
    const result = processMultipleDatasets(multipleInput.value);
    multipleResults.value = result;
  } catch (error) {
    multipleError.value =
      error instanceof Error ? error.message : String(error);
    multipleResults.value = "";
  }
};

const runTests = () => {
  try {
    const testResults = testProcessMultipleDatasets();
    console.log("🧪 Resultados dos testes:", testResults);

    if (testResults.success) {
      multipleError.value = "";
      multipleResults.value =
        "✅ Todos os testes passaram!\n\n" +
        testResults.results
          .map(
            (r) =>
              `${r.test}: ${r.passed ? "✅" : "❌"}\n${
                r.output || r.error || ""
              }`
          )
          .join("\n\n");
    } else {
      multipleError.value = "Alguns testes falharam";
      multipleResults.value = testResults.results
        .map(
          (r) =>
            `${r.test}: ${r.passed ? "✅" : "❌"}\n${r.output || r.error || ""}`
        )
        .join("\n\n");
    }
  } catch (error) {
    multipleError.value =
      error instanceof Error ? error.message : String(error);
    multipleResults.value = "";
  }
};

const exportResults = () => {
  if (!dpResults.value || !backtrackingResults.value) return;

  const data = {
    input: {
      helena: helenaSequence.value,
      marcus: marcusSequence.value,
    },
    results: {
      dynamicProgramming: {
        maxLength: dpResults.value.maxLength,
        oneLCS: dpResults.value.oneLCS,
        complexity: dpResults.value.complexity,
      },
      backtracking: {
        allLCS: backtrackingResults.value.allLCS,
        count: backtrackingResults.value.count,
        complexity: backtrackingResults.value.complexity,
      },
    },
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lcs-analysis-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const examplePresets = [
  { name: "Exemplo do Roteiro", helena: "ijkijkii", marcus: "ikjikji" },
  { name: "Sequências Simples", helena: "abcdef", marcus: "acef" },
  { name: "Padrões Complexos", helena: "abcabcabc", marcus: "bacbacbac" },
  { name: "Caso Extremo", helena: "aaaaaaa", marcus: "aaaaaaa" },
];

const loadPreset = (preset: (typeof examplePresets)[0]) => {
  helenaSequence.value = preset.helena;
  marcusSequence.value = preset.marcus;
  processResults();
  activeTab.value = "analysis";
};

watch([helenaSequence, marcusSequence], () => {
  if (
    helenaSequence.value &&
    marcusSequence.value &&
    inputValidation.value.isValid
  ) {
    processResults();
  }
});
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-center">
      <nav class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          @click="activeTab = 'input'"
          :class="[
            'px-6 py-2 rounded-md text-sm font-medium transition-all',
            activeTab === 'input'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          📝 Entrada de Dados
        </button>
        <button
          @click="
            () => {
              activeTab = 'analysis';
              processResults();
            }
          "
          :class="[
            'px-6 py-2 rounded-md text-sm font-medium transition-all',
            activeTab === 'analysis'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
          :disabled="!inputValidation.isValid || isProcessing"
        >
          🔍 Análise
        </button>
        <button
          @click="activeTab = 'visualization'"
          :class="[
            'px-6 py-2 rounded-md text-sm font-medium transition-all',
            activeTab === 'visualization'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
          :disabled="!inputValidation.isValid"
        >
          📊 Visualização
        </button>
        <button
          @click="activeTab = 'multiple'"
          :class="[
            'px-6 py-2 rounded-md text-sm font-medium transition-all',
            activeTab === 'multiple'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          📋 Múltiplos Conjuntos
        </button>
      </nav>
    </div>

    <div v-show="activeTab === 'input'" class="space-y-6">
      <InputSection
        v-model:helena="helenaSequence"
        v-model:marcus="marcusSequence"
        :validation="inputValidation"
        :presets="examplePresets"
        @load-preset="loadPreset"
      />
    </div>

    <div
      v-show="activeTab === 'analysis'"
      v-if="dpResults && backtrackingResults"
    >
      <ResultsDisplay
        :dp-results="dpResults"
        :backtracking-results="backtrackingResults"
        :helena="helenaSequence"
        :marcus="marcusSequence"
        @export="exportResults"
      />
    </div>

    <div
      v-show="activeTab === 'visualization'"
      v-if="dpResults && backtrackingResults"
    >
      <DPTableVisualization
        :helena="helenaSequence"
        :marcus="marcusSequence"
        :dp-table="dpResults.table"
        :all-lcs="backtrackingResults.allLCS || []"
      />
    </div>

    <div v-show="activeTab === 'multiple'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          📋 Processamento de Múltiplos Conjuntos
        </h2>

        <div class="mb-4">
          <p class="text-gray-600 text-sm mb-2">
            Formato: primeira linha contém D (número de conjuntos), seguido de 2
            linhas por conjunto
          </p>
          <div class="bg-gray-50 p-3 rounded text-sm font-mono">
            Exemplo:<br />
            1<br />
            ijkijkii<br />
            ikjikji
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Entrada (formato do roteiro):
            </label>
            <textarea
              v-model="multipleInput"
              rows="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="1&#10;ijkijkii&#10;ikjikji"
            ></textarea>
          </div>

          <div class="flex space-x-4">
            <button
              @click="processMultipleDatasetsInput"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🚀 Processar
            </button>

            <button
              @click="runTests"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              🧪 Executar Testes
            </button>
          </div>

          <div
            v-if="multipleError"
            class="bg-red-50 border border-red-200 rounded-md p-4"
          >
            <h3 class="text-red-800 font-medium mb-2">❌ Erro:</h3>
            <p class="text-red-700 text-sm">{{ multipleError }}</p>
          </div>

          <div v-if="multipleResults" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">📤 Resultado:</h3>
            <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
              <pre class="text-sm font-mono whitespace-pre-wrap">{{
                multipleResults
              }}</pre>
            </div>

            <button
              @click="navigator.clipboard?.writeText(multipleResults)"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              📋 Copiar Resultado
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isProcessing" class="bg-blue-50 rounded-lg p-6 text-center">
      <div class="flex items-center justify-center mb-4">
        <div
          class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
        ></div>
        <span class="ml-3 text-gray-700 font-medium">{{
          processingMessage || "Processando..."
        }}</span>
      </div>
      <p class="text-sm text-gray-600 mb-4">
        Para sequências longas, o cálculo pode demorar alguns segundos...
      </p>
      <button
        @click="cancelProcessing"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Cancelar
      </button>
    </div>

    <div
      v-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
    >
      <div class="text-red-600 font-medium mb-2">❌ Erro no processamento</div>
      <p class="text-sm text-red-700">{{ error }}</p>
      <button
        @click="processResults"
        class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
      >
        Tentar Novamente
      </button>
    </div>

    <div class="bg-gray-50 rounded-lg p-6 text-center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-1">
          <div class="text-2xl font-bold text-blue-600">
            {{ helenaSequence.length }}
          </div>
          <div class="text-sm text-gray-600">Caracteres Helena</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-bold text-green-600">
            {{ marcusSequence.length }}
          </div>
          <div class="text-sm text-gray-600">Caracteres Marcus</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-bold text-purple-600">
            {{ dpResults?.maxLength || 0 }}
          </div>
          <div class="text-sm text-gray-600">Comprimento LCS</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s ease;
}

.tab-enter-from,
.tab-leave-to {
  opacity: 0;
}
</style>
