from fastapi import FastAPI

from app.database import Base, engine
from app.routers import tasks


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskFlow API",
)


@app.get("/")
def read_root():
    return {"message": "TaskFlow API is running"}


app.include_router(tasks.router)