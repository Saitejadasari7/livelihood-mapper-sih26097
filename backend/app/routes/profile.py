from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=schemas.ProfileOut)
def get_profile(user: models.User = Depends(get_current_user)):
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


@router.get("/skills", response_model=list[str])
def get_user_skills(user: models.User = Depends(get_current_user)):
    return [s.name for s in user.skills]


@router.put("/skills", response_model=list[str])
def save_user_skills(
    data: schemas.SkillsIn,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    matched = db.scalars(
        select(models.Skill).where(models.Skill.name.in_(data.skills))
    ).all()
    user.skills = list(matched)
    db.commit()
    return [s.name for s in user.skills]