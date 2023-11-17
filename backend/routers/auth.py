from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from db.db import get_db
from core.daos.auth import AccountDao
from core.dtos.auth import AuthToken, CreateAccountReturnValue
from core.services.auth import AuthService

router = APIRouter()


class CreateAccountRequest(BaseModel):
    login_id: str = Field(..., title="ログインID")
    login_password: str = Field(..., title="ログインパスワード")


@router.post("/account", name="アカウント作成", response_model=CreateAccountReturnValue)
def create_account(
    request: CreateAccountRequest,
    db: Session = Depends(get_db)
) -> CreateAccountReturnValue:
    # リクエスト情報取得
    login_id = request.login_id
    login_password = request.login_password

    service = AuthService(
        db=db,
        account_dao=AccountDao()
    )
    return_value = service.create_account(
        login_id=login_id, login_password=login_password
    )

    return return_value


@router.post("/token", name="認証トークン作成", response_model=AuthToken)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> AuthToken:
    # リクエスト情報取得
    login_id = form_data.username
    login_password = form_data.password

    service = AuthService(
        account_dao=AccountDao(),
        db=db
    )
    return_value = service.authenticate(
        login_id=login_id, login_password=login_password
    )

    if return_value.auth_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return return_value.auth_token
