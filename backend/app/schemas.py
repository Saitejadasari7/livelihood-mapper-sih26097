from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class RegisterIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8)

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


class ProfileOut(ProfileIn):
    model_config = ConfigDict(from_attributes=True)
    
class SkillsIn(BaseModel):
    skills: list[str]