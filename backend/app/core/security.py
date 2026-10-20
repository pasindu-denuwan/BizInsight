"""Supabase JWT verification.

Identity only: returns the Supabase user id (`sub`). Roles and workspace access are
NEVER read from token claims; they are looked up in MySQL (Phase 4).
"""
from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import Settings, get_settings

_bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class AuthUser:
    id: str
    email: str | None


def _unauthorized(msg: str) -> HTTPException:
    return HTTPException(status.HTTP_401_UNAUTHORIZED, msg, headers={"WWW-Authenticate": "Bearer"})


def decode_token(token: str, settings: Settings) -> dict:
    try:
        if settings.supabase_jwt_secret:  # legacy HS256
            return jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience=settings.supabase_jwt_audience,
            )
        if not settings.supabase_url:
            raise _unauthorized("Auth is not configured")
        jwks = jwt.PyJWKClient(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")
        key = jwks.get_signing_key_from_jwt(token).key
        return jwt.decode(
            token,
            key,
            algorithms=["ES256", "RS256"],
            audience=settings.supabase_jwt_audience,
            issuer=f"{settings.supabase_url}/auth/v1",
        )
    except HTTPException:
        raise
    except jwt.PyJWTError:
        raise _unauthorized("Invalid or expired token") from None


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    settings: Settings = Depends(get_settings),
) -> AuthUser:
    if creds is None:
        raise _unauthorized("Missing bearer token")
    claims = decode_token(creds.credentials, settings)
    sub = claims.get("sub")
    if not sub:
        raise _unauthorized("Token has no subject")
    return AuthUser(id=sub, email=claims.get("email"))
