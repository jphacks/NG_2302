import uuid
from dataclasses import dataclass
from datetime import timedelta, datetime
from typing import Literal
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from core.constants import ErrorCode
from core.daos.auth import AccountDao
from core.dtos.auth import (
    Account,
    AuthToken,
    CreateAccountReturnValue,
    AuthenticateReturnValue
)


@dataclass(frozen=True)
class AuthService:
    db: Session
    account_dao: AccountDao
    # openssl rand -hex 32
    _SECRET_KEY = "56b956a24f1d09fa50a8b606392a79edeac1418ce2e89c83bd4704a478b8fdc4"
    _ALGORITHM = "HS256"
    _ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    _REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    _password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def _get_hashed_password(self, plain_password: str) -> str:
        return self._password_context.hash(plain_password)

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self._password_context.verify(plain_password, hashed_password)

    def create_account(self, login_id: str, login_password: str) -> CreateAccountReturnValue:
        account = self.account_dao.create_account_record(
            db=self.db,
            login_id=login_id,
            login_password_hashed=self._get_hashed_password(login_password)
        )

        if account is None:
            return CreateAccountReturnValue(error_codes=(ErrorCode.LOGIN_ID_ALREADY_EXISTS,))
        return CreateAccountReturnValue(error_codes=())

    def _create_token(
        self,
        login_id: str,
        token_type: Literal["access", "refresh"],
        expires_delta: timedelta
    ) -> str:
        reserved_claims = {
            "iss": "car-dj",
            "sub": login_id,
            "iat": datetime.utcnow(),
            "nbf": datetime.utcnow(),
            "jti": str(uuid.uuid4()),
            "exp": datetime.utcnow() + expires_delta
        }
        custom_claims = {"type": token_type}

        encoded_jwt: str = jwt.encode(
            claims={**reserved_claims, **custom_claims},
            key=self._SECRET_KEY,
            algorithm=self._ALGORITHM
        )
        return encoded_jwt

    def create_auth_token(self, login_id: str) -> AuthToken:
        access_token = self._create_token(
            login_id=login_id,
            token_type="access",
            expires_delta=self._ACCESS_TOKEN_EXPIRES
        )
        refresh_token = self._create_token(
            login_id=login_id,
            token_type="refresh",
            expires_delta=self._REFRESH_TOKEN_EXPIRES
        )
        return AuthToken(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    def authenticate(self, login_id: str, login_password: str) -> AuthenticateReturnValue:
        account = self.account_dao.get_account_record_by_login_id(
            db=self.db,
            login_id=login_id
        )

        if account is None:
            return AuthenticateReturnValue(
                error_codes=(ErrorCode.INVALID_LOGIN,), auth_token=None
            )
        if not self._verify_password(login_password, account.login_password_hashed):
            return AuthenticateReturnValue(
                error_codes=(ErrorCode.INVALID_LOGIN,), auth_token=None
            )

        token = self.create_auth_token(account.login_id)
        account = account.set_refresh_token(token.refresh_token)

        if not self.account_dao.save_account_record(
            db=self.db,
            account=account
        ):
            raise Exception("save_account_record failed")

        return AuthenticateReturnValue(error_codes=(), auth_token=token)

    def get_user_from_token(self, token: str) -> Account | None:
        try:
            payload = jwt.decode(token, self._SECRET_KEY, algorithms=[self._ALGORITHM])
            login_id: str = payload.get("sub")
            if login_id is None:
                return None
        except JWTError:
            return None

        account = self.account_dao.get_account_record_by_login_id(
            db=self.db,
            login_id=login_id
        )
        if account is None:
            return None
        if account.id is None:
            raise ValueError("account.id is None")

        user_id = account.user_id if account.user_id is not None else 0

        return Account(
            account_id=account.id,
            user_id=user_id,
            disabled=account.user_id is None
        )
