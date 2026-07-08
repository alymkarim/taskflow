from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    note = Column(String, nullable=True)
    completed = Column(Boolean, default=False)


    completed = Column(Boolean, default)

#look into potential feautures like priority or tags