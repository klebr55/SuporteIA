from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import BaseTool

from vectorstore import search_knowledge_base
from tools import mock_auth_api, mock_network_status

class AgentExecutorWrapper:
    def __init__(self, agent, system_prompt: str):
        self.agent = agent
        self.system_prompt = system_prompt

    def invoke(self, inputs: dict) -> dict:
        user_input = inputs.get("input", "")
        
        # Injetamos o system prompt de forma nativa e agnóstica à versão do LangGraph
        result = self.agent.invoke({
            "messages": [
                ("system", self.system_prompt),
                ("user", user_input)
            ]
        })
        
        print("\n" + "="*40)
        print("> Entering new Agent chain (LangGraph Native Tool Calling)...")
        for msg in result.get("messages", [])[1:]:
            msg.pretty_print()
        print("> Finished chain.")
        print("="*40 + "\n")
        
        return {"output": result["messages"][-1].content}

def create_tech_assistant_agent() -> AgentExecutorWrapper:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.0)
    tools: list[BaseTool] = [search_knowledge_base, mock_auth_api, mock_network_status]
    
    system_prompt = (
        "Você é um Engenheiro de Suporte T.I. Nível 1. "
        "Você deve agir de forma técnica, profissional e objetiva. "
        "Sempre consulte a base de conhecimento (ferramenta search_knowledge_base) antes de responder a perguntas sobre procedimentos. "
        "Use as ferramentas mock_auth_api e mock_network_status conforme apropriado para investigar problemas. "
        "DIRETIVA DE CLARIFICAÇÃO OBRIGATÓRIA: Se a intenção ou o problema relatado pelo usuário for ambíguo, vago ou incompleto, você deve fazer perguntas esclarecedoras antes de tentar resolver ou executar qualquer ação."
    )

    # Criação limpa, sem kwargs de modificador de estado propensos a falhas de versão
    agent = create_react_agent(llm, tools)
    return AgentExecutorWrapper(agent, system_prompt)