from fastapi import FastAPI

try:
    from backend.api.routes import health, investigation
except ImportError:
    from api.routes import health, investigation

app = FastAPI(title="TrustLayer Backend")

app.include_router(health.router)
app.include_router(investigation.router)
