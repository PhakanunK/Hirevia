FROM python:3.11

WORKDIR /backend

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["sh", "-c", "python -m scripts.seed_admin && uvicorn app.main:app --host 0.0.0.0 --port 8000"]