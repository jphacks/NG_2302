from dataclasses import dataclass


@dataclass(frozen=True)
class Conversation:
    id: int | None
    account_id: int
    conversation: str

    def set_conversation(
        self,
        conversation: str
    ) -> "Conversation":
        return Conversation(
            id=self.id,
            account_id=self.account_id,
            conversation=conversation
        )
