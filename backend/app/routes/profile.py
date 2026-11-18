from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user
from ..services.recommender import compute_recommendations

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=schemas.ProfileOut)
def get_profile(user: models.User = Depends(get_current_user)):
    prof = user.profile
    skill_names = [s.name for s in user.skills]
    if not prof:
        return schemas.ProfileOut(skills=skill_names)
    return schemas.ProfileOut(
        age_range=prof.age_range,
        state=prof.state,
        district=prof.district,
        area_type=prof.area_type,
        education_level=prof.education_level,
        experience_level=prof.experience_level,
        interest_sector=prof.interest_sector,
        career_preference=prof.career_preference,
        skills=skill_names,
    )


@router.put("", response_model=schemas.ProfileOut)
def save_profile(
    data: schemas.ProfileIn,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = user.profile or models.UserProfile(user_id=user.id)
    profile_fields = data.model_dump(exclude={"skills"})
    for field, value in profile_fields.items():
        setattr(profile, field, value)
    db.add(profile)

    # Sync user skills in SQLite
    skill_objs = []
    seen = set()
    for raw_name in data.skills:
        clean = raw_name.strip()
        if not clean or clean.lower() in seen:
            continue
        seen.add(clean.lower())
        existing = db.scalar(
            select(models.Skill).where(models.Skill.name.ilike(clean))
        )
        if not existing:
            existing = models.Skill(name=clean, category=data.interest_sector or "General")
            db.add(existing)
            db.flush()
        skill_objs.append(existing)

    user.skills = skill_objs
    db.commit()
    db.refresh(profile)

    # Persist updated recommendations upon profile save
    compute_recommendations(user, db, persist=True)

    return schemas.ProfileOut(
        age_range=profile.age_range,
        state=profile.state,
        district=profile.district,
        area_type=profile.area_type,
        education_level=profile.education_level,
        experience_level=profile.experience_level,
        interest_sector=profile.interest_sector,
        career_preference=profile.career_preference,
        skills=[s.name for s in user.skills],
    )