from pydantic import BaseModel,field_validator
from datetime import date
from typing import Optional
from fastapi import UploadFile, File

class Create_Reservation(BaseModel):
    name: str
    email:str
    phone:str
    date: date
    time: str
    party_size: int
    event: Optional[str]= None
    message: Optional[str]= None
    menu_items: Optional[str]= None

    @field_validator("date")
    @classmethod
    def date_validator(cls, v):
        if v < date.today():
            raise ValueError("Reservation date cannot be in the past")
        return v

class UpdateReservationTable(BaseModel):
    table_number: str = None
    status: str = None

class ReservationOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    date: date
    time: str
    party_size: int
    event_type: Optional[str] = None
    message: Optional[str] = None
    status: str
    table_number: Optional[int] = None

    model_config = {"from_attributes": True}

