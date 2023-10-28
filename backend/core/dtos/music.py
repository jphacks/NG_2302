from pydantic import BaseModel, Field


class EnqueueReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")


class GetMusicInfoReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")
    title: str | None = Field(None, title="楽曲のタイトル")
    artist_name: str | None = Field(None, title="アーティスト名")
    image_url: str | None = Field(None, title="楽曲の画像のURL")


class AdjustVolumeReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")
