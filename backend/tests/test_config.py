import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_default_settings(monkeypatch):
    for field in Settings.model_fields:
        monkeypatch.delenv(field.upper(), raising=False)

    settings = Settings(_env_file=None)

    assert settings.app_env == "development"
    assert settings.api_v1_prefix == "/api/v1"
    assert settings.port == 8000
    assert settings.debug is False


def test_environment_override(monkeypatch):
    monkeypatch.setenv("APP_ENV", "testing")
    monkeypatch.setenv("PORT", "9000")

    settings = Settings(_env_file=None)

    assert settings.app_env == "testing"
    assert settings.port == 9000


def test_invalid_environment(monkeypatch):
    monkeypatch.setenv("APP_ENV", "invalid")

    with pytest.raises(ValidationError):
        Settings(_env_file=None)
