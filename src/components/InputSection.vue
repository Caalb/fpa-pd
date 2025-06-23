/** * Componente para entrada e validação de dados * * Características: * -
Interface intuitiva para inserir as sequências de Helena e Marcus * - Validação
em tempo real das entradas * - Presets de exemplo para teste rápido * - Feedback
visual para guiar o usuário */

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  helena: string;
  marcus: string;
  validation: {
    isValid: boolean;
    errors: string[];
  };
  presets: Array<{
    name: string;
    helena: string;
    marcus: string;
  }>;
}

interface Emits {
  (e: "update:helena", value: string): void;
  (e: "update:marcus", value: string): void;
  (e: "load-preset", preset: Props["presets"][0]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const helenaModel = computed({
  get: () => props.helena,
  set: (value: string) => emit("update:helena", value),
});

const marcusModel = computed({
  get: () => props.marcus,
  set: (value: string) => emit("update:marcus", value),
});

const clearFields = () => {
  helenaModel.value = "";
  marcusModel.value = "";
};

const swapValues = () => {
  const temp = helenaModel.value;
  helenaModel.value = marcusModel.value;
  marcusModel.value = temp;
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        Entrada de Sequências
      </h2>
      <p class="text-gray-600">
        Insira as sequências de eventos coletadas por Helena e Marcus
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <label class="text-lg font-semibold text-gray-900">
              Sequência de Helena
            </label>
          </div>

          <div class="relative">
            <textarea
              v-model="helenaModel"
              placeholder="Digite a sequência de eventos (ex: ijkijkii)"
              class="w-full h-24 p-4 border border-gray-300 rounded-lg font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              :class="{
                'border-red-300 bg-red-50':
                  validation.errors.length > 0 && helena,
                'border-green-300 bg-green-50': validation.isValid && helena,
              }"
            />
            <div class="absolute top-2 right-2 text-xs text-gray-500">
              {{ helena.length }}/80
            </div>
          </div>

          <!-- Visualização da sequência -->
          <div v-if="helena" class="p-3 bg-blue-50 rounded-lg">
            <div class="text-sm text-blue-700 mb-2 font-medium">
              Prévia da sequência:
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(char, index) in helena"
                :key="index"
                class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded text-sm font-mono font-semibold"
              >
                {{ char }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <label class="text-lg font-semibold text-gray-900">
              Sequência de Marcus
            </label>
          </div>

          <div class="relative">
            <textarea
              v-model="marcusModel"
              placeholder="Digite a sequência de eventos (ex: ikjikji)"
              class="w-full h-24 p-4 border border-gray-300 rounded-lg font-mono text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
              :class="{
                'border-red-300 bg-red-50':
                  validation.errors.length > 0 && marcus,
                'border-green-300 bg-green-50': validation.isValid && marcus,
              }"
            />
            <div class="absolute top-2 right-2 text-xs text-gray-500">
              {{ marcus.length }}/80
            </div>
          </div>

          <!-- Visualização da sequência -->
          <div v-if="marcus" class="p-3 bg-green-50 rounded-lg">
            <div class="text-sm text-green-700 mb-2 font-medium">
              Prévia da sequência:
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(char, index) in marcus"
                :key="index"
                class="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded text-sm font-mono font-semibold"
              >
                {{ char }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8 space-x-4">
        <button
          @click="clearFields"
          class="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all flex items-center space-x-2"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Limpar</span>
        </button>

        <button
          @click="swapValues"
          :disabled="!helena || !marcus"
          class="px-6 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <span>Trocar</span>
        </button>
      </div>
    </div>

    <div
      v-if="validation.errors.length > 0"
      class="bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div class="flex items-start space-x-3">
        <svg
          class="w-5 h-5 text-red-500 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">Erro de validação</h3>
          <ul class="mt-1 text-sm text-red-700 list-disc list-inside">
            <li v-for="error in validation.errors" :key="error">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
        Exemplos para Teste Rápido
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="preset in presets"
          :key="preset.name"
          @click="$emit('load-preset', preset)"
          class="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all text-left group"
        >
          <div
            class="font-medium text-gray-900 group-hover:text-indigo-600 mb-2"
          >
            {{ preset.name }}
          </div>
          <div class="space-y-1 text-sm text-gray-600">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
              <code class="font-mono">{{ preset.helena }}</code>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-green-400 rounded-full"></span>
              <code class="font-mono">{{ preset.marcus }}</code>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div class="bg-blue-50 rounded-lg p-6">
      <h4 class="font-medium text-blue-900 mb-3">💡 Dicas de uso:</h4>
      <ul class="text-sm text-blue-800 space-y-2">
        <li class="flex items-start space-x-2">
          <span class="text-blue-500 mt-1">•</span>
          <span
            >Use apenas letras minúsculas de 'a' a 'z' para representar
            diferentes tipos de eventos</span
          >
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>Cada sequência pode ter entre 1 e 80 caracteres</span>
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-blue-500 mt-1">•</span>
          <span
            >Os algoritmos encontrarão todas as subsequências comuns respeitando
            a ordem dos eventos</span
          >
        </li>
        <li class="flex items-start space-x-2">
          <span class="text-blue-500 mt-1">•</span>
          <span
            >Teste com os exemplos fornecidos para entender melhor o
            funcionamento</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.inline-flex {
  animation: fadeInUp 0.3s ease-out;
}

textarea {
  transition: all 0.3s ease;
}
</style>
