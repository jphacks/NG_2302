from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from core.features.conversation import Conversation
from core.models.conversation import Conversation as ConversationOrm


class ConversationDao:
    def _build_entity(
        self,
        record: ConversationOrm
    ) -> Conversation:
        return Conversation(
            id=record.id,
            account_id=record.account_id,
            conversation=record.conversation
        )

    def _get_pk_condition(
        self,
        conversation: Conversation
    ) -> dict[str, int | str | None]:
        return {"id": conversation.id}

    def _build_create_args(
        self,
        entity: Conversation
    ) -> dict[str, int | str | None]:
        return {
            "account_id": entity.account_id,
            "conversation": entity.conversation
        }

    def _build_update_args(
        self,
        entity: Conversation
    ) -> dict[str, int | str | None]:
        return {
            "account_id": entity.account_id,
            "conversation": entity.conversation
        }

    def create_conversation_record(
        self,
        db: Session,
        account_id: int,
        conversation_text: str
    ) -> Conversation | None:
        conversation = Conversation(
            id=None,
            account_id=account_id,
            conversation=conversation_text
        )
        create_args = self._build_create_args(conversation)
        record = ConversationOrm(**create_args)
        try:
            db.add(record)
            db.commit()
            db.refresh(record)
        except IntegrityError:
            db.rollback()
            return None
        return self._build_entity(record)
