from app.core.response import error_response, success_response


def test_success_response():
    response = success_response(data={"id": "1"})

    assert response.model_dump() == {
        "code": "SUCCESS",
        "message": "ok",
        "data": {"id": "1"},
    }


def test_success_response_without_data():
    response = success_response()

    assert response.data is None
    assert response.code == "SUCCESS"


def test_error_response():
    response = error_response(
        code="NOT_FOUND",
        message="Resource not found",
    )

    assert response.model_dump() == {
        "code": "NOT_FOUND",
        "message": "Resource not found",
        "data": None,
    }
