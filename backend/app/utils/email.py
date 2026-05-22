import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

def send_application_confirmation(to_email: str, first_name: str, job_title: str, tracking_token: str):
    try:
        resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": to_email,
            "subject": f"Application Received — {job_title}",
            "html": f"""
                <h2>Hi {first_name}!</h2>
                <p>We received your application for <strong>{job_title}</strong>.</p>
                <p>Track your application status here:</p>
                <a href="{settings.FRONTEND_URL}/status?token={tracking_token}">
                    Track Application
                </a>
            """
        })
    except Exception:
        pass

def send_status_update(to_email: str, first_name: str, job_title: str, status: str, interview_date=None):
    messages = {
        "screening": "Your application is being reviewed by our team.",
        "interview": f"You've been selected for an interview on {interview_date}." if interview_date else "You've been selected for an interview.",
        "offer": "Congratulations! We'd like to offer you the position.",
        "rejected": "Thank you for your interest. We've decided to move forward with other candidates.",
        "declined": "We've noted that you've declined our offer. Thank you for your time and we wish you all the best.",
    }

    subjects = {
        "screening": f"Application Update — {job_title}",
        "interview": f"Interview Invitation — {job_title}",
        "offer": f"Congratulations! — {job_title}",
        "rejected": f"Application Update — {job_title}",
        "declined": f"Application Update — {job_title}",
    }

    try:
        resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": to_email,
            "subject": subjects.get(status, f"Application Update — {job_title}"),
            "html": f"""
                <h2>Hi {first_name}!</h2>
                <p>{messages.get(status, "Your application status has been updated.")}</p>
            """
        })
    except Exception:
        pass