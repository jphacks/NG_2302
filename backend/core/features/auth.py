from dataclasses import dataclass


@dataclass(frozen=True)
class Account:
    id: int | None
    login_id: str
    login_password_hashed: str
    refresh_token: str | None
    user_id: int | None

    @staticmethod
    def default(login_id: str, login_password_hashed: str) -> "Account":
        return Account(
            id=None,
            login_id=login_id,
            login_password_hashed=login_password_hashed,
            refresh_token=None,
            user_id=None
        )

    def set_refresh_token(self, refresh_token: str) -> "Account":
        return Account(
            id=self.id,
            login_id=self.login_id,
            login_password_hashed=self.login_password_hashed,
            refresh_token=refresh_token,
            user_id=self.user_id
        )
