import shutil, os
from typing import Optional
from datetime import datetime
from sqlmodel import Session, select, desc, func
from fastapi import APIRouter, Depends, HTTPException, Form
from database import get_db
from models import Reservation, Booking, MenuItem
from schemas import Create_Reservation, ReservationOut
import json


router = APIRouter()

@router.get("/")
def get_all_reservations(db: Session= Depends(get_db)):
    reservations= db.exec(select(Reservation).order_by(desc(Reservation.id))).all()
    return reservations

@router.get("/bookings/")
def getallBookings(db: Session= Depends(get_db)):
    bookings= db.exec(select(Booking).join(Reservation).where(Reservation.status=="confirm").order_by(desc(Booking.id))).all()
    result=[]
    for booking in bookings:
        result.append({
            "id": booking.id,
            "reservation_id": booking.reservation_id,
            "menu_items": booking.menu_items,
        })
    return result

@router.get("/today_reservations")
def get_confirm_reservations(db: Session= Depends(get_db)):
    today= datetime.now().date()
    reservations= db.exec(select(Reservation).where(Reservation.status=="confirm").filter(Reservation.date==today)).all()
    if not reservations:
        raise HTTPException(status_code=404, detail= "No reservations found")
    return reservations

@router.get("/pending_reservations")
def get_pending_reservations(db: Session= Depends(get_db)):
    today= datetime.now().date()
    pending= db.exec(select(Reservation).where(Reservation.status=="pending").filter(Reservation.date==today)).all()
    if not pending:
        raise HTTPException(status_code=404, detail="No Reservation Pending")
    return pending

@router.get("/monthly_count")
def get_monthly_reservations(year: int=datetime.now().year, db: Session = Depends(get_db)):
    month_expr = func.extract("month", Reservation.date)
    reservation_count = (
        select(
            month_expr.label("month"),
            func.count(Reservation.id).label("total_count")
        )
        .where(func.extract("year", Reservation.date)== year)
        .group_by(month_expr)
        .order_by(month_expr)
    )
    results = db.exec(reservation_count).all()
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return [
        {"month": month_names[int(r[0]) - 1], "total_count": r[1]}
        for r in results
    ]

@router.get("/monthly_income")
def get_monthly_income(year: int= datetime.now().year, db:Session= Depends(get_db)):
    menu_items= db.exec(select(MenuItem)).all()
    price_map= {item.name: item.price for item in menu_items}
    bookings= db.exec(select(Booking).join(Reservation).where(func.extract("year", Reservation.date)== year)).all()
    monthly_total= {m: 0.0 for m in range(1, 13)}
    for booking in bookings:
        month= booking.reservation.date.month
        if booking.menu_items:
            try:
                items=json.loads(booking.menu_items)
                booking_total= 0.0
                for item in items:
                    name= item.get("name")
                    qty= item.get("qty",0)
                    price= price_map.get(name, 0.0)
                    booking_total+= price * qty

                monthly_total[month] += booking_total
            except Exception as e:
                print("Error parsing booking items", 0)
                continue
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    return [
        {"month": month_names[m - 1], "income": monthly_total[m]}
        for m in range(1, 13)
    ]

@router.get("/today_booking_count")
def get_today_reservations_count(db: Session= Depends(get_db)):
    today= datetime.now().date()
    reservations= db.exec(select(Reservation).filter(Reservation.date==today)).all()
    return {"count": len(reservations)}

@router.get("/{id}")
def get_reservation_by_id(id: int, db:Session= Depends(get_db)):
    reservation=db.get(Reservation, id)
    if not reservation:
        raise HTTPException(status_code= 404, detail="Reservation Not Found")
    return reservation



@router.post("/", response_model=ReservationOut)
def create_reservation(data: Create_Reservation, db: Session= Depends(get_db)):
    reservation= Reservation(
        name= data.name,
        email= data.email,
        phone=data.phone,
        date= data.date,
        time= data.time,
        party_size= data.party_size,
        event_type= data.event,
        message= data.message,
        status= "pending",
        created_at=datetime.now()

    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
   

    menu_items= data.menu_items

    booking= Booking(
        reservation_id= reservation.id,
        table_number= reservation.table_number,
        menu_items= data.menu_items,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return reservation




@router.put("/{reservation_id}/status")
def update_reservation_status(
    reservation_id: int,
    table_number: Optional[str]= Form(None),
    status: Optional[str]= Form(None),

    db:Session= Depends(get_db)):
    
    reservation= db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code= 404, detail="Reservation Not Found")
    
    if table_number is not None:
        reservation.table_number= table_number
    if status is not None:
        reservation.status= status

    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.delete("/{reservation_id}")
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation Not Found")
    db.delete(reservation)
    db.commit()
    return {"message": "Reservation deleted"}