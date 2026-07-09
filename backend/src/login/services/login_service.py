from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.user.models.user_model import User
from src.login.schemas.login_schema import UserLogin
from src.login.schemas.login_schema import LoginResponse
from src.login.messages.login_messages import LOGIN_MESSAGES
from src.core.security import (
    create_access_token,
    create_refresh_token,
)
from src.login.services.refresh_token_service import (
    RefreshTokenService,
)
import bcrypt


class LoginService:
    @staticmethod
    def login_user(db: Session, data: UserLogin):
        user = db.query(User).filter(User.email == data.email).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail=LOGIN_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
            )

        if not bcrypt.checkpw(
            data.password.encode("utf-8"),
            user.password.encode("utf-8"),
        ):
            raise HTTPException(
                status_code=401,
                detail=LOGIN_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
            )

        if not user.active:
            raise HTTPException(
                status_code=403,
                detail=LOGIN_MESSAGES.USER_NOT_ACTIVE,
            )

        access_token = create_access_token(
            data={"sub": user.id, "email": user.email, "owner": user.role}
        )
        refresh_token = create_refresh_token(
            data={"sub": user.id, "email": user.email, "owner": user.role}
        )

        RefreshTokenService.save_refresh_token(
            refresh_token, db, user.id
        )

        return LoginResponse.model_validate(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        )
