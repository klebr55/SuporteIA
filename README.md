# 🤖 TechAssistant AI - Suporte Nível 1

![Python](https://img.shields.io/badge/Python-3.14-blue?style=for-the-badge&logo=python)
![Django](https://img.shields.io/badge/Django-6.0-green?style=for-the-badge&logo=django)
![LangChain](https://img.shields.io/badge/LangChain-Integration-orange?style=for-the-badge&logo=langchain)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

## 📝 Sobre o Projeto
O **TechAssistant AI** é uma solução de suporte técnico de primeiro nível baseada em agentes autônomos. Ele utiliza **RAG (Retrieval-Augmented Generation)** com vetores FAISS para consultar bases de conhecimento e **Tool Calling Nativo (LangGraph)** para diagnosticar problemas de rede e autenticação de usuários, reduzindo a carga cognitiva da equipe humana.

---

## 🚀 Arquitetura
O sistema foi desenhado para ser determinístico e modular:

* **Core:** Agente ReAct (`LangGraph`) com `gpt-4o-mini`.
* **Backend:** `Django` para orquestração de rotas e segurança.
* **Inteligência:** `FAISS` para busca vetorial e `OpenAI Embeddings`.
* **Frontend:** Interface minimalista em `Tailwind CSS`.

---

## 🛠 Tecnologias Utilizadas
- **Backend:** Django Framework (Monolito Python).
- **IA/LLM:** OpenAI API (GPT-4o-mini) + LangGraph.
- **Vector Store:** FAISS (Facebook AI Similarity Search).
- **Frontend:** HTML5 + Tailwind CSS (via CDN).

---

## 📋 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/tech-assistant.git
   cd tech-assistant

2. Configure as variáveis de ambiente:

    # Windows (PowerShell)
    $env:OPENAI_API_KEY="sk-sua-chave-aqui"

3. Inicie o servidor:

    python manage.py runserver

## 📊 Métricas de Qualidade
O agente foi submetido a testes quantitativos (latência e taxa de sucesso):

| Cenário | Ferramenta Acionada | Status | Latência |
|---------|---------------------|--------|----------|
| Validação de Usuário | mock_auth_api | ✅ Sucesso | 0.4s |
| Status de Rede | mock_network_status | ✅ Sucesso | 0.5s |
| Consulta de Manuais | search_knowledge_base | ✅ Sucesso | 0.8s |

## 👨‍💻 Equipe
- Kleber Vinícius (Tech Lead): Arquitetura Backend & Agente.
- Mafe: UX/UI & Dashboard Administrativo.
- Gabriel: Arquitetura Visual & Diagramação.
- Diogo: QA & Testes Quantitativos.

## 📄 Licença
Este projeto está sob a licença MIT.

