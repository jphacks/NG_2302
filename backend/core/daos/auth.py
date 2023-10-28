from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, NoResultFound

from core.features.auth import Account
from core.models.auth import Account as AccountOrm


class AccountDao:
    def _build_entity(
        self,
        record: AccountOrm
    ) -> Account:
        return Account(
            id=record.id,
            login_id=record.login_id,
            login_password_hashed=record.login_password,
            refresh_token=record.refresh_token
        )

    def _get_pk_condition(
        self,
        account: Account
    ) -> dict[str, int | str | None]:
        return {"id": account.id}

    def _build_create_args(
        self,
        entity: Account
    ) -> dict[str, int | str | None]:
        return {
            "login_id": entity.login_id,
            "login_password": entity.login_password_hashed,
            "refresh_token": entity.refresh_token
        }

    def _build_update_args(
        self,
        entity: Account
    ) -> dict[str, int | str | None]:
        return {
            "login_id": entity.login_id,
            "login_password": entity.login_password_hashed,
            "refresh_token": entity.refresh_token
        }

    def create_account_record(
        self,
        db: Session,
        login_id: str,
        login_password_hashed: str
    ) -> Account | None:
        account = Account.default(
            login_id=login_id,
            login_password_hashed=login_password_hashed
        )
        create_args = self._build_create_args(account)
        record = AccountOrm(**create_args)
        try:
            db.add(record)
            db.commit()
            db.refresh(record)
        except IntegrityError:
            db.rollback()
            return None
        return self._build_entity(record)

    def get_account_record_by_login_id(
        self,
        db: Session,
        login_id: str
    ) -> Account | None:
        record: Account | None
        try:
            record = db.query(AccountOrm).filter_by(login_id=login_id).first()
        except NoResultFound:
            return None
        return self._build_entity(record)

    def save_account_record(
            self,
            db: Session,
            account: Account
    ) -> bool:
        try:
            prev = db.query(AccountOrm).filter_by(**self._get_pk_condition(account)).first()
        except NoResultFound:
            return False
        prev.id = account.id
        db.commit()
        return True
