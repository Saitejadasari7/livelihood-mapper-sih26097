from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy import (
    Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Table,
    Text, UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def now() -> datetime:
    return datetime.now(timezone.utc)


# ---- Linking tables (many-to-many) ----
user_skills = Table(
    "user_skills", Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("skill_id", ForeignKey("skills.id"), primary_key=True),
)

livelihood_skills = Table(
    "livelihood_skills", Base.metadata,
    Column("livelihood_id", ForeignKey("livelihoods.id"), primary_key=True),
    Column("skill_id", ForeignKey("skills.id"), primary_key=True),
)

training_program_skills = Table(
    "training_program_skills", Base.metadata,
    Column("training_program_id", ForeignKey("training_programs.id"), primary_key=True),
    Column("skill_id", ForeignKey("skills.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))  # never plain text
    full_name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(20), default="user")  # "user" or "admin"
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)

    profile: Mapped[Optional["UserProfile"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    skills: Mapped[list["Skill"]] = relationship(secondary=user_skills)
    recommendations: Mapped[list["Recommendation"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    progress: Mapped[list["UserProgress"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    age_range: Mapped[Optional[str]] = mapped_column(String(20))
    state: Mapped[Optional[str]] = mapped_column(String(60))
    district: Mapped[Optional[str]] = mapped_column(String(60))
    area_type: Mapped[Optional[str]] = mapped_column(String(10))  # Rural / Urban
    education_level: Mapped[Optional[str]] = mapped_column(String(40))
    experience_level: Mapped[Optional[str]] = mapped_column(String(40))
    interest_sector: Mapped[Optional[str]] = mapped_column(String(60))
    career_preference: Mapped[Optional[str]] = mapped_column(String(40))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now, onupdate=now
    )

    user: Mapped["User"] = relationship(back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    category: Mapped[Optional[str]] = mapped_column(String(50))


class Qualification(Base):
    __tablename__ = "qualifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    code: Mapped[Optional[str]] = mapped_column(String(50), unique=True)
    nsqf_level: Mapped[Optional[int]] = mapped_column(Integer)  # NULL until verified
    sector: Mapped[Optional[str]] = mapped_column(String(100))
    job_role: Mapped[Optional[str]] = mapped_column(String(150))
    entry_requirements: Mapped[Optional[str]] = mapped_column(Text)
    training_requirements: Mapped[Optional[str]] = mapped_column(Text)
    source: Mapped[Optional[str]] = mapped_column(String(300))
    last_verified: Mapped[Optional[date]] = mapped_column(Date)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)


class Livelihood(Base):
    __tablename__ = "livelihoods"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150), unique=True)
    sector: Mapped[Optional[str]] = mapped_column(String(60))
    description: Mapped[Optional[str]] = mapped_column(Text)
    suggested_min_education: Mapped[Optional[str]] = mapped_column(String(40))

    required_skills: Mapped[list["Skill"]] = relationship(secondary=livelihood_skills)


class TrainingProgram(Base):
    __tablename__ = "training_programs"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    provider: Mapped[Optional[str]] = mapped_column(String(150))
    mode: Mapped[Optional[str]] = mapped_column(String(30))
    duration: Mapped[Optional[str]] = mapped_column(String(50))
    qualification_id: Mapped[Optional[int]] = mapped_column(ForeignKey("qualifications.id"))
    source: Mapped[Optional[str]] = mapped_column(String(300))
    last_verified: Mapped[Optional[date]] = mapped_column(Date)

    qualification: Mapped[Optional["Qualification"]] = relationship()
    skills: Mapped[list["Skill"]] = relationship(secondary=training_program_skills)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    livelihood_id: Mapped[int] = mapped_column(ForeignKey("livelihoods.id"))
    score: Mapped[float] = mapped_column(Float)
    explanation: Mapped[Optional[str]] = mapped_column(Text)  # JSON text: why this was suggested
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)

    user: Mapped["User"] = relationship(back_populates="recommendations")
    livelihood: Mapped["Livelihood"] = relationship()


class UserProgress(Base):
    __tablename__ = "user_progress"
    __table_args__ = (UniqueConstraint("user_id", "skill_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))
    status: Mapped[str] = mapped_column(String(20), default="planned")  # planned / learning / completed
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now, onupdate=now
    )

    user: Mapped["User"] = relationship(back_populates="progress")
    skill: Mapped["Skill"] = relationship()