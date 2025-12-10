# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PyTorch Academy is an interactive PyTorch learning platform with **server-side code execution**. The platform features 20 modules covering tensors through Transformers, with executable code cells running real PyTorch on the backend and auto-validated exercises.

## Development Commands

### Backend (FastAPI)
```bash
cd backend
source venv/bin/activate  # or: venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload  # runs on http://localhost:8000
pytest tests/  # run tests
pytest tests/test_api.py::test_get_curriculum -v  # run single test
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev      # runs on http://localhost:5173
npm run build    # tsc && vite build
npm run lint     # eslint
npm test         # vitest
```

### Utility Scripts
```bash
python scripts/verify-content.py     # validate content integrity
python scripts/update-docs.py --version 2.3  # update PyTorch version in modules
python scripts/run-snippets.py       # execute all code snippets (CI)
```

## Architecture

### Backend (`/backend`)
- **FastAPI app**: `app/main.py` - CORS config, router registration
- **Config**: `app/config.py` - Settings via pydantic-settings, reads from `.env`
- **Routers**: `app/routers/`
  - `curriculum.py` - module listing
  - `validation.py` - exercise checking
  - `execution.py` - Python/PyTorch code execution
  - `docs.py` - PyTorch doc proxy
- **Services**:
  - `app/services/content.py` - loads MDX files and exercises from `/content` directory
  - `app/services/execution.py` - executes Python code in subprocess with PyTorch
  - `app/services/validation.py` - validates exercise solutions
- **Models**: Pydantic models in `app/models/`

API endpoints:
- `GET /api/curriculum` - full curriculum structure with sections
- `GET /api/modules/{module_id}` - module content (MDX + exercises)
- `POST /api/execute` - execute Python code with PyTorch (returns stdout/stderr)
- `POST /api/validate` - validate user code against exercise tests

### Frontend (`/frontend`)
- **Entry**: `src/main.tsx` → `src/App.tsx` with React Router
- **Pages**: `src/pages/` - HomePage, CurriculumPage, ModulePage
- **Components**:
  - `src/components/layout/` - Header, Sidebar, Layout
  - `src/components/mdx/` - CodeCell, Exercise, Callout, DocRef, TensorViz
  - `src/components/ui/` - Button, Card, Badge, Spinner
- **Services**:
  - `src/services/api.ts` - API client for backend (includes `executeCode()`)
  - `src/services/pyodide.ts` - Python execution service (calls backend `/api/execute`)
- **State**: Zustand stores in `src/stores/`
  - `progressStore.ts` - persisted user progress (completed modules/exercises)
  - `uiStore.ts` - UI state

### Content (`/content`)
Each module is a directory (e.g., `01-tensors/`) containing:
- `lesson.mdx` - content with YAML frontmatter (title, prerequisites, estimatedMinutes, pytorchVersion)
- `exercises.json` - exercise definitions with starterCode, hints, validation tests, and solution

Modules are organized into 5 sections defined in `backend/app/services/content.py:SECTIONS`:
1. Fundamentos (1-4)
2. Autograd (5-7)
3. Redes Neurais (8-12)
4. Dados e Treinamento (13-15)
5. Arquiteturas Avançadas (16-20)

### Code Execution Flow
1. User writes code in Monaco Editor (CodeCell component)
2. Frontend sends code to backend via `POST /api/execute`
3. Backend executes code in subprocess with PyTorch pre-imported
4. Results (stdout/stderr) returned to frontend and displayed
5. For exercises, validation runs against predefined assert tests via `/api/validate`
6. Progress saved to localStorage via Zustand persist middleware

### Backend Code Execution Details
- Code is base64-encoded to avoid escaping issues
- Subprocess runs with `torch`, `torch.nn`, `torch.nn.functional`, and `numpy` pre-imported
- Default timeout: 30 seconds (configurable per request)
- Output captured via `redirect_stdout`/`redirect_stderr`

> **Note**: Requires Python 3.11 or 3.12 (PyTorch doesn't support 3.13 yet)
