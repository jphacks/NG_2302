from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db import get_db
from core.dtos.auth import Account
from core.services.auth import AuthService
from core.daos.auth import AccountDao

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def get_current_account(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Account:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    service = AuthService(
        account_dao=AccountDao(),
        db=db
    )

    try:
        user = service.get_user_from_token(token)
        if user is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    return user


def get_account_id(
    account: Account = Depends(get_current_account)
) -> int:
    return account.account_id
