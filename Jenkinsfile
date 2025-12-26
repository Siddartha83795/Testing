pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                // Use 'npm.cmd' on Windows, 'npm' on Linux/Mac
                // Assuming the Jenkins agent might be on Linux, but if it's Windows user local env...
                // Standard practice is usually 'npm', but since I saw the user is on Windows and had issues,
                // I will add a script block to handle both or just stick to standard 'npm' 
                // and let the environment handle the path or alias.
                // However, given the user's previous error "npm : ... cannot be loaded", 
                // in a real CI environment (Jenkin on Linux or properly configured Windows), 'npm' should work.
                // I'll stick to 'npm' for a standard Jenkinsfile, unless I have reason to believe the Jenkins AGENT is literally this broken Windows machine.
                // But usually Jenkins agents are Linux. I'll stick to 'sh' for Linux compatibility which is most common.
                // Wait, if the user runs Jenkins LOCALLY on Windows, 'sh' won't work without Git Bash.
                // I'll use 'bat' for Windows or 'sh' for Linux.
                // To be safe for mixed environments or uncertain OS, I can try to detect or just use 'sh' if I assume standard CI.
                // The user said "add jenkins file", implying a CI server.
                // Let's assume standard behavior but I'll use 'bat' because the user is on Windows?
                // No, usually Jenkinsfiles are platform agnostic or specific.
                // I will use `bat` since the user is explicitly on Windows and running local commands. 
                // If it was a linux server, they would usually specify.
                // Actually, best practice is:
                                
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Lint') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run lint'
                    } else {
                        bat 'npm run lint'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }
    }
}
