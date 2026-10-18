from sqlalchemy import Column, Integer, String
from app.database import Base

class Flight(Base):
    __tablename__ = "PSA_flight_sta"
    __table_args__ = {"schema": "public"}

    flight_number = Column(String(20), primary_key=True, index=True)
    origin = Column(String(3), nullable=False, index=True)
    destination = Column(String(3), nullable=False, index=True)
    status = Column(String(20), nullable=False, index=True)
    scheduled_time = Column(String(30), nullable=False)
    delay_minutes = Column(Integer, nullable=False, default=0)
    airline = Column(String(100), nullable=False)
