import shutil, os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select, desc
from database import get_db
from models import Banner

router = APIRouter()

@router.get("/")
def get_banners(db: Session= Depends(get_db)):
    banners= db.exec(select(Banner).order_by(desc(Banner.id))).all()
    return banners

@router.get("/{banner_id}")
def get_banner_id(banner_id: int, db: Session= Depends(get_db)):
    banner= db.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    return banner

@router.post("/")
def create_banner(
    title: str= Form(None),
    subtitle: str= Form(None),
    description: str= Form(None),
    status: bool= Form(True),
    image: Optional[UploadFile]=File(None),
    db: Session= Depends(get_db)):

    image_url= None
    if image and image.filename:
        save_dir= os.path.join("static", "banners")
        os.makedirs(save_dir, exist_ok=True)
        save_path= os.path.join(save_dir, image.filename)
        with open(save_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url= f"/static/banners/{image.filename}"
        
    banner= Banner(
        title= title,
        subtitle= subtitle,
        description= description,
        image_url= image_url,
        status= status
    )
    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner

@router.put("/{banner_id}")
def update_banner(
    banner_id: int,
    title: Optional[str] = Form(None),
    subtitle: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    status: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    banner = db.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    if title is not None:
        banner.title = title
    if subtitle is not None:
        banner.subtitle = subtitle
    if description is not None:
        banner.description = description
    if status is not None:
        banner.status = status

    if image and image.filename:
        save_dir = os.path.join("static", "banners")
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, image.filename)
        with open(save_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        banner.image_url = f"/static/banners/{image.filename}"

    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner

@router.delete("/{banner_id}")
def delete_banner(banner_id: int, db: Session= Depends(get_db)):
    banner=db.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    db.delete(banner)
    db.commit()
    return {"message": "Banner deleted"}