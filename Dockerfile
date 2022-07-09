FROM python:3-slim

WORKDIR /usr/src/app
COPY ./app .
RUN python -m pip install -r requirements.txt

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
