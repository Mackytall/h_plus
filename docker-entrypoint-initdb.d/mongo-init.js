print('Start creating database ##########################');

db = db.getSiblingDB('mektaba_auth');
db = db.getSiblingDB('mektaba');
// db.createUser(
//     {
//         user: 'api_user',
//         pwd:  'api1234',
//         roles: [{role: 'readWrite', db: 'api_test_db'}],
//     }
// );
print('End creating database ##########################');
