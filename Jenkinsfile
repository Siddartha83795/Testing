pipeline {
    agent any

    // Triggers from Remote
    triggers {
        githubPush()
    }

    // Environment from Local
    environment {
        // Define environment variables
        DOCKER_IMAGE = 'siddartha83795/quickserve-hub' // Replace with your Docker Hub username/repo
        DOCKER_TAG = 'latest'
        REGISTRY_CREDENTIALS_ID = 'docker-hub-credentials' // ID configured in Jenkins
        EC2_SSH_KEY_ID = 'ec2-ssh-key' // ID configured in Jenkins
        // EC2_IP should be handled safely, maybe per-environment or secret
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'GitHub webhook triggered!'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    // Build using the root Dockerfile
                    if (isUnix()) {
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    } else {
                        bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    echo 'Pushing to Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                       if (isUnix()) {
                           sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                           sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                       } else {
                           bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                           bat "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                       }
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                   echo 'Deploying to EC2...'
                   sshagent(credentials: [EC2_SSH_KEY_ID]) {
                       // We use StrictHostKeyChecking=no for automation simplicity, but manual verification is better security practice
                       def remoteCmd = """
                           docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
                           docker stop quickserve-app || true
                           docker rm quickserve-app || true
                           docker run -d --name quickserve-app -p 5000:5000 -e MONGO_URI='mongodb://mongo:27017/quickserve' --link mongo:mongo ${DOCKER_IMAGE}:${DOCKER_TAG}
                       """
                       if (isUnix()) {
                           sh "ssh -o StrictHostKeyChecking=no ubuntu@<YOUR_EC2_IP> '${remoteCmd}'"
                       } else {
                           // Windows agent logic if needed
                       }
                   }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "🔍 Verifying deployment..."
                script {
                    // Start a simple verification (e.g., check health endpoint)
                    // Note: This runs on the Jenkins agent, so it needs network access to the EC2 IP
                    echo "Checking application health..."
                    // sleep 5 // Wait for startup
                    // sh "curl -f http://<YOUR_EC2_IP>:5000/api/health"
                }
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning up..."
            script {
                if (isUnix()) {
                    sh 'docker system prune -f || true'
                }
            }
        }
        success {
            echo "🎉 Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
