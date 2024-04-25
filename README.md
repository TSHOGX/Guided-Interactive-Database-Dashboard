# Guided Interactive Database Dashboard

Frontend : React + Vite
- Visualization: `finos/perspective`
- SQL Editor: `react-ace`

Backend : Django + DuckDB


Run in Local
```
cd django
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000

cd vite
yarn
yarn dev
```


Set Docker for Backend
```
cd django
python manage.py makemigrations
python manage.py migrate
docker-compose up -d
```
