# Guided Interactive Database Dashboard

Frontend : React + Vite
- Visualization: `finos/perspective`
- SQL Editor: `react-ace`

Backend : Django + DuckDB

Docker for Backend
```
cd django
python manage.py makemigrations
python manage.py migrate
docker-compose up -d
```
