import shutil, os
from typing import Optional
from datetime import date
from sqlmodel import Session, select, desc
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from database import get_db
from models import Testimonials


router= APIRouter()

@router.get("/")
def get_all_testimonials(db: Session= Depends(get_db)):
    testimonials= db.exec(select(Testimonials).order_by(Testimonials.review_date)).all()
    return testimonials

@router.get("/active")
def get_active_review(db: Session= Depends(get_db)):
    review= db.exec(select(Testimonials).where(Testimonials.display_review==True)).all()
    return review

@router.get("/{id}")
def get_review_by_id(id: int, db:Session= Depends(get_db)):
    review= db.get(Testimonials, id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not Found")
    return review

@router.post("/add_testimonials")
def create_testimonials(
        name: str= Form(None),
        designation: str =Form(None) ,
        review:str= Form(None),
        rating:float= Form(None),
        image: Optional[UploadFile]= File(None),
        display_review: bool=Form(False),
        db: Session= Depends(get_db)):

        image_url= None

        if image and image.filename:
            save_dir= os.path.join("static", "testimonial_images")
            os.makedirs(save_dir, exist_ok=True)
            save_path= os.path.join(save_dir, image.filename)
            with open(save_path, "wb") as f:
                shutil.copyfileobj(image.file, f)
            image_url= f"/static/testimonial_images/{image.filename}"

        testimonials= Testimonials(
            name= name,
            designation= designation,
            review= review,
            rating= rating,
            image_url= image_url
        )
        db.add(testimonials)
        db.commit()
        db.refresh(testimonials)
        return testimonials

@router.put("/{review_id}")
def edit_review(
    review_id: int,
    display_review: Optional[bool] = Form(False),
    db: Session= Depends(get_db)):

    review= db.get(Testimonials, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not Found")
        
    if display_review is not None:
        review.display_review= display_review

    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session= Depends(get_db)):
    review= db.get(Testimonials, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not Found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}