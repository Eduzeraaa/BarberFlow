import os
from datetime import datetime
from zoneinfo import ZoneInfo

import httpx
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_groq import ChatGroq

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")
HEADERS = {"X-Internal-Key": os.getenv("INTERNAL_API_KEY")}

modelo = ChatGroq(
    model="openai/gpt-oss-120b",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
)


# Chamadas ao backend (as rotas /interno/*)


async def get_backend(rota: str, params: dict | None = None) -> str:
    async with httpx.AsyncClient() as client:
        resposta = await client.get(f"{BACKEND_URL}{rota}", headers=HEADERS, params=params)
    return resposta.text


async def post_backend(rota: str, body: dict) -> str:
    async with httpx.AsyncClient() as client:
        resposta = await client.post(f"{BACKEND_URL}{rota}", headers=HEADERS, json=body)
    return resposta.text


# Tools
#
# Ficam dentro de uma funcao que recebe o telefone, para que agendar,
# cancelar e meus_agendamentos usem o numero do remetente sem ele ser
# argumento. Se fosse argumento, o modelo poderia inventar um numero.


def criar_tools(telefone: str) -> list:

    @tool
    async def listar_servicos() -> str:
        """Lista os serviços oferecidos pela barbearia."""
        return await get_backend("/interno/servicos")

    @tool
    async def listar_barbeiros() -> str:
        """Lista os barbeiros que trabalham na barbearia."""
        return await get_backend("/interno/barbeiros")

    @tool
    async def listar_horarios() -> str:
        """Lista a grade de horários em que a barbearia atende."""
        return await get_backend("/interno/horarios")

    @tool
    async def horarios_ocupados(barber: str, date: str) -> str:
        """Lista os horários JÁ OCUPADOS de um barbeiro numa data (AAAA-MM-DD).
        Os livres são os da grade que não aparecem aqui."""
        return await get_backend("/interno/horariosOcupados", {"barber": barber, "date": date})

    @tool
    async def meus_agendamentos() -> str:
        """Lista os agendamentos ativos do cliente, com o id de cada um."""
        return await get_backend("/interno/meusAgendamentos", {"phone": telefone})

    @tool
    async def agendar(service: str, barber: str, date: str, time: str) -> str:
        """Marca um horário. Só chame com os quatro dados confirmados pelo cliente.
        date no formato AAAA-MM-DD, time no formato HH:MM.
        O backend valida e devolve a mensagem de sucesso ou o motivo da recusa."""
        return await post_backend("/interno/agendamento", {
            "phone": telefone,
            "service": service,
            "barber": barber,
            "date": date,
            "time": time,
        })

    @tool
    async def cancelar(id: str) -> str:
        """Cancela um agendamento pelo id. Descubra o id com meus_agendamentos
        e confirme com o cliente antes."""
        return await post_backend("/interno/cancelarAgendamento", {"phone": telefone, "id": id})

    return [listar_servicos, listar_barbeiros, listar_horarios, horarios_ocupados,
            meus_agendamentos, agendar, cancelar]


def system_prompt() -> str:
    hoje = datetime.now(ZoneInfo("America/Sao_Paulo"))

    return f"""Você é o atendente virtual da barbearia Barber Flow, falando pelo WhatsApp.

Hoje é {hoje.strftime("%A, %d/%m/%Y")} (no formato AAAA-MM-DD: {hoje.strftime("%Y-%m-%d")}).
Use essa data para entender "amanhã", "quinta", "semana que vem".

Você consegue: agendar, cancelar, mostrar os agendamentos do cliente, e informar
serviços, barbeiros e horários. Nada além disso.

Regras:
- Responda curto, em português do Brasil, como numa conversa de WhatsApp.
- Para agendar precisa de: serviço, barbeiro, data e horário. Pergunte o que faltar. Não invente.
- Antes de oferecer horários, consulte a grade e os ocupados do barbeiro naquele dia.
- Use os nomes exatos que as tools devolvem.
- Só chame agendar depois de o cliente confirmar os quatro dados.
- Se uma tool devolver erro, explique em linguagem simples e ofereça alternativa.
- Nunca peça o telefone do cliente: você já sabe quem ele é."""


# Recebe o historico (ja com a mensagem nova no fim) e devolve o texto da
# resposta. O create_agent cuida do loop: chama o modelo, roda as tools que
# ele pedir, chama de novo, ate ele responder com texto.
async def responder(telefone: str, historico: list) -> str:

    agente = create_agent(
        model=modelo,
        tools=criar_tools(telefone),
        system_prompt=system_prompt(),
    )

    resultado = await agente.ainvoke({"messages": historico})

    return resultado["messages"][-1].content
