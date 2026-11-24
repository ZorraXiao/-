from fastapi import FastAPI

app = FastAPI(
    title="CampusTrading API",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {
        "code": "SUCCESS",
        "message": "ok",
        "data": {"status": "ok"},
    }
