// Initialize database

const adminUser = {
    username: 'mixaura@gmail.com',
    password: 'mix.aura.712'
};

function initializeDatabase() {
    // Code to add admin user to the database
    addUserToDatabase(adminUser);
}

function addUserToDatabase(user) {
    // Your logic to add user to the database
    console.log(`Adding user: ${user.username}`);
    // e.g., db.insert(user);
}

initializeDatabase();