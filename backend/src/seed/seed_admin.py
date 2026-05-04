from sqlalchemy.orm import Session
from src.core.security import hash_password
from src.user.models.user_model import User
from src.core.config import settings


def seed_admin(db: Session):
    admin = db.query(User).filter(User.role == "OWNER").first()

    if admin:
        return

    new_admin = User(
        email=settings.FIRST_OWNER_EMAIL,
        password=hash_password(settings.FIRST_OWNER_PASSWORD).decode(
            "utf-8"
        ),
        role="OWNER",
    )

    db.add(new_admin)
    db.commit()
