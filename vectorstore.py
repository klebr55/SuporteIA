from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from langchain.tools import tool

def get_mock_knowledge_base() -> dict:
    return {
        "password_reset": "Para redefinir a senha, acesse o portal de autoatendimento em portal.empresa.com/reset, informe o CPF e siga as instruções enviadas para o e-mail alternativo cadastrado.",
        "wifi_connection": "A rede Wi-Fi corporativa 'Corp-WiFi' exige autenticação WPA2-Enterprise. O usuário deve usar seu login de rede e a mesma senha do computador.",
        "academic_portal": "O portal acadêmico está disponível em academico.instituicao.edu.br. O acesso requer a matrícula com 8 dígitos e a senha configurada na matrícula."
    }

def initialize_vectorstore() -> FAISS:
    knowledge_data = get_mock_knowledge_base()
    documents = [Document(page_content=content, metadata={"topic": topic}) for topic, content in knowledge_data.items()]
    embeddings = OpenAIEmbeddings()
    return FAISS.from_documents(documents, embeddings)

vectorstore_instance = initialize_vectorstore()

@tool
def search_knowledge_base(query: str) -> str:
    """Busca informacoes na base de conhecimento (manuais, tutoriais e politicas de TI)."""
    docs = vectorstore_instance.similarity_search(query, k=2)
    return "\n\n".join([doc.page_content for doc in docs])
