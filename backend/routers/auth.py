from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
from database import get_db
from sqlmodel import Session, select
from models import User
from schemas import UserSignup, ProfileUpdate
from typing import Optional
import os
import dotenv

dotenv.load_dotenv()

router = APIRouter()

secret_key=os.getenv("SECRET_KEY")
algorithm= os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: Optional[timedelta]=None):
    to_encode= data.copy()
    if expires_delta:
        expire= datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt= jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt

oAuth2_scheme= OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str=Depends(oAuth2_scheme)) -> str:
    try:
        payload= jwt.decode(token, secret_key, algorithms=[algorithm])
        username: str= payload.get("sub")
        if username is None:
            raise HTTPException(status_code=400, detail="Invalid token: Username Missing")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has Expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")
    return username

access_token_expires_minutes= 30

pwd_context= CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/profile")
def profile(current_user:str=Depends(get_current_user), db: Session= Depends(get_db)):
    user= db.exec(select(User).where(User.email==current_user)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User Not Found")
    return {"username": user.username, "email": user.email, "phone": user.phone, "role": user.role}


@router.post("/user/signup")
def user_signup(user: UserSignup, db: Session = Depends(get_db)):
    existing_user= db.exec(select(User).where(User.email==user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password=pwd_context.hash(user.password)
    new_user= User(
        username= user.username,
        email= user.email,
        phone= user.phone,
        hashed_password= hashed_password,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token= create_access_token(
        data={"sub": new_user.email, "role": new_user.role},
        expires_delta= timedelta(minutes=access_token_expires_minutes)
    )
    return {"access_token": token, "token_type": "bearer"}

@router.post("/admin/signup")
def admin_signup(user: UserSignup, db: Session= Depends(get_db)):
    existing_user= db.exec(select(User).where(User.email==user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password=pwd_context.hash(user.password)
    new_user= User(
        username= user.username,
        email= user.email,
        phone= user.phone,
        hashed_password= hashed_password,
        role="admin"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return{"message": "User Created Successfully"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session= Depends(get_db)):
    user= db.exec(select(User).where(User.email==form_data.username)).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    token= create_access_token({'sub': user.email, 'role': user.role}, expires_delta=timedelta(minutes=60))
    return {'access_token': token, 'token_type': 'bearer'}

@router.put("/profile")
def update_profile(data: ProfileUpdate, current_user: str= Depends(get_current_user), db: Session= Depends(get_db)):
    user= db.exec(select(User).where(User.email==current_user)).first()
    if not user:
        raise HTTPException(status_code= 404, detail="User Not Found")
    user.username= data.username
    user.phone=data.phone
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Profile Updated Successfully"}
    
@router.post("/logout")
def logout():
    return {"message": "Logged Out Successfully"}