from typing import TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse[T](BaseModel):
    code: str
    message: str
    data: T | None = None


def success_response(
    data: T | None = None,
    message: str = "ok",
) -> ApiResponse[T]:
    return ApiResponse(
        code="SUCCESS",
        message=message,
        data=data,
    )


def error_response(
    code: str,
    message: str,
) -> ApiResponse[None]:
    return ApiResponse(
        code=code,
        message=message,
        data=None,
    )
