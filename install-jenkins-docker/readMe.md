## Set Up Guide

##### 1. Navigate to the directory containing the Dockerfile

##### 2. Create Bridge Network
`docker network create jenkins`

##### 3. Builds a Docker image using the Dockerfile
`docker build -t nusiss-jenkins .`

##### 4. Starts up all the services
`docker compose up -d`

##### 5. For first time set up, get the initial password
`docker exec -it nusiss-jenkins bash`

Once in the bash terminal
`cat /var/jenkins_home/secrets/initialAdminPassword`