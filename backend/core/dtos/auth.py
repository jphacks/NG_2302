from pydantic import BaseModel, Field


class Account(BaseModel):
    account_id: int


class AuthToken(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class CreateAccountReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")


class AuthenticateReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")
    auth_token: AuthToken | None
