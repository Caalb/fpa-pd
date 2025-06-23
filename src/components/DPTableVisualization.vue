/** * Componente de Visualização da Tabela de Programação Dinâmica * *
Características: * - Visualização interativa da tabela DP * - Destacamento do
caminho de reconstrução * - Animações suaves para compreensão do algoritmo * -
Controles para navegar pelos passos */

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  helena: string;
  marcus: string;
  dpTable: number[][];
  allLcs: string[];
}

const props = defineProps<Props>();

const selectedCell = ref<{ row: number; col: number } | null>(null);
const animationStep = ref(0);
const isAnimating = ref(false);
const animationSpeed = ref(500); // milliseconds
const showPath = ref(false);
const selectedLCS = ref(0);

const tableAnalysis = computed(() => {
  const rows = props.dpTable.length;
  const cols = props.dpTable[0]?.length || 0;
  const maxValue = Math.max(...props.dpTable.flat());

  return {
    rows,
    cols,
    maxValue,
    totalCells: rows * cols,
    filledCells: props.dpTable.flat().filter((val) => val > 0).length,
  };
});

const reconstructionPath = computed(() => {
  if (!props.allLcs[selectedLCS.value]) return [];

  const path: Array<{
    row: number;
    col: number;
    char?: string;
    decision: string;
  }> = [];
  let i = props.helena.length;
  let j = props.marcus.length;
  let lcsIndex = props.allLcs[selectedLCS.value].length - 1;

  while (i > 0 && j > 0) {
    if (props.helena[i - 1] === props.marcus[j - 1]) {
      path.unshift({
        row: i,
        col: j,
        char: props.helena[i - 1],
        decision: "match",
      });
      i--;
      j--;
      lcsIndex--;
    } else if (props.dpTable[i - 1][j] >= props.dpTable[i][j - 1]) {
      path.unshift({
        row: i,
        col: j,
        decision: "up",
      });
      i--;
    } else {
      path.unshift({
        row: i,
        col: j,
        decision: "left",
      });
      j--;
    }
  }

  return path;
});

const getCellColor = (value: number, row: number, col: number) => {
  const maxValue = tableAnalysis.value.maxValue;
  const intensity = maxValue > 0 ? value / maxValue : 0;

  if (selectedCell.value?.row === row && selectedCell.value?.col === col) {
    return "bg-yellow-400 text-yellow-900 ring-2 ring-yellow-500";
  }

  if (
    showPath.value &&
    reconstructionPath.value.some((p) => p.row === row && p.col === col)
  ) {
    const pathItem = reconstructionPath.value.find(
      (p) => p.row === row && p.col === col
    );
    if (pathItem?.decision === "match") {
      return "bg-green-400 text-green-900 ring-2 ring-green-500";
    } else {
      return "bg-blue-300 text-blue-900 ring-1 ring-blue-400";
    }
  }

  // Cor baseada no valor
  if (value === 0) {
    return "bg-gray-100 text-gray-500";
  } else if (intensity < 0.3) {
    return "bg-blue-100 text-blue-800";
  } else if (intensity < 0.6) {
    return "bg-blue-200 text-blue-900";
  } else if (intensity < 0.9) {
    return "bg-blue-300 text-blue-900";
  } else {
    return "bg-blue-500 text-white";
  }
};

const selectCell = (row: number, col: number) => {
  selectedCell.value = { row, col };
};

const animateTableFilling = async () => {
  isAnimating.value = true;
  animationStep.value = 0;

  const totalSteps = (props.helena.length + 1) * (props.marcus.length + 1);

  for (let step = 0; step <= totalSteps; step++) {
    animationStep.value = step;
    await new Promise((resolve) => setTimeout(resolve, animationSpeed.value));
  }

  isAnimating.value = false;
};

const shouldShowCell = (row: number, col: number) => {
  if (!isAnimating.value) return true;

  const cellStep = row * (props.marcus.length + 1) + col;
  return cellStep <= animationStep.value;
};

const togglePath = () => {
  showPath.value = !showPath.value;
};

const changeLCS = (direction: "prev" | "next") => {
  if (direction === "prev" && selectedLCS.value > 0) {
    selectedLCS.value--;
  } else if (
    direction === "next" &&
    selectedLCS.value < props.allLcs.length - 1
  ) {
    selectedLCS.value++;
  }
};

watch([() => props.helena, () => props.marcus], () => {
  selectedCell.value = null;
  animationStep.value = 0;
  showPath.value = false;
  selectedLCS.value = 0;
});
</script>

<template>
  <div class="max-w-full mx-auto space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Visualização da Tabela de Programação Dinâmica
      </h2>
      <p class="text-gray-600">
        Explore como o algoritmo constrói a solução passo a passo
      </p>
    </div>

    <!-- Controles -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-wrap gap-4 justify-center items-center">
        <!-- Controles de Animação -->
        <div class="flex items-center space-x-3">
          <button
            @click="animateTableFilling"
            :disabled="isAnimating"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span>{{
              isAnimating ? "Animando..." : "Animar Preenchimento"
            }}</span>
          </button>

          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Velocidade:</label>
            <select
              v-model="animationSpeed"
              class="px-2 py-1 border border-gray-300 rounded text-sm"
              :disabled="isAnimating"
            >
              <option value="100">Rápida</option>
              <option value="300">Média</option>
              <option value="500">Normal</option>
              <option value="800">Lenta</option>
            </select>
          </div>
        </div>

        <!-- Controles do Caminho -->
        <div class="flex items-center space-x-3">
          <button
            @click="togglePath"
            :class="[
              'px-4 py-2 rounded-lg transition-all flex items-center space-x-2',
              showPath
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span>{{ showPath ? "Ocultar" : "Mostrar" }} Caminho</span>
          </button>

          <div v-if="allLcs.length > 1" class="flex items-center space-x-2">
            <button
              @click="changeLCS('prev')"
              :disabled="selectedLCS === 0"
              class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <span class="text-sm text-gray-600 px-2">
              LCS {{ selectedLCS + 1 }} de {{ allLcs.length }}
            </span>

            <button
              @click="changeLCS('next')"
              :disabled="selectedLCS === allLcs.length - 1"
              class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="allLcs[selectedLCS]" class="mt-4 text-center">
        <div
          class="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg"
        >
          <span class="text-sm text-purple-700 font-medium">LCS Atual:</span>
          <div class="flex space-x-1">
            <span
              v-for="(char, index) in allLcs[selectedLCS]"
              :key="index"
              class="inline-flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded text-xs font-mono font-semibold"
            >
              {{ char }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-auto"
    >
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Tabela de Programação Dinâmica
        </h3>
        <p class="text-sm text-gray-600">
          Clique em uma célula para ver detalhes. As cores indicam os valores da
          LCS.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="border-collapse">
          <!-- Cabeçalho com caracteres de Marcus -->
          <thead>
            <tr>
              <th
                class="w-10 h-10 border border-gray-300 bg-gray-100 text-xs font-mono"
              ></th>
              <th
                class="w-10 h-10 border border-gray-300 bg-gray-100 text-xs font-mono"
              >
                ∅
              </th>
              <th
                v-for="(char, index) in marcus"
                :key="index"
                class="w-10 h-10 border border-gray-300 bg-green-100 text-xs font-mono font-semibold"
              >
                {{ char }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th
                class="w-10 h-10 border border-gray-300 bg-gray-100 text-xs font-mono"
              >
                ∅
              </th>
              <td
                v-for="(value, colIndex) in dpTable[0]"
                :key="colIndex"
                @click="selectCell(0, colIndex)"
                :class="[
                  'w-10 h-10 border border-gray-300 text-xs font-mono font-semibold cursor-pointer',
                  'transition-all hover:scale-105',
                  getCellColor(value, 0, colIndex),
                  shouldShowCell(0, colIndex) ? 'opacity-100' : 'opacity-20',
                ]"
              >
                {{ shouldShowCell(0, colIndex) ? value : "" }}
              </td>
            </tr>

            <tr v-for="(row, rowIndex) in dpTable.slice(1)" :key="rowIndex">
              <th
                class="w-10 h-10 border border-gray-300 bg-blue-100 text-xs font-mono font-semibold"
              >
                {{ helena[rowIndex] }}
              </th>
              <td
                v-for="(value, colIndex) in row"
                :key="colIndex"
                @click="selectCell(rowIndex + 1, colIndex)"
                :class="[
                  'w-10 h-10 border border-gray-300 text-xs font-mono font-semibold cursor-pointer',
                  'transition-all hover:scale-105',
                  getCellColor(value, rowIndex + 1, colIndex),
                  shouldShowCell(rowIndex + 1, colIndex)
                    ? 'opacity-100'
                    : 'opacity-20',
                ]"
              >
                {{ shouldShowCell(rowIndex + 1, colIndex) ? value : "" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="selectedCell"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Detalhes da Célula [{{ selectedCell.row }}, {{ selectedCell.col }}]
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Informações</h4>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>
              <strong>Valor:</strong>
              {{ dpTable[selectedCell.row][selectedCell.col] }}
            </li>
            <li>
              <strong>Posição:</strong> Linha {{ selectedCell.row }}, Coluna
              {{ selectedCell.col }}
            </li>
            <li v-if="selectedCell.row > 0 && selectedCell.col > 0">
              <strong>Caracteres:</strong>
              Helena[{{ selectedCell.row - 1 }}] = '{{
                helena[selectedCell.row - 1]
              }}', Marcus[{{ selectedCell.col - 1 }}] = '{{
                marcus[selectedCell.col - 1]
              }}'
            </li>
            <li v-if="selectedCell.row > 0 && selectedCell.col > 0">
              <strong>Match:</strong>
              {{
                helena[selectedCell.row - 1] === marcus[selectedCell.col - 1]
                  ? "Sim"
                  : "Não"
              }}
            </li>
          </ul>
        </div>

        <div v-if="selectedCell.row > 0 && selectedCell.col > 0">
          <h4 class="font-medium text-gray-900 mb-2">Cálculo</h4>
          <div class="text-sm text-gray-600">
            <p
              v-if="
                helena[selectedCell.row - 1] === marcus[selectedCell.col - 1]
              "
            >
              <code class="bg-gray-100 px-2 py-1 rounded">
                dp[{{ selectedCell.row }}][{{ selectedCell.col }}] = dp[{{
                  selectedCell.row - 1
                }}][{{ selectedCell.col - 1 }}] + 1
              </code>
              <br />
              <code class="bg-gray-100 px-2 py-1 rounded">
                = {{ dpTable[selectedCell.row - 1][selectedCell.col - 1] }} + 1
                = {{ dpTable[selectedCell.row][selectedCell.col] }}
              </code>
            </p>
            <p v-else>
              <code class="bg-gray-100 px-2 py-1 rounded">
                dp[{{ selectedCell.row }}][{{ selectedCell.col }}] = max(dp[{{
                  selectedCell.row - 1
                }}][{{ selectedCell.col }}], dp[{{ selectedCell.row }}][{{
                  selectedCell.col - 1
                }}])
              </code>
              <br />
              <code class="bg-gray-100 px-2 py-1 rounded">
                = max({{ dpTable[selectedCell.row - 1][selectedCell.col] }},
                {{ dpTable[selectedCell.row][selectedCell.col - 1] }}) =
                {{ dpTable[selectedCell.row][selectedCell.col] }}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
        Estatísticas da Tabela
      </h3>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ tableAnalysis.rows }}×{{ tableAnalysis.cols }}
          </div>
          <div class="text-sm text-gray-600">Dimensões</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ tableAnalysis.maxValue }}
          </div>
          <div class="text-sm text-gray-600">Valor Máximo</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">
            {{ tableAnalysis.totalCells }}
          </div>
          <div class="text-sm text-gray-600">Total de Células</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">
            {{
              Math.round(
                (tableAnalysis.filledCells / tableAnalysis.totalCells) * 100
              )
            }}%
          </div>
          <div class="text-sm text-gray-600">Células Preenchidas</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
        Legenda
      </h3>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Valor 0</span>
        </div>

        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-blue-200 rounded"></div>
          <span>Valores baixos</span>
        </div>

        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Valores altos</span>
        </div>

        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-400 ring-2 ring-green-500 rounded"></div>
          <span>Caminho LCS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
td,
th {
  transition: all 0.2s ease-in-out;
}

td:hover {
  transform: scale(1.05);
  z-index: 10;
  position: relative;
}

.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.ring-2 {
  animation: pulse 1.5s infinite ease-in-out;
}
</style>
