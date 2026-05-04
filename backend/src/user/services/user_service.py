from sqlalchemy.orm import Session
from src.core.security import hash_password
from src.user.models.user_model import User
from src.user.schemas.user_schema import (
    UserCreate,
    UserResponse,
    UserActive,
)
from fastapi import HTTPException
from src.user.messages.user_message import USER_MESSAGES


class UserService:
    @staticmethod
    def create_new_user(
        db: Session, data: UserCreate, current_user: User
    ):
        if current_user.role != "OWNER":
            raise HTTPException(
                status_code=401,
                detail=USER_MESSAGES.UNAUTHORIZED,
            )

        if db.query(User).filter(User.email == data.email).first():
            raise HTTPException(
                status_code=409,
                detail=USER_MESSAGES.EMAIL_ALREADY_EXISTS,
            )

        if data.password != data.confirm_password:
            raise HTTPException(
                status_code=422,
                detail=USER_MESSAGES.PASSWORDS_NOT_MATCH,
            )

        password_hash = hash_password(data.password).decode("utf-8")
        new_user = User(
            email=data.email, password=password_hash, role=data.role
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return UserResponse.model_validate(new_user)

    @staticmethod
    def get_users(db: Session, current_user: User):
        if current_user.role != "OWNER":
            raise HTTPException(
                status_code=401,
                detail=USER_MESSAGES.UNAUTHORIZED,
            )

        users = db.query(User).all()

        if not users:
            raise HTTPException(
                status_code=404,
                detail=USER_MESSAGES.NO_USERS_FOUND,
            )

        return [UserResponse.model_validate(user) for user in users]

    @staticmethod
    def get_user_by_id(db: Session, user_id: int, current_user: User):
        if current_user.role != "OWNER":
            raise HTTPException(
                status_code=401,
                detail=USER_MESSAGES.UNAUTHORIZED,
            )

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail=USER_MESSAGES.USER_NOT_FOUND,
            )

        return UserResponse.model_validate(user)

    @staticmethod
    def activate_user(
        db: Session,
        user_id: int,
        data: UserActive,
        current_user: User,
    ):
        if current_user.role != "OWNER":
            raise HTTPException(
                status_code=401,
                detail=USER_MESSAGES.UNAUTHORIZED,
            )

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail=USER_MESSAGES.USER_NOT_FOUND,
            )

        user.active = data.active

        db.commit()
        db.refresh(user)
        return UserResponse.model_validate(user)
