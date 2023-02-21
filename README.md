# synchro

Backend api for FSO capstone project.

[![Synchro](https://img.shields.io/badge/Live%20Site-https://www.arnelimperial.com-success)](https://www.arnelimperial.com)

## CLI Commands

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

Full stack app hosted in [render.io](https://render.com) @ [https://www.arnelimperial.com](https://www.arnelimperial.com)

It should be noted that the live site may load slowly since it is currently hosted on a free plan. Be patient if you ever click on a URL link or use the website to submit a request.

## ⏱️ Time Entries

Date Started(Backend): 22.1.2023

Date Started(Frontend): 31.1.2023

Time entries are tracked, summarised (weekly) and aggregated using [Clockify](https://clockify.me). Links are provided for viewing my daily activities, which include a detailed breakdown of the time I allocate to this project.

| Date                    | Time (hours) | Details                                                                |
| ----------------------- | ------------ | ---------------------------------------------------------------------- |
| 22.01.2023              | 5.2          | [Initial](https://app.clockify.me/shared/63e035c668c29410b9f4d693)     |
| 23.01.2023 - 29.01.2023 | 29.8         | [First Week](https://app.clockify.me/shared/63e035e435504317106a58ef)  |
| 30.1.2023 - 05.02.2023  | 57.4         | [Second Week](https://app.clockify.me/shared/63eba186f20fb758f2644190) |
| 06.2.2023 - 12.02.2023  | 58.3         | [Third Week](https://app.clockify.me/shared/63e96492f20fb758f25bf78e)  |
| 13.2.2023 - 19.02.2023  | 66.7         | [Fourth Week](https://app.clockify.me/shared/63f2d435f20fb758f276f8de) |

### Breakdown

#### Initial

[![Initial Work](https://mega.nz/file/XR0jEKLR#XjJ9-kcUu2MkXX-epkzXAhX9-u4xe2_I_C06M1cyN74)](https://app.clockify.me/shared/63e035c668c29410b9f4d693)

#### Week 1

[![First Week](https://mega.nz/file/DJUCRCgC#m2rvAJeWHMDhyd7Vu3rtig8wWP9VY0O3p1Cwgw_4Zf0)](https://app.clockify.me/shared/63e035e435504317106a58ef)

#### Week 2

[![Second Week](https://mega.nz/file/XZdRTbaQ#7RsMv8F-TsmYRadPPnh31cao46m04T5xYlIUnKHtp68)](https://app.clockify.me/shared/63eba186f20fb758f2644190)

#### Week 3

[![Third Week](https://mega.nz/file/WA81ATDb#6EcfRnW8pMzxPKqORI-t_C23bAMxMD7iuF-SEMZ3Ox4)](https://app.clockify.me/shared/63e96492f20fb758f25bf78e)

#### Week 4

[![Fourth Week](https://mega.nz/file/qJFgEAJI#X8T9MaHeiviixfrVY2Ow0Ns0IjcNHP19jryH9blgwEM)](https://app.clockify.me/shared/63f2d435f20fb758f276f8de)
