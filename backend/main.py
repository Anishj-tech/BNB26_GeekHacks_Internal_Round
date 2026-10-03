from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.api.routes import health, investigation
except ImportError:
    from api.routes import health, investigation

app = FastAPI(title="TrustLayer Backend")

# Enable Cross-Origin Resource Sharing for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root routes (backward-compatible with existing test suite)
app.include_router(health.router)
app.include_router(investigation.router)

# Versioned API routes (canonical frontend contract)
app.include_router(health.router, prefix="/api/v1")
app.include_router(investigation.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api")
app.include_router(investigation.router, prefix="/api")
