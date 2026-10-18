from pydantic import BaseModel, ConfigDict, Field, field_validator


VALID_STATUSES = {"scheduled", "departed", "arrived", "cancelled", "delayed", "boarding"}


class FlightBase(BaseModel):
    flight_number: str = Field(min_length=1, max_length=20)
    origin: str = Field(min_length=3, max_length=3)
    destination: str = Field(min_length=3, max_length=3)
    status: str = Field(min_length=1, max_length=20)
    scheduled_time: str = Field(min_length=1, max_length=30)
    delay_minutes: int = Field(default=0, ge=0)
    airline: str = Field(min_length=1, max_length=100)

    @field_validator("origin", "destination")
    @classmethod
    def airport_code_uppercase(cls, value: str) -> str:
        return value.strip().upper()

    @field_validator("status")
    @classmethod
    def valid_status(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in VALID_STATUSES:
            raise ValueError(f"status must be one of: {', '.join(sorted(VALID_STATUSES))}")
        return value


class FlightCreate(FlightBase):
    pass


class FlightUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    origin: str | None = Field(default=None, min_length=3, max_length=3)
    destination: str | None = Field(default=None, min_length=3, max_length=3)
    status: str | None = Field(default=None, min_length=1, max_length=20)
    scheduled_time: str | None = Field(default=None, min_length=1, max_length=30)
    delay_minutes: int | None = Field(default=None, ge=0)
    airline: str | None = Field(default=None, min_length=1, max_length=100)

    @field_validator("origin", "destination")
    @classmethod
    def airport_code_uppercase(cls, value: str | None) -> str | None:
        return value.strip().upper() if value is not None else None

    @field_validator("status")
    @classmethod
    def valid_status(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip().lower()
        if value not in VALID_STATUSES:
            raise ValueError(f"status must be one of: {', '.join(sorted(VALID_STATUSES))}")
        return value


class FlightResponse(FlightBase):
    model_config = ConfigDict(from_attributes=True)
