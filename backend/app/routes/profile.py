from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=schemas.ProfileOut)
def get_profile(user: models.User = Depends(get_current_user)):
    # A new user has no profile yet: return empty fields instead of an error
    return user.profile or schemas.ProfileOut()


@router.put("", response_model=schemas.ProfileOut)
def save_profile(
    data: schemas.ProfileIn,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = user.profile or models.UserProfile(user_id=user.id)
    for field, value in data.model_dump().items():
        setattr(profile, field, value)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile