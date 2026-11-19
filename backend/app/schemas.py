import re
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


def normalize_phone(raw: Optional[str]) -> Optional[str]:
    if not raw or not raw.strip():
        return None
    digits = re.sub(r"\D", "", raw.strip())
    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    if len(digits) != 10:
        raise ValueError("Please enter a valid 10-digit mobile number")
    return digits


class RegisterIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: str = Field(min_length=8)
    role: Literal["user", "admin"] = "user"

    @field_validator("phone")
    @classmethod
    def check_phone(cls, v: Optional[str]) -> Optional[str]:
        return normalize_phone(v)

    @field_validator("password")
    @classmethod
    def password_fits_bcrypt(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 bytes long")
        return v

    @model_validator(mode="after")
    def require_email_or_phone(self):
        if not self.email and not self.phone:
            raise ValueError("Please provide either an Email address or a 10-digit Mobile Number")
        return self


class LoginIn(BaseModel):
    identifier: Optional[str] = None
    email: Optional[str] = None
    password: str

    @model_validator(mode="after")
    def resolve_identifier(self):
        val = (self.identifier or self.email or "").strip()
        if not val:
            raise ValueError("Please enter your Email or Mobile Number")
        self.identifier = val
        return self


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: Optional[str] = None
    phone: Optional[str] = None
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