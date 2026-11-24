import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from app.core.response import error_response

logger = logging.getLogger(__name__)


class AppError(Exception):
    def __init__(
        self,
        code: str,
        status_code: int,
        message: str,
    ):
        super().__init__(message)
        self.code = code
        self.status_code = status_code
        self.message = message


async def app_error_handler(
    request: Request,
    exc: AppError,
):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(
            code=exc.code,
            message=exc.message,
        ).model_dump(),
    )


async def validation_error_handler(
    request: Request,
    exc: RequestValidationError,
):
    return JSONResponse(
        status_code=422,
        content={
            "code": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "data": {
                "errors": [
                    {
                        "loc": list(error["loc"]),
                        "type": error["type"],
                    }
                    for error in exc.errors()
                ]
            },
        },
    )


async def http_error_handler(
    request: Request,
    exc: HTTPException,
):
    error_codes = {
        400: "BAD_REQUEST",
        401: "UNAUTHENTICATED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        409: "CONFLICT",
        422: "VALIDATION_ERROR",
        429: "TOO_MANY_REQUESTS",
        500: "INTERNAL_ERROR",
    }

    code = error_codes.get(
        exc.status_code,
        "HTTP_ERROR",
    )

    message = "Internal server error" if exc.status_code >= 500 else str(exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        headers=exc.headers,
        content=error_response(
            code=code,
            message=message,
        ).model_dump(),
    )


async def internal_error_handler(
    request: Request,
    exc: Exception,
):
    logger.error(
        "Unhandled application error: %s",
        type(exc).__name__,
    )

    return JSONResponse(
        status_code=500,
        content=error_response(
            code="INTERNAL_ERROR",
            message="Internal server error",
        ).model_dump(),
    )


def register_exception_handlers(app: FastAPI):
    app.add_exception_handler(
        AppError,
        app_error_handler,
    )
    app.add_exception_handler(
        RequestValidationError,
        validation_error_handler,
    )
    app.add_exception_handler(
        HTTPException,
        http_error_handler,
    )
    app.add_exception_handler(
        Exception,
        internal_error_handler,
    )
