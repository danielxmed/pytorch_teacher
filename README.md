# PyTorch Academy

Plataforma de aprendizado interativo de PyTorch com conteúdo teórico em formato literate programming, células de código executáveis, e exercícios com validação automática.

## Visão Geral

O PyTorch Academy oferece uma experiência de aprendizado imersiva onde você aprende PyTorch **fazendo**. O currículo cobre desde tensores básicos até Transformers, com código executável diretamente no navegador.

### Características

- **Código Executável**: Execute Python/PyTorch diretamente no navegador com Pyodide
- **20 Módulos**: Currículo completo cobrindo fundamentos até arquiteturas avançadas
- **Exercícios Práticos**: Validação automática com feedback instantâneo
- **Progresso Salvo**: Seu avanço é salvo automaticamente no navegador
- **Dark Mode**: Interface inspirada em editores de código

## Estrutura do Projeto

```
/backend    → FastAPI (Python 3.11+)
/frontend   → React + TypeScript + Vite
/content    → Módulos do curso em MDX
/scripts    → Scripts utilitários
```

## Início Rápido

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

O backend estará disponível em `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Currículo

### Seção 1: Fundamentos (Módulos 1-4)
1. Tensores: criação, dtypes, device
2. Operações com tensores: indexing, slicing, broadcasting
3. Manipulação de shape: view, reshape, squeeze, permute
4. Tensores e NumPy: conversão, shared memory

### Seção 2: Autograd (Módulos 5-7)
5. Introdução ao autograd: requires_grad, backward
6. Grafo computacional: como o PyTorch rastreia operações
7. Gradientes na prática: cálculo manual vs autograd

### Seção 3: Redes Neurais (Módulos 8-12)
8. nn.Module: anatomia de uma rede neural
9. Layers built-in: Linear, Conv2d, BatchNorm
10. Funções de ativação e loss functions
11. Otimizadores: SGD, Adam, schedulers
12. Training loop completo: forward, loss, backward, step

### Seção 4: Dados e Treinamento (Módulos 13-15)
13. Dataset e DataLoader: carregando dados eficientemente
14. Transforms e augmentation
15. Métricas, validação e early stopping

### Seção 5: Arquiteturas Avançadas (Módulos 16-20)
16. CNNs: convoluções, pooling, arquiteturas clássicas
17. RNNs e LSTMs: sequências e memória
18. Attention e Transformers
19. Transfer learning e fine-tuning
20. Deploy: TorchScript, ONNX, otimização

## Scripts Utilitários

```bash
# Verificar integridade do conteúdo
python scripts/verify-content.py

# Atualizar versão do PyTorch nos módulos
python scripts/update-docs.py --version 2.3

# Executar todos os code snippets (CI)
python scripts/run-snippets.py
```

## Tecnologias

### Backend
- FastAPI
- Pydantic
- python-frontmatter
- httpx (proxy de documentação)

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Monaco Editor
- Pyodide (Python no browser)
- Zustand (state management)

## Licença

MIT
