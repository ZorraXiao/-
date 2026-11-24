import logging

from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.cors import configure_cors
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.core.response import ApiResponse, success_response

settings = get_settings()

configure_logging(settings.log_level)

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

register_exception_handlers(app)
configure_cors(app, settings)

app.include_router(
    api_router,
    prefix=settings.api_v1_prefix,
)

logger.info(
    "Application initialized: %s | environment=%s",
    settings.app_name,
    settings.app_env,
)


@app.get("/health", response_model=ApiResponse[dict[str, str]])
def health_check():
    return success_response(data={"status": "ok"})
