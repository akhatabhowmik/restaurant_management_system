from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_db
from models import Category

router = APIRouter()

@router.get("/")
def get_categories(db: Session = Depends(get_db)):
    categories = db.exec(select(Category)).all()
    return categories
