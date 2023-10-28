from fastapi import Depends, HTTPException, Header, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db import get_db
from core.dtos.auth import Account
from core.features.auth import UserContext
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

def get_current_active_account(
    current_user: Account = Depends(get_current_account)
) -> Account:
    # if current_user.disabled:
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Inactive user"
    #     )
    return current_user

def get_user_context(
    account: Account = Depends(get_current_active_account)
) -> UserContext:
    return UserContext(
        account_id=account.account_id,
        user_id=account.user_id
    )
