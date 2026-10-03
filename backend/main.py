from fastapi import FastAPI

try:
    from backend.api.routes import health
except ImportError:
    from api.routes import health

app = FastAPI(title="TrustLayer Backend")

app.include_router(health.router)
