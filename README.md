# TechAssistant AI

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C1C1C?style=for-the-badge&logo=langchain&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

## Visão Executiva

O **TechAssistant AI** é um agente autônomo de Nível 1 concebido para o suporte técnico corporativo de T.I. Combinando processamento de linguagem natural avançado e capacidades de tomada de decisão autônoma, o sistema não se limita a responder perguntas; ele diagnostica proativamente, executa testes de simulação de rede e consulta bases de conhecimento institucionais. O projeto visa reduzir drasticamente o tempo médio de resolução (MTTR) de chamados primários através da automação inteligente, escalando a eficiência das equipes de suporte.

## Arquitetura do Sistema (O Core)

O projeto é estruturado em três camadas principais, garantindo máxima escalabilidade, segurança e uma experiência imersiva de alto nível:

### 1. Backend: Django
A espinha dorsal da aplicação é construída sobre o robusto framework Django.
- **Roteamento Seguro:** Gerenciamento centralizado de endpoints da API de conversação.
- **Sessão Zero-Trust:** O acesso à plataforma é estritamente controlado por meio de um sistema nativo de autenticação. Apenas requisições devidamente autenticadas e validadas com proteção `X-CSRFToken` são processadas, blindando o agente contra acessos não autorizados.

### 2. Motor Cognitivo: LangGraph + OpenAI + FAISS
O cérebro do agente opera sob o padrão arquitetural ReAct (Reasoning and Acting).
- **LangGraph:** Orquestra o fluxo de pensamento e execução, permitindo loops autônomos onde o agente decide as ações e analisa os retornos.
- **RAG Vetorial (FAISS):** Armazenamento em memória de documentos indexados (manuais, tutoriais e procedimentos internos).
- **OpenAI (GPT-4o-mini):** Processamento avançado do LLM, ajustado com `temperature=0` para respostas determinísticas e técnicas.

### 3. Frontend Render: Web Imersiva
A interface do usuário quebra os paradigmas tradicionais de sistemas de suporte.
- **HTML/Vanilla JS:** Estrutura semântica leve com uma arquitetura assíncrona orientada a requisições `fetch()`.
- **GSAP & Lenis:** Proporcionam animações avançadas de UI e um *Smooth Scroll* fluido e performático.
- **WebGL & Three.js:** O coração visual da página inicial apresenta um modelo robótico 3D de alta fidelidade visual. Conta com *Physically Based Rendering* (PBR), materiais de alto brilho, *Image-Based Lighting* (IBL) calculado via Environment Maps, resolução High-DPI nativa e sistema avançado de *Mouse Tracking* para engajamento em tempo real.

## Fluxo de Tool Calling

O grande diferencial do TechAssistant é a capacidade de invocar ferramentas ("Tools") nativas durante sua cadeia de raciocínio lógico (ReAct). O agente toma decisões baseadas no contexto da conversa:

- **`search_knowledge_base`**: Quando o usuário relata um problema genérico (ex: configuração de e-mail), o agente decide acionar o banco vetorial FAISS para recuperar os melhores procedimentos arquivados, retornando tutoriais embasados.
- **`mock_auth_api` e ferramentas de rede**: Diante de relatos como "não consigo conectar à rede wifi" ou "login inválido no sistema acadêmico", o agente suspende o fornecimento direto de texto, decide utilizar simuladores de API passando identificadores lógicos (como o R.A. ou localização), recebe a "telemetria" do simulador, e formula uma resposta técnica com o diagnóstico exato sem intervenção humana.

## Instalação Local

Para executar o TechAssistant AI em ambiente de desenvolvimento local, siga os passos abaixo:

1. **Clone o Repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd SuporteIA
   ```

2. **Configure o Ambiente Virtual:**
   ```bash
   python -m venv venv
   # No Windows:
   venv\Scripts\activate
   # No Linux/Mac:
   source venv/bin/activate
   ```

3. **Instale as Dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure as Variáveis de Ambiente:**
   Certifique-se de configurar a sua chave da OpenAI no ambiente:
   ```bash
   # No Windows:
   $env:OPENAI_API_KEY="sk-..."
   # No Linux/Mac:
   export OPENAI_API_KEY="sk-..."
   ```

5. **Aplique as Migrações do Banco de Dados:**
   ```bash
   python manage.py migrate
   ```

6. **Execute o Servidor de Desenvolvimento:**
   ```bash
   python manage.py runserver
   ```
   Acesse `http://localhost:8000` em seu navegador. (Obs: Para criar um usuário, utilize o script `seed_user.py` disponível na raiz do projeto).

## Autoria e Agradecimentos

- **Autor:** Kleber Vinícius — Software Engineer.  
Projeto desenvolvido como parte da grade de graduação em Ciência da Computação pela UNIC.

- **Agradecimentos Especiais:**  
Um profundo e sincero agradecimento ao professor e mentor **Éder Lemes**, pela orientação técnica contínua, valiosos conselhos de arquitetura de software e incentivo incansável ao longo de toda a jornada deste projeto acadêmico.
