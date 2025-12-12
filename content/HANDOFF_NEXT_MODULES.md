# Handoff: Enriquecimento dos Próximos Módulos

Este documento serve como guia para agentes futuros que continuarão o trabalho de enriquecimento do conteúdo da PyTorch Academy.

## Status Atual

### ✅ Completo: Seção 1 - Fundamentos (Módulos 1-4)

| Módulo | Arquivo | Linhas Antes | Linhas Depois | Exercícios |
|--------|---------|--------------|---------------|------------|
| 01-tensors | lesson.mdx | ~206 | ~617 | 4 → 7 |
| 02-tensor-operations | lesson.mdx | ~255 | ~785 | 4 → 6 |
| 03-shape-manipulation | lesson.mdx | ~255 | ~710 | 4 → 6 |
| 04-tensors-numpy | lesson.mdx | ~260 | ~567 | 3 → 5 |

**Padrões aplicados:**
- Seção "Por que..." explicando motivação e contexto
- Mais CodeCells com exemplos práticos e comentados
- Tabelas de referência rápida
- Callouts com dicas, warnings e informações importantes
- Exercícios de diferentes dificuldades (easy, medium, hard)
- Referências a aplicações em deep learning

---

### ✅ Completo: Seção 2 - Autograd (Módulos 5-7)

| Módulo | Arquivo | Linhas Antes | Linhas Depois | Exercícios |
|--------|---------|--------------|---------------|------------|
| 05-autograd-intro | lesson.mdx | ~254 | ~777 | 3 → 7 |
| 06-computational-graph | lesson.mdx | ~210 | ~783 | 2 → 6 |
| 07-gradients-practice | lesson.mdx | ~214 | ~985 | 2 → 7 |

**Conteúdo expandido:**
- **Módulo 05**: Seções sobre "Por que Autograd?", atributo `.grad`, leaf vs non-leaf tensors, padrões de treinamento
- **Módulo 06**: Navegação de `grad_fn`, `next_functions`, `retain_grad()`, `detach()`, grafos dinâmicos
- **Módulo 07**: `torch.autograd.grad()`, gradient clipping, debugging de gradientes, gradientes de ordem superior, training loop completo

**Exercícios adicionados:**
- Cálculo de gradientes simples e compostos
- Acumulação e zeragem de gradientes
- Training steps com gradient descent
- Congelamento de parâmetros
- Uso de `retain_grad()` e `detach()`
- Navegação manual do grafo computacional
- Gradient clipping e segunda derivada

---

## 📋 Próximos Blocos para Enriquecimento

### ✅ Bloco 2: Autograd (Módulos 5-7) - COMPLETO

Estes módulos são fundamentais para entender como o PyTorch treina redes neurais.

- [x] **05-autograd-intro** (`content/05-autograd-intro/`)
  - ✅ Expandir explicação de diferenciação automática
  - ✅ Adicionar visualização do grafo computacional
  - ✅ Exemplos práticos de gradientes simples
  - ✅ Comparação com cálculo manual de derivadas

- [x] **06-computational-graph** (`content/06-computational-graph/`)
  - ✅ Detalhes de como o grafo é construído
  - ✅ Operações leaf vs non-leaf
  - ✅ `retain_grad()` e quando usar
  - ✅ Visualização de grafos com diagramas conceituais

- [x] **07-gradients-practice** (`content/07-gradients-practice/`)
  - ✅ Exercícios práticos de backpropagation
  - ✅ `backward()` com argumentos
  - ✅ `torch.no_grad()` e `torch.inference_mode()`
  - ✅ Debugging de gradientes (NaN, explosão, etc.)

**Seções da documentação utilizadas:**
- Seção sobre autograd no `docs_pytorch/docs.pytorch.org-llms.md`
- Referências: "autograd", "backward", "gradient", "requires_grad"

---

### Bloco 3: Redes Neurais (Módulos 8-12) - PRIORIDADE ALTA

Core do PyTorch para construção de modelos.

- [ ] **08-nn-module** (`content/08-nn-module/`)
  - `nn.Module` em profundidade
  - `forward()` e `__call__`
  - Registro de parâmetros
  - Submodules e composição

- [ ] **09-builtin-layers** (`content/09-builtin-layers/`)
  - Linear, Conv2d, BatchNorm, Dropout
  - Parâmetros de cada camada
  - Quando usar cada tipo

- [ ] **10-activations-loss** (`content/10-activations-loss/`)
  - ReLU, Sigmoid, Tanh, Softmax, GELU
  - CrossEntropyLoss, MSELoss, BCELoss
  - Escolha de função de perda por problema

- [ ] **11-optimizers** (`content/11-optimizers/`)
  - SGD, Adam, AdamW, RMSprop
  - Learning rate scheduling
  - Weight decay e regularização

- [ ] **12-training-loop** (`content/12-training-loop/`)
  - Loop de treinamento completo
  - Validação e early stopping
  - Checkpointing de modelos

**Seções da documentação relevantes:**
- `torch.nn` module
- `torch.optim` module
- Buscar: "nn.Module", "Linear", "Conv2d", "optimizer"

---

### Bloco 4: Dados e Treinamento (Módulos 13-15) - PRIORIDADE MÉDIA

Essencial para trabalhar com datasets reais.

- [ ] **13-dataset-dataloader** (`content/13-dataset-dataloader/`)
  - `Dataset` e `IterableDataset`
  - `DataLoader` com workers e batching
  - Samplers e shuffling

- [ ] **14-transforms** (`content/14-transforms/`)
  - `torchvision.transforms`
  - Compose e transforms customizados
  - Data augmentation

- [ ] **15-metrics-validation** (`content/15-metrics-validation/`)
  - Métricas de classificação e regressão
  - Train/val/test split
  - Cross-validation

**Seções da documentação relevantes:**
- `torch.utils.data`
- Buscar: "Dataset", "DataLoader", "transforms"

---

### Bloco 5: Arquiteturas Avançadas (Módulos 16-20) - PRIORIDADE BAIXA

Tópicos mais avançados para depois.

- [ ] **16-cnns** (`content/16-cnns/`)
  - Arquiteturas de CNNs (LeNet, VGG, ResNet)
  - Pooling e stride
  - Feature maps e receptive field

- [ ] **17-rnns-lstm** (`content/17-rnns-lstm/`)
  - RNN básico
  - LSTM e GRU
  - Bidirectional e stacking

- [ ] **18-attention-transformers** (`content/18-attention-transformers/`)
  - Self-attention
  - Multi-head attention
  - Positional encoding
  - Transformer encoder/decoder

- [ ] **19-transfer-learning** (`content/19-transfer-learning/`)
  - Modelos pré-treinados
  - Fine-tuning vs feature extraction
  - Freezing layers

- [ ] **20-deploy** (`content/20-deploy/`)
  - TorchScript e JIT
  - ONNX export
  - Quantização
  - Serving com TorchServe

---

## 📚 Recursos Disponíveis

### Documentação PyTorch
Arquivo completo em: `docs_pytorch/docs.pytorch.org-llms.md`

**Atenção:** Este arquivo tem ~160K linhas. Use busca por seções específicas:
- Grep por função/classe específica (ex: "torch.nn.Linear")
- O arquivo está organizado por tópicos com headers markdown

### Estrutura de Cada Módulo
```
content/{module-id}/
├── lesson.mdx      # Conteúdo da lição (MDX com componentes custom)
└── exercises.json  # Exercícios com starter code, hints, validação
```

### Componentes MDX Disponíveis
- `<CodeCell id="unique-id">` - Célula de código executável
- `<Exercise id="ex-id" difficulty="easy|medium|hard">` - Exercício interativo
- `<Callout type="info|warning|tip|important|success">` - Caixas de destaque
- `<DocRef to="url">` - Referência à documentação oficial

---

## 🎯 Diretrizes de Enriquecimento

### Meta de Expansão
- Cada módulo deve ter 2-3x o conteúdo original
- ~450-700 linhas por lesson.mdx (dependendo do tópico)
- 5-8 exercícios por módulo (progressão de dificuldade)

### Padrão de Conteúdo
1. **Seção "Por que [tópico]?"** - Motivação e contexto
2. **Conceitos fundamentais** - Explicação clara com analogias
3. **Código executável** - CodeCells com exemplos comentados
4. **Tabelas de referência** - Para consulta rápida
5. **Callouts estratégicos** - Dicas, warnings, informações
6. **Exercícios graduados** - Easy → Medium → Hard
7. **Resumo final** - Recap dos pontos principais

### Estrutura de Exercício (exercises.json)
```json
{
  "ex-unique-id": {
    "starterCode": "import torch\n\n# Código inicial...\nresult = ",
    "hints": [
      "Primeira dica mais genérica",
      "Segunda dica mais específica",
      "Terceira dica praticamente dá a resposta"
    ],
    "validation": {
      "type": "assert",
      "tests": [
        "assert result == expected, 'Mensagem de erro descritiva'"
      ]
    },
    "solution": "result = torch.something()"
  }
}
```

### Idioma
- Todo conteúdo em **Português (PT-BR)**
- Comentários em código em português
- Nomes de variáveis podem ser em inglês (padrão técnico)

---

## ⚠️ Pontos de Atenção

1. **Não modificar arquivos existentes** dos módulos 1-4 (já enriquecidos)
2. **Verificar sintaxe MDX** - Os componentes custom têm sintaxe específica
3. **Testar exercícios** - Validar que as assertions funcionam
4. **Manter consistência** - Seguir padrões estabelecidos nos módulos 1-4
5. **Referências à documentação** - Usar seções específicas do arquivo de docs

---

## 🔄 Workflow Sugerido

1. Ler o módulo atual (lesson.mdx + exercises.json)
2. Consultar seções relevantes em `docs_pytorch/docs.pytorch.org-llms.md`
3. Expandir lesson.mdx com novos conteúdos e CodeCells
4. Adicionar novos exercícios ao exercises.json
5. Verificar consistência e sintaxe
6. Atualizar este documento marcando o módulo como completo

---

## 📊 Estimativa de Esforço

| Bloco | Módulos | Complexidade | Status |
|-------|---------|--------------|--------|
| ✅ Autograd (5-7) | 3 | Alta | Completo |
| Redes Neurais (8-12) | 5 | Alta | Pendente |
| Dados (13-15) | 3 | Média | Pendente |
| Arquiteturas (16-20) | 5 | Alta | Pendente |

---

*Última atualização: Módulos 1-7 completados (Fundamentos + Autograd)*
*Próximo bloco recomendado: Redes Neurais (8-12)*
