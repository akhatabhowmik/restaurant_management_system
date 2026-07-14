from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    __tablename__ = "admin_users"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(max_length=100)
    email: str = Field(max_length=100, unique=True)
    phone: str = Field(max_length=10, unique=True)
    hashed_password: str
    role: str= Field(max_length=50, default="user")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


class Banner(SQLModel, table=True):
    __tablename__ = "banners"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: Optional[str] = Field(default=None, max_length=200)
    subtitle: Optional[str] = Field(default=None, max_length=300)
    description: Optional[str] = None
    image_url: Optional[str] = None
    status: bool = True


class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)

    # relationship — Category has many MenuItems
    menu_items: List["MenuItem"] = Relationship(back_populates="category")


class MenuItem(SQLModel, table=True):
    __tablename__ = "menu_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=200)
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_available: bool = True
    is_featured: bool =Field(default=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # foreign key
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id")

    # relationship — MenuItem belongs to Category
    category: Optional[Category] = Relationship(back_populates="menu_items")


class Chef(SQLModel, table=True):
    __tablename__ = "chefs"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    specialty: Optional[str] = Field(default=None, max_length=200)
    description: Optional[str] = None
    photo_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True
    is_head_chef: bool = False


class Reservation(SQLModel, table=True):
    __tablename__ = "reservations"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    email: str= Field(max_length=100)
    phone: str= Field(max_length=10)
    date: date
    time: str = Field(max_length=20)
    party_size: int
    event_type: Optional[str] = None
    message: Optional[str]= None
    status: str = Field(default="pending", max_length=20)
    table_number: Optional[str]= None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    user_id: Optional[int]= Field(default= None, foreign_key= "admin_users.id")
    booking: Optional["Booking"]= Relationship(back_populates="reservation")

class Booking(SQLModel, table=True):
    __tablename__="bookings"

    id: Optional[int] = Field(default=None, primary_key=True)
    reservation_id: Optional[int] = Field(default=None, foreign_key="reservations.id")
    menu_items: Optional[str]= None
    reservation: Optional["Reservation"]= Relationship(back_populates="booking")

class Testimonials(SQLModel, table=True):
    __tablename__ = "testimonials"

    id: Optional[int]= Field(default= None, primary_key= True)
    name: str= Field(max_length= 100)
    designation: Optional[str]= Field(default= None, max_length=200)
    review: Optional[str]= Field(default= None)
    review_date: datetime = Field(default_factory=datetime.utcnow)
    rating: float= Field(default= None)
    image_url: Optional[str]= Field(default=None)
    display_review: bool=Field(default=False)


class ContactMessage(SQLModel, table=True):
    __tablename__ = "contact_messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    email: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=20)
    subject: Optional[str] = Field(default=None, max_length=100)
    message: str
    sent_at: Optional[datetime] = Field(default_factory=datetime.utcnow)