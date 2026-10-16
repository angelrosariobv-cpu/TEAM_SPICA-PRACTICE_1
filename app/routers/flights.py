from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.flight_schemas import FlightCreate, FlightResponse, FlightUpdate
from app.models import Flight

router = APIRouter(prefix="/flights", tags=["Flights"])


@router.get("/", response_model=list[FlightResponse])
def list_flights(db: Session = Depends(get_db)):
    return db.query(Flight).order_by(Flight.scheduled_time).all()


@router.get("/{flight_number}", response_model=FlightResponse)
def get_flight(flight_number: str, db: Session = Depends(get_db)):
    flight = db.get(Flight, flight_number)
    if flight is None:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight


@router.post("/", response_model=FlightResponse, status_code=status.HTTP_201_CREATED)
def create_flight(payload: FlightCreate, db: Session = Depends(get_db)):
    if db.get(Flight, payload.flight_number) is not None:
        raise HTTPException(status_code=409, detail="Flight already exists")
    flight = Flight(**payload.model_dump())
    db.add(flight)
    db.commit()
    db.refresh(flight)
    return flight


@router.patch("/{flight_number}", response_model=FlightResponse)
def update_flight(flight_number: str, payload: FlightUpdate, db: Session = Depends(get_db)):
    flight = db.get(Flight, flight_number)
    if flight is None:
        raise HTTPException(status_code=404, detail="Flight not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(flight, field, value.upper() if field in {"origin", "destination"} else value)
    db.commit()
    db.refresh(flight)
    return flight


@router.delete("/{flight_number}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flight(flight_number: str, db: Session = Depends(get_db)):
    flight = db.get(Flight, flight_number)
    if flight is None:
        raise HTTPException(status_code=404, detail="Flight not found")
    db.delete(flight)
    db.commit()
