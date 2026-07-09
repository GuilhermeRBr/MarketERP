from fastapi import APIRouter, Depends, status, Path
from sqlalchemy.orm import Session
from src.core.dependency import get_current_user, require_owner
from src.data.database import get_db
from src.user.models.user_model import User
from src.user.schemas.user_schema import (
    UserCreate,
    UserActive,
)
from src.user.services.user_service import UserService
from src.common.messages.common_messages import CommonMessages

router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/register",
    summary="Create a new user",
    description="Create a new user with the provided details. Only owners can create new users.",
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {
            "description": "Created",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "email": "email@example.com",
                        "role": "OPERATOR",
                        "active": True,
                    }
                }
            },
        },
        400: {"description": CommonMessages.BAD_REQUEST},
        401: {"description": CommonMessages.UNAUTHORIZED},
        403: {"description": CommonMessages.FORBIDDEN},
        409: {"description": CommonMessages.CONFLICT},
        422: {"description": CommonMessages.UNPROCESSABLE_ENTITY},
    },
)
def create_user(
    data: UserCreate,
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    new_user = UserService.create_new_user(db, data, current_user)
    return new_user


@router.get(
    "/",
    summary="List all users",
    description="List all users. Only owners can access this endpoint.",
    status_code=status.HTTP_200_OK,
    responses={
        200: {
            "description": "OK",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 1,
                            "email": "email@example.com",
                            "role": "OPERATOR",
                            "active": True,
                        },
                    ]
                }
            },
        },
        400: {"description": CommonMessages.BAD_REQUEST},
        401: {"description": CommonMessages.UNAUTHORIZED},
        403: {"description": CommonMessages.FORBIDDEN},
        404: {"description": CommonMessages.NOT_FOUND},
    },
)
def list_users(
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    user_list = UserService.get_users(db, current_user)
    return user_list


@router.get(
    "/{id}",
    summary="Get a user by ID",
    description="Retrieve a user by its unique ID. Only owners can retrieve users.",
    status_code=status.HTTP_200_OK,
    responses={
        200: {
            "description": "OK",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "email": "email@example.com",
                        "role": "operator",
                        "active": True,
                    }
                }
            },
        },
        400: {"description": CommonMessages.BAD_REQUEST},
        401: {"description": CommonMessages.UNAUTHORIZED},
        403: {"description": CommonMessages.FORBIDDEN},
        404: {"description": CommonMessages.NOT_FOUND},
        422: {"description": CommonMessages.UNPROCESSABLE_ENTITY},
    },
)
def get_by_id(
    id: int = Path(..., ge=1, le=2_147_483_647),
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    user = UserService.get_user_by_id(db, id, current_user)
    return user


@router.patch(
    "/{id}",
    summary="Update a user",
    description="Update an existing user with new details. Only owners can update users.",
    status_code=status.HTTP_200_OK,
    responses={
        200: {
            "description": "OK",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "email": "email@example.com",
                        "role": "operator",
                        "active": True,
                    }
                }
            },
        },
        400: {"description": CommonMessages.BAD_REQUEST},
        401: {"description": CommonMessages.UNAUTHORIZED},
        403: {"description": CommonMessages.FORBIDDEN},
        404: {"description": CommonMessages.NOT_FOUND},
        422: {"description": CommonMessages.UNPROCESSABLE_ENTITY},
    },
)
def patch_user(
    id: int = Path(..., ge=1, le=2_147_483_647),
    data: UserActive = ...,
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    updated_user = UserService.activate_user(
        db, id, data, current_user
    )
    return updated_user
