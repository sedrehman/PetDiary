FROM ubuntu:19.10
RUN apt-get update
# Set the home directory to /root
ENV HOME /root
# cd into the home directory
WORKDIR /root
# Install Node
RUN apt-get update --fix-missing
RUN apt-get install -y nodejs
RUN apt-get install -y npm
# Copy all app files into the image
COPY . .
# Download dependancies
RUN npm install
# Allow port 8000 to be accessed
# from outside the container
EXPOSE 8000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait 
RUN chmod +x /wait
# Run the app
CMD /wait && node pet_diary.js