from pydantic import BaseModel, Field


class EnqueueReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")