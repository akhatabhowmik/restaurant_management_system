import shutil, os
from typing import Optional
from sqlmodel import Session, select, desc
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from database import get_db
from models import Chef

router = APIRouter()

@router.get("/")
def get_all_chefs(db: Session= Depends(get_db)):
    chefs= db.exec(select(Chef).order_by(desc(Chef.id))).all();
    return chefs

@router.get("/head_chef")
def get_head_chef(db: Session= Depends(get_db)):
    chef= db.exec(select(Chef).where(Chef.is_head_chef==True)).first()
    if not chef:
        raise HTTPException(status_code=404, detail="No head chef currently assigned")
    return chef

@router.get("/active_count")
def get_active_chef_count(db: Session= Depends(get_db)):
    active_chef= db.exec(select(Chef).where(Chef.is_active==True)).all()
    return {"count": len(active_chef)}

@router.get("/{chef_id}")
def get_chef_id(chef_id: int,db: Session= Depends(get_db)):
    chef= db.get(Chef, chef_id)
    if not chef:
        raise HTTPException(status_code=404, detail="chef not found")
    return chef

@router.post("/")
def create_chef(
    name: str= Form(None),
    specialty: str= Form(None),
    description: str= Form(None),
    image: Optional[UploadFile]= File(None),
    display_order: int= Form(None),
    status: bool= Form(True),
    head_chef: bool=Form(False),
    db: Session= Depends(get_db)):

    image_url=None
    if image and image.filename:
        save_dir= os.path.join("static", "chefs")
        os.makedirs(save_dir, exist_ok=True)
        file_path= os.path.join(save_dir, image.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url=f"/static/chefs/{image.filename}"
    
    chef= Chef(
        name=name,
        specialty= specialty,
        description= description,
        photo_url=image_url,
        display_order=display_order,
        is_active= status,
        is_head_chef= head_chef
    )

    db.add(chef)
    db.commit()
    db.refresh(chef)
    return chef

@router.put("/{chef_id}")
def update_chef(
    chef_id: int,
    name: Optional[str]= Form(None),
    specialty: Optional[str]=Form(None),
    description: Optional[str]= Form(None),
    image: Optional[UploadFile]=Form(None),
    display_order: Optional[int]= File(None),
    status: Optional[bool] = Form(None),
    head_chef: bool=Form(None),
    db: Session=Depends(get_db)):

    chef= db.get(Chef, chef_id)
    if not chef:
        raise HTTPException(status_code=404, detail="Chef Not Found")

    if head_chef is True:
        current_heads= db.exec(select(Chef).where(Chef.is_head_chef==True)).all()
        for other_head in current_heads:
            if other_head.id != chef_id:
                other_head.is_head_chef=False
                db.add(other_head)
        chef.is_head_chef=True
    elif head_chef is False:
        chef.is_head_chef= False


    if name is not None:
        chef.name= name
    if specialty is not None:
        chef.specialty= specialty
    if description is not None:
        chef.description= description
    if display_order is not None:
        chef.display_order= display_order
    if status is not None:
        chef.is_active= status

    if image and image.filename:
        save_dir= os.path.join("static", "chefs")
        os.makedirs(save_dir, exist_ok=True)
        file_path= os.path.join(save_dir, image.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        chef.photo_url=f"/static/chefs/{image.filename}"

    db.add(chef)
    db.commit()
    db.refresh(chef)
    return chef

@router.delete("/{chef_id}")
def delete_chef(chef_id: int, db:Session=Depends(get_db)):
    chef= db.get(Chef, chef_id)
    if not chef:
        raise HTTPException(status_code=404, detail="Chef not Fournd")
    db.delete(chef)
    db.commit()
    return {"message":"Chef Deleted"}




