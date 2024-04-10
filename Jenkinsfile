pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'echo "Updating instance..."'
                bat 'npm install -g truffle'
                bat 'npm install -g web3'
                bat 'echo "Installing HDWallet Provider..."'
                bat 'npm install @truffle/hdwallet-provider'
            }
        }

        stage('Compile and migrate contract') {
            steps {
                bat 'echo "Compiling contract..."'
                bat 'truffle compile'
                bat 'echo "Migrating contract to Sepolia..."'
                bat 'truffle migrate --network sepolia'
                bat 'echo "Copying contract artifact to src..."'
                bat 'copy build\\contracts\\SmallBusinessInventory.json my-app\\src\\'
            }
        }

        stage('Build React app') {
            steps {
                dir('my-app') {
                    bat 'echo "Navigating to React app directory..."'
                    bat 'echo "Installing React app dependencies..."'
                    bat 'npm install'
                    dir('src') {
                        bat 'echo "Building React app..."'
                        bat 'npm run build'
                        bat 'echo "Starting React app..."'
                        bat 'start cmd /k "npm start"'
                    }
                }
            }
        }
    }
}
