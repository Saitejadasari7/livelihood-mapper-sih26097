from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class RegisterIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8)
    role: Literal["user", "admin"] = "user"

    @field_validator("password")
    @classmethod
    def password_fits_bcrypt(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 bytes long")
        return v


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    full_name: str
    role: str


class ProfileIn(BaseModel):
    age_range: Optional[str] = Field(default=None, max_length=20)
    state: Optional[str] = Field(default=None, max_length=60)
    district: Optional[str] = Field(default=None, max_length=60)
    area_type: Optional[Literal["Rural", "Urban"]] = None
    education_level: Optional[str] = Field(default=None, max_length=40)
    experience_level: Optional[str] = Field(default=None, max_length=40)
    interest_sector: Optional[str] = Field(default=None, max_length=60)
    career_preference: Optional[str] = Field(default=None, max_length=40)
    skills: list[str] = Field(default_factory=list)


class ProfileOut(ProfileIn):
    model_config = ConfigDict(from_attributes=True)


class ProfessionCreate(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    sector: str = Field(min_length=2, max_length=60)
    description: str = Field(default="")
    suggested_min_education: str = Field(default="10th Pass")
    required_skills: list[str] = Field(default_factory=list)
    translations: dict[str, str] = Field(default_factory=dict)


class JobCreate(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    company: str = Field(min_length=2, max_length=120)
    location: str = Field(min_length=2, max_length=120)
    sector: str = Field(default="Technology")
    nsqf_level: str = Field(default="Levels 3–4")
    salary: str = Field(default="₹15,000 - ₹25,000/month")
    description: str = Field(default="")
    required_skills: list[str] = Field(default_factory=list)
    translations: dict[str, str] = Field(default_factory=dict)