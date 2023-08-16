FROM python:3.11.0-bullseye
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY backend /app/backend
CMD ["python", "-m", "backend.integrations.cs_http"]
EXPOSE 8100