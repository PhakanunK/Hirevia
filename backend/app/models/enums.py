import enum

class UserStatus(enum.Enum):
    active = "active"
    suspended = "suspended"

class JobType(enum.Enum):
    full_time = "full_time"
    internship = "internship"
    contract = "contract"

class JobStatus(enum.Enum):
    open = "open"
    closed = "closed"
    draft = "draft"

class ApplicationStatus(enum.Enum):
    applied = "applied"
    screening = "screening"
    interview = "interview"
    offer = "offer"
    rejected = "rejected"