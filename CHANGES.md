# Restructuring notes

- Removed `app/routers/tasks.py` and `app/schemas.py`: unrelated practice feature.
- Removed `run.py`: start using `uvicorn app.main:app --reload`.
- Moved `app/flight_schemas.py` to `app/schemas/flights.py` and updated imports.
- Removed `Base.metadata.create_all(...)` from startup to avoid unintended database DDL.
- Updated CORS to use `CORS_ORIGINS` (default Vite development origins).
- Added nonnegative delay validation and consistent airport/status normalization on PATCH.
- Added `.env.example` and usage documentation.
- Preserved existing SQLAlchemy table name, columns, types, primary key, and database configuration.
- No live Azure connection or endpoint integration test was performed.
