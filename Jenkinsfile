pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_IMAGE = 'siddartha83795/testing'
        DOCKER_TAG = 'latest'
        REGISTRY_CREDENTIALS_ID = 'docker-hub-credentials'
        EC2_SSH_KEY_ID = 'ec2-ssh-key'
        EC2_USER = 'ubuntu'
        EC2_IP = '44.192.102.251'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image (NO CACHE)...'
                sh "docker build --no-cache -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Push to Registry') {
            steps {
                echo 'Pushing to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: REGISTRY_CREDENTIALS_ID,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo 'Deploying to EC2...'
                sshagent(credentials: [EC2_SSH_KEY_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                        docker pull ${DOCKER_IMAGE}:${DOCKER_TAG} &&
                        docker stop app || true &&
                        docker rm app || true &&
                        docker run -d --name app -p 80:8080 ${DOCKER_IMAGE}:${DOCKER_TAG}
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "🎉 Frontend deployed successfully!"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
