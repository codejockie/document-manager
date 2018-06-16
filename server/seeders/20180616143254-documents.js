const lorem1500s = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Documents', [{
    title: 'Lorem',
    content: lorem1500s,
    author: 'Lorem',
    access: 'public',
    userId: 1,
    roleId: 2,
    createdAt: new Date()
  }, {
    title: 'Lorem Ipsum',
    content: lorem1500s,
    author: 'Lorem Ipsum',
    access: 'public',
    userId: 1,
    roleId: 2,
    createdAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Documents', null, {})
};
