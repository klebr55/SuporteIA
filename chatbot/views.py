import json
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from agent import create_tech_assistant_agent

try:
    agent_executor = create_tech_assistant_agent()
except Exception as e:
    agent_executor = None
    print(f"Aviso: Não foi possível inicializar o agente (verifique sua OPENAI_API_KEY). Erro: {e}")

def chat_page(request: HttpRequest) -> HttpResponse:
    return render(request, 'chat.html')

@csrf_exempt
def chat_api(request: HttpRequest) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            if not user_message:
                return JsonResponse({'reply': 'Mensagem inválida.'}, status=400)
            
            if not agent_executor:
                return JsonResponse({'reply': 'Erro: Agente não inicializado. Configure a OPENAI_API_KEY.'}, status=500)

            response = agent_executor.invoke({"input": user_message})
            return JsonResponse({'reply': response.get('output')})
        except Exception as e:
            return JsonResponse({'reply': f'Erro no servidor: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Método não permitido.'}, status=405)

def dashboard_view(request: HttpRequest) -> HttpResponse:
    return render(request, 'dashboard.html')

def index_view(request: HttpRequest) -> HttpResponse:
    return render(request, 'index.html')

def api_login(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username', '')
            password = data.get('password', '')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"success": True})
            else:
                return JsonResponse({"success": False}, status=401)
        except Exception:
            return JsonResponse({"success": False}, status=401)
    return JsonResponse({"error": "Method not allowed"}, status=405)