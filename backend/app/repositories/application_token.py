from sqlalchemy.orm import Session
from app.models.application_token import ApplicationToken

class ApplicationTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_token(self, token: str) -> ApplicationToken | None:
        return self.db.query(ApplicationToken).filter(ApplicationToken.token == token).first()

    def create(self, data: dict) -> ApplicationToken:
        token = ApplicationToken(**data)
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token