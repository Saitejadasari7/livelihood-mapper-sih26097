import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api", tags=["admin-jobs"])


def require_admin(user: models.User = Depends(get_current_user)) -> models.User:
    if user.role != "admin":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "Admin / Employer account required for this action.",
        )
    return user


def _seed_default_jobs_if_empty(db: Session) -> None:
    if db.scalar(select(models.JobPosting).limit(1)):
        return
    defaults = [
        models.JobPosting(
            title="Junior Data Entry & MIS Executive",
            company="Digital Bharat Services",
            location="Vijayawada / Hybrid",
            sector="Technology",
            nsqf_level="Levels 3–4",
            salary="₹16,000 - ₹22,000/month",
            description="Manage digital records, spreadsheet verification, and daily MIS reporting.",
            required_skills_json=json.dumps(["Computer fundamentals", "Typing", "Spreadsheet operations", "Data handling"]),
            translations_json=json.dumps(
                {
                    "hi": "जूनियर डेटा एंट्री और एमआईएस कार्यकारी",
                    "te": "జూనియర్ డేటా ఎంట్రీ & MIS ఎగ్జిక్యూటివ్",
                    "ta": "இளநிலை டேட்டா என்ட்ரி & MIS நிர்வாகி",
                    "ml": "ജൂനിയർ ഡാറ്റ എൻട്രി & MIS എക്സിക്യൂട്ടീവ്",
                    "kn": "ಜೂನಿಯರ್ ಡೇಟಾ ಎಂಟ್ರಿ ಮತ್ತು MIS ಕಾರ್ಯನಿರ್ವಾಹಕ",
                },
                ensure_ascii=False,
            ),
            posted_by_name="Skill India Verified Employer",
        ),
        models.JobPosting(
            title="Rooftop Solar PV Field Technician",
            company="SuryaShakti Green Energy",
            location="Hyderabad / Rural Clusters",
            sector="Green Jobs",
            nsqf_level="Levels 3–4",
            salary="₹18,000 - ₹26,000/month",
            description="Install, wire, and test residential and agricultural solar PV systems.",
            required_skills_json=json.dumps(["Electrical basics", "Solar panel mounting", "Safety compliance", "Site testing"]),
            translations_json=json.dumps(
                {
                    "hi": "रूफटॉप सोलर पीवी फील्ड तकनीशियन",
                    "te": "రూఫ్‌టాప్ సోలార్ PV ఫీల్డ్ టెక్నీషియన్",
                    "ta": "சோலார் PV களத் தொழில்நுட்ப வல்லுநர்",
                    "ml": "റൂഫ്‌ടോപ്പ് സോളാർ PV ഫീల్ഡ് ടെക്നീഷ്യൻ",
                    "kn": "ರೂಫ್‌ಟಾಪ್ ಸೋಲಾರ್ PV ಫೀಲ್ಡ್ ತಂತ್ರಜ್ಞ",
                },
                ensure_ascii=False,
            ),
            posted_by_name="Skill India Verified Employer",
        ),
        models.JobPosting(
            title="Associate AI & Data Analyst",
            company="KaushalTech Analytics",
            location="Bengaluru / Remote",
            sector="Technology",
            nsqf_level="Levels 7–8",
            salary="₹45,000 - ₹70,000/month",
            description="Build SQL data pipelines, Python ML models, and operational dashboards.",
            required_skills_json=json.dumps(["Python programming", "Data analysis", "Machine learning basics", "SQL queries"]),
            translations_json=json.dumps(
                {
                    "hi": "एसोसिएट एआई और डेटा विश्लेषक",
                    "te": "అసోసియేట్ AI & డేటా అనలిస్ట్",
                    "ta": "இணை AI & தரவு ஆய்வாளர்",
                    "ml": "അസോസിയേറ്റ് AI & ഡാറ്റ അനലിസ്റ്റ്",
                    "kn": "ಅಸೋಸಿಯೇಟ್ AI ಮತ್ತು ಡೇಟಾ ವಿಶ್ಲೇಷಕ",
                },
                ensure_ascii=False,
            ),
            posted_by_name="Skill India Verified Employer",
        ),
    ]
    db.add_all(defaults)
    db.commit()


def _serialize_job(job: models.JobPosting) -> dict:
    return {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "sector": job.sector,
        "nsqf_level": job.nsqf_level,
        "salary": job.salary,
        "description": job.description,
        "required_skills": json.loads(job.required_skills_json or "[]"),
        "translations": json.loads(job.translations_json or "{}"),
        "posted_by": job.posted_by_name,
        "created_at": job.created_at,
    }


@router.get("/jobs")
def list_jobs(q: str = "", sector: str = "", nsqf_level: str = "", db: Session = Depends(get_db)):
    _seed_default_jobs_if_empty(db)
    jobs = db.scalars(select(models.JobPosting).order_by(models.JobPosting.id.desc())).all()
    query = q.strip().lower()
    filtered = []
    for job in jobs:
        data = _serialize_job(job)
        if sector and sector != "ALL" and data["sector"].lower() != sector.lower():
            continue
        if nsqf_level and nsqf_level != "ALL" and data["nsqf_level"] != nsqf_level:
            continue
        if query:
            haystack = " ".join(
                [
                    data["title"],
                    data["company"],
                    data["location"],
                    data["sector"],
                    " ".join(data["required_skills"]),
                    " ".join(data["translations"].values()),
                ]
            ).lower()
            if query not in haystack:
                continue
        filtered.append(data)
    return filtered


@router.post("/jobs/{job_id}/apply", status_code=status.HTTP_201_CREATED)
def apply_to_job(
    job_id: int,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    job = db.get(models.JobPosting, job_id)
    if not job:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Job posting not found")

    existing = db.scalar(
        select(models.JobApplication).where(
            models.JobApplication.job_id == job_id,
            models.JobApplication.user_id == user.id,
        )
    )
    if existing:
        return {"status": "already_applied", "application_id": existing.id}

    req_skills = json.loads(job.required_skills_json or "[]")
    user_skills_lower = {s.name.lower() for s in user.skills}
    matched = [s for s in req_skills if s.lower() in user_skills_lower]
    alignment_pct = round((len(matched) / len(req_skills)) * 100) if req_skills else 100

    app_record = models.JobApplication(
        job_id=job.id,
        user_id=user.id,
        applicant_name=user.full_name,
        applicant_email=user.email,
        alignment_pct=alignment_pct,
        matched_skills_json=json.dumps(matched),
    )
    db.add(app_record)
    db.commit()
    db.refresh(app_record)
    return {"status": "applied", "application_id": app_record.id, "alignment_pct": alignment_pct}


@router.get("/admin/applications")
def list_applications(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    apps = db.scalars(
        select(models.JobApplication).order_by(models.JobApplication.alignment_pct.desc())
    ).all()
    out = []
    for a in apps:
        job = db.get(models.JobPosting, a.job_id)
        out.append(
            {
                "id": a.id,
                "job_id": a.job_id,
                "job_title": job.title if job else "Job Removed",
                "company": job.company if job else "",
                "applicant_name": a.applicant_name,
                "applicant_email": a.applicant_email,
                "alignment_pct": a.alignment_pct,
                "matched_skills": json.loads(a.matched_skills_json or "[]"),
                "created_at": a.created_at,
            }
        )
    return out


@router.post("/admin/jobs", status_code=status.HTTP_201_CREATED)
def create_job(
    data: schemas.JobCreate,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    job = models.JobPosting(
        title=data.title.strip(),
        company=data.company.strip(),
        location=data.location.strip(),
        sector=data.sector.strip(),
        nsqf_level=data.nsqf_level.strip(),
        salary=data.salary.strip(),
        description=data.description.strip(),
        required_skills_json=json.dumps([s.strip() for s in data.required_skills if s.strip()]),
        translations_json=json.dumps(data.translations, ensure_ascii=False),
        posted_by_id=admin.id,
        posted_by_name=admin.full_name,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return _serialize_job(job)


@router.post("/admin/professions", status_code=status.HTTP_201_CREATED)
def create_profession(
    data: schemas.ProfessionCreate,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing = db.scalar(select(models.Livelihood).where(models.Livelihood.title == data.title.strip()))
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "This profession already exists.")

    skill_objs = []
    for raw_name in data.required_skills:
        name = raw_name.strip()
        if not name:
            continue
        skill = db.scalar(select(models.Skill).where(models.Skill.name.ilike(name)))
        if not skill:
            skill = models.Skill(name=name, category=data.sector.strip())
            db.add(skill)
            db.flush()
        skill_objs.append(skill)

    liv = models.Livelihood(
        title=data.title.strip(),
        sector=data.sector.strip(),
        description=data.description.strip(),
        suggested_min_education=data.suggested_min_education.strip(),
        translations_json=json.dumps(data.translations, ensure_ascii=False),
    )
    liv.required_skills = skill_objs
    db.add(liv)
    db.commit()
    db.refresh(liv)

    return {
        "id": liv.id,
        "title": liv.title,
        "sector": liv.sector,
        "suggested_min_education": liv.suggested_min_education,
        "required_skills": [s.name for s in liv.required_skills],
        "translations": data.translations,
    }