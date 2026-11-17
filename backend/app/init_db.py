import csv
from datetime import date
from pathlib import Path

from sqlalchemy import func, select

from . import models
from .database import Base, SessionLocal, engine

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


def read_csv(filename):
    with open(DATA_DIR / filename, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def split(value):
    return [v.strip() for v in (value or "").split(";") if v.strip()]


def get_skill(db, name):
    skill = db.scalar(select(models.Skill).where(models.Skill.name == name))
    if skill is None:
        raise ValueError(f"Skill '{name}' is not in skills.csv. Check spelling.")
    return skill


def load_skills(db):
    for row in read_csv("skills.csv"):
        exists = db.scalar(select(models.Skill).where(models.Skill.name == row["name"]))
        if not exists:
            db.add(models.Skill(name=row["name"], category=row["category"]))
    db.commit()


def load_livelihoods(db):
    for row in read_csv("livelihoods.csv"):
        exists = db.scalar(select(models.Livelihood).where(models.Livelihood.title == row["title"]))
        if exists:
            continue
        item = models.Livelihood(
            title=row["title"],
            sector=row["sector"],
            description=row["description"],
            suggested_min_education=row["suggested_min_education"],
        )
        item.required_skills = [get_skill(db, n) for n in split(row["required_skills"])]
        db.add(item)
    db.commit()


def load_qualifications(db):
    for row in read_csv("qualifications.csv"):
        if not row["name"]:
            continue
        if row["code"] and db.scalar(select(models.Qualification).where(models.Qualification.code == row["code"])):
            continue
        level = int(row["nsqf_level"]) if row["nsqf_level"] else None
        verified_on = date.fromisoformat(row["last_verified"]) if row["last_verified"] else None
        # Verified only if every proof field is present
        is_verified = bool(row["code"] and level and row["source"] and verified_on)
        db.add(models.Qualification(
            name=row["name"], code=row["code"] or None, nsqf_level=level,
            sector=row["sector"], job_role=row["job_role"],
            entry_requirements=row["entry_requirements"],
            training_requirements=row["training_requirements"],
            source=row["source"], last_verified=verified_on, verified=is_verified,
        ))
    db.commit()


def load_training(db):
    for row in read_csv("training_programs.csv"):
        if not row["title"]:
            continue
        qualification = None
        if row["qualification_code"]:
            qualification = db.scalar(
                select(models.Qualification).where(models.Qualification.code == row["qualification_code"])
            )
        verified_on = date.fromisoformat(row["last_verified"]) if row["last_verified"] else None
        program = models.TrainingProgram(
            title=row["title"], provider=row["provider"], mode=row["mode"],
            duration=row["duration"], source=row["source"], last_verified=verified_on,
            qualification=qualification,
        )
        program.skills = [get_skill(db, n) for n in split(row["skills"])]
        db.add(program)
    db.commit()


def count(db, model):
    return db.scalar(select(func.count(model.id)))


def main():
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        load_skills(db)
        load_livelihoods(db)
        load_qualifications(db)
        load_training(db)
        verified = db.scalar(
            select(func.count(models.Qualification.id)).where(models.Qualification.verified.is_(True))
        )
        print("Database ready.")
        print("Skills:", count(db, models.Skill))
        print("Livelihoods:", count(db, models.Livelihood))
        print(f"Qualifications: {count(db, models.Qualification)} (verified: {verified})")
        print("Training programs:", count(db, models.TrainingProgram))


if __name__ == "__main__":
    main()