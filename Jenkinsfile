pipeline {
    agent any
    
    // THIS LINE ENABLES GITHUB WEBHOOKS
    triggers {
        githubPush()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'GitHub webhook triggered!'
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'echo "Build started at $(date)"'
            }
        }
        
        stage('Notify') {
            steps {
                echo 'Sending notifications...'
                echo 'Pipeline completed successfully!'
            }
        }
    }
}
