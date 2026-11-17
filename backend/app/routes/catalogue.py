from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from .. import models
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api", tags=["catalogue"])


class ProgressIn(BaseModel):
    skill_name: str
    status: str  # planned | learning | completed


@router.get("/training")
def list_training(db: Session = Depends(get_db)):
    programs = db.scalars(select(models.TrainingProgram)).all()
    out = []
    for p in programs:
        q = p.qualification
        out.append({
            "id": p.id,
            "title": p.title,
            "provider": p.provider,
            "mode": p.mode,
            "duration": p.duration,
            "skills": [s.name for s in p.skills],
            "source": p.source,
            "last_verified": str(p.last_verified) if p.last_verified else None,
            "nsqf": {
                "verified": bool(q and q.verified),
                "name": q.name if q else None,
                "code": q.code if q else None,
                "level": q.nsqf_level if q else None,
                "source": q.source if q else None,
            } if q else {"verified": False},
        })
    return out


@router.get("/progress")
def get_progress(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.scalars(
        select(models.UserProgress).where(models.UserProgress.user_id == user.id)
    ).all()
    return [{"skill": r.skill.name, "status": r.status} for r in rows]


@router.put("/progress")
def update_progress(
    data: ProgressIn,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.status not in {"planned", "learning", "completed"}:
        raise HTTPException(400, "Invalid status")
    skill = db.scalar(select(models.Skill).where(models.Skill.name == data.skill_name))
    if not skill:
        raise HTTPException(404, "Skill not found")

    item = db.scalar(
        select(models.UserProgress).where(
            models.UserProgress.user_id == user.id,
            models.UserProgress.skill_id == skill.id,
        )
    )
    if not item:
        item = models.UserProgress(user_id=user.id, skill_id=skill.id, status=data.status)
    else:
        item.status = data.status
    db.add(item)
    db.commit()
    return {"skill": skill.name, "status": item.status}