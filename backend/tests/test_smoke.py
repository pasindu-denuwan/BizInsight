import time

import jwt
from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.main import create_app

SECRET = "test-secret-at-least-32-bytes-long-xxxx"


def _client() -> TestClient:
    app = create_app()
    app.dependency_overrides[get_settings] = lambda: Settings(supabase_jwt_secret=SECRET)
    return TestClient(app)


def _token(**over) -> str:
    claims = {"sub": "u-1", "email": "a@b.co", "aud": "authenticated", "exp": int(time.time()) + 60}
    claims.update(over)
    return jwt.encode(claims, SECRET, algorithm="HS256")


def test_health_is_public():
    r = _client().get("/api/v1/health")
    assert r.status_code == 200 and r.json() == {"status": "ok"}


def test_me_requires_token():
    r = _client().get("/api/v1/me")
    assert r.status_code == 401
    assert r.json()["error"]["code"] == "http_401"


def test_me_accepts_valid_token():
    r = _client().get("/api/v1/me", headers={"Authorization": f"Bearer {_token()}"})
    assert r.status_code == 200 and r.json()["id"] == "u-1"


def test_me_rejects_expired_and_wrong_audience():
    c = _client()
    for tok in (_token(exp=int(time.time()) - 5), _token(aud="other")):
        assert c.get("/api/v1/me", headers={"Authorization": f"Bearer {tok}"}).status_code == 401
