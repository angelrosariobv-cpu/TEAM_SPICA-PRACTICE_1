import os

from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from pathlib import Path

# Ubicación del archivo backend/.env
env_path = Path(__file__).resolve().parent.parent / ".env"

# Carga las variables del archivo .env
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

# Solo crea el motor si existe una URL configurada
engine = (
    create_engine(DATABASE_URL, pool_pre_ping=True)
    if DATABASE_URL
    else None
)

# Configura las sesiones únicamente si existe el motor
SessionLocal = (
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
    if engine is not None
    else None
)


class Base(DeclarativeBase):
    pass


def get_db():

    if SessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail="Database service is not configured"
        )

    try:
        with SessionLocal() as db:

            # Comprobar conexión con PostgreSQL
            from sqlalchemy import text

            db.execute(text("SELECT 1"))

            # Entregar sesión al endpoint
            yield db

    except SQLAlchemyError as e:
        print(f"ERROR DE POSTGRESQL: {e}")

        raise HTTPException(
            status_code=503,
            detail="Database service is temporarily unavailable"
        ) from e