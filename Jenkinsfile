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
                        bat 'echo "Installing serve..."'
                        bat 'npm install -g serve'
                    } catch (Exception e) {
                        error "Failed to install dependencies: ${e.message}"
                    }
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
                        bat 'npx truffle migrate --network sepolia'
                        bat 'echo "Copying contract artifact to src..."'
                        bat 'copy build\\contracts\\SmallBusinessInventory.json my-app\\src\\'
                    } catch (Exception e) {
                        error "Failed to compile and migrate contract: ${e.message}"
                    }
                }
            }
        }

        stage('Build and serve React app') {
            steps {
                dir('my-app') {
                    script {
                        try {
                            bat 'echo "Navigating to React app directory..."'
                            bat 'echo "Installing React app dependencies..."'
                            bat 'npm install'
                            bat 'echo "Building React app..."'
                            bat 'npm run build'
                            dir('build') {
                                bat 'echo "Serving React app..."'
                                bat 'start cmd /k "serve -s ."'
                            }
                        } catch (Exception e) {
                            error "Failed to build and serve React app: ${e.message}"
                        }
                    }
                }
            }
        }
    }
}
