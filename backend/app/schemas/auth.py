from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenData(BaseModel):
    user_id: int
    token_version: int

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"