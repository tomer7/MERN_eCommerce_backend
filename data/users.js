import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Tzlil Aharon ',
    email: 'tzlil@tzlil.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Avi Pinto',
    email: 'avi@avi.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users
