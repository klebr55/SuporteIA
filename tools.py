from langchain_core.tools import tool

@tool
def mock_auth_api(user_id: str) -> str:
    """Valida as credenciais de um usuario, retornando o status de acesso."""
    valid_users = {"U123", "U456", "U789"}
    if user_id in valid_users:
        return f"Acesso permitido para o usuario {user_id}."
    return f"Acesso negado para o usuario {user_id}. Credenciais invalidas."

@tool
def mock_network_status(router_id: str) -> str:
    """Verifica a disponibilidade de rede para um dado identificador de roteador ou local."""
    offline_routers = {"R-BLOCO-B", "R-BIBLIOTECA"}
    if router_id in offline_routers:
        return f"O roteador {router_id} esta atualmente OFFLINE."
    return f"O roteador {router_id} esta ONLINE e operando normalmente."
