import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("DB_CONN_STRING"))
db = client.barbearia
conversas = db.conversas

MAXIMO_DE_MENSAGENS = 20


def carregar(telefone: str) -> list:
    documento = conversas.find_one({"telefone": telefone})

    if documento is None:
        return []

    return documento.get("mensagens", [])


def salvar(telefone: str, mensagens: list) -> None:
    conversas.update_one(
        {"telefone": telefone},
        {"$set": {"mensagens": mensagens[-MAXIMO_DE_MENSAGENS:]}},
        upsert=True,
    )
