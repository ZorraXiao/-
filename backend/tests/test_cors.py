from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.core.cors import configure_cors

cors_app = FastAPI()

settings = Settings(
    _env_file=None,
    cors_origins=["http://localhost:5173"],
)

configure_cors(cors_app, settings)


@cors_app.get("/health")
def health():
    return {"status": "ok"}


client = TestClient(cors_app)


def test_allowed_origin():
    response = client.get(
        "/health",
        headers={"Origin": "http://localhost:5173"},
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_disallowed_origin():
    response = client.get(
        "/health",
        headers={"Origin": "https://example.com"},
    )

    assert "access-control-allow-origin" not in response.headers


def test_preflight_request():
    response = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
