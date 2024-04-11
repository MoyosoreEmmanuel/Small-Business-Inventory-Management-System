pipeline {
    agent any

    environment {
        // Define your environment variables here
        TRUFFLE_VERSION = 'latest'
        WEB3_VERSION = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                script {
                    try {
                        bat 'echo "Updating instance..."'
                        bat "npm install -g truffle@${env.TRUFFLE_VERSION}"
                        bat "npm install -g web3@${env.WEB3_VERSION}"
                        bat 'echo "Installing HDWallet Provider..."'
                        bat 'npm install @truffle/hdwallet-provider'
                    } catch (Exception e) {
                        error "Failed to install dependencies: ${e.message}"
                    }
                }
            }
        }

        stage('Delay after installing dependencies') {
            steps {
                script {
                    sleep(time: 1, unit: 'MINUTES')
                }
            }
        }

        stage('Compile and migrate contract') {
            steps {
                script {
                    try {
                        bat 'echo "Compiling contract..."'
                        bat 'npx truffle compile'
                        bat 'echo "Migrating contract to Sepolia..."'
                        retry(3) {
                            bat 'npx truffle migrate --network sepolia'
                        }
                        bat 'echo "Copying contract artifact to src..."'
                        bat 'copy build\\contracts\\SmallBusinessInventory.json my-app\\src\\'
                    } catch (Exception e) {
                        error "Failed to compile and migrate contract: ${e.message}"
                    }
                }
            }
        }

        stage('Serve React app') {
            steps {
                dir('my-app') {
                    script {
                        try {
                            bat 'echo "Navigating to React app directory..."'
                            bat 'echo "Installing React app dependencies..."'
                            bat 'npm install'
                        } catch (Exception e) {
                            error "Failed to install React app dependencies: ${e.message}"
                        }
                    }
                }
            }
        }

        stage('Delay after installing React app dependencies') {
            steps {
                script {
                    sleep(time: 1, unit: 'MINUTES')
                }
            }
        }

       stage('Start React app and wait') {
    steps {
        dir('my-app/src') {
            script {
                try {
                    bat 'echo "Starting React app..."'
                    bat 'start /b cmd /c "npm start > output.txt 2>&1"'
                    bat 'echo "Waiting for server to start..."'
                    waitUntil {
                        script {
                            def log = readFile('output.txt').split("\n")
                            def started = log.any { it.contains("Compiled successfully!") }
                            return started
                        }
                    }
                } catch (Exception e) {
                    error "Failed to start React app: ${e.message}"
                }
            }
        }
    }
}
