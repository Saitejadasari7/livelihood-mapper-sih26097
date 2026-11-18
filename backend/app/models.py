from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import relationship
from .database import Base

user_skills_table = Table(
    "user_skills",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

livelihood_skills_table = Table(
    "livelihood_skills",
    Base.metadata,
    Column("livelihood_id", Integer, ForeignKey("livelihoods.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

program_skills_table = Table(
    "program_skills",
    Base.metadata,
    Column("program_id", Integer, ForeignKey("training_programs.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(120), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), default="user", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skills = relationship("Skill", secondary=user_skills_table)


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age_range = Column(String(20), nullable=True)
    state = Column(String(60), nullable=True)
    district = Column(String(60), nullable=True)
    area_type = Column(String(20), nullable=True)
    education_level = Column(String(40), nullable=True)
    experience_level = Column(String(40), nullable=True)
    interest_sector = Column(String(60), nullable=True)
    career_preference = Column(String(40), nullable=True)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False, index=True)
    category = Column(String(60), nullable=True)


class Livelihood(Base):
    __tablename__ = "livelihoods"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), unique=True, nullable=False)
    sector = Column(String(60), nullable=True)
    description = Column(Text, nullable=True)
    suggested_min_education = Column(String(40), nullable=True)
    translations_json = Column(Text, default="{}", nullable=True)

    required_skills = relationship("Skill", secondary=livelihood_skills_table)


class Qualification(Base):
    __tablename__ = "qualifications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    nsqf_level = Column(Integer, nullable=False)
    sector = Column(String(60), nullable=True)
    job_role = Column(String(120), nullable=True)
    entry_requirements = Column(Text, nullable=True)
    training_requirements = Column(Text, nullable=True)
    source = Column(String(255), nullable=True)
    last_verified = Column(String(30), nullable=True)
    verified = Column(Boolean, default=False)

    programs = relationship("TrainingProgram", back_populates="qualification")


class TrainingProgram(Base):
    __tablename__ = "training_programs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    provider = Column(String(120), nullable=True)
    mode = Column(String(60), nullable=True)
    duration = Column(String(60), nullable=True)
    qualification_id = Column(Integer, ForeignKey("qualifications.id"), nullable=True)
    source = Column(String(255), nullable=True)
    last_verified = Column(String(30), nullable=True)

    qualification = relationship("Qualification", back_populates="programs")
    skills = relationship("Skill", secondary=program_skills_table)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    livelihood_id = Column(Integer, ForeignKey("livelihoods.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False)
    explanation = Column(Text, nullable=True)


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), default="planned", nullable=False)

    skill = relationship("Skill")


class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(160), nullable=False)
    company = Column(String(120), nullable=False)
    location = Column(String(120), nullable=False)
    sector = Column(String(60), default="Technology")
    nsqf_level = Column(String(40), default="Levels 3–4")
    salary = Column(String(80), default="₹15,000 - ₹25,000/month")
    description = Column(Text, default="")
    required_skills_json = Column(Text, default="[]")
    translations_json = Column(Text, default="{}")
    posted_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    posted_by_name = Column(String(120), default="Verified Employer")
    created_at = Column(String(30), default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_postings.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    applicant_name = Column(String(120), nullable=False)
    applicant_email = Column(String(255), nullable=False)
    alignment_pct = Column(Integer, default=0)
    matched_skills_json = Column(Text, default="[]")
    created_at = Column(String(30), default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))