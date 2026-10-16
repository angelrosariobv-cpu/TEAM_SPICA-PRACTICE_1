from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, get_db
from app.routers import flights, tasks

# Esto crea automáticamente las tablas en Azure si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="My Web App API", version="1.0.0")

@app.get("/")
def raiz():
    return {"mensaje": "¡Conectado exitosamente a la base de datos practice1 en Azure!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000"],  # your frontend's URL
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(flights.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
