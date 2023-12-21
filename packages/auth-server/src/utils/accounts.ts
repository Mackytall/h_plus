import { User, UserAttrs, UserRole } from '../models/User';
import bcrypt from 'bcrypt';

export const createAdmin = () => {
  if (process.env.NODE_ENV === 'test') return;
  const yassin: UserAttrs = {
    lastName: 'Boukhabza',
    firstName: 'Yassin',
    email: 'yassine.boukhabza@gmail.com',
    password: process.env.ADMIN_PWD ?? '',
    role: UserRole.admin,
    photo:
      'https://media-exp1.licdn.com/dms/image/C4E03AQFMZrryFdFj-Q/profile-displayphoto-shrink_400_400/0/1653660798725?e=1674691200&v=beta&t=d8ao131o4l5nWNKocmFupYJodX-ikJjHAEJg1scoUUA',
  };
  const imad: UserAttrs = {
    lastName: 'Elmahrad',
    firstName: 'Imad',
    email: 'imad.elmahrad98@gmail.com',
    password: process.env.ADMIN_PWD ?? '',
    role: UserRole.admin,
    photo:
      'https://media-exp1.licdn.com/dms/image/C4E03AQFt6mVKGMQutg/profile-displayphoto-shrink_400_400/0/1658238892755?e=1674691200&v=beta&t=Cyp9GpcV48qlDdqqMvWdUXT2p9_uKq9PnAEx5smWx6o',
  };
  Promise.all(
    [yassin, imad].map((user) => {
      return new Promise((resolve, reject) => {
        User.getByEmail(user.email)
          .then((foundUser) => {
            if (!foundUser) {
              bcrypt
                .hash(user.password, 10)
                .then((hash) => {
                  const newUser = User.add({ ...user, password: hash });
                  newUser.save();
                  resolve('OK');
                })
                .catch((error) => reject(error));
            }
            resolve('KO');
          })
          .catch((error) => reject(error));
      });
    })
  )
    .then((users) => console.log(`${users.filter((elt) => elt === 'OK').length} admin users saved`))
    .catch((error) => console.log('Error while saving admin users: ', error));
};
