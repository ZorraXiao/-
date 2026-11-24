from fastapi import APIRouter, FastAPI
from fastapi.testclient import TestClient

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.main import app


def test_api_router_exists():
    assert isinstance(api_router, APIRouter)


def test_api_version_prefix():
    router_app = FastAPI()
    router = APIRouter()

    @router.get("/example")
    def example():
        return {"status": "ok"}

    router_app.include_router(
        router,
        prefix=get_settings().api_v1_prefix,
    )

    client = TestClient(router_app)

    response = client.get("/api/v1/example")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    assert client.get("/example").status_code == 404


def test_health_without_api_prefix():
    client = TestClient(app)

    assert client.get("/health").status_code == 200
    assert client.get("/api/v1/health").status_code == 404
