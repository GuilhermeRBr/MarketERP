from src.user.schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserActive,
)
from src.user.services.user_service import UserService
from fastapi import HTTPException
import pytest


# Test create user
def test_create_user_success(db):
    data = UserCreate(
        email="email@example.com",
        password="Test@123",
        confirm_password="Test@123",
        role="operator",
        active=True,
    )

    user = UserService.create_new_user(db, data)

    assert user.email == data.email
    assert user.role == data.role
    assert user.active


def test_create_user_email_already_exists(db):
    data = UserCreate(
        email="email@example.com",
        password="Test@123",
        confirm_password="Test@123",
        role="operator",
        active=True,
    )

    UserService.create_new_user(db, data)

    with pytest.raises(HTTPException) as exc_info:
        UserService.create_new_user(db, data)

    assert exc_info.value.status_code == 409


def test_create_user_owner_exists(db):
    data = UserCreate(
        email="email@example.com",
        password="Test@123",
        confirm_password="Test@123",
        role="owner",
        active=True,
    )

    data1 = UserCreate(
        email="teste@example",
        password="Test@123",
        confirm_password="Test@123",
        role="owner",
        active=True,
    )

    UserService.create_new_user(db, data)

    with pytest.raises(HTTPException) as exc_info:
        UserService.create_new_user(db, data1)

    assert exc_info.value.status_code == 409


def test_create_user_passwords_not_match(db):
    data = UserCreate(
        email="email@example.com",
        password="Test@123",
        confirm_password="Test@1234",
        role="operator",
        active=True,
    )

    with pytest.raises(HTTPException) as exc_info:
        UserService.create_new_user(db, data)

    assert exc_info.value.status_code == 422


# test login
def test_login_user_success(db):
    data = UserCreate(
        email="email@example.com",
        password="Test@123",
        confirm_password="Test@123",
        role="operator",
        active=True,
    )

    UserService.create_new_user(db, data)

    data = UserLogin(email="email@example.com", password="Test@123")

    user = UserService.login_user(db, data)

    assert user.email == data.email


def test_login_user_email_or_password_incorrect(db):
    data = UserLogin(email="email@example.com", password="Test@123")

    with pytest.raises(HTTPException) as exc_info:
        UserService.login_user(db, data)

    assert exc_info.value.status_code == 401


def test_login_user_user_not_found(db):
    data = UserLogin(email="email@example.com", password="Test@123")

    with pytest.raises(HTTPException) as exc_info:
        UserService.login_user(db, data)

    assert exc_info.value.status_code == 401


# test get users
def test_get_users(db):
    data = UserCreate(
        email="email@example.com",
        password="Test@123",
        confirm_password="Test@123",
        role="operator",
        active=True,
    )

    UserService.create_new_user(db, data)

    users = UserService.get_users(db)

    assert len(users) == 1


def test_get_user_by_id(db):
    data = UserCreate(
        email="email@example.com",
        password="Test@123",
        confirm_password="Test@123",
        role="operator",
        active=True,
    )

    user = UserService.create_new_user(db, data)

    user = UserService.get_user_by_id(db, user.id)

    assert user.id == user.id


def test_get_user_by_id_user_not_found(db):
    with pytest.raises(HTTPException) as exc_info:
        UserService.get_user_by_id(db, 9999)

    assert exc_info.value.status_code == 404


# test update user


def test_activate_user_toggle(db):
    data = UserCreate(
        email="email@example.com",
        password="Test@123",
        confirm_password="Test@123",
        role="operator",
        active=True,
    )

    user = UserService.create_new_user(db, data)

    status = UserActive(active=False)

    user_updated = UserService.activate_user(db, user.id, status)

    assert user_updated.active is False
