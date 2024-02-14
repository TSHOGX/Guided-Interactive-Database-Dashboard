FROM python:3.11.8-bookworm
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/
RUN python manage.py makemigrations
RUN python manage.py migrate
EXPOSE 8000/tcp
CMD [ "python3", "/app/manage.py", "runserver", "0.0.0.0:8000" ]