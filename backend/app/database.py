import os

from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Carga las variables del archivo .env
load_dotenv()

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


# Dependencia para inyectar la sesión en los endpoints
def get_db():
    if SessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail="Database service is not configured"
        )

    try:
        with SessionLocal() as db:
            # Comprueba la conexión antes de entregar la sesión
            from sqlalchemy import text

            db.execute(text("SELECT 1"))
            yield db

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database service is temporarily unavailable"
        )
