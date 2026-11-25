from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.exceptions import (
    AppError,
    register_exception_handlers,
)

exception_app = FastAPI(debug=False)

register_exception_handlers(exception_app)


@exception_app.get("/business-error")
def business_error():
    raise AppError(
        code="PRODUCT_NOT_FOUND",
        status_code=404,
        message="Product not found",
    )


@exception_app.get("/validation")
def validation(quantity: int):
    return {"quantity": quantity}


@exception_app.get("/internal-error")
def internal_error():
    raise RuntimeError("Sensitive internal information")


client = TestClient(
    exception_app,
    raise_server_exceptions=False,
)


def test_business_error():
    response = client.get("/business-error")

    assert response.status_code == 404
    assert response.json() == {
        "code": "PRODUCT_NOT_FOUND",
        "message": "Product not found",
        "data": None,
    }


def test_validation_error():
    response = client.get(
        "/validation",
        params={"quantity": "abc"},
    )

    assert response.status_code == 422
    assert response.json()["code"] == "VALIDATION_ERROR"


def test_http_error():
    response = client.get("/nonexistent")

    assert response.status_code == 404
    assert response.json()["code"] == "NOT_FOUND"


def test_internal_error():
    response = client.get("/internal-error")

    assert response.status_code == 500
    assert response.json() == {
        "code": "INTERNAL_ERROR",
        "message": "Internal server error",
        "data": None,
    }

    assert "Sensitive internal information" not in response.text
