from app.core import logging as app_logging


def test_logging_configuration(monkeypatch):
    configs = []

    monkeypatch.setattr(
        app_logging,
        "dictConfig",
        configs.append,
    )

    app_logging.configure_logging("WARNING")

    config = configs[0]

    assert config["version"] == 1
    assert config["root"]["level"] == "WARNING"
    assert config["root"]["handlers"] == ["console"]
    assert config["disable_existing_loggers"] is False
