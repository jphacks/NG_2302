from pydantic import BaseModel, Field


class RegisterReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")
