from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import create_db, engine
import models
from models import Category
from sqlmodel import Session, select
from routers import dashboard, menu, banners, chefs, reservations, categories, testimonials, auth

from fastapi.staticfiles import StaticFiles



@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    
    # Seed default categories if database is empty
    with Session(engine) as session:
        existing = session.exec(select(Category)).all()
        if not existing:
            default_categories = ["Starter", "Main Course", "Desserts", "Drinks"]
            for name in default_categories:
                session.add(Category(name=name))
            session.commit()
    yield



app = FastAPI(
    title="Restaurant Admin API",
    description="Backend API for the restaurant admin panel",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the admin frontend (served as plain HTML files or a dev server) to call
# the API.  Adjust origins in production to your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,    prefix="/auth",    tags=["Auth"])
app.include_router(dashboard.router,    prefix="/dashboard",    tags=["Dashboard"])
app.include_router(menu.router,         prefix="/menu",         tags=["Menu"])
app.include_router(banners.router,      prefix="/banners",      tags=["Banners"])
app.include_router(chefs.router,        prefix="/chefs",        tags=["Chefs"])
app.include_router(reservations.router, prefix="/reservations", tags=["Reservations"])
app.include_router(testimonials.router, prefix="/testimonials", tags=["Testimonials"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])



@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Restaurant API is running"}

