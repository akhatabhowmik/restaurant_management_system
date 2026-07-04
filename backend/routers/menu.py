import shutil, os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select, desc
from database import get_db
from models import MenuItem, Category

router = APIRouter()

@router.get("/")
def get_menu(db: Session= Depends(get_db)):
    menu= db.exec(select(MenuItem).order_by(desc(MenuItem.id))).all()
    result= []
    for item in menu:
        item_dict= item.dict()
        category= db.get(Category, item.category_id) if item.category_id else None
        if category:
            item_dict["category"]= {"id": category.id, "name": category.name}
        else:
            item_dict["category"]= None
        result.append(item_dict)
        
    return result

@router.get("/availabe_menu/count")
def get_available_menu_items_count(db: Session= Depends(get_db)):
    items= db.exec(select(MenuItem).where(MenuItem.is_available==True)).all()
    return {"count": len(items)}

@router.get("/{menu_id}")
def get_menu_id(menu_id: int, db: Session= Depends(get_db)):
    menu= db.get(MenuItem, menu_id)
    if not menu:
        raise HTTPException(status_code=404, detail="Item Not Found!")
    return menu

@router.post("/")
def create_menu_item(
    name: str= Form(...),
    description: str= Form(None),
    price: float= Form(None),
    category_id: Optional[int]= Form(None),
    is_available: bool= Form(True),
    is_featured: bool= Form(False),
    image: Optional[UploadFile]= File(None),
    db: Session= Depends(get_db)):
    
    image_url=None
    if image and image.filename:
        save_dir= os.path.join("static", "menu_items")
        os.makedirs(save_dir, exist_ok=True)
        save_path=os.path.join(save_dir, image.filename)
        with open(save_path,"wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url= f"/static/menu_items/{image.filename}"
        
    menu_item=MenuItem(
        name=name,
        description=description,
        price=price,
        is_available=is_available,
        is_featured= is_featured,
        image_url=image_url,
        category_id= category_id)
    db.add(menu_item)
    db.commit()
    db.refresh(menu_item)
    return menu_item
        
@router.put("/{menu_id}")
def update_menuitems(
    menu_id: int,
    name: Optional[str]= Form(None),
    description: Optional[str]= Form(None),
    price: Optional[float]= Form(None),
    category_id: Optional[int]= Form(None),
    is_available: Optional[bool]= Form(True),
    is_featured: Optional[bool]= Form(False),
    image: Optional[UploadFile]= File(None),
    db: Session= Depends(get_db)


):
    menu_item= db.get(MenuItem, menu_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Item Not Found!")

    if name is not None:
        menu_item.name= name
    if description is not None:
        menu_item.description= description
    if price is not None:
        menu_item.price= price
    if category_id is not None:
        menu_item.category_id= category_id
    if is_available is not None:
        menu_item.is_available= is_available
    if is_featured is not None:
        menu_item.is_featured= is_featured
    
    if image and image.filename:
        save_dir= os.path.join("static", "menu_items")
        os.makedirs(save_dir, exist_ok=True)
        save_path= os.path.join(save_dir, image.filename)
        with open(save_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        menu_item.image_url= f"/static/menu_items/{image.filename}"

    db.add(menu_item)
    db.commit()
    db.refresh(menu_item)
    return menu_item

@router.delete("/{menu_id}")
def delete_banner(menu_id: int, db: Session= Depends(get_db)):
    menu_item= db.get(MenuItem, menu_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Item Not Found")
    db.delete(menu_item)
    db.commit()
    return{"message": "Item deleted"}

