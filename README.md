# synchro

A Full Stack Open project.

By: Arnel Imperial

Student Number: `017729895`

[![Synchro](https://img.shields.io/badge/Live%20Site-https://www.arnelimperial.com-success)](https://www.arnelimperial.com)

---

## ⏱️ Time Entries

Date Started(Backend): 22.1.2023 - 28.2.2023

Date Started(Frontend): 31.1.2023 - 28.2.2023

Links to my contributions to this project are provided, as well as a detailed breakdown of the time I allocate to it. Some of my hours are also spent on this [abandoned repository](https://github.com/aiotrope/synchro-frontend) during the early stages of development. Initially I intended to deploy the backend and frontend separately on different hosting providers, but an issue emerged later on, and I had to integrate the backend and frontend together.

| Date                    | Time (hours)  | Details                                                                |
| ----------------------- | ------------- | ---------------------------------------------------------------------- |
| 22.01.2023              | 5.2           | [Initial](https://app.clockify.me/shared/63e035c668c29410b9f4d693)     |
| 23.01.2023 - 29.01.2023 | 29.8          | [First Week](https://app.clockify.me/shared/63e035e435504317106a58ef)  |
| 30.1.2023 - 05.02.2023  | 57.4          | [Second Week](https://app.clockify.me/shared/63eba186f20fb758f2644190) |
| 06.2.2023 - 12.02.2023  | 58.3          | [Third Week](https://app.clockify.me/shared/63e96492f20fb758f25bf78e)  |
| 13.2.2023 - 19.02.2023  | 66.7          | [Fourth Week](https://app.clockify.me/shared/63f2d435f20fb758f276f8de) |
| 22.2.2023 - 26.02.2023  | 38.95         | [Fifth Week](https://app.clockify.me/shared/63fc065db27db3781596dc7e)  |
| 27.2.2023 - 28.02.2023  | 16.4          | [Finale](https://app.clockify.me/shared/63fe54c21e474432afd7e42f)      |
|                         |               |                                                                        |
| **TOTAL**               | **272 hours** |                                                                        |

## 🧐 How to use the app & about the project

The information in [this link](https://www.arnelimperial.com/guide) may be useful in navigating the site and learning more about the project.

## 🤖 CLI Commands

```bash
# creating python virtual environment
python -m venv venv

# activating python virtual environment
source venv/bin/activate

# install dependencies (backend)
pip install

# creating super user
python manage.py createsuperuser

# creating backend project
django-admin startproject core .

# creating backend local apps
python manage.py startapp <example_app>

# serve backend at localhost:8000
python manage.py runserver

# generating requirements file
pip freeze > requirements.txt

# collect static assets before prod
python manage.py collectstatic

# creating local postgres database
$ psql -U postgres
$ CREATE DATABASE db OWNER user
$ GRANT CONNECT ON DATABASE db TO user;
$ GRANT ALL PRIVILEGES ON DATABASE db TO user;

# install dependencies (frontend)
yarn add

# build frontend prod
yarn run build

# lint and format
yarn run format && yarn run lint:fix

```

## 💫 Deploy

Full stack app hosted in [render.io](https://render.com) @ [https://www.arnelimperial.com](https://www.arnelimperial.com). It should be noted that the site may be slow when making a request.
