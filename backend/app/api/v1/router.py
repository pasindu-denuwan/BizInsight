from fastapi import APIRouter, Depends

from app.core.security import AuthUser, get_current_user

api_router = APIRouter()


@api_router.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@api_router.get("/me", tags=["auth"])
def me(user: AuthUser = Depends(get_current_user)) -> dict[str, str | None]:
    return {"id": user.id, "email": user.email}
