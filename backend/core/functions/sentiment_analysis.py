from dataclasses import dataclass
from google.cloud import language_v1
from google.oauth2 import service_account


@dataclass(frozen=False)
class SentimentAnalysis:
    credentials_path: str

    def __post_init__(self):
        credentials = service_account.Credentials.from_service_account_file(self.credentials_path)
        self.client = language_v1.LanguageServiceClient(credentials=credentials)

    def analyze(self, text: str) -> tuple[float, float]:
        document = language_v1.Document(
            content=text, type_=language_v1.Document.Type.PLAIN_TEXT, language="ja"
        )

        sentiment = self.client.analyze_sentiment(request={'document': document}).document_sentiment
        return sentiment.score, sentiment.magnitude
