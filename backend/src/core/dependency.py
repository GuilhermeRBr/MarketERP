from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from src.core.config import settings
from src.user.models.user_model import User
from src.data.database import get_db

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=401, detail="Invalid token"
            )
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=401, detail="Invalid token"
            )
        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_owner(current_user: User = Depends(get_current_user)):
    """Dependency que garante que apenas owners acessem a rota."""
    if current_user.role != "OWNER":
        raise HTTPException(
            status_code=403,
            detail="Access denied. Owner role required.",
        )
    return current_user
