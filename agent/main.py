import os
from fastapi import FastAPI
from dotenv import load_dotenv
import httpx
from memory import carregar, salvar

load_dotenv()

WAHA_URL = os.getenv("WAHA_URL")
WAHA_API_KEY = os.getenv("WAHA_API_KEY")
SESSAO = "Barber-Flow"

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


# O WAHA manda o remetente como LID (ex.: 274040472215791@lid), que nao e
# o telefone. Esta rota do WAHA traduz o LID para o numero.
async def lid_para_telefone(lid: str) -> str | None:
    async with httpx.AsyncClient() as client:
        resposta = await client.get(
            f"{WAHA_URL}/api/{SESSAO}/lids/{lid}",
            headers={"X-Api-Key": WAHA_API_KEY},
        )

    if resposta.status_code != 200:
        print(f"lids/{lid} respondeu {resposta.status_code}: {resposta.text}")
        return None

    dados = resposta.json()

    # O campo vem como "5561999998888@c.us"; so os digitos interessam.
    pn = dados.get("pn") or ""
    return pn.split("@")[0] or None


# Manda texto para um chat. O chat_id e o mesmo "from" que chegou no
# webhook — nao precisa traduzir nada para responder.
async def enviar_mensagem(chat_id: str, texto: str) -> None:
    async with httpx.AsyncClient() as client:
        resposta = await client.post(
            f"{WAHA_URL}/api/sendText",
            headers={"X-Api-Key": WAHA_API_KEY},
            json={"session": SESSAO, "chatId": chat_id, "text": texto},
        )

    if resposta.status_code >= 400:
        print(f"sendText para {chat_id} falhou {resposta.status_code}: {resposta.text}")


@app.post("/webhook/whatsapp")
async def webhook(payload: dict):
    mensagem = payload.get("payload", {})

    # Mensagem que NOS mandamos tambem dispara o webhook. Sem este filtro,
    # a resposta do bot chega aqui, o bot responde a propria resposta, e
    # vira loop.
    if mensagem.get("fromMe"):
        return {"ok": True}

    remetente = mensagem.get("from", "")
    texto = mensagem.get("body", "")

    telefone = remetente.split("@")[0]

    if remetente.endswith("@lid"):
        telefone = await lid_para_telefone(remetente)

    print(f"de={remetente} telefone={telefone} texto={texto!r}")

    if telefone is None:
        return {"ok": True}

    # Memoria: le a conversa, acrescenta a troca de agora, grava de volta.
    mensagens = carregar(telefone)
    mensagens.append({"role": "user", "content": texto})

    resposta = f"Você disse: {texto}"   # aqui entra o modelo depois

    mensagens.append({"role": "assistant", "content": resposta})
    salvar(telefone, mensagens)

    await enviar_mensagem(remetente, resposta)

    return {"ok": True}
