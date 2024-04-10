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
                sh 'echo "Updating instance..."'
                sh 'apt-get update -y'
                sh 'echo "Installing global dependencies..."'
                sh 'npm install -g truffle web3'
                sh 'echo "Installing HDWallet Provider..."'
                sh 'npm install @truffle/hdwallet-provider'
            }
        }

        stage('Compile and migrate contract') {
            steps {
                sh 'echo "Compiling contract..."'
                sh 'truffle compile'
                sh 'echo "Migrating contract to Sepolia..."'
                sh 'truffle migrate --network sepolia'
                sh 'echo "Copying contract artifact to src..."'
                sh 'cp build/contracts/SmallBusinessInventory.json my-app/src/'
            }
        }

        stage('Build React app') {
            steps {
                dir('my-app') {
                    sh 'echo "Navigating to React app directory..."'
                    sh 'echo "Installing React app dependencies..."'
                    sh 'npm install'
                    dir('src') {
                        sh 'echo "Building React app..."'
                        sh 'npm run build'
                        sh 'echo "Starting React app..."'
                        sh 'nohup npm start &'
                    }
                }
            }
        }
    }
}
