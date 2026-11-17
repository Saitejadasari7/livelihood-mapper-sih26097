from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models
from ..database import get_db
from ..deps import get_current_user
from ..services.recommender import compute_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("")
def get_recommendations(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return {
        "user_skills": [s.name for s in user.skills],
        "recommendations": compute_recommendations(user, db),
    }