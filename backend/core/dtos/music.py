from pydantic import BaseModel, Field


class EnqueueReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")


class EnqueueByTrackIdReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")


class SearchMusicByTitleReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")
    first_music_track_id: str = Field(..., title="一番目の楽曲のトラックID")
    first_music_title: str = Field(..., title="一番目の楽曲のタイトル")
    first_music_artist_name: str = Field(..., title="一番目の楽曲のアーティスト名")
    first_music_image_url: str = Field(..., title="一番目の楽曲の画像のURL")
    second_music_track_id: str = Field(..., title="二番目の楽曲のトラックID")
    second_music_title: str = Field(..., title="二番目の楽曲のタイトル")
    second_music_artist_name: str = Field(..., title="二番目の楽曲のアーティスト名")
    second_music_image_url: str = Field(..., title="二番目の楽曲の画像のURL")
    third_music_track_id: str = Field(..., title="三番目の楽曲のトラックID")
    third_music_title: str = Field(..., title="三番目の楽曲のタイトル")
    third_music_artist_name: str = Field(..., title="三番目の楽曲のアーティスト名")
    third_music_image_url: str = Field(..., title="三番目の楽曲の画像のURL")
    forth_music_track_id: str = Field(..., title="四番目の楽曲のトラックID")
    forth_music_title: str = Field(..., title="四番目の楽曲のタイトル")
    forth_music_artist_name: str = Field(..., title="四番目の楽曲のアーティスト名")
    forth_music_image_url: str = Field(..., title="四番目の楽曲の画像のURL")
    fifth_music_track_id: str = Field(..., title="五番目の楽曲のトラックID")
    fifth_music_title: str = Field(..., title="五番目の楽曲のタイトル")
    fifth_music_artist_name: str = Field(..., title="五番目の楽曲のアーティスト名")
    fifth_music_image_url: str = Field(..., title="五番目の楽曲の画像のURL")


class GetQueueInfoReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")
    current_music_duration: int = Field(..., title="現在の楽曲の残り時間")
    current_music_title: str = Field(..., title="現在の楽曲のタイトル")
    current_music_artist_name: str = Field(..., title="現在の楽曲アーティスト名")
    current_music_image_url: str = Field(..., title="現在の楽曲の画像のURL")
    first_music_title: str | None = Field(None, title="次の楽曲のタイトル")
    first_music_artist_name: str | None = Field(None, title="次の楽曲アーティスト名")
    first_music_image_url: str | None = Field(None, title="次の楽曲の画像のURL")
    second_music_title: str | None = Field(None, title="二番目の楽曲のタイトル")
    second_music_artist_name: str | None = Field(None, title="二番目の楽曲アーティスト名")
    second_music_image_url: str | None = Field(None, title="二番目の楽曲の画像のURL")
    third_music_title: str | None = Field(None, title="三番目の楽曲のタイトル")
    third_music_artist_name: str | None = Field(None, title="三番目の楽曲アーティスト名")
    third_music_image_url: str | None = Field(None, title="三番目の楽曲の画像のURL")


class AdjustVolumeReturnValue(BaseModel):
    error_codes: tuple[int, ...] = Field(..., title="エラーコード")
